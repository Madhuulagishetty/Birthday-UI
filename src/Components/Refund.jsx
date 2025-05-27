import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  const policyRef = useRef(null);

  // Effect for smooth scrolling to the component on load
 useEffect(() => {
     window.scrollTo({
       top: 0,
       behavior: 'smooth'
     });
   });
 

  return (
    <div ref={policyRef} className='w-full flex justify-center items-center scroll-mt-16'>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mb-[4%] mt-[6%] w-full"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center mt-[20%] md:mt-[0%]"
        >
          Refund Policy
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="prose prose-lg text-gray-600"
        >
          <p className="mb-4">
            We collect an advance amount of Rs 1000 for reservation of a slot. This advance amount is fully refundable 
            (except convenience charges of payment gateway, if any) if booking is cancelled or we are informed about 
            cancellation through WhatsApp chat, at least 48 hours before the slot time.
          </p>
          <p className="mb-4">
            Refund is usually initiated within 24 hours and takes maximum 3-5 days to be completed.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>All cancellations must be made at least 72 hours before your appointment to receive a full refund.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">72 Hours Notice</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">Cancel at least 72 hours before your slot time</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">Rescheduled</h3>
            
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center">3-5 Business Days</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">Refund processing time after initiation</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 border-t border-gray-200 pt-6"
        >
          <p className="text-sm text-gray-500">
            For any questions regarding our refund policy, please contact our support team through WhatsApp.
          </p>
        </motion.div>
      </motion.div> 
    </div>
  );
};

export default RefundPolicy;