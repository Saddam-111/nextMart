import React, { useContext, useEffect, useState } from "react";
import Title from "../../components/user/Title";
import { ShopDataContext } from "../../context/user/ShopContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import CartTotal from "../../components/user/CartTotal";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const { products, cartItem, updateQuantity, currency } = useContext(ShopDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <Navbar />
      <div className="px-6 pt-[120px] md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="flex-1">
            <Title text1="SHOPPING" text2="BAG" />
            <p className="text-[#7a6b54] mt-2 text-sm font-medium">
              You have {cartData.length} unique items in your selection
            </p>
          </div>
          {cartData.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/collection")}
              className="text-sm font-bold text-[#6b7d56] flex items-center gap-2 hover:opacity-80 transition-all underline underline-offset-4"
            >
              Continue Shopping <FiArrowRight />
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {}
          <div className="lg:col-span-2">
            {cartData.length > 0 ? (
              <div className="space-y-6">
                <AnimatePresence>
                  {cartData.map((item, index) => {
                    const productData = products.find(
                      (product) => String(product._id) === String(item._id)
                    );

                    if (!productData) return null;

                    return (
                      <motion.div
                        key={`${item._id}-${item.size}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group relative bg-white/40 backdrop-blur-sm border border-white/60 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
                      >
                        {}
                        <div className="w-full sm:w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-2xl bg-[#f3efe8]">
                          <img
                            src={productData.image1.url}
                            alt={productData.name}
                            className="w-full h-full object-contain p-2 transform transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {}
                        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                          <h3 className="font-display font-bold text-lg text-[#3d352b] group-hover:text-[#6b7d56] transition-colors">
                            {productData.name}
                          </h3>
                          <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                            <span className="px-3 py-1 bg-[#f3efe8] text-[#7a6b54] text-xs font-bold rounded-full border border-[#e4a4bd]/20">
                              Size: {item.size}
                            </span>
                            <span className="text-[#6b7d56] font-bold">
                              {currency}{productData.price}
                            </span>
                          </div>
                        </div>

                        {}
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          {}
                          <div className="flex items-center bg-white border border-[#e4a4bd]/30 rounded-2xl p-1 shadow-inner">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                              className="p-2 hover:text-[#6b7d56] transition-colors"
                            >
                              <FiMinus size={14} />
                            </motion.button>
                            <span className="w-8 text-center font-bold text-sm text-[#3d352b]">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className="p-2 hover:text-[#6b7d56] transition-colors"
                            >
                              <FiPlus size={14} />
                            </motion.button>
                          </div>

                          {}
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <RiDeleteBin6Line size={18} />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-10 text-center"
              >
                <div className="w-32 h-32 bg-[#f3efe8] rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <FiShoppingBag size={48} className="text-[#e4a4bd]" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#3d352b] mb-2">Your Bag is Empty</h3>
                <p className="text-[#7a6b54] max-w-xs mb-8">
                  Looks like you haven't added anything to your selection yet. Explore our collections and find something you love!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/collection")}
                  className="organic-btn bg-[#6b7d56] text-white px-8 py-3 flex items-center gap-2"
                >
                  Start Shopping <FiArrowRight />
                </motion.button>
              </motion.div>
            )}
          </div>

          {}
          {cartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32">
                <CartTotal />
                
                {}
                <div className="mt-6 space-y-4">
                  <div className="bg-white/50 p-4 rounded-3xl border border-white flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                      <FiArrowRight />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3d352b]">Secure Checkout</p>
                      <p className="text-[10px] text-[#7a6b54]">SSL Encrypted Payment System</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

