import React from 'react'
import { FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const OperatorFooter = () => {
  return (
   <footer className="bg-gradient-to-r from-[#012047] to-[#1B3A6B] xl:px-[10rem] px-[1rem] text-white py-12 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-4">
        {/* Left side text */}
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl md:text-3xl font-bold mb-2">
            Start selling bus tickets and grow your business with QuickBus
          </h4>
          <p className="text-gray-300 text-sm md:text-base">
            Manage bookings, reach more customers, and increase revenue easily.
          </p>
        </div>

        {/* Center - Quick Links */}
        <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-6 md:gap-10">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h5 className="font-semibold text-lg">Quick Links</h5>
            <ul className="space-y-1">
              <li><NavLink to="/" className="hover:text-red-500 transition">About</NavLink></li>
              <li><NavLink to="/help" className="hover:text-red-500 transition">Help</NavLink></li>
              <li><NavLink to="#" className="hover:text-red-500 transition">Contact</NavLink></li>
              <li><NavLink to="#" className="hover:text-red-500 transition">Terms & Conditions</NavLink></li>
            </ul>
          </div>

          {/* Social media icons */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h5 className="font-semibold text-lg">Follow Us</h5>
            <div className="flex gap-3 mt-1 justify-center md:justify-start">
              <a href="https://facebook.com" target="_blank" className="hover:text-red-500 transition">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" className="hover:text-red-500 transition">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" className="hover:text-red-500 transition">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" className="hover:text-red-500 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Right side elevated button */}
        <div className="flex-1 flex justify-center md:justify-end items-center">
          <button className="bg-[#D63941] hover:bg-red-600 transition-all px-8 py-4 rounded-full font-semibold text-white shadow-lg transform hover:scale-105 hover:animate-bounce">
            Register Now
          </button>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-12 border-t px-4 border-gray-600 pt-4 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0">
        <span>
          © QuickBus 2025 made with <FaHeart className="inline text-red-500" /> by Nikhil Rana
        </span>
        <span className="mt-2 md:mt-0">All rights reserved</span>
      </div>
    </footer>
  )
}

export default OperatorFooter