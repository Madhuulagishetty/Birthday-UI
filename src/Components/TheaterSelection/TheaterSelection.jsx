import React, { useState, useEffect, useContext } from "react";
import { Users, PartyPopper, Calendar, Clock, Star, CheckCircle, ChevronLeft, ChevronRight, MapPin, Gift, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "../ContextApi/Context";
import { db } from "../../index";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";

// Theater configurations
const theaterConfigs = {
  deluxe: {
    name: "Deluxe Theater",
    price: 2500,
    capacity: "Up to 25 people",
    features: [
      "Premium sound system",
      "Luxury seating",
      "Advanced lighting",
      "Decorative themes",
      "Professional photography setup",
      "Complimentary snacks"
    ],
    images: [
      "/assets/delax-001.jpg",
      "/assets/delax-002.jpg", 
      "/assets/delax-003.jpg"
    ],
    colors: {
      primary: "from-purple-600 to-pink-600",
      secondary: "from-purple-100 to-pink-100",
      accent: "purple-600",
      text: "purple-800"
    },
    description: "Experience luxury with our premium deluxe theater featuring state-of-the-art amenities and elegant interiors."
  },
  rolexe: {
    name: "Rolexe Theater", 
    price: 2000,
    capacity: "Up to 12 people",
    features: [
      "Cozy intimate setting",
      "Quality sound system",
      "Comfortable seating",
      "Basic lighting",
      "Decoration support",
      "Refreshments available"
    ],
    images: [
      "/assets/relexe-001.jpg",
      "/assets/relexe-002.jpg",
      "/assets/relexe-003.jpg"
    ],
    colors: {
      primary: "from-blue-600 to-indigo-600",
      secondary: "from-blue-100 to-indigo-100", 
      accent: "blue-600",
      text: "blue-800"
    },
    description: "Perfect for intimate celebrations with our cozy rolexe theater offering personalized service and warm ambiance."
  }
};

const TheaterSelection = ({ theaterType = "deluxe" }) => {
  const { AddtoSlot, cartData, date, setSlotType, bookingRefresh } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Get current theater configuration
  const config = theaterConfigs[theaterType] || theaterConfigs.deluxe;

  const timeSlots = [
    { id: 1, start: "10:00 AM", end: "12:30 PM" },
    { id: 2, start: "01:00 PM", end: "3:30 PM" },
    { id: 3, start: "4:00 PM", end: "6:30 PM" },
    { id: 4, start: "7:00 PM", end: "9:30 PM" },
    { id: 5, start: "10:00 PM", end: "12:30 AM" }
  ];

  // Update URL with selected package info
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('package', theaterType);
    newSearchParams.set('from', 'packages');
    if (date) {
      newSearchParams.set('date', date);
    }
    setSearchParams(newSearchParams);
  }, [date, theaterType, setSearchParams]);

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
      
      // Handle different data structures
      if (data.selectedTimeSlot) {
        const slot = data.selectedTimeSlot;
        if (slot.id) {
          bookedSlotIds.add(slot.id);
          bookedSlots.push(slot);
        }
      }
      
      if (data.lastItem) {
        const slot = data.lastItem;
        if (slot.id) {
          bookedSlotIds.add(slot.id);
          bookedSlots.push(slot);
        }
      }
      
      // Handle cart data array
      if (data.cartData && Array.isArray(data.cartData)) {
        data.cartData.forEach(item => {
          if (item.id) {
            bookedSlotIds.add(item.id);
            bookedSlots.push(item);
          }
        });
      }
    });

    return Array.from(bookedSlotIds);
  };

  // Enhanced Firebase listener with better error handling
  useEffect(() => {
    if (!date) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSlotType(theaterType);

    const q = query(
      collection(db, theaterType),
      where("date", "==", date)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const documents = querySnapshot.docs;
          const bookedSlotIds = extractBookedSlots(documents);
          
          console.log(`📅 ${config.name} - Date: ${date}`);
          console.log(`🎭 Found ${documents.length} bookings`);
          console.log(`🚫 Booked slots: ${bookedSlotIds.join(', ')}`);
          
          setBookedSlots(bookedSlotIds);
          setIsLoading(false);
        } catch (error) {
          console.error('Error processing bookings:', error);
          toast.error('Error loading booking data. Please refresh the page.');
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Firebase listener error:', error);
        toast.error('Connection error. Please check your internet connection.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date, theaterType, bookingRefresh, setSlotType, config.name]);

  // Handle time slot selection
  const handleSlotSelection = (slot) => {
    if (bookedSlots.includes(slot.id) || isTimeSlotPassed(slot)) {
      toast.warn('This time slot is not available. Please choose another slot.');
      return;
    }

    setSelectedTimeSlot(slot);
    AddtoSlot(slot);
    toast.success(`${slot.start} - ${slot.end} slot selected!`);
    
    // Update URL with selected slot
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('slot', slot.id.toString());
    setSearchParams(newSearchParams);
  };

  // Navigate to next step
  const proceedToNextStep = () => {
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot to continue.');
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('package', theaterType);
    newSearchParams.set('date', date);
    newSearchParams.set('slot', selectedTimeSlot.id.toString());
    
    navigate(`/user-details?${newSearchParams.toString()}`);
  };

  // Go back to previous step
  const goBack = () => {
    navigate('/packages');
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${config.colors.primary} bg-clip-text text-transparent mb-2`}>
            {config.name}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {config.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="h-96 relative">
              <Slider {...sliderSettings}>
                {config.images.map((image, index) => (
                  <div key={index} className="relative h-96">
                    <img
                      src={image}
                      alt={`${config.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/placeholder-theater.jpg';
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            
            {/* Theater Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">{config.name}</h3>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${config.colors.primary} text-white font-semibold`}>
                  ₹{config.price}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{config.capacity}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{date}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${config.colors.primary} text-white font-medium hover:opacity-90 transition-opacity`}
              >
                {showDetails ? 'Hide Details' : 'Show Features'}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <CheckCircle className={`h-4 w-4 mr-2 text-${config.colors.accent}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - Time Slots */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Available Time Slots
              </h3>
              <div className="text-sm text-gray-500">
                {date}
              </div>
            </div>

            <div className="space-y-3">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot.id);
                const isPassed = isTimeSlotPassed(slot);
                const isSelected = selectedTimeSlot?.id === slot.id;
                const isUnavailable = isBooked || isPassed;

                return (
                  <motion.button
                    key={slot.id}
                    whileHover={!isUnavailable ? { scale: 1.02 } : {}}
                    whileTap={!isUnavailable ? { scale: 0.98 } : {}}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={isUnavailable}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? `border-${config.colors.accent} bg-gradient-to-r ${config.colors.secondary} shadow-lg`
                        : isUnavailable
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : `border-gray-200 hover:border-${config.colors.accent} hover:bg-gradient-to-r ${config.colors.secondary}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold text-lg">
                          {slot.start} - {slot.end}
                        </div>
                        <div className="text-sm text-gray-600">
                          2.5 hours duration
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isSelected && (
                          <CheckCircle className={`h-6 w-6 text-${config.colors.accent} mr-2`} />
                        )}
                        {isBooked && (
                          <span className="text-red-500 text-sm font-medium">Booked</span>
                        )}
                        {isPassed && (
                          <span className="text-gray-400 text-sm font-medium">Passed</span>
                        )}
                        {!isUnavailable && !isSelected && (
                          <span className={`text-${config.colors.accent} text-sm font-medium`}>Available</span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={goBack}
                className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Packages
              </button>
              <button
                onClick={proceedToNextStep}
                disabled={!selectedTimeSlot}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center ${
                  selectedTimeSlot
                    ? `bg-gradient-to-r ${config.colors.primary} text-white hover:opacity-90 shadow-lg`
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Details
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default TheaterSelection;