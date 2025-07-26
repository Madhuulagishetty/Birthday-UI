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
  Zap,
  ExternalLink,
  ArrowRight
} from "lucide-react";

const serverUrl = 'https://birthday-backend-tau.vercel.app';

const TermsMain = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [amountWithTax, setAmountWithTax] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentPaymentLinkId, setCurrentPaymentLinkId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [paymentLinkUrl, setPaymentLinkUrl] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [buttonState, setButtonState] = useState('ready'); // ready, creating, redirecting, success

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

    // Check for incomplete payments on page load
    checkForIncompletePayments();
    
    // Check for payment link ID in localStorage
    const storedPaymentLinkId = localStorage.getItem('currentPaymentLinkId');
    if (storedPaymentLinkId) {
      setCurrentPaymentLinkId(storedPaymentLinkId);
      checkPaymentStatus(storedPaymentLinkId);
    }
  }, [navigate]);

  // Check for incomplete payments from previous sessions
  const checkForIncompletePayments = () => {
    const incompletePaymentLinkId = localStorage.getItem('currentPaymentLinkId');
    const incompleteBookingData = localStorage.getItem('bookingData');
    
    if (incompletePaymentLinkId && incompleteBookingData) {
      addNotification("info", "Found incomplete payment. Checking status...");
      checkPaymentStatus(incompletePaymentLinkId);
    }
  };

  // Enhanced payment status check with retry logic
  const checkPaymentStatus = async (paymentLinkId, retryCount = 0) => {
    try {
      console.log(`🔍 Checking payment status for: ${paymentLinkId} (Attempt ${retryCount + 1})`);
      
      const response = await fetch(`${serverUrl}/payment-status/${paymentLinkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`📊 Payment status result:`, result);
      
      if (result.status === 'paid') {
        // Payment was completed
        setVerificationStatus('success');
        setButtonState('success');
        setIsProcessingPayment(false);
        
        const completedBooking = {
          ...bookingData,
          paymentId: result.paymentDetails?.id,
          paymentLinkId: paymentLinkId,
          advancePaid: 10,
          remainingAmount: bookingData.totalAmount - 10,
          paymentStatus: 'advance_paid',
          bookingConfirmed: true,
          savedBooking: result.bookingData,
          dataStored: result.dataStored
        };
        
        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        localStorage.removeItem('currentPaymentLinkId');
        
        addNotification("success", "Payment completed! Data saved successfully. Redirecting...");
        setTimeout(() => navigate('/thank-you'), 2000);
      } else if (result.needsRecovery) {
        // Payment was made but data wasn't saved - recover it
        addNotification("warning", "Payment completed but data needs recovery. Processing...");
        await recoverPayment(paymentLinkId);
      } else if (result.status === 'created' || result.status === 'issued') {
        // Payment link exists but not paid yet
        console.log(`⏳ Payment link status: ${result.status}`);
        addNotification("info", "Payment link is active. Complete payment to proceed.");
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      
      // Retry logic for network issues
      if (retryCount < 3) {
        console.log(`🔄 Retrying payment status check in 2 seconds...`);
        setTimeout(() => {
          checkPaymentStatus(paymentLinkId, retryCount + 1);
        }, 2000);
      } else {
        addNotification("error", "Unable to check payment status. Please refresh the page.");
      }
    }
  };

  // Enhanced payment recovery with better error handling
  const recoverPayment = async (paymentLinkId) => {
    try {
      console.log(`🔄 Starting payment recovery for: ${paymentLinkId}`);
      
      const response = await fetch(`${serverUrl}/recover-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentLinkId, bookingData })
      });
      
      if (!response.ok) {
        throw new Error(`Recovery failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`✅ Recovery result:`, result);
      
      if (result.status === 'recovered') {
        addNotification("success", "Payment recovered successfully! Data saved.");
        setVerificationStatus('success');
        setButtonState('success');
        localStorage.removeItem('currentPaymentLinkId');
        
        const completedBooking = {
          ...bookingData,
          paymentId: result.paymentId,
          paymentLinkId: paymentLinkId,
          advancePaid: 10,
          remainingAmount: bookingData.totalAmount - 10,
          paymentStatus: 'advance_paid',
          bookingConfirmed: true,
          dataStored: result.dataStored
        };
        
        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        setTimeout(() => navigate('/thank-you'), 1500);
      } else {
        addNotification("error", "Payment recovery failed. Please contact support.");
      }
    } catch (error) {
      console.error('Payment recovery failed:', error);
      addNotification("error", "Payment recovery failed. Please contact support.");
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

  // Enhanced payment initialization with better error handling
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
    setButtonState('creating');
    setVerificationStatus(null);
    setPaymentLinkUrl(null);
    setCountdown(null);

    try {
      console.log("🔗 Creating payment link...");
      addNotification("info", "Creating secure payment link...");
      
      // Enhanced booking data with additional fields
      const enhancedBookingData = {
        ...bookingData,
        totalAmount: amountWithTax,
        advanceAmount: 10,
        remainingAmount: amountWithTax - 10,
        paymentMethod: 'razorpay_payment_link',
        createdAt: new Date().toISOString(),
        source: 'web_app'
      };
      
      const response = await fetch(`${serverUrl}/create-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1, // Advance amount ₹10
          bookingData: enhancedBookingData
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Payment link created successfully:", result);
      
      if (!result.paymentLink || !result.paymentLink.short_url) {
        throw new Error('Invalid payment link response');
      }
      
      const paymentLink = result.paymentLink;
      
      // Store payment link data
      setCurrentPaymentLinkId(paymentLink.id);
      setPaymentLinkUrl(paymentLink.short_url);
      localStorage.setItem('currentPaymentLinkId', paymentLink.id);
      
      setButtonState('redirecting');
      addNotification("success", "Payment link created! Redirecting in 3 seconds...");
      
      // Countdown before redirect
      let countdownValue = 3;
      setCountdown(countdownValue);
      
      const countdownInterval = setInterval(() => {
        countdownValue--;
        setCountdown(countdownValue);
        
        if (countdownValue <= 0) {
          clearInterval(countdownInterval);
          setCountdown(null);
          
          // Open payment link
          window.open(paymentLink.short_url, '_blank');
          
          // Start enhanced monitoring
          startEnhancedPaymentMonitoring(paymentLink.id);
        }
      }, 1000);

    } catch (error) {
      console.error('Payment link creation error:', error);
      addNotification("error", `Failed to create payment link: ${error.message}`);
      setIsProcessingPayment(false);
      setButtonState('ready');
      setVerificationStatus(null);
      setPaymentLinkUrl(null);
      setCountdown(null);
    }
  };

  // Enhanced payment monitoring with better intervals and error handling
  const startEnhancedPaymentMonitoring = (paymentLinkId) => {
    console.log(`🔍 Starting enhanced payment monitoring for: ${paymentLinkId}`);
    addNotification("info", "Payment monitoring started. Complete payment in the new tab.");
    
    let checkCount = 0;
    const maxChecks = 200; // 200 checks over 10 minutes
    
    const checkInterval = setInterval(async () => {
      checkCount++;
      
      try {
        console.log(`🔍 Payment check ${checkCount}/${maxChecks} for ${paymentLinkId}`);
        
        const response = await fetch(`${serverUrl}/payment-status/${paymentLinkId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`📊 Payment status (${checkCount}):`, result);
        
        if (result.status === 'paid') {
          clearInterval(checkInterval);
          
          console.log(`✅ Payment completed! Processing data...`);
          setVerificationStatus('success');
          setButtonState('success');
          setIsProcessingPayment(false);
          
          const completedBooking = {
            ...bookingData,
            paymentId: result.paymentDetails?.id,
            paymentLinkId: paymentLinkId,
            advancePaid: 10,
            remainingAmount: bookingData.totalAmount - 10,
            paymentStatus: 'advance_paid',
            bookingConfirmed: true,
            savedBooking: result.bookingData,
            dataStored: result.dataStored
          };
          
          localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
          localStorage.removeItem('currentPaymentLinkId');
          
          addNotification("success", "Payment completed! Data saved automatically. Redirecting...");
          setTimeout(() => navigate('/thank-you'), 2000);
        }
      } catch (error) {
        console.error(`❌ Payment status check ${checkCount} failed:`, error);
        
        // Don't show error notification for every failed check
        if (checkCount % 10 === 0) {
          addNotification("warning", `Payment monitoring active (${checkCount}/${maxChecks})...`);
        }
      }
      
      // Stop monitoring after max checks
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        if (verificationStatus !== 'success') {
          console.log(`⏰ Payment monitoring stopped after ${maxChecks} checks`);
          addNotification("warning", "Payment monitoring stopped. Return anytime to check status.");
          setIsProcessingPayment(false);
          setButtonState('ready');
        }
      }
    }, 3000); // Check every 3 seconds
  };

  const handleNewBooking = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("completedBookingData");
    localStorage.removeItem("currentPaymentLinkId");
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
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 py-4 md:py-6 md:px-6 px-4">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8 text-white" />
                <h1 className=" text-[19px] md:text-4xl font-bold text-white text-center">
                  Terms & Conditions
                </h1>
               </div>
            </div>

            <div className="p-2 md:p-12">
              <div
                className={`space-y-6 transition-all duration-700 delay-300 ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h2 className="md:text-xl text-md font-bold mb-6 text-purple-800 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-3 text-purple-600" />
                    Important Terms
                  </h2>
                  <ol className="list-decimal pl-6 md:space-y-4">
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
                    <span className="text-gray-700 font-medium text leading-tight md:text-lg">
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
                      <h3 className="font-bold md:text-2xl text-md mb-6 text-purple-800 flex items-center">
                        <Info className="w-6 h-6 mr-3 text-purple-600" />
                        Booking Summary
                      </h3>

                      <div className="">
                        <div className="flex justify-between items-center py-3 border-b border-purple-100">
                          <span className="text-gray-800 font-medium md:text-lg ">
                            Total Amount:
                          </span>
                          <span className=" text-md md:text-2xl font-bold text-purple-600">
                            ₹{amountWithTax.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-purple-100">
                          <span className="text-gray-800 font-medium  text-md md:text-xl">
                            Advance Payment:
                          </span>
                          <span className=" text-md md:text-2xl font-bold text-green-600">
                            ₹10.00
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-800 font-medium  text-md md:text-xl">
                            Remaining Amount:
                          </span>
                          <span className="text-xl font-bold text-orange-600">
                            ₹{(amountWithTax - 10).toFixed(2)}
                          </span>
                        </div>

                        

                        {/* Payment Status */}
                        {(verificationStatus || countdown !== null) && (
                          <div className={`p-4 rounded-xl border ${
                            buttonState === "creating" 
                              ? "bg-blue-50 border-blue-200"
                              : buttonState === "redirecting"
                              ? "bg-yellow-50 border-yellow-200"
                              : verificationStatus === "success"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}>
                            <div className="flex items-center space-x-2">
                              {buttonState === "creating" && (
                                <>
                                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                                  <span className="text-blue-800 font-medium">
                                    🔗 Creating secure payment link...
                                  </span>
                                </>
                              )}
                              {buttonState === "redirecting" && countdown !== null && (
                                <>
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                  <span className="text-yellow-800 font-medium">
                                    🚀 Redirecting to payment in {countdown} seconds...
                                  </span>
                                </>
                              )}
                              {verificationStatus === "success" && (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-green-800 font-medium">
                                    ✅ Payment completed! Data saved (single time only).
                                  </span>
                                </>
                              )}
                              {verificationStatus === "failed" && (
                                <>
                                  <XCircle className="w-5 h-5 text-red-600" />
                                  <span className="text-red-800 font-medium">
                                    ❌ Payment failed. Please try again.
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Payment Link URL */}
                        {paymentLinkUrl && buttonState !== 'success' && (
                          <div className="bg-purple-50 md:p-4 p-2 rounded-xl border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center text-md md:text-lg">
                              {/* <ExternalLink className="w-4 h-4 mr-2" /> */}
                              Payment Link Created:
                            </h4>
                            <div className=" flex flex-col md:flex-row justify-start gap-3 md:items-center space-x-2">
                              <span className="text-sm text-purple-700 font-mono bg-white px-2 py-1 rounded border">
                                {paymentLinkUrl}
                              </span>
                              <button
                                onClick={() => window.open(paymentLinkUrl, '_blank')}
                                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                              >
                                Open Link
                              </button>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">
                              💡 Complete payment and data will be saved exactly once via webhook
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={initializePayment}
                      disabled={!isChecked || isProcessingPayment || buttonState === 'success'}
                      className={`w-full rounded-2xl py-6 font-bold text-xl transition-all duration-300 transform ${
                        buttonState === 'success'
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : isChecked && !isProcessingPayment
                          ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-3">
                        {buttonState === 'creating' && (
                          <>
                            <Loader className="w-6 h-6 animate-spin" />
                            <span>Creating Payment Link...</span>
                          </>
                        )}
                        {buttonState === 'redirecting' && countdown !== null && (
                          <>
                            <Clock className="w-6 h-6" />
                            <span>Redirecting in {countdown}...</span>
                          </>
                        )}
                        {buttonState === 'success' && (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span>Payment Completed!</span>
                          </>
                        )}
                        {buttonState === 'ready' && (
                          <>
                            {/* <CreditCard className="w-6 h-6" /> */}
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-[16px] md:text-lg">Pay ₹10 via Secure Link</span>
                            {/* <ArrowRight className="w-5 h-5" /> */}
                          </>
                        )}
                      </span>
                    </button>
                  
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center pt-6 border-t border-gray-200 space-y-4">
                  {paymentLinkUrl && buttonState !== 'success' && (
                    <button
                      onClick={() => window.open(paymentLinkUrl, '_blank')}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold mr-4"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Open Payment Link
                    </button>
                  )}
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