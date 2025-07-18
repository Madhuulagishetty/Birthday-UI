import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Form validation utilities
export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value.toString().replace(/\D/g, ''))) {
      return 'Please enter a valid 10-digit phone number';
    }
    return null;
  },

  minLength: (length) => (value) => {
    if (!value) return null;
    if (value.toString().length < length) {
      return `Must be at least ${length} characters long`;
    }
    return null;
  },

  maxLength: (length) => (value) => {
    if (!value) return null;
    if (value.toString().length > length) {
      return `Must not exceed ${length} characters`;
    }
    return null;
  },

  range: (min, max) => (value) => {
    if (!value) return null;
    const num = parseInt(value);
    if (isNaN(num) || num < min || num > max) {
      return `Must be between ${min} and ${max}`;
    }
    return null;
  },

  custom: (validator) => (value) => {
    return validator(value);
  }
};

// Form field component with validation
export const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  onBlur,
  placeholder,
  validations = [],
  showValidation = false,
  disabled = false,
  className = '',
  icon: Icon,
  description,
  required = false,
  ...props 
}) => {
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState(false);

  const validate = (val) => {
    const newErrors = [];
    validations.forEach(validator => {
      const error = validator(val);
      if (error) {
        newErrors.push(error);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (touched || showValidation) {
      validate(newValue);
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    validate(e.target.value);
    if (onBlur) {
      onBlur(e);
    }
  };

  const hasErrors = errors.length > 0;
  const isValid = touched && !hasErrors && value;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <div className="flex items-center">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-400 absolute left-3 z-10" />
          )}
          
          {type === 'textarea' ? (
            <textarea
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              rows={4}
              className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                hasErrors && (touched || showValidation)
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : isValid
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              {...props}
            />
          ) : type === 'select' ? (
            <select
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                hasErrors && (touched || showValidation)
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : isValid
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              {...props}
            >
              {props.children}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                hasErrors && (touched || showValidation)
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : isValid
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              {...props}
            />
          )}
          
          {/* Validation icons */}
          {(touched || showValidation) && (
            <div className="absolute right-3">
              {hasErrors ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : null}
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      
      {/* Error messages */}
      {(touched || showValidation) && hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Form validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name] || [];
    const fieldErrors = [];
    
    rules.forEach(rule => {
      const error = rule(value);
      if (error) {
        fieldErrors.push(error);
      }
    });
    
    return fieldErrors;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const fieldErrors = validateField(field, values[field]);
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validationRules, values, validateField]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    setTouched(currentTouched => {
      if (currentTouched[name]) {
        const fieldErrors = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: fieldErrors }));
      }
      return currentTouched;
    });
  }, [validateField]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    setValues(currentValues => {
      const fieldErrors = validateField(name, currentValues[name]);
      setErrors(prev => ({ ...prev, [name]: fieldErrors }));
      return currentValues;
    });
  }, [validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    // Check if there are no errors, or if all error arrays are empty
    return Object.keys(errors).length === 0 || Object.keys(errors).every(key => 
      !errors[key] || (Array.isArray(errors[key]) && errors[key].length === 0)
    );
  }, [errors]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    validateForm,
    resetForm,
    isValid
  };
};

export default FormField;