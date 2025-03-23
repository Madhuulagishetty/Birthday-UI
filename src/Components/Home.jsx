import React, { useContext, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";




import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "./ContextApi/Context";
import Package from "./Package/PackDum";
import WelcomeSection from "./Welcome";
import ServicesSection from "./Services/ServicesSection";
import { motion } from "framer-motion";
import Birthday from "./BirthdayGallery/BirthdayGallery";

// Animation variants for scroll animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Home = () => {
  const { date, setDate } = useContext(contextApi);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset date only in Home component when it mounts
    setDate("");
    
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, []);

  const images = [
    "src/assets/Delax-01.jpg",
    "src/assets/Delax-08.jpg",
    "src/assets/Delax-04.jpg",

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

  // Get today's date in YYYY-MM-DD format and disable today after 12 AM
  const getMinSelectableDate = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0) {
      now.setDate(now.getDate() + 1); // Disable today after 12 AM
    }

    return now.toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date");
    } else {
      navigate("/Packages");
    }
  };
  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };


  return (
    <>
      <motion.div
        className="relative w-full h-screen flex justify-center items-center p-4 bg-cover bg-center"
        style={{
          backgroundImage:
           `url('src/assets/home-header-01.jpg')`,
        }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          className="bg-white rounded-lg shadow-lg z-10 w-full max-w-lg sm:max-w-md px-3 py-3 mt-[20%] md:mt-[3%]"
          variants={fadeInUp}
        >
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
                min={getMinSelectableDate()}
                required
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="button-main button-name text-white px-6 mx-auto py-2 rounded-md hover:bg-pink-600 transition-all"
              >
                Booking
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <WelcomeSection />
      </motion.div>

    
        <Package />
      

      <ServicesSection />
      <Birthday />
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
    </>
  );
};

export default Home;