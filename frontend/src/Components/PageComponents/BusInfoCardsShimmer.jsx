import React from 'react'

const BusInfoCardsShimmer = () => {
  return (
     <div className="bg-white p-4 rounded-xl flex flex-col gap-3 custom-card animate-pulse">
        {/* Top row */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-5 w-16 bg-gray-300 rounded"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 my-2"></div>

        {/* Button area */}
        <div className="h-10 w-32 bg-gray-300 rounded self-end"></div>
      </div>
  )
}

export default BusInfoCardsShimmer