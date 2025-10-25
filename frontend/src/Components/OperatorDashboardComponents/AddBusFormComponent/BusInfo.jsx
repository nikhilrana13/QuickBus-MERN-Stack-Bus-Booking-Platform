import React from 'react'
import { useFormContext } from 'react-hook-form';

const BusInfo = () => {
const { register, watch, setValue,formState:{errors} } = useFormContext();

  const bustype = watch("bustype");
  return (
  <div className='p-5'>
      <h3 className="text-lg font-semibold mb-4">Bus & Driver Info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Bus Name */}
        <div>
          <input 
            {...register("busname", { required: "Bus Name is required" })} 
            type="text" 
            placeholder="Bus Name" 
            className="border p-2 rounded-md w-full"
          />
          {errors.busname && <p className="text-red-500 text-sm">{errors.busname.message}</p>}
        </div>

        {/* Bus Number */}
        <div>
          <input 
            {...register("busnumber", { required: "Bus Number is required" })} 
            type="text" 
            placeholder="Bus Number" 
            className="border p-2 rounded-md w-full"
          />
          {errors.busnumber && <p className="text-red-500 text-sm">{errors.busnumber.message}</p>}
        </div>

        {/* Driver Name */}
        <div>
          <input 
            {...register("drivername", { required: "Driver Name is required" })} 
            type="text" 
            placeholder="Driver Name" 
            className="border p-2 rounded-md w-full"
          />
          {errors.drivername && <p className="text-red-500 text-sm">{errors.drivername.message}</p>}
        </div>

        {/* Driver Phone */}
        <div>
          <input 
            {...register("driverphonenumber", { 
              required: "Driver Phone number is required", 
              pattern: { value: /^[0-9]{10}$/, message: "Phone must be 10 digits" } 
            })} 
            type="text" 
            placeholder="Driver Phone Number" 
            className="border p-2 rounded-md w-full"
          />
          {errors.driverphonenumber && <p className="text-red-500 text-sm">{errors.driverphonenumber.message}</p>}
        </div>
      </div>

      {/* Source & Destination */}
      <h3 className="text-lg font-semibold mb-4 mt-5">Source & Destination</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <input 
            {...register("source", { required: "Source is required" })} 
            type="text" 
            placeholder="Source" 
            className="border p-2 rounded-md w-full"
          />
          {errors.source && <p className="text-red-500 text-sm">{errors.source.message}</p>}
        </div>
        <div>
          <input 
            {...register("destination", { required: "Destination is required" })} 
            type="text" 
            placeholder="Destination" 
            className="border p-2 rounded-md w-full"
          />
          {errors.destination && <p className="text-red-500 text-sm">{errors.destination.message}</p>}
        </div>
      </div>

      {/* Air Conditioning */}
      <h4 className="font-[700] mb-2">Air Conditioning</h4>
      <div className="flex gap-4 mb-4">
        {["AC", "Non-AC"].map(ac => (
          <label key={ac} className="cursor-pointer border px-4 py-2 rounded-lg bg-gray-100">
            <input
              type="radio"
              value={ac}
              checked={bustype.airConditioning === ac}
              onChange={() => setValue("bustype.airConditioning", ac, { shouldValidate: true })}
              className="mr-2"
            />
            {ac}
          </label>
        ))}
      </div>
      {errors.bustype?.airConditioning && <p className="text-red-500 text-sm">{errors.bustype.airConditioning.message}</p>}

      {/* Category */}
      <h4 className="font-[700] mb-2">Category</h4>
      <div className="flex gap-4 mb-4">
        {["Seater", "Sleeper", "Mixed"].map(c => (
          <label key={c} className="cursor-pointer border px-4 py-2 rounded-lg bg-gray-100">
            <input
              type="radio"
              value={c}
              checked={bustype.category === c}
              onChange={() => setValue("bustype.category", c, { shouldValidate: true })}
              className="mr-2"
            />
            {c}
          </label>
        ))}
      </div>
      {errors.bustype?.category && <p className="text-red-500 text-sm">{errors.bustype.category.message}</p>}

      {/* Layout */}
      <h4 className="font-[700] mb-2">Layout</h4>
      <div className="flex gap-4 mb-4">
        {["2+2", "2+3"].map(l => (
          <label key={l} className="cursor-pointer border px-4 py-2 rounded-lg bg-gray-100">
            <input
              type="radio"
              value={l}
              checked={bustype.layout === l}
              onChange={() => setValue("bustype.layout", l, { shouldValidate: true })}
              className="mr-2"
            />
            {l}
          </label>
        ))}
      </div>
      {errors.bustype?.layout && <p className="text-red-500 text-sm">{errors.bustype.layout.message}</p>}

      {/* Lower & Upper Berth */}
      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bustype.hasLowerBerth}
            onChange={() => setValue("bustype.hasLowerBerth", !bustype.hasLowerBerth, { shouldValidate: true })}
          />
          Lower Berth
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={bustype.hasUpperBerth}
            onChange={() => setValue("bustype.hasUpperBerth", !bustype.hasUpperBerth, { shouldValidate: true })}
          />
          Upper Berth
        </label>
      </div>
    </div>
  )
}

export default BusInfo