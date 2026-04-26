import React, { useState } from "react";
import Title from "./Title";
import { motion } from "framer-motion";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-[#f3efe8] py-14 px-6 md:px-16 text-center rounded-3xl mx-4 my-8 organic-card"
    >
      <Title text1={"Subscribe to"} text2={"Our Newsletter"} />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[#7a6b54] mb-6 text-sm md:text-base font-body"
      >
        Get the latest updates about new arrivals, special deals, and exclusive offers.
      </motion.p>
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
      >
        <motion.input
          whileFocus={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full sm:flex-1 organic-input"
        />
        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          type="submit"
          className="organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446] px-8"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  );
};

export default NewsLetter;
