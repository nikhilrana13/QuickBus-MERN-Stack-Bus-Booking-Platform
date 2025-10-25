import { LocateIcon, LocationEdit, PhoneCall } from 'lucide-react'
import React from 'react'
import { MdEmail } from 'react-icons/md'
import { MdOutlineEmail } from "react-icons/md";
import PassengerDetailsCard from './PassengerDetailsCard';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const PassengerInfo = ({ passengers, bus, selectedBoardingPoint, selectedDroppingPoint, selectedSeats, Setpassengers }) => {
    const user = useSelector((state) => state.Auth.user)
    const [errors, setErrors] = useState([])
    //   console.log("user",user)
    const handleOnChange = (index, field, value) => {
        Setpassengers((prev) => {
            const updated = [...prev]
            if (updated[index]) {
                updated[index] = {
                    ...updated[index],
                    [field]: value
                };
            }
            return updated
        })
        // clear error for that field when user types again
        setErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            if (newErrors[index]) {
                newErrors[index][field] = "";
            }
            return newErrors;
        });
    }

    // Function for validation check before booking
    const validatePassengers = () => {
        const newErrors = passengers.map((p, i) => {
            const error = {};
            if (!p?.name || p.name.trim().length < 2) error.name = "Please enter a valid name";
            if (!p?.age || Number(p.age) <= 0) error.age = "Please enter a valid age";
            if (!p?.gender || (p.gender !== "male" && p.gender !== "female")) error.gender = "Please select a gender";
            return error;
        });

        setErrors(newErrors);
        return newErrors.every((err) => Object.keys(err).length === 0);
    };

    PassengerInfo.validatePassengers = validatePassengers;
    // console.log("Passengers Info:", passengers);
    return (
        <div className='flex flex-col md:flex-row py-5 px-3 items-start  justify-center  gap-2 '>
            {/* passenger and ticket info */}
            <div className='flex w-full md:w-[700px] flex-col'>
                <div className='bg-white p-4 border flex flex-col shadow-md rounded-[16px]'>
                    <div className='flex flex-col'>
                        <h3 className='font-[700] text-[1.4rem]'>Contact details</h3>
                        <p className='text-gray-500 text-sm'>Ticket details will be sent to</p>
                    </div>
                    <div className='flex mt-4 gap-3 flex-col'>
                        <span className='flex gap-2 items-center font-[500]'>
                            <PhoneCall /> {user?.phoneno || "NA"}
                        </span>
                        <span className='flex gap-2 items-center font-[500]'>
                            <MdOutlineEmail className='text-2xl' /> {user?.email || "NA"}
                        </span>
                    </div>
                </div>
                {/* Passenger details */}
                {
                    selectedSeats?.length > 0 ? (
                        selectedSeats.map((seat, index) => {
                            return (
                                <PassengerDetailsCard onChange={handleOnChange} key={seat?._id} seat={seat} index={index} errors={errors[index] || {}} />
                            )
                        })
                    ) : ("")
                }
            </div>
            {/* bus and seat info */}
            {/* for desktop */}
            <div className='flex bg-white w-full md:w-[400px] p-5  rounded-[16px] shadow-md flex-col'>
                {/* bus info */}
                <div className='flex flex-col px-5'>
                    <h3 className='font-[700] text-[1rem]'>{bus?.companyName || "NA"}</h3>
                    <span className='text-gray-500 text-sm font-[400]'>{bus?.busname || "NA"}</span>
                </div>
                {/* boarding and dropping point */}
                <div className="flex flex-col mt-4 relative ">
                    {/* Vertical line */}
                    <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                    <div className="flex items-start gap-4 relative mb-5">
                        {/* Time & date */}
                        <div className="flex flex-col items-end min-w-[60px]">
                            <span className="font-semibold text-[0.95rem]">{selectedBoardingPoint?.departureTime || "NA"}</span>
                            <span className="text-gray-500 text-[0.8rem]">{new Date(selectedBoardingPoint?.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short"
                            }) || "NA"}</span>
                        </div>

                        {/* Dot indicator */}
                        <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>

                        {/* Point details */}
                        <div className="flex flex-col">
                            <span className="font-semibold text-[0.95rem]">{selectedBoardingPoint?.city || "NA"}</span>
                            <span className="text-gray-500 text-[0.8rem]">{selectedBoardingPoint?.location || "NA"}</span>
                        </div>
                    </div>

                </div>
                {/* dropping point */}
                <div className="flex flex-col mt-4 relative ">
                    {/* Vertical line */}
                    <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                    <div className="flex items-start gap-4 relative mb-5">
                        {/* Time & date */}
                        <div className="flex flex-col items-end min-w-[60px]">
                            <span className="font-semibold text-[0.95rem]">{selectedDroppingPoint?.time || "NA"}</span>
                            <span className="text-gray-500 text-[0.8rem]">{new Date(selectedDroppingPoint?.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short"
                            }) || "NA"}</span>
                        </div>
                        {/* Dot indicator */}
                        <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>
                        {/* Point details */}
                        <div className="flex flex-col">
                            <span className="font-semibold text-[0.95rem]">{selectedDroppingPoint?.city || "NA"}</span>
                            <span className="text-gray-500 text-[0.8rem]">{selectedDroppingPoint?.location || "NA"}</span>
                        </div>
                    </div>

                </div>
                <hr />
                <div className='flex flex-col px-5 mt-3 gap-2'>
                    <div className='flex flex-col '>
                        <span className='font-[700]'>Seat details</span>
                        <span>{selectedSeats?.length || "0"}</span>
                    </div>
                    <div className='flex gap-2'>
                        {
                            selectedSeats?.map((seat) => {
                                return (
                                    <span key={seat?._id} className='border bg-[#DDEFE3] rounded-[10px] text-center w-10 '>
                                        {seat?.seatNumber || "NA"}
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PassengerInfo