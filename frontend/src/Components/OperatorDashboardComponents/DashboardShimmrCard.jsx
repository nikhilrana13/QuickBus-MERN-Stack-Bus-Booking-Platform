const ShimmerCard = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 border-t-4 border-gray-300 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          {/* Number */}
          <div className="h-7 w-16 bg-gray-200 rounded mb-2"></div>
          {/* Label */}
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        {/* Icon */}
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default ShimmerCard;