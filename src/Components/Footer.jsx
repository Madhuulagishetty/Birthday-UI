import React, { useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import ScrollToTop from './ScrollTop'

const Footer = () => {
  // Added useEffect hook to handle scrolling when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },[]); // Empty dependency array ensures it only runs once when component mounts
  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
  return (
    <footer className="w-[100%] fontPoppin">
      {/* Main Footer */}
      <ScrollToTop />
      <div className="bg-gray-200 py-8 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between max-w-5xl mx-auto">
          {/* Navigation Section */}
          <div className="mb-8 md:mb-0 md:w-[35%]">
            <ul className="space-y-4">
              <li>
                <NavLink to="/" className="text-gray-800 hover:text-red-500 block pb-2 border-b border-gray-300 hover:translate-x-1 transform transition-transform duration-300">Home</NavLink>
              </li>
              <li>
              <NavLink to="/about-us" className="text-gray-800 hover:text-red-500 block pb-2 border-b border-gray-300 hover:translate-x-1 transform transition-transform duration-300">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-gray-800 hover:text-red-500 block pb-2 border-b border-gray-300 hover:translate-x-1 transform transition-transform duration-300">Our Services</NavLink>
              </li>
              <li>
                <NavLink to="/akkay-studio-gallery" className="text-gray-800 hover:text-red-500 block pb-2 border-b border-gray-300 hover:translate-x-1 transform transition-transform duration-300">Gallery</NavLink>
              </li>
              <li>
                <NavLink to="/akkay-studio-packages" className="text-gray-800 hover:text-red-500 block pb-2 border-b border-gray-300 hover:translate-x-1 transform transition-transform duration-300">Packages</NavLink>
              </li>
              
            </ul>
          </div>
          
          {/* Contact Section */}
          <div className="mb-8 md:mb-0  md:w-[40%] ">
            <h3 className="text-lg font-semibold mb-6 relative inline-block pb-1 border-b-2 border-[#B1153C]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start transform ">
                <div className="text-[#B1153C] mr-3 flex-shrink-0 mt-1  animate-bounce">
                  <MapPin size={25} />
                </div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">Office No.5, Pipeline, Behind Shree Krupa Hospital, Temghar Naka, Kalyan Road, Bhiwandi, Dist: Thane, Maharashtra. </p>
                </div>
              </div>
              
              <div className="flex items-start transform ">
                <div className="text-[#B1153C] mr-3  mt-1  flex-shrink-0 ">
                  <Phone size={25} />
                </div>
                <div>
                  <p className="font-semibold">Mobile</p>
                  <p className="text-gray-600">+91 9764535650</p>
                </div>
              </div>
              
              <div className="flex items-start transform ">
                <div className="text-[#B1153C] mr-3 mt-1 flex-shrink-0">
                  <Mail size={25} className="animate-spin-slow" />
                </div>
                <div>
                  <p className="font-semibold">Mail ID</p>
                  <p className="text-gray-600">akaaystudio888@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Follow Us Section */}
          <div>
          <h3 className="text-lg font-semibold mb-6 relative inline-block pb-1 border-b-2 border-[#B1153C]">Follow Us</h3>
          <div className="flex space-x-4 relative mb-6">
            {/* Facebook */}
            <div className="group relative">
              <NavLink to="https://www.facebook.com/profile.php?id=61574711979656&mibextid=wwXIfr&mibextid=wwXIfr" target='_blank' className="bg-black text-white p-2 rounded-full block hover:bg-[#B1153C]  transform hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 ease-in-out bg-black text-white text-xs px-2 py-1 rounded-md mt-2 pointer-events-none">
                Facebook
              </div>
            </div>
            
            {/* Instagram */}
            <div className="group relative">
              <NavLink to="https://www.instagram.com/akaay_mini_theater?igsh=Z3E4cWJtcmpweG94" target='_blank' className="bg-black text-white p-2 rounded-full block hover:bg-[#B1153C] transition-colors transform hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 ease-in-out bg-black text-white text-xs px-2 py-1 rounded-md mt-2 pointer-events-none">
                Instagram
              </div>
            </div>
            
            {/* YouTube */}
            <div className="group relative">
              <NavLink to="https://www.youtube.com/@AkaayStudio" target='_blank' className="bg-black text-white p-2 rounded-full block hover:bg-[#B1153C] transition-colors transform hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50195 4.84824 2.16131 5.19941C1.82068 5.55057 1.57875 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 ease-in-out bg-black text-white text-xs px-2 py-1 rounded-md mt-2 pointer-events-none">
                YouTube
              </div>
            </div>
            
            {/* WhatsApp */}
            <div className="group relative hover:cursor-pointer">
              <p className="bg-black text-white p-2 rounded-full block hover:bg-[#B1153C] transition-colors transform hover:scale-110  duration-300" onClick={handleWhatsAppClick}>
              <FaWhatsapp size={25}/>
              </p>
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-300 ease-in-out bg-black text-white text-xs px-2 py-1 rounded-md mt-2 pointer-events-none">
                WhatsApp
              </div>
            </div>
          </div>
        
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="bg-black text-white py-4 px-4 md:px-8 ">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-2 items-center">
          <p className="text-sm mb-3 md:mb-0">
            Copyright ©2025
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-2 text-sm">
            <NavLink to="/refund-policy" className="hover:text-red-400 transition-colors">
              Refund Policy
            </NavLink>
            <span className="mx-2 text-gray-500">|</span>
            <NavLink to="/terms-condition" className="hover:text-red-400 transition-colors">
              Terms and Conditions
            </NavLink>
            <span className="mx-2 text-gray-500">|</span>
            <NavLink to="/privacy-policy" className="hover:text-red-400 transition-colors">
              PrivacyPolicy
            </NavLink>
            
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;