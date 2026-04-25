import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRefreshCw,
  FiEye,
  FiX,
  FiCheck,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";

import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Processed", label: "Processed" },
    { value: "Rejected", label: "Rejected" }
  ];

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);

      const response = await axios.get(
        `${baseUrl}/api/v1/return?${params}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setReturns(response.data.returnRequests);
      }
    } catch (error) {
      console.error("Failed to fetch returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReturn = async (orderId, status, refundAmount = 0, adminNotes = "") => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/return/${orderId}/process`,
        {
          status,
          refundAmount,
          adminNotes,
          refundMethod: "Original Payment Method",
        },
        { withCredentials: true }
      );
      setSuccess(`Return request ${status.toLowerCase()} successfully`);
      setSelectedReturn(null);
      fetchReturns();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to process return");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
    <AdminLayout title="Returns & Refunds">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-40">
            <AnimatedSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>
      </div>

      {/* Success/Error messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl overflow-hidden organic-card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
          </div>
        ) : returns.length === 0 ? (
          <div className="text-center py-12 text-[#7a6b54]">
            No return requests found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f0eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Requested
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#262626]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4a4bd]/10">
                {returns.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-[#fdf8f3] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#262626]">
                        {order.orderId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#262626]">
                        {order.userId?.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-[#5e5240] capitalize">
                          {order.returnRequest?.reason?.replace("_", " ") || "N/A"}
                        </p>
                        {order.returnRequest?.description && (
                          <p className="text-xs text-[#7a6b54] truncate max-w-xs">
                            {order.returnRequest.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#6b7d56]">
                        ₹{order.amount}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiClock size={14} className={getStatusColor(order.returnRequest?.status).includes("yellow") ? "text-yellow-600" : ""} />
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.returnRequest?.status
                          )}`}
                        >
                          {order.returnRequest?.status || "None"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7a6b54]">
                      {order.returnRequest?.requestDate
                        ? new Date(order.returnRequest.requestDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReturn(order)}
                        className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-colors organic-btn"
                        title="Process Return"
                      >
                        <FiEye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Return Modal */}
      <AnimatePresence>
        {selectedReturn && (
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
              className="bg-white rounded-2xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#262626]">
                    Process Return
                  </h2>
                  <p className="text-sm text-[#7a6b54] font-mono">
                    {selectedReturn.orderId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-[#fdf8f3] p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#262626] mb-2">
                    Return Request
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#7a6b54]">Reason</p>
                      <p className="text-sm text-[#5e5240] capitalize">
                        {selectedReturn.returnRequest?.reason?.replace("_", " ") ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#7a6b54]">Requested</p>
                      <p className="text-sm text-[#5e5240]">
                        {selectedReturn.returnRequest?.requestDate
                          ? new Date(
                              selectedReturn.returnRequest.requestDate
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {selectedReturn.returnRequest?.description && (
                    <div className="mt-3">
                      <p className="text-xs text-[#7a6b54]">Description</p>
                      <p className="text-sm text-[#5e5240]">
                        {selectedReturn.returnRequest.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-[#f5f0eb] p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#262626] mb-2">
                    Order Summary
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#7a6b54]">
                      Refund Amount
                    </span>
                    <span className="text-lg font-bold text-[#6b7d56]">
                      ₹{selectedReturn.amount}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a6b54] mt-1">
                    This amount will be refunded to the original payment method.
                  </p>
                </div>

                {selectedReturn.returnRequest?.status === "Pending" && (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleProcessReturn(selectedReturn._id, "Approved", selectedReturn.amount)
                      }
                      className="flex-1 organic-btn bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      <FiCheck size={16} />
                      Approve & Refund
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleProcessReturn(selectedReturn._id, "Rejected")
                      }
                      className="flex-1 organic-btn bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <FiXCircle size={16} />
                      Reject
                    </motion.button>
                  </div>
                )}

                {selectedReturn.returnRequest?.status === "Approved" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleProcessReturn(selectedReturn._id, "Processed")
                    }
                    className="w-full organic-btn bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <FiRefreshCw size={16} />
                    Mark as Refunded
                  </motion.button>
                )}

                {selectedReturn.returnRequest?.status === "Processed" && (
                  <div className="text-center py-4 text-green-600 bg-green-50 rounded-xl">
                    <p>Refund completed successfully</p>
                  </div>
                )}

                {selectedReturn.returnRequest?.status === "Rejected" && (
                  <div className="text-center py-4 text-red-600 bg-red-50 rounded-xl">
                    <p>This return request has been rejected</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminReturns;
