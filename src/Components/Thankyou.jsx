import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
// import successAnimation from '../../assets/Animation - 1741369360851.json';
import successAnimation from '../../public/assets/Animation - 1741369360851.json'

const ThankYouPage = () => {
  // Lottie animation options with improved settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Add animation classes to body when component mounts and remove on unmount
  useEffect(() => {
    // Apply the animation styles when component mounts
    const styleElement = document.createElement('style');
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);
    
    // Clean up function to remove styles when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center mt-8 md:mt-0 animate-fade-in-up">
        <div className="w-48 h-48 mx-auto mb-6">
          <Lottie 
            options={defaultOptions}
            height={190}
            width={190}
            isClickToPauseDisabled={true}
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
          Booking Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Thank you for your booking. We've sent the details to your email and WhatsApp number.
        </p>
        
        <div className="bg-purple-50 p-5 rounded-lg mb-8 text-left animate-fade-in border-l-4 border-purple-400" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-semibold text-purple-800 mb-3 text-lg">What's Next?</h2>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start animate-slide-in" style={{ animationDelay: '0.6s' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-3 mt-0.5 flex-shrink-0">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>Check your WhatsApp for booking confirmation</span>
            </li>
            <li className="flex items-start animate-slide-in" style={{ animationDelay: '0.8s' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-3 mt-0.5 flex-shrink-0">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>You'll receive a reminder 24 hours before your event</span>
            </li>
          </ul>
        </div>
        
        <Link to="/" className="inline-block bg-[#5D0072] text-white px-8 py-3 rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300 font-medium animate-bounce-subtle shadow-lg">
          Return to Home
        </Link>
        
        <p className="mt-6 text-xs text-gray-400 animate-fade-in" style={{ animationDelay: '1s' }}>
          Having trouble? <Link to="/ContactUs" className="text-purple-600 hover:underline">Contact support</Link>
        </p>
      </div>
      
      <div className="w-full max-w-md text-center mt-4 text-gray-400 text-xs animate-fade-in" style={{ animationDelay: '1.2s' }}>
        © 2025 Your Company. All rights reserved.
      </div>
    </div>
  );
};

// Animation styles defined as a constant for use in the useEffect hook
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