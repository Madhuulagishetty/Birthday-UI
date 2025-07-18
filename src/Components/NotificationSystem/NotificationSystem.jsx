import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell,
  Calendar,
  CreditCard,
  Clock
} from 'lucide-react';

// Notification Context
const NotificationContext = createContext();

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (notification.duration !== -1) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, ...updates } : notif
      )
    );
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      title: options.title || 'Success',
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      title: options.title || 'Error',
      duration: options.duration || 7000,
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      title: options.title || 'Info',
      ...options
    });
  }, [addNotification]);

  const booking = useCallback((message, options = {}) => {
    return addNotification({
      type: 'booking',
      message,
      title: options.title || 'Booking Update',
      ...options
    });
  }, [addNotification]);

  const payment = useCallback((message, options = {}) => {
    return addNotification({
      type: 'payment',
      message,
      title: options.title || 'Payment Update',
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateNotification,
    success,
    error,
    warning,
    info,
    booking,
    payment
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Container
const NotificationContainer = () => {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationCard 
            key={notification.id} 
            notification={notification} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Notification Card
const NotificationCard = ({ notification }) => {
  const { removeNotification } = useNotifications();

  const typeConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      titleText: 'text-green-900',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      titleText: 'text-red-900',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      titleText: 'text-yellow-900',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      titleText: 'text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600'
    },
    booking: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      titleText: 'text-purple-900',
      icon: Calendar,
      iconColor: 'text-purple-600'
    },
    payment: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      titleText: 'text-indigo-900',
      icon: CreditCard,
      iconColor: 'text-indigo-600'
    }
  };

  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  const handleClose = () => {
    removeNotification(notification.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-lg shadow-lg border p-4
        ${config.bg} ${config.border}
      `}
    >
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${config.iconColor} mr-3 mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${config.titleText}`}>
            {notification.title}
          </div>
          <div className={`text-sm mt-1 ${config.text}`}>
            {notification.message}
          </div>
          
          {notification.actions && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    if (action.closeOnClick !== false) {
                      handleClose();
                    }
                  }}
                  className={`
                    text-xs font-medium px-3 py-1 rounded-md transition-colors
                    ${action.variant === 'primary' 
                      ? `bg-${notification.type === 'error' ? 'red' : notification.type === 'success' ? 'green' : 'blue'}-600 text-white hover:bg-${notification.type === 'error' ? 'red' : notification.type === 'success' ? 'green' : 'blue'}-700`
                      : `bg-transparent border ${config.border} ${config.text} hover:bg-opacity-20`
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          {notification.timestamp && notification.showTimestamp && (
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {notification.timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Progress bar for timed notifications */}
      {notification.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ 
            duration: notification.duration / 1000,
            ease: 'linear'
          }}
          className={`
            absolute bottom-0 left-0 h-1 
            ${notification.type === 'error' ? 'bg-red-400' :
              notification.type === 'success' ? 'bg-green-400' :
              notification.type === 'warning' ? 'bg-yellow-400' :
              'bg-blue-400'
            }
          `}
        />
      )}
    </motion.div>
  );
};

// Notification Bell Icon with count
export const NotificationBell = ({ className = '' }) => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`relative ${className}`}>
      <Bell className="h-6 w-6 text-gray-600" />
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}
    </div>
  );
};

// Predefined notification templates
export const NotificationTemplates = {
  bookingSuccess: (details) => ({
    type: 'booking',
    title: 'Booking Confirmed!',
    message: `Your ${details.package} theater booking for ${details.date} has been confirmed.`,
    duration: 8000,
    actions: [
      {
        label: 'View Details',
        onClick: () => window.location.href = '/booking-details',
        variant: 'primary'
      }
    ]
  }),

  paymentSuccess: (amount) => ({
    type: 'payment',
    title: 'Payment Successful',
    message: `Payment of ₹${amount} has been processed successfully.`,
    duration: 6000
  }),

  paymentPending: () => ({
    type: 'warning',
    title: 'Payment Processing',
    message: 'Your payment is being processed. Please wait...',
    duration: -1
  }),

  slotUnavailable: (time) => ({
    type: 'error',
    title: 'Slot Unavailable',
    message: `The ${time} slot is no longer available. Please select another time.`,
    duration: 5000
  }),

  formValidation: (field) => ({
    type: 'warning',
    title: 'Form Incomplete',
    message: `Please fill in the ${field} field to continue.`,
    duration: 4000
  }),

  networkError: () => ({
    type: 'error',
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection.',
    duration: 6000,
    actions: [
      {
        label: 'Retry',
        onClick: () => window.location.reload(),
        variant: 'primary'
      }
    ]
  }),

  maintenanceMode: () => ({
    type: 'info',
    title: 'Maintenance Notice',
    message: 'The system will be under maintenance from 2 AM to 4 AM.',
    duration: 10000
  })
};

export default {
  NotificationProvider,
  useNotifications,
  NotificationBell,
  NotificationTemplates
};