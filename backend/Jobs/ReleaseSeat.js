
import Bus from "../Models/BusModel.js";
import cron from "node-cron";

// Convert time string "HH:MM" to [hours, minutes]
export const  convertTo24Hour = (timeStr)=> {
  if (!timeStr) return [0, 0];
  const [hoursStr, minutesStr] = timeStr.split(":");
  return [Number(hoursStr), Number(minutesStr)];
}


// Cron job function
export const releaseExpiredSeats = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running cron job to release expired seats...");
    try {
      const now = new Date();

      const buses = await Bus.find({ "seats.bookings.0": { $exists: true } });
      // console.log("buses",buses)
      for (let bus of buses) {
        let busUpdated = false;
        for (let seat of bus.seats) {
          let seatUpdated = false;

          for (let booking of seat.bookings) {
            if (!booking.isActive){
              console.log(`Skipping inactive booking ${booking._id}`);
            }
            if (!booking.droppingtime || !booking.date){
               console.log(`Skipping booking ${booking._id} due to missing time/date`);
            }

            // const [hours, minutes] = convertTo24Hour(booking.droppingtime);

            // Create a Date object for today with droppingtime
            // const dropTime = new Date();
            // dropTime.setHours(hours, minutes, 0, 0);            
            const [hours, minutes] = convertTo24Hour(booking.droppingtime);
            const dropTime = new Date(booking.droppingDateTime); 
            dropTime.setHours(hours, minutes, 0, 0);
            
            console.log(`Booking ${booking._id} drop time: ${dropTime}`);

            if (now >= dropTime) {
              booking.isActive = false;
              seatUpdated = true;
              busUpdated = true;
              console.log(`Booking from ${booking.fromCity} to ${booking.toCity} on seat ${seat.seatNumber} expired`);
            }
          }
          // remove expired bookings from array
          const activeBookingsBefore = seat.bookings.length
          seat.bookings = seat.bookings.filter(b => b.isActive)
          // update seat status
          seat.isBooked = seat.bookings.length > 0

          if (seatUpdated || seat.bookings.length !== activeBookingsBefore) {
            console.log(`Seat ${seat.seatNumber} on bus ${bus._id} released`);
          }
        }

        if (busUpdated) await bus.save();
      }

      console.log("Cron job completed: expired seats released.");
    } catch (err) {
      console.error("Error releasing expired seats:", err);
    }
  });
};
