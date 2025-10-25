// RedbusStyleLoader.jsx
import React from "react";

const RedbusStyleLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-[#D63941] rounded-full animate-bounce delay-75"></span>
        <span className="w-3 h-3 bg-red-300 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-red-300 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default RedbusStyleLoader;
