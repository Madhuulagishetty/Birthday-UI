import React, { useState, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import { Link } from "react-router-dom";
import { HousePlus, MoveRight } from 'lucide-react';




const GalleryMain = () => {
  const [toggler, setToggler] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Add useEffect for smooth scrolling to top on component load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const images = [
    "/assets/delax-04.JPG",
    "/assets/relax-05.jpg",
    "/assets/relax-04.jpg",
    "/assets/delax-07.JPG",
    "/assets/relax-06.jpg",
    "/assets/delax-05.JPG",
    "/assets/gallery-08.jpg",
 

   
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
  ];

  const openLightbox = (index) => {
    setActiveIndex(index);
    setToggler(!toggler);
  };
  
  const navigateToYoutube = () => {
    window.open('https://www.youtube.com/@AkaayStudio', '_blank');
  };


  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Proper Overlapping */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="bg-cover bg-center h-[60vh] sm:h-[40vh] md:h-[40vh] lg:h-[40vh]" 
          style={{
            backgroundImage: 'url("/assets/inside-header.jpg")',
          
            filter: 'brightness(0.8)'
          }}
        />
        
        {/* Overlay Content - Absolutely positioned */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="container mx-auto mt-6  text-center">
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white relative inline-block sm:mb-6">
             Gallery
              <div className="absolute bottom [-10px] left-0 w-full h-1 bg-pink-500 mb-6"></div>
            </h1>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="flex gap-3 sm:gap-5">
              <Link to="/" className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <HousePlus className="w-4 h-4 sm:w-5 sm:h-5" />Home
              </Link>
              <div className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 animate-move-left"/>Gallery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-10">
        {/* Gallery Title */}
        <div className="fontCursive text-4xl md:text-5xl text-pink-700 p-4 text-center mb-6">
          Gallery
        </div>

        {/* Gallery Grid */}
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 bg-white  mx-auto">
          <div className="w-full flex flex-col md:flex-row gap-2 p-2 md:p-0">
            <div className="w-full md:w-3/4">
              <div className="w-full flex flex-col md:flex-row gap-2">
                <img 
                  src={images[0]} 
                  alt="Akaay Studio Mumbai" 
                  title="Akaay Studio Mumbai" 

                  className="w-full md:w-1/3 h-40 md:h-52 cursor-pointer object-cover" 
                  onClick={() => openLightbox(0)} 
                />
                <img 
                  src={images[1]} 
                  alt="Akaay Studio Mumbai" 
                  title="Akaay Studio Mumbai" 
                  className="w-full md:w-2/3 h-40 md:h-52 cursor-pointer object-cover mt-2 md:mt-0" 
                  onClick={() => openLightbox(1)} 
                />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 mt-2">
                <div className="w-full md:w-3/5">
                  <img 
                    src={images[2]} 
                    alt="Akaay Studio Mumbai" 
                  title="Akaay Studio Mumbai" 
                    className="w-full h-48 md:h-80 cursor-pointer object-cover" 
                    onClick={() => openLightbox(2)} 
                  />
                </div>
                <div className="w-full md:w-2/5 flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                  <div className="w-1/2 md:w-full">
                    <img 
                      src={images[3]} 
                      alt="Akaay Studio" 
                      title="Akaay Studio"  
                      className="w-full h-40 md:h-36 lg:h-40 cursor-pointer object-cover" 
                      onClick={() => openLightbox(3)} 
                    />
                  </div>
                  <div className="w-1/2 md:w-full lg:h-[150px]">
                    <img 
                      src={images[4]} 
                      alt="Akaay Studio"
                      title='Akaay Studio' 
                      className="w-full h-40 md:h-38 lg:h-[150px] cursor-pointer object-cover" 
                      onClick={() => openLightbox(4)} 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
              <div className="w-1/3 md:w-full">
                <img 
                  src={images[5]} 
                  alt="Akaay Studio"
                  title='Akaay Studio' 
                  className="w-full h-40 md:h-28 lg:h-32 cursor-pointer object-cover" 
                  onClick={() => openLightbox(5)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0">
                <img 
                  src={images[6]} 
                  alt="Akaay Studio Mumbai"
                  title="Akaay Studio Mumbai" 
                  className="w-full h-40 md:h-48 lg:h-52 cursor-pointer object-cover" 
                  onClick={() => openLightbox(6)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0 lg:h-[182px]">
                <img 
                  src={images[7]} 
                  alt="Akaay Studio Mumbai"
                  title="Akaay Studio Mumbai"
                  className="w-full h-40 md:h-44 lg:h-[182px] cursor-pointer object-cover" 
                  onClick={() => openLightbox(7)} 
                />
              </div>
            </div>
          </div>
        </div>
        {/* YouTube Button - Enhanced visibility and responsiveness */}
        <div className="w-[100%] md:py-6 py-2 flex justify-center mt-4 md:mt-8 md:px-4 px-0">
          <button 
            onClick={navigateToYoutube}
            className="w-[100%] sm:w-auto rounded-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white font-medium py-3 px-6 md:px-8 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 transform hover:scale-105"
            aria-label="Click to watch more videos on YouTube"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <span className="whitespace-nowrap text-sm">Watch Videos on YouTube</span>
          </button>
        </div>
      </div>

      <FsLightbox
        toggler={toggler}
        sources={images}
        sourceIndex={activeIndex}
      />
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
    </div>
  );
};

export default GalleryMain;