import React from "react";

const BookingGuide = () => {
  return (
    <div className="bg-white py-10 px-6 md:px-16 lg:px-24 text-gray-800 leading-relaxed">
      {/* Section 1 - How to Book */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          How to Book Bus Tickets Online on <span className="text-[#D63941]">QuickBus</span>?
        </h2>
        <p className="text-gray-600 mb-5">
          Below are some simple steps that you can follow when booking your bus tickets online on QuickBus.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-semibold text-[#D63941]">Step 1:</span> Visit the QuickBus website or app.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 2:</span> Select your preferred mode of transport — Bus.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 3:</span> Choose your travel date and journey details.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 4:</span> Search for available buses on your chosen date and route.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 5:</span> Select your boarding and dropping points, then enter passenger details.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 6:</span> Choose from multiple payment options to complete your booking.
          </li>
          <li>
            <span className="font-semibold text-[#D63941]">Step 7:</span> After successful payment, you’ll receive your ticket confirmation via email or SMS.
          </li>
        </ul>
      </div>

      {/* Section 2 - Exclusive Offers */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Exclusive Offers on <span className="text-[#D63941]">QuickBus</span>
        </h2>
        <p className="text-gray-600">
          QuickBus provides exciting offers and discounts on bus ticket bookings for all travellers. 
          You can also find special festive offers and app-exclusive deals from bus operators. 
          Just check the “Offers” section on QuickBus and apply the coupon code shown there during checkout to enjoy your discount. 
          QuickBus keeps adding new deals depending on festivals, holidays, and other special events.
        </p>
      </div>
    </div>
  );
};

export default BookingGuide;
