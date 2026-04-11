import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import { AuthDataContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const { currency } = useContext(ShopDataContext);
  const { baseUrl } = useContext(AuthDataContext);

  const loadOrderData = async () => {
    try {
      const result = await axios.post(
        baseUrl + "/api/v1/order/userOrder",
        {},
        { withCredentials: true }
      );

      if (result.data) {
        let allOrdersItem = [];

        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 md:px-12 py-8 max-w-7xl mx-auto mt-20"
      >
        <div className="mb-8 text-center">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>

        {orderData.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#7a6b54]"
          >
            No orders found
          </motion.p>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orderData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 border border-[#d9cec0] rounded-3xl bg-[#fdfbf7] hover:shadow-md transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-28 h-28 flex-shrink-0"
                  >
                    <img
                      src={item.image1?.url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>

                  <div className="flex flex-col md:flex-row justify-between w-full gap-6">
                    <div className="flex flex-col space-y-2">
                      <p className="font-display font-semibold text-lg text-[#5e5240]">{item.name}</p>
                      <p className="text-[#6b7d56] font-medium">
                        {currency} {item.price}
                      </p>
                      <p className="text-[#7a6b54]">Quantity: {item.quantity}</p>
                      <p className="text-[#9e866b]">Size: {item.size}</p>
                      <p className="text-[#b39f87] text-sm">
                        {new Date(item.date).toDateString()}
                      </p>
                      <p className="text-[#7a6b54] text-sm">
                        Payment Method:{" "}
                        <span className="font-medium text-[#5e5240]">{item.paymentMethod}</span>
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          item.payment === "Paid" ? "text-[#6b7d56]" : "text-[#965639]"
                        }`}
                      >
                        {item.payment}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center items-start md:items-end space-y-2">
                      <p className="text-sm text-[#9e866b]">Status</p>
                      <p
                        className={`font-display font-semibold ${
                          item.status === "Delivered" ? "text-[#6b7d56]" : "text-[#9e866b]"
                        }`}
                      >
                        {item.status}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={loadOrderData}
                        className="mt-2 px-4 py-2 rounded-xl bg-[#6b7d56] text-white text-sm font-medium hover:bg-[#5d6446] transition-colors"
                      >
                        Track Order
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
      <Footer />
    </>
  );
};

export default Orders;