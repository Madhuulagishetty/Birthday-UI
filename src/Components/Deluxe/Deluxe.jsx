import React, { useState, useEffect, useContext } from "react";
// import { Star, Users, TicketX, Wine, LoaderPinwheel } from "lucide-react";
import { FaUtensils } from "react-icons/fa";
import { Users, PartyPopper } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "../ContextApi/Context";
import { db } from "../../index";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion"; // Added for animations

const Deluxe = () => {
  const { AddtoSlot, cartData, date, setSlotType } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added for loading animation
  const navigate = useNavigate();
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = (amount) => {
    let data = JSON.stringify({
      amount: amount * 100,
      currency: "INR"
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/orders",
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.log("error at", error);
      });
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Some error at razorpay screen loading");
      return;
    }

    const options = {
      key: 'rzp_test_MAK9N9Rei9tuH6',
      amount: amount,
      currency: 'INR',
      name: "Papaya Coders",
      description: "Payment to Papaya Coders",
      image: "https://papayacoders.com/demo.png",
      handler: function (response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: "Lagishetty Madhu",
        email: "lagishettymadhu05@gmail.com"
      },
      theme: {
        color: "#F4C430"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = (e) => {
    e.preventDefault();

    const paymentId = e.target.paymentId.value;

    axios.get(`http://localhost:5000/payment/${paymentId}`)
      .then((response) => {
        console.log(response.data);
        setResponseState(response.data);
      })
      .catch((error) => {
        console.log("error occurred", error);
      });
  };

  console.log(bookedSlots, 'bookingslots');
  console.log(cartData, 'cartData');

  const timeSlots = [
    { id: 1, start: "10:00 AM", end: "12:30 PM" },
    { id: 2, start: "01:00 PM", end: "3:30 PM" },
    { id: 3, start: "4:00 PM", end: "6:30 PM" },
    { id: 4, start: "7:00 PM", end: "9:30 PM" },
    { id: 5, start: "10:00 PM", end: "12:30 PM" }
  ];

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

  // Fetch booked slots for the selected date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        const bookingsRef = collection(db, "deluxe");
        const q = query(bookingsRef, where("date", "==", date));
        const querySnapshot = await getDocs(q);

        const booked = querySnapshot.docs
          .map((doc) => {
            const cartData = doc.data().cartData;
            return cartData && cartData.length > 0 ? cartData[0] : null;
          })
          .filter((slot) => slot !== null);

        console.log('booked slots', booked);
        setBookedSlots(booked);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800); // Added slight delay for smoother animation transition
      }
    };
    fetchBookedSlots();
  }, [date]);

  const handleBooking = () => {
    if (!selectedTimeSlot) {
      // Trigger error toast if no time slot is selected
      toast.error("Please select a time slot before proceeding.");
      return;
    }
    toast.success("Booking successful!");
    setSlotType('deluxe');
    navigate("/QuantityBirthday", {
      state: {
        timeSlot: selectedTimeSlot,
      },
    });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const pulseAnimation = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.02, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  const buttonAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 5px 15px rgba(177, 21, 60, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="fontPoppin relative w-full min-h-screen p-4 md:p-8 flex items-center justify-center bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1661726486910-7cfff916caad?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D')]">
      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="relative md:max-w-[30rem] mt-5 w-full bg-white rounded-2xl shadow-xl overflow-hidden p-3 md:p-4 z-10 md:mt-[7%] md:mb-[3%]"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative rounded-xl overflow-hidden"
        >
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
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2 mt-3"
        >
          <motion.div variants={itemAnimation} className="flex justify-between items-start">
            <h4 
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="text-[1.2rem] font-semibold text-[#B3153D]"
            >
              Deluxe Theater T2
            </h4>
            <motion.div 
              variants={itemAnimation} 
              className="inline-flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="px-3 py-1 bg-green-50 text-green-500 rounded-full border border-green-500 text-sm">
                <span>{timeSlots.length - bookedSlots.length} Slots Available</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemAnimation}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-700 font-medium py-2 px-2 max-w-sm"
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Users size={25} className="text-gray-600" />
              <span className="text-sm text-gray-600">Max 6 People</span>
            </motion.div>
      
            <motion.div 
              className="flex items-center space-x-2 mt-2 sm:mt-0"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <PartyPopper size={25} className="text-gray-600" />
              <span className="text-sm text-gray-600">Decoration Included</span>
            </motion.div>
          </motion.div>
          
          <motion.h3 
            variants={itemAnimation} 
            className="text-[16px] font-semibold text-[#055085] mt-2"
          >
            Select Time Slot
          </motion.h3>

          <AnimatePresence>
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-6"
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    borderColor: ["#B1153C", "#055085", "#4CAF50", "#B1153C"]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-8 h-8 border-t-2 border-b-2 rounded-full"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="time-slots"
                variants={itemAnimation}
                className="flex flex-wrap gap-1 justify-start  md:justify-center sm:justify-start"
                exit={{ opacity: 0 }}
              >
                {timeSlots.map((slot, index) => (
                  <motion.button
                    key={slot.id}
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      AddtoSlot(slot);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={
                      !bookedSlots.some((booked) => booked.id === slot.id) 
                        ? { 
                            scale: 1.08, 
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#f0f7ff"
                          } 
                        : {}
                    }
                    whileTap={
                      !bookedSlots.some((booked) => booked.id === slot.id)
                        ? { scale: 0.95 }
                        : {}
                    }
                    disabled={bookedSlots.some((booked) => booked.id === slot.id)}
                    className={`rounded-xl border text-sm transition-all px-1 py-2 md:px-2 md:py-2 ${
                      selectedTimeSlot && selectedTimeSlot.id === slot.id
                        ? "border-[#055085] bg-blue-50 text-[#055085] shadow-md"
                        : bookedSlots.some((booked) => booked.id === slot.id)
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    <div className="font-medium text-[12px] w-15 text-center">
                    <p>{slot.start} To</p>
                    <p>{slot.end}</p>
                  </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemAnimation} className="pt-4">
            <div 
              className="flex items-baseline gap-1 mb-1"
              whileHover={{ x: 3 }}
            >
              <span className="text-1xl font-semibold">₹2000</span>
              <span className="text-sm">for up to 2 people with decoration</span>
            </div>
            <p 
              className="text-sm text-gray-500 mb-4"
              whileHover={{ x: 3 }}
            >
              More than 6 people not allowed
            </p>
            <div className="w-[100%] flex justify-center ">
            <motion.button
              onClick={handleBooking}
              variants={buttonAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={`w-[90%] sm:w-[90%] button-name bg-[#B1153C] text-white px-6 py-3 rounded-md transition-all ${
                selectedTimeSlot && cartData.length < 2
                  ? "bg-[#B1153C] text-white"
                  : "bg-[#B1153C] opacity-80 cursor-not-allowed text-white"
              }`}
            >
              <motion.span
                initial={{ opacity: 1 }}
                animate={{
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.03, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-block"
              >
                Book Now
              </motion.span>
            </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Deluxe;