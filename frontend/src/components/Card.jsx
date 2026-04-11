import React, { useContext } from "react";
import { ShopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Card = ({ name, image, id, price }) => {
  const navigate = useNavigate();
  const { currency } = useContext(ShopDataContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover="hover"
      variants={{
        hover: { y: -6 },
      }}
      onClick={() => navigate(`/product-details/${id}`)}
      className="bg-[#fdfbf7] rounded-3xl p-4 cursor-pointer flex flex-col organic-card"
    >
      <motion.div
        className="w-full h-56 flex items-center justify-center overflow-hidden rounded-2xl bg-[#f3efe8]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.img
          src={image.url}
          alt={name}
          className="object-contain max-h-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </motion.div>

      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-[#5e5240] font-medium text-lg truncate font-body">
          {name}
        </h3>
        <p className="text-[#6b7d56] font-semibold mt-2 font-body">
          {currency}
          {price}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 w-full bg-[#9e866b] hover:bg-[#7a6b54] text-white py-2.5 rounded-xl font-medium transition-colors font-body"
      >
        View Details
      </motion.button>
    </motion.div>
  );
};

export default Card;