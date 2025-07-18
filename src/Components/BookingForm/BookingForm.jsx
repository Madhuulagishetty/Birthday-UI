import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { contextApi } from "../ContextApi/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Star, Calendar, Clock, Minus, Plus, Users, Gift, Check, 
  PlusCircle, CreditCard, MapPin, ChevronLeft, ChevronRight,
  User, Mail, Phone, PartyPopper, Sparkles,
  AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import ProgressIndicator from "../ProgressIndicator/ProgressIndicator";
import { FormField, validators, useFormValidation } from "../FormValidation/FormValidation";
import { ButtonLoading } from "../Loading/Loading";

const BookingForm = () => { 
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { date, cartData, setDate, slotType } = useContext(contextApi);
  
  // Form validation setup
  const initialValues = {
    bookingName: "",
    NameUser: "",
    email: "",
    address: "",
    whatsapp: "",
    people: 1,
    wantDecoration: "Yes",
    occasion: "Anniversary",
    extraDecorations: []
  };

  const validationRules = {
    bookingName: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    NameUser: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50)
    ],
    email: [
      validators.required,
      validators.email
    ],
    address: [
      validators.required,
      validators.minLength(10),
      validators.maxLength(200)
    ],
    whatsapp: [
      validators.required,
      validators.phone
    ],
    people: [
      validators.required,
      validators.range(1, 25)
    ]
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateForm,
    isValid
  } = useFormValidation(initialValues, validationRules);

  const [activeSection, setActiveSection] = useState("details");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isInitialized = useRef(false);

  // Load saved data on component mount
  useEffect(() => {
    if (!isInitialized.current) {
      const savedData = {
        bookingName: localStorage.getItem("bookingName") || "",
        NameUser: localStorage.getItem("NameUser") || "",
        email: localStorage.getItem("email") || "",
        address: localStorage.getItem("address") || "",
        whatsapp: localStorage.getItem("whatsapp") || "",
        people: parseInt(localStorage.getItem("people")) || 1,
        wantDecoration: localStorage.getItem("wantDecoration") || "Yes",
        occasion: localStorage.getItem("occasion") || "Anniversary",
        extraDecorations: JSON.parse(localStorage.getItem("extraDecorations") || "[]")
      };

      Object.keys(savedData).forEach(key => {
        setValue(key, savedData[key]);
      });
      
      isInitialized.current = true;
    }
  }, [setValue]); // Now it's safe to include setValue

  // Save to localStorage when values change
  useEffect(() => {
    Object.keys(values).forEach(key => {
      const value = typeof values[key] === 'object' ? JSON.stringify(values[key]) : values[key].toString();
      localStorage.setItem(key, value);
    });
  }, [values]);

  // Update URL with current state
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (date) newSearchParams.set('date', date);
    if (slotType) newSearchParams.set('package', slotType);
    if (values.people > 1) newSearchParams.set('people', values.people.toString());
    if (values.occasion !== 'Anniversary') newSearchParams.set('occasion', values.occasion);
    setSearchParams(newSearchParams);
  }, [date, slotType, values.people, values.occasion, setSearchParams]);

  // Get package-specific limits
  const packageLimits = {
    deluxe: { baseLimit: 10, maxLimit: 25, basePrice: 2500 },
    rolexe: { baseLimit: 6, maxLimit: 12, basePrice: 2000 },
    default: { baseLimit: 6, maxLimit: 12, basePrice: 2000 }
  };

  const currentPackage = packageLimits[slotType] || packageLimits.default;
  const { baseLimit, maxLimit, basePrice } = currentPackage;

  const decorationOptions = [
    { id: "fog-01", name: "Fog Machine - Basic", price: 500, icon: "🌫️" },
    { id: "fog-02", name: "Fog Machine - Premium", price: 800, icon: "🌫️" },
    { id: "candle_light", name: "Candle Light Setup", price: 300, icon: "🕯️" },
    { id: "photo_clipping", name: "Photo Clipping", price: 200, icon: "📸" },
    { id: "led_numbers", name: "LED Numbers", price: 400, icon: "🔢" },
    { id: "led_hbd", name: "LED Happy Birthday", price: 350, icon: "🎉" },
    { id: "candle_pathway", name: "Candle Pathway", price: 250, icon: "🕯️" },
    { id: "cold_piros", name: "Cold Pyros", price: 600, icon: "🎆" },
    { id: "reel", name: "Reel Creation", price: 1000, icon: "🎬" },
    { id: "photography", name: "Professional Photography", price: 1500, icon: "📷" }
  ];

  const occasionOptions = [
    "Anniversary", "Birthday", "Proposal", "Engagement", 
    "Valentine's Day", "Surprise", "Celebration", "Other"
  ];

  const calculateTotal = () => {
    let total = basePrice;

    // Add decoration prices
    values.extraDecorations.forEach(decorationId => {
      const decoration = decorationOptions.find(d => d.id === decorationId);
      if (decoration) {
        total += decoration.price;
      }
    });
    
    // Add extra person charges
    if (values.people > baseLimit) {
      total += (values.people - baseLimit) * 150;
    }

    return total;
  };

  const increment = () => {
    if (values.people < maxLimit) {
      setValue('people', values.people + 1);
    } else {
      toast.error(`Maximum limit of ${maxLimit} people reached!`);
    }
  };

  const decrement = () => {
    if (values.people > 1) {
      setValue('people', values.people - 1);
    }
  };

  const handleSectionChange = (section) => {
    if (section === activeSection) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsAnimating(false);
    }, 150);
  };

  const toggleDecoration = (decorationId) => {
    const currentDecorations = values.extraDecorations || [];
    const newDecorations = currentDecorations.includes(decorationId)
      ? currentDecorations.filter(id => id !== decorationId)
      : [...currentDecorations, decorationId];
    
    setValue('extraDecorations', newDecorations);
  };

  const handleProceed = async () => {
    // Basic validation for required fields
    const requiredFields = {
      bookingName: 'Booking Person Name',
      NameUser: 'Celebration Person Name',
      email: 'Email Address',
      whatsapp: 'WhatsApp Number',
      address: 'Address'
    };

    // Check for empty required fields
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!values[field] || values[field].toString().trim() === '') {
        toast.error(`Please fill in the ${label} field.`);
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(values.whatsapp.toString().replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;
    
    if (!lastItem || !lastItem.start || !lastItem.end) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }

    setIsProcessing(true);

    const bookingData = {
      ...values,
      date,
      totalAmount: calculateTotal(),
      cartData,
      slotType,
      lastItem
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Add search params to navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('total', calculateTotal().toString());
    newSearchParams.set('people', values.people.toString());
    newSearchParams.set('occasion', values.occasion);
    
    setTimeout(() => {
      navigate(`/terms-conditions?${newSearchParams.toString()}`);
    }, 1000);
  };

  const goBack = () => {
    navigate(-1);
  };

  // Simple validation check for button state
  const isFormValid = useMemo(() => {
    return (
      values.bookingName?.trim() &&
      values.NameUser?.trim() &&
      values.email?.trim() &&
      values.whatsapp?.trim() &&
      values.address?.trim() &&
      cartData.length > 0
    );
  }, [values, cartData]);

  const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;

  const renderSection = () => {
    switch (activeSection) {
      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Booking Person Name"
                value={values.bookingName}
                onChange={(value) => setValue('bookingName', value)}
                onBlur={() => setTouched('bookingName')}
                placeholder="Enter your full name"
                validations={validationRules.bookingName}
                showValidation={touched.bookingName}
                icon={User}
                required
              />
              
              <FormField
                label="Celebration Person Name"
                value={values.NameUser}
                onChange={(value) => setValue('NameUser', value)}
                onBlur={() => setTouched('NameUser')}
                placeholder="Who are we celebrating?"
                validations={validationRules.NameUser}
                showValidation={touched.NameUser}
                icon={PartyPopper}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Email Address"
                type="email"
                value={values.email}
                onChange={(value) => setValue('email', value)}
                onBlur={() => setTouched('email')}
                placeholder="your.email@example.com"
                validations={validationRules.email}
                showValidation={touched.email}
                icon={Mail}
                required
              />
              
              <FormField
                label="WhatsApp Number"
                type="tel"
                value={values.whatsapp}
                onChange={(value) => setValue('whatsapp', value)}
                onBlur={() => setTouched('whatsapp')}
                placeholder="Enter 10-digit number"
                validations={validationRules.whatsapp}
                showValidation={touched.whatsapp}
                icon={Phone}
                required
              />
            </div>

            <FormField
              label="Address"
              type="textarea"
              value={values.address}
              onChange={(value) => setValue('address', value)}
              onBlur={() => setTouched('address')}
              placeholder="Enter your complete address"
              validations={validationRules.address}
              showValidation={touched.address}
              icon={MapPin}
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Occasion <span className="text-red-500">*</span>
                </label>
                <select
                  value={values.occasion}
                  onChange={(e) => setValue('occasion', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {occasionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Number of People <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={decrement}
                    disabled={values.people <= 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-2xl font-semibold min-w-[3rem] text-center">
                    {values.people}
                  </span>
                  <button
                    type="button"
                    onClick={increment}
                    disabled={values.people >= maxLimit}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Base: {baseLimit} people. Max: {maxLimit} people. 
                  {values.people > baseLimit && (
                    <span className="text-blue-600 font-medium">
                      {" "}+₹{(values.people - baseLimit) * 150} for extra people
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "decorations":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <Sparkles className="inline h-6 w-6 mr-2" />
                Extra Decorations
              </h3>
              <p className="text-gray-600">
                Make your celebration even more special with these add-ons
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {decorationOptions.map(decoration => (
                <div
                  key={decoration.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    values.extraDecorations.includes(decoration.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleDecoration(decoration.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{decoration.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {decoration.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ₹{decoration.price}
                        </p>
                      </div>
                    </div>
                    {values.extraDecorations.includes(decoration.id) && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {values.extraDecorations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Selected Decorations:</h4>
                <div className="space-y-1">
                  {values.extraDecorations.map(decorationId => {
                    const decoration = decorationOptions.find(d => d.id === decorationId);
                    return decoration ? (
                      <div key={decorationId} className="flex justify-between text-sm">
                        <span>{decoration.name}</span>
                        <span className="font-medium">₹{decoration.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </motion.div>
        );

      case "summary":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                <Check className="inline h-6 w-6 mr-2" />
                Booking Summary
              </h3>
              <p className="text-gray-600">
                Review your booking details before proceeding
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Personal Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Booking Person:</span> {values.bookingName}</div>
                    <div><span className="text-gray-600">Celebration Person:</span> {values.NameUser}</div>
                    <div><span className="text-gray-600">Email:</span> {values.email}</div>
                    <div><span className="text-gray-600">WhatsApp:</span> {values.whatsapp}</div>
                    <div><span className="text-gray-600">Address:</span> {values.address}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Package:</span> {slotType} Theater</div>
                    <div><span className="text-gray-600">Date:</span> {date}</div>
                    <div><span className="text-gray-600">Time:</span> {lastItem?.start} - {lastItem?.end}</div>
                    <div><span className="text-gray-600">Occasion:</span> {values.occasion}</div>
                    <div><span className="text-gray-600">People:</span> {values.people}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Package ({slotType})</span>
                    <span>₹{basePrice}</span>
                  </div>
                  {values.people > baseLimit && (
                    <div className="flex justify-between">
                      <span>Extra People ({values.people - baseLimit} × ₹150)</span>
                      <span>₹{(values.people - baseLimit) * 150}</span>
                    </div>
                  )}
                  {values.extraDecorations.length > 0 && (
                    <div className="space-y-1">
                      {values.extraDecorations.map(decorationId => {
                        const decoration = decorationOptions.find(d => d.id === decorationId);
                        return decoration ? (
                          <div key={decorationId} className="flex justify-between">
                            <span>{decoration.name}</span>
                            <span>₹{decoration.price}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressIndicator currentStep="user-details" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
            <p className="text-blue-100">
              Fill in your details to reserve your special celebration
            </p>
          </div>

          {/* Section Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'details', label: 'Details', icon: User },
                { id: 'decorations', label: 'Decorations', icon: Sparkles },
                { id: 'summary', label: 'Summary', icon: Check }
              ].map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex-1 py-4 px-6 text-center transition-all ${
                      activeSection === section.id
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={goBack}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Theater Selection
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{calculateTotal()}
                  </div>
                </div>
                
                <ButtonLoading
                  loading={isProcessing}
                  loadingText="Processing..."
                  onClick={handleProceed}
                  disabled={!isFormValid || isProcessing}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                  <ChevronRight className="h-5 w-5 ml-2" />
                </ButtonLoading>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      />
    </div>
  );
};

export default BookingForm;