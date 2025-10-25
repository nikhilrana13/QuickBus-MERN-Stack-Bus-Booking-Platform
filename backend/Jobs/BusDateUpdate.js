import cron from "node-cron";
import Bus from "../Models/BusModel.js";
/**
 * convertTo24Hour:
 *  Converts a "HH:MM" string to [hour, minute] numbers.
 *  Example:
 *    "01:00" => [1, 0]
 *    "22:30" => [22, 30]
 *  Returns [0, 0] if input is empty
 */
function convertTo24Hour(timeStr) {
  if (!timeStr) return [0, 0];
  const [hoursStr, minutesStr] = timeStr.split(":");
  return [Number(hoursStr), Number(minutesStr)];
}
/**
 * BusDateUpdate:
 *  - Runs a cron job every 1 hour (for testing)
 *  - Updates boarding and dropping points for all buses
 *  - Ensures past times move to next valid day
 *  - Example:
 *      Current time: 22 Sep 2025, 18:30
 *      Boarding #1: 22:00 → 22 Sep 2025, 22:00
 *      Boarding #2: 01:00 → 23 Sep 2025, 01:00 (next day)
 *      Dropping #1: 01:00 → 23 Sep 2025, 01:00 (after boarding)
 *  - Handles midnight/early morning times automatically
 */
export const BusDateUpdate = () => {
  cron.schedule(
    "0 * * * *", // every 1 hour for testing
    async () => {
      console.log("Running fixed bus date update...");
      try {
        const buses = await Bus.find({});
        const now = new Date();
        for (const bus of buses) {
          console.log(`\nBus ID: ${bus._id} | ${bus.busname}`);
          let lastBoardingDate = null;
           // ---- Update Boarding Points ----
          // Loop through all boarding points of the bus
          bus.boardingPoints = bus.boardingPoints.map((point, index) => {
            let [hour, minute] = convertTo24Hour(point.departureTime);
            let newDate = new Date();
            newDate.setHours(hour, minute, 0, 0);
            // If boarding time already passed → move to next day
            // If previous boarding is later → move to next day
            if (newDate <= now || (lastBoardingDate && newDate <= lastBoardingDate)) {
              newDate.setDate(newDate.getDate() + 1);
            }
            lastBoardingDate = newDate;
            console.log(
              `Boarding #${index + 1} original time: ${point.departureTime}, calculated date: ${newDate.toISOString()} | ${newDate.toLocaleString("en-IN")}`
            );
            return { ...point.toObject(), date: newDate };
          });
          // ---- Update Dropping Points ----
          // Loop through all dropping points of the bus
          let lastDropDate = null;
          bus.droppingPoints = bus.droppingPoints.map((point, index) => {
            let [hour, minute] = convertTo24Hour(point.time);
            // Reference date: last drop or first boarding
            let referenceDate = lastDropDate || bus.boardingPoints[0].date;
            let newDate = new Date(referenceDate);
            newDate.setHours(hour, minute, 0, 0);
            // If drop time is before reference → move to next day
            if (newDate <= referenceDate || (lastDropDate && newDate <= lastDropDate)) {
              newDate.setDate(newDate.getDate() + 1);
            }
            lastDropDate = newDate;
            console.log(
              `Dropping #${index + 1} original time: ${point.time}, final date: ${newDate.toISOString()} | ${newDate.toLocaleString("en-IN")}`
            );
            return { ...point.toObject(), date: newDate };
          });
          await bus.save();
        }
        console.log("Bus dates updated successfully!");
      } catch (error) {
        console.error("Failed to update bus dates:", error);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};


