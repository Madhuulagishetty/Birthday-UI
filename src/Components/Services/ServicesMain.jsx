import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

import { Link, useNavigate } from "react-router-dom";
import { HousePlus, MoveRight, Heart, Star, Calendar } from 'lucide-react';

// Service data for reusability
const serviceData = [
  {
    id: 1,
    title: "Romantic Surprise Packages",
    description: "Transform any occasion into an unforgettable memory with our thoughtfully curated surprise packages. From elegant flower arrangements to personalized gifts, we handle every detail to create a magical experience. Perfect for anniversaries, proposals, or simply showing someone special how much you care. Our team works discreetly to ensure the element of surprise remains intact while delivering an experience that speaks directly to your loved one's heart.",
    image: '/assets/service-bouquet-and-other-gifts.jpg',
    alt: "Romantic gift and flower arrangement",
    buttonText: "Plan Your Surprise",
    icon: <Heart className="w-5 h-5 text-pink-500" />
  },
  {
    id: 2,
    title: "Atmospheric Fog Entrances",
    description: "Make a dramatic statement with our signature fog entrance experience. Create an ethereal, dreamlike atmosphere that transforms any space into something magical. Our professional-grade fog systems produce a beautiful low-lying effect that's perfect for weddings, proposals, or special celebrations. We carefully control the density and flow to ensure the perfect ambiance while maintaining comfort for you and your guests. This unique touch will leave everyone in awe.",
    image: '/assets/fog-entry-01.PNG',
    alt: "Atmospheric fog entrance setup",
    buttonText: "Create Magic",
    icon: <Star className="w-5 h-5 text-pink-500" />
  },
  {
    id: 3,
    title: "Professional Photoshoot Sessions",
    description: "Capture your special moments with our professional photography services. Our experienced photographers specialize in romantic settings and intimate moments, ensuring every emotion is preserved beautifully. We offer customized backdrops, professional lighting, and artistic direction to create stunning images you'll cherish forever. Whether it's a proposal, anniversary, or just because, we'll help you document your love story with elegance and style.",
    image: '/assets/service-photoshoot.jpg',
    alt: "Professional romantic photoshoot setup",
    buttonText: "Book Your Session",
    icon: <Calendar className="w-5 h-5 text-pink-500" />
  },
  {
    id: 4,
    title: "Private Movie Screenings",
    description: "Experience the magic of cinema in an intimate setting with our private movie screening service. Transform any space into your personal theater with high-definition projection, surround sound, and comfortable seating. Choose from classic romance films, personal favorites, or even custom videos and slideshows. We handle all technical aspects while you focus on enjoying this unique experience with someone special. Add customized decorations and themed elements for an extra special touch.",
    image: "/assets/service-private-movie-screening.jpg",
    alt: "Private movie screening setup",
    buttonText: "Reserve Your Screening",
    icon: <Star className="w-5 h-5 text-pink-500" />
  },
  {
    id: 5,
    title: "Gourmet Snacks & Beverages",
    description: "Elevate your experience with our premium selection of gourmet treats and handcrafted beverages. From artisanal chocolates to fresh fruit platters, elegant canapés to custom mocktails, we offer the perfect refreshments for your special occasion. Our menu can be fully customized to accommodate dietary preferences and create perfect pairings. Each item is beautifully presented and served with attention to detail, ensuring your romantic evening has the perfect finishing touch.",
    image: "/assets/service-snacks-and-beverage.jpg",
    alt: "Luxury snacks and beverages arrangement",
    buttonText: "Explore Menu Options",
    icon: <Heart className="w-5 h-5 text-pink-500" />
   }
];

const handleWhatsAppClick = () => {
  const phoneNumber = "919764535650";
  window.open(`https://wa.me/${phoneNumber}`, "_blank");
};

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
      alt='Akaay Studio Photography'
      title='Akaay Studio Photography'
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
  });
  
  return (
    <section id="services-section" className="bg-gray-50 py-12 md:py-16 min-h-screen scroll-mt-16 overflow-x-hidden">
      {/* Hero Section with Proper Overlapping */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="bg-cover bg-center h-[40vh] sm:h-[40vh] md:h-[40vh] lg:h-[30vh]" 
          style={{
            backgroundImage: 'url("/assets/inside-header.jpg")',
            filter: 'brightness(0.8)'
          }}
        />
        
        {/* Overlay Content - Absolutely positioned */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 py-4 sm:py-6 md:py-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white relative inline-block mb-0 sm:mb-6">
              Our Services
              <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-pink-500"></div>
            </h1>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
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
    </section>
    
  );
};

export default ServicesMain;