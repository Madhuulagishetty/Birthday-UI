import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  CheckCircle, 
  Download, 
  Phone, 
  MessageCircle, 
  Home,
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  AlertCircle,
  Loader2,
  Info,
  Star,
  Gift
} from "lucide-react";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [backupSaved, setBackupSaved] = useState(false);

  // Get payment details from URL params
  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  // Automatic data save function after payment
  const saveDataAutomatically = async (data) => {
    try {
      const currentTime = new Date().toISOString();
      
      // Prepare data for backend
      const backupData = {
        ...data,
        paymentId: paymentId,
        orderId: orderId,
        backupSavedAt: currentTime,
        source: 'post_payment_automatic'
      };

      console.log('🔄 Automatically saving data after payment completion...');
      
      // Save to backend
      const backendPromise = fetch(`https://birthday-backend-tau.vercel.app/save-backup-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingData: backupData,
          paymentId: paymentId,
          orderId: orderId
        })
      });

      // Prepare data for SheetDB
      const sheetData = {
        name: data.bookingName || data.NameUser || 'N/A',
        email: data.email || 'N/A',
        whatsapp: data.whatsapp || 'N/A',
        address: data.address || 'N/A',
        date: data.date || 'N/A',
        time: data.lastItem ? `${data.lastItem.start} - ${data.lastItem.end}` : 'N/A',
        people: data.people || 'N/A',
        slotType: data.slotType || 'N/A',
        occasion: data.occasion || 'N/A',
        wantDecoration: data.wantDecoration ? 'Yes' : 'No',
        extraDecorations: data.extraDecorations || 'N/A',
        totalAmount: data.totalAmount || 'N/A',
        advancePaid: data.advancePaid || 'N/A',
        remainingAmount: data.remainingAmount || 'N/A',
        paymentId: paymentId || 'N/A',
        orderId: orderId || 'N/A',
        bookingId: data.id || 'N/A',
        savedAt: currentTime,
        paymentStatus: 'Completed',
        source: 'post_payment_automatic'
      };

      // Save to SheetDB
      const sheetPromise = fetch('https://sheetdb.io/api/v1/s6a0t5omac7jg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData)
      });

      // Execute both API calls simultaneously
      const [backendResponse, sheetResponse] = await Promise.allSettled([backendPromise, sheetPromise]);

      // Check results
      const backendSuccess = backendResponse.status === 'fulfilled' && backendResponse.value.ok;
      const sheetSuccess = sheetResponse.status === 'fulfilled' && sheetResponse.value.ok;

      if (backendSuccess || sheetSuccess) {
        console.log('✅ Data saved automatically after payment');
        if (backendSuccess) console.log('✅ Backend save successful');
        if (sheetSuccess) console.log('✅ SheetDB save successful');
        setBackupSaved(true);
      } else {
        console.error('❌ Failed to save data automatically');
        if (backendResponse.status === 'rejected') console.error('Backend error:', backendResponse.reason);
        if (sheetResponse.status === 'rejected') console.error('SheetDB error:', sheetResponse.reason);
      }
    } catch (error) {
      console.error('❌ Error in automatic data save:', error);
    }
  };

  useEffect(() => {
    // Check for completed booking data
    const completedData = localStorage.getItem("completedBookingData");
    const sessionPaymentCompleted = sessionStorage.getItem("paymentCompleted");
    
    if (completedData) {
      try {
        const parsedData = JSON.parse(completedData);
        setBookingData(parsedData);
        setLoading(false);
        // Automatically save data after payment
        saveDataAutomatically(parsedData);
      } catch (err) {
        console.error("Error parsing completed booking data:", err);
        setError("Error loading booking data");
        setLoading(false);
      }
    } else if (sessionPaymentCompleted === "true") {
      // Payment was completed but data might not be ready yet
      const originalBookingData = localStorage.getItem("bookingData");
      if (originalBookingData) {
        try {
          const parsedData = JSON.parse(originalBookingData);
          setBookingData(parsedData);
          setLoading(false);
          // Automatically save data after payment
          saveDataAutomatically(parsedData);
        } catch (err) {
          console.error("Error parsing booking data:", err);
          setError("Error loading booking data");
          setLoading(false);
        }
      } else {
        setError("No booking data found");
        setLoading(false);
      }
    } else {
      // No payment completion detected, redirect to home
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setError("No payment confirmation found. Redirecting...");
      setLoading(false);
    }

    // Animate in after component mounts
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, [navigate, paymentId, orderId]);

  const downloadBookingDetails = () => {
    if (!bookingData) return;

    const bookingDetails = `
🎬 AKKAY STUDIO - BOOKING CONFIRMATION 🎬
==========================================

Booking Details:
${paymentId ? `Payment ID: ${paymentId}` : ''}
${orderId ? `Order ID: ${orderId}` : ''}
${bookingData.id ? `Booking ID: ${bookingData.id}` : ''}

Customer Information:
Name: ${bookingData.bookingName || bookingData.NameUser || 'N/A'}
Email: ${bookingData.email || 'N/A'}
WhatsApp: ${bookingData.whatsapp || 'N/A'}
Address: ${bookingData.address || 'N/A'}

Event Details:
Date: ${bookingData.date || 'N/A'}
Time: ${bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : 'N/A'}
Number of People: ${bookingData.people || 'N/A'}
Slot Type: ${bookingData.slotType || 'N/A'}
Occasion: ${bookingData.occasion || 'N/A'}
Decorations: ${bookingData.wantDecoration ? 'Yes' : 'No'}
${bookingData.extraDecorations ? `Extra Decorations: ${bookingData.extraDecorations}` : ''}

Payment Information:
Total Amount: ₹${bookingData.totalAmount || 'N/A'}
Advance Paid: ₹${bookingData.advancePaid || 'N/A'}
Remaining Amount: ₹${bookingData.remainingAmount || 'N/A'}
Payment Status: Advance Paid

Important Notes:
• Please arrive 15 minutes early
• Bring your AADHAAR card for verification
• No smoking/drinking allowed inside
• Maintain cleanliness in the theater
• Remaining amount to be paid before the event

Contact Information:
Phone: +91-9764535650
WhatsApp: +91-9764535650

Generated on: ${new Date().toLocaleString()}

Thank you for choosing Akkay Studio!
🎉 We look forward to hosting your special event! 🎉
    `;

    const blob = new Blob([bookingDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akkay-studio-booking-${paymentId || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleNewBooking = () => {
    // Clear all booking data
    localStorage.removeItem("bookingData");
    localStorage.removeItem("completedBookingData");
    sessionStorage.removeItem("paymentCompleted");
    sessionStorage.removeItem("paymentId");
    sessionStorage.removeItem("orderId");
    
    // Navigate to home
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pt-16 pb-16 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading your booking...</h2>
          <p className="text-gray-600">Please wait while we fetch your booking details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pt-16 pb-16 px-4 sm:px-6 md:px-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pt-16 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto pt-8">
        <div
          className={`transition-all duration-700 transform ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 mb-4">
              🎉 Booking Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              Thank you for choosing Akkay Studio!
            </p>
            <p className="text-gray-600">
              Your special event is all set. We can't wait to host you!
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 py-6 px-8">
              <div className="flex items-center justify-center space-x-3">
                <Gift className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white text-center">
                  Booking Successful!
                </h2>
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Payment Confirmation */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 mb-8">
                <h3 className="font-bold text-xl mb-4 text-green-800 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  Payment Confirmed
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-sm font-semibold text-green-700">{paymentId}</span>
                      </div>
                    )}
                    {orderId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-sm font-semibold text-green-700">{orderId}</span>
                      </div>
                    )}
                    {bookingData?.id && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-mono text-sm font-semibold text-green-700">{bookingData.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Confirmed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Advance Paid
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              {bookingData && (
                <div className="space-y-6 mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-purple-600" />
                    Event Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-600">Customer Name</div>
                          <div className="font-semibold text-gray-800">
                            {bookingData.bookingName || bookingData.NameUser || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Event Date</div>
                          <div className="font-semibold text-gray-800">{bookingData.date || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Time Slot</div>
                          <div className="font-semibold text-gray-800">
                            {bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl">
                        <Users className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-sm text-gray-600">Number of Guests</div>
                          <div className="font-semibold text-gray-800">{bookingData.people || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-pink-600" />
                        <div>
                          <div className="text-sm text-gray-600">Venue Type</div>
                          <div className="font-semibold text-gray-800">{bookingData.slotType || 'Standard'}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
                        <Gift className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="text-sm text-gray-600">Occasion</div>
                          <div className="font-semibold text-gray-800">{bookingData.occasion || 'Special Event'}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl">
                        <Star className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="text-sm text-gray-600">Decorations</div>
                          <div className="font-semibold text-gray-800">
                            {bookingData.wantDecoration ? 'Yes' : 'No'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                        <CreditCard className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-sm text-gray-600">Advance Paid</div>
                          <div className="font-semibold text-gray-800">
                            ₹{bookingData.advancePaid || '1012.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <button
                  onClick={downloadBookingDetails}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                
                <a
                  href="tel:+919764535650"
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Us</span>
                </a>
                
                <a
                  href="https://wa.me/919764535650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handleNewBooking}
                  className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
              </div>

              {/* Important Information */}
              <div className="space-y-6">
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Important Information
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• <strong>Data Saved:</strong> Your booking has been automatically saved to our database and Google Sheets</li>
                    <li>• <strong>Backup Protection:</strong> {backupSaved ? 
                      <span className="text-green-600">✅ Additional backup saved successfully</span> : 
                      <span className="text-orange-600">🔄 Creating backup...</span>
                    }</li>
                    <li>• <strong>WhatsApp Confirmation:</strong> You'll receive a detailed confirmation message shortly</li>
                    <li>• <strong>Arrival Time:</strong> Please arrive 15 minutes early with your AADHAAR card</li>
                    <li>• <strong>Remaining Payment:</strong> The balance amount will be collected before your event</li>
                    <li>• <strong>Contact:</strong> For any queries, call/WhatsApp +91-9764535650</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    What's Next?
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <h5 className="font-semibold mb-2">Before Your Event:</h5>
                      <ul className="space-y-1">
                        <li>1. You'll receive WhatsApp confirmation</li>
                        <li>2. We'll send a reminder 24 hours before</li>
                        <li>3. Prepare your AADHAAR card for entry</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">On Event Day:</h5>
                      <ul className="space-y-1">
                        <li>1. Arrive 15 minutes early</li>
                        <li>2. Pay remaining amount at venue</li>
                        <li>3. Enjoy your special celebration!</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mobile Payment Success Note */}
                {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Mobile Payment Successful!
                    </h4>
                    <p className="text-sm text-green-700">
                      Your payment via PhonePe/GPay/UPI has been successfully processed and your booking data has been automatically saved to our system. 
                      Thank you for your payment!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Message */}
              <div className="text-center pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 mb-2">
                  🎬 Akkay Studio 🎬
                </h3>
                <p className="text-gray-600 mb-4">
                  Making your special moments unforgettable!
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>📞 +91-9764535650</span>
                  <span>•</span>
                  <span>📧 info@akkaystudio.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;