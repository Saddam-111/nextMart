import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopDataContext } from "../../context/user/ShopContext";
import { AuthDataContext } from "../../context/user/AuthContext";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiEye, FiFile } from "react-icons/fi";
import OrderTrackingTimeline from "../../components/user/OrderTrackingTimeline";
import { FiRefreshCw } from "react-icons/fi";
const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const { currency } = useContext(ShopDataContext);
  const { baseUrl } = useContext(AuthDataContext);
  const navigate = useNavigate();

  const loadOrderData = useCallback(async () => {
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
              orderId: order.orderId,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              _id: order._id,
              amount: order.amount,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const downloadInvoice = (orderId) => {
    window.open(`${baseUrl}/api/v1/invoice/${orderId}`, "_blank");
  };

  const requestReturn = (orderId) => {
    navigate(`/returns?orderId=${orderId}`);
  };

  const canReturn = (status) => {
    return status === "Delivered";
  };

  
  const loadOrderDetails = async (orderId) => {
    try {
      setTrackingLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/order/${orderId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setTrackingOrder(response.data.order);
      }
    } catch (error) {
      console.error("Failed to load order details:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const closeTracking = () => {
    setTrackingOrder(null);
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 md:px-12 py-8 max-w-7xl mx-auto mt-20"
      >
        <div className="mb-8 text-center relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-colors"
          >
            Back
          </button>
          <h1 className="text-3xl font-display font-bold text-[#262626] tracking-tighter">
            MY ORDERS
          </h1>
          <p className="text-[#7a6b54] mt-2">
            Track and manage your orders
          </p>
        </div>

        {orderData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-3xl organic-card"
          >
            <FiEye className="mx-auto text-6xl text-[#e4a4bd] mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#262626]">
              No orders yet
            </h2>
            <p className="text-[#7a6b54] mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders yet. Start exploring our
              products!
            </p>
            <Link
              to="/collection"
              className="inline-block organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orderData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col lg:flex-row items-start gap-6 p-6 border border-[#e4a4bd]/30 rounded-3xl bg-white hover:shadow-lg transition-all-slow organic-card"
                >
                  {}
                  <motion.div
                    whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                    className="w-28 h-28 flex-shrink-0 rounded-xl bg-[#fdf8f3] overflow-hidden"
                  >
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover image-grayscale-hover"
                    />
                  </motion.div>

                  {}
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-[#262626]">
                          {item.name}
                        </h3>
                        <p className="text-sm font-mono text-[#7a6b54]">
                          Order #{item.orderId}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium ${
                          item.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : item.status === "Returned"
                            ? "bg-orange-100 text-orange-700"
                            : item.status === "Refunded"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                      <div>
                        <span className="text-[#7a6b54]">Quantity:</span>{" "}
                        <span className="font-medium text-[#262626]">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#7a6b54]">Size:</span>{" "}
                        <span className="font-medium text-[#262626]">{item.size}</span>
                      </div>
                      <div>
                        <span className="text-[#7a6b54]">Payment:</span>{" "}
                        <span
                          className={
                            item.payment === "Paid"
                              ? "text-[#6b7d56] font-medium"
                              : "text-[#965639] font-medium"
                          }
                        >
                          {item.payment} • {item.paymentMethod}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#7a6b54]">Date:</span>{" "}
                        <span className="text-[#262626]">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#e4a4bd]/10">
                      {}
                      <motion.button
                        whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadInvoice(item.orderId)}
                        className="px-4 py-2 text-sm organic-btn bg-[#f5f0eb] text-[#5e5240] hover:bg-[#e8e0d3] flex items-center gap-2"
                      >
                        <FiDownload size={14} />
                        Invoice
                      </motion.button>

                      {}
                      <motion.button
                        whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setTrackingOrder(null);
                          loadOrderDetails(item.orderId).then(() => {
                            if (!trackingOrder) setTrackingOrder({ orderId: item.orderId });
                          });
                        }}
                        className="px-4 py-2 text-sm organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446] flex items-center gap-2"
                      >
                        <FiEye size={14} />
                        Track Order
                      </motion.button>

                      {}
                      {canReturn(item.status) && (
                        <motion.button
                          whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => requestReturn(item.orderId)}
                          className="px-4 py-2 text-sm organic-btn bg-[#e8e0d3] text-[#5e5240] hover:bg-[#d9d0c3] flex items-center gap-2"
                        >
                          <FiRefreshCw size={14} />
                          Request Return
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="lg:text-right lg:ml-4">
                    <p className="text-sm text-[#7a6b54] mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-[#6b7d56]">
                      {currency} {item.price * item.quantity}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {}
        <AnimatePresence>
          {trackingOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={closeTracking}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-bold text-[#262626]">
                      Order Tracking
                    </h2>
                    <p className="text-sm text-[#7a6b54] font-mono">
                      {trackingOrder.orderId}
                    </p>
                  </div>
                  <button
                    onClick={closeTracking}
                    className="text-[#7a6b54] hover:text-[#262626] text-2xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-6">
                  {trackingLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e4a4bd]"></div>
                  </div>
                  ) : (
                    <OrderTrackingTimeline
                      status={trackingOrder.status}
                      timeline={trackingOrder.timeline}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </>
  );
};

export default Orders;

