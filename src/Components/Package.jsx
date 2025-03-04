import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DelaxImg from "../assets/Delax.jpg";
import RelaxImg from "../assets/Relax.jpg";
import { ChevronRight} from 'lucide-react';

const Packages = () => {
  // State to track the selected package.
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  // Handler when a package card is clicked.
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
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
      // Navigate based on the selected package.
      if (selectedPackage === "Delax") {
        navigate("/Deluxe");
      } else if (selectedPackage === "Relexe") {
        navigate("/Rolexe");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 to-pink-700 py-14 px-5 w-full min-h-[95vh] flex justify-center items-center flex-col pt-[7%]">
      <h2 className="fontCursive text-white text-3xl md:text-5xl font-semibold text-center mb-10 animate-fade-in">
        Our Packages
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 items-center w-full md:w-[100%]">
        {/* Delax Package */}
        <div
          className={`bg-white p-2 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl w-[90%] md:w-[32%] cursor-pointer ${
            selectedPackage === "Relexe" ? "border-4 border-blue-500" : ""
          }`}
          onClick={() => handlePackageSelect("Relexe")}
        >
          <img
            src={DelaxImg}
            alt="Rolexe Theater T1"
            className="rounded-xl w-full h-48 md:h-64 object-cover"
          />
          <h3 className="text-red-600 font-bold text-lg md:text-xl mt-4 text-center">
            Rolexe Theater T1
          </h3>
          <p className="text-gray-700 text-center text-sm md:text-base mt-2 px-2">
            For 6 or less: Rs 2000 with decoration for 2.30 hrs
          </p>
        </div>

        {/* Relexe Package */}
        <div
          className={`bg-white p-2 rounded-2xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl w-[90%] md:w-[32%] cursor-pointer ${
            selectedPackage === "Delax" ? "border-4 border-blue-500" : ""
          }`}
          onClick={() => handlePackageSelect("Delax")}
        >
          <img
            src={RelaxImg}
            alt="Deluxe Theater T2"
            className="rounded-xl w-full h-48 md:h-64 object-cover"
          />
          <h3 className="text-red-600 font-bold text-lg md:text-xl mt-4 text-center">
            Deluxe Theater T2
          </h3>
          <p className="text-gray-700 text-center text-sm md:text-base mt-2 px-2">
            For 10 or less: Rs 2500 with decoration for 2.30 hrs
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-6 md:mt-8">
        <button 
          onClick={handleBookNow} 
          className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg text-sm md:text-base"
        >
          <span>View All Services</span>
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* ToastContainer displays toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default Packages;