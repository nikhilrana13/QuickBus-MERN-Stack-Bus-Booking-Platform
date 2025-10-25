import { BusFrontIcon, BusIcon, Calendar1Icon, Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const SearchInput = ({aos}) => {
  const [loading, setloading] = useState(false)
  const [isShaking, setIsShaking] = useState(false);
  // FROM field states
  const [isFromEditing, setIsFromEditing] = useState(false);
  const [fromValue, setFromValue] = useState('');
  const [date, setdate] = useState(new Date())
  // TO field states
  const [isToEditing, setIsToEditing] = useState(false);
  const [toValue, setToValue] = useState('');
  const navigate = useNavigate()
  // swap function
  const handleSwap = () => {
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const clean = (str) => str?.trim().replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
  const handleOnSubmit = () => {
    const from = clean(fromValue)
    const to = clean(toValue)
    if (!from || !to) {
      toast.error("All fields is required")
      setIsShaking(true) // trigger shake
      setTimeout(() => setIsShaking(false), 500); // remove class after animation
      return
    }
  // formattedDate
    const formattedDate = format(date, "yyyy-MM-dd"); 
    setloading(true)
    // navigate to /searchbuses with params
    // Send from and to place to local storage
    localStorage.setItem("from", from)
    localStorage.setItem("to", to)
    setTimeout(() => {
      navigate(`/searchbuses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${formattedDate}`)
    }, 1000);
    // console.log("query",fromValue,toValue,date)
  }
  //  Auto-fill from localStorage
  useEffect(() => {
    const savedFrom = clean(localStorage.getItem("from"))
    const savedTo = clean(localStorage.getItem("to"))
    if (savedFrom) setFromValue(savedFrom);
    if (savedTo) setToValue(savedTo);
  }, []);


  return (
    <div data-aos={aos} className='px-2  sm:px-3  lg:px-[1rem] xl:px-[4rem] 2xl:px-[7rem] py-3 lg:py-5 lg:mt-5 z-[2] relative'>
      <div className={`bg-white  pt-4 pb-10 md:px-3 ${isShaking ? 'smooth-shake' : ''} flex relative flex-col md:shadow-lg  md:rounded-[24px] max-w-[80rem] mx-auto|`}>
        {/* Fields Container */}
        <div className='flex flex-col min-h-[80px] lg:flex-row items-stretch justify-between border border-[#D8D8D8] rounded-[16px] '>
          {/* FROM */}
          <div onClick={() => setIsFromEditing(true)} className='flex p-3 border-b  lg:border-b-0  items-center gap-2 flex-1'>
            <BusFrontIcon />
            <div className='flex flex-col cursor-pointer  gap-1 w-full'>
              <span className='text-[0.8rem] text-gray-500'>From</span>
              {
                isFromEditing ? (
                  <input
                    type='text'
                    autoFocus
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' '))}
                    onBlur={() => setIsFromEditing(false)}
                    className='border-none placeholder:text-black placeholder:font-[600] outline-none text-black text-sm w-full'
                    placeholder='Enter city name'
                  />
                ) : (
                  <span className='text-black text-sm font-semibold'>
                    {fromValue || ' '}
                  </span>
                )
              }
            </div>
          </div>
          {/* SWAP ICON */}
          <div
            onClick={handleSwap}
            className='hidden lg:flex absolute top-[3.3rem] left-[34%] -translate-x-1/2 -translate-y-1/2 bg-[#4A4A4A]  rounded-full p-2 cursor-pointer hover:rotate-180 transition-transform duration-300 z-20'
          >
            <FaArrowRightArrowLeft className='text-white text-lg' />
          </div>

          {/* TO */}
          <div onClick={() => setIsToEditing(true)} className='flex  border-b lg:border-b-0 lg:border-l items-center p-3 gap-2 flex-1'>
            <BusIcon className='lg:ml-3' />
            <div className='flex cursor-pointer flex-col gap-1 w-full'>
              <span className='text-[0.8rem] text-gray-500'>To</span>
              {
                isToEditing ? (
                  <input
                    type='text'
                    autoFocus
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' '))}
                    onBlur={() => setIsToEditing(false)}
                    className='border-none outline-none text-sm placeholder:text-black placeholder:font-[600] text-black  w-full'
                    placeholder='Enter city name'
                  />
                ) : (
                  <span className='text-black text-sm font-semibold'>
                    {toValue || ' '}
                  </span>
                )
              }
            </div>
          </div>

          {/* DATE + BUTTONS */}
          <div className='flex  lg:border-l overflow-x-auto scrollbar-hidden  relative flex-1'>
            <div className='flex p-3 items-center gap-2 flex-1'>
              <Calendar1Icon />
              <div className='flex flex-col gap-1 w-full'>
                <span className='text-sm truncate text-gray-500'>Date of journey</span>
                {/* <input
                  type='date'
                  value={date || getToday()}
                  min={getToday()}
                  onChange={(e)=>setdate(e.target.value)}
                  className='border-none outline-none text-black text-sm w-full'
                /> */}
                <DatePicker
                  selected={new Date(date)}
                  onChange={(newDate) => setdate(newDate)}
                  dateFormat="dd MMM, yyyy"
                  minDate={new Date()}
                  className="border-none outline-none text-black text-sm w-full cursor-pointer font-semibold"
                  calendarClassName="rounded-2xl shadow-lg border p-2"
                  popperPlacement="bottom-start"
                  portalId='root-portal'
                  withPortal 
                />
              </div>
            </div>
            <div className=' px-3 flex  lg:hidden xl:flex py-2 items-center gap-4'>
              <button className='px-3 py-2 rounded-full bg-[#FED9D5] font-[600] text-sm text-black'>
                Today
              </button>
              <button className='px-3 py-2 rounded-full bg-[#FED9D5] font-[600] text-sm text-black'>
                Tomorrow
              </button>
            </div>
          </div>
        </div>
        {/* Search Button */}
        <button onClick={handleOnSubmit} className={`w-full md:w-auto absolute bottom-0 left-1/2  translate-x-[-50%] translate-y-[50%] md:self-center md:px-[4.5rem] z-10 mt-5 py-3 ${loading ? "bg-gray-400" : "bg-[#D63941]"} text-white rounded-full flex justify-center items-center gap-2 text-sm font-semibold`}>
          {loading ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : <Search />}   Search buses
        </button>

      </div>
    </div>


  )
}
export default SearchInput

