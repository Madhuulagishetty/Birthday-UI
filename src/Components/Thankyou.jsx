import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, CheckCircle, Clock, MapPin, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateBookingPDF } from './utilites/generateBookingPDF';
import { contextApi } from '../Components/ContextApi/Context';

const ThankYouPage = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { clearBookingData } = useContext(contextApi);

  useEffect(() => {
    // Get booking data from localStorage
    const storedBookingData = localStorage.getItem('completedBookingData');
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    // Clear the payment completion flag after a delay to prevent back navigation issues
    const timer = setTimeout(() => {
      sessionStorage.removeItem('paymentCompleted');
      localStorage.removeItem('completedBookingData'); // Clean up after 5 minutes
      clearBookingData(); // Clear context data
    }, 300000); // 5 minutes

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
      clearTimeout(timer);
    };
  }, [clearBookingData]);

  const handleDownloadPDF = async () => {
    if (!bookingData) {
      toast.error('Booking data not available for download');
      return;
    }

    try {
      setIsDownloading(true);
      
      // Generate PDF
      const pdf = generateBookingPDF(bookingData);
      
      // Create filename with booking details
      const filename = `Booking_Confirmation_${bookingData.bookingName?.replace(/\s+/g, '_')}_${bookingData.date?.replace(/\//g, '-')}.pdf`;
      
      // Download the PDF
      pdf.save(filename);
      
      toast.success('Booking confirmation downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden mt-8 md:mt-0 animate-fade-in-up">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-10 rounded-full bg-white opacity-10 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white opacity-10 -ml-10 -mb-10"></div>
          
          <div className="w-32 h-32 mx-auto mb-4 relative z-10">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
            🎉 Booking Confirmed!
          </h1>
          <p className="text-purple-100 text-lg relative z-10">
            Your celebration is all set!
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          
          {/* Quick Summary */}
          {bookingData && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Booking Summary
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-gray-600">Guest:</span>
                  <span className="ml-2 font-medium">{bookingData.NameUser || bookingData.bookingName}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="ml-2 font-medium">
                    {bookingData.date} | {bookingData.lastItem ? `${bookingData.lastItem.start}-${bookingData.lastItem.end}` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-gray-600">Package:</span>
                  <span className="ml-2 font-medium capitalize">{bookingData.slotType} Theater</span>
                </div>
                
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="ml-2 font-medium text-green-600">₹{bookingData.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Download Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Download Your Confirmation
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get a detailed PDF with all your booking information, payment details, and important instructions.
            </p>
            
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading || !bookingData}
              className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Booking Confirmation
                </>
              )}
            </button>
          </div>

          {/* What's Next Section */}
          <div className="bg-purple-50 p-6 rounded-xl mb-6 border-l-4 border-purple-400">
            <h2 className="font-semibold text-purple-800 mb-4 text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              What's Next?
            </h2>
            <ul className="text-sm text-gray-700 space-y-3">
              <li className="flex items-start animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Arrive 15 minutes early with your AADHAAR card</span>
              </li>
              <li className="flex items-start animate-slide-in" style={{ animationDelay: '0.8s' }}>
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Remaining amount will be collected before the event</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Link 
              to="/" 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 font-medium text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Return to Home
            </Link>
            
            <Link 
              to="/contact-us" 
              className="flex-1 border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 font-medium text-center"
            >
              Contact Support
            </Link>
          </div>

          {/* Footer Note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Need help? Call us at <span className="text-purple-600 font-medium">+91-9764535650</span>
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-2xl text-center mt-4 text-gray-400 text-xs">
        © 2025 Akaay Studio. All rights reserved.
      </div>
    </div>
  );
};

const animationStyles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-in {
  animation: slide-in 0.6s ease-out forwards;
  opacity: 0;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
  animation-delay: 1.5s;
}
`;

export default ThankYouPage;