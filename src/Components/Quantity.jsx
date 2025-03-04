import React, { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { contextApi } from "./ContextApi/Context";
import { db } from "../index";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your private key
emailjs.init("9FpibhxUX2G99xT68LUtD");

const QuantityBirthday = () => {
  const navigate = useNavigate();
  const { date, cartData ,setDate} = useContext(contextApi);
  useEffect(() => {
    // Load date from localStorage when Quantity mounts
    const savedDate = localStorage.getItem("date");
    if (savedDate) setDate(savedDate);
  }, []);
  const [people, setPeople] = useState(1);
  const [whatsapp, setWhatsapp] = useState("");
  const [decoration, setDecoration] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [email, setEmail] = useState("");
  const [wantDecoration, setWantDecoration] = useState("Yes");
  const [occasion, setOccasion] = useState("Anniversary");
  // const [extrapopl,SetExtraPeople]=useState(0)

  // -------------------------------------------------------------------
  // ORIGINAL single-radio approach (commented out, but not removed):
  // const [extraDecor, setExtraDecor] = useState("candle");
  // -------------------------------------------------------------------

  // NEW: multiple checkboxes approach
  const [extraDecorations, setExtraDecorations] = useState([]);

  const basePrice = 2000;
  const decorationPrice = 300;
  const lastItem = cartData.length > 0 ? cartData[cartData.length - 1] : null;

  // -------------------------------------------------------------------
  // Expanded logic: charge ₹500 per person for decoration + sum of all
  // selected extra decorations from the new `extraDecorations` array
  // -------------------------------------------------------------------
  const calculateTotal = () => {
    let total = basePrice;

    // If user selected "Yes" for decoration, charge ₹500 × number of people
    if (wantDecoration === "Yes") {
      total += decorationPrice;
    }

    // For each selected item in extraDecorations, add its cost
    if (extraDecorations.includes("rose")) {
      total += 150;
    }
    if (extraDecorations.includes("candle")) {
      total += 300;
    }
    if (extraDecorations.includes("led")) {
      total += 100;
    }
    if (people > 6) {
      total += (people - 6) * 150;
    }
    

    return total;
  };
 
  const increment = () => {
    if (people < 12) {
      setPeople(people + 1);
    } else {
      toast.error("Maximum limit of 12 people reached!");
    }
  };

  const decrement = () => {
    if (people > 1) {
      setPeople(people - 1);
    }
  };

  const sendEmail = async (bookingData) => {
    try {
      const bookingTime = lastItem ? `${lastItem.start} - ${lastItem.end}` : "Not Available";
      const templateParams = {
        to_email: 'lagishettymadhu05@gmail.com',
        booking_date: date,
        booking_time: bookingTime,
        whatsapp_number: whatsapp,
        num_people: people,
        decoration: decoration ? 'Yes' : 'No',
        total_amount: calculateTotal(),
        payment_id: bookingData.paymentId,
      };
  
      console.log('Sending Email with Data:', templateParams);
  
      await emailjs.send(
        'service_codgdqj',
        'template_g2368km',
        templateParams,
        '6qCccpL5QSAWvn5AJ'
      );
  
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };  

  // Function to send WhatsApp reminder
  const sendWhatsAppReminder = async (params) => {
    try {
      const { to, date, time } = params;
      const formattedNumber = to.startsWith('+') ? to : `+${to}`;
      
      console.log('Sending WhatsApp to:', formattedNumber, 'with date:', date, 'and time:', time);
      
      const response = await fetch('https://backend-kf6u.onrender.com/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: formattedNumber, date, time }),
      });
      
      const responseText = await response.text();
      console.log('WhatsApp API response:', response.status, responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to send WhatsApp reminder: ${response.status} ${responseText}`);
      }
      
      try {
        const result = JSON.parse(responseText);
        console.log('WhatsApp reminder sent successfully:', result);
      } catch (e) {
        console.log('Could not parse response as JSON:', responseText);
      }
      
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
    }
  };

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
          amount: calculateTotal(),
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

  const saveToFirebase = async (paymentDetails) => {
    const bookingData = {
      bookingName,
      email,
      date,
      people,
      whatsapp,
      decoration,
      cartData,
      status: "booked",
      paymentId: paymentDetails.razorpay_payment_id,
      timestamp: new Date(),
      amount: calculateTotal(),
      bookingTime: lastItem ? `${lastItem.start} - ${lastItem.end}` : "Not Available",
      decorationPackage: decoration ? 'Yes' : 'No',
      basePrice,
      decorationPrice: decoration ? decorationPrice : 0,
      totalAmount: calculateTotal(),
      paymentStatus: 'completed',
      orderId: paymentDetails.razorpay_order_id
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    return { ...bookingData, id: docRef.id };
  };

  const bookSlot = async () => {
    if (!bookingName.trim()) {
      toast.error("Please enter your booking name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!date || !whatsapp.trim()) {
      toast.error("Please Select the Date and Enter WhatsApp Number.");
      return;
    }
    if (!lastItem || !lastItem.start || !lastItem.end) {
      toast.error("Please select a time slot before proceeding.");
      return;
    }
    if (whatsapp.length !== 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(whatsapp)) {
      toast.error("Enter a valid WhatsApp number starting with 6-9");
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

            const bookingData = await saveToFirebase(response);
            await sendEmail(bookingData);
            
            const bookingTime = lastItem ? `${lastItem.start} - ${lastItem.end}` : "Not Available";
            await sendWhatsAppReminder({
              to: `+91${whatsapp}`,
              date: date,
              time: bookingTime
            });

            toast.success("Booking confirmed! Check your email and WhatsApp for details.");
            navigate("/ThankYouPage");
          } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          contact: whatsapp,
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
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot. Please try again.");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false)
    }
  };

  return (
    <div className=" relative w-full h-full min-h-screen flex flex-col justify-center items-center p-3 bg-gray-100">
      <h1 className=" fontCursive text-2xl text-center text-blue-700 mb-6 animate-fade-in">
        Rotexe Theater TI
      </h1>
       
      <div className="fontPoppin bg-white rounded-lg shadow-lg  w-[35%] px-4 py-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl text-[#024D87] font-medium">Overview</h2>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-3 mb-6 flex justify-between">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              className="mr-2 text-blue-700"
            >
              <rect width="18" height="18" x="3" y="4" rx="2"/>
              <path d="M16 2v4"/>
              <path d="M8 2v4"/>
              <path d="M3 10h18"/>
            </svg>
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
              className="mr-2 text-blue-700"
            >
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-sm">
              {lastItem ? `${lastItem.start} - ${lastItem.end}` : "04:00 PM TO 06:30 PM"}
            </span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium border-b pb-2">Booking Details</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Booking Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Number of people</label>
            <div className="flex items-center">
              <button 
                onClick={decrement}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <input 
                type="text" 
                value={people}
                className="w-16 mx-2 text-center border rounded-md p-2" 
                readOnly
              />
              <button 
                onClick={increment}
                className="p-1 border rounded-full hover:bg-gray-100"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              
              {people > 6 && (
                <span className="ml-2 text-xs text-red-500">
                  If more than 6 peoples then Rs 150/extra per person. Maximum 12 peoples can book.
                </span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Whatsapp Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              Do you want decoration? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={wantDecoration}
                onChange={(e) => setWantDecoration(e.target.value)}
                className="w-full appearance-none border rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 
                       111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 
                       010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Select the Occasion</label>
            <div className="relative">
              <select 
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full appearance-none border rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Anniversary</option>
                <option>Birthday</option>
                <option>Date</option>
                <option>Proposal</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 
                       111.414 1.414l-4 4a1 1 0 
                       01-1.414 0l-4-4a1 1 0 
                       010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Extra Decoration</label>

            {/* OLD single-radio logic (commented out, but kept) */}
            {/*
            <div className="gap-3 flex items-center">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="extraDecor" 
                  value="rose"
                  checked={extraDecor === "rose"}
                  onChange={() => setExtraDecor("rose")}
                  className="mr-[2px]" 
                />
                <span className="text-[14px]">₹ 150 Rose Heart</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="extraDecor" 
                  value="candle"
                  checked={extraDecor === "candle"}
                  onChange={() => setExtraDecor("candle")}
                  className="mr-[2px]" 
                />
                <span className="text-[14px]">₹ 300 Candle Path</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="extraDecor" 
                  value="led"
                  checked={extraDecor === "led"}
                  onChange={() => setExtraDecor("led")}
                  className="mr-[2px]" 
                />
                <span className="text-[14px]">₹ 100 LED Numbers</span>
              </label>
            </div>
            */}

            {/* NEW multiple-checkbox logic */}
            <div className="gap-3 flex items-center">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="rose"
                  checked={extraDecorations.includes("rose")}
                  onChange={(e) => {
                    const val = "rose";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 150 Rose Heart</span>
              </label>

              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="candle"
                  checked={extraDecorations.includes("candle")}
                  onChange={(e) => {
                    const val = "candle";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 300 Candle Path</span>
              </label>

              <label className="flex items-center">
                <input 
                  type="checkbox"
                  value="led"
                  checked={extraDecorations.includes("led")}
                  onChange={(e) => {
                    const val = "led";
                    if (e.target.checked) {
                      setExtraDecorations([...extraDecorations, val]);
                    } else {
                      setExtraDecorations(
                        extraDecorations.filter((item) => item !== val)
                      );
                    }
                  }}
                  className="mr-[2px]"
                />
                <span className="text-[14px]">₹ 100 LED Numbers</span>
              </label>
            </div>
          </div>
        </div>

        {/* ---------------- Price Breakdown Section ---------------- */}
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="text-lg font-semibold mb-2">Price Breakdown</h4>
          <div className="flex justify-between">
            <span>Base price</span>
            <span>₹{basePrice}</span>
          </div>
          {wantDecoration === "Yes" && (
            <div className="flex justify-between">
              <span>Decoration (₹300 persons)</span>
              <span>₹{decorationPrice}</span>
            </div>
          )}

          {/* Show each chosen item from `extraDecorations` */}
          {extraDecorations.includes("rose") && (
            <div className="flex justify-between">
              <span>Rose Heart</span>
              <span>₹150</span>
            </div>
          )}
          {extraDecorations.includes("candle") && (
            <div className="flex justify-between">
              <span>Candle Path</span>
              <span>₹300</span>
            </div>
          )}
          {extraDecorations.includes("led") && (
            <div className="flex justify-between">
              <span>LED Numbers</span>
              <span>₹100</span>
            </div>
          )}

          <hr className="my-2" />
          <div className="flex justify-between font-bold text-purple-700">
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
        {/* -------------------------------------------------------------- */}

        <div className="mt-6 flex justify-center items-center">
          <button 
            onClick={bookSlot}
            disabled={isProcessing}
            className="w-full button-name hover:bg-pink-600  text-white rounded-md py-3 font-medium transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay ₹ ${calculateTotal()}`}
          </button>
        </div>

        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default QuantityBirthday;
