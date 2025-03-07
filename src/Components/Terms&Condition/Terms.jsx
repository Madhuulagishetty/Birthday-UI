import React from 'react';

const TermsMain = () => {
  const termsItems = [
    "We do NOT provide any movie/OTT accounts. We will do the setups using your OTT accounts/downloaded content.",
    "Smoking/Drinking is NOT allowed inside the theater.",
    "Any DAMAGE caused to theater, including decorative materials like ballons, lights etc will have to be reimbursed.",
    "Guests are requested to maintain CLEANLINESS inside the theater.",
    "Party poppers/Snow sprays/Cold Fire, and any other similar items are strictly prohibited inside the theater.",
    "Carrying AADHAAR CARD is mandatory. It will be scanned during entry.",
    "Couples under 18 years of age are not allowed to book the theatre",
    "Pets are strictly not allowed inside the theatre",
    "We collect an advance amount of RS. 750 plus convenience fee to book the slot."
  ];
  const Refund=[
    "Advance amount is fully refundable if slot is cancelled at least 72 hrs before the slot time. If your slot is less than 72 hrs away from time of payment then advance is non-refundable."
  ]

  return (
    <div className="w-[100%]  bg-white shadow-md rounded-lg pt-[7%] pb-[9%] ">
        
      <div className="flex items-center pl-4">
        <button className="flex items-center text-gray-600 hover:text-gray-900 ">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="ml-2 text-lg">Back</span>
        </button>
      </div>
      <div className='w-[100%] flex justify-center  flex-col items-center'>
      <div className=' w-[50%]'>
      <h1 className="text-2xl font-bold text-center mb-8">Terms & Conditions</h1>
      
      <ol className="list-decimal pl-6 space-y-4">
        {termsItems.map((item, index) => (
          <li key={index} className="text-gray-800">
            {item}
          </li>
        ))}
      </ol>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Refund policy</h2>
       <p>{Refund}</p>
      </div>
      </div>
      </div> 

    </div>
  );
};

export default TermsMain;