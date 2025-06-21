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
  import { motion } from "framer-motion";

  const Rolexe = () => {
    const { AddtoSlot, cartData, date, setSlotType, bookingRefresh } = useContext(contextApi);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to check if a time slot has already passed for today
    const isTimeSlotPassed = (slotTime) => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [timeStr, period] = slotTime.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);

      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }

      const selectedDate = new Date(date);
      const today = new Date();
      const isToday = selectedDate.getDate() === today.getDate() && 
                      selectedDate.getMonth() === today.getMonth() && 
                      selectedDate.getFullYear() === today.getFullYear();

      if (!isToday) return false;

      if (currentHour > hours) {
        return true;
      } else if (currentHour === hours && currentMinute > minutes) {
        return true;
      }

      return false;
    };

   

    const images = [
      "/assets/relax-08.jpg",
      "/assets/relax-09.jpg",
      "/assets/relax-07.jpg",
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

      setLoading(true);
      
      const bookingsRef = collection(db, "rolexe");
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
          setLoading(false);
        } catch (error) {
          console.error("Error processing booked slots:", error);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error fetching booked slots:", error);
        setLoading(false);
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
      setSlotType('rolexe');
      
      navigate("/user-details", {
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

     const timeSlots = [
      { id: 1, start: "10:00 AM", end: "12:30 PM" },
      { id: 2, start: "1:00 PM", end: "3:30 PM" },
      { id: 3, start: "4:00 PM", end: "6:30 PM" },
      { id: 4, start: "7:00 PM", end: "9:30 PM" },
      { id: 5, start: "10:00 PM", end: "12:30 AM" }
    ];
    // Calculate available slots
    const availableSlots = timeSlots.filter(
      slot => !bookedSlots.some(booked => booked.id === slot.id) && !isTimeSlotPassed(slot.start)
    ).length;
    

    console.log('booked',bookedSlots)

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
                    alt="Akaay Studio Thane"
                    title="Akaay Studio Thane"
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
              Rolexe Theater T1
            </motion.h4>
            
            <motion.div variants={itemVariants} className="inline-flex items-center">
              <div className="px-3 py-1 bg-green-50 text-green-500 rounded-full border border-green-500 text-sm">
                <span>
                  {loading ? 'Loading...' : `${availableSlots} Slots Available`}
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-gray-700 font-medium py-2 px-2 max-w-sm"
            >
              <div className="flex items-center space-x-2">
                <Users size={25} className="text-gray-600" />
                <span className="text-sm text-gray-600">Max 12 People</span>
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
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedSlots.some((booked) => booked.id === slot.id);
                  const isPassed = isTimeSlotPassed(slot.start);
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
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                      whileHover={{ 
                        scale: !isDisabled ? 1.05 : 1,
                        transition: { duration: 0.2 } 
                      }}
                      disabled={isDisabled}
                      className={`rounded-xl border text-sm transition-all px-[7px] pt-1 pb-1 ${
                        selectedTimeSlot && selectedTimeSlot.id === slot.id
                          ? "border-[#055085] bg-blue-500 text-[#fff] shadow-md"
                          : isBooked
                          ? "bg-red-300 cursor-not-allowed text-red-800 border-red-400"
                          : isPassed
                          ? "bg-gray-300 cursor-not-allowed text-gray-500 border-gray-400"
                          : "border-gray-200 hover:border-purple-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="font-medium text-[12px] w-15 text-center">
                        <p>{slot.start} To</p>
                        <p>{slot.end}</p>
                        {isBooked && <p className="text-[10px] text-red-600">Booked</p>}
                        {isPassed && <p className="text-[10px] text-gray-500">Passed</p>}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
            
            <motion.div 
              variants={itemVariants}
              className="pt-3"
            >
              <div className="flex items-baseline gap-1">
                <span className="text-1xl font-semibold">₹2000</span>
                <span className="text-sm capitalize">For 6 or less: Rs 2000 with decoration for 2.30 hrs </span>
              </div>
              <p className="text-sm text-black pb-4 capitalize">If more than 6 peoples then Rs 150/extra per person. Maximum 12 peoples can book.</p>
              <div className="w-[100%] flex justify-center">
                <motion.button
                  onClick={handleBooking}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  disabled={!selectedTimeSlot || loading}
                  className={`md:w-[80%] button-main button-name bg-[#B1153C] text-white px-6 py-2.5 rounded-md transition-all ${
                    selectedTimeSlot && !loading
                      ? "bg-[#B1153C] text-white hover:bg-[#d81a49]"
                      : "bg-[#B1153C] opacity-80 cursor-not-allowed text-white"
                  }`}
                >
                  {loading ? 'Loading...' : 'Book Now'}
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