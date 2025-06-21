import React, { createContext, useState, useEffect } from "react";

export const contextApi = createContext();

const Context = ({ children }) => {
  // Initialize cartData from localStorage
  const [cartData, setCartData] = useState(() => {
    const savedCartData = localStorage.getItem("cartData");
    return savedCartData ? JSON.parse(savedCartData) : [];
  });

  // Store date separately so it persists only in Quantity.jsx
  const [date, setDate] = useState(() => localStorage.getItem("date") || "");
  
  // Store slotType in localStorage
  const [slotType, setSlotType] = useState(() => localStorage.getItem("slotType") || "");

  // Add booking refresh trigger for real-time updates
  const [bookingRefresh, setBookingRefresh] = useState(0);

  useEffect(() => {
    localStorage.setItem("date", date);
  }, [date]);

  useEffect(() => {
    localStorage.setItem("slotType", slotType);
  }, [slotType]);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }, [cartData]);

  const AddtoCart = (items) => {
    const updatedCart = [...cartData, items];
    setCartData(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const AddtoSlot = (slot) => {
    setCartData([slot]);
    localStorage.setItem("cartData", JSON.stringify([slot]));
  };

  // Function to trigger booking refresh across components
  const triggerBookingRefresh = () => {
    setBookingRefresh(prev => prev + 1);
  };

  // Clear all booking data
  const clearBookingData = () => {
    setCartData([]);
    setDate("");
    setSlotType("");
    localStorage.removeItem("cartData");
    localStorage.removeItem("date");
    localStorage.removeItem("slotType");
    localStorage.removeItem("people");
    localStorage.removeItem("whatsapp");
    localStorage.removeItem("bookingName");
    localStorage.removeItem("email");
    localStorage.removeItem("address");
    localStorage.removeItem("wantDecoration");
    localStorage.removeItem("occasion");
    localStorage.removeItem("extraDecorations");
    localStorage.removeItem("bookingData");
  };

  return (
    <contextApi.Provider value={{ 
      date, 
      setDate, 
      slotType, 
      setSlotType, 
      cartData, 
      setCartData,
      AddtoCart, 
      AddtoSlot,
      bookingRefresh,
      triggerBookingRefresh,
      clearBookingData
    }}>
      {children}
    </contextApi.Provider>
  );
};

export default Context;
