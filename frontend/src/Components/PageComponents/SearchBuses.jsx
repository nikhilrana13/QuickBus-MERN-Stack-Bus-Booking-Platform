import React, { Fragment, useState, useEffect, useRef } from 'react'
import Navbar from './Navbar'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AirVentIcon, BottleWineIcon, BusFrontIcon, BusIcon, Calendar1Icon, Search, Wifi, Wind } from 'lucide-react'
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { PiSeatFill } from "react-icons/pi";
import { MdAirlineSeatFlat } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { BiBlanket } from "react-icons/bi";
import { FaBottleDroplet } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import { PiPlugCharging } from "react-icons/pi";
import { GiCctvCamera } from "react-icons/gi";
import { FaWifi } from "react-icons/fa";
import BusInfoCard from './BusInfoCard';
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Footer from './Footer';
import logo from "../../assets/quickbuslogored.png"
import axios from 'axios';
import BusInfoCardsShimmer from './BusInfoCardsShimmer';
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious,
}
    from "../ui/pagination"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
};

const SearchBuses = () => {
    // Sticky header state
    const [isSticky, setIsSticky] = useState(false);
    const [stickyExited, setStickyExited] = useState(true);
    const [showFiltersMobile, setShowFiltersMobile] = useState(false)
    // FROM field states
    const [isFromEditing, setIsFromEditing] = useState(false);
    const [fromValue, setFromValue] = useState('');
    // TO field states
    const [isToEditing, setIsToEditing] = useState(false);
    const [toValue, setToValue] = useState('');
    // filters states
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [selectedAir, setSelectedAir] = useState([])
    const [selectedLayout, setSelectedLayout] = useState([])
    // Bus data and loading states
    const [buses, Setbuses] = useState([])
    const [initialLoad, setInitialLoad] = useState(true);
    const [loading, Setloading] = useState(false)
    const [searchParams] = useSearchParams()
    const [page, SetPage] = useState(1)
    const [date, setdate] = useState(new Date())
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
    const navigate = useNavigate()
    const [paramsReady, setParamsReady] = useState(false);

    // Swap FROM and TO values
    const handleSwap = () => {
        setFromValue(toValue);
        setToValue(fromValue);
    };
    // Handle input changes for FROM, TO, and DATE fields
    const handleInputChange = (type, value) => {
        if (type === "from") setFromValue(value);
        if (type === "to") setToValue(value);
        if (type === "date") setdate(value);
    };
    // Handle selection toggling for amenities
    const handleSelectedAmenities = (e) => {
        const value = e.target.value
        setSelectedAmenities((prev) => {
            if (prev.includes(value)) {
                return prev.filter((a) => a !== value)  // Remove if already selected
            } else {
                return [...prev, value] // Add if not selected
            }
        })
    }
    // Sticky header scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const offset = 200;
            if (window.scrollY > offset) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // Scroll window to top whenever filters or page changes
    useEffect(() => {
        // Only scroll if buses exist (avoid scrolling on initial load)
        if (!initialLoad) {
            const stickyOffset = 100; // approximate sticky header height
            window.scrollTo({ top: stickyOffset, behavior: 'smooth' });
        }
    }, [selectedCategory, selectedAmenities, selectedAir, selectedLayout, page, buses]);

    // handle date change (URL update)
    const handleDateChange = (newDate) => {
        setdate(newDate);
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("date", newDate.toISOString().split("T")[0]);
        navigate(`?${currentParams.toString()}`, { replace: true });
    };
    // Initialize state from URL params on first render
    useEffect(() => {
        const from = searchParams.get('from')
        const to = searchParams.get('to')
        const journeyDate = searchParams.get('date')
        // update state only if params exist
        if (from) setFromValue(from);
        if (to) setToValue(to);
        if (journeyDate) {
            setdate(new Date(journeyDate))
        } else {
            setdate(new Date())
        }
        setParamsReady(true)
    }, [])
    //  // API call on dependency changes
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                Setloading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bus/buses`, {
                    params: {
                        fromCityName: fromValue,
                        toCityName: toValue,
                        date: date,
                        amenities: selectedAmenities.join(","),
                        airConditioning: selectedAir.join(","),
                        category: selectedCategory.join(","),
                        layout: selectedLayout.join(","),
                        page: page
                    },
                    withCredentials: true
                });
                if (response?.data) {
                    Setbuses(response?.data?.data.buses);
                    setPagination(response?.data?.data?.pagination);
                }
            } catch (error) {
                console.log("failed to fetch buses", error);
            } finally {
                Setloading(false);
                setInitialLoad(false)
            }
        };

        // call API only if from/to have value
        if (paramsReady && fromValue && toValue && date) {
            fetchBuses();
        }
    }, [paramsReady, selectedAmenities, selectedAir, selectedCategory, selectedLayout, page]);

    //  // Handle search button click
    const handleSearch = async () => {
        // reset pagination when user does a new search
        SetPage(1);
        if (!fromValue || !toValue) return;
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("from", fromValue);
        currentParams.set("to", toValue);
        currentParams.set("date", date.toISOString().split("T")[0]);
        navigate(`?${currentParams.toString()}`, { replace: true });

        try {
            Setloading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bus/buses`, {
                params: {
                    fromCityName: fromValue,
                    toCityName: toValue,
                    date: date,
                    page: 1,
                    amenities: selectedAmenities.join(","),
                    airConditioning: selectedAir.join(","),
                    category: selectedCategory.join(","),
                    layout: selectedLayout.join(",")
                },
                withCredentials: true
            });

            if (response?.data) {
                Setbuses(response?.data?.data.buses);
                setPagination(response?.data?.data?.pagination);
            }
        } catch (error) {
            console.log("failed to fetch buses", error);
        } finally {
            Setloading(false);
            setInitialLoad(false)
        }
    }

    // console.log("selected amentities",selectedAmenities)
    // console.log("selected ac",selectedAir)
    // console.log("selected category",selectedCategory)
    return (
        <div>
            <nav className="hidden lg:block">
                <Navbar />
            </nav>
            {/* main content */}
            <div className="">
                {/* search header */}
                <div className='px-1 py-3 sm:px[2rem] xl:px-[5rem] 2xl:px-[10rem] flex flex-col gap-5'>
                    {/* from and to */}
                    <div className='flex  py-1 items-center gap-4'>
                        <NavLink to="/" className=" p-3 rounded-full hover:bg-[#EFEFEF]">
                            <FaArrowLeft className='text-black' />
                        </NavLink>
                        <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                                <span className='font-[700]'>{searchParams.get("from") || "NA"}</span>
                                <FaArrowRight className='text-[#CACACA]' />
                                <span className='font-[700]'>{searchParams.get("to") || "NA"}</span>
                            </div>
                            <span className='text-gray-600 text-sm'>{initialLoad || loading ? '...' : `${buses?.length || 0} buses`}</span>
                        </div>
                    </div>
                    {/* Sticky + Normal Inputs */}
                    <div className={`${isSticky ? 'fixed top-0 left-0 w-full px-[10rem] xl:px-[15rem] z-50 shadow-md' : 'relative'} px-4 py-3 bg-white transition-all duration-300 hidden lg:flex items-center gap-9`}>
                        {/* Sticky Input */}
                        <AnimatePresence onExitComplete={() => setStickyExited(true)}>
                            {isSticky && (
                                <>
                                    {stickyExited && setStickyExited(false)}
                                    <motion.img
                                        src={logo}
                                        alt="logo"
                                        className='w-16'
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -100, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
                                    />

                                    <motion.div
                                        className='flex w-full flex-col relative lg:flex-row items-stretch justify-between border border-[#D8D8D8] rounded-[16px] overflow-hidden'
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
                                    >
                                        {/* FROM */}
                                        <div onClick={() => setIsFromEditing(true)} className='flex p-2 border-b lg:border-b-0 items-center gap-2 flex-1'>
                                            <BusFrontIcon />
                                            <div className='flex h-15 flex-col cursor-pointer gap-1 w-full'>
                                                <span className='text-[0.8rem] text-gray-500'>From</span>
                                                {isFromEditing ? (
                                                    <input
                                                        type='text'
                                                        autoFocus
                                                        value={fromValue}
                                                        onChange={(e) => handleInputChange("from", e.target.value)}
                                                        className='border-none placeholder:text-black placeholder:font-[600] outline-none text-black text-sm w-full'
                                                        placeholder='Enter city name'
                                                    />
                                                ) : (
                                                    <span className='text-black text-sm font-semibold'>{fromValue || ' '}</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* SWAP ICON */}
                                        <div
                                            onClick={handleSwap}
                                            className='hidden lg:flex absolute top-[1.9rem] left-[34%] -translate-x-1/2 -translate-y-1/2 bg-[#4A4A4A] rounded-full p-2 cursor-pointer hover:rotate-180 transition-transform duration-300'
                                        >
                                            <FaArrowRightArrowLeft className='text-white text-lg' />
                                        </div>
                                        {/* TO */}
                                        <div onClick={() => setIsToEditing(true)} className='flex border-b lg:border-b-0 lg:border-l items-center p-2 gap-2 flex-1'>
                                            <BusIcon className='lg:ml-6' />
                                            <div className='flex h-15 cursor-pointer flex-col gap-1 w-full'>
                                                <span className='text-[0.8rem] text-gray-500'>To</span>
                                                {isToEditing ? (
                                                    <input
                                                        type='text'
                                                        autoFocus
                                                        value={toValue}
                                                        onChange={(e) => handleInputChange("to", e.target.value)}
                                                        className='border-none outline-none text-sm placeholder:text-black placeholder:font-[600] text-black w-full'
                                                        placeholder='Enter city name'
                                                    />
                                                ) : (
                                                    <span className='text-black text-sm font-semibold'>{toValue || ' '}</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* DATE */}
                                        <div className='flex lg:border-l overflow-x-auto flex-1'>
                                            <div className='flex p-2 items-center gap-2 flex-1'>
                                                <Calendar1Icon />
                                                <div className='flex flex-col gap-1 w-full'>
                                                    <span className='text-sm text-gray-500'>Date of journey</span>
                                                    <DatePicker
                                                        selected={date}
                                                        onChange={handleDateChange}
                                                        dateFormat="dd MMM, yyyy"
                                                        minDate={new Date()}
                                                        className="border-none outline-none text-black text-sm w-full cursor-pointer font-semibold"
                                                        calendarClassName="rounded-2xl shadow-lg border p-2"
                                                        popperPlacement="bottom-start"
                                                        withPortal
                                                    />


                                                </div>
                                                <button onClick={handleSearch} className='px-4 py-3 bg-[#D63941] text-white border rounded-[24px] focus:outline-none focus:ring-2 focus:ring-[#FBE9EA] focus:ring-offset-2 
             hover:shadow-lg transition'><Search /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                        {/* Normal Input */}
                        {!isSticky && stickyExited && (
                            <div className='flex w-full flex-col relative lg:flex-row items-stretch justify-between border border-[#D8D8D8] rounded-[16px] overflow-hidden'>
                                {/* FROM */}
                                <div onClick={() => setIsFromEditing(true)} className='flex p-2 border-b lg:border-b-0 items-center gap-2 flex-1'>
                                    <BusFrontIcon />
                                    <div className='flex h-15 flex-col cursor-pointer gap-1 w-full'>
                                        <span className='text-[0.8rem] text-gray-500'>From</span>
                                        {isFromEditing ? (
                                            <input
                                                type='text'
                                                autoFocus
                                                value={fromValue}
                                                onChange={(e) => handleInputChange("from", e.target.value)}

                                                className='border-none placeholder:text-black placeholder:font-[600] outline-none text-black text-sm w-full'
                                                placeholder='Enter city name'
                                            />
                                        ) : (
                                            <span className='text-black text-sm font-semibold'>{fromValue || ' '}</span>
                                        )}
                                    </div>
                                </div>
                                {/* SWAP ICON */}
                                <div
                                    onClick={handleSwap}
                                    className='hidden lg:flex absolute top-[1.9rem] left-[34%] -translate-x-1/2 -translate-y-1/2 bg-[#4A4A4A] rounded-full p-2 cursor-pointer hover:rotate-180 transition-transform duration-300'
                                >
                                    <FaArrowRightArrowLeft className='text-white text-lg' />
                                </div>
                                {/* TO */}
                                <div onClick={() => setIsToEditing(true)} className='flex border-b lg:border-b-0 lg:border-l items-center p-2 gap-2 flex-1'>
                                    <BusIcon className='lg:ml-6' />
                                    <div className='flex h-15 cursor-pointer flex-col gap-1 w-full'>
                                        <span className='text-[0.8rem] text-gray-500'>To</span>
                                        {isToEditing ? (
                                            <input
                                                type='text'
                                                autoFocus
                                                value={toValue}
                                                onChange={(e) => handleInputChange("to", e.target.value)}

                                                className='border-none outline-none text-sm placeholder:text-black placeholder:font-[600] text-black w-full'
                                                placeholder='Enter city name'
                                            />
                                        ) : (
                                            <span className='text-black text-sm font-semibold'>{toValue || ' '}</span>
                                        )}
                                    </div>
                                </div>
                                {/* DATE */}
                                <div className='flex lg:border-l overflow-x-auto flex-1'>
                                    <div className='flex border p-2 items-center gap-2 flex-1'>
                                        <Calendar1Icon />
                                        <div className='flex flex-col gap-1 w-full'>
                                            <span className='text-sm text-gray-500'>Date of journey</span>
                                            <DatePicker
                                                selected={date}
                                                onChange={handleDateChange}
                                                dateFormat="dd MMM, yyyy"
                                                minDate={new Date()}
                                                className="border-none outline-none text-black text-sm w-full cursor-pointer font-semibold"
                                                calendarClassName="rounded-2xl shadow-lg border p-2"
                                                popperPlacement="bottom-start"
                                                withPortal
                                            />
                                        </div>
                                        <button onClick={handleSearch} className='px-4 py-3 bg-[#D63941] text-white border rounded-[24px] focus:outline-none focus:ring-2 focus:ring-[#FBE9EA] focus:ring-offset-2 
             hover:shadow-lg transition'><Search /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* show buses */}
                <div className='bg-[#F2F2F8] border-b px-1 py-5 sm:px[2rem] xl:px-[5rem] 2xl:px-[10rem] flex flex-col w-full lg:flex-row h-screen gap-3'>
                    {/* left side filters */}
                    <div className='w-full custom-card scrollbar-hidden rounded-md flex flex-col bg-white   lg:w-[25%]'>
                        <div className='flex justify-between items-center bg-white p-4 rounded-md'>
                            <h4 className='font-[700] text-[1.5rem]'>Filter buses</h4>
                            <button className='lg:hidden' onClick={() => setShowFiltersMobile(!showFiltersMobile)}>
                                <svg className={`w-5 h-5 transition-transform duration-300 ${showFiltersMobile ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden
                         ${showFiltersMobile ? 'h-auto max-h-[70vh] overflow-y-auto' : 'max-h-0 lg:max-h-full'} 
                           w-full lg:w-full overflow-y-auto relative lg:relative scrollbar-hidden bg-white rounded-md border`}>
                            {/* Air conditioning */}
                            <div className='border-b p-4 flex flex-col   flex-wrap'>
                                <h4 className='font-[700] text-[1rem]'>Air conditioning</h4>
                                <div className='flex items-center mt-3 gap-3'>
                                    <span onClick={() => setSelectedAir((prev) => prev.includes("AC") ? prev.filter(a => a !== "AC") : [...prev, "AC"])} className={`flex  items-center cursor-pointer border text-sm rounded-md gap-2 py-1 ${selectedAir.includes("AC") ? "bg-[#D63941] text-white" : "text-black"} px-5`}><TbAirConditioning /> AC</span>

                                    <span onClick={() => setSelectedAir((prev) => prev.includes("Non-Ac") ? prev.filter(a => a !== "Non-Ac") : [...prev, "Non-Ac"])} className={`flex   items-center cursor-pointer border text-sm rounded-md  ${selectedAir.includes("Non-Ac") ? "bg-[#D63941] text-white" : "text-black"} py-1 gap-2 px-5`}><TbAirConditioningDisabled /> Non-Ac</span>
                                </div>
                            </div>
                            {/* category */}
                            <div className='border-b p-4 flex flex-col flex-wrap'>
                                <h4 className='font-[700] text-[1rem]'>Category</h4>
                                <div className='flex items-center mt-3 gap-3'>
                                    <span onClick={() => setSelectedCategory((prev => prev.includes("Seater") ? prev.filter(c => c !== "Seater") : [...prev, "Seater"]))} className={`flex  items-center cursor-pointer border text-sm rounded-md gap-2 ${selectedCategory.includes("Seater") ? "bg-[#D63941] text-white" : "text-black"} py-1 gap-2 px-5`}><PiSeatFill /> SEATER</span>

                                    <span onClick={() => setSelectedCategory((prev => prev.includes("Sleeper") ? prev.filter(c => c !== "Sleeper") : [...prev, "Sleeper"]))} className={`flex  items-center cursor-pointer border text-sm rounded-md ${selectedCategory.includes("Sleeper") ? "bg-[#D63941] text-white" : "text-black"} py-1 gap-2 px-5`}><MdAirlineSeatFlat /> SLEEPER</span>
                                </div>
                            </div>
                            {/* layout */}
                            <div className='border-b p-4 flex flex-col flex-wrap'>
                                <h4 className='font-[700] text-[1rem]'>Layout</h4>
                                <div className='flex items-center mt-3 gap-3'>
                                    <span onClick={() => setSelectedLayout((prev => prev.includes("2+2") ? prev.filter(c => c !== "2+2") : [...prev, "2+2"]))} className={`flex  items-center cursor-pointer border text-sm rounded-md gap-2 ${selectedLayout.includes("2+2") ? "bg-[#D63941] text-white" : "text-black"}  py-1 px-5`}>2+2</span>
                                    <span onClick={() => setSelectedLayout((prev => prev.includes("2+3") ? prev.filter(c => c !== "2+3") : [...prev, "2+3"]))} className={`flex   items-center cursor-pointer border text-sm rounded-md ${selectedLayout.includes("2+3") ? "bg-[#D63941] text-white" : "text-black"}  py-1 gap-2 px-5`}>2+3</span>
                                </div>
                            </div>
                            {/* amenities */}
                            <div className=' p-4 flex flex-col flex-wrap'>
                                <h4 className='font-[700] text-[1rem]'>Amenities</h4>
                                <div className='flex flex-col  mt-3 gap-3'>
                                    {[
                                        [<FaBottleDroplet />, 'Water Bottle'],
                                        [<BiBlanket />, 'Blanket'],
                                        [<IoFastFoodOutline />, 'Snacks'],
                                        [<PiPlugCharging />, 'Charging Point'],
                                        [<GiCctvCamera />, 'CCTV'],
                                        [<FaWifi />, 'WIFI'],
                                    ].map(([icon, label], i) => (
                                        <div key={i} className='flex border-b  items-center py-4 justify-between'>
                                            <span className='flex items-center gap-3'>{icon} {label}</span>
                                            <input
                                                type="checkbox"
                                                value={label}
                                                onChange={handleSelectedAmenities}
                                                checked={selectedAmenities.includes(label)}
                                                className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-md cursor-pointer checked:bg-[#D63941] checked:border-[#D63941] relative 
                                              after:content-['✔'] after:text-white after:absolute after:top-[1px] after:left-[4px] after:text-sm after:hidden checked:after:block"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* buses info cards */}
                    <div className='w-full lg:w-[75%] overflow-y-auto bus-list'>
                        <div className='bg-white p-4 rounded-[16px]'>
                            <h4 className='font-[700]'>
                                {initialLoad || loading ? "..." : `${buses?.length || 0}`} buses found
                            </h4>

                        </div>
                        <div className='bg-[#FEDAC8] rounded-md mt-2 p-4'>
                            <h4 className='font-[700] text-center'>4,400 + <span className='font-[400] text-sm'> bus operators on quickbus</span></h4>
                        </div>
                        {/*cards  */}
                        {
                            loading ? (
                                <div className='flex flex-col mt-5 gap-5'>
                                    {[...Array(10)].map((_, i) => {
                                        return (
                                            <BusInfoCardsShimmer key={i} />
                                        )
                                    })}
                                </div>
                            ) : buses?.length > 0 ? (
                                <>
                                    <div className='flex flex-col mt-5 gap-5' >
                                        <AnimatePresence>
                                            {buses?.map((bus, i) => {
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial="hidden"
                                                        whileInView="visible"
                                                        exit="hidden"
                                                        viewport={{ once: false, amount: 0.2 }}
                                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                                        variants={cardVariants}

                                                    >
                                                        <BusInfoCard key={bus?._id} bus={bus} query={{ fromValue, toValue }} />
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                    {/* pagination */}
                                    {
                                        pagination?.totalPages > 1 && (
                                            <div className='p-5 mt-2'>
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem className="cursor-pointer">
                                                            <PaginationPrevious
                                                                className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                onClick={() => { if (page === 1) return; SetPage(prev => prev - 1) }}
                                                            />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink>
                                                                {pagination?.currentPage} of {pagination?.totalPages}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                        <PaginationItem className="cursor-pointer">
                                                            <PaginationNext
                                                                className={`${page === pagination?.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                onClick={() => { if (page === pagination?.totalPages) return; SetPage(prev => prev + 1) }}
                                                            />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        )
                                    }
                                </>

                            ) : (
                                !initialLoad && (
                                    <div className='flex mx-auto justify-center items-center mt-10'>
                                        <p className='text-gray-500 text-[0.8rem]'>Sorry! No buses found for {fromValue} To {toValue}</p>
                                    </div>
                                ))
                        }

                    </div>
                </div>
            </div>
            {/* footer */}
            <Footer />
        </div >
    )
}

export default SearchBuses


