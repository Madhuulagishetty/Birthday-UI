import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { HousePlus, MoveRight, Mail, Phone, MapPin } from 'lucide-react'
import ScrollToTop from '../ScrollTop';
import { db } from '../../index';
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  // Fixed useEffect to run only once when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]); // Empty dependency array ensures it only runs once when component mounts
    
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const docRef = await addDoc(collection(db, "Form Data"), formData);
      console.log("Document written with ID: ", docRef.id);
  
      // Clear the form after submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
  
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting message. Please try again.");
    }
  };
  
  const contactItems = [
    {
      icons: <MapPin className="w-8 h-8 text-black z-10" />,
      title: "Office Address",
      content: [
        "Naka, Bhadwad Gaon, Themghar,", 
        " Bhiwandi, Maharashtra 421305,"
      ]
    },
    {
      icons: <Mail className="w-8 h-8 text-black z-10" />,
      title: "Email Address",
      content: [
        "akaaystudio888@gmail.com", 
      ]
    },
    {
      icons: <Phone className="w-8 h-8 text-black z-10" />,
      title: "Phone Number",
      content: [
        "+91 9764535650"
      ]
    }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
 
  return (
    <>
    <div className="relative w-full h-[50vh] overflow-hidden">
      {/* Background image */}
      <ScrollToTop />
      <div 
        className="absolute inset-0 bg-cover bg-center h-[60vh] sm:h-[40vh] md:h-[40vh] lg:h-[40vh]"
        style={{
          backgroundImage: 'url("/assets/inside-header.jpg")',
          filter: 'brightness(0.8)'
        }}
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center  text-white text-center">
      <div className="container mx-auto px-4 py-8 mt-[20%] md:mt-[5%]">
        <h1 className="text-4xl md:text-5xl font-bold text-white relative inline-block ">
          Contact Us
          <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-pink-500"></div>
        </h1>
      </div>
        <div className="flex items-center space-x-2 text-sm">
            <div className='flex gap-5'>
             <Link to="/" className='flex gap-2 text-xl font-semibold items-center'><HousePlus />Home</Link>
             <div className='flex gap-2 text-xl font-semibold items-center'><MoveRight className='animate-move-left'/>Contact Us</div>
            </div>
        </div>
      </div>
    </div>

    {/* Contact Info Section */}
    <div className="w-full pt-16 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactItems.map((item, index) => (
            <div 
              key={index}
              className="relative overflow-hidden bg-white rounded-lg hover:cursor-pointer p-8 flex flex-col items-center text-center shadow-md transition-all duration-700 hover:shadow-xl"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: hoveredIndex === index ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Background animation */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-pink-500/10 opacity-0 transition-opacity duration-700"
                style={{ 
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.8)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease'
                }}
              ></div>
              
              {/* Icon container with pulse effect */}
              <div 
                className={`relative bg-pink-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 z-10
                           ${hoveredIndex === index ? 'animate-pulse' : ''}`}
              >
                {/* Ripple effect */}
                <div 
                  className="absolute inset-0 rounded-full opacity-70 bg-pink-400"
                  style={{ 
                    animation: hoveredIndex === index ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
                    animationDelay: '0.5s'
                  }}
                ></div>
                
                {/* Use the icon from contactItems array */}
                {item.icons}
              </div>
              
              {/* Title with slide-up animation */}
              <h3 
                className="text-2xl font-bold mb-4 text-gray-800 relative z-10 hover:text-pink-600"
                style={{
                  transform: hoveredIndex === index ? 'translateY(-5px)' : 'translateY(0)',
                  transition: 'transform 0.5s ease, color 0.5s ease',
                  color: hoveredIndex === index ? '#db2777' : '' // Changed hover:text-pink-600 to actual hex color
                }}
              >
                {item.title}
              </h3>
              
              {/* Content with staggered fade-in */}
              <div className="space-y-2 relative z-10">
                {item.content.map((line, idx) => (
                  <p 
                    key={idx} 
                    className="text-gray-700"
                    style={{
                      transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(5px)',
                      opacity: hoveredIndex === index ? 1 : 0.7,
                      transition: `transform 0.5s ease ${0.1 + idx * 0.1}s, opacity 0.5s ease ${0.1 + idx * 0.1}s`
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Map and Form Section - 100% width main div with 60% map and 40% form */}
            <div className="w-full flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
            {/* Google Map - 60% width */}
             
            <div className="w-full md:w-3/5 h-96 md:h-auto bg-gray-200 relative">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d23146.35898287471!2d73.04194790652772!3d19.27422269998436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sNaka%2C%20Bhadwad%20Gaon%2C%20Themghar%2C%20Bhiwandi%2C%20Maharashtra%20421305!5e1!3m2!1sen!2sin!4v1741630485801!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            {/* Contact Form - 40% width */}
            <div className="w-full md:w-2/5 bg-pink-900 text-white p-8">
                <h2 className="text-4xl font-bold mb-8">Contact Us.</h2>
                
                <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="block mb-2 text-sm">Name</label>
                    <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-pink-400 transition-colors" 
                    required
                    />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm">Email</label>
                    <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-pink-400 transition-colors" 
                    required
                    />
                </div>
                
                <div className="mb-8">
                    <label htmlFor="message" className="block mb-2 text-sm">Your Message</label>
                    <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-pink-400 transition-colors" 
                    required
                    ></textarea>
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-pink-400 hover:bg-pink-500 text-black font-bold py-4 px-4 rounded-full transition-colors duration-300"
                >
                    SEND MESSAGE
                </button>
                </form>
                <p className='pt-3'>We'll get back to you within 24 hours. Your inquiry is important to us!</p>
            </div>
            </div>
      </div>
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1da851] transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
         <svg 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        fill="white" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M17.6 6.32A8.62 8.62 0 0 0 12.22 4C7.73 4 4.1 7.66 4.1 12.14c0 1.42.38 2.84 1.06 4.08L4 20l3.92-1.03a8.46 8.46 0 0 0 4.3 1.18h.02c4.5 0 8.13-3.67 8.13-8.14a8.1 8.1 0 0 0-2.77-5.69zm-5.38 12.53h-.02a7.09 7.09 0 0 1-3.62-.99l-.25-.15-2.66.7.7-2.62-.17-.27a7.06 7.06 0 0 1-1.07-3.78c0-3.83 3.12-6.96 6.95-6.96a6.84 6.84 0 0 1 4.91 2.04 6.88 6.88 0 0 1 2.04 4.94c0 3.83-3.11 6.97-6.93 6.97zm3.8-5.2c-.2-.11-1.23-.62-1.42-.69-.19-.07-.33-.1-.47.1-.14.22-.54.7-.66.84-.12.14-.24.15-.44.05-.2-.1-.86-.31-1.63-1a6.13 6.13 0 0 1-1.13-1.4c-.12-.2-.01-.3.09-.41.09-.1.2-.25.3-.37.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.47-1.13-.64-1.55-.17-.4-.34-.35-.46-.35-.12 0-.26-.01-.4-.01s-.33.05-.52.26c-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.08.1.13 1.4 2.13 3.4 2.99.47.21.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.18-.48 1.34-.95.17-.47.17-.86.12-.95-.05-.09-.19-.14-.4-.25z" 
        />
      </svg>
      </button>
    </div>
    </> 
  );
};

export default Contact;