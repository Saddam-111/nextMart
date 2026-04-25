import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiOutlineDelete, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, moveToCart } = useWishlist();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdf8f3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdf8f3] text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          <button 
            onClick={() => window.history.back()} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-[#7a6b54] hover:text-[#e4a4bd] hidden md:block"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#262626]">My Wishlist</h1>
            <p className="text-[#7a6b54] mt-1">Saved items you love</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-[#e4a4bd]/10"
          >
            <AiOutlineHeart className="mx-auto text-gray-300 h-20 w-20 mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2 text-[#262626]">Your wishlist is empty</h2>
            <p className="text-[#7a6b54] mb-8 max-w-sm mx-auto">
              Save items you like in your wishlist to find them easily later.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/collection")}
              className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] px-8"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col md:flex-row items-center p-6 organic-card bg-white hover:shadow-md transition-all border border-[#e4a4bd]/10 rounded-[2rem]"
                >
                  {/* Product Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#f3efe8]">
                    <img
                      src={product.images && product.images[0] ? product.images[0].url : "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 mt-6 md:mt-0 md:pl-8 text-center md:text-left">
                    <h2 className="text-xl font-display font-bold text-[#262626] mb-1">{product.name}</h2>
                    <p className="text-sm text-[#7a6b54] mb-3">{product.category}</p>
                    <p className="text-2xl font-bold text-[#6b7d56] mb-6">₹{product.price}</p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => moveToCart(product._id, product.sizes && product.sizes[0] || "Normal")}
                        className="organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446] flex items-center gap-2"
                      >
                        <AiOutlineShoppingCart size={18} />
                        Move to Cart
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="Remove from Wishlist"
                      >
                        <AiOutlineDelete size={20} />
                      </motion.button>
                      
                      <Link
                        to={`/product/${product._id}`}
                        className="text-sm font-bold text-[#e4a4bd] hover:underline underline-offset-4"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
