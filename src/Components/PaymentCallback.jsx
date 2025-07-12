import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // Get payment details from URL params
      const paymentId = searchParams.get('razorpay_payment_id');
      const orderId = searchParams.get('razorpay_order_id');
      const error = searchParams.get('error');

      if (error) {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
        setTimeout(() => {
          navigate('/packages', { replace: true });
        }, 3000);
        return;
      }

      if (paymentId && orderId) {
        try {
          // Mark payment as completed
          sessionStorage.setItem('paymentCompleted', 'true');
          sessionStorage.setItem('paymentId', paymentId);
          sessionStorage.setItem('orderId', orderId);
          
          setStatus('success');
          setMessage('Payment successful! Redirecting to confirmation page...');
          
          // Show success toast
          toast.success('🎉 Payment successful! Your booking is confirmed.');
          
          // Redirect to thank you page after a short delay
          setTimeout(() => {
            navigate('/thank-you?payment_id=' + paymentId + '&order_id=' + orderId, { 
              replace: true 
            });
          }, 2000);
          
        } catch (error) {
          console.error('Error processing payment callback:', error);
          setStatus('failed');
          setMessage('Error processing payment. Please contact support.');
        }
      } else {
        // No payment details found, redirect to packages
        setStatus('failed');
        setMessage('Invalid payment details. Redirecting...');
        setTimeout(() => {
          navigate('/packages', { replace: true });
        }, 3000);
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />;
      case 'failed':
        return <XCircle className="w-20 h-20 text-red-500 mx-auto" />;
      default:
        return <Loader2 className="w-20 h-20 text-blue-500 mx-auto animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-400 to-green-600';
      case 'failed':
        return 'from-red-400 to-red-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <div className={`bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent mb-4`}>
          <h1 className="text-3xl font-bold">
            {status === 'success' ? 'Payment Successful!' : 
             status === 'failed' ? 'Payment Failed' : 'Processing Payment...'}
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6 text-lg">
          {message}
        </p>
        
        {status === 'processing' && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Please wait while we confirm your payment...</span>
          </div>
        )}
        
        {status === 'failed' && (
          <button
            onClick={() => navigate('/packages', { replace: true })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        )}
        
        {status === 'success' && (
          <div className="space-y-3">
            <div className="text-sm text-gray-500">
              You will be redirected automatically in a few seconds...
            </div>
            <button
              onClick={() => navigate('/thank-you', { replace: true })}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Continue to Confirmation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;