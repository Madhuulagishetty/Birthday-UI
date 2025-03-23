import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contextApi } from "./ContextApi/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, Calendar, Clock, Minus, Plus, Users, Gift, Check, PlusCircle, CreditCard } from 'lucide-react';

const QuantityBirthday = () => { 
  const navigate = useNavigate();
  const { date, cartData, setDate, slotType } = useContext(contextApi);
  
  // Initialize state with default values
  const [people, setPeople] = useState(1);
  const [whatsapp, setWhatsapp] = useState("");
  const [decoration, setDecoration] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [NameUser, SetNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [wantDecoration, setWantDecoration] = useState("Yes");
  const [occasion, setOccasion] = useState("Anniversary");
  const [extraDecorations, setExtraDecorations] = useState([]);
  const [activeSection, setActiveSection] = useState("details"); // For tabs: details, decorations

  // Get package-specific limits
  const packageLimits = {
    deluxe: { baseLimit: 10, maxLimit: 25 },
    rolexe: { baseLimit: 6, maxLimit: 12 },
    default: { baseLimit: 6, maxLimit: 12 }
  };

  const currentPackage = packageLimits[slotType] || packageLimits.default;
  const { baseLimit, maxLimit } = currentPackage;

  // Add a session identifier to track if this is a fresh page load or refresh
  useEffect(() => {
    // Check for a session ID in sessionStorage (will be lost on refresh)
    const sessionId = sessionStorage.getItem('formSessionId');
    
    if (!sessionId) {
      // This is a new session (page was refreshed or newly opened)
      // Generate a new session ID
      const newSessionId = Date.now().toString();
      sessionStorage.setItem('formSessionId', newSessionId);
      
      // Clear related localStorage data
      localStorage.removeItem("people");
      localStorage.removeItem("whatsapp");
      localStorage.removeItem("bookingName");
      localStorage.removeItem("email");
      localStorage.removeItem("wantDecoration");
      localStorage.removeItem("occasion");
      localStorage.removeItem("extraDecorations");
      
      // We keep the default state values set above
    }
  }, []);
    
  const resetFormFields = () => {
    setPeople(1);
    setWhatsapp("");
    setDecoration(false);
    setBookingName("");
    setEmail("");
    setWantDecoration("Yes");
    setOccasion("Anniversary");
    setExtraDecorations([]);
  };

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("people", people.toString());
    localStorage.setItem("whatsapp", whatsapp);
    localStorage.setItem("bookingName", bookingName);
    localStorage.setItem("email", email);
    localStorage.setItem("wantDecoration", wantDecoration);
    localStorage.setItem("occasion", occasion);
    localStorage.setItem("extraDecorations", JSON.stringify(extraDecorations));
    localStorage.setItem("date", date); 
    localStorage.setItem("cartData", JSON.stringify(cartData)); 
    localStorage.setItem("slotType", slotType);
  }, [
    people,
    whatsapp,
    bookingName,
    email,
    wantDecoration,
    occasion,
    extraDecorations,
    date,
    cartData,
    slotType,
    NameUser
  ]);
  
  const basePrice = slotType === "deluxe" ? 2000 : slotType === "rolexe" ? 1500 : 2000;
  console.log("Selected SlotType:", slotType);

  console.log(basePrice);
  const decorationPrice = 500;
  const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;

  const calculateTotal = () => {
    let total = basePrice;

    if (wantDecoration === "Yes") {
      total += decorationPrice;
    }

    // Handle all decoration types with their proper prices
    if (extraDecorations.includes("fog")) {
      total += 750; // Fog price
    }
    if (extraDecorations.includes("candle_light")) {
      total += 499; // Candle Light Dinner price
    }
    if (extraDecorations.includes("photo_clipping")) {
      total += 149; // Photo Clipping price
    }
    if (extraDecorations.includes("led_numbers")) {
      total += 99; // LED Numbers price
    }
    if (extraDecorations.includes("led_hbd")) {
      total += 99; // LED HBD price
    }
    if (extraDecorations.includes("candle_pathway")) {
      total += 249; // Candle Pathway price
    }
    if (extraDecorations.includes("cold_piros")) {
      total += 499; // Cold Piros price
    }
    if (extraDecorations.includes("reel")) {
      total += 999; // Reel price
    }
    if (extraDecorations.includes("photography")) {
      total += 1499; // Photography price
    }
    
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

  const handleProceed = () => {
    if (!bookingName.trim()) {
      toast.error("Please enter your booking name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
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
    navigate('/TermsMain');
  };
  
  // Get icons for occasions
  const getOccasionIcon = (occ) => {
    switch(occ) {
      case "Anniversary 👩‍❤️‍👨": return "💑";
      case "Birthday 🎂": return "🎂";
      case "Surprise  🥰": return "🎁";
      case "Proposal 🧡": return "💍";
      case "Kitty Party": return "👯";
      case "Groom To Be 🤴": return "🤴";
      case "Break-Up Party": return "💔";
      case "Bride To Be 🤴": return "👰";
      case "Batchelor Party": return "🍻";
      case "Conference Meeting": return "💼";
      case "Baby shower": return "👶";
      default: return "🎉";
    }
  };

  return (
    
    <div className="fontPoppin relative h-auto p-4 flex items-center z-10 justify-center bg-cover bg-center w-[100%]" style={{ backgroundImage: "url('assets/home-header-01.jpg')" }}>
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30 backdrop-blur"></div>
       
      <div className="fontPoppin bg-white rounded-xl shadow-2xl md:w-[500px] max-w-full z-10 mt-[20%] md:mt-[4%] overflow-hidden">
        {/* Header with festive design */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white opacity-10 -ml-10 -mb-10"></div>
          
          <h2 className="text-2xl font-bold mb-1 relative z-10">Book Your Celebration</h2>
          <div className="md:flex  md:gap-2 items-center flex-col md:flex-row">
            <div className="flex items-center bg-white/30 text-white px-3 py-1.5 rounded-full backdrop-blur-sm mb-2">
              <Star className="w-4 h-4 mr-1 fill-amber-300 text-amber-200" />
              <span className="text-lg capitalize font-semibold">{slotType} package</span>
            </div>
            <span className="ml-3 text-white/90 font-medium">₹{basePrice} base price</span>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Calendar className="w-4 h-4 mr-2 text-white" />
              <span className="text-sm">{date || "Select date"}</span>
            </div>
            
            <div className="flex items-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Clock className="w-4 h-4 mr-2 text-white" />
              <span className="text-sm">
                {lastItem ? `${lastItem.start} - ${lastItem.end}` : "Select time"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 font-medium text-center ${activeSection === 'details' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveSection('details')}
          >
            Personal Details
          </button>
          <button 
            className={`flex-1 py-3 font-medium text-center ${activeSection === 'decorations' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveSection('decorations')}
          >
            Decorations & Add-ons
          </button>
        </div>
        
        <div className="p-6">
          {/* Personal Details Section */}
          {activeSection === 'details' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of people <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={decrement}
                    className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <input 
                    type="text" 
                    value={people}
                    className="w-16 text-center border-t border-b border-gray-300 p-2" 
                    readOnly
                  />
                  <button 
                    onClick={increment}
                    className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="ml-3 flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      Max: {maxLimit} people
                    </span>
                  </div>
                </div>
                
                {people > baseLimit && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Additional charge of ₹150 per person beyond {baseLimit} people
                  </div>
                )}
              </div>
              
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+91</span>
                    <input 
                      type="tel" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      className="w-full pl-12 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                   Celebrations Person Name / "नाम उत्सव व्यक्ति" <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={NameUser}
                    onChange={(e) => SetNameUser(e.target.value)}
                    placeholder="Name of the person celebrating"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                  />
                </div>
              {/* </div> */}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select the Occasion <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Anniversary 👩‍❤️‍👨", "Birthday 🎂", "Surprise  🥰", "Proposal 🧡", 
                    "Kitty Party", "Groom To Be 🤴", "Break-Up Party", 
                    "Bride To Be 🤴", "Batchelor Party", "Conference Meeting", "Baby shower"
                  ].map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`flex items-center  px-1 py-1 rounded-lg border ${
                        occasion === occ 
                          ? 'bg-purple-50 border-purple-500 text-purple-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <span className="mr-2">{getOccasionIcon(occ)}</span>
                      <span className="text-sm truncate">{occ}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setActiveSection('decorations')}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center"
              >
                <PlusCircle className="w-[50px] h-[50px] mr-2 md:w-[30px] md:h-[30px]" />
                Continue to Add Decorations
              </button>
            </div>
          )}
          
          {/* Decorations Section */}
          {activeSection === 'decorations' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you want decoration? <span className="text-rose-500">*</span>
                </label>
                <div className="md:flex gap-3 flex flex-col  md:flex-row">
                  <button
                    type="button"
                    onClick={() => setWantDecoration("Yes")}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center  ${
                      wantDecoration === "Yes" 
                        ? 'bg-purple-50 border-purple-500 text-purple-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    <span>Yes, Decorate (₹500)</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setWantDecoration("No")}
                    className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center ${
                      wantDecoration === "No" 
                        ? 'bg-purple-50 border-purple-500 text-purple-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <span>No Decoration</span>
                  </button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Premium Add-ons</h3>
                  <span className="text-xs text-purple-600 font-medium">Select multiple</span>
                </div>
                
                <div className="space-y-2">
                  {[
                    { id: "fog", name: "Fog Entry", price: 750, icon: "🌫️" },
                    { id: "candle_light", name: "Candle Light Dinner", price: 499, icon: "🕯️" },
                    { id: "photo_clipping", name: "Photo Clipping", price: 149, icon: "📸" },
                    { id: "led_numbers", name: "LED Numbers", price: 99, icon: "🔢" },
                    { id: "led_hbd", name: "LED HBD", price: 99, icon: "✨" },
                    { id: "candle_pathway", name: "Candle Pathway", price: 249, icon: "🕯️" },
                    { id: "cold_piros", name: "Cold Piros (02 pcs)", price: 499, icon: "❄️" },
                    { id: "reel", name: "Reel", price: 999, icon: "📹" },
                    { id: "photography", name: "Photography (1 hour Unlimited Clicks)", price: 1499, icon: "📷" }
                  ].map(item => (
                    <label key={item.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      extraDecorations.includes(item.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-3">₹{item.price}</span>
                        <input 
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">Price Breakdown</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{slotType.charAt(0).toUpperCase() + slotType.slice(1)} Package</span>
                      <span>₹{basePrice}</span>
                    </div>
                    
                    {wantDecoration === "Yes" && (
                      <div className="flex justify-between">
                        <span>Standard Decoration</span>
                        <span>₹{decorationPrice}</span>
                      </div>
                    )}
                    
                    {extraDecorations.length > 0 && (
                      <div className="pt-2 border-t border-purple-100">
                        <div className="text-sm font-medium text-purple-800 mb-1">Add-ons</div>
                        {extraDecorations.includes("fog") && (
                          <div className="flex justify-between text-sm">
                            <span>Fog Machine</span>
                            <span>₹750</span>
                          </div>
                        )}
                        {extraDecorations.includes("candle_light") && (
                          <div className="flex justify-between text-sm">
                            <span>Candle Light Dinner</span>
                            <span>₹499</span>
                          </div>
                        )}
                        {extraDecorations.includes("photo_clipping") && (
                          <div className="flex justify-between text-sm">
                            <span>Photo Clipping</span>
                            <span>₹149</span>
                          </div>
                        )}
                        {extraDecorations.includes("led_numbers") && (
                          <div className="flex justify-between text-sm">
                            <span>LED Numbers</span>
                            <span>₹99</span>
                          </div>
                        )}
                        {extraDecorations.includes("led_hbd") && (
                          <div className="flex justify-between text-sm">
                            <span>LED HBD</span>
                            <span>₹99</span>
                          </div>
                        )}
                        {extraDecorations.includes("candle_pathway") && (
                          <div className="flex justify-between text-sm">
                            <span>Candle Pathway</span>
                            <span>₹249</span>
                          </div>
                        )}
                        {extraDecorations.includes("cold_piros") && (
                          <div className="flex justify-between text-sm">
                            <span>Cold Piros</span>
                            <span>₹499</span>
                          </div>
                        )}
                        {extraDecorations.includes("reel") && (
                          <div className="flex justify-between text-sm">
                            <span>Reel</span>
                            <span>₹999</span>
                          </div>
                        )}
                        {extraDecorations.includes("photography") && (
                          <div className="flex justify-between text-sm">
                            <span>Photography (1 hr)</span>
                            <span>₹1499</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {people > baseLimit && (
                      <div className="flex justify-between">
                        <span>Extra People ({people - baseLimit} × ₹150)</span>
                        <span>₹{(people - baseLimit) * 150}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-purple-200 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-purple-800">Total</span>
                        <span className="text-pink-600">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:flex flex-col gap-3 mt-6  flex gap-3">
                  <button
                    onClick={() => setActiveSection('details')}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Details
                  </button>
                  
                  <button 
                    onClick={handleProceed}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Book
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        toastStyle={{
          marginTop: window.innerWidth < 768 ? "15%" : "10%",
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          padding: "16px",
          fontSize: "14px",
        }}
      />
    </div>
  );
};

export default QuantityBirthday;