import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import PrivateTheatreExperience from './EventCard'


import { useNavigate } from "react-router-dom";


const ServicesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const serviceImages = [
    '/assets/service-bouquet-and-other-gifts.jpg',
    "/assets/atmospheric-fog-entrances.jpg",
    "/assets/service-photoshoot.jpg",
    "/assets/service-private-movie-screening.jpg",
    "/assets/service-snacks-and-beverage.jpg",

   
    
  ];

  const servicePoints = [
    'Service Bouquet and other-gifts',
    'Service Fog entry',
    'Service Photoshoot',
    'Service Private movie screening',
    'Service Snacks and beverage'

  ];

  // Smooth scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % serviceImages.length);
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [serviceImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % serviceImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + serviceImages.length) % serviceImages.length);
  };
  const HandleBooking=()=>{
       navigate("/services")
  }
  return (
    <>
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
     
      {/* Image Slider Section */}
      
      <div className="w-full md:w-1/3 relative group md:mt-[5%]">
     
        <div className="overflow-hidden rounded-2xl shadow-lg relative mt-[10%] md:mt-[0%] ">
          <div 
            ref={sliderRef}
            className="relative w-full h-[400px] md:h-[500px] overflow-hidden mt-[10%] md:mt-[0%]"
          >
            {serviceImages.map((img, index) => (
              <div 
                key={index} 
                className={`
                  absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out
                  ${currentSlide === index 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-95 z-0'
                  }
                `}
              >
                <img 
                  src={img} 
                  alt='Akaay Studio Photography'
                  title='Akaay Studio Photography'
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>

          {/* Slider Navigation */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
            <button 
              onClick={prevSlide}
              className="bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transform hover:scale-110 transition-transform z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transform hover:scale-110 transition-transform z-20"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Slider Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {serviceImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${currentSlide === index 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-white/50 hover:bg-white/75'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Services Content Section */}
      <div className="w-full md:w-[30%]">
        <h2 className="fontCursive text-5xl text-blue-800 mb-6 animate-fade-in">
          Our Services
        </h2>
        <p className="fontPoppin text-gray-600 mb-6 animate-fade-in-delay">
          Capturing moments that last a lifetime. Our professional photography services blend creativity, technical expertise, and a passion for storytelling to preserve your most cherished memories.
        </p>

        {/* Service Points */}
        <div className="space-y-4 mb-8">
          {servicePoints.map((point, index) => (
            <div 
              key={index} 
              className={`
                flex items-center space-x-3 
                transform transition-all duration-300 animate-fade-in-slide
                ${currentSlide === index 
                  ? 'translate-x-2 text-blue-600' 
                  : 'text-gray-700'}
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <ChevronRight className="text-blue-600" />
              <span className='fontPoppin font-semibold'>{point}</span>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg animate-fade-in-up" onClick={HandleBooking}>
          <span>View All Services</span>
          <ChevronRight 
          size={20} 
          className="animate-slide-left" 
        />
        </button>
        <style jsx>{`
        @keyframes slide-left {
          0% {
            transform: translateX(20px);
            opacity: 0;
          }
          20% {
            transform: translateX(0);
            opacity: 1;
          }
          80% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-20px);
            opacity: 0;
          }
        }
        
        .animate-slide-left {
          animation: slide-left 2s ease-in-out infinite;
        }

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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animate-fade-in-slide {
          animation: fadeInSlide 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      </div>
      
    </div>
    <PrivateTheatreExperience/>
    
    </> 
    
  );
};

export default ServicesSection;