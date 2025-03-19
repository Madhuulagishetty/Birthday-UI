import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
// import "src/assets/relax-04.jpg" from '../../assets/Delax.jpg';
import { Link, useNavigate } from "react-router-dom";
import { HousePlus, MoveRight } from 'lucide-react';

// Service data for reusability
const serviceData = [
  {
    id: 1,
    title: "Private movie screening",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "src/assets/relax-04.jpg",
    alt: "Private movie screening setup",
    buttonText: "Book Now"
  },
  {
    id: 2,
    title: "Private movie screening",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "src/assets/relax-04.jpg",
    alt: "Private movie screening setup",
    buttonText: "Book Now"
  },
  {
    id: 3,
    title: "Private movie screening",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "src/assets/relax-04.jpg",
    alt: "Private movie screening setup",
    buttonText: "Book Now"
  },
  {
    id: 4,
    title: "Private movie screening",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "src/assets/relax-04.jpg",
    alt: "Private movie screening setup",
    buttonText: "Book Now"
  }
];

// Button component for reusability
const AnimatedButton = ({ text, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: '#db2777' }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-pink-500 text-white text-sm sm:text-base rounded-full font-medium hover:bg-pink-600 transition duration-300 w-[90%] sm:w-auto"
  >
    {text}
  </motion.button>
);

// Service content component
const ServiceContent = ({ title, description, buttonText, onClick }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="w-full md:w-1/2 px-0 md:px-4 mt-6 md:mt-0"
  >
    <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-3 md:mb-4">{title}</h3>
    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
      {description}
    </p>
    <AnimatedButton text={buttonText} onClick={onClick} />
  </motion.div>
);

// Service image component
const ServiceImage = ({ image, alt }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }} 
    transition={{ duration: 0.3 }}
    className="w-full md:w-5/12 lg:w-1/3"
  >
    <img
      src={image}
      alt={alt}
      className="rounded-lg shadow-xl w-full h-64 sm:h-72 md:h-80 object-cover hover:shadow-2xl transition-shadow duration-300"
    />
  </motion.div>
);

const ServicesMain = () => {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Animation controls
  const controlsTitle = useAnimation();
  const controlsServices = useAnimation();
  
  // Refs for sections
  const titleRef = useRef(null);
  const serviceRefs = useRef([]);
  
  // Initialize serviceRefs with an array of the correct length
  useEffect(() => {
    serviceRefs.current = serviceRefs.current.slice(0, serviceData.length);
  }, []);
  
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
      
      serviceRefs.current.forEach((ref, index) => {
        if (ref && isInViewport(ref)) {
          controlsServices.start(index.toString(), { 
            opacity: 1, 
            x: 0, 
            transition: { duration: 0.8, delay: index * 0.2 } 
          });
        }
      });
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlsTitle, controlsServices]);
  
  // Scroll to top only once when component mounts
  useEffect(() => {
    // Only scroll to top on initial load
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    // This empty dependency array ensures this effect runs only once on mount
  }, []);
  
  return (
    <section id="services-section" className="bg-gray-50 py-12 md:py-16 min-h-screen scroll-mt-16 overflow-x-hidden">
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
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"/>Our Services
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
          className="text-5xl sm:text-5xl text-center pt-8 pb-3  text-blue-800 fontCursive md:text-5xl" 
        >
          Our Services
        </motion.h2>
        
        {/* Services List */}
        <div className="space-y-12 md:space-y-20">
          {serviceData.map((service, index) => (
            <motion.div
              key={service.id}
              ref={el => serviceRefs.current[index] = el}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={controlsServices}
              variants={{
                [index.toString()]: { opacity: 1, x: 0 }
              }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-center gap-6 md:gap-8 ${index > 0 ? 'mt-12 md:mt-20' : ''}`}
            >
              <ServiceImage image={service.image} alt={service.alt} />
              <ServiceContent 
                title={service.title} 
                description={service.description} 
                buttonText={service.buttonText} 
                onClick={() => navigate("/")} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesMain;