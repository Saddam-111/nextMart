import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiPrinter,
  FiArrowLeft,
  FiPackage,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";

const AdminInvoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/order/${orderId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError("Order not found");
      }
    } catch (error) {
      setError("Failed to fetch order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    window.open(
      `${baseUrl}/api/v1/invoice/admin/${orderId}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Invoice">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout title="Invoice - Not Found">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
          <p className="text-xl font-display mb-2">Order Not Found</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-4 organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Invoice - ${order.orderId}`}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-[#7a6b54] hover:text-[#262626] transition-colors"
          >
            <FiArrowLeft size={18} />
            Back to Orders
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadInvoice}
            className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] flex items-center gap-2"
          >
            <FiDownload size={16} />
            Download PDF
          </motion.button>
        </div>

        {/* Invoice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg organic-card print:shadow-none"
        >
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-[#e4a4bd] to-[#d494ad] px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-2xl font-display font-bold tracking-tighter">
                  nextMart
                </h1>
                <p className="text-sm opacity-80">Admin Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Invoice Number</p>
                <p className="font-mono font-semibold">
                  {order.invoiceNumber || `INV-${order.orderId}`}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-8">
            {/* Order Meta */}
            <div className="flex flex-wrap justify-between mb-8 pb-6 border-b border-[#e4a4bd]/20">
              <div>
                <p className="text-sm text-[#7a6b54] mb-1">Order ID</p>
                <p className="font-mono font-medium text-[#262626]">
                  {order.orderId}
                </p>
                <p className="text-sm text-[#7a6b54] mt-2">Date</p>
                <p className="font-medium text-[#262626]">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#7a6b54] mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : order.status === "Returned" ||
                        order.status === "Refunded"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
                <p className="text-sm text-[#7a6b54] mt-3">Payment</p>
                <p
                  className={`font-medium ${
                    order.payment ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {order.payment ? "Paid" : "Pending"}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-[#262626] mb-3 uppercase tracking-wider">
                  Customer
                </h3>
                <div className="bg-[#fdf8f3] p-4 rounded-xl">
                  <p className="font-medium text-[#262626]">
                    {order.userId?.name || "Guest"}
                  </p>
                  <p className="text-sm text-[#7a6b54]">
                    {order.userId?.email}
                  </p>
                  {order.userId?.phone && (
                    <p className="text-sm text-[#7a6b54]">
                      {order.userId.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#262626] mb-3 uppercase tracking-wider">
                  Shipping Address
                </h3>
                <div className="bg-[#fdf8f3] p-4 rounded-xl">
                  <p className="font-medium text-[#262626]">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className="text-sm text-[#7a6b54]">
                    {order.address?.street}
                  </p>
                  <p className="text-sm text-[#7a6b54]">
                    {order.address?.city}, {order.address?.state}{" "}
                    {order.address?.pincode}
                  </p>
                  <p className="text-sm text-[#7a6b54]">
                    {order.address?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#262626] mb-4 uppercase tracking-wider">
                Order Items
              </h3>
              <div className="border border-[#e4a4bd]/20 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#f5f0eb]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#262626] uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-[#262626] uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#262626] uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#262626] uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4a4bd]/10">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#f5f0eb] overflow-hidden">
                              {item.image1 && (
                                <img
                                  src={item.image1.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#262626]">
                                {item.name}
                              </p>
                              <p className="text-xs text-[#7a6b54]">
                                Size: {item.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-medium text-[#262626]">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[#7a6b54]">
                            ₹{item.price}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-[#6b7d56]">
                            ₹{item.price * item.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a6b54]">Subtotal</span>
                  <span className="text-[#262626]">₹{order.amount}</span>
                </div>
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7a6b54]">
                      Coupon Discount ({order.couponCode})
                    </span>
                    <span className="text-green-600">
                      -₹{order.couponDiscount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#e4a4bd]/20">
                  <span className="text-[#262626]">Total</span>
                  <span className="text-[#6b7d56]">₹{order.amount}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#e4a4bd]/20">
                <h3 className="text-sm font-semibold text-[#262626] mb-4 uppercase tracking-wider">
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  {order.timeline
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#e4a4bd] mt-1.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-[#262626]">
                              {event.status}
                            </p>
                            <p className="text-[#7a6b54]">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {event.description && (
                            <p className="text-xs text-[#7a6b54]">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Print Button (visible only when printing) */}
        <div className="no-print mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="organic-btn bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
          >
            <FiPrinter size={16} />
            Print Invoice
          </motion.button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          body .organic-card,
          body .organic-card * {
            visibility: visible;
          }
          body .organic-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminInvoice;
