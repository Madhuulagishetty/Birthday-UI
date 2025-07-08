import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  Info,
  Shield,
} from "lucide-react";

const TermsMain = () => {
  const navigate = useNavigate();
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

  // Production backend URL
  const BACKEND_URL = "https://birthday-backend-tau.vercel.app";

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    const maxPolls = 150; // 5 minutes at 2-second intervals

    const interval = setInterval(async () => {
      pollCount++;
      const result = await checkPaymentStatus(orderId);

      if (result.status === "success") {
        clearInterval(interval);
        setPollingInterval(null);
        setPaymentStatus("success");

        localStorage.setItem(
          "completedBookingData",
          JSON.stringify(result.bookingData)
        );
        localStorage.removeItem("bookingData");
        sessionStorage.setItem("paymentCompleted", "true");

        addNotification(
          "success",
          "Booking confirmed! Check your WhatsApp for details."
        );

        setTimeout(() => {
          navigate("/thank-you");
        }, 2000);
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
        addNotification(
          "warning",
          "Payment verification timeout. If payment was deducted, it will be processed automatically."
        );
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

                  localStorage.setItem(
                    "completedBookingData",
                    JSON.stringify(result.savedBooking)
                  );
                  localStorage.removeItem("bookingData");
                  sessionStorage.setItem("paymentCompleted", "true");

                  addNotification(
                    "success",
                    "Booking confirmed! Check your WhatsApp for details."
                  );

                  setTimeout(() => {
                    navigate("/thank-you");
                  }, 2000);
                }
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
            }
          },

          prefill: {
            contact: bookingData?.whatsapp || "",
            email: bookingData?.email || "",
          },

          theme: {
            color: "#5D0072",
          },

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

          retry: {
            enabled: true,
            max_count: 3,
          },
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
      addNotification(
        "error",
        "Your Internet Connection is Slow. Please try again."
      );
      setIsProcessing(false);
      setPaymentStatus("pending");
    }
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
        return "Payment successful! Redirecting...";
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
        return isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        ) : null;
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
      <div
        className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg transition-all duration-300 ${
          colors[notification.type]
        }`}
      >
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
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            )
          }
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
              {/* Terms List */}
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
                  <p className="text-gray-700 leading-relaxed">
                    {refundPolicy[0]}
                  </p>
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
                      <div
                        className={`w-6 h-6 rounded-md border-2 transition-all duration-300 ${
                          isChecked
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300 group-hover:border-purple-400"
                        }`}
                      >
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
                  <div
                    className={`mt-6 p-4 rounded-2xl border ${
                      paymentStatus === "success"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : paymentStatus === "failed"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
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
                          <span className="text-sm">Verifying payment...</span>
                        </div>
                        <p className="text-xs mt-2 text-blue-600">
                          If this takes too long, the payment was successful and
                          will be processed shortly.
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
                      transform: animateIn
                        ? "translateY(0)"
                        : "translateY(20px)",
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
                          <span className="text-gray-600">
                            Convenience fee:
                          </span>
                          <span className="text-gray-700">
                            ₹{convenienceFee.toFixed(2)}
                          </span>
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
                          <span>
                            {getPaymentStatusMessage() || "Processing..."}
                          </span>
                        </span>
                      ) : paymentStatus === "success" ? (
                        <span className="flex items-center justify-center space-x-3">
                          <CheckCircle className="w-6 h-6" />
                          <span>Payment Successful!</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-3">
                          <CreditCard className="w-6 h-6" />
                          <span>
                            Pay Advance ₹{formatCurrency(advanceAmount)}
                          </span>
                        </span>
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Secure payment powered by Razorpay • Your data is
                      protected
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsMain;
