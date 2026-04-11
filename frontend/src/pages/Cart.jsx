import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from "../components/CartTotal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const { products, cartItem, updateQuantity } = useContext(ShopDataContext);

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
    <>
      <Navbar />
      <div className="px-6 pt-[100px] md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        <Title text1="YOUR" text2="CART" />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartData.length > 0 ? (
              <AnimatePresence>
                {cartData.map((item, index) => {
                  const productData = products.find(
                    (product) => String(product._id) === String(item._id)
                  );

                  if (!productData) return null;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-6 border-b border-[#d9cec0] pb-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-24 flex-shrink-0"
                      >
                        <img
                          src={productData.image1.url}
                          alt={productData.name}
                          className="w-full h-full object-contain rounded-xl bg-[#f3efe8]"
                        />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-[#3d352b]">
                          {productData.name}
                        </h3>
                        <p className="text-sm text-[#7a6b54]">Size: {item.size}</p>
                        <p className="font-medium text-[#6b7d56] mt-1">
                          ₹{productData.price}
                        </p>
                      </div>

                      <motion.input
                        whileFocus={{ scale: 1.1 }}
                        type="number"
                        min={1}
                        defaultValue={item.quantity}
                        className="w-16 border border-[#d9cec0] rounded-lg px-2 py-2 text-center bg-white focus:outline-none focus:border-[#6b7d56]"
                        onChange={(e) =>
                          e.target.value === "" || e.target.value === "0"
                            ? null
                            : updateQuantity(
                                item._id,
                                item.size,
                                Number(e.target.value)
                              )
                        }
                      />

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="text-[#965639] cursor-pointer hover:text-[#7a4b2e] transition-colors"
                      >
                        <RiDeleteBin6Line size={24} />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-40 w-[80%] mx-auto flex justify-center items-center"
              >
                <p className="text-[#7a6b54]">Your cart is empty.</p>
              </motion.div>
            )}
          </div>

          {cartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <CartTotal />
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;