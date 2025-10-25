import DashboardNavbar from '@/Components/OperatorDashboardComponents/DashboardNavbar'
import { Bus, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { PlusIcon, Car, HomeIcon, ArrowRight, TicketCheckIcon, CarFrontIcon, LayoutDashboard, UserCheckIcon, LogInIcon } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { SetUser } from '@/Redux/AuthSlice'

const OperatorDashboard = () => {
  const [isSidebaropen, SetIsSidebaropen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Automatically collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        SetIsSidebaropen(true);   // mobile → collapsed
      } else {
        SetIsSidebaropen(false);  // desktop → expanded
      }
    };

    handleResize(); // run on first render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
   const HandleLogout = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,{
        withCredentials:true
      })
      if(response.data){
        toast.success(response?.data?.message)
         dispatch(SetUser(null))
         localStorage.removeItem("token")
         navigate("/become-operator")
      }
    } catch (error) {
      console.error("failed to logout",error)
      toast.error(error?.response?.data?.message || "Internal server error")
    }
  }

  return (
    <div className='flex flex-col '>
      <DashboardNavbar />
      <div className='p-1 flex-1  g:p-5 gap-3 flex '>
        {/* left side */}
        <div className={`${isSidebaropen ? 'w-[60px] px-2' : 'w-[20%] px-5'}  bg-gray-900 rounded-md py-8 border h-full flex flex-col transition-[width,padding] items-start duration-500 `}>
          <div className={`flex ${isSidebaropen ? "justify-center" : "gap-4 justify-between"} px-2 py-2 items-center w-full`}>
            {
              !isSidebaropen && (
                <div>
                  <h3 className={`text-white font-bold text-[1rem] transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Operator Dashboard </h3>
                </div>
              )
            }
            <Menu onClick={()=> SetIsSidebaropen(!isSidebaropen)} className='text-white  cursor-pointer text-[1.5rem]' />
           
          </div>
          <div className='flex flex-col mt-10  gap-8'>
            <NavLink to="/operator-dashboard/dashboard" className={({ isActive }) => isActive ? `bg-[#D63941]  text-white px-2 py-2 rounded-md flex items-center gap-2` : `px-2 py-2 mb-2 hover:text-[#D63941] text-white rounded-md `}>
              <div className="flex items-center gap-4">
                <LayoutDashboard />
                {
                  !isSidebaropen && (
                    <span className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Dashboard</span>
                  )
                }

              </div>
            </NavLink>
            <NavLink to="/operator-dashboard/add-bus" className={({ isActive }) => isActive ? ` bg-[#D63941]  text-white px-2 py-2 rounded-md flex items-center gap-2` : `px-2 py-2 mb-2 hover:text-[#D63941] text-white rounded-md `}>
              <div className="flex items-center gap-4">
                <PlusIcon />
                {
                  !isSidebaropen && (
                    <span className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Add Bus</span>
                  )
                }

              </div>
            </NavLink>
            <NavLink to="/operator-dashboard/manage-bookings" className={({ isActive }) => isActive ? ` bg-[#D63941] text-white px-2 py-2 rounded-md flex items-center gap-2` : `px-2 py-2 mb-2 hover:text-[#d63941] text-white rounded-md `}>
              <div className="flex items-center gap-4">
                <TicketCheckIcon />
                {
                  !isSidebaropen && (
                    <span className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Manage Bookings</span>
                  )
                }

              </div>
            </NavLink>
            <NavLink to="/operator-dashboard/manage-buses" className={({ isActive }) => isActive ? `bg-[#D63941]  text-white px-2 py-2 rounded-md flex items-center gap-2` : `px-2 py-2 mb-2 hover:text-[#D63941] text-white rounded-md `}>
              <div className="flex items-center gap-4">
                <Bus />
                {
                  !isSidebaropen && (
                    <span className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Manage Buses</span>
                  )
                }
              </div>
            </NavLink>
            <NavLink to="/operator-dashboard/update-profile" className={({ isActive }) => isActive ? `bg-[#D63941]  text-white px-2 py-2 rounded-md flex items-center gap-2` : `px-2 py-2 mb-2 hover:text-[#D63941] text-white rounded-md `}>
              <div className="flex items-center gap-4">
                <UserCheckIcon />
                {
                  !isSidebaropen && (
                    <span className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Update Profile</span>
                  )
                }

              </div>
            </NavLink>
            <div className="px-2 cursor-pointer py-2 mb-2 hover:text-[#D63941] text-white rounded-md ">
              <div onClick={HandleLogout} className="flex items-center gap-4">
                <LogInIcon />
                {
                  !isSidebaropen && (
                    <span  className={`transition-opacity duration-500 ${isSidebaropen ? 'opacity-0' : 'opacity-100'}`}>Logout</span>
                  )
                }

              </div>
            </div>
          </div>
        </div>
        {/* right side */}
         {
          location.pathname === "/operator-dashboard" ? (
            <div className={`w-full ${isSidebaropen ? 'lg:w-[calc(100%-60px)]' : 'lg:w-[80%]'} flex-1 flex items-center justify-center gap-2`}>
              <h3 className='text-[#D63941] gap-4 flex items-center dark:text-white text-center font-[700] text-[1.5rem] md:text-[2rem]'>Welcome to Quickbus <Bus /> !</h3>
          </div>
          ):(
           <div className={`w-full ${isSidebaropen ? 'lg:w-[calc(100%-60px)]' : 'lg:w-[80%]'} flex  flex-1 flex-col `}>
          <Outlet />
        </div>
          )
         }
      
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default OperatorDashboard











