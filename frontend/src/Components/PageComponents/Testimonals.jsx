import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";


const Testimonials = () => {
  const testimonials = [
  {
    name: "Riya Sharma",
    review:
      "QuickBus se booking karna bahut easy aur fast tha! Prices bhi saste mile aur customer support bhi helpful tha.",
    location: "Delhi",
    rating: 5,
  },
  {
    name: "Amit Verma",
    review:
      "Bus timing accurate thi aur seat bhi comfortable thi. Definitely next time bhi QuickBus se hi book karunga!",
    location: "Lucknow",
    rating: 4,
  },
  {
    name: "Sneha Patil",
    review:
      "Bahut accha experience tha. Interface clean hai aur offers bhi milte hain. Redbus se bhi better lagta hai!",
    location: "Pune",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    review:
      "QuickBus app ne mera trip easy bana diya. Notifications aur updates time par milte rahe.",
    location: "Bangalore",
    rating: 5,
  },
];
  return (
   <section className="py-16 bg-gray-50 md:mt-[10rem]">
      <div className="max-w-6xl mx-auto text-center px-5">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-10">
          What Our Customers Say
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">"{item.review}"</p>
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
