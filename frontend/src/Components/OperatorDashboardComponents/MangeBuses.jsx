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
import { Delete, Edit } from 'lucide-react'
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
  PaginationPrevious,
}
  from "../ui/pagination"
import { toast } from 'sonner'
import { NavLink } from 'react-router-dom'

const MangeBuses = () => {
  const [Loading, setLoading] = useState(false)
  const [Buses, setBuses] = useState([])
  const [page, SetPage] = useState(1)
  const [pagination, Setpagination] = useState({ total: 0, totalPages: 1 })

  // fetch operator Buses
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bus/my-buses?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }, withCredentials: true
        })
        // console.log("data", response.data)
        if (response.data) {
          setBuses(response?.data?.data?.operatorbuses)
          Setpagination(response?.data?.data?.pagination)
        }
      } catch (error) {
        console.log("failed to get Buses", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [page])
  // update bus status 
  const handlebusStatusUpdate = async (id, status) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/bus/${id}/status`, {
        isActive: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }, withCredentials: true
      })
      if (response?.data) {
        toast.success(response?.data?.message)
        setBuses((prevbus) => prevbus.map((bus) => bus._id === id ? { ...bus, isActive: status } : bus))
      }
    } catch (error) {
      console.log("failed to update status", error)
      toast.error(error?.response?.data?.message)
    }
  }
  // handle bus delete
  const handleBusDelete = async(id)=>{
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/bus/${id}/delete`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },withCredentials:true
        })
        if(response.data){
           toast.success(response?.data?.message)
           setBuses(Buses.filter((bus)=> bus._id !== id))
        }
    } catch (error) {
        console.log("failed to delete bus", error)
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='flex w-full  p-6 flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-[1.4rem] font-[600]'>Manage Buses</h3>
        <p className='text-gray-500 font-[400]'>View all listed Buses,update their details, or remove them from the booking platform</p>
      </div>
      {/* table of buses */}
      <>
        {Loading ? (
          <div className='mt-5 border  rounded-md'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Bus Info</TableHead>
                  <TableHead>Bus Route</TableHead>
                  <TableHead>Driver Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delete</TableHead>
                  <TableHead>Update Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7, 9, , 10].map((i) => (
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
        ) : Buses?.length > 0 ? (
          <>
            <div className='mt-5 border rounded-md'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Bus Info</TableHead>
                    <TableHead>Bus Route</TableHead>
                    <TableHead className="">Driver Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="">Delete</TableHead>
                    <TableHead className="">Update Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Buses.map((Bus) => (
                    <TableRow key={Bus._id}>
                      <TableCell className="font-medium">
                        <div className='flex w-full flex-col gap-3'>
                          <span className='font-[700]'>{Bus?.busnumber || "NA"}</span>
                          <span className='font-[600]'>{Bus?.busname || "NA"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {Bus?.source || "NA"} To {Bus?.destination || "NA"}
                      </TableCell>
                      <TableCell className=" text-gray-500 ">
                        <div className='flex w-full flex-col gap-3'>
                          <span className='font-[700]'>{Bus?.drivername || "NA"}</span>
                          <span className='font-[600]'>{Bus?.driverphonenumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          onChange={(e) => handlebusStatusUpdate(Bus?._id, e.target.value)}
                          className={`px-8 py-2 cursor-pointer rounded-md text-white ${Bus?.isActive === "Active" ? "bg-green-600" : "bg-red-500"
                            } font-medium`}
                          value={Bus?.isActive}
                        >
                          <option className='cursor-pointer' value='Active'>Active</option>
                          <option className='cursor-pointer' value='Inactive'>InActive</option>
                        </select>
                      </TableCell>
                      <TableCell onClick={()=> handleBusDelete(Bus?._id)}><Delete className='cursor-pointer' /></TableCell>
                      <TableCell>
                        <NavLink to={`/operator-dashboard/update-bus-details/${Bus?._id}`}>
                         <Edit className='mx-auto cursor-pointer' />
                        </NavLink>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* pagination */}
            {
              pagination?.totalPages > 1 && (
                <div className='p-5 mt-2'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                          className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => { if (page === 1) return; SetPage(prev => prev - 1) }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink>
                          {pagination?.currentPage} of {pagination?.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationNext
                          className={`${page === pagination?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => { if (page === pagination?.totalPages) return; SetPage(prev => prev + 1) }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )
            }
          </>

        ) : (
          <p className='text-center mt-12 text-gray-500'>No Buses found</p>
        )}
      </>

    </div>
  )
}

export default MangeBuses