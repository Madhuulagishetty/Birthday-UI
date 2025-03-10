import React, { useState } from 'react';
import FsLightbox from 'fslightbox-react';
// import ScrollToTop from '../ScrollTop';

const BirthdayGallery = () => {
  const [toggler, setToggler] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
  ];

  const openLightbox = (index) => {
    setActiveIndex(index);
    setToggler(!toggler);
  };

  return (
    <>

      <div className="w-full flex justify-center flex-col items-center h-full py-4 md:pt-6 md:pb-26 ">
        <div className="fontCursive text-5xl md:text-5xl text-pink-700 p-4 md:p-6 mt-[15%] md:mt-[0%]">BirthdayGallerys</div>
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 bg-white flex">
          <div className="w-full flex flex-col md:flex-row gap-2 p-2 md:p-0">
            <div className="w-full md:w-3/4">
              <div className="w-full flex flex-col md:flex-row gap-2">
                <img 
                  src={images[0]} 
                  alt="Birthday celebration" 
                  className="w-full md:w-1/3 h-40 md:h-52 cursor-pointer object-cover" 
                  onClick={() => openLightbox(0)} 
                />
                <img 
                  src={images[1]} 
                  alt="Party setup" 
                  className="w-full md:w-2/3 h-40 md:h-52 cursor-pointer object-cover mt-2 md:mt-0" 
                  onClick={() => openLightbox(1)} 
                />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 mt-2">
                <div className="w-full md:w-3/5">
                  <img 
                    src={images[2]} 
                    alt="Birthday decorations" 
                    className="w-full h-48 md:h-80 cursor-pointer object-cover" 
                    onClick={() => openLightbox(2)} 
                  />
                </div>
                <div className="w-full md:w-2/5 flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                  <div className="w-1/2 md:w-full">
                    <img 
                      src={images[3]} 
                      alt="Birthday cake" 
                      className="w-full h-40 md:h-36 lg:h-40 cursor-pointer object-cover" 
                      onClick={() => openLightbox(3)} 
                    />
                  </div>
                  <div className="w-1/2 md:w-full lg:h-[150px]">
                    <img 
                      src={images[4]} 
                      alt="Party celebration" 
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
                  alt="Celebration" 
                  className="w-full h-40 md:h-28 lg:h-32 cursor-pointer object-cover" 
                  onClick={() => openLightbox(5)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0">
                <img 
                  src={images[6]} 
                  alt="Party venue" 
                  className="w-full h-40 md:h-48 lg:h-52 cursor-pointer object-cover" 
                  onClick={() => openLightbox(6)} 
                />
              </div>
              <div className="w-1/3 md:w-full mt-0 md:mt-0 lg:h-[182px]">
                <img 
                  src={images[7]} 
                  alt="Birthday party" 
                  className="w-full h-40 md:h-44 lg:h-[182px] cursor-pointer object-cover" 
                  onClick={() => openLightbox(7)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FsLightbox
        toggler={toggler}
        sources={images}
        sourceIndex={activeIndex}
      />
    </>
  );
};

export default BirthdayGallery;