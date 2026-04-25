import React from "react";
import { motion } from "framer-motion";

const Title = ({ text1, text2 }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-3xl md:text-4xl font-display font-bold text-[#262626] tracking-tighter"
    >
      {text1} <span className="text-[#e4a4bd]">{text2}</span>
    </motion.h2>
  );
};

export default Title;
