import React, { useState, useEffect, useContext } from "react";

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
import { motion } from "framer-motion"; // Added for animations

const Rolexe = () => {
  const { AddtoSlot, cartData, date, setSlotType } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true); // Added for loading animation
  const navigate = useNavigate();
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  // Function to check if a time slot has already passed for today
  const isTimeSlotPassed = (slotTime) => {
    // Get the current date and time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Convert slot start time (e.g., "10:00 AM") to 24-hour format hour and minute
    const [timeStr, period] = slotTime.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Check if the selected date is today
    const selectedDate = new Date(date);
    const today = new Date();
    const isToday = selectedDate.getDate() === today.getDate() && 
                    selectedDate.getMonth() === today.getMonth() && 
                    selectedDate.getFullYear() === today.getFullYear();
    
    // If it's not today, time hasn't passed
    if (!isToday) return false;
    
    // Check if the time has passed
    if (currentHour > hours) {
      return true;
    } else if (currentHour === hours && currentMinute > minutes) {
      return true;
    }
    
    return false;
  };

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
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

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
    { id: 2, start: "1:00 PM", end: "3:30 PM" },
    { id: 3, start: "4:00 PM", end: "6:30 PM" },
    { id: 4, start: "7:00 PM", end: "9:30 PM" },
    { id: 5, start: "10:00 PM", end: "12:30 AM" }
  ];

  const images = [
    "assets/Delax-08.JPG",
    "assets/Delax-07.JPG",
    "assets/Delax-06.JPG",
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
      try {
        setLoading(true);
        const bookingsRef = collection(db, "rolexe");
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setLoading(false);
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
    localStorage.removeItem("people");
    localStorage.removeItem("whatsapp");
    localStorage.removeItem("bookingName");
    localStorage.removeItem("email");
    localStorage.removeItem("wantDecoration");
    localStorage.removeItem("occasion");
    localStorage.removeItem("extraDecorations");
    toast.success("Booking successful!");
    setSlotType('rolexe');
    navigate("/QuantityBirthday", {
      state: {
        timeSlot: selectedTimeSlot,
      },
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(177, 21, 60, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="fontPoppin relative w-full min-h-screen p-4 flex items-center justify-center bg-cover bg-center bg-[url('/assets/home-header-01.jpg')]">
      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative md:max-w-[30rem] w-full bg-white rounded-2xl shadow-xl overflow-hidden p-3 z-10 md:mt-[7%] md:mb-[3%] mt-[26%]"
      >
        <motion.div 
          className="relative rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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
          className="space-y-2 mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h4 variants={itemVariants} className="text-[1.2rem] font-semibold text-[#B3153D]">
            Rolexe Theater T2
          </motion.h4>
          
          <motion.div variants={itemVariants} className="inline-flex items-center">
            <div className="px-3 py-1 bg-green-50 text-green-500 rounded-full border border-green-500 text-sm">
              <span>{timeSlots.length - bookedSlots.length} Slots Available</span>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-700 font-medium py-2 px-2 max-w-sm"
          >
            <div className="flex items-center space-x-2">
              <Users size={25} className="text-gray-600" />
              <span className="text-sm text-gray-600">Max 6 People</span>
            </div>
      
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <PartyPopper size={25} className="text-gray-600" />
              <span className="text-sm text-gray-600">Decoration Included</span>
            </div>
          </motion.div>
          
          <motion.h3 variants={itemVariants} className="text-[16px] font-semibold text-[#055085] mt-2">
            Select Time Slot
          </motion.h3>

          {loading ? (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center py-4"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B1153C]"></div>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-1"
            >
              {timeSlots.map((slot, index) => (
                <motion.button
                  key={slot.id}
                  onClick={() => {
                    setSelectedTimeSlot(slot);
                    AddtoSlot(slot);
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                  whileHover={{ 
                    scale: !bookedSlots.some((booked) => booked.id === slot.id) && !isTimeSlotPassed(slot.start) ? 1.05 : 1,
                    transition: { duration: 0.2 } 
                  }}
                  disabled={bookedSlots.some((booked) => booked.id === slot.id) || isTimeSlotPassed(slot.start)}
                  className={`rounded-xl border text-sm transition-all px-[7px] pt-1 pb-1 ${
                    selectedTimeSlot && selectedTimeSlot.id === slot.id
                      ? "border-[#055085] bg-blue-500 text-[#fff] shadow-md"
                      : bookedSlots.some((booked) => booked.id === slot.id) || isTimeSlotPassed(slot.start)
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "border-gray-200 hover:border-purple-200 hover:shadow-sm"
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
          
          <motion.div 
            variants={itemVariants}
            className="pt-3"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-1xl font-semibold">₹2000</span>
              <span className="text-sm">for up to 12 people with decoration</span>
            </div>
            <p className="text-sm text-gray-500 pb-4">More than 7 people not allowed</p>
            <div className="w-[100%] flex justify-center">
             <motion.button
               onClick={handleBooking}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={` md:w-[80%] button-main button-name bg-[#B1153C] text-white px-6 py-2.5 rounded-md transition-all ${
                selectedTimeSlot && cartData.length < 2
                  ? "bg-[#B1153C] text-white hover:bg-[#d81a49]"
                  : "bg-[#B1153C] opacity-80 cursor-not-allowed text-white"
              }`}
             >
              Book Now
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

export default Rolexe;