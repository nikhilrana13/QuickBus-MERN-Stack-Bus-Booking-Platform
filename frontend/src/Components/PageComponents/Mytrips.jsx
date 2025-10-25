import React, { useEffect, useState } from 'react'
import { BusFront, CalendarDays, MapPin, Clock, Loader2 } from "lucide-react";
import axios from 'axios';
import UpcomingTripCard from './UpcomingTripCard';

const Mytrips = () => {
    const [loading,setLoading] = useState(false)
    const [UpcomingTrips,SetUpcomingTrips] = useState([])
   
    useEffect(()=>{
         const fetchUpcomingTrips = async() =>{
            try {
                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/upcoming-trips`,{
                    headers:{
                        Authorization :`Bearer ${localStorage.getItem("token")}`
                    },withCredentials:true
                })
                // console.log("response",response.data)
                if(response.data){
                    SetUpcomingTrips(response?.data?.data)
                }
            } catch (error) {
                console.log("failed to get upcoming trips",error)
            }finally{
                setLoading(false)
            }
         }
         fetchUpcomingTrips()
    },[])
    return (
        <div className='py-5 px-2 lg:px-10'>
            <h3 className='text-[1.2rem] text-[#656161]'>My trips</h3>
            <div className='flex mt-5 flex-col gap-5'>
                <h3 className='text-[1.2rem] text-[#D63941] '>Upcoming</h3>
              {
                loading ? (
                    <Loader2 className='mx-auto mt-10 w-10 h-10 text-[#D63941] animate-spin' />
                ):UpcomingTrips.length > 0 ? (
                  UpcomingTrips.map((trip)=>{
                    return(
                        <UpcomingTripCard trip={trip} key={trip?._id} />
                    )
                  })
                ):(
                    <div className='bg-white shadow-lg  rounded-md w-full'>
                <p className='text-center text-sm py-8'>No upcoming trips.Plan one now!</p>
            </div>
                )
              }
              
            </div>
        </div>
    )
}
export default Mytrips