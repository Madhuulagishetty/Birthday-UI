import React, { useState, useEffect } from 'react';
import FsLightbox from 'fslightbox-react';
import { Link } from "react-router-dom";
import { HousePlus, MoveRight, Headphones, Send, User, Mail, MessageSquare } from 'lucide-react';
import DelaxImg from "../../assets/Delax-04.jpg";
import Relaxsecond from "../../assets/relax-05.jpg";
import RelaxThird from "../../assets/relax-04.jpg";
import DelaxSecond from "../../assets/Delax-07.jpg";
import RelaxSeventh from "../../assets/relax-06.jpg";

import DelaxFifth from "../../assets/Delax-05.jpg";
import DelaxThird from "../../assets/Delax-03.jpg";

// import HomeBgImg from "../../assets/Delax-07.jpg";

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
    DelaxImg,
    Relaxsecond,
    RelaxThird,
    RelaxSeventh,
    DelaxFifth,
    DelaxSecond,
    DelaxThird,
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
  ];

  const openLightbox = (index) => {
    setActiveIndex(index);
    setToggler(!toggler);
  };
  
  const navigateToYoutube = () => {
    window.open('https://www.youtube.com/@AkaayStudio', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Proper Overlapping */}
      <div className="relative">
        {/* Background Image */}
        <div 
          className="bg-cover bg-center h-[60vh] sm:h-[40vh] md:h-[40vh] lg:h-[50vh]" 
          style={{
            backgroundImage: 'url("https://image.wedmegood.com/resized/720X/uploads/member/1390611/1597761581_image6689.jpg")',
            filter: 'brightness(0.3)'
          }}
        />
        
        {/* Overlay Content - Absolutely positioned */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white relative inline-block mb-4 sm:mb-6">
             BirthdayGallery
              <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-pink-500"></div>
            </h1>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-4">
            <div className="flex gap-3 sm:gap-5">
              <Link to="/" className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <HousePlus className="w-4 h-4 sm:w-5 sm:h-5" />Home
              </Link>
              <div className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center text-white">
                <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 animate-move-left"/>BirthdayGallery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-10">
        {/* Gallery Title */}
        <div className="fontCursive text-4xl md:text-5xl text-pink-700 p-4 text-center mb-6">
          BirthdayGallery
        </div>

        {/* Gallery Grid */}
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 mx-auto bg-white  overflow-hidden">
          <div className="w-full flex flex-col md:flex-row gap-2 ">
            <div className="w-full md:w-3/4">
              <div className="w-full flex flex-col md:flex-row gap-2">
                <img 
                  src={images[0]} 
                  alt="Birthday celebration" 
                  className="w-full md:w-1/3 h-40 md:h-52 cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
                  onClick={() => openLightbox(0)} 
                />
                <img 
                  src={images[1]} 
                  alt="Party setup" 
                  className="w-full md:w-2/3 h-40 md:h-52 cursor-pointer object-cover mt-2 md:mt-0 rounded-sm hover:opacity-90 transition-opacity" 
                  onClick={() => openLightbox(1)} 
                />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 mt-2">
                <div className="w-full md:w-3/5">
                  <img 
                    src={images[2]} 
                    alt="Birthday decorations" 
                    className="w-full h-48 md:h-full cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
                    onClick={() => openLightbox(2)} 
                  />
                </div>
                <div className="w-full md:w-2/5 flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                  <div className="w-1/2 md:w-full">
                    <img 
                      src={images[3]} 
                      alt="Birthday cake" 
                      className="w-full h-40 md:h-36 lg:h-40 cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
                      onClick={() => openLightbox(3)} 
                    />
                  </div>
                  <div className="w-1/2 md:w-full">
                    <img 
                      src={images[4]} 
                      alt="Party celebration" 
                      className="w-full h-[202px] md:h-38 cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
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
                  alt="Celebration" 
                  className="w-full h-40 md:h-28 lg:h-32 cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
                  onClick={() => openLightbox(5)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0">
                <img 
                  src={images[6]} 
                  alt="Party venue" 
                  className="w-full h-40 md:h-48 cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
                  onClick={() => openLightbox(6)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0">
                <img 
                  src={images[7]} 
                  alt="Birthday party" 
                  className="w-full h-40 md:h-[250px] cursor-pointer object-cover rounded-sm hover:opacity-90 transition-opacity" 
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
            <span className="whitespace-nowrap text-sm">Watch Birthday Videos on YouTube</span>
          </button>
        </div>
      </div>

      <FsLightbox
        toggler={toggler}
        sources={images}
        sourceIndex={activeIndex}
      />
    </div>
  );
};

export default GalleryMain;