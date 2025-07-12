import React, { useContext } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { contextApi } from './ContextApi/Context';

const ProtectedRoute = ({ children, requiredStep }) => {
  const { date, cartData, slotType } = useContext(contextApi);
  const location = useLocation();
  const [searchParams] = useSearchParams();

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

  // Check if this is a payment callback redirect
  const isPaymentCallback = () => {
    const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id');
    const orderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id');
    const paymentCompleted = sessionStorage.getItem('paymentCompleted');
    
    return paymentId && orderId && paymentCompleted === 'true';
  };

  // Check if user is coming from a payment success
  const hasValidPaymentSession = () => {
    const paymentCompleted = sessionStorage.getItem('paymentCompleted');
    const paymentId = sessionStorage.getItem('paymentId');
    const completedBookingData = localStorage.getItem('completedBookingData');
    
    return paymentCompleted === 'true' && (paymentId || completedBookingData);
  };

  // Define route requirements and redirect paths
  const routeRequirements = {
    packages: {
      check: () => storedData.date,
      redirectTo: '/',
      message: 'Please select a date first'
    },
    'theater-selection': {
      check: () => storedData.date,
      redirectTo: storedData.date ? '/packages' : '/',
      message: 'Please select a package first'
    },
    'delux-package': {
      check: () => storedData.date,
      redirectTo: storedData.date ? '/packages' : '/',
      message: 'Please select a package first'
    },
    'rolexe-package': {
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
          return storedData.slotType === 'deluxe' ? '/delux-package' : '/rolexe-package';
        }
        return '/user-details';
      },
      message: 'Please complete your booking details first'
    }
  };

  // Special handling for thank-you page - no protection needed
  if (requiredStep === 'thank-you') {
    return children;
  }

  // Get current route requirement
  const requirement = routeRequirements[requiredStep];

  if (!requirement) {
    // If no specific requirement, allow access
    return children;
  }

  // For payment callback or successful payment, allow access to most routes
  if (isPaymentCallback() || hasValidPaymentSession()) {
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

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;