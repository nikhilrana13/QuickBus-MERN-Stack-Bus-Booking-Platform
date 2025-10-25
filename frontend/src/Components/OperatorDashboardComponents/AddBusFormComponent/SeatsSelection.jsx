import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const SeatsSelection = () => {
  const { watch, setValue } = useFormContext();

  // form se values fetch
  const totalSeats = watch("totalSeats");
  const layout = watch("bustype.layout");
  const busCategory = watch("bustype.category");
  const hasLowerBerth = watch("bustype.hasLowerBerth");
  const hasUpperBerth = watch("bustype.hasUpperBerth");

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
     
//   console.log("selected seats",selectedSeats)
  // function: generate seats
  const generateSeats = (totalSeats, layout, busCategory) => {
    let leftSeats = layout === "2+2" ? 2 : 2;
    let rightSeats = layout === "2+2" ? 2 : 3;
    const totalPerRow = leftSeats + rightSeats;
    const rows = Math.ceil(totalSeats / totalPerRow);
    const seatsArr = [];
    let seatCount = 1;

    for (let i = 0; i < rows; i++) {
      const row = { left: [], right: [] };
      for (let j = 0; j < totalPerRow; j++) {
        if (seatCount > totalSeats) break;

        let seatType = "Seater"; // default

        if (busCategory === "Seater") {
          if (j === 0 || j === totalPerRow - 1) seatType = "Window";
          else seatType = "Aisle";
        } else if (busCategory === "Sleeper") {
          if (hasLowerBerth && hasUpperBerth)
            seatType = j % 2 === 0 ? "Sleeper-lower" : "Sleeper-upper";
          else if (hasLowerBerth) seatType = "Sleeper-lower";
          else if (hasUpperBerth) seatType = "Sleeper-upper";
        }

        const seatObj = {
          seatNumber: `${i + 1}${String.fromCharCode(65 + j)}`,
          isBooked: false,
          seatType,
        };

        if (j < leftSeats) row.left.push(seatObj);
        else row.right.push(seatObj);

        seatCount++;
      }
      seatsArr.push(row);
    }

    return seatsArr;
  };

  // generate seats when layout or total changes
  useEffect(() => {
    const generated = generateSeats(totalSeats, layout, busCategory);
    setSeats(generated);
    setValue("seats", generated); 
  }, [totalSeats, layout, busCategory, hasLowerBerth, hasUpperBerth]);

  // toggle seat selection
  const toggleSeat = (seat) => {
    let updated;
    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      updated = selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber);
    } else {
      updated = [...selectedSeats, seat];
    }
    setSelectedSeats(updated);
    setValue("selectedSeats", updated); 
  };

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold mb-4">Step 6: Seats Selection</h3>

      {/* Layout and Bus Type Info */}
      <p className="mb-2 font-medium">Bus Category: {busCategory}</p>
      <p className="mb-4 font-medium">Layout: {layout}</p>

      {/* Seats Grid */}
      <div className="flex flex-col gap-2">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-4">
            {/* Left Seats */}
            <div className="flex gap-2">
              {row.left.map((seat) => (
                <button
                  key={seat.seatNumber}
                  type="button"
                  onClick={() => toggleSeat(seat)}
                  className={`p-3 rounded-md border text-xs text-center ${
                    selectedSeats.some((s) => s.seatNumber === seat.seatNumber)
                      ? "bg-red-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {seat.seatNumber}
                  <br />
                  <span className="text-[10px]">{seat.seatType}</span>
                </button>
              ))}
            </div>

            {/* Gap between left and right */}
            <div className="w-8"></div>

            {/* Right Seats */}
            <div className="flex gap-2">
              {row.right.map((seat) => (
                <button
                  key={seat.seatNumber}
                  type="button"
                  onClick={() => toggleSeat(seat)}
                  className={`p-3 rounded-md border text-xs text-center ${
                    selectedSeats.some((s) => s.seatNumber === seat.seatNumber)
                      ? "bg-red-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {seat.seatNumber}
                  <br />
                  <span className="text-[10px]">{seat.seatType}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="font-medium mt-4">
        Selected Seats:{" "}
        {selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}
      </p>
    </div>
  );
};

export default SeatsSelection;
