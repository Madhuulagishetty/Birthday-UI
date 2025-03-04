import React, { useContext ,useEffect} from 'react';
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DelaxImg from "../assets/Delax.jpg";
import RelaxImg from "../assets/Relax.jpg";
import { ChevronRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from './ContextApi/Context';

import WelcomeSection from './Welcome';
// import Packages from './Package';
import ServicesSection from './ServicesSection';
// import BirthdayMasonryGallery from './BirthdayGallery';

const Home = () => {
  const { date, setDate } = useContext(contextApi);
  useEffect(() => {
    // Reset date only in Home component when it mounts
    setDate("");
  }, []);
  const navigate = useNavigate();

  const images = [
    "https://t4.ftcdn.net/jpg/11/99/83/57/360_F_1199835732_evIkgrKAtpSUUCHg4XDWqOEW5SFk2ULI.jpg",
    "https://i.pinimg.com/originals/52/07/cf/5207cfb3fd0f613551e4f24b50315378.jpg",
    "https://cdn.cherishx.com/uploads/1686727757_webp_original.webp"
  ];
  
 

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" />
    ),
  };

  // Get today's date in YYYY-MM-DD format for minDate
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date");
    } else {
      navigate('/Packages');
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-cover bg-center" 
           style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661726486910-7cfff916caad?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-lg sm:max-w-md px-3 py-3 mt-[7%] md:mt-[3%]">
          <div className="mb-4">
            <div className="relative rounded-xl overflow-hidden">
              <Slider {...sliderSettings} className="theater-slider">
                {images.map((img, index) => (
                  <div key={index} className="aspect-video w-full overflow-hidden">
                    <img
                      src={img}
                      alt={`Theater View ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Date Picker */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="date" className="block font-medium mb-2">
                Select Date:
              </label>
              
              <input
                type="date"
                id="date"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleDateChange}
                value={date || ""}
                min={getTodayDate()} 
                required
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="button-main button-name  text-white px-6 mx-auto py-2 rounded-md hover:bg-pink-600 transition-all"
              >
                Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    
      <WelcomeSection />
      {/* <Packages /> */}
      <div className="bg-gradient-to-r from-blue-700 to-pink-700 py-14 px-5 w-full md:h-[90vh] flex justify-center items-center flex-col">
      <h2 className="fontCursive text-white text-5xl font-semibold text-center mb-10 animate-fade-in">
        Our Packages
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-8 items-center w-[100%]">
        {/* Delax Package */}
        <div
          className={`bg-white p-2 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl md:w-[32%] w-[100%] cursor-pointer`}
          // onClick={() => handlePackageSelect("Delax")}
        >
          <img
            src={DelaxImg}
            alt="Rolexe Theater T1"
            className="rounded-xl w-full h-64 object-cover"
          />
          <h3 className="text-red-600 font-bold text-xl mt-4 text-center">
            Rolexe Theater T1
          </h3>
          <p className="text-gray-700 text-center mt-2">
            For 6 or less: Rs 2000 with decoration for 2.30 hrs
          </p>
        </div>

        {/* Relexe Package */}
        <div
          className={`bg-white p-2 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl md:w-[32%] w-[100%] cursor-pointer`
          }
         
        >
          <img
            src={RelaxImg}
            alt="Deluxe Theater T2"
            className="rounded-xl w-full h-64 object-cover"
          />
          <h3 className="text-red-600 font-bold text-xl mt-4 text-center">
            Deluxe Theater T2
          </h3>
          <p className="text-gray-700 text-center mt-2">
            For 10 or less: Rs 2500 with decoration for 2.30 hrs
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
       
      <button  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg">
          <span>View All Services</span>
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* ToastContainer displays toast notifications */}
      <ToastContainer />
    </div>
      <ServicesSection />
      {/* <BirthdayMasonryGallery/> */}
    </> 
  );
};

export default Home;