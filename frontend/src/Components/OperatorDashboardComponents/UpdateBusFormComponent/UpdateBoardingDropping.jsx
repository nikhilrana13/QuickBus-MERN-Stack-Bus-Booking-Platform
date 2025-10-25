import React from 'react'
import { useFormContext, useFieldArray } from "react-hook-form";

const UpdateBoardingDropping = () => {
    const { control, register, formState: { errors } } = useFormContext();
    
        // Boarding points array
        const { fields: boardingPoints, append: addBoarding, remove: removeBoarding } = useFieldArray({
            control,
            name: "boardingPoints",
        });
    
        // Dropping points array
        const { fields: droppingPoints, append: addDropping, remove: removeDropping } = useFieldArray({
            control,
            name: "droppingPoints",
        });
  return (
      <div className="p-5">
            {/* Boarding Points */}
            <h3 className="text-lg font-semibold mb-4">Boarding Points</h3>
            {boardingPoints.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 border p-3 rounded-md">

                    <div>
                        <label className="block font-medium mb-1">City</label>
                        <input
                            {...register(`boardingPoints.${index}.city`, { required: "City is required" })}
                            type="text"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.city && <p className="text-red-500 text-sm">{errors.boardingPoints[index].city.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Location</label>
                        <input
                            {...register(`boardingPoints.${index}.location`, { required: "Location is required" })}
                            type="text"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.location && <p className="text-red-500 text-sm">{errors.boardingPoints[index].location.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Departure Time</label>
                        <input
                            {...register(`boardingPoints.${index}.departureTime`, { required: "Departure Time is required" })}
                            type="time"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.departureTime && <p className="text-red-500 text-sm">{errors.boardingPoints[index].departureTime.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Arrival Time</label>
                        <input
                            {...register(`boardingPoints.${index}.arrivalTime`, { required: "Arrival Time is required" })}
                            type="time"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.arrivalTime && <p className="text-red-500 text-sm">{errors.boardingPoints[index].arrivalTime.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fare</label>
                        <input
                            {...register(`boardingPoints.${index}.fare`, { required: "Fare is required" })}
                            type="number"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.fare && <p className="text-red-500 text-sm">{errors.boardingPoints[index].fare.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Date</label>
                        <input
                            {...register(`boardingPoints.${index}.date`, { required: "Date is required" })}
                            type="date"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.boardingPoints?.[index]?.date && <p className="text-red-500 text-sm">{errors.boardingPoints[index].date.message}</p>}
                    </div>

                    {boardingPoints.length > 1 && <button type="button" onClick={() => removeBoarding(index)} className="bg-[#D63941] text-white px-4 py-2 rounded-md">Remove</button>}
                </div>
            ))}

            <button
                type="button"
                onClick={() => addBoarding({ city: "", location: "", departureTime: "", arrivalTime: "", fare: 0, date: "" })}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                Add Boarding Point
            </button>

            {/* Dropping Points */}
            <h3 className="text-lg font-semibold mb-4 mt-6">Dropping Points</h3>
            {droppingPoints.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 border p-3 rounded-md">

                    <div>
                        <label className="block font-medium mb-1">City</label>
                        <input
                            {...register(`droppingPoints.${index}.city`, { required: "City is required" })}
                            type="text"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.droppingPoints?.[index]?.city && <p className="text-red-500 text-sm">{errors.droppingPoints[index].city.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Location</label>
                        <input
                            {...register(`droppingPoints.${index}.location`, { required: "Location is required" })}
                            type="text"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.droppingPoints?.[index]?.location && <p className="text-red-500 text-sm">{errors.droppingPoints[index].location.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Time</label>
                        <input
                            {...register(`droppingPoints.${index}.time`, { required: "Dropping Time is required" })}
                            type="time"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.droppingPoints?.[index]?.time && <p className="text-red-500 text-sm">{errors.droppingPoints[index].time.message}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Date</label>
                        <input
                            {...register(`droppingPoints.${index}.date`, { required: "Date is required" })}
                            type="date"
                            className="border p-2 rounded-md w-full"
                        />
                        {errors.droppingPoints?.[index]?.date && <p className="text-red-500 text-sm">{errors.droppingPoints[index].date.message}</p>}
                    </div>
                    <div className='mt-6'>
                        {droppingPoints.length > 1 && <button type="button" onClick={() => removeDropping(index)} className="bg-[#D63941] text-white px-4 py-3 rounded-md">Remove</button>}
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={() => addDropping({ city: "", location: "", time: "", date: "" })}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
                Add Dropping Point
            </button>
        </div>
  )
}

export default UpdateBoardingDropping