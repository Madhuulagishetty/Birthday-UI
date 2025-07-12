import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  CreditCard,
  Info,
  Shield,
  Download,
  Phone,
  MessageCircle
} from "lucide-react";

const TermsMain = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const payButtonRef = useRef(null);
  const [amountWithTax, setAmountWithTax] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [baseAdvanceAmount] = useState(10);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [razorpayInitialized, setRazorpayInitialized] = useState(false);
  const [convenienceFee] = useState(2);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [orderId, setOrderId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  // Production backend URL
  const BACKEND_URL = "https://birthday-backend-tau.vercel.app";

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

      const baseAmount = parsedData.totalAmount;
      setAmountWithTax(baseAmount);

      const advanceWithFee = baseAdvanceAmount + convenienceFee;
      setAdvanceAmount(advanceWithFee);

      setRemainingAmount(baseAmount - baseAdvanceAmount);
    } else {
      navigate("/");
    }

    setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    initializeRazorpay().then((success) => {
      setRazorpayInitialized(success);
    });

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [navigate, baseAdvanceAmount, convenienceFee]);

  const termsItems = [
    "There will be no reduction in price if lesser members arrive",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of ₹1000 to book the slot. The remaining amount will be collected Before The Event.",
    "Customers will be liable to pay in case of any damage to the theater caused by them. Cleaning fees up to Rs 500 will be charged in cases where significant cleaning would be required after check out.",
  ];

  const refundPolicy = [
    "Refund Policy: If Slot Is Cancelled Advance Amount Non-Refundable. Then You Get The Chance To Reschedule Your Slot.",
  ];

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: advanceAmount,
          bookingData: bookingData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      setOrderId(order.id);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/check-payment-status/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return { status: "pending" };
    }
  };

  const startPolling = (orderId) => {
    let pollCount = 0;
    const maxPolls = 150;
    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      addNotification("info", "💳 Payment processing... Please return to this page after completing payment in your payment app.");
    }

    const interval = setInterval(async () => {
      pollCount++;
      const result = await checkPaymentStatus(orderId);

      if (result.status === "success") {
        clearInterval(interval);
        setPollingInterval(null);
        setPaymentStatus("success");
        setCompletedBooking(result.bookingData);

        localStorage.setItem(
          "completedBookingData",
          JSON.stringify(result.bookingData)
        );
        sessionStorage.setItem("paymentCompleted", "true");

        addNotification("success", "🎉 Payment successful! Booking confirmed and saved automatically. Check your WhatsApp for details.");
        
        setIsProcessing(false);
      } else if (result.status === "failed") {
        clearInterval(interval);
        setPollingInterval(null);
        setPaymentStatus("failed");
        setIsProcessing(false);
        addNotification("error", "Payment failed. Please try again.");
      } else if (pollCount >= maxPolls) {
        clearInterval(interval);
        setPollingInterval(null);
        setIsProcessing(false);
        addNotification("warning", "Payment verification timeout. If payment was deducted, it will be processed automatically.");
      }
    }, 2000);

    setPollingInterval(interval);
  };

  const [preCreatedOrder, setPreCreatedOrder] = useState(null);
  
  useEffect(() => {
    if (razorpayInitialized && bookingData && !preCreatedOrder) {
      createOrder()
        .then((order) => {
          setPreCreatedOrder(order);
        })
        .catch((err) => {
          console.error("Failed to pre-create order:", err);
        });
    }
  }, [razorpayInitialized, bookingData, preCreatedOrder]);

  const handlePayment = async () => {
    if (!isChecked) {
      addNotification("error", "Please accept the terms and conditions");
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentStatus("pending");

      if (!razorpayInitialized) {
        const res = await initializeRazorpay();
        if (!res) {
          addNotification("error", "Razorpay SDK failed to load");
          setIsProcessing(false);
          return;
        }
      }

      const order = preCreatedOrder || (await createOrder());
      startPolling(order.id);

      // Get current domain for callback URL
      const currentDomain = window.location.origin;
      const callbackUrl = `${currentDomain}/payment-callback`;

      setTimeout(() => {
        const options = {
          key: "rzp_live_7I7nJJIaq1bIol",
          amount: advanceAmount * 100,
          currency: "INR",
          name: "Birthday Booking",
          description: "Advance Payment for Booking",
          order_id: order.id,

          handler: async function (response) {
            console.log("Payment response received:", response);
            setPaymentId(response.razorpay_payment_id);
            
            // Mark payment as completed immediately
            sessionStorage.setItem('paymentCompleted', 'true');
            sessionStorage.setItem('paymentId', response.razorpay_payment_id);
            sessionStorage.setItem('orderId', response.razorpay_order_id);
            
            addNotification("info", "Payment successful! Verifying booking...");

            try {
              const verifyResponse = await fetch(
                `${BACKEND_URL}/verify-payment`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingData: bookingData,
                    advanceAmount: advanceAmount,
                    remainingAmount: remainingAmount,
                    amountWithTax: amountWithTax,
                  }),
                }
              );

              if (verifyResponse.ok) {
                const result = await verifyResponse.json();
                if (result.status === "success") {
                  if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                  }

                  setPaymentStatus("success");
                  setCompletedBooking(result.savedBooking);
                  setPaymentId(response.razorpay_payment_id);

                  localStorage.setItem(
                    "completedBookingData",
                    JSON.stringify(result.savedBooking)
                  );

                  addNotification("success", "🎉 Booking confirmed! Data saved to Firebase and Google Sheets. Check your WhatsApp for details.");
                  
                  setIsProcessing(false);
                  
                  // Redirect to thank you page
                  setTimeout(() => {
                    navigate(`/thank-you?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`, { replace: true });
                  }, 2000);
                }
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              addNotification("error", "Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          },

          prefill: {
            contact: bookingData?.whatsapp || "",
            email: bookingData?.email || "",
          },

          theme: {
            color: "#5D0072",
          },

          // Enhanced mobile support
          modal: {
            ondismiss: function () {
              if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
              }
              setIsProcessing(false);
              setPaymentStatus("pending");
            },
            escape: true,
            backdropclose: false,
          },

          // Add callback URL for mobile payments
          callback_url: callbackUrl,
          redirect: true,

          retry: {
            enabled: true,
            max_count: 3,
          },

          // Mobile payment options
          config: {
            display: {
              blocks: {
                banks: {
                  name: "Pay using Bank Account",
                  instruments: [
                    {
                      method: "netbanking"
                    },
                    {
                      method: "upi"
                    }
                  ]
                }
              },
              sequence: ["block.banks"],
              preferences: {
                show_default_blocks: true
              }
            }
          }
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.on("payment.failed", function (response) {
          console.log("Payment failed:", response);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          setIsProcessing(false);
          setPaymentStatus("failed");
          addNotification("error", "Payment failed. Please try again.");
        });

        paymentObject.open();
      }, 300);
    } catch (error) {
      console.error("Error initiating payment:", error);
      addNotification("error", "Your Internet Connection is Slow. Please try again.");
      setIsProcessing(false);
      setPaymentStatus("pending");
    }
  };

  const handleNewBooking = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("completedBookingData");
    sessionStorage.removeItem("paymentCompleted");
    sessionStorage.removeItem("paymentId");
    sessionStorage.removeItem("orderId");
    setPaymentStatus("pending");
    setCompletedBooking(null);
    setPaymentId(null);
    setIsProcessing(false);
    navigate("/");
  };

  const downloadBookingDetails = () => {
    if (!completedBooking) return;

    const bookingDetails = `
BOOKING CONFIRMATION
====================

Booking ID: ${completedBooking.id || 'N/A'}
Payment ID: ${paymentId || 'N/A'}

Customer Details:
- Name: ${completedBooking.bookingName || completedBooking.NameUser || 'N/A'}
- Email: ${completedBooking.email || 'N/A'}
- WhatsApp: ${completedBooking.whatsapp || 'N/A'}
- Address: ${completedBooking.address || 'N/A'}

Booking Details:
- Date: ${completedBooking.date || 'N/A'}
- Time: ${completedBooking.lastItem ? `${completedBooking.lastItem.start} - ${completedBooking.lastItem.end}` : 'N/A'}
- Number of People: ${completedBooking.people || 'N/A'}
- Slot Type: ${completedBooking.slotType || 'N/A'}
- Occasion: ${completedBooking.occasion || 'N/A'}
- Decorations: ${completedBooking.wantDecoration ? 'Yes' : 'No'}

Payment Details:
- Total Amount: ₹${amountWithTax.toFixed(2)}
- Advance Paid: ₹${advanceAmount.toFixed(2)}
- Remaining Amount: ₹${remainingAmount.toFixed(2)}
- Payment Status: Advance Paid

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([bookingDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${paymentId || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isChecked && payButtonRef.current) {
      payButtonRef.current.classList.add("animate-pulse");
    } else if (payButtonRef.current) {
      payButtonRef.current.classList.remove("animate-pulse");
    }
  }, [isChecked]);

  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  const getPaymentStatusMessage = () => {
    switch (paymentStatus) {
      case "pending":
        return isProcessing ? "Processing payment..." : "";
      case "success":
        return "Payment successful! Booking confirmed.";
      case "failed":
        return "Payment failed. Please try again.";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return isProcessing ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : null;
    }
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
      <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg transition-all duration-300 ${colors[notification.type]}`}>
        <div className="flex items-center space-x-2">
          {icons[notification.type]}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
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
                  {paymentStatus === "success" ? "Booking Confirmed!" : "Terms & Conditions"}
                </h1>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Success State */}
              {paymentStatus === "success" && completedBooking && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600">Your booking has been confirmed and saved to our system.</p>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="font-bold text-xl mb-4 text-green-800 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                      Booking Confirmation
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Booking ID:</strong> {completedBooking.id || 'Processing...'}</p>
                        <p><strong>Payment ID:</strong> {paymentId || 'Processing...'}</p>
                        <p><strong>Name:</strong> {completedBooking.bookingName || completedBooking.NameUser}</p>
                        <p><strong>Date:</strong> {completedBooking.date}</p>
                        <p><strong>Time:</strong> {completedBooking.lastItem ? `${completedBooking.lastItem.start} - ${completedBooking.lastItem.end}` : 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>People:</strong> {completedBooking.people}</p>
                        <p><strong>WhatsApp:</strong> {completedBooking.whatsapp}</p>
                        <p><strong>Advance Paid:</strong> ₹{advanceAmount.toFixed(2)}</p>
                        <p><strong>Remaining:</strong> ₹{remainingAmount.toFixed(2)}</p>
                        <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Confirmed</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={downloadBookingDetails}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Details</span>
                    </button>
                    
                    <a
                      href={`tel:+919764535650`}
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Support</span>
                    </a>
                    
                    <a
                      href={`https://wa.me/919764535650`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* New Booking Button */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <button
                      onClick={handleNewBooking}
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold"
                    >
                      Make Another Booking
                    </button>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Your booking details have been saved to Firebase and Google Sheets</li>
                      <li>• You will receive a WhatsApp confirmation shortly</li>
                      <li>• Please arrive 15 minutes early with your AADHAAR card</li>
                      <li>• Remaining amount will be collected before the event</li>
                      {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                        <li>• <strong>Mobile users:</strong> If you paid via PhonePe/GPay and don't see confirmation, please wait 30 seconds or refresh this page</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Terms and Payment Form (shown when payment not successful) */}
              {paymentStatus !== "success" && (
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

                  {/* Payment Status */}
                  {(paymentStatus !== "pending" || isProcessing) && (
                    <div className={`mt-6 p-4 rounded-2xl border ${
                      paymentStatus === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : paymentStatus === "failed"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon()}
                        <span className="font-medium text-lg">
                          {getPaymentStatusMessage()}
                        </span>
                      </div>
                      
                      {isProcessing && paymentStatus === "pending" && (
                        <div className="mt-4 pl-8">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">
                              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) 
                                ? "Waiting for payment confirmation... Please return here after completing payment in your payment app."
                                : "Saving to Firebase and Google Sheets..."
                              }
                            </span>
                          </div>
                          <p className="text-xs mt-2 text-blue-600">
                            {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                              ? "If you completed payment in PhonePe/GPay, your booking will be confirmed automatically within 30 seconds."
                              : "Your payment is being processed and data is being saved automatically."
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                          <CreditCard className="w-6 h-6 mr-3 text-purple-600" />
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

                          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-medium">
                                Advance Payment:
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                ₹{baseAdvanceAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm pl-4">
                            <span className="text-gray-600">Convenience fee:</span>
                            <span className="text-gray-700">₹{convenienceFee.toFixed(2)}</span>
                          </div>

                          <div className="bg-green-100 p-4 rounded-xl border border-green-300">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-semibold">
                                Total Advance (Now):
                              </span>
                              <span className="text-2xl font-bold text-green-600">
                                ₹{advanceAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-medium">
                                Remaining (After Event):
                              </span>
                              <span className="text-xl font-bold text-yellow-600">
                                ₹{remainingAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <button
                        ref={payButtonRef}
                        onClick={handlePayment}
                        disabled={
                          !isChecked ||
                          isProcessing ||
                          paymentStatus === "success"
                        }
                        className={`w-full rounded-2xl py-6 font-bold text-xl transition-all duration-300 transform ${
                          isChecked && paymentStatus !== "success"
                            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center space-x-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>{getPaymentStatusMessage() || "Processing..."}</span>
                          </span>
                        ) : paymentStatus === "success" ? (
                          <span className="flex items-center justify-center space-x-3">
                            <CheckCircle className="w-6 h-6" />
                            <span>Payment Successful!</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-3">
                            <CreditCard className="w-6 h-6" />
                            <span>Pay Advance ₹{formatCurrency(advanceAmount)}</span>
                          </span>
                        )}
                      </button>
                      
                      <p className="text-center text-sm text-gray-500 mt-4">
                        Secure payment powered by Razorpay • Data automatically saved to Firebase & Google Sheets
                      </p>
                      
                      {/* Mobile Payment Notice */}
                      {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-start space-x-2">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                              <p className="font-semibold mb-1">Mobile Payment Notice:</p>
                              <ul className="space-y-1 text-xs">
                                <li>• You'll be redirected to your payment app (PhonePe/GPay/etc.)</li>
                                <li>• After payment, you'll automatically return to our website</li>
                                <li>• If stuck in payment app, manually return to this page</li>
                                <li>• Your booking will be confirmed automatically</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsMain;