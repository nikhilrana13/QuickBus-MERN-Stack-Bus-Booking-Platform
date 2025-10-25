import React, { useState } from 'react'
import logo from "../../assets/quickbuslogored.png"
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { SlMenu } from "react-icons/sl";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { MdAccountCircle, MdOutlineAccountCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { TbWorldQuestion } from "react-icons/tb";
import { FaBus } from "react-icons/fa6";
import LoginDialog from './LoginDialog';
import { useDispatch, useSelector } from 'react-redux';
import { BellDotIcon, LogOutIcon, TicketIcon } from 'lucide-react';
import { toast } from 'sonner';
import { SetUser } from '@/Redux/AuthSlice';
import axios from 'axios';


const Navbar = () => {
  const [isSidebarOpen, SetIsSidebarOpen] = useState(false)
  const user = useSelector((state)=>state.Auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  //  console.log("user",user)

  // handle logout 
  const HandleLogout = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,{
        withCredentials:true
      })
      if(response.data){
        toast.success(response?.data?.message)
         dispatch(SetUser(null))
         localStorage.removeItem("token")
         SetIsSidebarOpen(false)
         navigate("/")
      }
    } catch (error) {
      console.error("failed to logout",error)
      toast.error(error?.response?.data?.message || "Internal server error")
    }
  }
  
  const onBookingAndProfileClick = ()=>{
    if(user === null){
       return toast.error("Please Log in to View profile details")
    }
  }
  return (
    <header className="px-[1rem] top-0 z-[9999]  shadow-md  sm:px[2rem] xl:px-[5rem] 2xl:px-[10rem]">
      <nav className="flex  justify-center lg:justify-between items-center">
        <div className='flex gap-[5px] justify-center py-[0.2rem] items-center'>
          <img src={logo} alt="logo image" className='w-[3.5rem] hidden lg:block h-[3.5rem] mr-[2rem]' />
          <NavLink to="/" className={({ isActive }) => `block relative mr-[2rem]   ${isActive ? "after:content-[''] after:absolute after:w-full after:h-[3px] after:bg-[#d63941] after:rounded-md after:bottom-0 after:left-0" : ""}`
          }>
            <div className='flex w-[106px]  h-[56px] items-center flex-col'>
              <img src={logo} alt="logo image" className='' width={30} height={20} />
              <span className='text-[.6875rem] text-[#d63941] font-[500]'>Bus Tickets</span>
            </div>
          </NavLink>
          {
            user?.role !== "customer" ? (
                <NavLink to="/become-operator" className="block lg:hidden items-center">
                <div className='flex flex-col items-center gap-[5px]'>
                  <FaBus className='text-[1.5rem]' />
                <span className='text-[0.9rem] font-[500]'>Become a operator</span>
                </div>
             </NavLink>
            ):""
          }
        </div>
        {/* desktop navbar */}
        <div className='hidden lg:flex'>
          <ul className='flex gap-[20px]'>
            <li onClick={onBookingAndProfileClick} className='hover:rounded-full p-3 cursor-pointer hover:bg-gray-100'>
              <NavLink to="/mybookings/mytrips" className="flex items-center gap-[10px]">
                <SlMenu className='text-[1.2rem]' />
                <span className='text-[0.9rem] font-[500]'>Bookings</span>
              </NavLink>
            </li>
            <li className='hover:rounded-full p-3 cursor-pointer hover:bg-gray-100'>
              <NavLink to="#" className="flex items-center gap-[5px]">
                <HiOutlineQuestionMarkCircle className='text-[1.5rem]' />
                <span className='text-[0.9rem] font-[500]'>Help</span>
              </NavLink>
            </li>
              {
                user?.role !== "customer" ? (
              <li className='hover:rounded-full p-3 cursor-pointer hover:bg-gray-100'>
              <NavLink to="/become-operator" className="flex items-center gap-[5px]">
                <FaBus className='text-[1.5rem]' />
                <span className='text-[0.9rem] font-[500]'>Become a operator</span>
              </NavLink>
            </li>
                ):""
              }
            <li onClick={() => SetIsSidebarOpen(true)} className='hover:rounded-full p-3 cursor-pointer hover:bg-gray-100'>
              <div  className="flex items-center gap-[5px]">
                <MdAccountCircle className='text-[1.5rem]' />
                <span className='text-[0.9rem] font-[500]'>Account</span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      {/* bottom navbar Mobile only */}
      <div className='fixed bottom-0 left-0 w-full border py-10 bg-white h-[60px] border-t flex justify-around items-center lg:hidden z-[10000]'>
        <NavLink to="/" className={({isActive})=>`flex flex-col gap-[5px] items-center ${isActive ? 'text-[#D63941]' : 'text-gray-500'}`}>
          <MdOutlineAccountCircle className="text-[1.5rem]" />
          <span className="text-[0.75rem]">Home</span>
        </NavLink>
        <NavLink to="/mybookings/mytrips" onClick={onBookingAndProfileClick} className={({isActive})=>`flex flex-col gap-[5px] items-center ${isActive ? 'text-[#D63941]' : 'text-gray-500'}`}>
          <SlMenu className='text-[1.2rem]' />
          <span className='text-[0.75rem] font-[500]'>Bookings</span>
        </NavLink>
        <NavLink to="/help" className={({isActive})=>`flex flex-col gap-[5px] items-center ${isActive ? 'text-[#D63941]' : 'text-gray-500'}`}>
          <HiOutlineQuestionMarkCircle className='text-[1.5rem]' />
          <span className='text-[0.75rem] font-[500]'>Help</span>
        </NavLink>
        <li  onClick={()=>SetIsSidebarOpen(true)} className='flex flex-col text-gray-500 gap-[5px] items-center'>
          <MdAccountCircle className='text-[1.5rem]' />
          <span className='text-[0.75rem] font-[500]'>Account</span>
        </li>
      </div>
      {/* overlay container only for Sidebar (not LoginDialog) */}
      {isSidebarOpen && (
        <div
          onClick={() => SetIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"
        ></div>
      )}
      {/* Sidebar */}
      <div className={` fixed top-0  pb-[80px] lg:pb-[0] right-0 h-full w-[363px] z-[9999] bg-white shadow-lg  transform transition-transform duration-300 will-change-transform  ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto scrollbar-hidden`}
      >
        {/* Close button */}
        <div className='flex border-b items-center justify-between p-3'>
          <h4 className='font-[700] text-[1.2rem]'>Account</h4>
          <IoClose onClick={() => SetIsSidebarOpen(false)} className='text-[2.5rem] hover:bg-gray-100 cursor-pointer  py-2 px-2 rounded-full' />
        </div>
        {/* Sidebar content */}
        <div className=" flex flex-col">
          {/* login */}
         <div className='flex px-3 py-10 gap-[30px]  flex-col'>
          {
            !user || user?.role !== "customer" ? (
              <>
              <h4 className='text-[1.8rem]  font-[600] '>Log in to manage your <br />bookings</h4>
              <LoginDialog onLoginSuccess={()=>SetIsSidebarOpen(false)}  />
              </>
            ):""
          }
           </div> 
          {/* my details */}
          <div className='flex border-b flex-col'>
            <h4 className='font-[700] px-3 text-[1.3rem]'>My details</h4>
            <NavLink to="/mybookings/mytrips" onClick={onBookingAndProfileClick} className='flex px-3 cursor-pointer py-4 border-b mt-5 items-center gap-[20px]'>
              <SlMenu className='text-[1.2rem]' />
              <span className='font-[500]'>Bookings</span>
            </NavLink>
            <NavLink to="/mybookings/myprofile" onClick={onBookingAndProfileClick} className='flex px-3 cursor-pointer py-4 items-center gap-[20px]'>
              <HiOutlineUser className='text-[1.2rem]' />
              <span className='font-[500]'>Personal information</span>
            </NavLink>
          </div>
          {/* more */}
          <div className='flex border-b my-5 flex-col'>
            <h4 className='font-[700] px-3 text-[1.3rem]'>More</h4>
            <div className='flex px-3 py-4 cursor-pointer border-b mt-5 items-center gap-[20px]'>
              <FaRegCircleQuestion className='text-[1.2rem]' />
              <span className='font-[500]'>Help</span>
            </div>
            <div className='flex px-3 py-4 cursor-pointer items-center gap-[20px]'>
              <TbWorldQuestion className='text-[1.2rem]' />
              <span className='font-[500]'>Know about Quickbus</span>
            </div>
            <div className='flex px-3 py-4 cursor-pointer border-t items-center gap-[20px]'>
              <TicketIcon className='text-[1.2rem]' />
              <span className='font-[500]'>Cancel Ticket</span>
            </div>
             <div className='flex px-3 py-4 cursor-pointer border-t items-center gap-[20px]'>
              <BellDotIcon className='text-[1.2rem]' />
              <span className='font-[500]'>Notifications</span>
            </div>
            {
              user || user?.role === "customer" ? (
              <div  onClick={HandleLogout} className='flex px-3 py-4 cursor-pointer border-t items-center gap-[20px]'>
              <LogOutIcon className='text-[1.2rem]' />
              <span className='font-[500]'>Logout</span>
            </div>
              ):""
            }
             
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar