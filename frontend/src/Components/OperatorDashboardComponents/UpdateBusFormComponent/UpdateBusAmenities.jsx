import React from 'react'
import { useFormContext } from "react-hook-form";

const UpdateBusAmenities = () => {
    const { register, formState: { errors } } = useFormContext();
    
      const amenitiesList = [
        "Water Bottle",
        "Blanket",
        "Snacks",
        "Charging Point",
        "Reading Light",
        "Pillow",
        "CCTV",
        "Bedsheet",
        "WiFi",
        "Toilet",
      ];
    
  return (
     <div className="p-5">
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenitiesList.map((a) => (
          <label
            key={a}
            className="flex items-center gap-2 cursor-pointer border rounded-md px-4 py-2 bg-gray-100"
          >
            <input
              type="checkbox"
              value={a}
              {...register("amenities", {
                validate: (value) =>
                  value.length > 0 || "Select at least 1 amenity",
              })}
            />
            {a}
          </label>
        ))}
      </div>

      {/* Error Message */}
      {errors.amenities && (
        <p className="text-red-500 text-sm mt-2">{errors.amenities.message}</p>
      )}
    </div>
  )
}

export default UpdateBusAmenities