import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { contextApi } from './ContextApi/Context';
import { toast } from 'react-toastify';

const RouteGuard = ({ children }) => {
  const { date, cartData, slotType } = useContext(contextApi);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if this is a payment callback URL
    const isPaymentCallback = currentPath.includes('payment-callback') || 
                             currentPath.includes('payment-success') ||
                             searchParams.get('payment_id') || 
                             searchParams.get('razorpay_payment_id');

    // Check if user has valid payment session
    const hasValidPaymentSession = () => {
      const paymentCompleted = sessionStorage.getItem('paymentCompleted');
      const paymentId = sessionStorage.getItem('paymentId');
      const completedBookingData = localStorage.getItem('completedBookingData');
      
      return paymentCompleted === 'true' && (paymentId || completedBookingData);
    };

    // Skip validation for payment callbacks and thank-you page with valid session
    if (isPaymentCallback || 
        (currentPath === '/thank-you' && hasValidPaymentSession()) ||
        currentPath === '/payment-callback' ||
        currentPath === '/payment-success') {
      return;
    }
    
    // Get stored data
    const storedDate = date || localStorage.getItem('date');
    const storedCartData = cartData.length > 0 ? cartData : JSON.parse(localStorage.getItem('cartData') || '[]');
    const storedSlotType = slotType || localStorage.getItem('slotType');
    const storedBookingName = localStorage.getItem('bookingName');
    const storedWhatsapp = localStorage.getItem('whatsapp');
    const storedEmail = localStorage.getItem('email');
    const storedAddress = localStorage.getItem('address');
    const storedPeople = localStorage.getItem('people');

    // Route validation logic
    const validateRoute = () => {
      // Allow access to public routes
      const publicRoutes = [
        '/', '/menu', '/services', '/contact-us', '/akkay-studio-packages',
        '/akkay-studio-gallery', '/refund-policy', '/terms-condition',
        '/about-us', '/privacy-policy'
      ];

      if (publicRoutes.includes(currentPath)) {
        return true;
      }

      switch (currentPath) {
        case '/packages':
          if (!storedDate) {
            toast.error('Please select a date first');
            navigate('/', { replace: true });
            return false;
          }
          break;

        case '/delux-package':
        case '/rolexe-package':
          if (!storedDate) {
            toast.error('Please select a date first');
            navigate('/', { replace: true });
            return false;
          }
          break;

        case '/user-details':
          if (!storedDate) {
            toast.error('Please select a date first');
            navigate('/', { replace: true });
            return false;
          }
          if (!storedSlotType || !storedCartData || storedCartData.length === 0) {
            toast.error('Please select a time slot first');
            navigate('/packages', { replace: true });
            return false;
          }
          break;

        case '/terms-conditions':
          if (!storedDate) {
            toast.error('Please start from the beginning');
            navigate('/', { replace: true });
            return false;
          }
          if (!storedSlotType || !storedCartData || storedCartData.length === 0) {
            toast.error('Please select a time slot first');
            navigate('/packages', { replace: true });
            return false;
          }
          if (!storedBookingName || !storedWhatsapp || !storedEmail || !storedAddress || !storedPeople) {
            toast.error('Please complete your booking details first');
            navigate('/user-details', { replace: true });
            return false;
          }
          break;

        case '/thank-you':
          // Allow access if user has valid payment session or booking data
          if (!hasValidPaymentSession() && !localStorage.getItem('completedBookingData')) {
            toast.error('Invalid access to confirmation page');
            navigate('/', { replace: true });
            return false;
          }
          break;

        default:
          // Allow access to other routes
          break;
      }
      return true;
    };

    validateRoute();
  }, [location.pathname, date, cartData, slotType, navigate, searchParams]);

  return children;
};

export default RouteGuard;