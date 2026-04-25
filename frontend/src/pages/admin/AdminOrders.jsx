import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPlus,
  FiDownload,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";

import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const statusOptions = [
    "Order Placed",
    "Order Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
    "Refunded",
  ];

  const statusOptionsObj = statusOptions.map(status => ({ value: status, label: status }));
  const statusFilterOptions = [
    { value: "", label: "All Status" },
    ...statusOptionsObj
  ];

  const paymentFilterOptions = [
    { value: "", label: "All Payments" },
    { value: "COD", label: "Cash on Delivery" },
    { value: "Razorpay", label: "Razorpay" }
  ];

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentMethod: paymentFilter }),
        ...(search && { search }),
      });

      const response = await axios.get(
        `${baseUrl}/api/v1/order/all?${params}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <AdminLayout title="Orders Management">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="organic-input pl-10 w-full sm:w-64"
            />
          </div>

          <div className="w-full sm:w-40">
            <AnimatedSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={statusFilterOptions}
            />
          </div>

          <div className="w-full sm:w-40">
            <AnimatedSelect
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              options={paymentFilterOptions}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl overflow-hidden organic-card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-[#7a6b54]">
            No orders found
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
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#262626]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4a4bd]/10">
                {orders.map((order, index) => (
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
                      <div>
                        <p className="text-sm font-medium text-[#262626]">
                          {order.userId?.name || "Guest"}
                        </p>
                        <p className="text-xs text-[#7a6b54]">
                          {order.userId?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-[#f5f0eb] border-2 border-white overflow-hidden"
                          >
                            {item.images && item.images[0] && (
                              <img
                                src={item.images[0].url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-[#e4a4bd] border-2 border-white flex items-center justify-center text-xs text-white">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#6b7d56]">
                        ₹{order.amount}
                      </p>
                      <p className="text-xs text-[#7a6b54]">
                        {order.paymentMethod} •{" "}
                        {order.payment ? "Paid" : "Pending"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled" ||
                              order.status === "Refunded"
                            ? "bg-red-100 text-red-700"
                            : order.status === "Returned"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7a6b54]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-colors organic-btn"
                        title="View Details"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4a4bd]/20">
            <p className="text-sm text-[#7a6b54]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-[#e4a4bd]/30 rounded-md disabled:opacity-50 hover:bg-[#f5f0eb]"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-[#e4a4bd]/30 rounded-md disabled:opacity-50 hover:bg-[#f5f0eb]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
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
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-[#262626]">
                    Order Details
                  </h2>
                  <p className="text-sm text-[#7a6b54] font-mono">
                    {selectedOrder.orderId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#fdf8f3] p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-[#262626] mb-2">
                      Customer Information
                    </h4>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.userId?.name}
                    </p>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.userId?.email}
                    </p>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.address?.phone}
                    </p>
                  </div>

                  <div className="bg-[#fdf8f3] p-4 rounded-xl">
                    <h4 className="text-sm font-semibold text-[#262626] mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.address?.firstName}{" "}
                      {selectedOrder.address?.lastName}
                    </p>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.address?.street}
                    </p>
                    <p className="text-sm text-[#5e5240]">
                      {selectedOrder.address?.city},{" "}
                      {selectedOrder.address?.state}{" "}
                      {selectedOrder.address?.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-semibold text-[#262626] mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 bg-[#f5f0eb] rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#262626]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#7a6b54]">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-[#6b7d56]">
                            ₹{item.price} × {item.quantity}
                          </p>
                          <p className="text-xs text-[#7a6b54]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Status */}
                <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-[#e4a4bd]/20">
                  <div className="text-xl font-bold text-[#262626]">
                    Total: ₹{selectedOrder.amount}
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatedSelect
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleStatusUpdate(selectedOrder._id, e.target.value)
                      }
                      options={statusOptionsObj}
                      className="w-48"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminOrders;
