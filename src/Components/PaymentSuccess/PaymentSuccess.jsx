import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader,
  Clock,
  Database,
  RefreshCw,
  ArrowRight,
  Home,
  Download,
  Phone,
  Calendar,
  MapPin,
  Users,
  Star,
} from "lucide-react";

const serverUrl = "http://localhost:3001";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("checking");
  const [bookingData, setBookingData] = useState(null);
  const [dataStorageStatus, setDataStorageStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  // Get payment link ID from URL params or localStorage
  const paymentLinkId =
    searchParams.get("payment_link_id") ||
    searchParams.get("paymentLinkId") ||
    localStorage.getItem("currentPaymentLinkId");

  const addNotification = (type, message, autoRemove = true) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, message }]);

    if (autoRemove) {
      setTimeout(
        () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        },
        type === "error" ? 8000 : 5000
      );
    }
  };

  useEffect(() => {
    console.log("🎉 Payment Success page loaded");
    console.log("Payment Link ID:", paymentLinkId);
    console.log("URL Search Params:", Object.fromEntries(searchParams));

    if (paymentLinkId) {
      // Small delay to allow page to render
      setTimeout(() => {
        verifyPaymentStatus();
      }, 1000);
    } else {
      console.error("❌ No payment link ID found");
      setPaymentStatus("error");
      addNotification(
        "error",
        "Payment link ID not found. Please contact support."
      );
    }
  }, [paymentLinkId]);

  const verifyPaymentStatus = async (attempt = 1) => {
    const maxAttempts = 10;

    try {
      console.log(
        `🔍 Payment verification attempt ${attempt}/${maxAttempts} for: ${paymentLinkId}`
      );
      setPaymentStatus("checking");

      if (attempt === 1) {
        addNotification("info", "Verifying your payment...", false);
      }

      const response = await fetch(
        `${serverUrl}/payment-status/${paymentLinkId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(
        `📊 Payment verification result (attempt ${attempt}):`,
        result
      );

      if (result.success && result.status === "paid") {
        await handlePaymentSuccess(result);
      } else if (result.needsRecovery) {
        console.log(`🔄 Payment needs recovery`);
        await attemptRecovery();
      } else if (result.status === "processing") {
        console.log(`⏳ Payment still processing...`);
        if (attempt < maxAttempts) {
          const delay = Math.min(3000 * attempt, 15000);
          setTimeout(() => {
            verifyPaymentStatus(attempt + 1);
          }, delay);
        } else {
          handleVerificationTimeout();
        }
      } else {
        console.log(`❓ Unexpected payment status: ${result.status}`);
        handleUnexpectedStatus(result);
      }
    } catch (error) {
      console.error(
        `❌ Payment verification failed (attempt ${attempt}):`,
        error
      );

      if (attempt < maxAttempts) {
        const delay = Math.min(2000 * attempt, 10000);
        console.log(`🔄 Retrying in ${delay}ms...`);

        setTimeout(() => {
          verifyPaymentStatus(attempt + 1);
        }, delay);
      } else {
        handleVerificationError();
      }
    }
  };

  const handlePaymentSuccess = async (result) => {
    try {
      console.log("✅ Payment verification successful");
      setPaymentStatus("success");
      setDataStorageStatus(result.dataStored);

      // Clear notifications and show success
      setNotifications([]);

      // Get booking data from result or localStorage
      const completedBooking =
        result.bookingData ||
        JSON.parse(localStorage.getItem("bookingData") || "{}");

      const enhancedBookingData = {
        ...completedBooking,
        paymentId: result.paymentDetails?.id || result.paymentId,
        paymentLinkId: paymentLinkId,
        advancePaid: 1026,
        remainingAmount: completedBooking.totalAmount - 1026,
        paymentStatus: "advance_paid",
        bookingConfirmed: true,
        completedAt: new Date().toISOString(),
        dataStored: result.dataStored,
      };

      setBookingData(enhancedBookingData);

      // Store completed booking data
      localStorage.setItem(
        "completedBookingData",
        JSON.stringify(enhancedBookingData)
      );
      localStorage.removeItem("currentPaymentLinkId");
      localStorage.removeItem("bookingData");

      // Show storage status
      const storageMsg = result.dataStored
        ? `Data saved: Firebase(${
            result.dataStored.firebase ? "✅" : "❌"
          }), Sheets(${result.dataStored.sheets ? "✅" : "❌"})`
        : "Data storage status unknown";

      addNotification(
        "success",
        `Payment completed successfully! ${storageMsg}`
      );
    } catch (error) {
      console.error("Error handling payment success:", error);
      setPaymentStatus("error");
      addNotification(
        "error",
        "Payment successful but data processing failed. Please contact support."
      );
    }
  };

  const attemptRecovery = async () => {
    if (isRecovering) return;

    try {
      setIsRecovering(true);
      setPaymentStatus("recovering");
      addNotification("info", "Recovering payment data...", false);

      const storedBookingData = JSON.parse(
        localStorage.getItem("bookingData") || "{}"
      );

      const response = await fetch(`${serverUrl}/recover-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentLinkId,
          bookingData: storedBookingData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Recovery failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Recovery result:", result);

      if (result.success && result.status === "recovered") {
        await handlePaymentSuccess(result);
      } else {
        throw new Error(result.message || "Recovery failed");
      }
    } catch (error) {
      console.error("Recovery failed:", error);
      setPaymentStatus("error");
      addNotification(
        "error",
        `Recovery failed: ${error.message}. Please contact support.`
      );
    } finally {
      setIsRecovering(false);
    }
  };

  const handleVerificationTimeout = () => {
    setPaymentStatus("timeout");
    addNotification(
      "warning",
      "Payment verification timed out. Please try manual recovery or contact support."
    );
  };

  const handleVerificationError = () => {
    setPaymentStatus("error");
    addNotification(
      "error",
      "Unable to verify payment status. Please try manual recovery or contact support."
    );
  };

  const handleUnexpectedStatus = (result) => {
    setPaymentStatus("pending");
    addNotification(
      "warning",
      `Payment status: ${result.status}. Please wait or contact support if this persists.`
    );
  };

  const handleManualRecovery = () => {
    setRetryCount((prev) => prev + 1);
    attemptRecovery();
  };

  const handleStatusRecheck = () => {
    setRetryCount((prev) => prev + 1);
    verifyPaymentStatus();
  };

  const downloadReceipt = () => {
    if (!bookingData) return;

    const receiptData = {
      bookingId: bookingData.paymentId || "N/A",
      customerName: bookingData.bookingName || "N/A",
      date: bookingData.date || "N/A",
      time: bookingData.selectedTimeSlot
        ? `${bookingData.selectedTimeSlot.start} - ${bookingData.selectedTimeSlot.end}`
        : "N/A",
      people: bookingData.people || "N/A",
      totalAmount: bookingData.totalAmount || 0,
      advancePaid: 1026,
      remainingAmount: (bookingData.totalAmount || 0) - 1026,
      paymentDate: new Date().toLocaleDateString(),
      paymentTime: new Date().toLocaleTimeString(),
    };

    const receiptText = `
THEATER BOOKING RECEIPT
=======================

Booking ID: ${receiptData.bookingId}
Customer: ${receiptData.customerName}
Date: ${receiptData.date}
Time: ${receiptData.time}
People: ${receiptData.people}

PAYMENT DETAILS:
Total Amount: ₹${receiptData.totalAmount}
Advance Paid: ₹${receiptData.advancePaid}
Remaining: ₹${receiptData.remainingAmount}

Payment Date: ${receiptData.paymentDate}
Payment Time: ${receiptData.paymentTime}

Thank you for your booking!
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receiptData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg transition-all duration-300 max-w-sm ${
          colors[notification.type]
        }`}
      >
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

  const StatusDisplay = () => {
    switch (paymentStatus) {
      case "checking":
        return (
          <div className="text-center py-12">
            <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Verifying Your Payment
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your payment...
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                This may take a few moments. Please do not close this page.
              </p>
            </div>
          </div>
        );

      case "recovering":
        return (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recovering Payment Data
            </h2>
            <p className="text-gray-600 mb-6">
              We're retrieving your booking information...
            </p>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm">
                Your payment was successful. We're just ensuring your booking is
                saved properly.
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your theater booking has been confirmed.
            </p>

            {/* Booking Details */}
            {bookingData && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl shadow-inner mb-8 text-left">
                <h3 className="font-bold text-xl mb-6 text-center text-gray-800 flex items-center justify-center">
                  <Calendar className="w-6 h-6 mr-3 text-green-600" />
                  Booking Confirmation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Customer Name</p>
                        <p className="font-semibold">
                          {bookingData.bookingName || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">
                          {bookingData.date || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold">
                          {bookingData.selectedTimeSlot
                            ? `${bookingData.selectedTimeSlot.start} - ${bookingData.selectedTimeSlot.end}`
                            : "Time not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Number of People
                        </p>
                        <p className="font-semibold">
                          {bookingData.people || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <p className="font-semibold">
                          {bookingData.whatsapp || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">
                          {bookingData.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-lg mb-4 text-center">
                    Payment Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{bookingData.totalAmount || 0}
                      </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Advance Paid</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{bookingData.advancePaid || 10}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className="text-xl font-bold text-orange-600">
                        ₹{bookingData.remainingAmount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Storage Status */}
            {dataStorageStatus && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-6">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center justify-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Storage Status
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div
                    className={`flex items-center justify-center space-x-2 ${
                      dataStorageStatus.firebase
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {dataStorageStatus.firebase ? "✅" : "❌"}
                    <span>Firebase Database</span>
                  </div>
                  <div
                    className={`flex items-center justify-center space-x-2 ${
                      dataStorageStatus.sheets
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {dataStorageStatus.sheets ? "✅" : "❌"}
                    <span>Google Sheets</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadReceipt}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        );

      case "timeout":
      case "pending":
      case "error":
        return (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {paymentStatus === "timeout"
                ? "Verification Timeout"
                : paymentStatus === "pending"
                ? "Payment Pending"
                : "Verification Error"}
            </h2>
            <p className="text-gray-600 mb-8">
              {paymentStatus === "timeout"
                ? "Payment verification took too long. You can try manual recovery."
                : paymentStatus === "pending"
                ? "Your payment may still be processing."
                : "Unable to verify your payment status automatically."}
            </p>

            {/* Manual Recovery Options */}
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-8">
              <h3 className="font-semibold text-yellow-800 mb-4 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Manual Recovery Options
              </h3>
              <p className="text-yellow-700 text-sm mb-4">
                If you've completed the payment but this page shows an error,
                try these options:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleStatusRecheck}
                  disabled={isRecovering}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRecovering ? "animate-spin" : ""}`}
                  />
                  <span>Check Status Again</span>
                </button>

                <button
                  onClick={handleManualRecovery}
                  disabled={isRecovering}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  <span>Recover Data</span>
                </button>
              </div>

              {retryCount > 0 && (
                <p className="text-yellow-600 text-xs mt-3">
                  Retry attempts: {retryCount}
                </p>
              )}
            </div>

            {/* Support Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
              <p className="text-blue-700 text-sm">
                If the issue persists, please contact our support team with your
                payment link ID:
                <span className="font-mono bg-white px-2 py-1 rounded ml-1">
                  {paymentLinkId}
                </span>
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Loader className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Processing...
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-16 pb-16 px-4 sm:px-6 md:px-8">
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-blue-500 to-purple-600 py-6 px-8">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Payment Status
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <StatusDisplay />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Important Information
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                • Your booking is confirmed even if you closed the payment app
              </p>
              <p>• Data is automatically saved to our secure servers</p>
              <p>
                • You will receive confirmation details on your registered
                WhatsApp
              </p>
              <p>• Please arrive 15 minutes before your scheduled time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
