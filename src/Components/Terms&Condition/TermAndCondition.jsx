import React from 'react';

const TermsAndConditions = () => {
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
    <div className="w-[100%]  bg-white shadow-md rounded-lg pt-[6%] pb-[2%] ">
        
      
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

export default TermsAndConditions;