import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ChevronRight, Star, ArrowUp } from 'lucide-react';
import ScrollToTop from '../ScrollTop';


const Package = () => {
  const navigates = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);



  const HandleHome=()=>{
    navigates('/')
  }

  // Smooth scroll to top when component mounts and trigger animations
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Set timeout to start animations after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  });

  // Handler for Read More button
  const handleReadMore = () => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Toggle show more state
   
  };

  const handleshowmore=()=>{
    setShowMore(!showMore);
  }

  // Handler for the Book Now button
 const HandleBookNow=()=>{
  navigate("/")
 }
  const navigate = useNavigate();
  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 via-purple-600 to-pink-700 py-14 px-5 w-full flex justify-center items-center flex-col pt-[5%] pb-[3%] overflow-hidden">
      <ScrollToTop />
      
      {/* Animated stars background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `twinkle ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className={`fontCursive text-white mt-[30%] md:mt-[0%] text-3xl md:text-5xl text-center mb-2 transform transition-all duration-1000  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
         <p>Note:- Decore Will Be Changes In Every 15-20 Days</p>
        <p> Our Packages</p>
      </div>
      
      <div className={`w-24 h-1 bg-yellow-300 rounded-full mb-10 transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      
      <div className="flex flex-col md:flex-row justify-center gap-14 md:gap-8 items-center w-[100%] md:w-[100%] ">
        {/* delax Package */}
        <div
          className={`bg-white md:p-4 p-2 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[100%] md:w-[37%] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={"/assets/rolexe-theater-T1.jpg"}
              alt="Akaay Studio Thane"
              title="Akaay Studio Thane"
              className="rounded-xl w-full h-48 md:h-64 object-cover transform transition duration-700 hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              <span>Popular</span>
            </div>
          </div>
          
          <h3 className="text-red-600 font-bold text-lg md:text-xl mt-4 text-center">
            Rolexe Theater T1
          </h3>
          
          <div className="w-16 h-1 bg-red-300 mx-auto my-2 rounded-full"></div>
          
          <p className="text-gray-700 text-start text-sm md:text-base mt-2 mb-3 px-2 font-semibold">
            For 6 or less: Rs 2000 with decoration for 2.30 hrs
          </p>
          
        
            <div className="text-gray-700 text-sm md:text-base px-3 mb-4 animate-fade-in">
              <p className="mb-2 font-semibold">
                Enjoy our most popular theater experience, perfect for intimate gatherings. 
                This package includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {/* <li>Comfortable seating for up to 4 people</li> */}
                {/* <li></li> */}
                <li>Premium sound system</li>
                <li> Balloon Arch Setup</li>
                <li> Candles and Light Setup</li>
                <li> Birthday / Anniversary Neon Lights</li>
                <li> Rose Petal Setup on Table</li>
                <li> Floor Balloon Setup</li>
                <li> Special Custom Message or Name Display on LED Screen</li>
                <li>8X12 Mini Theater Screen</li>
                <li>We'll Display the Pictures or Videos on the Mini Theater Screen as per the Customer</li>
              </ul>
            </div>
         
          
          <div className="flex justify-center flex-wrap gap-2 mt-3">
           
            
            <button 
              onClick={HandleHome}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors duration-300"
            >
              Select Package
            </button>
          </div>
        </div>

        {/* Relexe Package */}
        <div
          className={`bg-white md:p-4 p-2 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[100%] md:w-[37%] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={"assets/package-delux-changed.jpg"}
              
              alt="Akaay Studio Thane"
              title="Akaay Studio Thane"
              className="rounded-xl w-full h-48 md:h-64 object-cover transform transition duration-700 hover:scale-110"
            />
            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              <span>Premium</span>
            </div>
          </div>
          
          <h3 className="text-blue-600 font-bold text-lg md:text-xl mt-4 text-center">
            Deluxe Theater T2
          </h3>
          
          <div className="w-16 h-1 bg-blue-300 mx-auto my-2 rounded-full"></div>
          
          <p className="text-gray-700 text-start text-sm md:text-base mt-2 mb-3 px-2 font-semibold">
            For 10 or less: Rs 2500 with decoration for 2.30 hrs
          </p>
          
       
            <div className="text-gray-700 text-sm md:text-base px-3 mb-4 animate-fade-in">
              <p className="mb-2 font-semibold">
                Experience our premium theater setup, perfect for larger groups and special occasions. 
                This package includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Premium sound system</li>
                <li> Balloon Arch Setup</li>
                <li> Candles and Light Setup</li>
                <li> Birthday / Anniversary Neon Lights</li>
                <li> Rose Petal Setup on Table</li>
                <li> Floor Balloon Setup</li>
                <li> Special Custom Message or Name Display on LED Screen</li>
                <li>8X12 Mini Theater Screen</li>
                <li>We'll Display the Pictures or Videos on the Mini Theater Screen as per the Customer</li>
              
              </ul>
            </div>
        
          
          <div className="flex justify-center flex-wrap gap-2 mt-3">
            
            
            <button 
             onClick={HandleHome}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors duration-300"
            >
              Select Package
            </button>
          </div>
        </div>
      </div>

      <div className={`flex justify-center mt-8 md:mt-12 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ transitionDelay: "0.6s" }}>
        <button 
          onClick={HandleBookNow} 
          className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-gray-800 transition-all duration-500 flex items-center space-x-2 transform hover:scale-105 hover:shadow-xl text-sm md:text-base group"
        >
          <span>Book Now</span>
          <ChevronRight size={20} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1da851] transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
         <svg 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        fill="white" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M17.6 6.32A8.62 8.62 0 0 0 12.22 4C7.73 4 4.1 7.66 4.1 12.14c0 1.42.38 2.84 1.06 4.08L4 20l3.92-1.03a8.46 8.46 0 0 0 4.3 1.18h.02c4.5 0 8.13-3.67 8.13-8.14a8.1 8.1 0 0 0-2.77-5.69zm-5.38 12.53h-.02a7.09 7.09 0 0 1-3.62-.99l-.25-.15-2.66.7.7-2.62-.17-.27a7.06 7.06 0 0 1-1.07-3.78c0-3.83 3.12-6.96 6.95-6.96a6.84 6.84 0 0 1 4.91 2.04 6.88 6.88 0 0 1 2.04 4.94c0 3.83-3.11 6.97-6.93 6.97zm3.8-5.2c-.2-.11-1.23-.62-1.42-.69-.19-.07-.33-.1-.47.1-.14.22-.54.7-.66.84-.12.14-.24.15-.44.05-.2-.1-.86-.31-1.63-1a6.13 6.13 0 0 1-1.13-1.4c-.12-.2-.01-.3.09-.41.09-.1.2-.25.3-.37.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.47-1.13-.64-1.55-.17-.4-.34-.35-.46-.35-.12 0-.26-.01-.4-.01s-.33.05-.52.26c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.08.1.13 1.4 2.13 3.4 2.99.47.21.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.18-.48 1.34-.95.17-.47.17-.86.12-.95-.05-.09-.19-.14-.4-.25z" 
        />
      </svg>
      </button>
      
      {/* ToastContainer displays toast notifications */}
      <ToastContainer />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Package;
