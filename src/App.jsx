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
import Footer from "./Components/Footer";
import Rolexe from "./Components/Rolexe/Rolexe";
import Deluxe from "./Components/Deluxe/Deluxe";
import Navbar from "./Components/Navbar";
import ServicesMain from "./Components/Services/ServicesMain";
import ContactUs from "./Components/ContactUs/Contact";
import TermsAndCondition from "./Components/Terms&Condition/TermsAndCondition";
import GalleryMain from "./Components/BirthdayGallery/GalleryMain";
import TermsMain from "./Components/Terms&Condition/Terms";
import ScrollToTop from "./Components/ScrollTop";
import PrivacyPolicy from "./Components/privacy-policy/privacy";
import RefundPolicy from "./Components/Refund";
import AboutUs from "./Components/AboutUsSection/AboutUs";
import ProtectedRoute from "./Components/ProtectedRoute";
import RouteGuard from "./Components/RouteGuard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Context>
      <BrowserRouter>
        <RouteGuard>
          <Navbar />
          <ScrollToTop />
          <Routes>
            {/* Public routes - no protection needed */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/services" element={<ServicesMain />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/akkay-studio-packages" element={<Package />} />
            <Route path="/akkay-studio-gallery" element={<GalleryMain />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-condition" element={<TermsAndCondition />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Protected booking workflow routes */}
            <Route 
              path="/packages" 
              element={
                <ProtectedRoute requiredStep="packages">
                  <Packages />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/rolexe-pakage" 
              element={
                <ProtectedRoute requiredStep="rolexe-pakage">
                  <Rolexe />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/delux-package" 
              element={
                <ProtectedRoute requiredStep="delux-package">
                  <Deluxe />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user-details" 
              element={
                <ProtectedRoute requiredStep="user-details">
                  <QuantityBirthday />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/terms-conditions" 
              element={
                <ProtectedRoute requiredStep="terms-conditions">
                  <TermsMain />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/thank-you" 
              element={
                <ProtectedRoute requiredStep="thank-you">
                  <ThankYouPage />
                </ProtectedRoute>
              } 
            />

            {/* Legacy routes - you can remove these if not needed */}
            <Route path="/booking-card" element={<BookingCard />} />
            <Route path="/terms-conditions" element={<TermsMain />} />
          </Routes>
          <Footer />
        </RouteGuard>
        
        {/* Global Toast Container */}
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
          toastStyle={{
            marginTop: "5%",
          }}
        />
      </BrowserRouter>
    </Context>
  );
};

export default App;