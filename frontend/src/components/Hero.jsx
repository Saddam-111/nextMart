import React, { useEffect, useState } from "react";
import { banners } from "../assets/asset";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

   // Auto Slide Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="relative w-[90%] mx-auto h-[30vh] md:h-[35vh] lg:h-[45vh] bg-gray-100 overflow-hidden mt-[70px]">
      {/* Images */}
      <div
        className="flex transition-transform ease-in-out duration-700 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <img
            src={banner}
            key={index}
            className="w-full flex-shrink-0 object-contain h-full"
            alt={`banner-${index}`}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition"
      >
        <FaArrowLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition"
      >
        <FaArrowRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              index === currentIndex
                ? "bg-indigo-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
