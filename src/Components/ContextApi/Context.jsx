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

  useEffect(() => {
    localStorage.setItem("date", date);
  }, [date]); // Update localStorage whenever date changes
  useEffect(() => {
    localStorage.setItem("slotType", slotType);
  }, [slotType]); // Update localStorage whenever slotType changes
  const AddtoCart = (items) => {
    const updatedCart = [...cartData, items];
    setCartData(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const AddtoSlot = (slot) => {
    setCartData([slot]);
    localStorage.setItem("cartData", JSON.stringify([slot]));
  };

  return (
    <contextApi.Provider value={{ date, setDate, slotType, setSlotType, cartData, AddtoCart, AddtoSlot }}>
            {children}
    </contextApi.Provider>
  );
};

export default Context;
