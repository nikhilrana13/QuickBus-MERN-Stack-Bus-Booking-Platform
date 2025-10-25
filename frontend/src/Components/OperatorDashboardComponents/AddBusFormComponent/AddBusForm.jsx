import React from 'react'
import { useForm, FormProvider } from 'react-hook-form';
import BusInfo from './BusInfo';
import BoardingDropping from './BoardingDropping';
import RoutesSeats from './RoutesSeats';
import Amenities from './Amenities';
import SeatsSelection from './SeatsSelection';
import ImagesUpload from './ImagesUpload';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AddBusForm = () => {
  const methods = useForm({
    defaultValues: {
      busname: "",
      busnumber: "",
      drivername: "",
      driverphonenumber: "",
      source: "",
      destination: "",
      bustype: {
        airConditioning: "AC",
        category: "Seater",
        layout: "2+2",
        hasLowerBerth: true,
        hasUpperBerth: false
      },
      totalSeats: 40,
      boardingPoints: [{ city: "", location: "", departureTime: "", arrivalTime: "", fare: "", date: "" }],
      droppingPoints: [{ city: "", location: "", time: "", date: "" }],
      busRoutes: [{ city: "", order: 1 }],
      runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      amenities: [],
      images: [],
      seats: []
    }
  });
  const { handleSubmit, trigger, getValues } = methods;
  const [step, setStep] = useState(1);
  const [Loading,SetLoading] = useState(false)

  const nextStep = async () => {
    // Current step fields validation
    let stepFields = [];
    const values = getValues();
    if (step === 1) stepFields = ["busname", "busnumber", "drivername", "driverphonenumber", "source", "destination"];
    if (step === 2) stepFields = values.boardingPoints.map((_, i) => [
      `boardingPoints.${i}.city`,
      `boardingPoints.${i}.location`,
      `boardingPoints.${i}.departureTime`,
      `boardingPoints.${i}.arrivalTime`,
      `boardingPoints.${i}.fare`,
      `boardingPoints.${i}.date`
    ]).flat();
    if (step === 3) stepFields = values.busRoutes.map((_, i) => [`busRoutes.${i}.city`, `busRoutes.${i}.order`]).flat();
    if (step === 4) stepFields = ["amenities"];
    if (step === 5) stepFields = ["images"];
    if (step === 6) stepFields = ["seats"];

    const valid = await trigger(stepFields);
    if (valid) setStep(prev => Math.min(prev + 1, 6));
  }
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // send data to backend
  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("busname", data.busname);
    formData.append("busnumber", data.busnumber);
    formData.append("drivername", data.drivername);
    formData.append("driverphonenumber", data.driverphonenumber);
    formData.append("source", data.source);
    formData.append("destination", data.destination);
    formData.append("totalSeats", data.totalSeats);
    // Arrays as JSON strings
    formData.append("boardingPoints",JSON.stringify(data.boardingPoints || []))
    formData.append("droppingPoints",JSON.stringify(data.droppingPoints || []))
    formData.append("busRoutes",JSON.stringify(data.busRoutes || []))
     formData.append("runDays",JSON.stringify(data.runDays || []))
    formData.append("amenities",JSON.stringify (data.amenities || []))
    formData.append("seats",JSON.stringify(data.selectedSeats || []))
    formData.append("bustype",JSON.stringify(data.bustype || {}))
    // Images (multiple)
    data.images.forEach((file) => {
      formData.append("images", file);
    });
    //  for(let pair of formData.entries()){
    //    console.log(pair[0] + "" + pair[1])
    //  }
    //  console.log("formdata",formData)
    try {
      SetLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bus/add-bus`,formData,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
          "Content-Type":"multipart/form-data"
        },withCredentials:true
      })
      if(response.data){
        toast.success(response?.data?.message)
        methods.reset()
        setStep(1)
      }
    } catch (error) {
      console.error("failed to add bus",error)
      toast.error(error?.response?.data?.message)
    }finally{
      SetLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full min-h-screen  px-5 py-7 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Bus</h2>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div key={s} className={`flex-1 h-2 mx-1 rounded-full ${step >= s ? "bg-red-500" : "bg-gray-300"}`}></div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && <BusInfo />}
        {step === 2 && <BoardingDropping />}
        {step === 3 && <RoutesSeats />}
        {step === 4 && <Amenities />}
        {step === 5 && <ImagesUpload />}
        {step === 6 && <SeatsSelection />}

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {step > 1 && <button onClick={prevStep} type='button' className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Previous</button>}
          {step < 6 && <button onClick={nextStep} type='button' className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-auto">Next</button>}
          {step === 6 && <button type='submit' className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto">{Loading ? "Adding..." : "Finish"}</button>}
        </div>
      </form>
    </FormProvider>
  )
}

export default AddBusForm