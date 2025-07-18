import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import BookingCard from "./Components/BookingCard";
import BookingForm from "./Components/BookingForm/BookingForm";
import ThankYouPage from "./Components/Thankyou";
import Context from "./Components/ContextApi/Context";
import Menu from "./Components/Menu";
import Packages from "./Components/Package/Package";
import Package from "./Components/Package/PackDum";
import Footer from "./Components/Footer";
import TheaterSelection from "./Components/TheaterSelection/TheaterSelection";
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
import PaymentCallback from "./Components/PaymentCallback";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentRecoveryBanner from "./Components/PaymentRecoveryBanner";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorHandling";
import { NotificationProvider } from "./Components/NotificationSystem/NotificationSystem";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <ErrorBoundary>
      <Context>
        <NotificationProvider>
          <BrowserRouter>
            <RouteGuard>
              <Navbar />
              <PaymentRecoveryBanner />
              <ScrollToTop />
              <Routes>
            {/* Public routes */}
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

            {/* Payment callback and thank you routes */}
            <Route path="/payment-callback" element={<PaymentCallback />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/thank-you" element={<ThankYouPage />} />

            {/* Protected booking workflow routes with search params */}
            <Route 
              path="/packages" 
              element={
                <ProtectedRoute requiredStep="packages">
                  <Packages />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/theater/:theaterType" 
              element={
                <ProtectedRoute requiredStep="theater-selection">
                  <TheaterSelectionRoute />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/rolexe-package" 
              element={
                <ProtectedRoute requiredStep="rolexe-package">
                  <TheaterSelection theaterType="rolexe" />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/delux-package" 
              element={
                <ProtectedRoute requiredStep="delux-package">
                  <TheaterSelection theaterType="deluxe" />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user-details" 
              element={
                <ProtectedRoute requiredStep="user-details">
                  <BookingForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/terms-conditions" 
              element={
                 <ProtectedRoute requiredStep="terms-conditions">
                  <TermsMain />
                </ProtectedRoute>
              }/>

       
            <Route path="/booking-card" element={<BookingCard />} />
          </Routes>
          <Footer />
        </RouteGuard>
        
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
    </NotificationProvider>
  </Context>
</ErrorBoundary>
  );
};

// Theater Selection Component with dynamic routing
const TheaterSelectionRoute = () => {
  const { useParams } = require('react-router-dom');
  const { theaterType } = useParams();
  
  if (theaterType === 'rolexe') {
    return <TheaterSelection theaterType="rolexe" />;
  } else if (theaterType === 'deluxe') {
    return <TheaterSelection theaterType="deluxe" />;
  } else {
    return <Packages />;
  }
};

export default App;