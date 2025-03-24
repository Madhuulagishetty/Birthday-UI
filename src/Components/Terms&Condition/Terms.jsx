import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../index';
import emailjs from '@emailjs/browser';

const TermsMain = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const payButtonRef = useRef(null);
  const [amountWithTax, setAmountWithTax] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0); // We'll calculate this with tax
  const [baseAdvanceAmount] = useState(1000); // Fixed base advance amount (before tax)
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      const parsedData = JSON.parse(data);
      setBookingData(parsedData);
      
      // No tax calculation here, just set the total amount
      const baseAmount = parsedData.totalAmount;
      setAmountWithTax(baseAmount);
      
      // Calculate advance amount with 2% tax
      const advanceTax = (baseAdvanceAmount * 0.02);
      const advanceWithTax = baseAdvanceAmount + advanceTax;
      setAdvanceAmount(advanceWithTax);
      
      // Calculate remaining amount (to be paid after event)
      setRemainingAmount(baseAmount - baseAdvanceAmount);
    } else {
      navigate('/');
    }
    
    // Trigger animations after component mounts
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, [navigate, baseAdvanceAmount]);

  const termsItems = [
    "We do NOT provide any movie/OTT accounts. We will do the setups using your OTT accounts/downloaded content.",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of ₹1000 to book the slot. The remaining amount will be collected after the event."
  ];
  
  const Refund = [
    "Advance amount is fully refundable if slot is cancelled at least 72 hrs before the slot time. If your slot is less than 72 hrs away from time of payment then advance is non-refundable."
  ];

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const response = await fetch('https://backend-kf6u.onrender.com/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: advanceAmount, 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const sendEmail = async (bookingData) => {
    try {
      const bookingTime = bookingData.lastItem
        ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}`
        : "Not Available";
  
      // Sending email using EmailJS
      const templateParams = {
        to_email: 'lagishettymadhu05@gmail.com',
        booking_date: bookingData.date,
        booking_time: bookingTime,
        whatsapp_number: bookingData.whatsapp,
        num_people: bookingData.people,
        decoration: bookingData.wantDecoration,
        advance_amount: advanceAmount,
        remaining_amount: remainingAmount,
        total_amount: amountWithTax,
        payment_id: bookingData.paymentId,
        extraDecorations: bookingData.extraDecorations,
        bookingName: bookingData.bookingName,
        slotType: bookingData.slotType,
        email: bookingData.email
      };
      
      fetch('https://sheetdb.io/api/v1/dqqdhuekivsab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              to_email: 'lagishettymadhu05@gmail.com',
              booking_date: bookingData.date,
              booking_time: bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : "Not Available",
              whatsapp_number: bookingData.whatsapp,
              num_people: bookingData.people,
              decoration: bookingData.wantDecoration ? "Yes" : "No",
              advance_amount: advanceAmount,
              remaining_amount: remainingAmount,
              total_amount: amountWithTax,
              payment_id: bookingData.paymentId,
              extraDecorations: bookingData.extraDecorations,
              bookingName: bookingData.bookingName,
              slotType: bookingData.slotType,
              email: bookingData.email,
              payment_status: "Partial (Advance paid)",
              NameUser:bookingData.NameUser
            }
          ]
        }),
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
      
      await emailjs.send(
        'service_codgdqj',
        'template_g2368km',
        templateParams,
        '6qCccpL5QSAWvn5AJ'
      );
  
      // Sending data to Formspree
      const formspreeEndpoint = "https://formspree.io/f/xldjejzn"; // Replace with your Formspree ID
      await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: bookingData.email, // If you have an email field
          booking_date: bookingData.date,
          booking_time: bookingTime,
          whatsapp_number: bookingData.whatsapp,
          num_people: bookingData.people,
          decoration: bookingData.wantDecoration ? "Yes" : "No",
          advance_amount: advanceAmount,
          remaining_amount: remainingAmount,
          total_amount: amountWithTax,
          payment_id: bookingData.paymentId,
          payment_status: "Partial (Advance paid)"
        }),
      });
  
    } catch (error) {
      console.error('Error sending email or Formspree request:', error);
    }
  };

  const sendWhatsAppReminder = async (params) => {
    try {
      const { to, date, time, remainingAmount } = params;
      const formattedNumber = to.startsWith('+') ? to : `+${to}`;
      
      const response = await fetch('https://backend-kf6u.onrender.com/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          to: formattedNumber, 
          date, 
          time,
          message: `Your booking is confirmed! \n\nDate: ${date} \nTime: ${time} \n\nAdvance Paid: ₹${advanceAmount.toFixed(2)} \nRemaining Amount: ₹${remainingAmount.toFixed(2)} (to be paid after the event) \n\nThank you for your booking!`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send WhatsApp reminder: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
    }
  };

  const saveToFirebase = async (paymentDetails) => {
    if (!bookingData) return;
    
    const saveData = {
      ...bookingData,
      status: "booked",
      paymentId: paymentDetails.razorpay_payment_id,
      timestamp: new Date(),
      paymentStatus: 'partial',
      advancePaid: advanceAmount,
      remainingAmount: remainingAmount,
      totalAmount: amountWithTax,
      orderId: paymentDetails.razorpay_order_id
    };

    const docRef = await addDoc(collection(db, bookingData.slotType), saveData);
    return { ...saveData, id: docRef.id };
  };

  const handlePayment = async () => {
    if (!isChecked) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await initializeRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const order = await createOrder();
      
      const options = {
        key: 'rzp_test_MAK9N9Rei9tuH6',
        amount: advanceAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Birthday Booking",
        description: "Advance Payment for Booking",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('https://backend-kf6u.onrender.com/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const savedBooking = await saveToFirebase(response);
            await sendEmail(savedBooking);
            
            if (bookingData?.lastItem) {
              await sendWhatsAppReminder({
                to: `+91${bookingData.whatsapp}`,
                date: bookingData.date,
                time: `${bookingData.lastItem.start} - ${bookingData.lastItem.end}`,
                remainingAmount: remainingAmount
              });
            }

            localStorage.removeItem('bookingData');
            toast.success("Booking confirmed! Check your email and WhatsApp for details.");
            navigate("/ThankYouPage");
          } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          contact: bookingData?.whatsapp || '',
        },
        theme: {
          color: "#5D0072",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isChecked && payButtonRef.current) {
      payButtonRef.current.classList.add('button-pulse');
    } else if (payButtonRef.current) {
      payButtonRef.current.classList.remove('button-pulse');
    }
  }, [isChecked]);

  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 to-pink-50 pt-16 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto pt-[3%]">
        <div className={`transition-all duration-500 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 py-4 px-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Terms & Conditions</h1>
            </div>
            
            <div className="p-6 md:p-8">
              <div className={`space-y-6 transition-all duration-700 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <ol className="list-decimal pl-6 space-y-4">
                  {termsItems.map((item, index) => (
                    <li 
                      key={index} 
                      className="text-gray-800 pb-3 border-b border-gray-100 last:border-0 transition-all duration-300"
                      style={{ 
                        transitionDelay: `${300 + (index * 50)}ms`,
                        opacity: animateIn ? 1 : 0,
                        transform: animateIn ? 'translateX(0)' : 'translateX(-20px)'
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ol>
                
                <div 
                  className="mt-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                  style={{ 
                    transitionDelay: '800ms',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <h2 className="text-xl font-bold mb-3 text-purple-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Refund Policy
                  </h2>
                  <p className="text-gray-700">{Refund}</p>
                </div>

                <div 
                  className="mt-8"
                  style={{ 
                    transitionDelay: '900ms',
                    opacity: animateIn ? 1 : 0,
                    transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="text-gray-700 font-medium">I have read and agree to the terms and conditions</span>
                  </label>
                </div>

                {bookingData && (
                  <div 
                    className="mt-6"
                    style={{ 
                      transitionDelay: '1000ms',
                      opacity: animateIn ? 1 : 0,
                      transform: animateIn ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg shadow-inner mb-6">
                      <h3 className="font-semibold text-lg mb-3 text-purple-800">Booking Summary</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium">Total Amount:</span>
                          <span className="text-xl font-bold text-pink-600">₹{amountWithTax.toFixed(2)}</span>
                        </div>

                        <div className="h-px bg-purple-100 my-2"></div>
                        
                        <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                          <span className="text-gray-800 font-medium">Advance Payment:</span>
                          <span className="text-lg font-bold text-green-600">₹{baseAdvanceAmount.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm pl-2">
                          <span className="text-gray-600">Convince fee (2%):</span>
                          <span className="text-gray-700">₹{(baseAdvanceAmount * 0.02).toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-green-100 p-2 rounded">
                          <span className="text-gray-800 font-medium">Advance Payment (Now):</span>
                          <span className="text-lg font-bold text-green-600">₹{advanceAmount.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-yellow-50 p-2 rounded">
                          <span className="text-gray-800 font-medium">Remaining (After Event):</span>
                          <span className="text-lg font-bold text-yellow-600">₹{remainingAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      ref={payButtonRef}
                      onClick={handlePayment}
                      disabled={!isChecked || isProcessing}
                      className={`w-full rounded-lg py-4 font-medium text-lg transition-all duration-300 transform ${
                        isChecked ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Pay Advance ₹${formatCurrency(advanceAmount)}`
                      )}
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      By clicking the button above, you agree to our Terms and Conditions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(237, 100, 166, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(237, 100, 166, 0);
          }
        }
        
        .button-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default TermsMain;