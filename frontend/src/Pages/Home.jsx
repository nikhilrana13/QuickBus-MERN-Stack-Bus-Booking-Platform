import React, { Fragment } from 'react'
import Navbar from '../Components/PageComponents/Navbar'
import homebanner from '../assets/HomeSaleBanner2.webp'
import SearchInput from '@/Components/PageComponents/SearchInput'
import Testimonials from '@/Components/PageComponents/Testimonals'
import BookingGuide from '@/Components/PageComponents/BookingGuide'
import Footer from '@/Components/PageComponents/Footer'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Home = () => {
  // aos 
  useEffect(() => {
  AOS.init({
    duration: 1000, // animation duration in ms
    once: true, // animation only once
  });
}, []);

  return (
    <div className='w-full pb-[80px] lg:pb-[0]'>
        <Navbar />
        <div className='flex flex-col '>
          {/* home banner */}
          <section className='w-full h-[300px]  px-2 2xl:px-10 py-10  bg-center bg-no-repeat bg-cover hidden md:block ' style={{backgroundImage:`linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0)), url(${homebanner})`}}>
             {/* headings */}
             <div className=' hidden md:block md:text-center lg:text-left px-4 xl:px-[4rem] 2xl:px-[7rem] py-5'>
              <h3 data-aos="fade-up" className='text-[1.8rem] lg:text-[2.8rem] font-[700] text-white leading-8 lg:leading-[3.5rem]'>India's No.1 online <br/> bus ticket booking site </h3>
             </div>
              {/* for desktop */}
              <SearchInput aos="fade-up"/>
          </section>
          {/* for mobile */}
          <section className='block  py-3 md:hidden'>
           <div className='p-2 flex flex-col gap-2 '>
            <h4 className='font-[600]'>Bus Tickets</h4>
             <h4 className='font-[600]text-sm text-gray-500'>Bus preferred by women</h4>
           </div>
          <SearchInput />
        </section>
        {/* testimonals */}
          <Testimonials />
          {/* Booking guide */}
          <BookingGuide />
        </div>
        {/* footer */}
        <Footer />
    </div>
  )
}

export default Home