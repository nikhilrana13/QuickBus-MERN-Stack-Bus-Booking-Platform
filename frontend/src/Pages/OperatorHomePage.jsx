import Benefits from '@/Components/OperatorHomepageComponents/Benefits'
import Hero from '@/Components/OperatorHomepageComponents/Hero'
import HowItWorks from '@/Components/OperatorHomepageComponents/HowItWorks'
import OperatorFooter from '@/Components/OperatorHomepageComponents/OperatorFooter'
import OperatorNavbar from '@/Components/OperatorHomepageComponents/OperatorNavbar'
import OperatorTestimonials from '@/Components/OperatorHomepageComponents/OperatorTestimonals'
import React from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const OperatorHomePage = () => {
    // aos 
    useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      once: true, // animation only once
    });
  }, []);
  return (
    <div className='font-inter w-full'>
        <OperatorNavbar />
        <Hero aos="fade-up" />
        <HowItWorks />
        <Benefits />
        <OperatorTestimonials />
        <OperatorFooter />
    </div>
  )
}

export default OperatorHomePage