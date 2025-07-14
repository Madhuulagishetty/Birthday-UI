import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  ExternalLink,
  Clock,
  X
} from "lucide-react";

const PaymentRecoveryBanner = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [incompletePayment, setIncompletePayment] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    checkForIncompletePayments();
  }, []);

  const checkForIncompletePayments = async () => {
    const paymentLinkId = localStorage.getItem('currentPaymentLinkId');
    const bookingData = localStorage.getItem('bookingData');
    
    if (paymentLinkId && bookingData) {
      setIncompletePayment({
        paymentLinkId,
        bookingData: JSON.parse(bookingData)
      });
      setShow(true);
      
      // Automatically check status
      await checkPaymentStatus(paymentLinkId);
    }
  };

  const checkPaymentStatus = async (paymentLinkId) => {
    setIsChecking(true);
    
    try {
      const response = await fetch(`https://birthday-backend-tau.vercel.app/payment-status/${paymentLinkId}`);
      const result = await response.json();
      
      if (result.status === 'paid') {
        // Payment completed - redirect to success page
        localStorage.removeItem('currentPaymentLinkId');
        navigate('/payment-success?razorpay_payment_link_id=' + paymentLinkId);
      } else if (result.needsRecovery) {
        // Show recovery options
        setIncompletePayment(prev => ({
          ...prev,
          needsRecovery: true
        }));
      }
    } catch (error) {
      console.error('Payment status check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const recoverPayment = async () => {
    if (!incompletePayment) return;
    
    setIsRecovering(true);
    
    try {
      const response = await fetch('https://birthday-backend-tau.vercel.app/recover-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentLinkId: incompletePayment.paymentLinkId,
          bookingData: incompletePayment.bookingData
        })
      });
      
      const result = await response.json();
      
      if (result.status === 'recovered') {
        localStorage.removeItem('currentPaymentLinkId');
        navigate('/payment-success?razorpay_payment_link_id=' + incompletePayment.paymentLinkId);
      } else {
        alert('Recovery failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Recovery failed:', error);
      alert('Recovery failed. Please contact support.');
    } finally {
      setIsRecovering(false);
    }
  };

  const dismissBanner = () => {
    localStorage.removeItem('currentPaymentLinkId');
    setShow(false);
  };

  const reopenPaymentLink = () => {
    // Reconstruct payment link URL
    const baseUrl = 'https://rzp.io/l/';
    const shortId = incompletePayment.paymentLinkId.replace('plink_', '');
    window.open(baseUrl + shortId, '_blank');
  };

  if (!show || !incompletePayment) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {isChecking ? (
              <RefreshCw className="w-6 h-6 text-yellow-600 animate-spin" />
            ) : incompletePayment.needsRecovery ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <Clock className="w-6 h-6 text-yellow-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-yellow-800">
                {isChecking ? '🔍 Checking Payment Status...' : '⏳ Incomplete Payment Found'}
              </h3>
              <button
                onClick={dismissBanner}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-yellow-700 mt-1 text-sm">
              {isChecking 
                ? 'Verifying if your payment was completed...'
                : incompletePayment.needsRecovery
                ? 'Your payment was successful but data needs to be recovered.'
                : 'You have an incomplete payment that can be resumed.'
              }
            </p>

            {/* Action Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {!isChecking && (
                <>
                  <button
                    onClick={() => checkPaymentStatus(incompletePayment.paymentLinkId)}
                    disabled={isChecking}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Check Status</span>
                  </button>

                  {incompletePayment.needsRecovery ? (
                    <button
                      onClick={recoverPayment}
                      disabled={isRecovering}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      {isRecovering ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Recover Payment</span>
                    </button>
                  ) : (
                    <button
                      onClick={reopenPaymentLink}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Complete Payment</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/terms-conditions')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    View Details
                  </button>
                </>
              )}
            </div>

            {/* Booking Details Summary */}
            {incompletePayment.bookingData && (
              <div className="mt-3 p-3 bg-white/60 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 text-sm mb-1">Booking Summary:</h4>
                <div className="text-xs text-yellow-700 grid grid-cols-2 gap-1">
                  <span>👤 {incompletePayment.bookingData.bookingName}</span>
                  <span>📅 {incompletePayment.bookingData.date}</span>
                  <span>👥 {incompletePayment.bookingData.people} people</span>
                  <span>💰 ₹{incompletePayment.bookingData.totalAmount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRecoveryBanner;