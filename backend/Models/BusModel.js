import mongoose from "mongoose";

// seat schema
const SeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String, // "A1", "B2", or just "12"
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  seatType: {
    type: String,
    enum: ["Window", "Aisle", "Sleeper-lower", "Seater", "Sleeper-upper"],
    default: "Seater",
  },
   bookings: [
    {
      fromCity: { type: String, required: true },
      toCity: { type: String, required: true },
      bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      droppingtime: { type: String, required: true },
      date: { type: Date, required: true },
      droppingDateTime: { type: Date, required: true }, 
      isActive:{type:Boolean,default:false},
      fare: { type: Number, required: true }
    }
  ]
});
// Bus Schema
const BusSchema = mongoose.Schema(
  {
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    busname: { type: String, required: true },
    drivername: { type: String, required: true },
    busnumber: { type: String, required: true },
    driverphonenumber: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    isActive:{type:String,enum:["Active","Inactive"],default:"Active"},
    images:[{
      type:String,required:true,default:""
    }],
  runDays: {
  type: [String], // e.g., ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
},
     // Bus Type
    bustype:{
      airConditioning: {
        type: String,
        enum: ["AC", "Non-Ac"],
        required: true,
      },
      category: {
        type: String,
        enum: ["Seater", "Sleeper", "Mixed"],
        required: true,
      },
      layout: {
        type: String,
        enum: ["2+2", "2+3"],
        required: true,
      },
      hasLowerBerth: { type: Boolean, default: true },
      hasUpperBerth: { type: Boolean, default: false },
    },
     // Ordered route cities
    busRoutes: [
      {
        city: { type: String, required: true }, // e.g."Sonipat"
        order: { type: Number, required: true }, // route order
      },
    ],
    totalSeats: { type: Number, required: true },
    seats: [SeatSchema],
     // Boarding points with fare & timings
    boardingPoints: [
      {
        location: { type: String, required: true },
        city:{type:String,required:true},
        departureTime: { type: String, required: true },
        departureMinutes:{type:Number},
        arrivalTime: { type: String, required: true }, 
        fare: { type: Number, required: true },
        date: { type: Date, required: true },
      },
    ],
    // Dropping points with timings
    droppingPoints: [
      { 
        city:{type:String,required:true},
        location: { type: String, required: true },
        time: { type: String, required: true },
        date: { type: Date, required: true }  ,
      },
    ],
    amenities: {
      type: [String],
      enum: [
        "Water Bottle",
        "Blanket",
        "Snacks",
        "Charging Point",
        "Reading Light",
        "Pillow",
        "CCTV",
        "Bedsheet",
        "WiFi",
        "Toilet",
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model("Bus", BusSchema);
export default Bus;
