import React from 'react';
import { Loader, Star, Heart, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} ${className}`}
    >
      <Loader className="h-full w-full" />
    </motion.div>
  );
};

// Skeleton component for content loading
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  rounded = 'md'
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
};

// Card skeleton
export const CardSkeleton = ({ showImage = true, lines = 3 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      {showImage && (
        <Skeleton width="100%" height="12rem" rounded="lg" />
      )}
      <div className="space-y-3">
        <Skeleton width="75%" height="1.5rem" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            width={i === lines - 1 ? '60%' : '100%'} 
            height="1rem" 
          />
        ))}
      </div>
    </div>
  );
};

// Full page loading
export const FullPageLoading = ({ 
  message = 'Loading...', 
  submessage = '',
  showProgress = false,
  progress = 0
}) => {
  const icons = [Star, Heart, Gift];
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated icons */}
          <div className="flex justify-center space-x-4 mb-4">
            {icons.map((Icon, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
                className="text-blue-500"
              >
                <Icon className="h-8 w-8" />
              </motion.div>
            ))}
          </div>
          
          {/* Main spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <div className="w-full h-full rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </motion.div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message}</h2>
        {submessage && (
          <p className="text-gray-600 mb-4">{submessage}</p>
        )}
        
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600">{progress}% Complete</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ 
  loading = false, 
  children, 
  disabled = false,
  className = '',
  loadingText = 'Loading...',
  ...props 
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`relative ${className} ${
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

// Slot loading grid
export const SlotLoadingGrid = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center p-4 bg-white rounded-lg border">
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="1.25rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
          <Skeleton width="5rem" height="2rem" rounded="md" />
        </div>
      ))}
    </div>
  );
};

// Theater gallery loading
export const GalleryLoading = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <Skeleton width="100%" height="24rem" rounded="none" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton width="8rem" height="2rem" />
          <Skeleton width="5rem" height="2rem" rounded="full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="100%" height="1rem" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Payment processing loading
export const PaymentLoading = ({ 
  message = 'Processing your payment...',
  submessage = 'Please do not close this window'
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <div className="w-full h-full rounded-full border-4 border-green-200 border-t-green-600"></div>
            </motion.div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
          <p className="text-gray-600 text-sm">{submessage}</p>
          
          <div className="mt-6 flex justify-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex space-x-1"
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-500 rounded-full"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animation: 'bounce 1s infinite'
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  LoadingSpinner,
  Skeleton,
  CardSkeleton,
  FullPageLoading,
  ButtonLoading,
  SlotLoadingGrid,
  GalleryLoading,
  PaymentLoading
};