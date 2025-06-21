import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { contextApi } from './ContextApi/Context';
import { toast } from 'react-toastify';

const RouteGuard = ({ children }) => {
  const { date, cartData, slotType } = useContext(contextApi);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    
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
      switch (currentPath) {
        case '/packages':
          if (!storedDate) {
            toast.error('Please select a date first');
            navigate('/', { replace: true });
            return false;
          }
          break;

        case '/delux-package':
        case '/rolexe-pakage':
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
          const paymentCompleted = sessionStorage.getItem('paymentCompleted');
          if (!paymentCompleted) {
            toast.error('Invalid access');
            navigate('/', { replace: true });
            return false;
          }
          break;

        default:
          // Allow access to other routes (home, contact, etc.)
          break;
      }
      return true;
    };

    // Only validate if not on home page
    if (currentPath !== '/') {
      validateRoute();
    }
  }, [location.pathname, date, cartData, slotType, navigate]);

  return children;
};

export default RouteGuard;