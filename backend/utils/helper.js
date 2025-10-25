

export const convertToMinutes = (timeStr) => {
  // expect "HH:mm"
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};


// Helper to check if a seat is available for a route segment
export const isSeatAvailable = (seat, fromCity, toCity, date) => {
  return !seat.bookings.some(b => 
    b.date.toISOString() === date.toISOString() &&
    (
      (b.fromCity === fromCity && b.toCity === toCity) || // exact same segment
      (b.fromCity === fromCity && b.toCity !== toCity) || // overlapping start
      (b.fromCity !== fromCity && b.toCity === toCity)    // overlapping end
    )
  );
};
