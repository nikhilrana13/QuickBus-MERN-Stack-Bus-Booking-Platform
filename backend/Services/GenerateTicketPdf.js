import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
export const generateTicketPDF = (user,booking,bus) => {
 return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      // Collect PDF buffer
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on("error", reject);
    //   Optional: register a TTF font for emojis support
      const fontPath = path.join(__dirname, "././../fonts/Roboto-VariableFont_wdth,wght.ttf")
      doc.registerFont("Roboto", fontPath);
      doc.font("Roboto");

      // --- HEADER ---
      doc
        .fontSize(20)
        .fillColor("#e53935")
        .text("QuickBus - E-Ticket", { align: "center" });
      doc.moveDown(0.5);

      // --- Booking Info ---
      doc.fontSize(12).fillColor("black").text(`Booking ID: ${booking._id}`);
      doc.text(`Bus: ${bus.busname}`);
      doc.text(`Route: ${booking.boardingPoint.city} - ${booking.droppingPoint.city}`);
      doc.text(`Journey Date: ${new Date(booking.boardingPoint.date).toDateString()}`);
      doc.moveDown();

      // --- Boarding / Dropping ---
      doc.fontSize(14).fillColor("#00e676").text("Boarding Details", { underline: true });
      doc.fontSize(12).fillColor("black");
      doc.text(`${booking.boardingPoint.location}, ${booking.boardingPoint.city}`);
      doc.text(`Time: ${booking.boardingPoint.departureTime}`);
      doc.moveDown(0.5);

      doc.fontSize(14).fillColor("#ff3d00").text(" Dropping Details", { underline: true });
      doc.fontSize(12).fillColor("black");
      doc.text(`${booking.droppingPoint.location}, ${booking.droppingPoint.city}`);
      doc.text(`Time: ${booking.droppingPoint.time}`);
      doc.moveDown();

      // --- Passenger Details ---
      doc.fontSize(14).fillColor("#00e676").text("Passenger Details", { underline: true });
      doc.moveDown(0.5);
      booking.passengers.forEach((p, i) => {
        doc
          .fontSize(12)
          .fillColor("black")
          .text(`${i + 1}. ${p.name}, ${p.age} yrs, ${p.gender}, Seat: ${p.seatNumber}`);
      });
      doc.moveDown();

      // --- Fare & Status ---
      doc.fontSize(12).fillColor("black").text(`Total Fare: ₹${booking.totalFare}`);
      doc.text(`Payment Status: ${booking.paymentInfo.paymentStatus}`);
      doc.text(`Booking Status: ${booking.status}`);
      doc.moveDown(1);

      // --- Footer ---
      doc.fontSize(10).fillColor("gray").text(
        "⚠️ Please carry a valid ID proof while boarding the bus.\nThanks for choosing QuickBus!",
        { align: "center" }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
