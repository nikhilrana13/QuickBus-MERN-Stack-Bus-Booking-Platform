import React from 'react'
import logo from "../../assets/quickbuslogowhite.png"
import { NavLink } from 'react-router-dom'
import ProfileDropdownMenu from './profileDropdownmenu'

const DashboardNavbar = () => {
  return (
     <header className='sm:px[2rem]   py-2 bg-[#D63941] xl:px-[3rem] px-[1rem]'>
         <nav className='w-full flex items-center justify-between  '>
        <div className='flex gap-2 flex-col md:flex-row justify-center py-[0.2rem] items-center'>
            <NavLink to="/become-operator">
            <img src={logo} alt="logo image" className='w-[4rem]  h-[3.5rem] ' />
            </NavLink>
          <span className='text-white text-sm'>MY BUS on quickBus</span>
        </div>
        <div>
          <ProfileDropdownMenu />
        </div>
      
      </nav>
    </header>
  )
}

export default DashboardNavbar