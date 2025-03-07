import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import BookingCard from "./Components/BookingCard";
import QuantityBirthday from "./Components/Quantity";
import ThankYouPage from "./Components/Thankyou";
import Context from "./Components/ContextApi/Context";
import Menu from "./Components/Menu";
import Packages from "./Components/Package/Package";
import Package from "./Components/Package/PackDum";
import Footer from './Components/Footer';
import Rolexe from "./Components/Rolexe/Rolexe";
import Deluxe from "./Components/Deluxe/Deluxe";
import Navbar from "./Components/Navbar";
import ServicesSection from './Components/Services/ServicesSection'
import ContactUs from './Components/ContactUs/Contact'
import TermsAndConditions from './Components/Terms&Condition/TermAndCondition'
import BirthdayGallery from './Components/BirthdayGallery'
import TermsMain from './Components/Terms&Condition/Terms'
import ScrollToTop from './Components/ScrollTop'
// import Privacy from './Components/Privacy'
import RefundPolicy from './Components/Privacy'

const App = () => {
  
  return (
   
    <Context>
     <BrowserRouter>
     <ScrollToTop />
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="BookingCard" element={<BookingCard />} />
        <Route path="QuantityBirthday" element={<QuantityBirthday />} />
        <Route path="ThankYouPage" element={<ThankYouPage />} />
        <Route path="Menu" element={<Menu/>}/>
        <Route path="Packages" element={<Packages/>}/>
        <Route path="Rolexe" element={<Rolexe/>}/>
        <Route path="Deluxe" element={<Deluxe/>}/>
        <Route path="ServicesSection" element={<ServicesSection/>}/>
        <Route path="ContactUs" element={<ContactUs/>}/>
        <Route path="TermsAndConditions" element={<TermsAndConditions/>}/>
        <Route path="TermsMain" element={<TermsMain/>}/>
        <Route path="Package" element={<Package/>}/>
        <Route path="BirthdayGallery" element={<BirthdayGallery/>}/>
        {/* <Route path="Privacy" element={<Privacy/>}/> */}
        <Route path="RefundPolicy" element={<RefundPolicy/>}/>




        
      </Routes>
      <Footer/>
     </BrowserRouter>
     
    </Context>
  );
};

export default App;
