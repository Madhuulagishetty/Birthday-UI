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
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Database
} from "lucide-react";

const serverUrl = 'https://birthday-backend-tau.vercel.app';

const Terms = () => {
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
  const [buttonState, setButtonState] = useState('ready');
  const [dataStorageStatus, setDataStorageStatus] = useState(null);

  const addNotification = (type, message, autoRemove = true) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    if (autoRemove) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, type === 'error' ? 8000 : 5000);
    }
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

    // Check for incomplete payments
    const storedPaymentLinkId = localStorage.getItem('currentPaymentLinkId');
    if (storedPaymentLinkId) {
      console.log('🔍 Found incomplete payment, checking status...');
      setCurrentPaymentLinkId(storedPaymentLinkId);
      checkPaymentStatus(storedPaymentLinkId);
    }
  }, [navigate]);

  // Check payment status
  const checkPaymentStatus = async (paymentLinkId) => {
    try {
      console.log(`🔍 Checking payment status for: ${paymentLinkId}`);
      setIsProcessingPayment(true);
      setButtonState('checking');
      
      const response = await fetch(`${serverUrl}/payment-status/${paymentLinkId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`📊 Payment status result:`, result);
      
      if (result.status === 'paid') {
        await handlePaymentSuccess(result, paymentLinkId);
      } else if (result.status === 'created' || result.status === 'issued') {
        addNotification("info", `Payment link is active. Please complete payment.`);
        setButtonState('ready');
        setIsProcessingPayment(false);
      } else {
        addNotification("warning", `Payment status: ${result.status}`);
        setButtonState('ready');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
      addNotification("error", "Unable to verify payment status. Please try again.");
      setButtonState('ready');
      setIsProcessingPayment(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (result, paymentLinkId) => {
    try {
      console.log(`✅ Payment successful, processing data...`);
      
      setVerificationStatus('success');
      setButtonState('success');
      setIsProcessingPayment(false);
      
      // Create completed booking data
      const completedBooking = {
        ...bookingData,
        paymentId: result.paymentDetails?.id || result.paymentId,
        paymentLinkId: paymentLinkId,
        advancePaid: 10,
        remainingAmount: bookingData.totalAmount - 10,
        paymentStatus: 'advance_paid',
        bookingConfirmed: true,
        dataStored: result.dataStored,
        completedAt: new Date().toISOString()
      };
      
      // Store completed booking
      localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
      localStorage.removeItem('currentPaymentLinkId');
      
      // Update data storage status
      setDataStorageStatus(result.dataStored);
      
      // Show success notification
      const storageMsg = result.dataStored ? 
        `Data saved: Firebase(${result.dataStored.firebase ? '✅' : '❌'}), Sheets(${result.dataStored.sheets ? '✅' : '❌'})` :
        "Data storage completed";
      
      addNotification("success", `Payment completed! ${storageMsg}`);
      
      // Navigate to thank you page
      setTimeout(() => {
        navigate('/thank-you');
      }, 2000);
      
    } catch (error) {
      console.error('Error handling payment success:', error);
      addNotification("error", "Payment successful but data processing failed. Please contact support.");
    }
  };

  // Initialize payment
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

    try {
      console.log("🔗 Creating payment link...");
      addNotification("info", "Creating secure payment link...");
      
      const enhancedBookingData = {
        ...bookingData,
        totalAmount: amountWithTax,
        advanceAmount: 10,
        remainingAmount: amountWithTax - 10,
        createdAt: new Date().toISOString(),
        sessionId: Date.now().toString()
      };
      
      const response = await fetch(`${serverUrl}/create-payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10, // Advance amount ₹10
          bookingData: enhancedBookingData
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Payment link created:", result);
      
      if (!result.paymentLink || !result.paymentLink.short_url) {
        throw new Error('Invalid payment link response');
      }
      
      const paymentLink = result.paymentLink;
      
      // Store payment link data
      setCurrentPaymentLinkId(paymentLink.id);
      setPaymentLinkUrl(paymentLink.short_url);
      localStorage.setItem('currentPaymentLinkId', paymentLink.id);
      
      setButtonState('redirecting');
      addNotification("success", "Payment link created! Opening in new tab...");
      
      // Open payment link
      setTimeout(() => {
        window.open(paymentLink.short_url, '_blank');
        startPaymentMonitoring(paymentLink.id);
      }, 1000);

    } catch (error) {
      console.error('Payment link creation error:', error);
      addNotification("error", `Failed to create payment link: ${error.message}`);
      setIsProcessingPayment(false);
      setButtonState('ready');
      setVerificationStatus(null);
      setPaymentLinkUrl(null);
    }
  };

  // Start payment monitoring
  const startPaymentMonitoring = (paymentLinkId) => {
    console.log(`🔍 Starting payment monitoring for: ${paymentLinkId}`);
    setButtonState('monitoring');
    addNotification("info", "Monitoring payment status. Complete payment in the new tab.");
    
    let checkCount = 0;
    const maxChecks = 60; // 5 minutes total
    
    const checkInterval = setInterval(async () => {
      checkCount++;
      
      try {
        console.log(`🔍 Payment monitor check ${checkCount}/${maxChecks}`);
        
        const response = await fetch(`${serverUrl}/payment-status/${paymentLinkId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`📊 Monitor result (${checkCount}):`, result);
        
        if (result.status === 'paid') {
          clearInterval(checkInterval);
          await handlePaymentSuccess(result, paymentLinkId);
        }
        
        // Update UI with monitoring status
        if (checkCount % 10 === 0) {
          addNotification("info", `Payment monitoring active (${checkCount}/${maxChecks})...`);
        }
        
      } catch (error) {
        console.error(`❌ Monitor check ${checkCount} failed:`, error);
      }
      
      // Stop monitoring after max checks
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        if (verificationStatus !== 'success') {
          console.log(`⏰ Payment monitoring stopped after ${maxChecks} checks`);
          addNotification("warning", "Payment monitoring timeout. You can return later to check status.");
          setButtonState('ready');
          setIsProcessingPayment(false);
        }
      }
    }, 5000); // Check every 5 seconds
  };

  // Manual recovery function for testing
  const handleManualRecovery = async () => {
    if (!currentPaymentLinkId) {
      addNotification("error", "No payment link ID found");
      return;
    }

    try {
      addNotification("info", "Starting manual recovery...");
      
      const response = await fetch(`${serverUrl}/recover-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentLinkId: currentPaymentLinkId, 
          bookingData 
        })
      });
      
      const result = await response.json();
      
      if (result.status === 'recovered') {
        addNotification("success", "Payment recovered successfully!");
        setVerificationStatus('success');
        setButtonState('success');
        
        const completedBooking = {
          ...bookingData,
          paymentId: result.paymentId,
          paymentLinkId: currentPaymentLinkId,
          advancePaid: 10,
          remainingAmount: bookingData.totalAmount - 10,
          paymentStatus: 'advance_paid',
          bookingConfirmed: true,
          dataStored: result.dataStored
        };
        
        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        localStorage.removeItem('currentPaymentLinkId');
        
        setTimeout(() => navigate('/thank-you'), 1500);
      } else {
        addNotification("error", `Recovery failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Manual recovery failed:', error);
      addNotification("error", "Manual recovery failed. Please contact support.");
    }
  };

  // Manual save function for testing
  const handleManualSave = async () => {
    if (!bookingData) {
      addNotification("error", "No booking data found");
      return;
    }

    try {
      addNotification("info", "Testing manual save...");
      
      const testBookingData = {
        ...bookingData,
        paymentId: "test_payment_" + Date.now(),
        orderId: "test_order_" + Date.now(),
        paymentLinkId: currentPaymentLinkId || "test_link_" + Date.now(),
        advanceAmount: 10,
        remainingAmount: bookingData.totalAmount - 10,
        totalAmount: bookingData.totalAmount,
        source: 'manual_test'
      };

      const testPaymentDetails = {
        razorpay_payment_id: testBookingData.paymentId,
        razorpay_order_id: testBookingData.orderId,
        payment_link_id: testBookingData.paymentLinkId,
      };
      
      const response = await fetch(`${serverUrl}/manual-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bookingData: testBookingData, 
          paymentDetails: testPaymentDetails 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        const storageMsg = `Firebase: ${result.dataStored.firebase ? '✅' : '❌'}, Sheets: ${result.dataStored.sheets ? '✅' : '❌'}`;
        addNotification("success", `Manual save completed! ${storageMsg}`);
      } else {
        addNotification("error", "Manual save failed");
      }
    } catch (error) {
      console.error('Manual save failed:', error);
      addNotification("error", "Manual save failed. Please contact support.");
    }
  };

  const handleNewBooking = () => {
    localStorage.removeItem("bookingData");
    localStorage.removeItem("completedBookingData");
    localStorage.removeItem("currentPaymentLinkId");
    navigate("/");
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

                        {/* Payment Status */}
                        {(verificationStatus || buttonState !== 'ready') && (
                          <div className={`p-4 rounded-xl border ${
                            buttonState === "creating" 
                              ? "bg-blue-50 border-blue-200"
                              : buttonState === "checking" || buttonState === "monitoring"
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
                              {buttonState === "checking" && (
                                <>
                                  <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
                                  <span className="text-yellow-800 font-medium">
                                    🔍 Checking payment status...
                                  </span>
                                </>
                              )}
                              {buttonState === "monitoring" && (
                                <>
                                  <Clock className="w-5 h-5 text-yellow-600" />
                                  <span className="text-yellow-800 font-medium">
                                    👀 Monitoring payment status...
                                  </span>
                                </>
                              )}
                              {verificationStatus === "success" && (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-green-800 font-medium">
                                    ✅ Payment completed! Data saved successfully.
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Data Storage Status */}
                        {dataStorageStatus && (
                          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                              <Database className="w-4 h-4 mr-2" />
                              Data Storage Status:
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className={`flex items-center ${dataStorageStatus.firebase ? 'text-green-700' : 'text-red-700'}`}>
                                {dataStorageStatus.firebase ? '✅' : '❌'} Firebase Database
                              </div>
                              <div className={`flex items-center ${dataStorageStatus.sheets ? 'text-green-700' : 'text-red-700'}`}>
                                {dataStorageStatus.sheets ? '✅' : '❌'} Google Sheets
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Payment Link URL */}
                        {paymentLinkUrl && buttonState !== 'success' && (
                          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Payment Link:
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-purple-700 font-mono bg-white px-2 py-1 rounded border flex-1 truncate">
                                {paymentLinkUrl}
                              </span>
                              <button
                                onClick={() => window.open(paymentLinkUrl, '_blank')}
                                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                              >
                                Open Link
                              </button>
                            </div>
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
                        {buttonState === 'checking' && (
                          <>
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Checking Payment...</span>
                          </>
                        )}
                        {buttonState === 'monitoring' && (
                          <>
                            <Clock className="w-6 h-6" />
                            <span>Monitoring Payment...</span>
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
                            <CreditCard className="w-6 h-6" />
                            <ExternalLink className="w-5 h-5" />
                            <span>Pay ₹10 via Secure Link</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </span>
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      🔒 Secure payment via Razorpay • 💾 Auto-save to Firebase & Sheets
                    </p>
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
                  
                  {/* Debug buttons for testing */}
                  {currentPaymentLinkId && (
                    <>
                      <button
                        onClick={handleManualRecovery}
                        className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold mr-4"
                      >
                        Manual Recovery
                      </button>
                      <button
                        onClick={handleManualSave}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold mr-4"
                      >
                        Test Save
                      </button>
                    </>
                  )}
                  
                  
                  {currentPaymentLinkId && (
                    <button
                      onClick={() => checkPaymentStatus(currentPaymentLinkId)}
                      className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold mr-4"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      Check Payment Status
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

export default Terms;