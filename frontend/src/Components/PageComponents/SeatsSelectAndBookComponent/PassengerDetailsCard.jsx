import React, { useState } from "react";
import { Mail } from "lucide-react";

const PassengerDetailsCard = ({seat,index,onChange,errors={}}) => {
  const [gender, setGender] = useState("Male");


  const handleChange = (field,value)=>{
    onChange(index,field,value,seat?.seatNumber)
  }
  const handleGenderSelect = (option)=>{
   setGender(option)
   handleChange('gender',option)
  }

  return (
    <div className="bg-white mt-4 rounded-2xl shadow-sm border p-5 w-full  mx-auto">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">Passenger details</h2>

      {/* Passenger section */}
      <div className="flex items-start gap-3 mb-5">
        <div className="bg-green-100 p-3 rounded-full">
          <Mail className="text-green-700 w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-[15px]">Passenger {index + 1} </p>
          <p className="text-sm text-gray-500">Seat {seat?.seatNumber || "NA"}</p>
        </div>
        <div className="ml-auto cursor-pointer text-gray-500 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>

      {/* Input fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name *</label>
          <input
            type="text"
            placeholder="Enter full name"
            onChange={(e)=> handleChange('name',e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#D63941]"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Age *</label>
          <input
            type="number"
            placeholder="Enter age"
            onChange={(e)=> handleChange('age',e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#D63941]"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Gender *</label>
          <div className="flex gap-3">
            {["Male", "Female"].map((option) => (
              <button
               type="button"
                key={option}
                onClick={() => handleGenderSelect(option)}
                className={`flex-1 border rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                  gender === option
                    ? "border-[#D63941] text-[#D63941]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border ${
                    gender === option
                      ? "border-[#D63941] bg-[#D63941]"
                      : "border-gray-400"
                  }`}
                ></span>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );
};

export default PassengerDetailsCard;
