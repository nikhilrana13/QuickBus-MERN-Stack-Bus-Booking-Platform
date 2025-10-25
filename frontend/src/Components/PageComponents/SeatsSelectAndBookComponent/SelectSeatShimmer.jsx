import React from 'react'

const SelectSeatShimmer = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100dvh-8.5rem)] w-full mx-auto my-[1rem] overflow-hidden gap-4">
      
      {/* Seat layout & info */}
      <div className="overflow-y-auto pb-4 h-full scroll-smooth scrollbar-hide flex flex-col items-center gap-4">
        
        {/* Seat layout */}
        <div className="flex border p-3 h-[600px] rounded-[16px] w-full max-w-[200px] bg-white flex-col animate-pulse">
            <div className='flex gap-3 px-2'>
               <div className="flex justify-end  h-6 bg-gray-300 rounded w-12 mb-3"></div>
               <div className="flex justify-end  h-6 bg-gray-300 rounded w-12 mb-3"></div>
               <div className="flex justify-end  h-6 bg-gray-300 rounded w-12 mb-3"></div>
            </div>
        </div>

        {/* Seat info table */}
        <div className="flex flex-col  p-3 rounded-[16px] w-full max-w-[500px] space-y-2 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-300 rounded mx-auto"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Bus info, images, tabs & sections */}
      <div className="w-full overflow-y-auto scroll-smooth scrollbar-hide bg-white rounded-t-3xl p-4 animate-pulse">

        {/* Collapsed toggle */}
        <div className="flex justify-center md:hidden mb-2">
          <div className="w-[25px] h-[4px] bg-gray-400 rounded"></div>
        </div>

        {/* Header info */}
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>

        {/* Bus images */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[250px] h-[150px] bg-gray-200 rounded-lg flex-shrink-0"></div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-full bg-gray-300 rounded"></div>
          ))}
        </div>

        {/* Sections: Route, Boarding, Dropping, Amenities */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3 border-y py-4">
            <div className="h-6 w-1/3 bg-gray-300 rounded mb-2"></div>
            {[...Array(3)].map((__, j) => (
              <div key={j} className="h-4 w-full bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}

      </div>
    </div>
  )
}

export default SelectSeatShimmer