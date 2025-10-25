import mongoose from "mongoose";

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  age: { type: Number, required: true },
  seatNumber: { type: String, required: true },
});

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    passengers: [PassengerSchema],
    boardingPoint: {
      location: { type: String, required: true },
      city: { type: String, required: true },
      departureTime: { type: String, required: true },
      date: { type: Date, required: true },
    },
    droppingPoint: {
      location: { type: String, required: true },
      city: { type: String, required: true },
      time: { type: String, required: true },
      date: { type: Date, required: true },
    },
    totalFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    paymentInfo: {
      method: { type: String, default: "Stripe" },
      transactionId: { type: String },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
