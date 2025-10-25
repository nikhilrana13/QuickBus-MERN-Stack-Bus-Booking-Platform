
import mongoose from "mongoose";
import Bus from "../Models/BusModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("Failed to connect DB:", err);
    process.exit(1);
  }
};

export const SeedBuses = async () => {
  await connectDB();
  const operatorId = "68cc05717ba5a0327fb10f3a";

  // Routes + multiple buses
  const routes = [
    {
    from: "Chandigarh",
    to: "Delhi",
    buses: 3,
    boardingPoints: [
      { location: "Chandigarh ISBT 17", city: "Chandigarh", time: "07:00", fare: 700 },
      { location: "Ambala Bus Stand", city: "Ambala", time: "08:00", fare: 500 },
      { location: "Karnal Bus Stand", city: "Karnal", time: "10:00", fare: 400 },
    ],
    droppingPoints: [
      { location: "Sonipat Bus Stand", city: "Sonipat", time: "12:00" },
      { location: "Kashmere Gate ISBT", city: "Delhi", time: "13:00" },
    ]
  },
  {
    from: "Delhi",
    to: "Chandigarh",
    buses: 2,
    boardingPoints: [
      { location: "Kashmere Gate ISBT", city: "Delhi", time: "07:00", fare: 700 },
      { location: "Sonipat Bus Stand", city: "Sonipat", time: "08:00", fare: 500 },
    ],
    droppingPoints: [
      { location: "Ambala Bus Stand", city: "Ambala", time: "11:00" },
      { location: "Chandigarh ISBT 17", city: "Chandigarh", time: "13:00" },
    ]
  },
  {
    from: "Jaipur",
    to: "Delhi",
    buses: 2,
    boardingPoints: [
      { location: "Sindhi Camp", city: "Jaipur", time: "06:30", fare: 800 },
      { location: "Shahpura Bus Stand", city: "Shahpura", time: "08:00", fare: 600 },
    ],
    droppingPoints: [
      { location: "Gurgaon IFFCO Chowk", city: "Gurgaon", time: "11:30" },
      { location: "Kashmere Gate ISBT", city: "Delhi", time: "12:30" },
    ]
  },
  {
    from: "Amritsar",
    to: "Jaipur",
    buses: 2,
    boardingPoints: [
      { location: "Amritsar ISBT", city: "Amritsar", time: "05:00", fare: 1000 },
      { location: "Ludhiana Bus Stand", city: "Ludhiana", time: "07:30", fare: 700 },
      { location: "Ambala Cantt", city: "Ambala", time: "10:00", fare: 600 },
    ],
    droppingPoints: [
      { location: "Jaipur Sindhi Camp", city: "Jaipur", time: "16:00" }
    ]
  },
  {
    from: "Delhi",
    to: "Bangalore",
    buses: 3,
    boardingPoints: [
      { location: "Kashmere Gate ISBT", city: "Delhi", time: "06:00", fare: 2200 },
      { location: "Agra Cantt", city: "Agra", time: "10:00", fare: 1800 },
      { location: "Nagpur Bus Stand", city: "Nagpur", time: "18:00", fare: 1200 },
    ],
    droppingPoints: [
      { location: "Bangalore Majestic", city: "Bangalore", time: "08:00" },
      { location: "Electronic City", city: "Bangalore", time: "09:00" },
    ]
  },
  {
    from: "Delhi",
    to: "Patna",
    buses: 2,
    boardingPoints: [
      { location: "Anand Vihar ISBT", city: "Delhi", time: "05:00", fare: 1500 },
      { location: "Kanpur Bus Stand", city: "Kanpur", time: "11:00", fare: 1000 },
    ],
    droppingPoints: [
      { location: "Patna Gandhi Maidan", city: "Patna", time: "06:00" },
      { location: "Patna ISBT", city: "Patna", time: "07:00" },
    ]
  },
  {
    from: "Delhi",
    to: "Udaipur",
    buses: 2,
    boardingPoints: [
      { location: "Sarai Kale Khan", city: "Delhi", time: "07:00", fare: 1200 },
      { location: "Gurgaon IFFCO Chowk", city: "Gurgaon", time: "08:30", fare: 1000 },
    ],
    droppingPoints: [
      { location: "Udaipur City Bus Stand", city: "Udaipur", time: "17:00" },
      { location: "Udaipur Fateh Sagar", city: "Udaipur", time: "17:30" },
    ]
  },
  {
    from: "Delhi",
    to: "Manali",
    buses: 3,
    boardingPoints: [
      { location: "Majnu ka Tila", city: "Delhi", time: "18:00", fare: 1600 },
      { location: "Karnal Bypass", city: "Delhi", time: "19:30", fare: 1500 },
    ],
    droppingPoints: [
      { location: "Manali Bus Stand", city: "Manali", time: "07:00" },
      { location: "Mall Road", city: "Manali", time: "07:30" },
    ]
  },
  {
    from: "Chandigarh",
    to: "Manali",
    buses: 2,
    boardingPoints: [
      { location: "Chandigarh ISBT 43", city: "Chandigarh", time: "08:00", fare: 1000 },
      { location: "Bilaspur", city: "Bilaspur", time: "12:00", fare: 600 },
    ],
    droppingPoints: [
      { location: "Manali Bus Stand", city: "Manali", time: "17:00" },
      { location: "Mall Road", city: "Manali", time: "17:30" },
    ]
  },
  {
    from: "Manali",
    to: "Chandigarh",
    buses: 2,
    boardingPoints: [
      { location: "Mall Road", city: "Manali", time: "08:00", fare: 1000 },
      { location: "Manali Bus Stand", city: "Manali", time: "08:30", fare: 900 },
    ],
    droppingPoints: [
      { location: "Kiratpur", city: "Kiratpur", time: "12:00" },
      { location: "Chandigarh ISBT 43", city: "Chandigarh", time: "15:00" },
    ]
  }
  ];

  const buses = [];

  routes.forEach((route, routeIndex) => {
    for (let i = 1; i <= route.buses; i++) {
      const busDate = new Date();
      busDate.setDate(busDate.getDate() + i); 

      buses.push({
        operatorId,
        busname: `${route.from}-${route.to} Volvo Express ${i}`,
        drivername: `Driver ${routeIndex + 1}-${i}`,
        busnumber: `RJ${Math.floor(10 + Math.random() * 89)}AB${Math.floor(1000 + Math.random() * 8999)}`,
        driverphonenumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        source: route.from,
        destination: route.to,
        totalSeats: 30,
        bustype: { airConditioning: "AC", category: "Mixed", layout: "2+2", hasLowerBerth: true, hasUpperBerth: true },
        seats: Array.from({ length: 30 }, (_, j) => ({
          seatNumber: `S${j + 1}`,
          isBooked: false,
          seatType: "Seater",
          bookings: []
        })),
        images: [
          "https://content.jdmagicbox.com/v2/comp/delhi/w7/011pxx11.xx11.240513132158.u8w7/catalogue/city-land-travels-jagatpur-delhi-bus-services-mk55wo9mt8.jpg",
          "https://evtechnews.in/wp-content/uploads/2024/04/NueGo-Sleeper-Buses-1.jpg"
        ],
        busRoutes: [{ city: route.from, order: 1 }, { city: route.to, order: 2 }],
        boardingPoints: route.boardingPoints.map(bp => ({
          location: bp.location,
          city: bp.city,
          departureTime: bp.time,
          arrivalTime: bp.time,
          fare: bp.fare,
          date: busDate
        })),
        droppingPoints: route.droppingPoints.map(dp => ({
          location: dp.location,
          city: dp.city,
          time: dp.time,
          date: busDate
        })),
        amenities: ["Water Bottle", "Blanket", "Charging Point", "WiFi"],
        runDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        isActive: "Active"
      });
    }
  });

  try {
    const inserted = await Bus.insertMany(buses);
    console.log(`Total buses inserted: ${inserted.length}`);
  } catch (err) {
    console.error("Insert failed:", err);
  } finally {
    mongoose.connection.close();
  }
};



