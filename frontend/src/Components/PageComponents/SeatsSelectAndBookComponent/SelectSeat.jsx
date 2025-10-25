import React, { Fragment } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Armchair, ArrowDownIcon, ArrowRight, Smartphone } from "lucide-react";
import { GiNextButton, GiSteeringWheel } from "react-icons/gi";
import { FaBottleDroplet } from "react-icons/fa6";
import { useRef } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table.jsx"
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaPlug, FaWifi, FaCamera, FaToilet, } from "react-icons/fa6";
import { MdOutlineFastfood, } from "react-icons/md";
import { GiPillow, GiBed, } from "react-icons/gi";
import { LuLampWallUp } from "react-icons/lu";
import { BiBlanket } from "react-icons/bi";
const SelectSeat = ({ bus, Step,selectedSeats,setSelectedSeats }) => {
    const [activeTab, setActiveTab] = useState("Bus Route");
    const [isExpanded, setIsExpanded] = useState(false);
    const routeRef = useRef(null);
    const boardingRef = useRef(null);
    const droppingRef = useRef(null);
    const amenitiesRef = useRef(null);
    const [showSeatPricePopup,setSeatPricePopup] = useState(false)

    // console.log("bus details", bus)
    // console.log("selected buses",selectedSeats)
    // Scroll to section smoothly
    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    // Scroll spy - detect which section is in view
    useEffect(() => {
        const sections = [
            { id: "Bus Route", ref: routeRef },
            { id: "Boarding point", ref: boardingRef },
            { id: "Dropping point", ref: droppingRef },
            { id: "Amenities", ref: amenitiesRef },
        ];
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const visible = sections.find((s) => s.ref.current === entry.target);
                        if (visible) setActiveTab(visible.id);
                    }
                });
            },
            { threshold: 0.4 } // Adjust sensitivity
        );
        sections.forEach((section) => {
            if (section.ref.current) observer.observe(section.ref.current);
        });
        return () => observer.disconnect();
    }, []);

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return
        if (selectedSeats.some(s => s._id === seat._id)) {
            // if already selected then deselect
            setSelectedSeats(prev => prev.filter(s => s._id !== seat._id));
        } else {
            // add new seat
            setSelectedSeats(prev => [...prev, seat]);
        }
    }
    const amenityIcons = {
        "Water Bottle": <FaBottleDroplet />,
        "Blanket": <BiBlanket />,
        "Snacks": <MdOutlineFastfood />,
        "Charging Point": <FaPlug />,
        "Reading Light": <LuLampWallUp />,
        "Pillow": <GiPillow />,
        "CCTV": <FaCamera />,
        "Bedsheet": <GiBed />,
        "WiFi": <FaWifi />,
        "Toilet": <FaToilet />,
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100dvh-8.5rem)] w-full  mx-auto my-[1rem]  overflow-hidden   ">
            {/* seat layout and info */}
            <div className="overflow-y-auto pb-4 h-full scroll-smooth items-center  scrollbar-hide w-full flex flex-col">
                {/* seat layout  */}
                <div className="flex border p-3 rounded-[16px] w-full max-w-[200px]  bg-white flex-col">
                    <div className="flex justify-end">
                        <GiSteeringWheel className="text-3xl text-gray-500" />
                    </div>
                    <div className="flex mt-3 justify-between">
                        {/* left seat */}
                        <div className="flex flex-col  gap-2">
                            {Array.from({ length: 10 }).map((_, rowIndex) => {
                                const leftSeats = bus?.seats?.slice(rowIndex * 2, rowIndex * 2 + 2);
                                return (
                                    <div key={`left-${rowIndex}`} className="flex gap-2 justify-center">
                                        {leftSeats.map((seat) => (
                                            <Armchair
                                                key={seat._id}
                                                size={25}
                                                onClick={() => handleSeatClick(seat)}
                                                className={`cursor-pointer transition-all duration-200 
                                               ${seat.isBooked ? "bg-[#EBEBEB] text-gray-400 rounded-md cursor-not-allowed"
                                                        : selectedSeats.some(s => s._id === seat._id) ? "bg-green-500 rounded-md text-white"
                                                            : "text-green-700"} hover:scale-110`}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                        {/* right seat */}
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 10 }).map((_, rowIndex) => {
                                const rightSeats = bus?.seats?.slice(20 + rowIndex * 2, 20 + rowIndex * 2 + 2);
                                return (
                                    <div key={`right-${rowIndex}`} className="flex gap-2 justify-center">
                                        {rightSeats.map((seat) => (
                                            <Armchair
                                                key={seat._id}
                                                size={25}
                                                onClick={() => handleSeatClick(seat)}
                                                className={`cursor-pointer transition-all duration-200 
                                               ${seat.isBooked ? "bg-[#EBEBEB] text-gray-400 rounded-md cursor-not-allowed"
                                                        :  selectedSeats.some(s => s._id === seat._id)  ? "bg-green-500 rounded-md text-white"
                                                            : "text-green-700"} hover:scale-110`}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* back seats */}
                    <div className="flex gap-3 mt-2">
                        {bus?.seats?.slice(-5).map((seat) => (
                            <Armchair
                                key={seat._id}
                                size={25}
                                onClick={() => handleSeatClick(seat)}
                                className={`cursor-pointer transition-all duration-200 
                               ${seat.isBooked ? "bg-gray-300 cursor-not-allowed"
                                        :  selectedSeats.some(s => s._id === seat._id)  ? "bg-green-500 rounded-md text-white"
                                            : "text-green-700"} hover:scale-110`}
                            />
                        ))}
                    </div>
                </div>
                {/* seat info */}
                <div className="flex flex-col border p-3 rounded-[16px] mt-7 w-full max-w-[500px]">
                    <h3 className="text-center font-[700]">Know your seat types</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Seat types</TableHead>
                                <TableHead>Seater</TableHead>
                                <TableHead className="">Sleeper</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableCell className="">
                                Available
                            </TableCell>
                            <TableCell>
                                <Armchair className="cursor-pointer" size={25} color="green" />
                            </TableCell>
                            <TableCell>
                                {/* <Smartphone className="cursor-pointer" size={25} color="green" /> */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="70"
                                    viewBox="0 0 128 256"
                                    fill="none"
                                    stroke="green"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="16" y="8" width="96" height="240" rx="20" ry="20" />
                                    <rect x="48" y="220" width="32" height="12" rx="6" fill="lightgreen" />
                                </svg>
                            </TableCell>
                        </TableBody>
                        <TableBody>
                            <TableCell className="">
                                Selected by you
                            </TableCell>
                            <TableCell>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="#6ECB8D"          // light green fill
                                    stroke="#047857"        // dark green outline
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="cursor-pointer"
                                >
                                    <rect x="4" y="8" width="16" height="10" rx="2" ry="2" />
                                    <rect x="6" y="5" width="12" height="6" rx="2" ry="2" />
                                </svg>
                            </TableCell>
                            <TableCell>
                                {/* <Smartphone className="cursor-pointer" size={25} color="green" /> */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="70"
                                    viewBox="0 0 128 256"
                                    fill="#6ECB8D"
                                    stroke="green"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="16" y="8" width="96" height="240" rx="20" ry="20" />
                                    <rect x="48" y="220" width="32" height="12" rx="6" fill="lightgreen" />
                                </svg>
                            </TableCell>
                        </TableBody>
                        <TableBody>
                            <TableCell className="">
                                Already Booked
                            </TableCell>
                            <TableCell>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="#EBEBEB"
                                    stroke="#EBEBEB"        // dark green outline
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="cursor-pointer"
                                >
                                    <rect x="4" y="8" width="16" height="10" rx="2" ry="2" />
                                    <rect x="6" y="5" width="12" height="6" rx="2" ry="2" />
                                </svg>

                            </TableCell>
                            <TableCell>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="70"
                                    viewBox="0 0 128 256"
                                    fill="#EBEBEB"
                                    stroke="EBEBEB"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="16" y="8" width="96" height="240" rx="20" ry="20" />
                                    <rect x="48" y="220" width="32" height="12" rx="6" fill="#EBEBEB" />
                                </svg>

                            </TableCell>
                        </TableBody>
                        <TableBody>
                            <TableCell className="">
                                Available
                            </TableCell>
                            <TableCell>
                                <Armchair className="cursor-pointer" size={25} color="green" />
                            </TableCell>
                            <TableCell>
                                <Smartphone className="cursor-pointer" size={25} color="green" />
                            </TableCell>
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* bus info */}
            <motion.div layout
                transition={{ duration: 0.4, ease: "easeInOut" }} className={`w-full  overflow-y-auto scroll-smooth scrollbar-hidden  ${isExpanded ? "fixed top-0 left-0 bottom-0 right-0 z-[100] p-4 " : "h-24 md:h-full"}  bg-white rounded-[16px]`}>
                {/* Collapsed bottom section (always visible on mobile) */}
                {/* toggle open and close*/}
                <div onClick={() => setIsExpanded(!isExpanded)} className={`flex  md:hidden ${isExpanded ? "px-7" : "justify-center"}  p-1`}>
                    {
                        isExpanded ? (
                            <MdKeyboardArrowDown className="text-3xl" />
                        ) : (
                            <span className="w-[25px] h-[4px] rounded-[16px] bg-gray-500"></span>
                        )
                    }
                </div>
                {isExpanded && (
                    <motion.div
                        key="expanded-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="p-2 "
                    >
                        <h4 className="font-[700]">{bus?.companyName || "NA"}</h4>
                        <div className="flex mt-4 text-sm flex-col">
                            <span className="text-gray-500"> {bus?.boardingPoints?.[0]?.departureTime || "NA"} - {bus?.droppingPoints?.[bus.droppingPoints.length - 1]?.time || "NA"}
                                &nbsp;|&nbsp;
                                {bus?.boardingPoints?.[0]?.date
                                    ? new Date(bus.boardingPoints[0].date).toLocaleDateString("en-US", {
                                        weekday: "short", // Wed
                                        day: "2-digit",   // 15
                                        month: "short"    // Oct
                                    })
                                    : "NA"}</span>
                            <span className="text-gray-500">{bus.busname || "NA"}</span>
                        </div>
                        {/* bus images */}
                        {
                            bus?.images && bus?.images.length > 0 && (
                                <div className="flex gap-2 mt-4 overflow-y-auto scrollbar-hidden">
                                    <motion.div
                                        className="flex gap-2 w-max"
                                        drag="x"
                                        dragConstraints={{ left: -1000, right: 0 }} // adjust dynamically if needed
                                        whileTap={{ cursor: "grabbing" }}
                                    >
                                        {bus?.images.map((imgSrc, index) => (
                                            <img
                                                key={index}
                                                className="w-[250px] h-[150px] object-cover rounded-lg flex-shrink-0"
                                                src={imgSrc}
                                                alt={`bus-${index}`}
                                            />
                                        ))}
                                    </motion.div>
                                </div>
                            )
                        }
                        {/* Sticky Tabs */}
                        <div className="border-b overflow-y-auto scrollbar-hidden scroll-smooth pt-4 justify-between flex gap-3 sticky top-0 bg-white z-[110] ">
                            {["Bus Route", "Boarding point", "Dropping point", "Amenities"].map(
                                (tab) => (
                                    <div
                                        key={tab}
                                        onClick={() => scrollToSection(
                                            tab === "Bus Route"
                                                ? routeRef
                                                : tab === "Boarding point"
                                                    ? boardingRef
                                                    : tab === "Dropping point"
                                                        ? droppingRef
                                                        : amenitiesRef
                                        )}
                                        className="relative whitespace-nowrap cursor-pointer font-[700] text-sm p-3 hover:bg-gray-100 rounded-md"
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="underline"
                                                className="absolute left-0 right-0 -bottom-[2px] h-[3px] bg-[#D63941] rounded-full"
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                        {/* bus routes */}
                        {
                            bus?.busRoutes && bus.busRoutes.length > 0 && (
                                <div ref={routeRef} className="border-y  flex flex-col overflow-x-auto scrollbar-hide p-1 gap-3">
                                    <h4 className="text-[1.4rem] font-[700]">Bus Route</h4>
                                    <div className="flex items-center gap-3">
                                        {bus?.busRoutes?.map((route, index) => {
                                            return (
                                                <Fragment key={route._id}>
                                                    <span
                                                        className={`text-sm ${index === 0 || index === bus?.busRoutes.length - 1
                                                            ? "font-[700] text-black"
                                                            : "text-gray-700"
                                                            }`}
                                                    >
                                                        {route?.city}
                                                    </span>

                                                    {index < bus?.busRoutes?.length - 1 && (
                                                        <span className="text-gray-500 text-sm">
                                                            <GiNextButton />
                                                        </span>
                                                    )}

                                                </Fragment>
                                            )
                                        })
                                        }
                                    </div>

                                </div>
                            )
                        }
                        {/* boarding point */}
                        <div ref={boardingRef} className="border-y flex flex-col gap-4 p-4">
                            <div className="flex flex-col">
                                <h4 className="text-[1.4rem] font-[700]">Boarding point</h4>
                                <span className="text-sm text-gray-500">{bus?.source || "NA"}</span>
                            </div>
                            {/* Timeline list */}
                            <div className="flex flex-col relative ">
                                {/* Vertical line */}
                                <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                                {bus?.boardingPoints?.map((p, index) => (
                                    <div key={index} className="flex items-start gap-4 relative mb-5">
                                        {/* Time & date */}
                                        <div className="flex flex-col items-end min-w-[60px]">
                                            <span className="font-semibold text-[0.95rem]">{p?.departureTime || "NA"}</span>
                                            <span className="text-gray-500 text-[0.8rem]">{new Date(p.date).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short"
                                            }) || "NA"}</span>
                                        </div>

                                        {/* Dot indicator */}
                                        <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>

                                        {/* Point details */}
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[0.95rem]">{p?.city || "NA"}</span>
                                            <span className="text-gray-500 text-[0.8rem]">{p.location || "NA"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                        {/* dropping point */}
                        <div ref={droppingRef} className="border-y flex flex-col gap-4 p-4">
                            <div className="flex flex-col">
                                <h4 className="text-[1.4rem] font-[700]">Dropping point</h4>
                                <span className="text-sm text-gray-500">{bus?.destination || "NA"}</span>
                            </div>
                            {/* Timeline list */}
                            <div className="flex flex-col relative ">
                                {/* Vertical line */}
                                <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                                {bus?.droppingPoints?.map((d, index) => (
                                    <div key={index} className="flex items-start gap-4 relative mb-5">
                                        {/* Time & date */}
                                        <div className="flex flex-col items-end min-w-[60px]">
                                            <span className="font-semibold text-[0.95rem]">{d?.time || "NA"}</span>
                                            <span className="text-gray-500 text-[0.8rem]">{new Date(d.date).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short"
                                            }) || "NA"}</span>
                                        </div>

                                        {/* Dot indicator */}
                                        <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>

                                        {/* Point details */}
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-[0.95rem]">{d?.city || "NA"}</span>
                                            <span className="text-gray-500 text-[0.8rem]">{d?.location || "NA"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                        {/* Amenties */}
                        {
                            bus?.amenities && bus?.amenities.length > 0 && (
                                <div ref={amenitiesRef} className="border-y flex flex-col gap-4 p-4">
                                    <span className="font-[700] text-[1.4rem]">{bus?.amenities?.length} amenities</span>
                                    <div className="grid grid-cols-1 gap-3">
                                        {bus?.amenities?.map((item, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center gap-2 text-black text-[0.95rem]"
                                            >
                                                <span className="text-[#3E3E52] text-lg">
                                                    {amenityIcons[item] || "✨"}
                                                </span>
                                                {item}
                                            </span>
                                        ))}

                                    </div>
                                </div>
                            )}
                    </motion.div>
                )}

                {/* for desktop view  */}
                {/* heading */}
                <div className="hidden md:flex mt-4 p-4 flex-col">
                    <h4 className="font-[700]">{bus?.companyName || "NA"}</h4>
                    <div className="flex mt-4 text-sm flex-col">
                        <span className="text-gray-500"> {bus?.boardingPoints?.[0]?.departureTime || "NA"} - {bus?.droppingPoints?.[bus.droppingPoints.length - 1]?.time || "NA"}
                            &nbsp;|&nbsp;
                            {bus?.boardingPoints?.[0]?.date
                                ? new Date(bus.boardingPoints[0].date).toLocaleDateString("en-US", {
                                    weekday: "short", // Wed
                                    day: "2-digit",   // 15
                                    month: "short"    // Oct
                                })
                                : "NA"}</span>
                        <span className="text-gray-500">{bus.busname || "NA"}</span>
                    </div>
                </div>
                {/* bus images */}
                {
                    bus?.images && bus?.images?.length > 0 && (
                        <div className="hidden md:flex gap-2 p-4 mt-4 overflow-y-auto scrollbar-hidden">
                            <motion.div
                                className="flex gap-2 w-max"
                                drag="x"
                                dragConstraints={{ left: -1000, right: 0 }} // adjust dynamically if needed
                                whileTap={{ cursor: "grabbing" }}
                            >
                                {bus?.images.map((imgSrc, index) => (
                                    <img
                                        key={index}
                                        className="w-[250px] h-[150px] object-cover rounded-lg flex-shrink-0"
                                        src={imgSrc}
                                        alt={`bus-${index}`}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    )
                }
                {/* bus routes and policies */}
                {/* Sticky Tabs */}
                <div className="hidden border-b overflow-y-auto whitespace-nowrap scrollbar-hidden scroll-smooth  px-4 pt-4 justify-between md:flex gap-3 sticky top-0 bg-white z-20 ">
                    {["Bus Route", "Boarding point", "Dropping point", "Amenities"].map(
                        (tab) => (
                            <div
                                key={tab}
                                onClick={() => scrollToSection(
                                    tab === "Bus Route"
                                        ? routeRef
                                        : tab === "Boarding point"
                                            ? boardingRef
                                            : tab === "Dropping point"
                                                ? droppingRef
                                                : amenitiesRef
                                )}
                                className="relative cursor-pointer font-[700] text-sm p-3 hover:bg-gray-100 rounded-md"
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 -bottom-[2px] h-[3px] bg-[#D63941] rounded-full"
                                    />
                                )}
                            </div>
                        )
                    )}
                </div>
                {/* bus routes */}
                {
                    bus?.busRoutes && bus?.busRoutes.length > 0 && (
                        <div ref={routeRef} className="border-y hidden md:flex flex-col overflow-x-auto scrollbar-hide gap-3 p-4">
                            <h4 className="text-[1.4rem] font-[700]">Bus Route</h4>
                            <div className="flex items-center gap-3">
                                {bus?.busRoutes?.map((route, index) => {
                                    return (
                                        <Fragment key={route._id}>
                                            <span
                                                className={`text-sm ${index === 0 || index === bus?.busRoutes.length - 1
                                                    ? "font-[700] text-black"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                {route?.city}
                                            </span>

                                            {index < bus?.busRoutes?.length - 1 && (
                                                <span className="text-gray-500 text-sm">
                                                    <GiNextButton />
                                                </span>
                                            )}
                                        </Fragment>
                                    )
                                })
                                }
                            </div>
                        </div>
                    )
                }

                {/* boarding point */}
                <div ref={boardingRef} className=" border-y hidden md:flex flex-col gap-4 p-4">
                    <div className="flex flex-col">
                        <h4 className="text-[1.4rem] font-[700]">Boarding point</h4>
                        <span className="text-sm text-gray-500">{bus?.source || "NA"}</span>
                    </div>
                    {/* Timeline list */}
                    <div className="flex flex-col relative ">
                        {/* Vertical line */}
                        <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                        {bus?.boardingPoints?.map((p, index) => (
                            <div key={index} className="flex items-start gap-4 relative mb-5">
                                {/* Time & date */}
                                <div className="flex flex-col items-end min-w-[60px]">
                                    <span className="font-semibold text-[0.95rem]">{p?.departureTime || "NA"}</span>
                                    <span className="text-gray-500 text-[0.8rem]">{new Date(p.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short"
                                    }) || "NA"}</span>
                                </div>

                                {/* Dot indicator */}
                                <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>

                                {/* Point details */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[0.95rem]">{p?.city || "NA"}</span>
                                    <span className="text-gray-500 text-[0.8rem]">{p.location || "NA"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* dropping point */}
                <div ref={droppingRef} className="border-y hidden md:flex flex-col gap-4 p-4">
                    <div className="flex flex-col">
                        <h4 className="text-[1.4rem] font-[700]">Dropping point</h4>
                        <span className="text-sm text-gray-500">{bus?.destination || "NA"}</span>
                    </div>
                    {/* Timeline list */}
                    <div className="flex flex-col relative ">
                        {/* Vertical line */}
                        <div className="absolute left-[5rem] top-2 bottom-2 w-[7px] bg-gray-200" />

                        {bus?.droppingPoints?.map((d, index) => (
                            <div key={index} className="flex items-start gap-4 relative mb-5">
                                {/* Time & date */}
                                <div className="flex flex-col items-end min-w-[60px]">
                                    <span className="font-semibold text-[0.95rem]">{d?.time || "NA"}</span>
                                    <span className="text-gray-500 text-[0.8rem]">{new Date(d.date).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short"
                                    }) || "NA"}</span>
                                </div>

                                {/* Dot indicator */}
                                <div className="w-[10px] h-[10px] rounded-full bg-black mt-2 relative z-10"></div>

                                {/* Point details */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[0.95rem]">{d?.city || "NA"}</span>
                                    <span className="text-gray-500 text-[0.8rem]">{d?.location || "NA"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Amenties */}
                {
                    bus?.amenities && bus?.amenities.length > 0 && (
                        <div ref={amenitiesRef} className="border-y hidden md:flex flex-col gap-4 p-4">
                            <span className="font-[700] text-[1.4rem]">{bus?.amenities?.length} amenities</span>
                            <div className="grid grid-cols-1 gap-3">
                                {bus?.amenities?.map((item, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-2 text-black text-[0.95rem]"
                                    >
                                        <span className="text-[#3E3E52] text-lg">
                                            {amenityIcons[item] || "✨"}
                                        </span>
                                        {item}
                                    </span>
                                ))}

                            </div>
                        </div>
                    )
                }

            </motion.div>


        </div>
    )
}

export default SelectSeat