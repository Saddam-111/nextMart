import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchReturns();
    fetchEligibleOrders();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/return/user`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setReturns(response.data.returnRequests);
      }
    } catch (error) {
      console.error("Failed to fetch returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleOrders = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/order/userOrder`,
        {},
        { withCredentials: true }
      );
      if (response.data) {
        // Only delivered orders eligible for return
        const deliveredOrders = response.data.filter(
          (order) => order.status === "Delivered" && !order.returnRequest
        );
        setEligibleOrders(deliveredOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setSelectedOrder(order);
    }
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/return`,
        {
          orderId: selectedOrder.orderId,
          reason: formData.reason,
          description: formData.description,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess("Return request submitted successfully!");
        setShowModal(false);
        setFormData({ reason: "", description: "" });
        fetchReturns();
        fetchEligibleOrders();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-500" size={16} />;
      case "Pending":
        return <FiClock className="text-yellow-500" size={16} />;
      case "Approved":
        return <FiCheckCircle className="text-blue-500" size={16} />;
      case "Processed":
        return <FiRefreshCw className="text-green-500" size={16} />;
      case "Rejected":
        return <FiXCircle className="text-red-500" size={16} />;
      default:
        return <FiPackage size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Processed":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fdf8f3] py-12">
        <div className="max-w-4xl mt-6 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative">
            <button 
              onClick={() => window.history.back()} 
              className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-[#7a6b54] hover:text-[#e4a4bd] hidden lg:block"
            >
            Back
            </button>
            <div className="text-center pl-4 sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#262626]">
                Returns & Refunds
              </h1>
              <p className="text-[#7a6b54] mt-1 text-sm sm:text-base">
                Request returns for delivered orders
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenModal()}
              className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FiRefreshCw size={16} />
              New Return Request
            </motion.button>
          </div>

          {/* Success/Error */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Return Requests List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
              </div>
            ) : returns.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center organic-card">
                <FiPackage className="mx-auto text-4xl text-[#7a6b54] mb-4" />
                <h3 className="text-lg font-display font-semibold text-[#262626] mb-2">
                  No Return Requests
                </h3>
                <p className="text-[#7a6b54] mb-6">
                  You haven't made any return requests yet.
                </p>
                {eligibleOrders.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenModal()}
                    className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
                  >
                    Request Return
                  </motion.button>
                )}
              </div>
            ) : (
              returns.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden organic-card"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-[#262626] break-all">
                            {order.orderId}
                          </h3>
                          {getStatusIcon(order.returnRequest?.status)}
                        </div>
                        <p className="text-sm text-[#7a6b54]">
                          {order.items.length} item(s) • ₹{order.amount} total
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1.5 w-fit ${getStatusColor(
                          order.returnRequest?.status
                        )}`}
                      >
                        {order.returnRequest?.status || "N/A"}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {order.items?.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-14 h-14 rounded-lg bg-[#f5f0eb] overflow-hidden border border-[#e4a4bd]/20"
                        >
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover image-grayscale-hover"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Reason */}
                    {order.returnRequest?.reason && (
                      <div className="bg-[#fdf8f3] p-3 rounded-lg">
                        <p className="text-xs text-[#7a6b54] mb-1">
                          Reason: <span className="capitalize">{order.returnRequest.reason.replace("_", " ")}</span>
                        </p>
                        {order.returnRequest.description && (
                          <p className="text-sm text-[#5e5240]">
                            {order.returnRequest.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Timeline */}
                    {order.returnRequest && (
                      <div className="mt-4 pt-4 border-t border-[#e4a4bd]/10">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#7a6b54]">
                            Requested: {new Date(order.returnRequest.requestDate).toLocaleDateString()}
                          </span>
                          {order.returnRequest.processedDate && (
                            <span className="text-[#7a6b54]">
                              Processed: {new Date(order.returnRequest.processedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* New Return Request Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#262626]">
                    Request Return
                  </h2>
                  <p className="text-sm text-[#7a6b54]">
                    {selectedOrder?.orderId}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#262626] mb-2">
                    Return Reason
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="organic-input w-full"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong_item">Wrong Item Received</option>
                    <option value="damaged">Damaged in Transit</option>
                    <option value="not_as_described">Not as Described</option>
                    <option value="changed_mind">Changed Mind</option>
                    <option value="size_issue">Size/Fit Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262626] mb-2">
                    Additional Details <span className="text-[#7a6b54]">(optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="organic-input w-full"
                    rows={4}
                    placeholder="Please provide more details about your return request..."
                  />
                </div>

                <div className="bg-[#fdf8f3] p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#7a6b54]">Refund Amount</span>
                    <span className="font-bold text-[#6b7d56]">
                      ₹{selectedOrder?.amount}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a6b54]">
                    Amount will be refunded to your original payment method within 5-7 business days after approval.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#e4a4bd]/20">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-sm text-[#7a6b54] hover:text-[#262626]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Returns;
