import React from 'react'
import { FaUserPlus, FaBus, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'

const steps = [
  { icon: <FaUserPlus className="text-4xl text-[#D63941]" />, title: "Sign Up", desc: "Create your QuickBus operator account quickly." },
  { icon: <FaBus className="text-4xl text-[#D63941]" />, title: "Add Your Buses", desc: "Add all your buses and manage schedules easily." },
  { icon: <FaMoneyBillWave className="text-4xl text-[#D63941]" />, title: "Start Getting Bookings", desc: "Receive bookings directly from passengers." },
  { icon: <FaChartLine className="text-4xl text-[#D63941]" />, title: "Earn Money", desc: "Track your earnings and manage payments seamlessly." },
]

const HowItWorks = () => {
  return (
    <section className="py-20  xl:px-[10rem] px-[1rem]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
