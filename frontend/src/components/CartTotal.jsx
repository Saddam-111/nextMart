// src/components/CartTotal.jsx
import React, { useContext } from "react";
import { ShopDataContext } from "../context/ShopContext";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopDataContext);
  const navigate = useNavigate();

  const subtotal = Number(getCartAmount()) || 0; // getCartAmount is sync now
  const freeDeliveryThreshold = 1400;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  const shippingFee = isFreeDelivery ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full p-6 border rounded-lg shadow-md bg-white sticky top-20">
      <Title text1="CART" text2="TOTALS" />
      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <p className="font-medium">
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p className="text-gray-700">Shipping Fee</p>
          <p className="font-medium">
            {currency} {shippingFee.toFixed(2)}
          </p>
        </div>

        {isFreeDelivery && (
          <p className="text-green-600 text-sm">
            🎉 Congratulations! You got <strong>FREE Delivery</strong> (orders
            above {currency}
            {freeDeliveryThreshold}).
          </p>
        )}

        <hr />

        <div className="flex justify-between text-lg font-semibold">
          <p>Total</p>
          <p>
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Available Offers 🎁</h4>
        <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
          <li>Free Delivery on orders above {currency}{freeDeliveryThreshold}</li>
          <li>
            Get 10% off using code <span className="font-semibold text-primary">SAVE10</span>
          </li>
          <li>Extra 5% cashback on prepaid orders</li>
        </ul>
      </div>

      <button
        onClick={() => navigate("/ckeckout")}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartTotal;
