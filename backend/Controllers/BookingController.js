import User from "../Models/UserModel.js";
import { Response } from "../utils/ResponseHandler.js";
import Bus from "../Models/BusModel.js";
import Booking from "../Models/BookingModel.js";
import { StripeInstance } from "../utils/stripe.js";
import { isSeatAvailable } from "../utils/helper.js";
import { convertTo24Hour } from "../Jobs/ReleaseSeat.js";
import { generateTicketPDF } from "../Services/GenerateTicketPdf.js";
import { SendTicketDetails } from "../Services/EmailService.js";
import Operator from "../Models/OperatorModel.js";

export const CreateBusBooking = async (req, res) => {
  try {
    const userId = req.user;
    let { busId, boardingPointId, droppingPointId, passengers } = req.body;
    // console.log("req.body", req.body);

    // validation
    if (
      !busId ||
      !boardingPointId ||
      !droppingPointId ||
      !passengers ||
      passengers.length === 0
    ) {
      return Response(res, 400, "All fields are required to book ticket");
    }
    //  check user exists
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, 400, "User not found");
    }
    // check user role customer or not
    if (user.role === "Operator") {
      return Response(res, 400, "You are not authorized to book the ticket");
    }
    // check bus exists or not
    const bus = await Bus.findById(busId).populate("operatorId", "companyName busname");
    if (!bus) {
      return Response(res, 400, "Bus not found");
    }
    //  Boarding/Dropping point fetch
    const boardingPoint = bus.boardingPoints.id(boardingPointId);
    const droppingPoint = bus.droppingPoints.id(droppingPointId);
    if (!boardingPoint || !droppingPoint) {
      return Response(res, 400, "Invalid boarding or dropping point");
    }
    // check seats availability for this route and date
    for (let p of passengers) {
      const seat = bus.seats.find((s) => s.seatNumber === p.seatNumber);
      if (
        !seat ||
        !isSeatAvailable(
          seat,
          boardingPoint.city,
          droppingPoint.city,
          boardingPoint.date
        )
      ) {
        return Response(
          res,
          400,
          `Seat ${p.seatNumber} not available for this route`
        );
      }
    }
    // await bus.save();
    //checked booking already exists or not
    const bookingexist = await Booking.findOne({
      busId,
      userId,
      status: { $ne: "Cancelled" },
      "boardingPoint.date": boardingPoint.date, // same date check
    });
    if (bookingexist) {
      return Response(res, 400, "You have already book this ticket");
    }
    // calculate totalprice
    const totalFare = passengers.length * boardingPoint.fare;
    // create booking with pending status (no seat lock yet)
    const booking = await Booking.create({
      userId,
      busId,
      passengers,
      boardingPoint: {
        location: boardingPoint.location,
        city: boardingPoint.city,
        departureTime: boardingPoint.departureTime,
        date: boardingPoint.date,
      },
      droppingPoint: {
        location: droppingPoint.location,
        city: droppingPoint.city,
        date: droppingPoint.date,
        time: droppingPoint.time,
      },
      totalFare: totalFare,
      status: "Pending",
      paymentInfo: {
        method: "Stripe",
        transactionId: "temp_12345",
        paymentStatus: "Pending",
      },
    });
    // push booking id to user mytrips
    user.mytrips.push(booking._id);
    await user.save();
    // Stripe Checkout Session
    const session = await StripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: bus.operatorId.companyName || "Bus Ticket",
              description: `Seats: ${passengers
                .map((p) => p.seatNumber)
                .join(", ")}`,
            },
            unit_amount: boardingPoint.fare * 100,
          },
          quantity: passengers.length,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed?bookingId=${booking._id}`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: user._id.toString(),
        busId,
      },
    });
    // console.log("booking",booking)
    return Response(res, 200, "Booking Created, waiting for payment", {
      url: session.url,
      booking,
    });
  } catch (error) {
    console.error("failed to book bus seat", error);
    return Response(res, 500, "Internal Server error");
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const userId = req.user;
    const bookingId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return Response(res, 403, "User not found");
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response(res, 403, "Booking not found");
    }
    const bus = await Bus.findById(booking.busId);
    if (!bus) {
      return Response(res, 403, "Bus not found");
    }

    // mark seats booked for this segment
    for (let p of booking.passengers) {
      const droppingPoint = booking.droppingPoint;
      const seat = bus.seats.find((s) => s.seatNumber === p.seatNumber);
      if (!seat) continue;
      // merge date + dropping time into single Date
      const [hours, minutes] = convertTo24Hour(droppingPoint.time);
      const droppingDateTime = new Date(booking.droppingPoint.date);
      droppingDateTime.setHours(hours, minutes, 0, 0);

      seat.bookings.push({
        fromCity: booking.boardingPoint.city,
        toCity: booking.droppingPoint.city,
        bookedBy: userId,
        droppingtime: droppingPoint.time,
        droppingDateTime,
        date: booking.boardingPoint.date,
        fare: booking.totalFare / booking.passengers.length,
        isActive: true, // only active for this segment
      });
      seat.isBooked = true; // booked for at least one active segment
    }
    if (booking.userId.toString() !== userId) {
      return Response(
        res,
        404,
        "You are not authorized to update this payment"
      );
    }
    booking.status = "Confirmed";
    booking.paymentInfo.paymentStatus = "Paid";

    // send booking details to user email
    const pdfData = await generateTicketPDF(user, booking, bus);
    await SendTicketDetails(user, booking, bus, pdfData);

    await bus.save();
    await booking.save();
    return Response(
      res,
      200,
      "Payment success, seats confirmed for your segment",
      booking
    );
  } catch (error) {
    console.error("failed to update payment status", error);
    return Response(res, 500, "Internal Server error");
  }
};
export const updatePaymentfailedStatus = async (req, res) => {
  try {
    const userId = req.user;
    const bookingId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return Response(res, 403, "User not found");
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response(res, 403, "Booking not found");
    }
    const bus = await Bus.findById(booking.busId);
    if (!bus) {
      return Response(res, 403, "Bus not found");
    }

    //  release seats
    for (let p of booking.passengers) {
      const seat = bus.seats.find((s) => s.seatNumber === p.seatNumber);
      if (seat) {
        seat.isBooked = false;
        seat.isActive = false;
        seat.bookings = seat.bookings.filter(
          (b) => b.bookedBy.toString() !== userId.toString()
        );
      }
    }
    if (booking.userId.toString() !== userId) {
      return Response(
        res,
        404,
        "You are not authorized to update this payment"
      );
    }
    booking.status = "Cancelled";
    booking.paymentInfo.paymentStatus = "Failed";

    await bus.save();
    await booking.save();
    return Response(res, 200, "Payment failed booking cancelled", booking);
  } catch (error) {
    console.error("failed to update payment status", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UserUpcomingTrips = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return Response(res, 404, "User not found");
    }
    const bookings = await Booking.find({ userId }).populate("busId","busname")
    const now = new Date();

    const upcomingTrips = bookings.filter((booking) => {
      const [hours, minutes] = convertTo24Hour(
        booking.boardingPoint.departureTime
      );
      const boardingdatetime = new Date(booking.boardingPoint.date);
      boardingdatetime.setHours(hours, minutes, 0, 0);
      return boardingdatetime > now; // upcoming if boarding time is in future
    });
    if (upcomingTrips.length === 0) {
      return Response(res, 200, "No Upcoming trips", upcomingTrips);
    }
    return Response(res, 200, "Upcoming trips", upcomingTrips);
  } catch (error) {
    console.error("failed to find upcoming trips", error);
    return Response(res, 500, "Internal server error");
  }
};

export const EachOperatorBookings = async (req, res) => {
  try {
    const operatorId = req.operator;
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 403, "Operator not found");
    }
    const operatorbuses = await Bus.find({ operatorId });
    if (!operatorbuses.length) {
      return Response(res, 403, "No Buses found for this operator");
    }
    const busids = operatorbuses.map((bus) => bus._id);
    const bookings = await Booking.find({ busId: { $in: busids } })
      .populate("userId", "username phoneno")
      .populate("busId", "busnumber busname").sort({createdAt: -1})
    if (!bookings.length) {
      return Response(res, 403, "No Bookings found");
    }
    return Response(res, 200, "Bookings found", bookings);
  } catch (error) {
    console.error("failed to get bookings", error);
    return Response(res, 500, "Internal server error");
  }
};
export const FindTotalRevenue = async (req, res) => {
  try {
    const operatorId = req.operator;

    const operator = Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 404, "Operator not found");
    }
    // get all buses of operator
    const buses = await Bus.find({ operatorId: operatorId });
    if (!buses || buses.length === 0) {
      return Response(res, 404, "No buses found");
    }
    // fetch all bus ids
    const busids = buses.map((b) => b._id);
    // find all bookings of busids
    const bookings = await Booking.find({
      busId: { $in: busids },
      "paymentInfo.paymentStatus": "Paid",
    }).select("totalFare");
    // calculate total
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalFare,
      0
    );
    const totalbuses = buses.length;
    const totalBookings = bookings.length;
    return Response(res, 200, "Total bookings and total revenue", {
      totalRevenue,
      totalbuses,
      totalBookings,
    });
  } catch (error) {
    console.log("failed to get total revenue or total bookings", error);
    return Response(res, 500, "Internal server error");
  }
};

export const FindPerMonthEarnings = async (req, res) => {
  try {
    const operatorId = req.operator;
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return Response(res, 404, "Operator not found");
    }
    // get all buses of operator
    const buses = await Bus.find({ operatorId: operatorId });
    if (!buses || buses.length === 0) {
      return Response(res, 404, "No buses found");
    }
    // fetch all bus ids
    const busids = buses.map((b) => b._id);
    const earnings = await Booking.aggregate([
      {
        $match: {
          busId: { $in: busids },
          "paymentInfo.paymentStatus": "Paid",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // group by month
          totalEarnings: { $sum: "$totalFare" },
        },
      },
      {
        $sort: { _id: 1 }, // sort by month
      },
    ]);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // Initialize all months with 0 earnings
    const monthlyData = monthNames.map((month) => ({ month, earnings: 0 }));
    //  const data = earnings.map(e =>({
    //   month:monthNames[e._id - 1],
    //   earnings:e.totalEarnings
    //  }))
    // Fill earnings for months where data exists
    earnings.forEach((e) => {
      monthlyData[e._id - 1].earnings = e.totalEarnings;
    });
    return Response(res, 200, "Monthly Earning fetched", monthlyData);
  } catch (error) {
    console.log("failed to get monthly earning", error);
    return Response(res, 500, "Internal Server error");
  }
};


