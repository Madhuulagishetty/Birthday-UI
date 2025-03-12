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
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
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