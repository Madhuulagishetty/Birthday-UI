import React, { useState, useEffect, useContext } from "react";
import { Users, PartyPopper, Calendar, Clock, Star, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "../ContextApi/Context";
import { db } from "../../index";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";

const Rolexe = () => {
  const { AddtoSlot, cartData, date, setSlotType, bookingRefresh } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Update URL with selected package info
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('package', 'rolexe');
    newSearchParams.set('from', 'packages');
    if (date) {
      newSearchParams.set('date', date);
    }
    setSearchParams(newSearchParams);
  }, [date, setSearchParams]);

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

  // Improved function to extract booked slots from Firebase documents
  const extractBookedSlots = (documents) => {
    const bookedSlotIds = new Set();
    const bookedSlots = [];

    documents.forEach((doc) => {
      const data = doc.data();
      console.log('Processing document:', doc.id, data);

      // Only process documents with confirmed bookings (status: "booked" and payment completed)
      if (data.status !== "booked") {
        console.log('Skipping document - not confirmed booking:', doc.id);
        return;
      }

      let slotToAdd = null;

      // Priority 1: Check selectedTimeSlot (most reliable)
      if (data.selectedTimeSlot && data.selectedTimeSlot.id) {
        slotToAdd = data.selectedTimeSlot;
        console.log('Found selectedTimeSlot:', slotToAdd);
      }
      // Priority 2: Check cartData array
      else if (data.cartData && Array.isArray(data.cartData) && data.cartData.length > 0) {
        const slot = data.cartData[data.cartData.length - 1]; // Get the last item (most recent)
        if (slot && slot.id && slot.start && slot.end) {
          slotToAdd = slot;
          console.log('Found slot in cartData:', slotToAdd);
        }
      }
      // Priority 3: Check lastItem directly
      else if (data.lastItem && data.lastItem.id) {
        slotToAdd = data.lastItem;
        console.log('Found lastItem:', slotToAdd);
      }

      // Add the slot if found and not already added
      if (slotToAdd && !bookedSlotIds.has(slotToAdd.id)) {
        bookedSlotIds.add(slotToAdd.id);
        bookedSlots.push(slotToAdd);
        console.log('Added booked slot:', slotToAdd);
      }
    });

    return bookedSlots;
  };

  // Fetch booked slots with real-time updates
  useEffect(() => {
    if (!date) {
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Setting up real-time listener for date:', date);
    
    const bookingsRef = collection(db, "rolexe");
    const q = query(bookingsRef, where("date", "==", date));

    // Use real-time listener for immediate updates
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        try {
          console.log('Received snapshot update, documents:', querySnapshot.size);
          
          const documents = querySnapshot.docs;
          const extractedSlots = extractBookedSlots(documents);
          
          console.log('Final booked slots:', extractedSlots);
          setBookedSlots(extractedSlots);
          setLoading(false);
        } catch (error) {
          console.error("Error processing booked slots:", error);
          setLoading(false);
          toast.error("Error loading booked slots. Please refresh the page.");
        }
      }, 
      (error) => {
        console.error("Error fetching booked slots:", error);
        setLoading(false);
        toast.error("Error connecting to database. Please check your internet connection.");
      }
    );

    // Cleanup subscription on component unmount or date change
    return () => {
      console.log('Cleaning up listener for date:', date);
      unsubscribe();
    };
  }, [date, bookingRefresh]);

  const handleBooking = () => {
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }

    // Check if the slot is already booked (double-check)
    const isSlotBooked = bookedSlots.some(booked => booked.id === selectedTimeSlot.id);
    if (isSlotBooked) {
      toast.error("This slot has been booked by someone else. Please select another slot.");
      setSelectedTimeSlot(null);
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
    
    // Add search params to navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('slot_id', selectedTimeSlot.id);
    newSearchParams.set('slot_time', `${selectedTimeSlot.start}-${selectedTimeSlot.end}`);
    
    navigate(`/user-details?${newSearchParams.toString()}`, {
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

  return (
    <div className="fontPoppin relative w-full min-h-screen p-4 flex items-center justify-center bg-cover bg-center bg-[url('/assets/home-header-01.jpg')]">
      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative md:max-w-[32rem] w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-4 md:p-6 z-10 md:mt-[7%] md:mb-[3%] mt-[26%]"
      >
        {/* Breadcrumb */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center text-sm text-gray-500 mb-4"
        >
          <span>Packages</span>
          <span className="mx-2">›</span>
          <span className="text-red-600 font-medium">Rolexe Theater T1</span>
        </motion.div>

        <motion.div 
          className="relative rounded-xl overflow-hidden mb-4"
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
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-red-600 mb-2">
                Rolexe Theater T1
              </h4>
              
              {/* Date and Time Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>2.5 hours duration</span>
                </div>
              </div>
            </div>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col items-end"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`px-4 py-2 rounded-full border text-sm font-medium ${
                loading 
                  ? 'bg-gray-50 text-gray-500 border-gray-300' 
                  : availableSlots > 0 
                    ? 'bg-green-50 text-green-600 border-green-300'
                    : 'bg-red-50 text-red-600 border-red-300'
              }`}>
                <span>
                  {loading ? 'Loading...' : `${availableSlots} Available`}
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600 mt-2">₹2,000</div>
            </motion.div>
          </motion.div>
          
          {/* Features Section */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100"
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Users className="w-6 h-6 text-red-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">Capacity</div>
                <div className="text-xs text-gray-600">Up to 12 people</div>
              </div>
            </motion.div>
      
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <PartyPopper className="w-6 h-6 text-pink-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">Decorations</div>
                <div className="text-xs text-gray-600">Included</div>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Star className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">Cozy</div>
                <div className="text-xs text-gray-600">Intimate setting</div>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">Facilities</div>
                <div className="text-xs text-gray-600">AC & Sound</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Time Slot Selection */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-red-600" />
              Select Time Slot
            </h3>

            {loading ? (
              <motion.div 
                variants={itemVariants}
                className="flex justify-center py-8"
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
                  className="w-10 h-10 border-t-3 border-b-3 rounded-full"
                />
              </motion.div>
            ) : (
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {timeSlots.map((slot, index) => {
                  const isBooked = bookedSlots.some((booked) => booked.id === slot.id);
                  const isPassed = isTimeSlotPassed(slot.start);
                  const isDisabled = isBooked || isPassed;
                  const isSelected = selectedTimeSlot && selectedTimeSlot.id === slot.id;
                  
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
                        scale: isSelected ? 1.05 : 1
                      }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={
                        !isDisabled
                          ? { 
                              scale: 1.08, 
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                            } 
                          : {}
                      }
                      whileTap={
                        !isDisabled
                          ? { scale: 0.95 }
                          : {}
                      }
                      disabled={isDisabled}
                      className={`relative p-4 rounded-xl border-2 text-sm transition-all duration-300 ${
                        isSelected
                          ? "border-red-500 bg-red-500 text-white shadow-lg"
                          : isBooked
                          ? "bg-red-100 border-red-300 text-red-700 cursor-not-allowed"
                          : isPassed
                          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed line-through"
                          : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      
                      <div className="font-medium text-center">
                        <div className="text-sm">{slot.start}</div>
                        <div className="text-xs opacity-75">to</div>
                        <div className="text-sm">{slot.end}</div>
                        {isBooked && <div className="text-xs mt-1 font-bold">BOOKED</div>}
                        {isPassed && <div className="text-xs mt-1">PASSED</div>}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
          
          {/* Pricing Information */}
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Pricing Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base price (up to 6 people):</span>
                <span className="font-semibold">₹2,000</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Extra person (above 6):</span>
                <span className="font-semibold">₹150 each</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Decorations:</span>
                <span className="font-semibold">Included</span>
              </div>
              <div className="pt-2 border-t border-blue-200 text-xs text-blue-600">
                Maximum capacity: 12 people
              </div>
            </div>
          </motion.div>

          {/* Book Now Button */}
          <motion.div className="pt-4">
            <motion.button
              onClick={handleBooking}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              disabled={!selectedTimeSlot || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedTimeSlot && !loading
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <motion.span
                initial={{ opacity: 1 }}
                animate={selectedTimeSlot ? {
                  opacity: [1, 0.8, 1],
                  scale: [1, 1.02, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-block"
              >
                {loading ? 'Loading Slots...' : selectedTimeSlot ? 'Continue Booking' : 'Select Time Slot'}
              </motion.span>
            </motion.button>
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