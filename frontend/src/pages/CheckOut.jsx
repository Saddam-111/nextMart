import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiTag, FiX, FiCheck, FiPercent, FiChevronRight, FiMapPin, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CheckOut = () => {
  const navigate = useNavigate();
  const { 
    cartItem, 
    setCartItem, 
    getCartAmount, 
    products, 
    cartLoading,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon,
    delivery_fee,
    currency
  } = useContext(ShopDataContext);
  const { baseUrl } = useContext(userDataContext);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [method, setMethod] = useState("cod");

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

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const getCartItems = useCallback(() => {
    let items = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        if (cartItem[productId][size] > 0) {
          const product = products.find((p) => String(p._id) === String(productId));
          if (product) {
            items.push({
              productId: product._id,
              name: product.name,
              price: product.price,
              image1: product.image1,
              category: product.category,
              size,
              quantity: cartItem[productId][size],
            });
          }
        }
      }
    }
    return items;
  }, [cartItem, products]);

  useEffect(() => {
    if (appliedCoupon) {
      setCouponSuccess(`Coupon ${appliedCoupon.code} applied!`);
      setCouponError("");
    } else {
      setCouponSuccess("");
    }
  }, [appliedCoupon]);

  const subtotal = getCartAmount();
  const shippingFee = subtotal >= 1400 ? 0 : delivery_fee;
  const finalAmount = Math.max(0, subtotal + shippingFee - discount);

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: order.currency,
      name: "NextMart",
      description: "Payment for your order",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const { data } = await axios.post(
            baseUrl + "/api/v1/order/verifyrazorpay",
            verificationData,
            { withCredentials: true }
          );

          if (data.success) {
            setCartItem({});
            removeCoupon();
            navigate("/orders");
          } else {
            alert("Payment verification failed.");
          }
        } catch (error) {
          console.error("Payment Verification Error:", error);
        }
      },
      theme: { color: "#6b7d56" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      let orderItems = getCartItems();
      if (orderItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        subtotal: subtotal,
        shipping: shippingFee,
        discount: discount,
        amount: finalAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      };

      if (method === "cod") {
        const result = await axios.post(
          baseUrl + "/api/v1/order/placeOrder",
          orderData,
          { withCredentials: true }
        );
        if (result.data) {
          setCartItem({});
          removeCoupon();
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
      console.error("Order Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  const isFormValid = () => {
    const required = ["firstName", "lastName", "email", "street", "city", "state", "pincode", "phone"];
    return required.every(field => formData[field]?.trim() !== "");
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Details", icon: <FiMapPin /> },
    { id: 2, name: "Payment", icon: <FiCreditCard /> },
    { id: 3, name: "Confirm", icon: <FiCheckCircle /> }
  ];

  const cartItems = getCartItems();

  return (
    <div className="min-h-screen bg-[#fdf8f3] font-sans text-[#3d352b]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-[120px] pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12 relative px-4">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e4a4bd]/20 -translate-y-1/2 z-0" />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: currentStep >= s.id ? "#6b7d56" : "#fff",
                      color: currentStep >= s.id ? "#fff" : "#7a6b54",
                      scale: currentStep === s.id ? 1.2 : 1
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                      currentStep >= s.id ? "border-[#6b7d56]" : "border-[#e4a4bd]/30"
                    }`}
                  >
                    {currentStep > s.id ? <FiCheck /> : s.icon}
                  </motion.div>
                  <span className={`text-xs mt-2 font-medium ${currentStep >= s.id ? "text-[#6b7d56]" : "text-[#7a6b54]"}`}>
                    {s.name}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <FiMapPin className="text-[#6b7d56]" /> Shipping Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="John" className="organic-input w-full" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Doe" className="organic-input w-full" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="john@example.com" className="organic-input w-full" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">Street Address</label>
                        <input name="street" value={formData.street} onChange={onChangeHandler} placeholder="123 Luxury Lane" className="organic-input w-full" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">City</label>
                        <input name="city" value={formData.city} onChange={onChangeHandler} placeholder="New York" className="organic-input w-full" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">State</label>
                        <input name="state" value={formData.state} onChange={onChangeHandler} placeholder="NY" className="organic-input w-full" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">Pincode</label>
                        <input name="pincode" value={formData.pincode} onChange={onChangeHandler} placeholder="10001" className="organic-input w-full" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6b54] ml-2">Phone</label>
                        <input name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="+1 234 567 890" className="organic-input w-full" />
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={!isFormValid()}
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-5 rounded-2xl bg-[#6b7d56] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to Payment <FiChevronRight />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <FiCreditCard className="text-[#6b7d56]" /> Payment Method
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMethod("cod")}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                          method === "cod" ? "border-[#6b7d56] bg-[#6b7d56]/5" : "border-[#e4a4bd]/20 hover:border-[#e4a4bd]/50 bg-white"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method === "cod" ? "bg-[#6b7d56] text-white" : "bg-gray-100 text-gray-400"}`}>
                          <FiCheckCircle size={24} />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold">Cash on Delivery</h3>
                          <p className="text-xs text-[#7a6b54]">Pay when you receive</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMethod("razorpay")}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${
                          method === "razorpay" ? "border-[#6b7d56] bg-[#6b7d56]/5" : "border-[#e4a4bd]/20 hover:border-[#e4a4bd]/50 bg-white"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method === "razorpay" ? "bg-[#6b7d56] text-white" : "bg-gray-100 text-gray-400"}`}>
                          <FiCreditCard size={24} />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold">Online Payment</h3>
                          <p className="text-xs text-[#7a6b54]">Razorpay Secure</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl">
                    <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                      <FiTag className="text-[#6b7d56]" /> Apply Coupon
                    </h2>
                    <div className="flex gap-3">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="SUMMER25"
                        className="organic-input flex-1"
                        disabled={!!appliedCoupon}
                      />
                      {!appliedCoupon ? (
                        <button
                          onClick={async () => {
                            setValidatingCoupon(true);
                            const res = await applyCoupon(couponInput);
                            if (!res.success) setCouponError(res.message);
                            else setCouponInput("");
                            setValidatingCoupon(false);
                          }}
                          disabled={validatingCoupon || !couponInput.trim()}
                          className="px-6 py-3 bg-[#6b7d56] text-white rounded-xl font-bold disabled:opacity-50"
                        >
                          {validatingCoupon ? "..." : "Apply"}
                        </button>
                      ) : (
                        <button
                          onClick={() => { removeCoupon(); setCouponInput(""); }}
                          className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-2 ml-2">{couponError}</p>}
                    {couponSuccess && <p className="text-green-600 text-xs mt-2 ml-2">{couponSuccess}</p>}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-5 rounded-2xl border-2 border-[#e4a4bd]/30 font-bold hover:bg-white transition-all">Back</button>
                    <button onClick={() => setCurrentStep(3)} className="flex-[2] py-5 rounded-2xl bg-[#6b7d56] text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2">Review Order <FiChevronRight /></button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl">
                    <h2 className="text-2xl font-display font-bold mb-6">Review Your Order</h2>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-start pb-6 border-b border-[#e4a4bd]/20">
                        <div>
                          <p className="text-xs font-bold uppercase text-[#7a6b54] mb-1">Shipping To</p>
                          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                          <p className="text-sm text-[#7a6b54]">{formData.street}, {formData.city}, {formData.pincode}</p>
                        </div>
                        <button onClick={() => setCurrentStep(1)} className="text-[#6b7d56] text-sm font-bold">Edit</button>
                      </div>

                      <div className="flex justify-between items-start pb-6 border-b border-[#e4a4bd]/20">
                        <div>
                          <p className="text-xs font-bold uppercase text-[#7a6b54] mb-1">Payment Method</p>
                          <p className="font-medium">{method === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}</p>
                        </div>
                        <button onClick={() => setCurrentStep(2)} className="text-[#6b7d56] text-sm font-bold">Edit</button>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-[#7a6b54] mb-4">Order Items</p>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                          {cartItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-white/40 p-3 rounded-2xl border border-white">
                              <img src={item.image1.url} className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                <p className="text-xs text-[#7a6b54]">Size: {item.size} â€¢ Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold">{currency}{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(2)} className="flex-1 py-5 rounded-2xl border-2 border-[#e4a4bd]/30 font-bold hover:bg-white transition-all">Back</button>
                    <button
                      onClick={handleSubmit}
                      className="flex-[2] py-5 rounded-2xl bg-[#6b7d56] text-white font-bold text-xl shadow-lg hover:bg-[#5d6d4a] transition-all flex items-center justify-center gap-2"
                    >
                      Pay {currency}{finalAmount} <FiCheckCircle />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:w-[400px]">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#3d352b] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#6b7d56]/20 rounded-full blur-2xl" />
                
                <h3 className="text-xl font-display font-bold mb-6 relative z-10">Order Summary</h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? "FREE" : `${currency}${shippingFee.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#a8b894]">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{currency}{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="h-[1px] bg-white/10 my-4" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold tracking-widest">Total Payable</p>
                      <p className="text-4xl font-display font-bold mt-1">{currency}{finalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-xs text-white/40 leading-relaxed">
                  By completing your purchase, you agree to our <span className="text-white/60 underline">Terms of Service</span> and <span className="text-white/60 underline">Privacy Policy</span>.
                </div>
              </div>

              {currentStep < 3 && (
                <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-lg hidden lg:block">
                  <p className="text-xs font-bold uppercase text-[#7a6b54] mb-4">Cart Preview ({cartItems.length} items)</p>
                  <div className="flex -space-x-4 overflow-hidden">
                    {cartItems.slice(0, 5).map((item, i) => (
                      <img key={i} src={item.image1.url} className="w-12 h-12 rounded-full border-2 border-white object-contain bg-gray-50 shadow-sm" />
                    ))}
                    {cartItems.length > 5 && (
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-[#f3efe8] flex items-center justify-center text-xs font-bold text-[#7a6b54]">
                        +{cartItems.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckOut;

