import React, { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const { baseUrl } = useContext(AuthDataContext);
  const [orders, setOrders] = useState([]);

  const fetchAllList = async () => {
    try {
      const result = await axios.get(baseUrl + "/api/v1/order/orderList", {
        withCredentials: true,
      });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (e, orderId) => {
    try {
      const result = await axios.post(
        baseUrl + "/api/v1/order/status",
        { orderId, status: e.target.value },
        { withCredentials: true }
      );
      if (result.data) {
        await fetchAllList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllList();
  }, []);

  const statusOptions = ["Packing", "Shipped", "Out for delivery", "Delivered"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 mb-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold mb-4 text-[#5e5240]"
      >
        All Orders
      </motion.h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-[#d9cec0] rounded-2xl p-4 shadow bg-[#fdfbf7]"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#d9cec0] pb-2 mb-3">
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <FaBox className="text-[#6b7d56]" />
                    <h3 className="font-display font-semibold text-sm sm:text-base text-[#5e5240]">
                      Order #{index + 1} - {order._id}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm sm:text-base font-semibold text-[#7a6b54]">
                      Status:
                    </span>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      onChange={(e) => handleStatus(e, order._id)}
                      value={order.status}
                      className="border border-[#d9cec0] px-2 py-1 rounded-xl w-full sm:w-auto text-sm sm:text-base bg-white focus:outline-none focus:border-[#6b7d56] font-body"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-display font-semibold mb-2 text-sm sm:text-base text-[#5e5240]">
                    Items:
                  </h4>
                  <div className="space-y-2">
                    {order.items?.map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-[#d9cec0] rounded-xl p-2 bg-[#f3efe8]"
                      >
                        <img
                          src={item.image1?.url || "/placeholder.png"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                          <div>
                            <p className="font-medium text-[#5e5240]">{item.name.toUpperCase()}</p>
                            <p className="text-sm text-[#7a6b54]">
                              Qty: {item.quantity} {item.size && <span>({item.size})</span>}
                            </p>
                          </div>
                          <p className="text-[#6b7d56] font-semibold text-sm sm:text-base">
                            ₹{item.price}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mb-3 text-sm sm:text-base">
                  <h4 className="font-display font-semibold mb-1 text-[#5e5240]">Shipping Address:</h4>
                  <p className="text-[#7a6b54]">
                    {order.address?.firstName} {order.address?.lastName},{" "}
                    {order.address?.street}, {order.address?.city},{" "}
                    {order.address?.state}, {order.address?.pincode}
                  </p>
                  <p className="text-[#7a6b54]">Phone: {order.address?.phone || "N/A"}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base text-[#5e5240]">
                  <p>
                    <span className="font-semibold">Items:</span> {order.items?.length}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹{order.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
                  </p>
                  <p>
                    <span className="font-semibold">Payment Status:</span>{" "}
                    {order.payment ? (
                      <span className="text-[#6b7d56] font-semibold">Paid</span>
                    ) : (
                      <span className="text-[#965639] font-semibold">Pending</span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Order Date:</span>{" "}
                    {new Date(order.date).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {order.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#7a6b54]"
        >
          No orders found.
        </motion.p>
      )}
    </motion.div>
  );
};

export default Orders;