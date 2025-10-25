import express from "express"
import { CreateBusBooking, EachOperatorBookings, FindPerMonthEarnings, FindTotalRevenue, UserUpcomingTrips, updatePaymentStatus,updatePaymentfailedStatus } from "../Controllers/BookingController.js"
import { isCustomer } from "../Middlewares/isCustomer.js"
import { isOperator } from "../Middlewares/isOperator.js"
const router = express.Router()



// route for customer
router.post("/create-booking",isCustomer,CreateBusBooking,)
router.get("/upcoming-trips",isCustomer,UserUpcomingTrips)
// payment status marked 
router.post("/:id/mark-success",isCustomer,updatePaymentStatus)
router.post("/:id/mark-failed",isCustomer,updatePaymentfailedStatus)
// route for operator 
router.get("/my-bookings",isOperator,EachOperatorBookings)
router.get("/total-revenue",isOperator,FindTotalRevenue)
router.get("/earnings",isOperator,FindPerMonthEarnings)



export default router