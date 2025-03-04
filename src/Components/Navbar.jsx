import React, { useState } from 'react';
import { BookCheck } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed w-full z-40">
      <nav className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
        <div className="w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            {/* Desktop Menu */}
            <div className="a-border-right hidden md:flex items-center ">
              <a href="#" className="text-white hover:text-gray-200  font-medium">Home</a>
              <a href="#" className="text-white hover:text-gray-200  font-medium">About Us</a>
              <a href="#" className="text-white hover:text-gray-200  font-medium">Gallery</a>
              <a href="#" className="text-white hover:text-gray-200  font-medium">Packages</a>
              <a href="#" className="border-n text-white hover:text-gray-200  font-medium ">Contact Us</a>
              <button className="font bg-yellow-300 text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-200 flex items-center gap-2">
                <BookCheck size={20} />
                Book Now
              </button>
            </div>

            {/* Book Now Button */}
           

            {/* Mobile Menu Button */}
            <div className="md:hidden flex justify-end w-full">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">Home</a>
                <a href="#" className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">About Us</a>
                <a href="#" className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">Gallery</a>
                <a href="#" className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">Packages</a>
                <a href="#" className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">Contact Us</a>
                <button className="w-full mt-4 bg-[#F5FF00] text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2">
                  <BookCheck size={20} />
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;