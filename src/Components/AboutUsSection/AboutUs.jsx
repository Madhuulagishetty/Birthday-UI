import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Heart, CheckCircle, Calendar, PhoneCall, HousePlus, MoveRight } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";


const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    partiesCompleted: 0,
    clientsHappy: 0,
    qualityGuarantee: 0
  });
 
  const statsRef = useRef(null);
  const countersStarted = useRef(false);
  const navigate = useNavigate();
  
  // Define the missing startCounters function
  const startCounters = () => {
    // Target values for the counters
    const targetValues = {
      partiesCompleted: 1500,
      clientsHappy: 1000,
      qualityGuarantee: 100
    };
    
    // Duration for the animation in milliseconds
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);
    
    let frame = 0;
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      setStats({
        partiesCompleted: Math.floor(targetValues.partiesCompleted * Math.min(progress, 1)),
        clientsHappy: Math.floor(targetValues.clientsHappy * Math.min(progress, 1)),
        qualityGuarantee: Math.floor(targetValues.qualityGuarantee * Math.min(progress, 1))
      });
      
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll animation to elements with data-aos attribute
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight * 0.85) {
          element.classList.add('aos-animate');
        }
      });
      
      // Start counters when stats section is visible
      if (statsRef.current && !countersStarted.current) {
        const statsPosition = statsRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (statsPosition < windowHeight * 0.85) {
          startCounters();
          countersStarted.current = true;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleContactClick = () => {
    navigate("/contact-us");
  };
   
  const handleWhatsAppClick = () => {
    const phoneNumber = "919764535650";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <div 
        className="bg-cover bg-center h-[50vh] sm:h-[30vh] md:h-[50vh] lg:h-[40vh] relative" 
        style={{
           backgroundImage: 'url("/assets/inside-header.jpg")',
           backgroundPosition: 'center center'
        }}
      >
        <div className="absolute inset-0 bg-black/0 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl  md:text-5xl  font-bold text-white mb-2 md:mb-1 text-center mt-10">
            About Us
          </h1>
          <div className="h-1 w-24 sm:w-32 md:w-48 bg-pink-500 mb-4 md:mb-6"></div>
          <div className="flex items-center text-sm sm:text-base text-white">
            <div className="flex gap-2 sm:gap-5 flex-wrap justify-center">
              <Link to="/" className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center">
                <HousePlus size={18} className="sm:w-5 sm:h-5" />Home
              </Link>
              <div className="flex gap-1 sm:gap-2 text-base sm:text-lg md:text-xl font-semibold items-center">
                <MoveRight className="text-white animate-move-left sm:w-5 sm:h-5" />AboutUs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:w-[80%] w-[100%]">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          {/* Image Section */}
          <div 
            className="w-full lg:w-1/2 opacity-0 translate-x-[-50px] mb-8 lg:mb-0"
            data-aos="fade-right"
            style={{animation: isVisible ? 'fadeInLeft 0.8s forwards' : 'none'}}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img 
                src="/assets/delax.jpg"
                alt="Akaay Studio Bhiwandi"
                title="Akaay Studio Bhiwandi" 
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4 md:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">Our Creative Designs</h3>
                <p className="text-xs sm:text-sm md:text-base">We transform ordinary spaces into extraordinary experiences</p>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div 
            className="w-full lg:w-1/2 opacity-0 translate-x-[50px]"
            data-aos="fade-left"
            data-aos-delay="200"
            style={{animation: isVisible ? 'fadeInRight 0.8s 0.2s forwards' : 'none'}}
          >
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-3 md:mb-6">Creating Magical Moments Since 2010</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                We are a premier event planning company specializing in creating unforgettable moments for all your special occasions. With meticulous attention to detail and creative expertise, we transform your vision into reality.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mt-3 sm:mt-4">
                Since our establishment, we've been the industry's standard for excellence. Our team of dedicated professionals works tirelessly to ensure every aspect of your event exceeds expectations. From intimate gatherings to grand celebrations, we handle it all with the same level of commitment and passion.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mt-3 sm:mt-4">
                Our services include complete event design, coordination, custom décor, and personalized touches that make your celebration truly special. We pride ourselves on staying current with event trends while maintaining timeless elegance in everything we do.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* What We Offer Section */}
      <section className="py-8 sm:py-10 md:py-16 bg-white md:w-[80%] mx-auto w-[100%]">
        <div className="container mx-auto px-4 w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-800 mb-6 sm:mb-8 md:mb-12" data-aos="fade-up">What We Offer</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Service 1 */}
            <div 
              className="bg-gray-200 rounded-xl p-4 sm:p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Calendar size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-2 sm:mb-3">Event Planning</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                Comprehensive planning services from concept to execution, ensuring every detail is perfect.
              </p>
            </div>
            
            {/* Service 2 */}
            <div 
              className="bg-gray-200 rounded-xl p-4 sm:p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Sparkles size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-2 sm:mb-3">Custom Décor</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                Bespoke decorations and setups tailored to your theme, style preferences, and venue.
              </p>
            </div>
            
            {/* Service 3 */}
            <div 
              className="bg-gray-200 rounded-xl p-4 sm:p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 sm:col-span-2 lg:col-span-1 sm:max-w-md mx-auto sm:w-full"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <PhoneCall size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-2 sm:mb-3">Day-of Coordination</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                Professional on-site management ensuring your event runs smoothly from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Curved Top */}
      <section className="py-8 sm:py-12 md:py-16 relative w-full" ref={statsRef}>
        <div className="absolute top-0 left-0 right-0 h-6 sm:h-10 bg-white" style={{borderRadius: '0 0 50% 50% / 0 0 100% 100%'}}></div>
        <div className="bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 text-white py-6 sm:py-8 md:py-10">
          <div className="container mx-auto px-4 w-[80%]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Stat 1 */}
              <div 
                className="flex items-center text-center opacity-0 translate-y-[20px] gap-2 sm:gap-3"
                data-aos="fade-up"
                data-aos-delay="100"
                style={{animation: isVisible ? 'fadeInUp 0.5s 0.3s forwards' : 'none'}}
              >
                <div className="mb-2 sm:mb-3 md:mb-4 bg-white/20 p-3 sm:p-4 md:p-6 hover:cursor-pointer rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-start">
                    {stats.partiesCompleted}+
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl">Party Completed</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div 
                className="flex items-center gap-2 sm:gap-3 text-center opacity-0 translate-y-[20px]"
                data-aos="fade-up"
                data-aos-delay="200"
                style={{animation: isVisible ? 'fadeInUp 0.5s 0.5s forwards' : 'none'}}
              >
                <div className="mb-2 sm:mb-3 md:mb-4 bg-white/20 p-3 sm:p-4 hover:cursor-pointer md:p-6 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile-plus"><path d="M22 11v1a10 10 0 1 1-9-10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-start">
                    {stats.clientsHappy}+
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl">Clients Happy</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div 
                className="flex items-center gap-2 sm:gap-3 text-center opacity-0 translate-y-[20px]"
                data-aos="fade-up"
                data-aos-delay="300"
                style={{animation: isVisible ? 'fadeInUp 0.5s 0.7s forwards' : 'none'}}
              >
                <div className="mb-2 sm:mb-3 md:mb-4 bg-white/20 p-3 sm:p-4 md:p-6 hover:cursor-pointer rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-start">
                    {stats.qualityGuarantee}%
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl">Quality Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="pb-6 sm:pb-8 md:pb-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div
            className="opacity-0 scale-90"
            data-aos="zoom-in"
            data-aos-delay="100"
            style={{animation: isVisible ? 'fadeInScale 0.6s 0.8s forwards' : 'none'}}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Ready to Plan Your Next Event?</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Let us help you create a memorable experience tailored to your specific needs and preferences.
            </p>
            <button 
              onClick={handleContactClick} 
              className="bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white font-bold py-2 px-5 sm:py-3 sm:px-6 md:py-4 md:px-10 rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-sm sm:text-base"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-16 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1da851] transition-all duration-300 hover:scale-110"
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

      {/* CSS Keyframes for Animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        [data-aos] {
          opacity: 0;
          transition: all 0.8s ease;
        }
        [data-aos].aos-animate {
          opacity: 1;
          transform: translateY(0) translateX(0) scale(1);
        }
        [data-aos="fade-up"] {
          transform: translateY(20px);
        }
        [data-aos="fade-right"] {
          transform: translateX(-50px);
        }
        [data-aos="fade-left"] {
          transform: translateX(50px);
        }
        [data-aos="zoom-in"] {
          transform: scale(0.9);
        }
      `}</style>
    </div>
  );
};

export default AboutUs;