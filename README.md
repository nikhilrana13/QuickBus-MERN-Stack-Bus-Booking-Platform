QuickBus – MERN Stack Bus Booking Platform 🚍

QuickBus is a bus booking application built using the MERN stack, inspired by RedBus. It provides both user-friendly interfaces for passengers and powerful dashboards for operators, with real-time seat selection, automated notifications, and dynamic bus management.

🔹 Features
User Features

Search Buses: Users can search buses by source, destination, and date. Only buses with future boarding times are shown.

Real-Time Seat Selection: Select seat types like Window, Seater, Sleeper, etc., with visual seat map.

Segment-Wise Booking: Users can book a seat for a segment of the route. For example, booking Chandigarh → Karnal marks the seat booked only for that segment. Seats are automatically freed for subsequent segments.

Booking Confirmation: After payment, users receive an email with ticket details including bus info, passenger info, boarding/dropping points, and PDF ticket.

Automated Reminder Emails: Users receive an email 1 hour before boarding with bus and driver details.

Stripe Payment Integration: Payments handled using Stripe demo account, ensuring smooth checkout.

Future Buses Only: Past buses are hidden; Node Cron automatically updates expired buses for the next day.

Operator Features

Dashboard Overview:

Total buses added

Total routes

Total revenue generated

Bus Management:

Add / Update bus details including images, amenities, layout, bus type, and AC/Non-AC

Manage boarding and dropping points dynamically without manually adding dates

Update company info (name, phone, address)

Bookings Management: View all bookings, passenger info, and seat allocation for each route.

Virtual Days System: Operator only defines bus run days (e.g., Mon, Tue, Wed…). System automatically generates virtual dates for those days.

Dynamic Seat Management: Seats are booked segment-wise; expired seats are automatically freed using Node Cron.


Technical Features


Frontend: React, Tailwind CSS, ShadCN Components, Framer Motion, AOS

Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: JWT, Redux Toolkit

Payment Gateway: Stripe (Demo)

Email Notifications: NodeMailer / SMTP for ticket confirmation & reminders

Task Scheduling: Node Cron for:

Updating bus dates automatically

Freeing seats for expired segments

Ensuring only future buses are available

PDF Generation: Tickets include all booking details.

Responsive Design: Works seamlessly on mobile and desktop.


🔹 Challenges Faced & Solutions

Dynamic Boarding/Dropping Times

Issue: Updating expired bus schedules and ensuring correct Indian time.

Solution: Node Cron runs every hour to update expired bus times to the next day, maintaining boarding and dropping times correctly.

Segment-wise Seat Booking

Issue: Multiple users booking seats for different segments of the same bus route.

Solution: Each seat keeps a record of bookings per segment; Node Cron frees expired segment seats automatically.

Multi-Filter Search API

Issue: Filtering buses by category, amenities, AC/Non-AC, and other criteria.

Solution: Built a robust query system in Node.js, dynamically filtering buses with future availability.

PDF Ticket & Email Automation

Issue: Generate tickets and send them automatically after payment.

Solution: Integrated PDF generation with NodeMailer and triggered email after successful Stripe payment.

Time Zone Management

Issue: MongoDB showed UTC times, causing discrepancies in Indian Standard Time.

Solution: Converted all date-time handling to IST, ensuring accurate schedule display.

Front-End UI Challenges

Issue: Replicating RedBus responsive UI with seat map, step navigation, and animations.

Solution: Used Tailwind CSS, ShadCN UI components, Framer Motion, and AOS for smooth animations and fully responsive design.

🔹 Tech Stack

Layer	Tech
Frontend	React, Tailwind CSS, ShadCN, Framer Motion, AOS
Backend	Node.js, Express.js, MongoDB, Mongoose
Authentication	JWT, Redux Toolkit
Payments	Stripe (Demo)
Email	NodeMailer / SMTP
Task Scheduling	Node Cron
PDF Generation	PDFKit / html-pdf

🔹 How It Works (Flow)

User searches buses → only buses with future boarding times are shown.

Select seats → visual seat map shows availability.

Select boarding & dropping points → automatically filters fare and segment.

Fill passenger info → validate name, age, gender per seat.

Make payment → Stripe checkout demo integration.

Receive PDF ticket and confirmation email.

Reminder email → sent 1 hour before boarding.

Node Cron automates expired segments → seats freed automatically, expired buses updated to next day.
