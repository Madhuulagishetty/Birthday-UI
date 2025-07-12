import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { contextApi } from "./ContextApi/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, Calendar, Clock, Minus, Plus, Users, Gift, Check, PlusCircle, CreditCard, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const QuantityBirthday = () => { 
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { date, cartData, setDate, slotType } = useContext(contextApi);
  
  // Initialize state with default values
  const [people, setPeople] = useState(1);
  const [whatsapp, setWhatsapp] = useState("");
  const [decoration, setDecoration] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [NameUser, SetNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [wantDecoration, setWantDecoration] = useState("Yes");
  const [occasion, setOccasion] = useState("Anniversary");
  const [extraDecorations, setExtraDecorations] = useState([]);
  const [activeSection, setActiveSection] = useState("details");
  const [isAnimating, setIsAnimating] = useState(false);

  // Update URL with current state
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (date) newSearchParams.set('date', date);
    if (slotType) newSearchParams.set('package', slotType);
    if (people > 1) newSearchParams.set('people', people.toString());
    if (occasion !== 'Anniversary') newSearchParams.set('occasion', occasion);
    setSearchParams(newSearchParams);
  }, [date, slotType, people, occasion, setSearchParams]);

  // Get package-specific limits
  const packageLimits = {
    deluxe: { baseLimit: 10, maxLimit: 25, basePrice: 2500 },
    rolexe: { baseLimit: 6, maxLimit: 12, basePrice: 2000 },
    default: { baseLimit: 6, maxLimit: 12, basePrice: 2000 }
  };

  const currentPackage = packageLimits[slotType] || packageLimits.default;
  const { baseLimit, maxLimit, basePrice } = currentPackage;

  // Add a session identifier to track if this is a fresh page load or refresh
  useEffect(() => {
    const sessionId = sessionStorage.getItem('formSessionId');
    
    if (!sessionId) {
      const newSessionId = Date.now().toString();
      sessionStorage.setItem('formSessionId', newSessionId);
      
      // Clear related localStorage data
      localStorage.removeItem("people");
      localStorage.removeItem("whatsapp");
      localStorage.removeItem("bookingName");
      localStorage.removeItem("email");
      localStorage.removeItem("address");
      localStorage.removeItem("wantDecoration");
      localStorage.removeItem("occasion");
      localStorage.removeItem("extraDecorations");
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("people", people.toString());
    localStorage.setItem("whatsapp", whatsapp);
    localStorage.setItem("bookingName", bookingName);
    localStorage.setItem("email", email);
    localStorage.setItem("address", address);
    localStorage.setItem("wantDecoration", wantDecoration);
    localStorage.setItem("occasion", occasion);
    localStorage.setItem("extraDecorations", JSON.stringify(extraDecorations));
    localStorage.setItem("date", date); 
    localStorage.setItem("cartData", JSON.stringify(cartData)); 
    localStorage.setItem("slotType", slotType);
  }, [
    people, whatsapp, bookingName, email, address, wantDecoration,
    occasion, extraDecorations, date, cartData, slotType, NameUser
  ]);
  
  const decorationPrice = 0;
  const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;

  const calculateTotal = () => {
    let total = basePrice;

    if (wantDecoration === "Yes") {
      total += decorationPrice;
    }

    // Handle all decoration types with their proper prices
    const decorationPrices = {
      "fog-01": 500,
      "fog-02": 800,
      "candle_light": 300,
      "photo_clipping": 200,
      "led_numbers": 400,
      "led_hbd": 350,
      "candle_pathway": 250,
      "cold_piros": 600,
      "reel": 1000,
      "photography": 1500
    };

    extraDecorations.forEach(decoration => {
      total += decorationPrices[decoration] || 0;
    });
    
    // Apply different logic based on package type
    if (people > baseLimit) {
      total += (people - baseLimit) * 150;
    }

    return total;
  };

  const increment = () => {
    if (people < maxLimit) {
      setPeople(people + 1);
    } else {
      toast.error(`Maximum limit of ${maxLimit} people reached!`);
    }
  };

  const decrement = () => {
    if (people > 1) {
      setPeople(people - 1);
    }
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsAnimating(false);
    }, 150);
  };

  const handleProceed = () => {
    if (!bookingName.trim()) {
      toast.error("Please enter your booking name.");
      return;
    }
    if (!NameUser.trim()) {
      toast.error("Please enter the celebration person's name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your address.");
      return;
    }
    if (!date || !whatsapp.trim()) {
      toast.error("Please Select the Date and Enter WhatsApp Number.");
      return;
    }
    if (!lastItem || !lastItem.start || !lastItem.end) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }
    if (whatsapp.length !== 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(whatsapp)) {
      toast.error("Enter a valid WhatsApp number starting with 6-9");
      return;
    }

    const bookingData = {
      bookingName,
      email,
      address,
      date,
      people,
      whatsapp,
      decoration,
      wantDecoration,
      occasion,
      extraDecorations,
      totalAmount: calculateTotal(),
      cartData,
      slotType,
      lastItem,
      NameUser
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Add search params to navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('total', calculateTotal().toString());
    newSearchParams.set('step', 'payment');
    
    navigate(`/terms-conditions?${newSearchParams.toString()}`);
  };
  
  // Get icons for occasions
  const getOccasionIcon = (occ) => {
    const icons = {
      "Anniversary 👩‍❤️‍👨": "💑",
      "Birthday 🎂": "🎂",
      "Surprise  🥰": "🎁",
      "Proposal 🧡": "💍",
      "Kitty Party": "👯",
      "Groom To Be 🤴": "🤴",
      "Break-Up Party": "💔",
      "Bride To Be 🤴": "👰",
      "Batchelor Party": "🍻",
      "Conference Meeting": "💼",
      "Baby shower": "👶"
    };
    return icons[occ] || "🎉";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="fontPoppin relative min-h-screen p-4 flex items-center z-10 justify-center bg-cover bg-center w-full" 
      style={{ backgroundImage: "url('/assets/home-header-01.jpg')" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50 backdrop-blur-sm"></div>
       
      <motion.div 
        className="fontPoppin bg-white rounded-2xl shadow-2xl md:w-[600px] max-w-full z-10 mt-[20%] md:mt-[4%] overflow-hidden border border-white/20"
        variants={containerVariants}
      >
        {/* Enhanced Header with festive design */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white opacity-10 -ml-10 -mb-10"></div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-2 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Book Your Celebration
          </motion.h2>
          
          <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center">
            <motion.div 
              className="flex items-center bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm mb-2 md:mb-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Star className="w-5 h-5 mr-2 fill-amber-300 text-amber-200" />
              <span className="text-lg capitalize font-semibold">{slotType} Package</span>
            </motion.div>
            <motion.span 
              className="text-white/90 font-medium text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ₹{basePrice.toLocaleString()} base price
            </motion.span>
          </div>
          
          <motion.div 
            className="mt-4 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center bg-white/15 rounded-lg p-3 backdrop-blur-sm flex-1">
              <Calendar className="w-5 h-5 mr-2 text-white" />
              <span className="text-sm font-medium">{date || "Select date"}</span>
            </div>
            
            <div className="flex items-center bg-white/15 rounded-lg p-3 backdrop-blur-sm flex-1">
              <Clock className="w-5 h-5 mr-2 text-white" />
              <span className="text-sm font-medium">
                {lastItem ? `${lastItem.start} - ${lastItem.end}` : "Select time"}
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="flex border-b bg-gray-50">
          <motion.button 
            className={`flex-1 py-4 font-semibold text-center transition-all duration-300 ${
              activeSection === 'details' 
                ? 'text-purple-600 border-b-3 border-purple-600 bg-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleSectionChange('details')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Personal Details
            </div>
          </motion.button>
          <motion.button 
            className={`flex-1 py-4 font-semibold text-center transition-all duration-300 ${
              activeSection === 'decorations' 
                ? 'text-purple-600 border-b-3 border-purple-600 bg-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleSectionChange('decorations')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center">
              <Gift className="w-5 h-5 mr-2" />
              Decorations & Add-ons
            </div>
          </motion.button>
        </div>
        
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Personal Details Section */}
            {activeSection === 'details' && (
              <motion.div 
                key="details"
                className="space-y-6"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Booking Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300" 
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Number of people <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 rounded-xl p-2">
                      <motion.button 
                        onClick={decrement}
                        className="p-3 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus className="w-5 h-5 text-gray-600" />
                      </motion.button>
                      <input 
                        type="text" 
                        value={people}
                        className="w-20 text-center border-0 bg-transparent p-3 font-bold text-lg" 
                        readOnly
                      />
                      <motion.button 
                        onClick={increment}
                        className="p-3 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-700">
                        Max: {maxLimit} people
                      </span>
                    </div>
                  </div>
                  
                  {people > baseLimit && (
                    <motion.div 
                      className="mt-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium">Additional charges apply</p>
                        <p>₹150 per person beyond {baseLimit} people = ₹{(people - baseLimit) * 150}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">+91</span>
                    <input 
                      type="tel" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      className="w-full pl-16 border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300" 
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Celebration Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={NameUser}
                    onChange={(e) => SetNameUser(e.target.value)}
                    placeholder="Name of the person celebrating"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300" 
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email ID <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300" 
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-4 left-4 w-5 h-5 text-gray-400" />
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address"
                      rows={3}
                      className="w-full pl-12 border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none" 
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select the Occasion <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Anniversary 👩‍❤️‍👨", "Birthday 🎂", "Surprise  🥰", "Proposal 🧡", 
                      "Kitty Party", "Groom To Be 🤴", "Break-Up Party", 
                      "Bride To Be 🤴", "Batchelor Party", "Conference Meeting", "Baby shower"
                    ].map((occ) => (
                      <motion.button
                        key={occ}
                        type="button"
                        onClick={() => setOccasion(occ)}
                        className={`flex items-center px-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                          occasion === occ 
                            ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' 
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-2 text-lg">{getOccasionIcon(occ)}</span>
                        <span className="text-sm font-medium truncate">{occ}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={() => handleSectionChange('decorations')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlusCircle className="w-6 h-6 mr-3" />
                  Continue to Add Decorations
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.button>
              </motion.div>
            )}
            
            {/* Decorations Section */}
            {activeSection === 'decorations' && (
              <motion.div 
                key="decorations"
                className="space-y-6"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Do you want decoration? <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setWantDecoration("Yes")}
                      className={`py-4 px-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        wantDecoration === "Yes" 
                          ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' 
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Gift className="w-6 h-6 mr-3" />
                      <span className="font-semibold">Yes, Decorate (Included)</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => setWantDecoration("No")}
                      className={`py-4 px-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        wantDecoration === "No" 
                          ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md' 
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-semibold">No Decoration</span>
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Premium Add-ons</h3>
                    <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                      Select multiple
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { id: "fog-01", name: "Fog Entry (02 Pots)", price: 500, icon: "🌫️" },
                      { id: "fog-02", name: "Fog Entry (04 Pots)", price: 800, icon: "🌫️" },
                      { id: "candle_light", name: "Candle Light Dinner", price: 300, icon: "🕯️" },
                      { id: "photo_clipping", name: "Photo Clipping", price: 200, icon: "📸" },
                      { id: "led_numbers", name: "LED Numbers", price: 400, icon: "🔢" },
                      { id: "led_hbd", name: "LED HBD", price: 350, icon: "✨" },
                      { id: "candle_pathway", name: "Candle Pathway", price: 250, icon: "🕯️" },
                      { id: "cold_piros", name: "Cold Piros (02 pcs)", price: 600, icon: "❄️" },
                      { id: "reel", name: "Reel", price: 1000, icon: "📹" },
                      { id: "photography", name: "Photography (1 hour Unlimited)", price: 1500, icon: "📷" }
                    ].map((item, index) => (
                      <motion.label 
                        key={item.id} 
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          extraDecorations.includes(item.id) 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{item.icon}</span>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-700 mr-4">₹{item.price}</span>
                          <input 
                            type="checkbox"
                            className="w-6 h-6 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={extraDecorations.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExtraDecorations([...extraDecorations, item.id]);
                              } else {
                                setExtraDecorations(extraDecorations.filter(d => d !== item.id));
                              }
                            }}
                          />
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div className="mt-8" variants={itemVariants}>
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-100 shadow-inner">
                    <h4 className="text-xl font-bold mb-6 text-purple-800 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3" />
                      Price Breakdown
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">{slotType.charAt(0).toUpperCase() + slotType.slice(1)} Package</span>
                        <span className="font-bold">₹{basePrice.toLocaleString()}</span>
                      </div>
                      
                      {wantDecoration === "Yes" && (
                        <div className="flex justify-between items-center py-2">
                          <span className="font-medium">Standard Decoration</span>
                          <span className="font-bold text-green-600">Included</span>
                        </div>
                      )}
                      
                      {extraDecorations.length > 0 && (
                        <div className="pt-3 border-t border-purple-200">
                          <div className="text-sm font-semibold text-purple-800 mb-2">Premium Add-ons</div>
                          {extraDecorations.map(decorationId => {
                            const decoration = [
                              { id: "fog-01", name: "Fog Entry (02 Pots)", price: 500 },
                              { id: "fog-02", name: "Fog Entry (04 Pots)", price: 800 },
                              { id: "candle_light", name: "Candle Light Dinner", price: 300 },
                              { id: "photo_clipping", name: "Photo Clipping", price: 200 },
                              { id: "led_numbers", name: "LED Numbers", price: 400 },
                              { id: "led_hbd", name: "LED HBD", price: 350 },
                              { id: "candle_pathway", name: "Candle Pathway", price: 250 },
                              { id: "cold_piros", name: "Cold Piros", price: 600 },
                              { id: "reel", name: "Reel", price: 1000 },
                              { id: "photography", name: "Photography (1 hr)", price: 1500 }
                            ].find(d => d.id === decorationId);
                            
                            return decoration ? (
                              <div key={decorationId} className="flex justify-between text-sm py-1">
                                <span>{decoration.name}</span>
                                <span className="font-semibold">₹{decoration.price}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                      
                      {people > baseLimit && (
                        <div className="flex justify-between items-center py-2 text-amber-700">
                          <span className="font-medium">Extra People ({people - baseLimit} × ₹150)</span>
                          <span className="font-bold">₹{((people - baseLimit) * 150).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t-2 border-purple-200 mt-4">
                        <div className="flex justify-between items-center font-bold text-xl">
                          <span className="text-purple-800">Total Amount</span>
                          <span className="text-pink-600">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <motion.button
                      onClick={() => handleSectionChange('details')}
                      className="py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Back to Details
                    </motion.button>
                    
                    <motion.button 
                      onClick={handleProceed}
                      className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CreditCard className="w-6 h-6 mr-3" />
                      Proceed to Payment
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          marginTop: "5%",
        }}
      />
    </motion.div>
  );
};

export default QuantityBirthday;