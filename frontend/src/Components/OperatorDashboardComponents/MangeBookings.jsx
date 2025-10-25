
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx"

const MangeBookings = () => {
  const [Loading,setLoading] = useState(false)
  const [Bookings,setBookings] = useState([])

   useEffect(()=>{
        const fetchBookings = async()=>{
          try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/my-bookings`,{
              headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },withCredentials:true
            })
            // console.log("data",response.data)
            if(response.data){
              setBookings(response?.data?.data)
            }
          } catch (error) {
            console.log("failed to get bookings",error)
          }finally{
              setLoading(false)
            }
          }
        fetchBookings()
     },[])
  return (
    <div className='flex w-full p-6 flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-[1.4rem] font-[600]'>Manage Bookings</h3>
        <p className='text-gray-500 font-[400]'>Track all bookings</p>
      </div>
      {/* table of bookings */}
      <>
        {Loading ? (
          <div className='mt-5 border  rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Bus Number</TableHead>
                  <TableHead>Boarding & Dropping</TableHead>
                  <TableHead>Total Fare</TableHead>
                   <TableHead>Book Seats</TableHead>
                    <TableHead>Booking Date</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3,4,5,6,7,8,9,10].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell>
                       <div className="h-4 w-40 bg-gray-300 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-40 bg-gray-300 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-gray-300 rounded" />
                    </TableCell>
                      <TableCell>
                      <div className="h-4 w-20 bg-gray-300 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-28 bg-gray-300 rounded-md" />
                    </TableCell>
                      <TableCell>
                      <div className="h-8 w-28 bg-gray-300 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : Bookings?.length > 0 ? (
          <div className='mt-5 border rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Bus Number</TableHead>
                  <TableHead>Boarding & Dropping</TableHead>
                  <TableHead className="">Total Fare</TableHead>
                    <TableHead>Book Seats</TableHead>
                      <TableHead className="">Booking Date</TableHead>
                  <TableHead className="">Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Bookings.map((Booking) => (
                  <TableRow key={Booking._id}>
                    <TableCell className="font-medium">
                      <div className='flex w-full items-center'>
                       <h3>{Booking?.busId?.busnumber || "NA"}</h3>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {Booking?.boardingPoint?.city || "NA"} To {Booking?.droppingPoint?.city || "NA"}
                    </TableCell>
                    <TableCell className=" text-gray-500 ">₹{Booking?.totalFare || 0}</TableCell>
                        <TableCell className=" text-gray-500 ">{Booking?.passengers.map((p)=>p.seatNumber).join(",") || "NA"}</TableCell>
                    <TableCell className=" text-gray-500 ">{new Date(Booking?.createdAt).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell>
                        <span
                          className={`px-8 py-2 rounded-md text-white font-medium ${Booking?.paymentInfo?.paymentStatus === "Paid"
                            ? "bg-green-500"
                            : Booking?.paymentInfo?.paymentStatus === "Failed"
                              ? "bg-red-500"
                              : "bg-gray-400"
                            }`}
                        >
                         {Booking?.paymentInfo?.paymentStatus}
                        </span>
                    

                    </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>

        ) : (
          <p className='text-center mt-12 text-gray-500'>No Bookings found</p>
        )}
      </>

    </div>
  )
}

export default MangeBookings