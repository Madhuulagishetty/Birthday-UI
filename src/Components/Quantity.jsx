import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contextApi } from "./ContextApi/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Star } from 'lucide-react';

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

    console.log(basePrice)
  const decorationPrice = 500;
  const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;

  const calculateTotal = () => {
    let total = basePrice;

    if (wantDecoration === "Yes") {
      total += decorationPrice;
    }

    if (extraDecorations.includes("rose")) {
      total += 150;
    }
    if (extraDecorations.includes("candle")) {
      total += 300;
    }
    if (extraDecorations.includes("led")) {
      total += 100;
    }
    if (people > 6) {
      total += (people - 6) * 150;
    }

    return total;
  };

  const increment = () => {
    if (people < 12) {
      setPeople(people + 1);
    } else {
      toast.error("Maximum limit of 12 people reached!");
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

  return (
    <div className="fontPoppin relative w-full p-4 flex items-center z-10 justify-center bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1661726486910-7cfff916caad?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D')]">
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="fontPoppin bg-white rounded-lg shadow-lg md:w-[35%] px-4 py-4 z-10 mt-[20%] md:mt-[4%]">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 ">
          <div className="flex items-center bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full">
            <Star className="w-5 h-5 mr-1 fill-pink-500 text-pink-500" />
            <span className="text-xl capitalize font-semibold">{slotType} package</span>
          </div>
          <span className="text-sm font-medium text-gray-500">₹{basePrice} base price</span>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-3 mb-6 flex flex-col gap-3 justify-between md:flex-row">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-700">
              <rect width="18" height="18" x="3" y="4" rx="2"/>
              <path d="M16 2v4"/>
              <path d="M8 2v4"/>
              <path d="M3 10h18"/>
            </svg>
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-700">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-sm">
              {lastItem ? `${lastItem.start} - ${lastItem.end}` : ""}
            </span>
          </div>
        </div>
        
        
       
        <div className="text-center mb-6 w-[100%] flex justify-center">
          <h3 className="text-lg font-medium border-b border-black pb-2 md:w-[50%] w-[100%]">Booking Details</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Booking Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Number of people</label>
            <div className="flex items-center">
              <button 
                onClick={decrement}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <input 
                type="text" 
                value={people}
                className="w-16 mx-2 text-center border rounded-md p-2" 
                readOnly
              />
              <button 
                onClick={increment}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              
              {people > 6 && (
                <span className="ml-2 text-xs text-red-500">
                  If more than 6 peoples then Rs 150/extra per person. Maximum 12 peoples can book.
                </span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Whatsapp Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={NameUser}
              onChange={(e) => SetNameUser(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Do you want decoration? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={wantDecoration}
                onChange={(e) => setWantDecoration(e.target.value)}
                className="w-full appearance-none border rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Select the Occasion</label>
            <div className="relative">
              <select 
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full appearance-none border rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Anniversary</option>
                <option>Birthday</option>
                <option>Date</option>
                <option>Proposal</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Extra Decoration</label>
            <div className="gap-3 flex md:items-center flex-col md:flex-row">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="rose"
                  checked={extraDecorations.includes("rose")}
                  onChange={(e) => {
                    const val = "rose";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 150 Rose Heart</span>
              </label>

              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="candle"
                  checked={extraDecorations.includes("candle")}
                  onChange={(e) => {
                    const val = "candle";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 300 Candle Path</span>
              </label>

              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="led"
                  checked={extraDecorations.includes("led")}
                  onChange={(e) => {
                    const val = "led";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 100 LED Numbers</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-pink-100 rounded">
          <h4 className="text-lg font-semibold mb-2">Price Breakdown</h4>
          <div className="flex justify-between">
            <span>Base price</span>
            <span>₹{basePrice}</span>
          </div>
          {wantDecoration === "Yes" && (
            <div className="flex justify-between">
              <span>Decoration (₹500)</span>
              <span>₹{decorationPrice}</span>
            </div>
          )}

          {extraDecorations.includes("rose") && (
            <div className="flex justify-between">
              <span>Rose Heart</span>
              <span>₹150</span>
            </div>
          )}
          {extraDecorations.includes("candle") && (
            <div className="flex justify-between">
              <span>Candle Path</span>
              <span>₹300</span>
            </div>
          )}
          {extraDecorations.includes("led") && (
            <div className="flex justify-between">
              <span>LED Numbers</span>
              <span>₹100</span>
            </div>
          )}
           {people > 6 && (
    <div className="flex justify-between">
      <span>Extra People ({people - 6} × ₹150)</span>
      <span>₹{(people - 6) * 150}</span>
    </div>
  )}

          <hr className="my-2" />
          <div className="flex justify-between font-bold text-purple-700">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center">
      <button 
        onClick={handleProceed}
        className="w-full sm:w-auto px-6 text-[15px] rounded-3xl sm:px-8 utton-name bg-pink-500 hover:bg-pink-600 text-white  py-3 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
         >
           Proceed to Terms & Conditions
        </button>
          </div>

        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false}      toastStyle={{
            marginTop: window.innerWidth < 768 ? "15%" : "10%",
          }}/>
      </div>
    </div>
  );
};

export default QuantityBirthday;