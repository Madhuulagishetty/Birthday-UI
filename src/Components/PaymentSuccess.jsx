import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Loader, 
  AlertCircle,
  Download,
  RefreshCw,
  ArrowRight,
  Clock,
  Shield,
  Zap
} from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('checking'); // checking, success, failed, notFound
  const [bookingData, setBookingData] = useState(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isRecovering, setIsRecovering] = useState(false);

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  useEffect(() => {
    // Check for payment link callback parameters
    const paymentLinkId = searchParams.get('razorpay_payment_link_id');
    const paymentId = searchParams.get('razorpay_payment_id');
    const paymentLinkStatus = searchParams.get('razorpay_payment_link_status');
    
    if (paymentLinkId) {
      console.log('🔗 Payment link callback detected:', { paymentLinkId, paymentId, paymentLinkStatus });
      verifyPaymentLink(paymentLinkId);
    } else {
      // Check for completed booking data from previous flow
      checkCompletedBooking();
    }
  }, [searchParams]);

  const verifyPaymentLink = async (paymentLinkId, retryCount = 0) => {
    setPaymentStatus('checking');
    
    try {
      console.log(`🔍 Verifying payment link: ${paymentLinkId} (attempt ${retryCount + 1})`);
      
      const response = await fetch(`https://birthday-ui.vercel.app/payment-status/${paymentLinkId}`);
      const result = await response.json();
      
      if (result.status === 'paid') {
        setPaymentStatus('success');
        setBookingData(result.bookingData);
        
        // Store completed booking data
        const completedBooking = {
          ...result.bookingData,
          paymentId: result.paymentDetails?.id,
          paymentLinkId: paymentLinkId,
          bookingConfirmed: true,
          verificationMethod: 'payment_link_callback'
        };
        
        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        localStorage.removeItem('currentPaymentLinkId');
        localStorage.removeItem('bookingData');
        
        addNotification('success', 'Payment verified successfully! Your booking is confirmed.');
        
      } else if (result.needsRecovery) {
        // Payment was made but data wasn't saved - attempt recovery
        addNotification('warning', 'Payment detected, recovering booking data...');
        await attemptRecovery(paymentLinkId);
        
      } else if (retryCount < 3) {
        // Retry verification up to 3 times with delay
        addNotification('info', `Payment verification in progress... (attempt ${retryCount + 1})`);
        setTimeout(() => {
          verifyPaymentLink(paymentLinkId, retryCount + 1);
        }, 2000);
        
      } else {
        setPaymentStatus('failed');
        addNotification('error', 'Payment verification failed after multiple attempts.');
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      
      if (retryCount < 3) {
        setTimeout(() => {
          verifyPaymentLink(paymentLinkId, retryCount + 1);
        }, 3000);
      } else {
        setPaymentStatus('failed');
        addNotification('error', 'Unable to verify payment. Please contact support.');
      }
    }
  };

  const attemptRecovery = async (paymentLinkId) => {
    setIsRecovering(true);
    
    try {
      // Get booking data from localStorage if available
      const storedBookingData = localStorage.getItem('bookingData');
      const bookingData = storedBookingData ? JSON.parse(storedBookingData) : null;
      
      if (!bookingData) {
        addNotification('error', 'Cannot recover payment: booking data not found.');
        setPaymentStatus('failed');
        setIsRecovering(false);
        return;
      }
      
      const response = await fetch('https://birthday-backend-tau.vercel.app/recover-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentLinkId, bookingData })
      });
      
      const result = await response.json();
      
      if (result.status === 'recovered') {
        setPaymentStatus('success');
        setBookingData(bookingData);
        
        const completedBooking = {
          ...bookingData,
          paymentId: result.paymentId,
          paymentLinkId: paymentLinkId,
          bookingConfirmed: true,
          verificationMethod: 'recovery'
        };
        
        localStorage.setItem('completedBookingData', JSON.stringify(completedBooking));
        localStorage.removeItem('currentPaymentLinkId');
        
        addNotification('success', 'Payment recovered successfully! Your booking is confirmed.');
      } else {
        setPaymentStatus('failed');
        addNotification('error', 'Payment recovery failed. Please contact support.');
      }
      
    } catch (error) {
      console.error('Recovery error:', error);
      setPaymentStatus('failed');
      addNotification('error', 'Recovery process failed. Please contact support.');
    } finally {
      setIsRecovering(false);
    }
  };

  const checkCompletedBooking = () => {
    const completedData = localStorage.getItem('completedBookingData');
    
    if (completedData) {
      const booking = JSON.parse(completedData);
      setBookingData(booking);
      setPaymentStatus('success');
      addNotification('success', 'Booking data loaded successfully!');
    } else {
      setPaymentStatus('notFound');
      addNotification('warning', 'No payment data found. Redirecting to home page...');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  const downloadBookingDetails = () => {
    if (!bookingData) return;
    
    const bookingText = `
🎉 THEATER BOOKING CONFIRMATION 🎉

Booking Details:
================
Name: ${bookingData.bookingName || bookingData.NameUser}
Email: ${bookingData.email}
Phone: ${bookingData.whatsapp}
Date: ${bookingData.date}
Time: ${bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : 'Not specified'}
Number of People: ${bookingData.people}
Decoration: ${bookingData.wantDecoration ? 'Yes' : 'No'}
Occasion: ${bookingData.occasion || 'Not specified'}

Payment Information:
===================
Payment ID: ${bookingData.paymentId || 'Processing...'}
Total Amount: ₹${bookingData.totalAmount || bookingData.amountWithTax}
Advance Paid: ₹10
Remaining: ₹${(bookingData.totalAmount || bookingData.amountWithTax) - 10}
Status: Confirmed

Important Notes:
===============
- Please arrive 15 minutes before your slot
- Bring a valid ID for verification
- Remaining amount to be paid at the venue
- Contact us for any changes or queries

Thank you for choosing our theater!
    `;
    
    const blob = new Blob([bookingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theater-booking-${bookingData.paymentId || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification('success', 'Booking details downloaded successfully!');
  };

  const retryVerification = () => {
    const paymentLinkId = searchParams.get('razorpay_payment_link_id');
    if (paymentLinkId) {
      setVerificationAttempts(prev => prev + 1);
      verifyPaymentLink(paymentLinkId);
    }
  };

  const NotificationToast = ({ notification, onClose }) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-600" />,
      error: <XCircle className="w-5 h-5 text-red-600" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      info: <Clock className="w-5 h-5 text-blue-600" />,
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
          
          {/* Checking Status */}
          {paymentStatus === 'checking' && (
            <div className="text-center py-16 px-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Loader className="w-16 h-16 text-purple-600 animate-spin" />
                  <Zap className="w-6 h-6 text-yellow-500 absolute top-5 left-5 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🔍 Verifying Your Payment
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                Please wait while we verify your payment and confirm your booking...
              </p>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                <p className="text-blue-800 text-sm">
                  ⚡ Our system automatically processes payments via webhooks.
                  This ensures your booking is saved even if you close the payment app.
                </p>
              </div>
              
              {isRecovering && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />
                    <span className="text-yellow-800 font-medium">
                      Recovering payment data...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Status */}
          {paymentStatus === 'success' && bookingData && (
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 py-8 px-8">
                <div className="text-center">
                  <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    🎉 Payment Successful!
                  </h1>
                  <p className="text-green-100 text-xl">
                    Your theater booking has been confirmed
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-8 md:p-12">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 mb-8">
                  <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3" />
                    Booking Confirmation
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-700">Customer Details</h3>
                        <p className="text-lg font-medium">{bookingData.bookingName || bookingData.NameUser}</p>
                        <p className="text-gray-600">{bookingData.email}</p>
                        <p className="text-gray-600">{bookingData.whatsapp}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-700">Booking Details</h3>
                        <p className="text-lg">📅 {bookingData.date}</p>
                        <p className="text-lg">🕐 {bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : 'Time TBD'}</p>
                        <p className="text-lg">👥 {bookingData.people} people</p>
                        <p className="text-lg">🎈 Decoration: {bookingData.wantDecoration ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-700">Payment Information</h3>
                        <p className="text-lg">💳 Payment ID: <span className="font-mono text-sm">{bookingData.paymentId || 'Processing...'}</span></p>
                        <p className="text-lg">💰 Total Amount: ₹{bookingData.totalAmount || bookingData.amountWithTax}</p>
                        <p className="text-lg text-green-600">✅ Advance Paid: ₹10</p>
                        <p className="text-lg text-orange-600">⏳ Remaining: ₹{(bookingData.totalAmount || bookingData.amountWithTax) - 10}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                  <button
                    onClick={downloadBookingDetails}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold mr-4"
                  >
                    <Download className="w-5 h-5 inline mr-2" />
                    Download Booking Details
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-8 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-semibold"
                  >
                    <ArrowRight className="w-5 h-5 inline mr-2" />
                    Book Another Slot
                  </button>
                </div>

                {/* Important Notes */}
                <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-4">📝 Important Notes:</h3>
                  <ul className="text-blue-700 space-y-2 text-sm">
                    <li>• Please arrive 15 minutes before your scheduled time</li>
                    <li>• Bring a valid government ID for verification</li>
                    <li>• Remaining amount to be paid at the venue before the event</li>
                    <li>• Your booking data has been automatically saved to our system</li>
                    <li>• Contact us for any changes or queries</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Failed Status */}
          {paymentStatus === 'failed' && (
            <div className="text-center py-16 px-8">
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ❌ Payment Verification Failed
              </h1>
              
              <p className="text-gray-600 text-lg mb-8">
                We couldn't verify your payment at this time. This might be a temporary issue.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={retryVerification}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold mr-4"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Retry Verification
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {/* Not Found Status */}
          {paymentStatus === 'notFound' && (
            <div className="text-center py-16 px-8">
              <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🔍 No Payment Data Found
              </h1>
              
              <p className="text-gray-600 text-lg mb-8">
                We couldn't find any payment data. You will be redirected to the home page shortly.
              </p>
              
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Go to Home Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;