import React, { useContext, useState } from "react";
import { ShopDataContext } from "../../context/user/ShopContext";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTag, FiX, FiCheck } from "react-icons/fi";

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon
  } = useContext(ShopDataContext);
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = Number(getCartAmount()) || 0;
  const freeDeliveryThreshold = 1400;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;

  const shippingFee = isFreeDelivery ? 0 : delivery_fee;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError("");
    setCouponSuccess("");

    const result = await applyCoupon(couponInput);
    if (result.success) {
      setCouponSuccess(`Coupon ${result.coupon.code} applied!`);
      setCouponInput("");
    } else {
      setCouponError(result.message);
    }
    setIsApplying(false);
  };

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
      className="w-full p-6 border border-[#e4a4bd]/30 rounded-3xl bg-[#fdf8f3] sticky top-24 organic-card"
    >
      <Title text1="CART" text2="TOTALS" />
      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-[#262626]">Subtotal</p>
          <p className="font-medium text-[#3d352b]">
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#6b7d56]">
            <p>Discount ({appliedCoupon?.code})</p>
            <p>- {currency} {discount.toFixed(2)}</p>
          </div>
        )}

        <hr className="border-[#e4a4bd]/30" />

        <div className="flex justify-between">
          <p className="text-[#262626]">Shipping Fee</p>
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

        <hr className="border-[#e4a4bd]/30" />

        <div className="flex justify-between text-lg font-display font-semibold">
          <p className="text-[#3d352b]">Total</p>
          <p className="text-[#6b7d56]">
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mt-8 border-t border-[#e4a4bd]/20 pt-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Coupon Code"
              className="organic-input w-full pl-10 pr-2 py-2 text-sm"
              disabled={!!appliedCoupon}
            />
          </div>
          {!appliedCoupon ? (
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponInput.trim()}
              className="organic-btn bg-[#6b7d56] text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          ) : (
            <button
              onClick={removeCoupon}
              className="organic-btn bg-red-100 text-red-600 px-4 py-2"
            >
              <FiX />
            </button>
          )}
        </div>

        <AnimatePresence>
          {couponError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-2">{couponError}</motion.p>
          )}
          {couponSuccess && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-xs mt-2 flex items-center gap-1">
              <FiCheck /> {couponSuccess}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        whileHover={{ scale: 1.01, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        className="mt-6 p-4 bg-[#f3efe8] rounded-2xl organic-card"
      >
        <h4 className="font-display font-medium mb-2 text-[#262626]">Available Offers</h4>
        <ul className="list-disc ml-5 text-sm text-[#7a6b54] space-y-1">
          <li>Free Delivery on orders above {currency}{freeDeliveryThreshold}</li>
        </ul>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
        onClick={() => navigate("/checkout")}
        className="mt-6 w-full organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446]"
      >
        Proceed to Checkout
      </motion.button>
    </motion.div>
  );
};

export default CartTotal;
