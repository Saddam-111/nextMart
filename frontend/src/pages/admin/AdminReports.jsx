import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiFileText,
  FiTable,
  FiFile,
  FiCalendar,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";

import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("orders");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [period, setPeriod] = useState("30");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const reportTypeOptions = [
    { value: "orders", label: "Orders Report" },
    { value: "products", label: "Products Sales" },
    { value: "customers", label: "Customers Report" }
  ];

  const quickPeriodOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" }
  ];

  // Fetch summary
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/reports/summary?period=${period}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSummary(response.data.summary);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSummary();
  }, [period]);

  const downloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      params.append("type", reportType);

      window.open(
        `${import.meta.env.VITE_BASE_URL}/api/v1/reports/sales/csv?${params}`,
        "_blank"
      );
    } catch (error) {
      alert("Failed to download CSV. Please try again.");
    }
  };

  const downloadPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append("startDate", dateRange.start);
      if (dateRange.end) params.append("endDate", dateRange.end);
      params.append("type", reportType);

      window.open(
        `${import.meta.env.VITE_BASE_URL}/api/v1/reports/sales/pdf?${params}`,
        "_blank"
      );
    } catch (error) {
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <AdminLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse bg-[#f5f0eb]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl organic-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a6b54]">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-[#262626] mt-1">
                    ₹{(summary?.totalRevenue || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#e4a4bd]/20 flex items-center justify-center">
                  <FiTable className="text-[#e4a4bd]" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl organic-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a6b54]">Total Orders</p>
                  <h3 className="text-2xl font-bold text-[#262626] mt-1">
                    {summary?.totalOrders || 0}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#6b7d56]/20 flex items-center justify-center">
                  <FiFileText className="text-[#6b7d56]" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl organic-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#7a6b54]">Avg Order Value</p>
                  <h3 className="text-2xl font-bold text-[#262626] mt-1">
                    ₹{(summary?.avgOrderValue || 0).toFixed(2)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiCalendar className="text-blue-600" size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 organic-card"
        >
          <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
            Generate Reports
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                Report Type
              </label>
              <AnimatedSelect
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                options={reportTypeOptions}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="organic-input w-full h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="organic-input w-full h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                Quick Period
              </label>
              <AnimatedSelect
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - parseInt(e.target.value));
                  setDateRange({
                    start: start.toISOString().split("T")[0],
                    end: end.toISOString().split("T")[0],
                  });
                }}
                options={quickPeriodOptions}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadCSV}
              className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] flex items-center gap-2"
            >
              <FiDownload size={16} />
              Download CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPDF}
              className="organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446] flex items-center gap-2"
            >
              <FiFile size={16} />
              Download PDF
            </motion.button>
          </div>
        </motion.div>

        {/* Payment Method Breakdown */}
        {summary?.paymentMethods && summary.paymentMethods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 organic-card"
          >
            <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
              Payment Method Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#fdf8f3] rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-[#262626]">
                      {method._id}
                    </p>
                    <p className="text-xs text-[#7a6b54]">
                      {method.count} orders
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#6b7d56]">
                    ₹{method.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Products */}
        {summary?.topProducts && summary.topProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 organic-card"
          >
            <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
              Top Selling Products
            </h3>
            <div className="space-y-3">
              {summary.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-[#fdf8f3] rounded-xl transition-colors"
                >
                  <span className="text-lg font-bold text-[#e4a4bd]">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[#262626]">{product.name}</p>
                    <p className="text-xs text-[#7a6b54]">
                      {product.totalSold} units sold
                    </p>
                  </div>
                  <p className="font-semibold text-[#6b7d56]">
                    ₹{product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
