import React from "react";
import { FaShippingFast, FaUndoAlt, FaHeadset, FaLock } from "react-icons/fa";
import Title from "./Title";
import { motion } from "framer-motion";

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaShippingFast className="text-4xl text-[#6b7d56]" />,
      title: "Free Shipping",
      desc: "Enjoy free shipping on all orders above $50.",
    },
    {
      icon: <FaUndoAlt className="text-4xl text-[#9e866b]" />,
      title: "Easy Returns",
      desc: "Hassle-free returns within 7 days of purchase.",
    },
    {
      icon: <FaHeadset className="text-4xl text-[#262626]" />,
      title: "24/7 Support",
      desc: "We are here to assist you round the clock.",
    },
    {
      icon: <FaLock className="text-4xl text-[#965639]" />,
      title: "Secure Payments",
      desc: "Your transactions are protected with top security.",
    },
  ];

  return (
    <div className="text-center px-4 md:px-16 mt-8">
      <Title text1={"OUR"} text2={"POLICY"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-7xl mx-auto">
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            className="flex flex-col items-center text-center bg-[#fdf8f3] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all-slow organic-card"
          >
            <motion.div
              whileHover={{ scale: 1.1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              className="mb-4"
            >
              {policy.icon}
            </motion.div>
            <h3 className="text-lg font-display font-semibold text-[#262626] mb-2">
              {policy.title}
            </h3>
            <p className="text-[#7a6b54] text-sm font-body">{policy.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
