import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import { FaBus } from "react-icons/fa";
import { Autoplay } from "swiper/modules";

const testimonials = [
  {
    id: 1,
    name: "Rohit Malhotra",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    feedback:
      "QuickBus made managing my bus bookings super easy. My passengers love the seamless experience!",
    rating: 5,
  },
  {
    id: 2,
    name: "Sneha Patel",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback:
      "As a QuickBus operator, I can track bookings and payments effortlessly. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Arjun Khanna",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    feedback:
      "The platform is very user-friendly and reliable. I’ve increased my revenue thanks to QuickBus!",
    rating: 5,
  },
  {
    id: 4,
    name: "Meera Nair",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    feedback:
      "QuickBus support is amazing. They helped me set up my buses and manage bookings efficiently.",
    rating: 4,
  },
  {
    id: 5,
    name: "Kabir Singh",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    feedback:
      "The QuickBus dashboard is intuitive and easy to use. I can now focus on running my business smoothly.",
    rating: 5,
  },
];

const OperatorTestimonials = () => {
  return (
   <section className="relative py-16 bg-gradient-to-r from-[#D63941] to-[#FECACA] overflow-hidden">
      {/* Background buses */}
      <div className="absolute inset-0 opacity-10 flex flex-wrap items-center justify-center pointer-events-none">
        {Array(20)
          .fill()
          .map((_, i) => (
            <FaBus key={i} className="text-white w-12 h-12 m-4 animate-bounce-slow" />
          ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-white mb-12">
          What Our Operators Say
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000 }}
          loop={true}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white p-6 rounded-xl h-full flex flex-col min-h-[200px] gap-4 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D63941]"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-[#012047]">{t.name}</h4>
                    <div className="flex gap-1 text-[#D63941]">
                      {Array(t.rating)
                        .fill()
                        .map((_, i) => (
                          <Star key={i} fill="currentColor" className="w-4 h-4" />
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-[500]">{t.feedback}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default OperatorTestimonials