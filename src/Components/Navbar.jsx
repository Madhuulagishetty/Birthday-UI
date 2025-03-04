import React, { useState } from 'react';
import { BookCheck } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/' },
    { label: 'Services', href: '/ServicesSection' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Packages', href: '/packages' },
    { label: 'Contact Us', href: '/' }
  ];

  return (
    <div className="fixed w-full z-40">
      <nav className="bg-gradient-to-r from-[#C035A2] via-[#6E23AC] to-[#0b5688]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0">
              {navItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  <a 
                    href={item.href} 
                    className={`fontPoppin
                      text-white hover:text-gray-200 font-medium px-4  
                      ${index < navItems.length - 1 ? 'border-r-2 border-white border-spacing-3' : ''}
                    `}
                  >
                    {item.label}
                  </a>
                </React.Fragment>
              ))}
              
              {/* Book Now Button */}
              <button className="ml-4 bg-[#F5FF00] text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-200 flex items-center gap-2">
                <BookCheck size={20} />
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center w-full justify-end">
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
          <div 
            className={`
              md:hidden 
              absolute 
              left-0 
              right-0 
              bg-gradient-to-r 
              from-[#D11FD2] 
              via-[#6E23AC] 
              to-[#0E09B5] 
              shadow-lg 
              transition-all 
              duration-500 
              ease-in-out 
              transform 
              ${isMenuOpen 
                ? 'opacity-100 translate-y-0 top-16 visible' 
                : 'opacity-0 -translate-y-10 top-0 invisible'}
            `}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              
              <button className="w-full mt-4 bg-[#F5FF00] text-black px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2">
                <BookCheck size={20} />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;