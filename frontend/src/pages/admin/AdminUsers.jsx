import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiEdit,
  FiUserCheck,
} from "react-icons/fi";
import { FaBan } from "react-icons/fa";
import AdminLayout from "../../components/layout/AdminLayout";

import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const statusOptions = [
    { value: "", label: "All Users" },
    { value: "active", label: "Active" },
    { value: "blocked", label: "Blocked" }
  ];

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);

      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/all?${params}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      await axios.put(
        `${baseUrl}/api/v1/admin/users/${userId}/block`,
        { isBlocked: !isBlocked },
        { withCredentials: true }
      );
      setSuccess(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Action failed");
    }
  };

  // Get detailed user info
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/${userId}/details`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSelectedUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  return (
    <AdminLayout title="Users Management">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="organic-input pl-10 w-full sm:w-64"
            />
          </div>

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

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden organic-card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-[#7a6b54]">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f0eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#262626]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4a4bd]/10">
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-[#fdf8f3] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e4a4bd] flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-[#262626]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#7a6b54]">
                            {user.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#5e5240]">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#262626]">
                        {user.orderStats?.totalOrders || 0}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#6b7d56]">
                        ₹{user.orderStats?.totalSpent || 0}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7a6b54]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => fetchUserDetails(user._id)}
                          className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                          className={`p-2 transition-colors ${
                            user.isBlocked
                              ? "text-green-600 hover:text-green-700"
                              : "text-red-600 hover:text-red-700"
                          }`}
                          title={user.isBlocked ? "Unblock" : "Block"}
                        >
                          {user.isBlocked ? (
                            <FiCheckCircle size={16} />
                          ) : (
                            <FaBan size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
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
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-[#262626]">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Profile */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#e4a4bd] flex items-center justify-center text-white text-2xl font-bold">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#262626]">
                      {selectedUser.name}
                    </h3>
                    <p className="text-[#7a6b54]">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-sm text-[#7a6b54]">
                        {selectedUser.phone}
                      </p>
                    )}
                    {selectedUser.address && (
                      <p className="text-sm text-[#7a6b54]mt-1">
                        {selectedUser.address.city}, {selectedUser.address.state}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedUser.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {selectedUser.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#fdf8f3] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#262626]">
                      {selectedUser.orderStats?.totalOrders || 0}
                    </p>
                    <p className="text-xs text-[#7a6b54] uppercase tracking-wide">
                      Orders
                    </p>
                  </div>
                  <div className="bg-[#fdf8f3] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#6b7d56]">
                      ₹{selectedUser.orderStats?.totalSpent || 0}
                    </p>
                    <p className="text-xs text-[#7a6b54] uppercase tracking-wide">
                      Spent
                    </p>
                  </div>
                  <div className="bg-[#fdf8f3] p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-[#965639]">
                      {new Date(selectedUser.createdAt).getFullYear()}
                    </p>
                    <p className="text-xs text-[#7a6b54] uppercase tracking-wide">
                      Joined
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                {selectedUser.recentOrders?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#262626] mb-3">
                      Recent Orders
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.recentOrders.slice(0, 5).map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-3 bg-[#f5f0eb] rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#262626]">
                              {order.orderId}
                            </p>
                            <p className="text-xs text-[#7a6b54]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#6b7d56]">
                              ₹{order.amount}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#e4a4bd]/20">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleBlockToggle(selectedUser._id, selectedUser.isBlocked);
                      setSelectedUser({
                        ...selectedUser,
                        isBlocked: !selectedUser.isBlocked,
                      });
                    }}
                    className={`flex-1 organic-btn ${
                      selectedUser.isBlocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                  </motion.button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-2 text-sm text-[#7a6b54] hover:text-[#262626]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUsers;
