import React from 'react'
import { useEffect } from 'react';

const SelectBoardingAndDrop = ({ bus, Step, setSelectedBoardingPoint, setSelectedDroppingPoint, selectedBoardingPoint, selectedDroppingPoint }) => {
    // console.log("bus", bus)
    // console.log("bording point",selectedBoardingPoint)
    //  console.log("droppinb point",selectedDroppingPoint)


    // Auto-select boarding & dropping if only one option is available
    useEffect(() => {
        if (bus?.boardingPoints?.length > 0 && !selectedBoardingPoint) {
            setSelectedBoardingPoint(bus.boardingPoints[0]);
        }
        if (bus?.droppingPoints?.length === 0 || bus?.droppingPoints.length > 0) {
            setSelectedDroppingPoint(bus.droppingPoints[0]);
        }
    }, [bus, setSelectedBoardingPoint, setSelectedDroppingPoint]);
    const handleSelectBoardingPoint = (boardingPoint) => {
        setSelectedBoardingPoint(boardingPoint)
    }
    const handleSelectDroppingPoint = (DroppingPoint) => {
        setSelectedDroppingPoint(DroppingPoint)
    }

    return (
        <div className='flex flex-col md:flex-row py-5  justify-center  gap-2 '>
            {/* boarding */}
            <div className='bg-white  w-full shadow-lg md:w-[500px] rounded-[16px] flex flex-col gap-2'>
                <div className='flex border-b  p-3 flex-col gap-1'>
                    <h4 className='font-[700]'>Boarding points</h4>
                    <h3 className='text-gray-500 text-sm'>Select Boarding Point</h3>
                </div>
                {
                    bus?.boardingPoints?.map((b) => {
                        const isSelected = selectedBoardingPoint?._id === b._id
                        return (
                            <div onClick={() => handleSelectBoardingPoint(b)} key={b._id} className='flex cursor-pointer items-center justify-between border-b p-3'>
                                <div className='flex gap-5'>
                                    <span className='font-[700]'>{b.departureTime || "NA"}</span>
                                    <div className='flex flex-col '>
                                        <h4 className='font-[700]'>{b.location || "NA"}</h4>
                                        <h3 className='text-gray-500 text-sm'>{b.city || "NA"}</h3>
                                    </div>
                                </div>
                                {/* Dot indicator */}
                                <div
                                    className={`w-5 h-5 cursor-pointer flex items-center justify-center rounded-full border ${isSelected ? "border-[#D63941]" : "border-gray-300"
                                        }`}
                                >
                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#D63941] rounded-full" />}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* dropping */}
            <div className='bg-white shadow-lg w-full md:w-[500px] rounded-[16px] flex flex-col gap-2 '>
                <div className='flex border-b p-3 flex-col gap-1'>
                    <h4 className='font-[700]'>Dropping points</h4>
                    <h3 className='text-gray-500 text-sm'>Select Boarding Point</h3>
                </div>
                {
                    bus?.droppingPoints?.map((d) => {
                        const isSelected = selectedDroppingPoint?._id === d._id
                        return (
                            <div key={d._id} onClick={() => handleSelectDroppingPoint(d)} className='flex justify-between items-center border-b p-3'>
                                <div className='flex gap-5'>
                                     <span className='font-[700]'>{d.time || "NA"}</span>
                                <div className='flex flex-col '>
                                    <h4 className='font-[700]'>{d.location || "NA"}</h4>
                                    <h3 className='text-gray-500 text-sm'>{d.city || "NA"}</h3>
                                </div>

                                </div>
                                 {/* Dot indicator */}
                                <div
                                    className={`w-5 h-5 cursor-pointer flex items-center justify-center rounded-full border ${isSelected ? "border-[#D63941]" : "border-gray-300"
                                        }`}
                                >
                                    {isSelected && <div className="w-2.5 h-2.5 bg-[#D63941] rounded-full" />}
                                </div>
                               
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SelectBoardingAndDrop