import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../index";
import { contextApi } from "../ContextApi/Context";

const TermsMain = () => {
  const navigate = useNavigate();
  const { triggerBookingRefresh } = useContext(contextApi);
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

    // Clean up any existing polling interval
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
    "We collect an advance amount of ₹1000 to book the slot. The remaining amount will be collected Before The Event .",
    "Customers will be liable to pay in case of any damage to the theater caused by them. Cleaning fees up to Rs 500 will be charged in cases where significant cleaning would be required after check out.",
  ];

  const Refund = [
    "Refund Policy If Slot Is Cancelled Advance Amount Non-Refundable. Then You Get The Chance To Reschedule Your Slot.",
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
      const response = await fetch("http://localhost:3000/create-order", {
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

  // Polling function to check payment status
  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/check-payment-status/${orderId}`,
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

  // Start polling for payment status
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

        // Store booking data and redirect
        localStorage.setItem(
          "completedBookingData",
          JSON.stringify(result.bookingData)
        );
        localStorage.removeItem("bookingData");
        sessionStorage.setItem("paymentCompleted", "true");

        triggerBookingRefresh();
        toast.success("Booking confirmed! Check your WhatsApp for details.");

        setTimeout(() => {
          navigate("/thank-you");
        }, 2000);
      } else if (result.status === "failed") {
        clearInterval(interval);
        setPollingInterval(null);
        setPaymentStatus("failed");
        setIsProcessing(false);
        toast.error("Payment failed. Please try again.");
      } else if (pollCount >= maxPolls) {
        // Timeout after 5 minutes
        clearInterval(interval);
        setPollingInterval(null);
        setIsProcessing(false);
        toast.error(
          "Payment verification timeout. If payment was deducted, it will be processed automatically."
        );
      }
    }, 2000); // Check every 2 seconds

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
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentStatus("pending");

      if (!razorpayInitialized) {
        const res = await initializeRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load");
          setIsProcessing(false);
          return;
        }
      }

      const order = preCreatedOrder || (await createOrder());

      // Start polling for payment status
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
            toast.info("Payment successful! Verifying booking...");

            // Try to verify payment immediately as fallback
            try {
              const verifyResponse = await fetch(
                "http://localhost:3000/verify-payment",
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
                  // Stop polling
                  if (pollingInterval) {
                    clearInterval(pollingInterval);
                    setPollingInterval(null);
                  }

                  setPaymentStatus("success");

                  // Store booking data and redirect
                  localStorage.setItem(
                    "completedBookingData",
                    JSON.stringify(result.savedBooking)
                  );
                  localStorage.removeItem("bookingData");
                  sessionStorage.setItem("paymentCompleted", "true");

                  triggerBookingRefresh();
                  toast.success(
                    "Booking confirmed! Check your WhatsApp for details."
                  );

                  setTimeout(() => {
                    navigate("/thank-you");
                  }, 2000);
                }
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              // Continue with polling as fallback
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
              // Stop polling if user closes the modal
              if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
              }
              setIsProcessing(false);
              setPaymentStatus("pending");
            },

            // Handle payment failure
            escape: true,
            backdropclose: false,
          },

          retry: {
            enabled: true,
            max_count: 3,
          },
        };

        const paymentObject = new window.Razorpay(options);

        // Handle payment failure
        paymentObject.on("payment.failed", function (response) {
          console.log("Payment failed:", response);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          setIsProcessing(false);
          setPaymentStatus("failed");
          toast.error("Payment failed. Please try again.");
        });

        paymentObject.open();
      }, 300);
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Your Internet Connection is Slow. Please try again.");
      setIsProcessing(false);
      setPaymentStatus("pending");
    }
  };

  useEffect(() => {
    if (isChecked && payButtonRef.current) {
      payButtonRef.current.classList.add("button-pulse");
    } else if (payButtonRef.current) {
      payButtonRef.current.classList.remove("button-pulse");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 to-pink-50 pt-16 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto pt-[3%]">
        <div
          className={`transition-all duration-500 transform ${
            animateIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-4 px-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                Terms & Conditions
              </h1>
            </div>

            <div className="p-6 md:p-8">
              <div
                className={`space-y-6 transition-all duration-700 delay-300 ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <ol className="list-decimal pl-6 space-y-4">
                  {termsItems.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-800 border-b border-gray-100 last:border-0 transition-all duration-300"
                      style={{
                        transitionDelay: `${300 + index * 50}ms`,
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

                <div
                  className="mt-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                  style={{
                    transitionDelay: "800ms",
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <h2 className="text-xl font-bold mb-3 text-purple-800 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Refund Policy
                  </h2>
                  <p className="text-gray-700">{Refund}</p>
                </div>

                <div
                  className="mt-8"
                  style={{
                    transitionDelay: "900ms",
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700 font-medium">
                      I have read and agree to the terms and conditions
                    </span>
                  </label>
                </div>

                {/* Payment Status Display */}
                {(paymentStatus !== "pending" || isProcessing) && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      paymentStatus === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : paymentStatus === "failed"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : isProcessing
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {paymentStatus === "success" && (
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {paymentStatus === "failed" && (
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="font-medium">
                        {getPaymentStatusMessage()}
                      </span>

                      {isProcessing && paymentStatus === "pending" && (
                        <div className="mt-3">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">
                              Verifying payment...
                            </span>
                          </div>
                          <p className="text-xs mt-2 text-blue-600">
                            If this takes too long, the payment was successful
                            and will be processed shortly.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {bookingData && (
                  <div
                    className="mt-6"
                    style={{
                      transitionDelay: "1000ms",
                      opacity: animateIn ? 1 : 0,
                      transform: animateIn
                        ? "translateY(0)"
                        : "translateY(20px)",
                    }}
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg shadow-inner mb-6">
                      <h3 className="font-semibold text-lg mb-3 text-purple-800">
                        Booking Summary
                      </h3>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">
                            Total Amount:
                          </span>
                          <span className="text-xl font-bold text-pink-600">
                            ₹{amountWithTax.toFixed(2)}
                          </span>
                        </div>

                        <div className="h-px bg-purple-100 my-2"></div>

                        <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                          <span className="text-gray-800 font-medium">
                            Advance Payment:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{baseAdvanceAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm pl-2">
                          <span className="text-gray-600">
                            Convenience fee:
                          </span>
                          <span className="text-gray-700">
                            ₹{convenienceFee.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-green-100 p-2 rounded">
                          <span className="text-gray-800 font-medium">
                            Advance Payment (Now):
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{advanceAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-yellow-50 p-2 rounded">
                          <span className="text-gray-800 font-medium">
                            Remaining (After Event):
                          </span>
                          <span className="text-lg font-bold text-yellow-600">
                            ₹{remainingAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      ref={payButtonRef}
                      onClick={handlePayment}
                      disabled={
                        !isChecked ||
                        isProcessing ||
                        paymentStatus === "success"
                      }
                      className={`w-full rounded-lg py-4 font-medium text-lg transition-all duration-300 transform ${
                        isChecked && paymentStatus !== "success"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:-translate-y-1"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {getPaymentStatusMessage() || "Processing..."}
                        </span>
                      ) : paymentStatus === "success" ? (
                        "Payment Successful!"
                      ) : (
                        `Pay Advance ₹${formatCurrency(advanceAmount)}`
                      )}
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      By clicking the button above, you agree to our Terms and
                      Conditions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(237, 100, 166, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(237, 100, 166, 0);
          }
        }

        .button-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default TermsMain;
