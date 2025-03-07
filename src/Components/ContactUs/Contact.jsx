import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";
import {HousePlus, MoveRight, Headphones, Send, User, Mail, MessageSquare} from 'lucide-react'
import ScrollToTop from '../ScrollTop';
const Contact = () => {
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const contactItems = [
    {
      title: "Office Address",
      content: [
        "Naka, Bhadwad Gaon, Themghar,", 
        " Bhiwandi, Maharashtra 421305,"
      ]
    },
    {
      title: "Email Address",
      content: [
        "chambers@example.com",
        "tanya.hill@example.com"
      ]
    },
    {
      title: "Phone Number",
      content: [
        "+91 9321893567",
        "9325515697"
      ]
    }
  ];
  const googleMapsUrl = "https://www.google.com/maps/place/Ganesh+Nagar,+Kamatghar,+Bhiwandi,+Maharashtra+421302/@19.2744998,73.0362981,5315m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be7bdbb4afd7385:0xcab396ee2ca9ce76!8m2!3d19.2745013!4d73.0569407!16s%2Fg%2F11gfc8jtmc?entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoASAFQAw%3D%3D";

  return (
    <>
    <div className="relative w-full h-96 overflow-hidden">
      {/* Background image */}
       <ScrollToTop />
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://image.wedmegood.com/resized/720X/uploads/member/1390611/1597761581_image6689.jpg")',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-white relative inline-block ">
          Contact Us
          <div className="absolute bottom-[-10px] left-0 w-full h-1 bg-pink-500"></div>
        </h1>
      </div>
        <div className="flex items-center space-x-2 text-sm">
            <div className='flex gap-5'>
             <Link to="/" className='flex gap-2 text-xl font-semibold items-center'><HousePlus />Home</Link>
             <div className='flex gap-2 text-xl font-semibold items-center'><MoveRight className='animate-move-left'/>AboutUs</div>
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
                className="absolute inset-0 bg-gradient-to-r from-lime-400/10 to-lime-500/10 opacity-0 transition-opacity duration-700"
                style={{ 
                  opacity: hoveredIndex === index ? 1 : 0,
                  transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.8)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease'
                }}
              ></div>
              
              {/* Icon container with pulse effect */}
              <div 
                className={`relative bg-lime-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 z-10
                           ${hoveredIndex === index ? 'animate-pulse' : ''}`}
              >
                {/* Ripple effect */}
                <div 
                  className="absolute inset-0 rounded-full bg-lime-400 opacity-70"
                  style={{ 
                    animation: hoveredIndex === index ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
                    animationDelay: '0.5s'
                  }}
                ></div>
                
                <Headphones 
                  className="w-8 h-8 text-black z-10" 
                  style={{
                    transform: hoveredIndex === index ? 'rotateY(180deg)' : 'rotateY(0)',
                    transition: 'transform 0.7s ease'
                  }}
                />
              </div>
              
              {/* Title with slide-up animation */}
              <h3 
                className="text-2xl font-bold mb-4 text-gray-800 relative z-10"
                style={{
                  transform: hoveredIndex === index ? 'translateY(-5px)' : 'translateY(0)',
                  transition: 'transform 0.5s ease, color 0.5s ease',
                  color: hoveredIndex === index ? '#65a30d' : ''
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
            <Link 
              to={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img 
                src="/api/placeholder/800/600" 
                alt="Map of Bhiwandi, Maharashtra" 
                className="w-full h-full object-cover" 
              />
              {/* Google Map Overlay */}
              <div className="absolute top-0 left-0 p-4 bg-white shadow-md">
                <h3 className="font-medium text-gray-800">Bhiwandi, Maharashtra</h3>
                <div className="flex items-center text-sm mt-1">
                  <span className="text-gray-600 hover:text-gray-900">View on Google Maps</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <span>Naka, Bhadwad Gaon, Themghar</span>
                </div>
              </div>
            </Link>
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
              <button className="bg-white p-1 rounded shadow hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
              <button className="bg-white p-1 rounded shadow hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
            </div>
          </div>
            
            {/* Contact Form - 40% width */}
            <div className="w-full md:w-2/5 bg-teal-900 text-white p-8">
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
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-lime-400 transition-colors" 
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
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-lime-400 transition-colors" 
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
                    className="w-full bg-transparent border-b border-white/30 pb-2 outline-none focus:border-lime-400 transition-colors" 
                    required
                    ></textarea>
                </div>
                
                <button 
                    type="submit"
                    className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-4 px-4 rounded-full transition-colors duration-300"
                >
                    SEND MESSAGE
                </button>
                </form>
                <p className='pt-3'>We'll get back to you within 24 hours. Your inquiry is important to us!</p>
            </div>
            </div>
      </div>
    </div>
    </> 
  );
};

export default Contact;