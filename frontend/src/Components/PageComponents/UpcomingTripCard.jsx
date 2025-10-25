import React from 'react'
import { BusFront, CalendarDays, MapPin, Clock } from "lucide-react";

const UpcomingTripCard = ({trip}) => {
// console.log("trip",trip)
  const {passengers,status,boardingPoint,droppingPoint,busId} = trip
    return (
        <div
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BusFront className="text-[#D63941]" size={28} />
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                            {busId?.busname || "NA"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Seat No: {passengers?.map((p)=> p?.seatNumber).join(",") || "NA"} • {status || "NA"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-[#D63941]" />
                    <p className="text-sm font-medium">{boardingPoint?.city || "NA"}</p>
                    <span className="mx-2 text-gray-400">→</span>
                    <p className="text-sm font-medium">{droppingPoint?.city || "NA"}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={18} className="text-[#D63941]" />
                    <p className="text-sm">{new Date(boardingPoint?.date).toLocaleDateString("en-GB") || "NA"}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={18} className="text-[#D63941]" />
                    <p className="text-sm">{boardingPoint?.departureTime || "NA"}</p>
                </div>
            </div>

            <div className="mt-3 text-sm text-gray-500">
                <p>
                    <span className="font-medium text-gray-600">Boarding:</span>{" "}
                    {boardingPoint?.city}
                </p>
                <p>
                    <span className="font-medium text-gray-600">Dropping:</span>{" "}
                    {droppingPoint?.city}
                </p>
            </div>
        </div>
    )
}

export default UpcomingTripCard