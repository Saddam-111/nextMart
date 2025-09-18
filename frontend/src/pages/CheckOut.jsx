import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopDataContext } from "../context/ShopContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CheckOut = () => {
  const navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, products } =
    useContext(ShopDataContext);
  const { baseUrl } = useContext(userDataContext);
  const [method, setMethod] = useState("cod");

  // Delivery info form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  // ✅ Razorpay init
  const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Order Payment",
    description: "Payment for your order",
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
      try {
        console.log("Razorpay Response:", response);

        if (
          !response ||
          !response.razorpay_order_id ||
          !response.razorpay_payment_id ||
          !response.razorpay_signature
        ) {
          alert("Payment failed. Please try again.");
          return;
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        const verificationData = {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        };

        const { data } = await axios.post(
          baseUrl + "/api/v1/order/verifyrazorpay",
          verificationData,
          { withCredentials: true }
        );

        if (data.success) {
          setCartItem({});
          navigate("/orders");
        } else {
          alert("Payment verification failed. Please try again.");
        }
      } catch (error) {
        console.log("Payment Verification Error:", error);
      }
    },
    theme: { color: "#4f46e5" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  // handle form input
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!method) {
      alert("Please select a payment method");
      return;
    }

    try {
      // prepare order items
      let orderItems = [];
      for (const productId in cartItem) {
        for (const size in cartItem[productId]) {
          if (cartItem[productId][size] > 0) {
            const product = products.find((p) => p._id === productId);
            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image1: product.image1,
                size,
                quantity: cartItem[productId][size],
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      if (method === "cod") {
        const result = await axios.post(
          baseUrl + "/api/v1/order/placeOrder",
          orderData,
          { withCredentials: true }
        );
        if (result.data) {
          setCartItem({});
          navigate("/orders");
        }
      } else if (method === "razorpay") {
        const res = await axios.post(
          baseUrl + "/api/v1/order/razorpay",
          orderData,
          { withCredentials: true }
        );
        if (res.data) {
          initPay(res.data);
        }
      }
    } catch (error) {
      console.log("Order Error:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 pt-[100px] md:px-12 lg:px-20 py-10 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Section - Delivery Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white shadow-md rounded-lg p-6 space-y-6"
          >
            <Title text1="DELIVERY" text2="INFORMATION" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "firstName",
                "lastName",
                "email",
                "phone",
                "street",
                "city",
                "state",
                "pincode",
                "country",
              ].map((field, idx) => (
                <input
                  key={idx}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={onChangeHandler}
                  required
                  className="border px-3 py-2 rounded-md w-full"
                />
              ))}
            </div>

            {/* Payment Method */}
            <div>
              <Title text1="PAYMENT" text2="METHOD" />
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setMethod("cod")}
                  className={`px-4 py-2 rounded-md border ${
                    method === "cod"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("razorpay")}
                  className={`px-4 py-2 rounded-md border ${
                    method === "razorpay"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Razorpay
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Place Order
            </button>
          </form>

          {/* Right Section - Cart Totals */}
          <div>
            <CartTotal />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;
