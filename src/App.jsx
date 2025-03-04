import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import BookingCard from "./Components/BookingCard";
import QuantityBirthday from "./Components/Quantity";
import ThankYouPage from "./Components/Thankyou";
import Context from "./Components/ContextApi/Context";
import Menu from "./Components/Menu";
import Packages from "./Components/Package";
import Footer from './Components/Footer';
import Rolexe from "./Components/Rolexe/Rolexe";
import Deluxe from "./Components/Deluxe/Deluxe";


const App = () => {
  
  return (
   
    <Context>
     <BrowserRouter>
        {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="BookingCard" element={<BookingCard />} />
        <Route path="QuantityBirthday" element={<QuantityBirthday />} />
        <Route path="ThankYouPage" element={<ThankYouPage />} />
        <Route path="Menu" element={<Menu/>}/>
        <Route path="Packages" element={<Packages/>}/>
        <Route path="Rolexe" element={<Rolexe/>}/>
        <Route path="Deluxe" element={<Deluxe/>}/>
      </Routes>
      <Footer/>
     </BrowserRouter>
     
    </Context>
  );
};

export default App;
