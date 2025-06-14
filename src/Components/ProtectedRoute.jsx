import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { contextApi } from './ContextApi/Context';

const ProtectedRoute = ({ children, requiredStep }) => {
  const { date, cartData, slotType } = useContext(contextApi);
  const location = useLocation();

  // Get stored data from localStorage
  const getStoredData = () => {
    return {
      date: date || localStorage.getItem('date'),
      cartData: cartData.length > 0 ? cartData : JSON.parse(localStorage.getItem('cartData') || '[]'),
      slotType: slotType || localStorage.getItem('slotType'),
      bookingName: localStorage.getItem('bookingName'),
      whatsapp: localStorage.getItem('whatsapp'),
      email: localStorage.getItem('email'),
      address: localStorage.getItem('address'),
      people: localStorage.getItem('people'),
      bookingData: localStorage.getItem('bookingData')
    };
  };

  const storedData = getStoredData();

  // Define route requirements and redirect paths
  const routeRequirements = {
    packages: {
      check: () => storedData.date,
      redirectTo: '/',
      message: 'Please select a date first'
    },
    'delux-package': {
      check: () => storedData.date,
      redirectTo: storedData.date ? '/packages' : '/',
      message: 'Please select a package first'
    },
    'rolexe-pakage': {
      check: () => storedData.date,
      redirectTo: storedData.date ? '/packages' : '/',
      message: 'Please select a package first'
    },
    'user-details': {
      check: () => {
        return storedData.date && 
               storedData.cartData && 
               storedData.cartData.length > 0 && 
               storedData.slotType;
      },
      redirectTo: () => {
        if (!storedData.date) return '/';
        if (!storedData.slotType) return '/packages';
        return '/packages';
      },
      message: 'Please select a time slot first'
    },
    'terms-conditions': {
      check: () => {
        return storedData.date && 
               storedData.cartData && 
               storedData.cartData.length > 0 && 
               storedData.slotType &&
               storedData.bookingName &&
               storedData.whatsapp &&
               storedData.email &&
               storedData.address &&
               storedData.people;
      },
      redirectTo: () => {
        if (!storedData.date) return '/';
        if (!storedData.slotType) return '/packages';
        if (!storedData.cartData || storedData.cartData.length === 0) {
          return storedData.slotType === 'deluxe' ? '/delux-package' : '/rolexe-pakage';
        }
        return '/user-details';
      },
      message: 'Please complete your booking details first'
    },
    'thank-you': {
      check: () => {
        // Check if user just completed payment (bookingData should be cleared after successful payment)
        // OR if they have a valid booking session
        const hasValidSession = sessionStorage.getItem('paymentCompleted') === 'true';
        return hasValidSession || storedData.bookingData;
      },
      redirectTo: '/',
      message: 'Invalid access to thank you page'
    }
  };

  // Get current route requirement
  const requirement = routeRequirements[requiredStep];

  if (!requirement) {
    // If no specific requirement, allow access
    return children;
  }

  // Check if requirement is met
  const isAllowed = requirement.check();

  if (!isAllowed) {
    // Determine redirect path
    let redirectPath = '/';
    if (typeof requirement.redirectTo === 'function') {
      redirectPath = requirement.redirectTo();
    } else {
      redirectPath = requirement.redirectTo;
    }

    // Show a toast notification if available
    if (window.toast) {
      window.toast.error(requirement.message);
    }

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;