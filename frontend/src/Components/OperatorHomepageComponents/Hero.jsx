import React from 'react'
import busimage from "../../assets/busimg.jpg"
import OperatorLoginDialog from './OperatorLoginDialog'

const Hero = ({aos}) => {
  return (
    <section className="bg-[#D63941]  xl:px-[10rem] px-[1rem] text-white py-20">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4">
        <div data-aos={aos} className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-5xl leading-10 font-bold mb-4">Start Your Journey as a QuickBus Operator</h1>
          <p className="mb-6 text-lg lg:text-xl">Manage your buses, get bookings, and earn money with ease.</p>
          <OperatorLoginDialog />
        </div>
        <div data-aos={aos} className="mt-10 lg:mt-0">
          <img src={busimage} alt="Bus Banner" className="w-full rounded-md max-w-md" />
        </div>
      </div>
    </section>
  )
}

export default Hero