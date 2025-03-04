import React, { createContext, useState, useEffect } from "react";

export const contextApi = createContext(); // Create Context

const Context = ({ children }) => {
  // Initialize date from localStorage or empty string
  const [date, setDate] = useState(() => {
    return localStorage.getItem("selectedDate") || '';
  });
  
  // Initialize cartData from localStorage or empty array
  const [cartData, setCartData] = useState(() => {
    const savedCartData = localStorage.getItem("cartData");
    return savedCartData ? JSON.parse(savedCartData) : [];
  });

  const AddtoCart = (items) => {
    const updatedCart = [...cartData, items];
    setCartData(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const AddtoSlot = (slot) => {
    setCartData([slot]); // Replace the previous slot instead of adding a new one
    localStorage.setItem("cartData", JSON.stringify([slot]));
  };

  // Save date when updated
  useEffect(() => {
    if (date) {
      localStorage.setItem("selectedDate", date);
    }
  }, [date]);

  return (
    <contextApi.Provider value={{ date, setDate, cartData, AddtoCart, AddtoSlot }}>
      {children}
    </contextApi.Provider>
  );
};

export default Context;