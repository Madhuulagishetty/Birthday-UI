import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id');
        const orderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id');
        const signature = searchParams.get('razorpay_signature');

        console.log("Payment callback received:", { paymentId, orderId, signature });

        if (paymentId && orderId) {
          // Mark payment as completed
          sessionStorage.setItem('paymentCompleted', 'true');
          sessionStorage.setItem('paymentId', paymentId);
          sessionStorage.setItem('orderId', orderId);

          setStatus("success");
          setMessage("Payment successful! Redirecting to confirmation page...");

          // Redirect to thank you page after a short delay
          setTimeout(() => {
            navigate(`/thank-you?payment_id=${paymentId}&order_id=${orderId}`, { replace: true });
          }, 2000);
        } else {
          // Check if this is a failure case
          const error = searchParams.get('error');
          if (error) {
            setStatus("failed");
            setMessage("Payment failed. Please try again.");
            
            setTimeout(() => {
              navigate("/terms-conditions", { replace: true });
            }, 3000);
          } else {
            // No payment data found, redirect to terms
            setStatus("warning");
            setMessage("No payment information found. Redirecting...");
            
            setTimeout(() => {
              navigate("/terms-conditions", { replace: true });
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error processing payment callback:", error);
        setStatus("failed");
        setMessage("Error processing payment. Please contact support.");
        
        setTimeout(() => {
          navigate("/terms-conditions", { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-600" />;
      case "failed":
        return <XCircle className="w-16 h-16 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-16 h-16 text-yellow-600" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case "success":
        return "from-green-50 via-emerald-50 to-green-100";
      case "failed":
        return "from-red-50 via-pink-50 to-red-100";
      case "warning":
        return "from-yellow-50 via-orange-50 to-yellow-100";
      default:
        return "from-blue-50 via-indigo-50 to-blue-100";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          {getIcon()}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Failed"}
          {status === "warning" && "Processing..."}
          {status === "processing" && "Processing Payment..."}
        </h2>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        {status === "processing" && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
            <p className="text-sm text-gray-500">Please wait while we process your payment...</p>
          </div>
        )}
        
        {status === "failed" && (
          <button
            onClick={() => navigate("/terms-conditions")}
            className="bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;