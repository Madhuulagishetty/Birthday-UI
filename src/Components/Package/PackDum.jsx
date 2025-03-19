import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DelaxImg from "../../assets/Delax.jpg";
import RelaxImg from "../../assets/Relax.jpg";
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
      
      <div className={`fontCursive text-white text-3xl md:text-5xl text-center mb-2 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        Our Packages
      </div>
      
      <div className={`w-24 h-1 bg-yellow-300 rounded-full mb-10 transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      
      <div className="flex flex-col md:flex-row justify-center gap-14 md:gap-8 items-center w-[100%] md:w-[100%] ">
        {/* Delax Package */}
        <div
          className={`bg-white md:p-4 p-2 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[100%] md:w-[32%] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={DelaxImg}
              alt="Rolexe Theater T1"
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
              <p className="mb-2">
                Enjoy our most popular theater experience, perfect for intimate gatherings. 
                This package includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Comfortable seating for up to 6 people</li>
                <li>Premium sound system</li>
                <li>Customizable lighting</li>
                <li>Complimentary popcorn</li>
                <li>One round of soft drinks</li>
                <li>Themed decoration of your choice</li>
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
          className={`bg-white md:p-4 p-2 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[100%] md:w-[32%] cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={RelaxImg}
              alt="Deluxe Theater T2"
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
              <p className="mb-2">
                Experience our premium theater setup, perfect for larger groups and special occasions. 
                This package includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Luxury seating for up to 10 people</li>
                <li>4K ultra-HD projector</li>
                <li>Surround sound system</li>
                <li>Interactive lighting control</li>
                <li>Premium snack platter</li>
               
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