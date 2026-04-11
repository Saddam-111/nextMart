import React, { useContext } from "react";
import { ShopDataContext } from "../context/ShopContext";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopDataContext);
  const navigate = useNavigate();

  const subtotal = Number(getCartAmount()) || 0;
  const freeDeliveryThreshold = 1400;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  const shippingFee = isFreeDelivery ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="w-full p-6 border border-[#d9cec0] rounded-3xl bg-[#fdfbf7] sticky top-24"
    >
      <Title text1="CART" text2="TOTALS" />
      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-[#5e5240]">Subtotal</p>
          <p className="font-medium text-[#3d352b]">
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        <hr className="border-[#d9cec0]" />

        <div className="flex justify-between">
          <p className="text-[#5e5240]">Shipping Fee</p>
          <p className="font-medium text-[#3d352b]">
            {currency} {shippingFee.toFixed(2)}
          </p>
        </div>

        {isFreeDelivery && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#6b7d56] text-sm"
          >
            You qualify for FREE delivery!
          </motion.p>
        )}

        <hr className="border-[#d9cec0]" />

        <div className="flex justify-between text-lg font-display font-semibold">
          <p className="text-[#3d352b]">Total</p>
          <p className="text-[#6b7d56]">
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="mt-6 p-4 bg-[#f3efe8] rounded-2xl"
      >
        <h4 className="font-display font-medium mb-2 text-[#5e5240]">Available Offers</h4>
        <ul className="list-disc ml-5 text-sm text-[#7a6b54] space-y-1">
          <li>Free Delivery on orders above {currency}{freeDeliveryThreshold}</li>
          <li>Get 10% off using code <span className="font-semibold text-[#6b7d56]">SAVE10</span></li>
          <li>Extra 5% cashback on prepaid orders</li>
        </ul>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/ckeckout")}
        className="mt-6 w-full bg-[#6b7d56] text-white py-3 rounded-xl font-medium hover:bg-[#5d6446] transition-colors"
      >
        Proceed to Checkout
      </motion.button>
    </motion.div>
  );
};

export default CartTotal;