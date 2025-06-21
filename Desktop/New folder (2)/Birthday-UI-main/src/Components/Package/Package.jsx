import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import delaxImg from "../../assets/delax.jpg";
// import relaxImg from "../../assets/relax.jpg";
import { ChevronRight, Check, Star } from 'lucide-react';

const Packages = () => {
  // State to track the selected package and animation visibility
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Set visibility after component mounts for animations and scroll to top smoothly
  useEffect(() => {
    // Smooth scroll to top when component loads
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
   
  }, []);

  // Handler when a package card is clicked.
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    // Show a toast confirmation when package is selected
    toast.success(`${pkg === "delax" ? "Deluxe Theater T2" : "Rolexe Theater T1"} selected!`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
    });
  };

  // Handler for the Book Now button.
  const handleBookNow = () => {
    if (!selectedPackage) {
      // Show a toast error if no package is selected.
      toast.error("Please select a package before booking!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      // Add a loading toast before navigation
      toast.info("Preparing your booking...", {
        position: "top-center",
        autoClose: 1500,
      });
      
      // Navigate based on the selected package after a short delay
      setTimeout(() => {
        if (selectedPackage === "delax") {
          navigate("/delux-package");
        } else if (selectedPackage === "Relexe") {
          navigate("/rolexe-pakage");
        }
      }, 1600);
    }
  };
console.log(selectedPackage,'selectedPackage');


  return (
    <div className="bg-gradient-to-r from-blue-700 via-purple-600 to-pink-700 py-14 px-5 w-full min-h-[95vh] flex justify-center items-center flex-col pt-[7%] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `twinkle ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Title with animation */}
      <div className={`transform transition-all duration-1000 flex flex-col items-center mt-[25%] md:mt-[0%] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h2 className="fontCursive text-white text-3xl md:text-5xl text-center mb-2">
          Our Packages
        </h2>
        <div className="w-24 h-1 bg-yellow-300 rounded-full mb-10"></div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 items-center w-full md:w-[90%]">
        {/* Rolexe Theater Package */}
        <div
          className={`bg-white p-4 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[90%] md:w-[40%] cursor-pointer relative ${
            selectedPackage === "Relexe" ? "border-4 border-blue-500 scale-105" : ""
          } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          onClick={() => handlePackageSelect("Relexe")}
          style={{ transitionDelay: "0.2s" }}
        >
          {selectedPackage === "Relexe" && (
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2 z-10 shadow-lg transform scale-in animate-bounce">
              <Check size={20} />
            </div>
          )}
          
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={"/assets/relax-13.jpg"}
              alt="Akaay Studio Thane"
               title="Akaay Studio Thane"
              className="rounded-xl w-full h-48 md:h-64 object-cover transform transition duration-700 hover:scale-110"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              <span>For 6 People</span>
            </div>
          </div>
          
          <h3 className="text-red-600 font-bold text-lg md:text-xl mt-4 text-center">
            Rolexe Theater T1
          </h3>
          
          <div className="w-16 h-1 bg-red-300 mx-auto my-2 rounded-full"></div>
          
          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-gray-700 text-center text-sm md:text-base font-medium">
              Rs 2000 with decoration
            </p>
            <p className="text-gray-500 text-center text-xs md:text-sm mt-1">
              2.30 hours duration
            </p>
          </div>
          
         
        </div>

        {/* Deluxe Theater Package */}
        <div
          className={`bg-white p-4 rounded-2xl shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl w-[90%] md:w-[40%] cursor-pointer relative ${
            selectedPackage === "delax" ? "border-4 border-blue-500 scale-105" : ""
          } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          onClick={() => handlePackageSelect("delax")}
          style={{ transitionDelay: "0.4s" }}
        >
          {selectedPackage === "delax" && (
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2 z-10 shadow-lg transform scale-in animate-bounce">
              <Check size={20} />
            </div>
          )}
          
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={"/assets/package-delux-changed.jpg"}
              alt="Akaay Studio Thane"
                  title="Akaay Studio Thane"
              className="rounded-xl w-full h-48 md:h-64 object-cover transform transition duration-700 hover:scale-110"
            />
            <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              <span>For 10 People</span>
            </div>
          </div>
          
          <h3 className="text-purple-600 font-bold text-lg md:text-xl mt-4 text-center">
            Deluxe Theater T2
          </h3>
          
          <div className="w-16 h-1 bg-purple-300 mx-auto my-2 rounded-full"></div>
          
          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-gray-700 text-center text-sm md:text-base font-medium">
              Rs 2500 with decoration
            </p>
            <p className="text-gray-500 text-center text-xs md:text-sm mt-1">
              2.30 hours duration
            </p>
          </div>
          
         
        </div>
      </div>

      {/* Book Now button with animation */}
      <div className={`flex justify-center mt-8 md:mt-12 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ transitionDelay: "0.6s" }}>
        <button 
          onClick={handleBookNow} 
          className={`px-6 md:px-8 py-3 md:py-4 rounded-full transition-all duration-500 flex items-center space-x-2 transform hover:scale-105 hover:shadow-xl text-sm md:text-base group ${
            selectedPackage ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" : "bg-black text-white"
          }`}
        >
          <span>{selectedPackage ? "Book Selected Package" : "Book Now"}</span>
          <ChevronRight size={20} className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      
      {/* ToastContainer displays toast notifications */}
      <ToastContainer
  toastStyle={{
    marginTop: window.innerWidth < 768 ? "10%" : "10%",
  }}
/>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Packages;