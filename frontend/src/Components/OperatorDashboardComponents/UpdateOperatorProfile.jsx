import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { SetUser } from '@/Redux/AuthSlice'

const UpdateOperatorProfile = () => {
   const {handleSubmit,register,setValue}=useForm()
  const [loading,setLoading] = useState(false)
   const dispatch = useDispatch()
   const user = useSelector((state)=>state.Auth.user)

   useEffect(()=>{
    if(user){
      setValue("companyName",user?.companyName)
      setValue("contactno",user?.contactno)
    }
   },[user,setValue])
   const onSubmit = async(data)=>{
      try {
        setLoading(true)
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/operator/${user.id}/update`,data,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },withCredentials:true
        })
        if(response.data){
          toast.success(response?.data?.message)
          dispatch(SetUser(response?.data?.data))
        }
      } catch (error) {
        console.log("failed to update profile",error)
        toast.error(error?.response?.data?.message || "Internal server error")
      }finally{
        setLoading(false)
      }
   }
  return (
     <div className=" w-full rounded-md mt-10  p-10  leading-relaxed ">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
          <h2 className="mb-5 text-4xl font-bold text-black">Update Profile</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              {...register("companyName")}
            />
          </div>
          
         
            <div>
            <label
              htmlFor="PhoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              phone number
            </label>
            <input
              type="text"
              id="PhoneNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              {...register("contactno")}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
            >
              {
                loading ? (
                  <Loader2 className="animate-spin mx-auto w-5 h-5 text-white" />
                ) : (
                  "Save changes"
                )
              }

            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateOperatorProfile