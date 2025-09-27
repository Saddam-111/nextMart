import React, { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { FaBox } from "react-icons/fa";

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
      console.log(error);
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
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllList();
  }, []);

  return (
    <div className="p-4 mb-10">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 mb-3">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <FaBox className="text-blue-500" />
                  <h3 className="font-semibold text-sm sm:text-base">
                    Order #{index + 1} - {order._id}
                  </h3>
                </div>

                {/* Status select */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm sm:text-base font-semibold">
                    Status:
                  </span>
                  <select
                    onChange={(e) => handleStatus(e, order._id)}
                    value={order.status}
                    className="border px-2 py-1 rounded w-full sm:w-auto text-sm sm:text-base"
                  >
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mb-3">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">
                  Items:
                </h4>
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-md p-2 bg-gray-50"
                    >
                      <img
                        src={item.image1?.url || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                        <div>
                          <p className="font-semibold">{item.name.toUpperCase()}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} {item.size && <span>({item.size})</span>}
                          </p>
                        </div>
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-3 text-sm sm:text-base">
                <h4 className="font-semibold mb-1">Shipping Address:</h4>
                <p>
                  {order.address?.firstName} {order.address?.lastName},{" "}
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.state}, {order.address?.pincode}
                </p>
                <p>Phone: {order.address?.phone || "N/A"}</p>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base text-gray-700">
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
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
