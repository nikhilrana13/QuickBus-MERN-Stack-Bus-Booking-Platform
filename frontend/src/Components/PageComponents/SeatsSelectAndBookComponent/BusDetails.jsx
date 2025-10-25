
import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../../ui/drawer";
import { IoClose, IoHandLeft } from "react-icons/io5";
import { ArrowRight, Loader2 } from "lucide-react";
import SelectSeat from "./SelectSeat.jsx";
import SelectBoardingAndDrop from "./SelectBoardingAndDrop.jsx";
import SelectSeatShimmer from "./SelectSeatShimmer.jsx";
import RedbusStyleLoader from "./RedBusStyleLoader.jsx";
import PassengerInfo from "./PassengerInfo.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";







const BusDetails = ({ bus, query, onClose }) => {
    const [loading, setLoading] = useState(true)
    const [Step, setStep] = useState(1)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([])
    const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null)
    const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null)
    const [passengers, Setpassengers] = useState([])
    const user = useSelector((state) => state.Auth.user)

    // Function to handle step click
    const handleStepClick = (step) => {
        if (step === 2 && selectedSeats.length === 0) {
            toast.error("Please select a seat first")
            return
        }
        if (step === 3 && selectedSeats.length === 0) {
            toast.error("Please select a seat first")
            return
        }
        setLoading(true)
        setStep(step)

        setTimeout(() => {
            setLoading(false);  // Hide loader after 1 sec
        }, 2000);
    };

    const isMobileOpen = typeof onClose === "function";

    // Function to handle drawer open/close
    const handleDrawerOpenChange = (open) => {
        if (isMobileOpen) {
            if (!open && onClose) onClose();
        } else {
            setIsOpen(open);
        }
        if (open && Step === 1) {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
        }
    };
    useEffect(() => {
        if (isMobileOpen && Step === 1) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [isMobileOpen, Step]);

    // find selected boarding point from query
    const selectedBoarding = bus?.boardingPoints?.find(
        (b) => b.city?.trim().toLowerCase() === query.fromValue?.trim().toLowerCase()
    );
    // console.log("selectedboard",selectedBoarding)
    // console.log('select boarding point', selectedBoardingPoint)
    // console.log('select dropping point', selectedDroppingPoint)
    // console.log('select passengers', passengers)

    useEffect(() => {
        if (selectedSeats?.length > 0) {
            Setpassengers(selectedSeats.map(seat => ({
                seatNumber: seat.seatNumber,
                name: '',
                age: '',
                gender: 'Male' // default
            })))
        } else {
            Setpassengers([])
        }
    }, [selectedSeats])

    const handleSeatBooking = async () => {
        if (!user) {
            toast.error("Please Log in first to book a seat")
            return
        }
        if (user.role !== "customer") {
            toast.error("You are not authorized to access this")
            return
        }

        if (selectedSeats.length === 0) {
            toast.error("Please select a seat first")
            return
        }
        if (!selectedBoardingPoint?._id || !selectedDroppingPoint?._id) {
            toast.error("Please select boarding and dropping point")
            return
        }
        if (passengers.length === 0) {
            toast.error("Please fill passengers information")
            return
        }
        const isValidPassengers = passengers.every(
            (p) => p.name.trim() !== "" && p.age.trim() !== ""
        );
        if (!isValidPassengers) {
            toast.error("Please enter valid passenger details");
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/create-booking`, {
                busId: bus?._id,
                boardingPointId: selectedBoardingPoint?._id,
                droppingPointId: selectedDroppingPoint?._id,
                passengers: passengers
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }, withCredentials: true
            })
            // console.log("response data",response.data)
            if (response?.data) {
                window.location.href = response?.data?.data?.url
            }
        } catch (error) {
            console.log("failed to booking", error)
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    const handleButtonClick = () => {
        if (Step === 3) {
            handleSeatBooking()
        } else {
            setStep((step) => step + 1)
        }
    }
    // calculate total fare
    const totalFare = selectedSeats?.length * (selectedBoarding?.fare || 0)
    return (
        <Drawer open={isMobileOpen ? true : isOpen} onOpenChange={handleDrawerOpenChange}>
            {/* Button to open drawer */}
            <DrawerTrigger asChild className="hidden lg:block">
                <button className='px-4 py-3  rounded-full font-[500] bg-[#D63941] text-white'>View Seats</button>
            </DrawerTrigger>
            {/* Drawer content */}
            <DrawerContent className="rounded-t-3xl flex  flex-col border-t shadow-2xl  mt-0 max-h-[100vh] w-full fixed top-[40px] bottom-0 left-0 right-0  ">
                <DrawerHeader className="text-center py-3 md:py-5 border-b">
                    <div className="flex items-center px-3 gap-3">
                        <DrawerClose asChild>
                            <div className="p-2 cursor-pointer rounded-full hover:bg-[#EFEFEF]">
                                <IoClose className="text-2xl" />
                            </div>
                        </DrawerClose>
                        <div className="flex">
                            <span className="font-[700] flex-wrap flex gap-1 md:gap-2  text-black">{query?.fromValue || "NA"}<span className="text-gray-500"> <ArrowRight /> </span>{query?.toValue || "NA"}</span>
                        </div>
                    </div>
                </DrawerHeader>
                {/* Drawer Main Section */}
                {/* Step Navigation */}
                <div className="border-b flex relative items-center px-2  flex-shrink-0 justify-start md:justify-center overflow-x-auto scroll-smooth scrollbar-hidden whitespace-nowrap w-full gap-8 text-[0.95rem] min-h-[60px] bg-white">
                    {[
                        { id: 1, label: "1.Select Seats" },
                        { id: 2, label: "2.Board/Drop point" },
                        { id: 3, label: "3.Passenger Info" },
                    ].map((item) => (
                        <span
                            key={item.id}
                            onClick={() => handleStepClick(item.id)}
                            className={`relative cursor-pointer font-[600] text-sm transition-all duration-300 ${Step === item.id ? "text-[#D63941]" : "text-black"
                                }`}

                        >
                            {item.label}
                            {Step === item.id && (
                                <span className="absolute bottom-[-10px] transition-all duration-300 left-0 right-0 h-[3px] bg-[#D63941] rounded-full slow-pulse "></span>
                            )}
                        </span>
                    ))}
                </div>
                {/* main content */}
                <div className=" h-[100%] overflow-y-auto scrollbar-hidden scroll-smooth md:px-5 bg-[#F2F2F8] w-full">
                    {Step === 1 && (
                        loading ? (
                            <SelectSeatShimmer />
                        ) : (
                            <SelectSeat selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} Step={Step} />
                        )
                    )}
                    {Step === 2 && (
                        loading ? (
                            <RedbusStyleLoader />
                        ) : (
                            <SelectBoardingAndDrop selectedBoardingPoint={selectedBoardingPoint} setSelectedBoardingPoint={setSelectedBoardingPoint} selectedDroppingPoint={selectedDroppingPoint} setSelectedDroppingPoint={setSelectedDroppingPoint} bus={bus} Step={Step} />
                        )
                    )}
                    {Step === 3 && (
                        loading ? (
                            <RedbusStyleLoader />
                        ) : (
                            <PassengerInfo passengers={passengers} Setpassengers={Setpassengers} bus={bus} selectedBoardingPoint={selectedBoardingPoint} selectedDroppingPoint={selectedDroppingPoint} selectedSeats={selectedSeats} />
                        )
                    )}

                </div>
                {/* Footer Buttons */}
                {/* seats select info and next step button */}
                {selectedSeats.length > 0 && (Step === 1 || (Step === 2 && selectedBoardingPoint && selectedDroppingPoint) || Step === 3) && (
                    <DrawerFooter className="flex flex-col sm:flex-row justify-between items-center border-t bg-white px-4 py-3 gap-3">
                        <AnimatePresence>
                            <motion.div
                                key="footerContent"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="flex flex-col sm:flex-row md:justify-center justify-between items-center w-full gap-3 sm:gap-8"
                            >
                                {/* Seats & Fare */}
                                <div className="flex justify-between items-center w-full sm:w-auto gap-5">
                                    {
                                        Step === 3 && (
                                            <span className="font-[500] text-sm">Amount</span>
                                        )
                                    }
                                    <span className="font-[500] text-sm">
                                        {selectedSeats.length} seat {selectedSeats.length > 1 ? "s" : ""}
                                    </span>
                                    <span className="text-[1.2rem] font-[700]"> ₹{totalFare}</span>
                                </div>

                                {/* Button */}
                                <button type="button" onClick={handleButtonClick} className="w-full sm:w-auto bg-[#D63941] font-[500] text-white rounded-[24px] px-6 py-3">
                                    {Step === 1 && "Select boarding & dropping points"}
                                    {Step === 2 && "Fill passenger details"}
                                    {Step === 3 && (
                                        loading ? <Loader2 className="mx-auto w-5 h-5 animate-spin" /> : "Confirm Booking"
                                    )}
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default BusDetails;


