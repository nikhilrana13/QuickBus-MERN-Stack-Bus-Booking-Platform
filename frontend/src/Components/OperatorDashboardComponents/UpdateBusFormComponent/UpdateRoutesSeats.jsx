import React from 'react'
import { useFormContext, useFieldArray } from "react-hook-form";

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const UpdateRoutesSeats = () => {
    const { register, control, watch, setValue } = useFormContext();
    
    
      const { fields: busRoutes, append, remove } = useFieldArray({
        control,
        name: "busRoutes"
      });
    
      const runDays = watch("runDays");
    
      const handleDayChange = (day) => {
        if (runDays.includes(day)) {
          setValue("runDays", runDays.filter((d) => d !== day));
        } else {
          setValue("runDays", [...runDays, day]);
        }
      };
  return (
      <div className="p-5">
      {/* Bus Routes */}
      <h3 className="text-lg font-semibold mb-4">Bus Routes</h3>
      <div className="space-y-4">
        {busRoutes.map((route, index) => (
          <div key={route.id} className="flex gap-4 items-center">
            <span className="w-8 font-bold">{index + 1}</span>
            <input
              type="text"
              placeholder="City Name"
              {...register(`busRoutes.${index}.city`, { required: "City name is required" })}
              className="border p-2 rounded-md flex-1"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ city: "", order: busRoutes.length + 1 })}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Add City
        </button>
      </div>

      {/* Total Seats */}
      <div className="mt-6">
        <label className="font-[700] block mb-2">Total Seats</label>
        <input
          type="number"
          placeholder="Total Seats"
          {...register("totalSeats", {
            required: "Total seats are required",
            min: { value: 1, message: "At least 1 seat required" }
          })}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Run Days */}
      <div className="p-2 mt-6">
        <h4 className="font-[700] mb-2">Select Run Days</h4>
        <div className="flex flex-wrap gap-4">
          {allDays.map((day) => (
            <label
              key={day}
              className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg bg-gray-100"
            >
              <input
                type="checkbox"
                checked={runDays.includes(day)}
                onChange={() => handleDayChange(day)}
                className="mr-2"
              />
              {day}
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm">Selected Days: {runDays.join(", ")}</p>
      </div>
    </div>
  )
}

export default UpdateRoutesSeats