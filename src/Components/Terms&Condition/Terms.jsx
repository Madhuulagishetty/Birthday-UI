import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const termsItems = [
    "We do NOT provide any movie/OTT accounts. We will do the setups using your OTT accounts/downloaded content.",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of RS. 750 plus convenience fee to book the slot."
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
          amount: bookingData.totalAmount,
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
      const bookingTime = bookingData.lastItem ? `${bookingData.lastItem.start} - ${bookingData.lastItem.end}` : "Not Available";
      const templateParams = {
        to_email: 'lagishettymadhu05@gmail.com',
        booking_date: bookingData.date,
        booking_time: bookingTime,
        whatsapp_number: bookingData.whatsapp,
        num_people: bookingData.people,
        decoration: bookingData.wantDecoration,
        total_amount: bookingData.totalAmount,
        payment_id: bookingData.paymentId,
      };

      await emailjs.send(
        'service_codgdqj',
        'template_g2368km',
        templateParams,
        '6qCccpL5QSAWvn5AJ'
      );
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const sendWhatsAppReminder = async (params) => {
    try {
      const { to, date, time } = params;
      const formattedNumber = to.startsWith('+') ? to : `+${to}`;
      
      const response = await fetch('https://backend-kf6u.onrender.com/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: formattedNumber, date, time }),
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
      paymentStatus: 'completed',
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
        amount: order.amount,
        currency: "INR",
        name: "Birthday Booking",
        description: "Birthday Celebration Booking",
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
                time: `${bookingData.lastItem.start} - ${bookingData.lastItem.end}`
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

  return (
    <div className="w-[100%] bg-white shadow-md rounded-lg pt-[7%] pb-[9%]">
      <div className="flex items-center pl-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="ml-2 text-lg">Back</span>
        </button>
      </div>
      
      <div className='w-[100%] flex justify-center flex-col items-center'>
        <div className='w-[50%]'>
          <h1 className="text-2xl font-bold text-center mb-8">Terms & Conditions</h1>
          
          <ol className="list-decimal pl-6 space-y-4">
            {termsItems.map((item, index) => (
              <li key={index} className="text-gray-800">{item}</li>
            ))}
          </ol>
          
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Refund policy</h2>
            <p>{Refund}</p>
          </div>

          <div className="mt-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <span className="text-gray-700">I have read and agree to the terms and conditions</span>
            </label>
          </div>

          {isChecked && bookingData && (
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <p>Total Amount: ₹{bookingData.totalAmount}</p>
              </div>
              
              <button
                             onClick={handlePayment}
                             disabled={!isChecked || isProcessing}
                              className={`w-full button-name text-white rounded-md py-3 font-medium transition-colors ${
                               isChecked ? 'hover:bg-pink-600 bg-pink-500' : 'bg-gray-400 cursor-not-allowed'      
                               }`}
                               >
                          {isProcessing ? 'Processing...' : `Pay ₹${bookingData?.totalAmount || 0}`}
                      </button>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default TermsMain;