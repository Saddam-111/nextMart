import React from "react";
import { motion } from "framer-motion";

const Title = ({ text1, text2 }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-3xl md:text-4xl font-display font-semibold text-[#5e5240] tracking-wide"
    >
      {text1} <span className="text-[#9e866b]">{text2}</span>
    </motion.h2>
  );
};

export default Title;