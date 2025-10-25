import React from 'react'
import { FaClock, FaShieldAlt, FaHeadset } from 'react-icons/fa'

const benefits = [
  { icon: <FaClock className="text-3xl text-[#D63941]" />, title: "24/7 Support", desc: "Get round-the-clock assistance anytime." },
  { icon: <FaShieldAlt className="text-3xl text-[#D63941]" />, title: "Safe & Secure", desc: "All bookings and payments are safe and secure." },
  { icon: <FaHeadset className="text-3xl text-[#D63941]" />, title: "Easy Management", desc: "Manage your buses and bookings effortlessly." },
]

const Benefits = () => {
  return (
    <section className="py-20 bg-[#F8F8F8] xl:px-[10rem] px-[1rem]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuickBus</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow text-center hover:shadow-lg transition">
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
