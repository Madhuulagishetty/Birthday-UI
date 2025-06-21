import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Animation effect on component mount (with a slight delay to allow scroll to complete)
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, []);

  const handleSubmit = () => {
    if (!isChecked) return;
    
    // Navigate to the next page or home page
    navigate('/');
  };

  // Terms and conditions items
  const termsItems = [
    "By using our services, you agree to be bound by these Terms and Conditions.",
    "Bookings are subject to availability and confirmation.",
    "Personal information provided will be used in accordance with our Privacy Policy.",
    "We reserve the right to modify or cancel services due to unforeseen circumstances.",
    "Customers are responsible for providing accurate contact and personal information.",
    "We may use your feedback and reviews for promotional purposes.",
    "Prices and offerings are subject to change without prior notice.",
    "You must be at least 18 years old to use our services."
  ];

  // Refund policy text
  const Refund = "Cancellations made 48 hours before the scheduled service are eligible for a full refund. Cancellations within 48 hours may be subject to a cancellation fee. No-shows will be charged the full amount. Refunds will be processed within 5-7 business days.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 to-pink-50 pt-16 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto pt-[3%]">
        <div className={`transition-all duration-500 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-300 bg-white p-2 rounded-md mt-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span className="ml-2 text-lg font-medium">Back</span>
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-4 px-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Terms & Conditions</h1>
            </div>
            
            <div className="p-6 md:p-8">
              <div className={`space-y-6 transition-all duration-700 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <ol className="list-decimal pl-6 space-y-4">
                  {termsItems.map((item, index) => (
                    <li 
                      key={index} 
                      className="text-gray-800 pb-3 border-b border-gray-100 last:border-0 transition-all duration-300"
                      style={{ 
                        transitionDelay: `${300 + (index * 50)}ms`,
                        opacity: animateIn ? 1 : 0,
                        transform: animateIn ? 'translateX(0)' : 'translateX(-20px)'
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ol>
                
                <div 
                  className="mt-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                  style={{ 
                    transitionDelay: '800ms',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <h2 className="text-xl font-bold mb-3 text-purple-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Refund Policy
                  </h2>
                  <p className="text-gray-700">{Refund}</p>
                </div>

                <div 
                  className="mt-8"
                  style={{ 
                    transitionDelay: '900ms',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700 font-medium">I have read and agree to the terms and conditions</span>
                  </label>
                </div>

                <div 
                  className="mt-6"
                  style={{ 
                    transitionDelay: '1000ms',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <button
                    onClick={handleSubmit}
                    disabled={!isChecked}
                    className={`w-full rounded-lg py-4 font-medium text-lg transition-all duration-300 transform ${
                      isChecked ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    I Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;