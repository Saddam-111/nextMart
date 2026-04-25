import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiPercent,
  FiTag,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrderValue: "0",
    maxDiscount: "",
    usageLimit: "",
    userUsageLimit: "1",
    validFrom: "",
    validUntil: "",
    applicableCategories: "",
    applicableProducts: "",
    applicableUsers: "",
    firstTimeUsersOnly: false,
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const couponTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed Amount" }
  ];

  useEffect(() => {
    fetchCoupons();
  }, [search]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await axios.get(
        `${baseUrl}/api/v1/coupon?${params}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        type: coupon.type || "percentage",
        value: coupon.value || "",
        minOrderValue: coupon.minOrderValue || "0",
        maxDiscount: coupon.maxDiscount || "",
        usageLimit: coupon.usageLimit || "",
        userUsageLimit: coupon.userUsageLimit || "1",
        validFrom: coupon.validFrom?.split("T")[0] || "",
        validUntil: coupon.validUntil?.split("T")[0] || "",
        applicableCategories: coupon.applicableCategories?.join(", ") || "",
        applicableProducts: coupon.applicableProducts?.join(", ") || "",
        applicableUsers: coupon.applicableUsers?.join(", ") || "",
        firstTimeUsersOnly: coupon.firstTimeUsersOnly || false,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        description: "",
        type: "percentage",
        value: "",
        minOrderValue: "0",
        maxDiscount: "",
        usageLimit: "",
        userUsageLimit: "1",
        validFrom: "",
        validUntil: "",
        applicableCategories: "",
        applicableProducts: "",
        applicableUsers: "",
        firstTimeUsersOnly: false,
        isActive: true,
      });
    }
    setShowModal(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        applicableCategories: formData.applicableCategories
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        applicableProducts: formData.applicableProducts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        applicableUsers: formData.applicableUsers
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingCoupon) {
        await axios.put(
          `${baseUrl}/api/v1/coupon/${editingCoupon._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${baseUrl}/api/v1/coupon`, payload, {
          withCredentials: true,
        });
      }

      setSuccess(
        editingCoupon
          ? "Coupon updated successfully!"
          : "Coupon created successfully!"
      );
      setTimeout(() => {
        setShowModal(false);
        fetchCoupons();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/api/v1/coupon/${deleteConfirm}`, {
        withCredentials: true,
      });
      setSuccess("Coupon deleted successfully!");
      setDeleteConfirm(null);
      setTimeout(() => fetchCoupons(), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return { label: "Inactive", color: "bg-gray-100 text-gray-600" };
    if (now < validFrom) return { label: "Scheduled", color: "bg-blue-100 text-blue-600" };
    if (now > validUntil) return { label: "Expired", color: "bg-red-100 text-red-600" };
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { label: "Fully Used", color: "bg-orange-100 text-orange-600" };
    return { label: "Active", color: "bg-green-100 text-green-600" };
  };

  return (
    <AdminLayout title="Coupons Management">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="organic-input pl-10 w-full md:w-64"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <FiPlus /> Add Coupon
        </motion.button>
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

      {/* Coupons Table View */}
      <div className="bg-white rounded-2xl overflow-hidden organic-card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-[#7a6b54]">
            <FiTag className="mx-auto text-4xl mb-4" />
            <p>No coupons found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fdf8f3]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Coupon</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Discount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Min Order</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Usage</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Validity</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#7a6b54]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4a4bd]/10">
                {coupons.map((coupon, index) => {
                  const status = getCouponStatus(coupon);
                  const usageLeft = coupon.usageLimit ? coupon.usageLimit - (coupon.usageCount || 0) : '∞';
                  return (
                    <motion.tr
                      key={coupon._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-[#fdf8f3]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${coupon.type === 'percentage' ? 'bg-[#e4a4bd]/10 text-[#e4a4bd]' : 'bg-[#6b7d56]/10 text-[#6b7d56]'}`}>
                            {coupon.type === 'percentage' ? <FiPercent /> : <FiTag />}
                          </div>
                          <div>
                            <p className="font-bold text-[#262626]">{coupon.code}</p>
                            <p className="text-xs text-[#7a6b54] max-w-[200px] truncate">{coupon.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-[#262626]">
                          {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#7a6b54]">₹{coupon.minOrderValue}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{coupon.usageCount || 0} used</span>
                            <span className="text-[#7a6b54]">{usageLeft} left</span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${usageLeft === 0 ? 'bg-red-400' : 'bg-[#6b7d56]'}`}
                              style={{ 
                                width: coupon.usageLimit 
                                  ? `${Math.min(100, ((coupon.usageCount || 0) / coupon.usageLimit) * 100)}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-[#7a6b54]">
                          <FiCalendar size={12} />
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] hover:bg-white rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(coupon._id)}
                            className="p-2 text-[#7a6b54] hover:text-red-500 hover:bg-white rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
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
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-[#262626]">
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className="organic-input w-full uppercase"
                      required
                      placeholder="SUMMER2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Type
                    </label>
                    <AnimatedSelect
                      value={formData.type}
                      onChange={(e) => handleChange({ target: { name: 'type', value: e.target.value } })}
                      options={couponTypeOptions}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Min Order Value
                    </label>
                    <input
                      type="number"
                      name="minOrderValue"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Max Discount (optional)
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Usage Limit Per User
                    </label>
                    <input
                      type="number"
                      name="userUsageLimit"
                      value={formData.userUsageLimit}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Total Usage Limit (optional)
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Valid From
                    </label>
                    <input
                      type="date"
                      name="validFrom"
                      value={formData.validFrom}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      name="validUntil"
                      value={formData.validUntil}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="firstTimeUsersOnly"
                        checked={formData.firstTimeUsersOnly}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#e4a4bd]"
                      />
                      <span className="text-sm text-[#262626]">
                        First-time users only
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#6b7d56]"
                      />
                      <span className="text-sm text-[#262626]">
                        Is Active
                      </span>
                    </label>
                  </div>
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
                    className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
                  >
                    {editingCoupon ? "Update Coupon" : "Create Coupon"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-display font-semibold text-[#262626] mb-2">
                Delete Coupon?
              </h3>
              <p className="text-sm text-[#7a6b54] mb-4">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm text-[#7a6b54] hover:text-[#262626] organic-btn"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="organic-btn bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCoupons;
