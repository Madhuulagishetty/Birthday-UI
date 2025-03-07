import React, { useState, useEffect, useContext } from "react";
import { Star, Users, TicketX, Wine, LoaderPinwheel } from "lucide-react";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contextApi } from "./ContextApi/Context";
import { db } from "../index"; // Firebase config
import { collection, query, where, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import ScrollToTop from '../ScrollTop';

const BookingCard = () => {
  const { AddtoSlot, cartData, date } = useContext(contextApi);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate();
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = (amount) => {
    let data = JSON.stringify({
      amount: amount * 100,
      currency: "INR"
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/orders",
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.log("error at", error);
      });
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https:/checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Some error at razorpay screen loading");
      return;
    }

    const options = {
      key: 'rzp_test_MAK9N9Rei9tuH6',
      amount: amount,
      currency: 'INR',
      name: "Papaya Coders",
      description: "Payment to Papaya Coders",
      image: "https://papayacoders.com/demo.png",
      handler: function (response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: "Lagishetty Madhu",
        email: "lagishettymadhu05@gmail.com"
      },
      theme: {
        color: "#F4C430"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const paymentFetch = (e) => {
    e.preventDefault();

    const paymentId = e.target.paymentId.value;

    axios.get(`http://localhost:5000/payment/${paymentId}`)
      .then((response) => {
        console.log(response.data);
        setResponseState(response.data);
      })
      .catch((error) => {
        console.log("error occurred", error);
      });
  };

  console.log(bookedSlots, 'bookingslots');
  console.log(cartData, 'cartData');

  const timeSlots = [
    { id: 1, start: "9:00 AM", end: "12:00 PM" },
    { id: 2, start: "12:30 PM", end: "3:30 PM" },
    { id: 3, start: "4:00 PM", end: "5:30 PM" },
    { id: 4, start: "4:40 PM", end: "6:00 PM" },
    { id: 5, start: "6:00 PM", end: "7:00 PM" }
  ];

  const images = [
    "https://t4.ftcdn.net/jpg/11/99/83/57/360_F_1199835732_evIkgrKAtpSUUCHg4XDWqOEW5SFk2ULI.jpg",
    "https://i.pinimg.com/originals/52/07/cf/5207cfb3fd0f613551e4f24b50315378.jpg",
    "https://cdn.cherishx.com/uploads/1686727757_webp_original.webp"
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" />
    ),
  };

  // Fetch booked slots for the selected date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("date", "==", date));
        const querySnapshot = await getDocs(q);

        const booked = querySnapshot.docs
          .map((doc) => {
            const cartData = doc.data().cartData;
            return cartData && cartData.length > 0 ? cartData[0] : null;
          })
          .filter((slot) => slot !== null);

        console.log('booked slots', booked);
        setBookedSlots(booked);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [date]);

  const handleBooking = () => {
    if (!selectedTimeSlot) {
      // Trigger error toast if no time slot is selected
      toast.error("Please select a time slot before proceeding.");
      return;
    }
    toast.success("Booking successful!");

    navigate("/QuantityBirthday", {
      state: {
        timeSlot: selectedTimeSlot,
      },
    });
  };

  return (
    <div className="relative min-h-screen p-4 flex items-center justify-center bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1661726486910-7cfff916caad?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjZWxlYnJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D')]">
      <div className="absolute inset-0 bg-black/60"></div>


      <div className="relative md:max-w-[30rem] w-full bg-white rounded-2xl shadow-xl overflow-hidden p-3 z-10">
        <div className="relative rounded-xl overflow-hidden">
          <Slider {...sliderSettings} className="theater-slider">
            {images.map((img, index) => (
              <div key={index} className="aspect-video w-full overflow-hidden">
                <img
                  src={img}
                  alt={`Theater View ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div
          className="absolute right-4 justify-center bg-gray-200 px-2 py-1 rounded-lg shadow-md cursor-pointer"
          onClick={() => navigate("/Menu")}
        >
          <FaUtensils className="text-blue-700 m-auto" />
          <span className="text-blue-700 font-medium text-[12px]">MENU</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-[1.2rem] font-bold text-gray-800">Luna Theatre</h4>
          <div className="inline-flex items-center">
            <div className="px-3 py-1 bg-red-50 text-red-500 rounded-full border border-red-200 text-sm">
              <span>{timeSlots.length - bookedSlots.length} Slots Available</span>
            </div>
          </div>
         
          <h3 className="text-[16px] font-semibold text-gray-800">
            Select Time Slot
          </h3>

          <div className="flex flex-wrap">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => {
                  setSelectedTimeSlot(slot);
                  AddtoSlot(slot);
                }}
                disabled={bookedSlots.some((booked) => booked.id === slot.id)}
                className={`rounded-xl border text-sm transition-all ml-1 px-3 py-1 mt-1 md:mt-0 ${
                  selectedTimeSlot && selectedTimeSlot.id === slot.id
                    ? "border-purple-600 bg-purple-50 text-purple-600"
                    : bookedSlots.some((booked) => booked.id === slot.id)
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="font-medium text-[13px] w-15 text-center">
                  <p>{slot.start} -</p>
                  <p>{slot.end}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-1xl font-semibold">₹2000</span>
              <span className="text-sm">for up to 4 people with decoration</span>
            </div>
            <p className="text-sm text-gray-500">More than 4 people not allowed</p>

            <button
              onClick={handleBooking}
              className={`button-main button-name bg-[#5D0072] text-white px-6 mx-auto py-2 rounded-md hover:bg-purple-700 transition-all ${
                selectedTimeSlot && cartData.length < 2
                  ? "bg-[#5D0072] text-white"
                  : "bg-[#5D0072] cursor-not-allowed text-white"
              }`}
            >
              Booking Now
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default BookingCard;
