import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const { currency } = useContext(ShopDataContext);
  const { baseUrl } = useContext(AuthDataContext);

  // ✅ Load orders
  const loadOrderData = async () => {
    try {
      const result = await axios.post(
        baseUrl + "/api/v1/order/userOrder",
        {},
        { withCredentials: true }
      );
      // console.log(result.data)

      if (result.data) {
        let allOrdersItem = [];

        result.data.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  return (
    <div className="px-6 md:px-12 py-8">
      <div className="mb-8 text-center">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orderData.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition"
            >
              {/* Product Image */}
              <div className="w-28 h-28 flex-shrink-0">
                <img
                  src={item.image1?.url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col md:flex-row justify-between w-full gap-6">
                <div className="flex flex-col space-y-2">
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-gray-600">
                    {currency} {item.price}
                  </p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-500">Size: {item.size}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(item.date).toDateString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Payment Method:{" "}
                    <span className="font-medium">{item.paymentMethod}</span>
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      item.payment === "Paid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.payment}
                  </p>
                </div>

                {/* Order Status & Track Button */}
                <div className="flex flex-col justify-center items-start md:items-end space-y-2">
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-semibold ${
                      item.status === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </p>

                  <button
                    onClick={loadOrderData}
                    className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
