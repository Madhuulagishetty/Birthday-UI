import React from 'react';
import { Check, ChevronRight, Package, Calendar, Users, CreditCard, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ currentStep, className = "" }) => {
  const steps = [
    {
      id: 'packages',
      label: 'Choose Package',
      description: 'Select your theater',
      icon: Package,
      route: '/packages'
    },
    {
      id: 'theater-selection',
      label: 'Select Theater',
      description: 'Pick your preferred theater',
      icon: Calendar,
      route: '/theater'
    },
    {
      id: 'user-details',
      label: 'Your Details',
      description: 'Fill booking information',
      icon: Users,
      route: '/user-details'
    },
    {
      id: 'terms-conditions',
      label: 'Review & Pay',
      description: 'Confirm and payment',
      icon: CreditCard,
      route: '/terms-conditions'
    },
    {
      id: 'confirmation',
      label: 'Celebration!',
      description: 'Booking confirmed',
      icon: PartyPopper,
      route: '/thank-you'
    }
  ];

  const getCurrentStepIndex = () => {
    const index = steps.findIndex(step => step.id === currentStep);
    return index !== -1 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`w-full bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center mb-2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                      
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-1 ${
                      isCompleted
                        ? 'text-green-600'
                        : isCurrent
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </div>
                    <div className={`text-xs ${
                      isCompleted || isCurrent
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex items-center px-4">
                    <ChevronRight className={`h-5 w-5 ${
                      index < currentStepIndex ? 'text-green-500' : 'text-gray-300'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            />
          </div>
          
          {/* Current Step Info */}
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-gray-800">
              {steps[currentStepIndex]?.label}
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;