//   await connectDB();
//   const operatorId = "68cc05717ba5a0327fb10f3a";
//   const buses = [];

//   for (let i = 1; i <= 10; i++) {
//     const from = cities[Math.floor(Math.random() * cities.length)];
//     let to;
//     do {
//       to = cities[Math.floor(Math.random() * cities.length)];
//     } while (to === from);

//     const busDate = randomFutureDate();
//     const departureTime = randomTime();
//     const [depHour, depMin] = departureTime.split(":").map(Number);
//     const travel = randomTravelDuration();

//     // Dropping time calculation
//     const dropHour = (depHour + travel.hours + Math.floor((depMin + travel.minutes)/60)) % 24;
//     const dropMin = (depMin + travel.minutes) % 60;
//     const droppingTime = `${dropHour.toString().padStart(2,"0")}:${dropMin.toString().padStart(2,"0")}`;

//     const bus = {
//       operatorId,
//       busname: `Volvo Express ${i}`,
//       drivername: `Driver ${i}`,
//       busnumber: `MH${Math.floor(Math.random() * 99)}AB${Math.floor(Math.random() * 9999)}`,
//       driverphonenumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
//       source: from,
//       destination: to,
//       totalSeats: 30,
//       bustype: bustypes[Math.floor(Math.random() * bustypes.length)],
//       seats: Array.from({ length: 30 }, (_, j) => ({
//         seatNumber: `S${j + 1}`,
//         isBooked: false,
//         seatType: "Seater",
//         bookings: []
//       })),
//       images: [
//         "https://content.jdmagicbox.com/v2/comp/delhi/w7/011pxx11.xx11.240513132158.u8w7/catalogue/city-land-travels-jagatpur-delhi-bus-services-mk55wo9mt8.jpg",
//         "https://content.jdmagicbox.com/v2/comp/chennai/g1/044pxx44.xx44.250618182912.n6g1/catalogue/tourbus-chetpet-chennai-mini-bus-on-rent-clscmt0145.jpg",
//         "https://evtechnews.in/wp-content/uploads/2024/04/NueGo-Sleeper-Buses-1.jpg"
//       ],
//       busRoutes: [{ city: from, order: 1 }, { city: to, order: 2 }],
//       boardingPoints: [{
//         location: `${from} Bus Stand`,
//         city: from,
//         departureTime: departureTime,
//         arrivalTime: randomTime(),
//         fare: Math.floor(500 + Math.random() * 1000),
//         date: busDate
//       }],
//       droppingPoints: [{
//         location: `${to} Bus Stand`,
//         city: to,
//         time: droppingTime,
//         date: busDate
//       }],
//       amenities: ["Water Bottle", "Blanket", "Charging Point", "WiFi"]
//     };

//     buses.push(bus);
//   }

//   try {
//     const inserted = await Bus.insertMany(buses);
//     console.log(`Total buses inserted: ${inserted.length}`);
//   } catch (err) {
//     console.error("Insert failed:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// Run script directly
SeedBuses();
