import cron from "node-cron"
import Booking from "../Models/BookingModel.js";
import { convertTo24Hour } from "./ReleaseSeat.js";
import User from "../Models/UserModel.js";
import { SendBoardingReminder } from "../Services/EmailService.js";



export const UpdateSendBoardingEmail = ()=>{
     cron.schedule("* * * * * ",async()=>{
         console.log("Running cron job to send boarding email 1 hour before boarding...");
         try {
            const now = new Date()
             // Fetch all bookings with bus details populated
            const bookings = await Booking.find({}).populate("busId","drivername driverphonenumber busnumber busname")

              // Loop through each booking
            for(let booking of bookings){
                 // Convert boarding time (string) -> hours & minutes
                const [hours, minutes] = convertTo24Hour(booking.boardingPoint.departureTime);
                // Create boarding datetime (date + time merged)
                const boardingdatetime = new Date(booking.boardingPoint.date)
                boardingdatetime.setHours(hours,minutes,0,0)
                // Extract only the date (yyyy-mm-dd) for comparison
                const todayStr = now.toISOString().split("T")[0];
                const boardingDateStr = boardingdatetime.toISOString().split("T")[0]
                   // Check if boarding date is today only
                if(todayStr === boardingDateStr){
              // Find the difference in minutes between boarding time & current time
                const diff = boardingdatetime - now 
                const diffInminutes = diff / (1000 * 60)
                 // Check if boarding time is exactly 1 hour 
                      if(diffInminutes > 59 && diffInminutes < 61){
                    // Get user details
                    const user = await User.findById(booking.userId)
                    if(!user) continue
                    // Send reminder email
                    await SendBoardingReminder(booking,user)
                    console.log(`Boarding email sent to ${user.email} and booking id:${booking._id}`)
                }
            }}
         } catch (error) {
               console.error("failed to sent boarding emails", error);
         }
     })
}