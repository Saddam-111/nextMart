import React, { useEffect, useState } from "react";
import { banners } from "../assets/asset";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const heroVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};



const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[90%] mx-auto h-[30vh] md:h-[35vh] lg:h-[45vh] overflow-hidden mt-[70px] rounded-3xl">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={heroVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={banners[currentIndex]}
            className="w-full h-full object-cover"
            alt={`banner-${currentIndex}`}
          />
        </motion.div>
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1, backgroundColor: "#e4a4bd", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.9, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:text-white transition-all-slow z-10"
      >
        <FaArrowLeft className="text-[#e4a4bd]" />
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1, backgroundColor: "#e4a4bd", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.9, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:text-white transition-all-slow z-10"
      >
        <FaArrowRight className="text-[#e4a4bd]" />
      </motion.button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {banners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`relative h-3 rounded-full transition-all-slow ${
              index === currentIndex ? "w-8 bg-[#e4a4bd]" : "w-3 bg-white/70"
            }`}
            whileHover={{ scale: 1.2, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          >
            {index === currentIndex && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-0 bg-[#e4a4bd] rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
