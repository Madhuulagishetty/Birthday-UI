import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DeluxeImg from '../../assets/Delax.jpg';
import { Link } from "react-router-dom";
import { HousePlus, MoveRight, Headphones, Send, User, Mail, MessageSquare } from 'lucide-react';

const ServicesMain = () => {
  // Add a mount state to track initial render only
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Animation controls
  const controlsTitle = useAnimation();
  const controlsFirstRow = useAnimation();
  const controlsSecondRow = useAnimation();
  
  // Refs for sections
  const titleRef = useRef(null);
  const firstRowRef = useRef(null);
  const secondRowRef = useRef(null);
  
  // Function to check if element is in viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };
  
  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      if (isInViewport(titleRef.current)) {
        controlsTitle.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
      }
      
      if (isInViewport(firstRowRef.current)) {
        controlsFirstRow.start({ opacity: 1, x: 0, transition: { duration: 0.8 } });
      }
      
      if (isInViewport(secondRowRef.current)) {
        controlsSecondRow.start({ opacity: 1, x: 0, transition: { duration: 0.8 } });
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsTitle, controlsFirstRow, controlsSecondRow]);
  
  // Smooth scroll to section on load - only once
//   useEffect(() => {
//     // Only scroll if we haven't scrolled yet
//     if (!hasScrolled) {
//       window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//       });
//       setHasScrolled(true);
//     }
//   }, [hasScrolled]);
  return (
    <section id="services-section" className="bg-gray-200 py-12 md:py-16 min-h-screen scroll-mt-16">
          {/* Hero Section with Proper Overlapping */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="bg-cover bg-center h-[60vh] sm:h-[40vh] md:h-[50vh] lg:h-[40vh]" 
          style={{
            backgroundImage: 'url("https://image.wedmegood.com/resized/720X/uploads/member/1390611/1597761581_image6689.jpg")',
            filter: 'brightness(0.3)'
          }}
        />
        
        {/* Overlay Content - Absolutely positioned */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white relative inline-block mb-4 sm:mb-6">
            Our Services
              <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-pink-500"></div>
            </h1>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-4">
            <div className="flex gap-3 sm:gap-5">
              <Link to="/" className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <HousePlus className="w-4 h-4 sm:w-5 sm:h-5" />Home
              </Link>
              <div className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 animate-move-left"/>Our Services
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          ref={titleRef}
          initial={{ opacity: 0, y: -20 }}
          animate={controlsTitle}
          className="text-3xl sm:text-4xl text-center pt-8 pb-3 fontCursive md:text-5xl  text-blue-800  "
        >
          Our Services
        </motion.h2>
        
        {/* First Row */}
        <motion.div 
          ref={firstRowRef}
          initial={{ opacity: 0, x: -50 }}
          animate={controlsFirstRow}
          className="flex flex-col md:flex-row items-center justify-center mb-12 md:mb-20 gap-6 md:gap-8"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            transition={{ duration: 0.3 }}
            className="w-full md:w-5/12 lg:w-1/3 mb-6 md:mb-0"
          >
            <img
              src={DeluxeImg}
              alt="Private movie screening setup"
              className="rounded-lg shadow-xl w-full h-64 sm:h-72 md:h-80 object-cover hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-1/2 px-0 md:px-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-3 md:mb-4">Private movie screening</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#db2777' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-pink-500 text-white text-sm sm:text-base rounded-full font-medium hover:bg-pink-600 transition duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Second Row */}
        <motion.div 
          ref={secondRowRef}
          initial={{ opacity: 0, x: 50 }}
          animate={controlsSecondRow}
          className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-8"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full md:w-1/2 px-0 md:px-4 mt-6 md:mt-0"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-3 md:mb-4">Private movie screening</h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#db2777' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-pink-500 text-white text-sm sm:text-base rounded-full font-medium hover:bg-pink-600 transition duration-300"
            >
              Book Now
            </motion.button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            transition={{ duration: 0.3 }}
            className="w-full md:w-5/12 lg:w-1/3"
          >
            <img
              src={DeluxeImg}
              alt="Private movie screening setup"
              className="rounded-lg shadow-xl w-full h-64 sm:h-72 md:h-80 object-cover hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesMain;