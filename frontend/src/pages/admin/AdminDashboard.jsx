import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/analytics/dashboard`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Stat card component
  const StatCard = ({ icon: Icon, label, value, subtext, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 organic-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#7a6b54] mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-[#262626]">{value}</h3>
          {subtext && (
            <p className="text-xs text-[#7a6b54] mt-1">{subtext}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            color === "pink" ? "bg-[#e4a4bd]/20 text-[#e4a4bd]" :
            color === "green" ? "bg-[#6b7d56]/20 text-[#6b7d56]" :
            color === "blue" ? "bg-blue-100 text-blue-600" :
            "bg-amber-100 text-amber-600"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          {trend > 0 ? (
            <FiTrendingUp className="text-green-500" />
          ) : (
            <FiTrendingDown className="text-red-500" />
          )}
          <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
            {Math.abs(trend)}%
          </span>
          <span className="text-[#7a6b54]">vs last month</span>
        </div>
      )}
    </motion.div>
  );

  // Chart component for revenue trends
  const RevenueChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
      <div className="bg-white rounded-2xl p-6 organic-card">
        <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
          Monthly Revenue Trend
        </h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={`${item._id.year}-${item._id.month}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-[#7a6b54] w-20">
                {new Date(item._id.year, item._id.month - 1).toLocaleDateString(
                  "en-US",
                  { month: "short", year: "2-digit" }
                )}
              </span>
              <div className="flex-1">
                <div className="h-6 bg-[#f5f0eb] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#e4a4bd] to-[#d494ad] rounded-full"
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-[#262626] w-24 text-right">
                ₹{item.revenue.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Top selling products component
  const TopProducts = ({ products }) => (
    <div className="bg-white rounded-2xl p-6 organic-card">
      <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products?.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4"
          >
            <span className="text-lg font-bold text-[#e4a4bd]">#{index + 1}</span>
            <div className="w-12 h-12 rounded-xl bg-[#f5f0eb] flex items-center justify-center overflow-hidden">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#262626] truncate">
                {product.name}
              </h4>
              <p className="text-sm text-[#7a6b54]">{product.soldCount} sold</p>
            </div>
            <span className="font-semibold text-[#6b7d56]">
              ₹{product.price}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Order status distribution
  const OrderStatusChart = ({ distribution }) => {
    const statusColors = {
      "Order Placed": "#e4a4bd",
      "Order Confirmed": "#6b7d56",
      "Packed": "#f59e0b",
      "Shipped": "#3b82f6",
      "Out for Delivery": "#8b5cf6",
      "Delivered": "#10b981",
      "Cancelled": "#ef4444",
      "Returned": "#f97316",
    };

    const total = distribution?.reduce((acc, item) => acc + item.count, 0) || 0;

    return (
      <div className="bg-white rounded-2xl p-6 organic-card">
        <h3 className="text-lg font-display font-semibold text-[#262626] mb-4">
          Order Status Distribution
        </h3>
        <div className="space-y-3">
          {distribution?.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="w-20 text-sm text-[#7a6b54] truncate">{item._id}</div>
              <div className="flex-1">
                <div className="h-3 bg-[#f5f0eb] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / total) * 100}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: statusColors[item._id] || "#6b7d56" }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-[#262626]">
                  {item.count}
                </span>
                <span className="text-xs text-[#7a6b54] ml-1">
                  ({((item.count / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd] mx-auto"></div>
            <p className="mt-4 text-[#7a6b54]">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
          Error: {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`₹${(dashboardData?.revenue?.total || 0).toLocaleString()}`}
          subtext={`₹${(dashboardData?.revenue?.today || 0).toLocaleString()} today`}
          color="pink"
          trend={12}
        />
        <StatCard
          icon={FiShoppingCart}
          label="Total Orders"
          value={dashboardData?.orders?.total || 0}
          subtext={`${dashboardData?.orders?.pending || 0} pending`}
          color="blue"
          trend={5}
        />
        <StatCard
          icon={FiPackage}
          label="Products"
          value={dashboardData?.products?.total || 0}
          subtext={`${dashboardData?.products?.lowStock || 0} low stock`}
          color="green"
        />
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={dashboardData?.users?.total || 0}
          subtext={`${dashboardData?.users?.active || 0} active`}
          color="amber"
          trend={8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <RevenueChart data={dashboardData?.monthlyRevenueData} />

        {/* Order Status */}
        <OrderStatusChart distribution={dashboardData?.orderStatusDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <TopProducts products={dashboardData?.topSellingProducts} />

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 organic-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-[#262626]">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-sm text-[#e4a4bd] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentOrders?.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between py-2 border-b border-[#e4a4bd]/10 last:border-0"
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
                    className={`inline-block text-xs px-2 py-0.5 rounded-full ${
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
        </motion.div>
      </div>

      {/* Conversion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-[#e4a4bd] to-[#d494ad] rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Conversion Rate</p>
            <p className="text-3xl font-bold mt-1">
              {dashboardData?.orders?.conversionRate || 0}%
            </p>
          </div>
          <FiTrendingUp size={40} className="opacity-80" />
        </div>
        <p className="text-xs opacity-70 mt-3">
          Orders per registered user
        </p>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
