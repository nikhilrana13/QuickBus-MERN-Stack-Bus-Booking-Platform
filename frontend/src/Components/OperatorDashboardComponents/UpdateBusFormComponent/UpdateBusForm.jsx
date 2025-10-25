import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import UpdateBusInfo from './UpdateBusInfo';
import UpdateBoardingDropping from './UpdateBoardingDropping';
import UpdateRoutesSeats from './UpdateRoutesSeats';
import UpdateBusAmenities from './UpdateBusAmenities';
import UpdateBusImagesUpload from './UpdateBusImagesUpload';

const UpdateBusForm = () => {
   const {id} = useParams()
  //  console.log("id",id)
    const methods = useForm({
    defaultValues: {
      busname: "",
      busnumber: "",
      drivername: "",
      driverphonenumber: "",
      source: "",
      destination: "",
      bustype: {
        airConditioning: "",
        category: "",
        layout: "",
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
      deletedImages:[],
    }
  });

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

    const valid = await trigger(stepFields);
    if (valid) setStep(prev => Math.min(prev + 1, 6));
  }
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));


  const { handleSubmit,setValue,reset, trigger, getValues } = methods;
  const [step, setStep] = useState(1);
  const [Loading,SetLoading] = useState(false)
  // fetch busdetails 
  useEffect(()=>{
    const fetchBusDetails = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bus/${id}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          },withCredentials:true
        })
        if(response.data){
          const bus = response?.data?.data
          // console.log("bus",bus)
           // Format dates inside boardingPoints & droppingPoints
        const formattedBoarding = bus.boardingPoints?.map(point => ({
          ...point,
          date: point.date ? point.date.slice(0, 10) : ""  // convert "2025-10-04T00:00:00.000Z" to "2025-10-04"
        })) || [];

        const formattedDropping = bus.droppingPoints?.map(point => ({
          ...point,
          date: point.date ? point.date.slice(0, 10) : ""
        })) || [];

          setValue("busname",bus.busname)
          setValue("busnumber",bus.busnumber)
          setValue("drivername",bus.drivername)
          setValue("driverphonenumber",bus.driverphonenumber)
          setValue("source",bus.source)
          setValue("destination",bus.destination)
          setValue("totalSeats",bus.totalSeats)
          setValue("boardingPoints",formattedBoarding)
          setValue("droppingPoints",formattedDropping)
          setValue("busRoutes",bus.busRoutes)
          setValue("runDays",bus.runDays)
          setValue("amenities",bus.amenities)
          setValue("bustype",bus.bustype)
          setValue("existingImages",bus.images || [])
        }
        
      } catch (error) {
        console.log("failed to get bus details",error)
      }
    }
    fetchBusDetails()
  },[id,setValue])

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
    formData.append("bustype",JSON.stringify(data.bustype || {}))
    formData.append("deletedImages",JSON.stringify(data.deletedImages || []))
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
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/bus/update-bus/${id}`,formData,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
          "Content-Type":"multipart/form-data"
        },withCredentials:true
      })
      if(response.data){
        toast.success(response?.data?.message)
        setStep(1)
      }
    } catch (error) {
      console.error("failed to update bus",error)
      toast.error(error?.response?.data?.message)
    }finally{
      SetLoading(false)
    }
  }
  return (
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full min-h-screen  px-5 py-7 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Bus Details</h2>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div key={s} className={`flex-1 h-2 mx-1 rounded-full ${step >= s ? "bg-red-500" : "bg-gray-300"}`}></div>
          ))}
        </div>

        {/* Steps */}
         {step === 1 && <UpdateBusInfo />}
         {step === 2 && <UpdateBoardingDropping />}
        {step === 3 && <UpdateRoutesSeats />}
        {step === 4 && <UpdateBusAmenities />}
         {step === 5 && <UpdateBusImagesUpload/>} 

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          {step > 1 && <button onClick={prevStep} type='button' className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Previous</button>}
          {step < 5 && <button onClick={nextStep} type='button' className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-auto">Next</button>}
          {step === 5 && <button type='submit' className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto">{Loading ? "Updating..." : "Finish"}</button>}
        </div>
      </form>
    </FormProvider>
  )
}

export default UpdateBusForm