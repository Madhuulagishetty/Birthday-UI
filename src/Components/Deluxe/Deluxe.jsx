import React, { useState, useEffect, useContext } from "react";
import { Users, PartyPopper } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "../ContextApi/Context";
import { db } from "../../index";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";

const Deluxe = () => {
  const { AddtoSlot, cartData, date, setSlotType, bookingRefresh } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const timeSlots = [
    { id: 1, start: "10:00 AM", end: "12:30 PM" },
    { id: 2, start: "01:00 PM", end: "3:30 PM" },
    { id: 3, start: "4:00 PM", end: "6:30 PM" },
    { id: 4, start: "7:00 PM", end: "9:30 PM" },
    { id: 5, start: "10:00 PM", end: "12:30 AM" }
  ];

  // Function to check if a time slot has passed for today
  const isTimeSlotPassed = (slot) => {
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const startTimeStr = slot.start;
    const [hourStr, minuteStr, period] = startTimeStr.match(/(\d+):(\d+)\s([AP]M)/).slice(1);

    let slotHour = parseInt(hourStr);
    const slotMinute = parseInt(minuteStr);

    if (period === "PM" && slotHour !== 12) {
      slotHour += 12;
    } else if (period === "AM" && slotHour === 12) {
      slotHour = 0;
    }

    if (currentHour > slotHour) {
      return true;
    } else if (currentHour === slotHour && currentMinute > slotMinute) {
      return true;
    }

    return false;
  };

  const images = [
    "/assets/delax-001.jpg",
    "/assets/delax-002.jpg",
    "/assets/delax-003.jpg"
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

  // Fetch booked slots with real-time updates
  useEffect(() => {
    if (!date) return;

    setIsLoading(true);
    
    const bookingsRef = collection(db, "deluxe");
    const q = query(bookingsRef, where("date", "==", date));

    // Use real-time listener instead of one-time fetch
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const booked = [];
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log('Document data:', data); // Debug log
          
          // Check if cartData exists and has the slot information
          if (data.cartData && Array.isArray(data.cartData) && data.cartData.length > 0) {
            const slot = data.cartData[0];
            // Ensure the slot has required properties
            if (slot && slot.id && slot.start && slot.end) {
              booked.push(slot);
            }
          }
          
          // Also check if there's a direct slot reference
          if (data.selectedTimeSlot && data.selectedTimeSlot.id) {
            booked.push(data.selectedTimeSlot);
          }
        });

        console.log('Booked slots found:', booked);
        setBookedSlots(booked);
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing booked slots:", error);
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error fetching booked slots:", error);
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [date, bookingRefresh]);

  const handleBooking = () => {
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }
    
    // Clear previous booking data
    localStorage.removeItem("people");
    localStorage.removeItem("whatsapp");
    localStorage.removeItem("bookingName");
    localStorage.removeItem("email");
    localStorage.removeItem("address");
    localStorage.removeItem("wantDecoration");
    localStorage.removeItem("occasion");
    localStorage.removeItem("extraDecorations");
    
    toast.success("Time slot selected successfully!");
    setSlotType('deluxe');
    
    navigate("/user-details", {
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

  // Calculate the number of available slots (excluding both booked and passed slots)
  const availableSlots = timeSlots.filter(
    slot => !bookedSlots.some(booked => booked.id === slot.id) && !isTimeSlotPassed(slot)
  ).length;

  return (
    <div className="fontPoppin relative w-full min-h-screen p-4 md:p-8 flex items-center justify-center bg-cover bg-center bg-[url('/assets/home-header-01.jpg')]">
      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        className="relative md:max-w-[30rem] mt-20 w-full bg-white rounded-2xl shadow-xl overflow-hidden p-3 md:p-4 z-10 md:mt-[7%] md:mb-[3%]"
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
                  alt="Akaay Studio Thane"
                  title="Akaay Studio Thane"
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
          <motion.div variants={itemAnimation} className="flex justify-between items-start flex-col md:flex-row gap-3">
            <motion.h4 
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="text-[1.2rem] font-semibold text-[#B3153D]"
            >
              Deluxe Theater T2
            </motion.h4>
            <motion.div 
              variants={itemAnimation} 
              className="inline-flex justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="px-3 py-1 bg-green-50 text-green-500 rounded-full border border-green-500 text-[12px] md:text-sm">
                <span>
                  {isLoading ? 'Loading...' : `${availableSlots} Slots Available`}
                </span>
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
              <span className="text-sm text-gray-600">Max 25 People</span>
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
                className="flex flex-wrap gap-1 justify-start md:justify-center sm:justify-start"
                exit={{ opacity: 0 }}
              >
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedSlots.some((booked) => booked.id === slot.id);
                  const isPassed = isTimeSlotPassed(slot);
                  const isDisabled = isBooked || isPassed;
                  
                  return (
                    <motion.button
                      key={slot.id}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedTimeSlot(slot);
                          AddtoSlot(slot);
                        }
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,  
                        backgroundColor: selectedTimeSlot && selectedTimeSlot.id === slot.id ? "#3b82f6" : undefined, 
                        color: selectedTimeSlot && selectedTimeSlot.id === slot.id ? "#fff" : undefined
                      }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={
                        !isDisabled
                          ? { 
                              scale: 1.08, 
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                              backgroundColor: "#f0f7ff"
                            } 
                          : {}
                      }
                      whileTap={
                        !isDisabled
                          ? { scale: 0.95 }
                          : {}
                      }
                      disabled={isDisabled}
                      className={`rounded-xl border text-sm transition-all px-1 py-2 md:px-2 md:py-2 ${
                        selectedTimeSlot && selectedTimeSlot.id === slot.id
                          ? "border-[#055085] bg-blue-500 text-white shadow-md"
                          : isBooked
                          ? "bg-red-300 cursor-not-allowed text-red-800 border-red-400"
                          : isPassed
                          ? "bg-gray-200 cursor-not-allowed text-gray-400 line-through border-gray-400"
                          : "border-gray-200 hover:border-purple-200"
                      }`}
                    >
                      <div className="font-medium text-[12px] w-15 text-center">
                        <p>{slot.start} To</p>
                        <p>{slot.end}</p>
                        {isBooked && <p className="text-[10px] text-red-600">Booked</p>}
                        {isPassed && <p className="text-[10px] text-red-400">Passed</p>}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemAnimation} className="pt-4">
            <motion.div 
              className="flex items-baseline gap-1 mb-1"
              whileHover={{ x: 3 }}
            >
              <span className="text-1xl font-semibold">₹2500</span>
              <span className="text-sm capitalize">For 10 or less: Rs 2500 with decoration for 2.30 hrs</span>
            </motion.div>
            <motion.p 
              className="text-sm text-black mb-4 capitalize"
              whileHover={{ x: 3 }}
            >
              If more than 10 peoples then Rs 150/ extra per person. Maximum 25 peoples can book.
            </motion.p>
            <div className="w-[100%] flex justify-center ">
              <motion.button
                onClick={handleBooking}
                variants={buttonAnimation}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                disabled={!selectedTimeSlot || isLoading}
                className={`w-[90%] sm:w-[90%] button-name bg-[#B1153C] text-white px-6 py-3 rounded-md transition-all ${
                  selectedTimeSlot && !isLoading
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
                  {isLoading ? 'Loading...' : 'Book Now'}
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