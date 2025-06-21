import React from 'react';
import { 
  Cake,
  PartyPopper,
  Gift,

  Star,
  
} from 'lucide-react';

const EventCard = ({ icon: Icon, title, description, className = '' }) => {
  return (
    <div className={`group relative transform transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-xl p-4 bg-white rounded-lg border border-gray-300 text-center overflow-hidden ${className}`}>
      <div className="flex flex-col justify-between h-[250px] w-[250px]">
        
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-100 rounded-full transform transition-transform group-hover:rotate-12">
            <Icon className="w-12 h-12 text-purple-600" />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-base text-gray-600 group-hover:text-gray-800 transition-colors text-center px-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const PrivateTheatreExperience = () => {
  const eventTypes = [
    {
      icon: Cake,
      title: "Birthday Party",
      description: "Host an unforgettable birthday celebration with our private theatre experience."
    },
    {
      icon: PartyPopper,
      title: "Parties & Events",
      description: "From reunions and farewells to casual get-togethers, our private theatres offer a unique venue."
    },
    {
      icon: Gift,
      title: "Corporate Events",
      description: "Elevate team building or client entertainment with a bespoke cinema experience."
    },
   
    {
      icon: Star,
      title: "Special Occasions",
      description: "Weddings, milestone birthdays, or any extraordinary moment deserves an extraordinary venue."
    }
  ];

  return (
    <div className="bg-white">
      {/* Event Types Section */}
      <div className="container mx-auto px-4 md:py-16 py-5">
       <div className='w-full text-center pt-3 pb-6 md:pb-10'>
         <h1 className='text-5xl fontCursive text-pink-600'> Celebration Types</h1>
         </div>
        <div className="flex flex-wrap gap-8 justify-center items-stretch">
          {eventTypes.map((event, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <EventCard
                icon={event.icon}
                title={event.title}
                description={event.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivateTheatreExperience;