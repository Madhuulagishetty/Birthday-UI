import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 ">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center mt-[25%] md:mt-[0%]">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your booking. We've sent the details to your email and WhatsApp number.
        </p>
        
        <div className="bg-purple-50 p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold text-purple-800 mb-2">What's Next?</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2 mt-0.5">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Check your WhatsApp for booking confirmation
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2 mt-0.5">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              You'll receive a reminder 24 hours before your event
            </li>
          </ul>
        </div>
        
        <Link to="/" className="inline-block bg-[#5D0072] text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-all">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;