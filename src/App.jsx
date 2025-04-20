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
  import ServicesMain from './Components/Services/ServicesMain'
  import ContactUs from './Components/ContactUs/Contact'
  import TermsAndCondition from './Components/Terms&Condition/TermsAndCondition'
  import GalleryMain from './Components/BirthdayGallery/GalleryMain'

  import TermsMain from './Components/Terms&Condition/Terms'
  import ScrollToTop from './Components/ScrollTop'
  import PrivacyPolicy from './Components/privacy-policy/privacy'
  import RefundPolicy from './Components/Refund'
  import AboutUs from './Components/AboutUsSection/AboutUs' 

  const App = () => {
    
    return (
    
      <Context>
      <BrowserRouter>
      
          <Navbar/>
          <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking-card" element={<BookingCard />} />
          <Route path="/user-details" element={<QuantityBirthday />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/menu" element={<Menu/>}/>
          <Route path="/packages" element={<Packages/>}/>
          <Route path="/rolexe-pakage" element={<Rolexe/>}/>
          <Route path="/delux-package" element={<Deluxe/>}/>
          <Route path="/services" element={<ServicesMain/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>
          
          <Route path="/terms-conditions" element={<TermsMain/>}/>
          <Route path="/akkay-studio-packages" element={<Package/>}/>
          <Route path="/akkay-studio-gallery" element={<GalleryMain/>}/>
          
          <Route path="/refund-policy" element={<RefundPolicy/>}/>
          <Route path="/terms-condition" element={<TermsAndCondition/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>






          
        </Routes>
        <Footer/>
      </BrowserRouter>
      
      </Context>
    );
  };

  export default App;
