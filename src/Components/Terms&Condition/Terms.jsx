import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Info,
  Shield,
  CreditCard,
  Loader,
  Clock,
  Zap
} from "lucide-react";

const TermsMain = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [amountWithTax, setAmountWithTax] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      const parsedData = JSON.parse(data);
      setBookingData(parsedData);
      setAmountWithTax(parsedData.totalAmount);
    } else {
      navigate("/");
    }

    setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [navigate]);

  // OPTIMIZED: Immediate payment verification
  const verifyPaymentImmediately = async (paymentResponse) => {
    const startTime = Date.now();
    setVerificationStatus("verifying");
    
    try {
      console.log("🚀 Starting immediate payment verification...");
      
      const response = await fetch('http://localhost:3000/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const result = await response.json();
      const processingTime = Date.now() - startTime;
      
      console.log(`⚡ Verification completed in ${processingTime}ms`);
      console.log("📊 Result:", result);

      if (result.status === 'success') {
        setVerificationStatus("success");
        
        // Store completed booking data immediately
        const completedBooking = {
          ...bookingData,
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          advancePaid: 1,
          remainingAmount: bookingData.totalAmount - 1,
          paymentStatus: 'advance_paid',
          bookingConfirmed: true,
          dataStored: result.dataStored,
          processingTime: result.processingTime,
          verificationTime: `${processingTime}ms`
        };

        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        
        // Show success notification with processing time
        addNotification("success", 
          `Payment verified in ${result.processingTime}! Booking confirmed and data saved.`
        );
        
        // Navigate to success page immediately
        setTimeout(() => {
          navigate('/thank-you');
        }, 1500);
        
      } else {
        setVerificationStatus("failed");
        addNotification("error", result.message || "Payment verification failed");
        setIsProcessingPayment(false);
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ Verification failed after ${processingTime}ms:`, error);
      setVerificationStatus("failed");
      addNotification("error", "Payment verification failed. Please contact support.");
      setIsProcessingPayment(false);
    }
  };

  const termsItems = [
    "There will be no reduction in price if lesser members arrive",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of ₹10 to book the slot. The remaining amount will be collected Before The Event.",
    "Customers will be liable to pay in case of any damage to the theater caused by them. Cleaning fees up to Rs 500 will be charged in cases where significant cleaning would be required after check out.",
  ];

  const refundPolicy = [
    "Refund Policy: If Slot Is Cancelled Advance Amount Non-Refundable. Then You Get The Chance To Reschedule Your Slot.",
  ];

  const initializePayment = async () => {
    if (!isChecked) {
      addNotification("error", "Please accept the terms and conditions");
      return;
    }

    if (!bookingData) {
      addNotification("error", "Booking data not found");
      return;
    }

    setIsProcessingPayment(true);
    setVerificationStatus(null);

    try {
      console.log("Creating order for payment...");
      
      // Create order on backend
      const response = await fetch('http://localhost:3000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1, // Advance amount ₹10
          bookingData: bookingData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      setCurrentOrderId(order.id);
      
      console.log("Order created:", order.id);

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_live_7I7nJJIaq1bIol', // Replace with your Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Mini Theater Booking',
        description: 'Advance Payment for Theater Booking',
        order_id: order.id,
        handler: async function (response) {
          console.log("💳 Payment completed:", response);
          
          // IMMEDIATE VERIFICATION - No polling needed!
          await verifyPaymentImmediately(response);
        },
        prefill: {
          name: bookingData.bookingName || bookingData.NameUser,
          email: bookingData.email,
          contact: bookingData.whatsapp
        },
        theme: {
          color: '#9333ea'
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            setIsProcessingPayment(false);
            setVerificationStatus(null);
            addNotification("warning", "Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      addNotification("error", "Failed to initialize payment. Please try again.");
      setIsProcessingPayment(false);
      setVerificationStatus(null);
    }
  };

  const handleNewBooking = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("completedBookingData");
    navigate("/");
  };

  const NotificationToast = ({ notification, onClose }) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-600" />,
      error: <XCircle className="w-5 h-5 text-red-600" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      info: <Info className="w-5 h-5 text-blue-600" />,
    };

    const colors = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg transition-all duration-300 max-w-sm ${colors[notification.type]}`}>
        <div className="flex items-start space-x-2">
          {icons[notification.type]}
          <span className="font-medium text-sm">{notification.message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pt-16 pb-16 px-4 sm:px-6 md:px-8">
      {/* Notifications */}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        />
      ))}

      <div className="max-w-4xl mx-auto pt-8">
        <div
          className={`transition-all duration-700 transform ${
            animateIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 py-6 px-8">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8 text-white" />
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                  Terms & Conditions
                </h1>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div
                className={`space-y-6 transition-all duration-700 delay-300 ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h2 className="text-2xl font-bold mb-6 text-purple-800 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-purple-600" />
                    Important Terms
                  </h2>
                  <ol className="list-decimal pl-6 space-y-4">
                    {termsItems.map((item, index) => (
                      <li
                        key={index}
                        className="text-gray-700 leading-relaxed py-2 border-b border-purple-100 last:border-0 transition-all duration-300"
                        style={{
                          transitionDelay: `${300 + index * 100}ms`,
                          opacity: animateIn ? 1 : 0,
                          transform: animateIn
                            ? "translateX(0)"
                            : "translateX(-20px)",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Refund Policy */}
                <div
                  className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100"
                  style={{
                    transitionDelay: "1000ms",
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <h2 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-red-600" />
                    Refund Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{refundPolicy[0]}</p>
                </div>

                {/* Checkbox */}
                <div
                  className="mt-8"
                  style={{
                    transitionDelay: "1200ms",
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <label className="flex items-center space-x-4 p-4 border-2 border-purple-200 rounded-2xl hover:bg-purple-50 transition-all duration-300 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-md border-2 transition-all duration-300 ${
                        isChecked 
                          ? 'bg-purple-600 border-purple-600' 
                          : 'border-gray-300 group-hover:border-purple-400'
                      }`}>
                        {isChecked && (
                          <CheckCircle className="w-4 h-4 text-white absolute top-0.5 left-0.5" />
                        )}
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium text-lg">
                      I have read and agree to the terms and conditions
                    </span>
                  </label>
                </div>

                {/* Booking Summary */}
                {bookingData && (
                  <div
                    className="mt-8"
                    style={{
                      transitionDelay: "1400ms",
                      opacity: animateIn ? 1 : 0,
                      transform: animateIn ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 p-6 rounded-2xl shadow-inner mb-6 border border-purple-100">
                      <h3 className="font-bold text-2xl mb-6 text-purple-800 flex items-center">
                        <Info className="w-6 h-6 mr-3 text-purple-600" />
                        Booking Summary
                      </h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-purple-100">
                          <span className="text-gray-800 font-medium text-lg">
                            Total Amount:
                          </span>
                          <span className="text-2xl font-bold text-purple-600">
                            ₹{amountWithTax.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-purple-100">
                          <span className="text-gray-800 font-medium text-lg">
                            Advance Payment:
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ₹10.00
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-800 font-medium text-lg">
                            Remaining Amount:
                          </span>
                          <span className="text-xl font-bold text-orange-600">
                            ₹{(amountWithTax - 10).toFixed(2)}
                          </span>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            Instant Payment Verification:
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Lightning-fast verification within 0.5 seconds</li>
                            <li>• Immediate booking confirmation</li>
                            <li>• Instant data storage in Firebase & Google Sheets</li>
                            <li>• No waiting or manual processing required</li>
                            <li>• Secure payment powered by Razorpay</li>
                          </ul>
                        </div>

                        {/* Verification Status */}
                        {verificationStatus && (
                          <div className={`p-4 rounded-xl border ${
                            verificationStatus === "verifying" 
                              ? "bg-blue-50 border-blue-200"
                              : verificationStatus === "success"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}>
                            <div className="flex items-center space-x-2">
                              {verificationStatus === "verifying" && (
                                <>
                                  <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                                  <span className="text-blue-800 font-medium">
                                    ⚡ Verifying payment instantly...
                                  </span>
                                </>
                              )}
                              {verificationStatus === "success" && (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-green-800 font-medium">
                                    ✅ Payment verified! Booking confirmed and data saved.
                                  </span>
                                </>
                              )}
                              {verificationStatus === "failed" && (
                                <>
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="text-red-800 font-medium">
                                    ❌ Verification failed. Please try again.
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={initializePayment}
                      disabled={!isChecked || isProcessingPayment}
                      className={`w-full rounded-2xl py-6 font-bold text-xl transition-all duration-300 transform ${
                        isChecked && !isProcessingPayment
                          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-3">
                        {isProcessingPayment ? (
                          <>
                            <Loader className="w-6 h-6 animate-spin" />
                            <span>
                              {verificationStatus === "verifying" 
                                ? "⚡ Verifying Payment..." 
                                : "Processing Payment..."
                              }
                            </span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-6 h-6" />
                            <Zap className="w-5 h-5" />
                            <span>Pay ₹10 & Get Instant Confirmation</span>
                          </>
                        )}
                      </span>
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      ⚡ Instant verification • Secure Razorpay payment • Data saved automatically
                    </p>
                  </div>
                )}

                {/* New Booking Button */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <button
                    onClick={handleNewBooking}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold"
                  >
                    Start New Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsMain;