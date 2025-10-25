import { BusFront } from 'lucide-react'
import React, { useState,useEffect } from 'react'
import { IoBus } from "react-icons/io5";
import BusDetails from './SeatsSelectAndBookComponent/BusDetails'

const BusInfoCard = ({bus,query}) => {
    // console.log("businfo", bus)
    const { companyName, busname, boardingPoints = [], droppingPoints = [], totalSeats = 0 } = bus
    // First boarding point (departure time & fare)
    const firstBoarding = boardingPoints[0] || {};
    const departureTime = firstBoarding.departureTime || "NA";
    const fare = firstBoarding.fare || "NA";
    // Last dropping point (arrival time)
    const lastDropping = droppingPoints[droppingPoints.length - 1] || {};
    const arrivalTime = lastDropping.time || "NA";
  //  State to manage dialog open/close
  const [showDetails, setShowDetails] = useState(false);
  //  Detect screen size 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click handler (only works on mobile)
  const handleCardClick = () => {
    if (isMobile) {
      setShowDetails(true);
    }
  };


    return (
        <>
        <div onClick={handleCardClick} className='bg-white px-4 py-4 cursor-pointer rounded-[16px] flex flex-col gap-3 custom-card'>
            <div className='flex flex-col md:flex-row justify-between'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 '>
                        <span className='flex text-sm  font-[500]'>{companyName || "NA"} <span className='ml-1 text-lg'><IoBus /> </span></span>
                        <span className='text-gray-500 truncate block max-w-[150px] sm:max-w-none  text-[0.8rem]'>{busname || "NA"}</span>
                    </div>
                    {/* for small screen */}
                    <div className='flex md:hidden flex-col'>
                        <span className='font-[700]'>
                            <span>{departureTime}</span>
                            <span className='text-gray-500 mx-1'> - </span>
                            <span>{arrivalTime}</span>
                        </span>
                        <span className='text-gray-500 text-[0.8rem]'>{totalSeats} seats</span>
                    </div>
                </div>
                  {/* for large screen */}
                <div className='hidden md:flex flex-col'>
                    <span className='font-[700]'>
                            <span>{departureTime}</span>
                            <span className='text-gray-500 mx-1'> - </span>
                            <span>{arrivalTime}</span>
                        </span>
                    <span className='text-gray-500 text-[0.8rem]'>{totalSeats} seats</span>
                </div>

                <div className='flex flex-col mt-3 md:mt-0 md:text-right'>
                    <span className=' font-[700]'>₹{fare}</span>
                    <span className='text-gray-500 text-[0.8rem]'>Onwards</span>
                </div>
            </div>
            <div className="border-t hidden lg:block border-dashed border-gray-300 my-2"></div>
            <div className=' hidden justify-end lg:flex '>
                <BusDetails bus={bus} query={query}   />
            </div>

        </div>
        {isMobile && showDetails && (
        <BusDetails bus={bus} query={query} onClose={() => setShowDetails(false)} />
      )}
       
        </>
    )
}

export default BusInfoCard