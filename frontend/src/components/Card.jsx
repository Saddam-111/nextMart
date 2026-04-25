import React, { useContext } from "react";
import { ShopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../context/WishlistContext";

const Card = ({ name, image, id, price }) => {
  const navigate = useNavigate();
  const { currency } = useContext(ShopDataContext);
  const { wishlist, addToWishlist, removeFromWishlist, loading } = useWishlist();
  
  const isInWishlist = wishlist.some(item => item._id && item._id.toString() === id.toString());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover="hover"
      variants={{
        hover: { 
          y: -6,
          transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        },
      }}
      onClick={() => navigate(`/product-details/${id}`)}
      className="bg-[#fdf8f3] rounded-3xl p-4 cursor-pointer flex flex-col organic-card relative"
    >
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3">
        <button
          onClick={async () => {
            if (isInWishlist) {
              await removeFromWishlist(id);
            } else {
              await addToWishlist(id);
            }
          }}
          className={`p-2 rounded-full transition-all-slow ${
            isInWishlist ? "text-[#e4a4bd]" : "text-gray-400 hover:text-[#e4a4bd]"
          }`}
          disabled={loading}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-primary-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : (
            isInWishlist ? <AiFillHeart className="h-4 w-4" /> : <AiOutlineHeart className="h-4 w-4" />
          )}
        </button>
      </div>

      <motion.div
        className="w-full h-56 flex items-center justify-center overflow-hidden rounded-2xl bg-[#f3efe8] image-grayscale-hover"
        whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
      >
        <motion.img
          src={image.url}
          alt={name}
          className="object-contain max-h-full"
          whileHover={{ scale: 1.08, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        />
      </motion.div>

      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-[#262626] font-medium text-lg truncate font-body">
          {name}
        </h3>
        <p className="text-[#e4a4bd] font-semibold mt-2 font-body">
          {currency}
          {price}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        onClick={() => navigate(`/product-details/${id}`)}
        className="mt-4 w-full organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446]"
      >
        View Details
      </motion.button>
    </motion.div>
  );
};

export default Card;

