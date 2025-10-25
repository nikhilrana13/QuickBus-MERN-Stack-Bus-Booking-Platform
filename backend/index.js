import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import UserRoute from "./Routes/UserRoute.js"
import OperatorRoute from "./Routes/OperatorRoute.js"
import busRoute from "./Routes/BusRoute.js"
import bookingRoute from "./Routes/BookingRoute.js"
import multer from "multer"
import { BusDateUpdate } from "./Jobs/BusDateUpdate.js"
import { releaseExpiredSeats } from "./Jobs/ReleaseSeat.js"
import { UpdateSendBoardingEmail } from "./Jobs/SendBoardingEmail.js"
import { configure } from "./Config/db.js"



dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000


// middlware
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


// routes 
app.use('/api/user',UserRoute)
app.use('/api/operator',OperatorRoute)
app.use('/api/bus',busRoute)
app.use('/api/bookings',bookingRoute)


// Multer / other error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ success:false, message: err.message });
  if (err) return res.status(400).json({ success:false, message: err.message });
  next();
});
app.use((req,res) => res.status(404).json({success:false,message:"Route not found"}))

// connect to db
configure()


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
    BusDateUpdate()
    releaseExpiredSeats()
    UpdateSendBoardingEmail()
})