import React, { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DelaxImg from "../assets/Delax.jpg";
import RelaxImg from "../assets/Relax.jpg";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "./ContextApi/Context";
import Package from "./Package/PackDum";
import WelcomeSection from "./Welcome";
import ServicesSection from "./Services/ServicesSection";
import { motion } from "framer-motion";
import Birthday from "./BirthdayGallery";

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
  }, []);

  const images = [
    "https://t4.ftcdn.net/jpg/11/99/83/57/360_F_1199835732_evIkgrKAtpSUUCHg4XDWqOEW5SFk2ULI.jpg",
    "https://i.pinimg.com/originals/52/07/cf/5207cfb3fd0f613551e4f24b50315378.jpg",
    "https://cdn.cherishx.com/uploads/1686727757_webp_original.webp",
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

  return (
    <>
      <motion.div
        className="relative w-full h-screen flex justify-center items-center p-4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1661726486910-7cfff916caad?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D')",
        }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          className="bg-white rounded-lg shadow-lg z-10 w-full max-w-lg sm:max-w-md px-3 py-3 mt-[7%] md:mt-[3%]"
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

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeInUp}
      >
        <Package />
      </motion.div>

      <ServicesSection />
      <Birthday />
    </>
  );
};

export default Home;
