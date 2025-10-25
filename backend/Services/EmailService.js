import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS_USER,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("Gmail services connection failed");
  } else {
    console.log("Gmail configured properly and ready to send email");
  }
});

export const SendOtptoEmail = async (email, otp) => {
  const html = `
  <div style="max-width: 600px; margin: auto; font-family: Arial, Helvetica, sans-serif; background: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; padding: 30px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #e53935; margin: 0;">🚍 QuickBus Verification</h2>
      <p style="color: #555; font-size: 14px; margin-top: 5px;">Secure login made simple</p>
    </div>

    <!-- Body -->
    <div style="color: #333; line-height: 1.6; font-size: 15px;">
      <p>Hi there,</p>
      <p>Your one-time password (OTP) to verify your <strong>QuickBus account</strong> is:</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <h1 style="background: #f8f9fa; color: #e53935; padding: 15px 25px; display: inline-block; border-radius: 6px; letter-spacing: 4px; font-size: 28px; font-weight: bold; border: 1px dashed #e53935;">
          ${otp}
        </h1>
      </div>

      <p><strong>⚠️ This OTP will expire in 5 minutes.</strong> Please do not share this code with anyone.</p>
      <p>If you did not request this OTP, you can safely ignore this email.</p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #777;">
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Thanks & Regards, <br/><b>QuickBus Security Team</b></p>
      <small>This is an automated message. Please do not reply.</small>
    </div>

  </div>
`;
  await transporter.sendMail({
    from: `Quickbus <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Quickbus verfication code",
    html,
  });
};

export const SendTicketDetails = async (user, booking, bus, pdfData) => {
  if (!user?.email) {
    throw new Error("User email not found");
  }
  const journeyDate = new Date(booking.boardingPoint.date).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  const html = `
<div style="max-width:650px;margin:auto;font-family:'Arial',Helvetica,sans-serif;background:#121212;color:#e0e0e0;border-radius:12px;padding:30px;border:1px solid #333;box-shadow:0 6px 20px rgba(0,0,0,0.5);">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:25px;">
    <h2 style="color:#ff3d00;margin:0;font-size:28px;">✅ Payment Confirmed</h2>
    <p style="color:#bbb;font-size:14px;margin-top:5px;">Your QuickBus booking has been successfully confirmed</p>
  </div>

  <!-- Ticket Card -->
  <div style="background:#1E1E1E;border-radius:12px;padding:25px;box-shadow:0 4px 15px rgba(0,0,0,0.4);border:1px solid #333;">
    
    <!-- Bus Info -->
   <!-- Bus Info using table -->
<table style="width:100%; margin-bottom:15px;">
  <tr>
    <td style="font-size:16px; color:#ff3d00; font-weight:bold;">🚌 ${
      bus?.busname
    }</td>
    <td style="text-align:right; font-size:12px; color:#bbb;">
      Booking ID: ${booking._id}<br/>
      <span style="color:#e0e0e0 !important;">Journey Date: ${journeyDate}</span>
   
    </td>
  </tr>
</table>
    <hr style="border:none;border-top:1px solid #333;margin:15px 0;" />

    <!-- Route Info -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
      <div>
        <p style="margin:0;font-size:14px;color:#00e676;">📍 Boarding</p>
        <p style="color:#e0e0e0 !important;margin:2px 0;font-size:14px;">${
          booking?.boardingPoint.location
        }, ${booking?.boardingPoint.city}</p>
        <p style="color:#e0e0e0 !important;margin:2px 0;font-size:14px;">Time: ${
          booking.boardingPoint?.departureTime
        }</p>
      </div>
      <div style="text-align:center;">
        <img src="https://img.icons8.com/ios-filled/24/00e676/long-arrow-right.png" alt="→"/>
      </div>
      <div>
        <p style="margin:0;font-size:14px;color:#ff3d00;">📌 Dropping</p>
        <p style="color:#e0e0e0 !important;margin:2px 0;font-size:14px;">${
          booking?.droppingPoint.location
        }, ${booking?.droppingPoint.city}</p>
        <p style="color:#e0e0e0 !important;margin:2px 0;font-size:14px;">Time: ${
          booking.droppingPoint.time
        }</p>
      </div>
    </div>

    <!-- Passenger Table -->
    <div style="margin-top:15px;">
      <h4 style="margin:10px 0;color:#00e676;">👤 Passenger Details</h4>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#e0e0e0;">
        <thead>
          <tr style="background:#2A2A2A;">
            <th style="padding:8px;border:1px solid #444;text-align:left;">Name</th>
            <th style="padding:8px;border:1px solid #444;text-align:left;">Age</th>
            <th style="padding:8px;border:1px solid #444;text-align:left;">Gender</th>
            <th style="padding:8px;border:1px solid #444;text-align:left;">Seat</th>
          </tr>
        </thead>
        <tbody>
          ${booking.passengers
            .map(
              (p, i) => `
            <tr style="${
              i % 2 === 0 ? "background:#1A1A1A;" : "background:#232323;"
            }">
              <td style="padding:8px;border:1px solid #444;">${p.name}</td>
              <td style="padding:8px;border:1px solid #444;">${p.age}</td>
              <td style="padding:8px;border:1px solid #444;">${p.gender}</td>
              <td style="padding:8px;border:1px solid #444;">${
                p.seatNumber
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- Fare & Status -->
    <div style="margin-top:20px;font-size:14px;">
      <p style="color:#e0e0e0 !important;margin:5px 0;"><strong>Total Fare Paid:</strong> ₹${
        booking.totalFare
      }</p>
      <p style="color:#e0e0e0 !important;margin:5px 0;"><strong>Status:</strong> Confirmed ✅</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="margin-top:30px;text-align:center;font-size:13px;color:#bbb;">
    <hr style="border:none;border-top:1px solid #333;margin:20px 0;" />
    <p>Thanks for choosing <b>QuickBus</b> 🚍</p>
    <small>This is an automated message. Please do not reply.</small>
  </div>

</div>

`;
  await transporter.sendMail({
    from: `Quickbus <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "🎫 QuickBus Ticket - Booking Confirmed",
    html,
    attachments: [
      {
        filename: "QuickBus-Ticket.pdf",
        content: pdfData,
        encoding: "base64",
        contentType: "application/pdf",
      },
    ],
  });
};

export const SendBoardingReminder = async(booking,user)=>{
   if (!user?.email) {
    throw new Error("User email not found");
  }
   const journeyDate = new Date(booking.boardingPoint.date).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  const html = `<div style="max-width:650px;margin:auto;font-family:'Arial',Helvetica,sans-serif;background:#ffffff;color:#333;border-radius:12px;padding:30px;border:1px solid #ddd;box-shadow:0 6px 18px rgba(0,0,0,0.1);">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:25px;">
    <h2 style="color:#ff3d00;margin:0;font-size:26px;">⏰ Boarding Reminder</h2>
    <p style="color:#555;font-size:14px;margin-top:5px;">Your bus will depart soon. Please be ready!</p>
  </div>

  <!-- Ticket Card -->
  <div style="background:#fafafa;border-radius:12px;padding:25px;box-shadow:0 4px 12px rgba(0,0,0,0.05);border:1px solid #eee;">
    
    <!-- Bus Info -->
    <table style="width:100%; margin-bottom:15px;">
      <tr>
        <td style="font-size:16px; color:#ff3d00; font-weight:bold;">🚌 ${
          booking?.busId?.busname
        }</td>
        <td style="text-align:right; font-size:12px; color:#555;">
          Booking ID: ${booking._id}<br/>
          Journey Date: ${journeyDate}
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #ddd;margin:15px 0;" />

    <!-- Driver Info -->
    <div style="margin-bottom:15px;font-size:14px;">
      <p style="margin:5px 0;"><strong>Driver Name:</strong> ${
        booking?.busId?.drivername || "Not Available"
      }</p>
      <p style="margin:5px 0;"><strong>Driver Number:</strong> ${
        booking?.busId?.driverphonenumber || "Not Available"
      }</p>
      <p style="margin:5px 0;"><strong>Bus Number:</strong> ${
        booking?.busId?.busnumber || "Not Available"
      }</p>
    </div>

    <!-- Route Info -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
      <div>
        <p style="margin:0;font-size:14px;color:#00a76f;">📍 Boarding</p>
        <p style="margin:2px 0;font-size:14px;">${
          booking?.boardingPoint.location
        }, ${booking?.boardingPoint.city}</p>
        <p style="margin:2px 0;font-size:14px;">Time: ${
          booking.boardingPoint?.departureTime
        }</p>
      </div>
      <div style="text-align:center;">
        <img src="https://img.icons8.com/ios-filled/30/00a76f/long-arrow-right.png" alt="→"/>
      </div>
      <div>
        <p style="margin:0;font-size:14px;color:#ff3d00;">📌 Dropping</p>
        <p style="margin:2px 0;font-size:14px;">${
          booking?.droppingPoint.location
        }, ${booking?.droppingPoint.city}</p>
        <p style="margin:2px 0;font-size:14px;">Time: ${
          booking.droppingPoint.time
        }</p>
      </div>
    </div>

    <!-- Passenger Table -->
    <div style="margin-top:15px;">
      <h4 style="margin:10px 0;color:#00a76f;">👤 Passenger Details</h4>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:8px;border:1px solid #ccc;text-align:left;">Name</th>
            <th style="padding:8px;border:1px solid #ccc;text-align:left;">Age</th>
            <th style="padding:8px;border:1px solid #ccc;text-align:left;">Gender</th>
            <th style="padding:8px;border:1px solid #ccc;text-align:left;">Seat</th>
          </tr>
        </thead>
        <tbody>
          ${booking.passengers
            .map(
              (p, i) => `
            <tr style="${
              i % 2 === 0 ? "background:#fff;" : "background:#f9f9f9;"
            }">
              <td style="padding:8px;border:1px solid #ccc;">${p.name}</td>
              <td style="padding:8px;border:1px solid #ccc;">${p.age}</td>
              <td style="padding:8px;border:1px solid #ccc;">${p.gender}</td>
              <td style="padding:8px;border:1px solid #ccc;">${
                p.seatNumber
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>

  </div>

  <!-- Footer -->
  <div style="margin-top:25px;text-align:center;font-size:13px;color:#555;">
    <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;" />
    <p><b>QuickBus</b> wishes you a safe journey 🚍</p>
    <small>This is an automated reminder. Please do not reply.</small>
  </div>

</div>`
 await transporter.sendMail({
    from: `Quickbus <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "⏰ Boarding Reminder - Your Bus Departs Soon",
    html,
  }); 
}