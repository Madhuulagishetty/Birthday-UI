import React, { useEffect, useState } from 'react';

const TermsAndConditions = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const termsItems = [
    "We do NOT provide any movie/OTT accounts. We will do the setups using your OTT accounts/downloaded content.",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of RS. 750 plus convenience fee to book the slot."
  ];
  
  const refundPolicy = [
    "Advance amount is fully refundable if slot is cancelled at least 72 hrs before the slot time. If your slot is less than 72 hrs away from time of payment then advance is non-refundable."
  ];

  // Smooth scroll to top when component mounts and trigger animations
 useEffect(() => {
     window.scrollTo({
       top: 0,
       behavior: 'smooth'
     });
   }, []);
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white p-4  md:pt-[5%] pt-[0%]">
      <div className="max-w-4xl mx-auto">
        {/* Header with shimmer effect */}
        <div className={`text-center mb-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2 relative inline-block">
            Terms & Conditions
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
          </h1>
        </div>
        
        {/* Terms list with staggered animation */}
        <div className={`bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-8 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: '300ms' }}>
          <ol className="list-decimal pl-4 md:pl-6 space-y-4">
            {termsItems.map((item, index) => (
              <li key={index} 
                  className="text-gray-800 pb-3 border-b border-gray-100 last:border-0"
                  style={{ 
                    transitionDelay: `${400 + (index * 100)}ms`,
                    animation: isVisible ? `fadeInRight 0.5s ease-out forwards ${400 + (index * 100)}ms` : 'none',
                    opacity: 0
                  }}>
                <div className="flex items-start group">
                  <span className="transition-all duration-300 group-hover:text-blue-700">{item}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        
        {/* Refund policy with pulse animation */}
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-xl shadow-md transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: '600ms' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-800 flex items-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-pulse text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Refund Policy
          </h2>
          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            {refundPolicy.map((item, index) => (
              <p key={index} className="text-gray-700">{item}</p>
            ))}
          </div>
        </div>
        
        {/* Footer with fade in */}
        <div className={`mt-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
             style={{ transitionDelay: '900ms' }}>
          <p className="text-gray-500 text-sm">
            By booking our theater, you agree to all terms and conditions listed above.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;