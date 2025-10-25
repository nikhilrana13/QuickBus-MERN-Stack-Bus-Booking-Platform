import React from 'react'
import Navbar from './Navbar'
import { TicketIcon, User2Icon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import unknownuser from "../../assets/istockphoto-517998264-612x612.jpg"

const UserBookings = () => {
  const user = useSelector((state)=> state.Auth.user)

  return (
    <div className=' pb-[80px] lg:pb-[0]'>
      <Navbar />
      <div className='bg-[#EFEEEE] overflow-x-auto scrollbar-hidden  px-1 py-5 sm:px[2rem] xl:px-[5rem] 2xl:px-[10rem] flex flex-col w-full lg:flex-row h-screen gap-3'>
        {/* left side */}
        <div className='w-full border-b  border-b-[#E0E0E0]   lg:border-r lg:border-r-[#E0E0E0] lg:w-[20%]'>
          <div className='flex py-3 flex-col gap-2'>
            {/* profile */}
            <div className='flex p-3 gap-3'>
              <div>
                <Avatar>
                  <AvatarImage src={unknownuser} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <span className='text-black font-[500]'>{user?.username || "User"}</span>
            </div>
            {/* links */}
            <div className='flex flex-col gap-3'>
               <NavLink to="/mybookings/mytrips" className={({ isActive})=> isActive ? `bg-[#D8D8D8]  text-[#656161] px-2 py-4 flex items-center gap-2  rounded-md`:`px-2 py-4  text-[#656161] cursor-pointer `}>
                  <div className='flex items-center gap-4 '>
                    <TicketIcon className='text-gray-500' />
                    <span className='inline'>My trips</span>
                 </div>
            </NavLink>
             <NavLink to="/mybookings/myprofile" className={({ isActive})=> isActive ? `bg-[#D8D8D8]  text-[#656161] px-2 py-4  flex items-center gap-2 rounded-md `:`px-2 py-4  cursor-pointer  text-[#656161] `}>
                  <div className='flex items-center gap-4 '>
                    <User2Icon />
                    <span className='inline'>My profile</span>
                 </div>
            </NavLink>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className=' w-full lg:w-[80%]'>
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default UserBookings