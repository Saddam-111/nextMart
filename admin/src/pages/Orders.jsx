import React, { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { FaBox } from "react-icons/fa";

const Orders = () => {
  const { baseUrl } = useContext(AuthDataContext);
  const [orders, setOrders] = useState([]);

  const fetchAllList = async () => {
    try {
      const result = await axios.get(
        baseUrl + "/api/v1/order/orderList",
        { withCredentials: true }
      );
      setOrders(result.data.reverse());
      //console.log(result.data)
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
      <h2 className="text-2xl font-bold mb-2">All Orders</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between border-b pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <FaBox className="text-blue-500" />
                  <h3 className="font-semibold">
                    Order #{index + 1} - {order._id}
                  </h3>
                </div>
                <select
                  onChange={(e) => handleStatus(e, order._id)}
                  value={order.status}
                  className="border px-2 py-1 rounded"
                >
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Items */}
              {/* Items */}
<div className="mb-3">
  <h4 className="font-semibold mb-2">Items:</h4>
  <div className="space-y-2">
    {order.items?.map((item, i) => (
      <div
        key={i}
        className="flex items-center gap-4 border rounded-md p-2 bg-gray-50"
      >
        {/* Product Image */}
        <img
          src={item.image1?.url || "/placeholder.png"}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />

        {/* Product Details */}
        <div>
          <p className="font-semibold">{item.name.toUpperCase()}</p>
          <p className="text-sm text-gray-600">
            Qty: {item.quantity} {item.size && <span>({item.size})</span>}
          </p>
          <p className="text-blue-600 font-semibold">₹{item.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>


              {/* Address */}
              <div className="mb-3">
                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                <p className="text-gray-700">
                  {order.address?.firstName} {order.address?.lastName},{" "}
                  {order.address?.street}, {order.address?.city},{" "}
                  {order.address?.state}, {order.address?.pincode}
                </p>
                <p className="text-gray-700">
                  Phone: {order.address?.phone || "N/A"}
                </p>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-semibold">Items:</span>{" "}
                  {order.items?.length}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₹
                  {order.amount}
                </p>
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  {order.payment ? (
                    <span className="text-green-600 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Pending
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-semibold">Order Date:</span>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {order.status}
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
