import { razorpayInstance } from "../config/razorpay.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import crypto from 'crypto'

// ✅ Place new order
const currency = 'inr';
export const placeOrder = async (req, res) => {
  try {
    let { items, amount, address } = req.body;
    const userId = req.userId;

    //console.log("Order request body:", req.body);

    // Fallback mapping (in case frontend sends cartData instead of items)
    if (!items && req.body.cartData) {
      items = Object.values(req.body.cartData);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items found in order" });
    }

    const orderItems = items.map((item) => ({
      productId: item._id || item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      image1: item.image1,
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: "Order Place error" });
  }
};

// ✅ Get all orders for logged-in user
export const userOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("userOrder error:", error);
    res.status(500).json({
      success: false,
      message: "Order fetch error",
    });
  }
};

// Admin Routes

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Admin all order error"
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });
    return res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Order status update error"
    });
  }
};

// ✅ Place Order using Razorpay
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const newOrder = new Order({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending",
      date: Date.now(),
    });

    await newOrder.save();

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      }

      // ✅ save razorpay order id in MongoDB order
      newOrder.razorpay_order_id = order.id;
      await newOrder.save();

      res.status(200).json(order);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Verify Razorpay Payment
export const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // ✅ verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // ✅ find the order by razorpay_order_id
    const orderInfo = await Order.findOne({ razorpay_order_id });

    if (!orderInfo) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // mark order as paid
    orderInfo.payment = true;
    orderInfo.status = "Paid";
    await orderInfo.save();

    // clear cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: "Payment successful, order processed.",
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


