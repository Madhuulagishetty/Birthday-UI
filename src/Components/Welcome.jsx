import React from 'react';

const WelcomeSection = () => {
  // Function to handle smooth scrolling to top when button is clicked
  const handleReadMoreClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10 bg-white">
      <h1 className="fontCursive text-[#1E3A8A] mb-6 text-5xl">
        Welcome to Akaay Studio
      </h1>
      <p className="fontPoppin text-gray-600 max-w-5xl mx-auto mb-8 ">
      Celebrate life's special moments with a unique and unforgettable private theatre experience! Whether it’s a Birthday Party 🎂, a Romantic Anniversary 💍, or a Fun-Filled Event 🎉, we offer a cozy and exclusive setting tailored just for you. Enjoy personalized movie screenings, create lasting memories, and turn your occasions into extraordinary cinematic experiences.
      </p>
      <button 
        className="bg-[#C7013C] text-white px-8 py-3 rounded-full hover:bg-[#A30130] transition-colors duration-300 font-medium"
        onClick={handleReadMoreClick}
      >
        Read More
      </button>
    </div>
  );
};

export default WelcomeSection;