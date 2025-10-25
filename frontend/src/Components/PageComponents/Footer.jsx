import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import logo from "../../assets/quickbuslogored.png"

const Footer = () => {
  return (
       <footer className="bg-[#F8F9FC] text-gray-700 border-t">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          {/* Logo and description */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src={logo}
              alt="QuickBus Logo"
              className="w-24 h-auto object-contain"
            />
            <p className="text-sm md:w-[80%] leading-relaxed">
              <span className="font-semibold text-[#D63941]">QuickBus</span> is India’s most trusted online bus ticket booking platform, 
              helping thousands of travelers daily find and book their perfect ride. 
              Book your tickets easily via our website or mobile app — available for all major routes across India.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-2xl text-gray-600">
            <a href="#" className="hover:text-[#D63941]">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-[#D63941]">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-[#D63941]">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-[#D63941]">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 QuickBus India Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Made with <span className="text-[#D63941]">❤️</span> by <span className="font-semibold text-gray-700">Nikhil Rana</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer