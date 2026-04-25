import { razorpayInstance } from "../config/razorpay.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import crypto from 'crypto'

const currency = 'inr';
export const placeOrder = async (req, res) => {
  try {
    let { items, address, couponCode, subtotal, shipping } = req.body;
    const userId = req.userId;

    if (!items && req.body.cartData) {
      items = Object.values(req.body.cartData);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items found in order" });
    }

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const code = couponCode.toUpperCase();
      const coupon = await Coupon.findOne({
        code,
        isActive: true
      });

      if (!coupon) {
        return res.status(404).json({ success: false, message: "Invalid coupon code" });
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ success: false, message: "Coupon is not valid at this time" });
      }

      if (subtotal < coupon.minOrderValue) {
        return res.status(400).json({
          success: false,
          message: `Minimum order value of â‚¹${coupon.minOrderValue} required`
        });
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
      }

      const userUsageCount = await Order.countDocuments({
        userId,
        couponCode: code,
        status: { $ne: 'Cancelled' }
      });

      if (userUsageCount >= coupon.userUsageLimit) {
        return res.status(400).json({ success: false, message: "You have already used this coupon maximum times" });
      }

      if (coupon.firstTimeUsersOnly) {
        const userOrderCount = await Order.countDocuments({
          userId,
          status: { $ne: 'Cancelled' }
        });

        if (userOrderCount > 0) {
          return res.status(400).json({ success: false, message: "This coupon is only for first-time customers" });
        }
      }

      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }

      discount = Math.min(discount, subtotal);
      appliedCoupon = coupon;
    }

    const finalAmount = subtotal + (shipping || 0) - discount;

    const orderItems = items.map((item) => ({
      productId: item._id || item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      images: item.image1 ? [item.image1] : [],
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      subtotal,
      shipping: shipping || 0,
      amount: finalAmount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponDiscount: discount,
      timeline: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          description: "Order has been placed successfully",
        }
      ],
    });

    await newOrder.save();

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, {
        $inc: { usageCount: 1 }
      });
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

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

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.status(200).json(orders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Admin all order error",
        error: error.message
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
        success: false,
        message: "Order status update error",
        error: error.message
      });
    }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address, couponCode, subtotal, shipping } = req.body;
    const userId = req.userId;

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const code = couponCode.toUpperCase();
      const coupon = await Coupon.findOne({
        code,
        isActive: true
      });

      if (!coupon) {
        return res.status(404).json({ success: false, message: "Invalid coupon code" });
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ success: false, message: "Coupon is not valid at this time" });
      }

      if (subtotal < coupon.minOrderValue) {
        return res.status(400).json({
          success: false,
          message: `Minimum order value of â‚¹${coupon.minOrderValue} required`
        });
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
      }

      const userUsageCount = await Order.countDocuments({
        userId,
        couponCode: code,
        status: { $ne: 'Cancelled' }
      });

      if (userUsageCount >= coupon.userUsageLimit) {
        return res.status(400).json({ success: false, message: "You have already used this coupon maximum times" });
      }

      if (coupon.firstTimeUsersOnly) {
        const userOrderCount = await Order.countDocuments({
          userId,
          status: { $ne: 'Cancelled' }
        });

        if (userOrderCount > 0) {
          return res.status(400).json({ success: false, message: "This coupon is only for first-time customers" });
        }
      }

      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }

      discount = Math.min(discount, subtotal);
      appliedCoupon = coupon;
    }

    const finalAmount = subtotal + (shipping || 0) - discount;

    const orderItems = items.map((item) => ({
      productId: item._id || item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      images: item.image1 ? [item.image1] : [],
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      subtotal,
      shipping: shipping || 0,
      amount: finalAmount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponDiscount: discount,
      timeline: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          description: "Order has been placed successfully",
        }
      ],
    });

    await newOrder.save();

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, {
        $inc: { usageCount: 1 }
      });
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    const options = {
      amount: finalAmount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error);
        if (appliedCoupon) {
          await Coupon.findByIdAndUpdate(appliedCoupon._id, {
            $inc: { usageCount: -1 }
          });
        }
        for (const item of orderItems) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } }
          );
        }
        return res.status(500).json(error);
      }

      newOrder.razorpay_order_id = order.id;
      await newOrder.save();

      res.status(200).json(order);
    });
  } catch (error) {
    console.error("placeOrderRazorpay error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    const orderInfo = await Order.findOne({ razorpay_order_id });

    if (!orderInfo) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    orderInfo.payment = true;
    orderInfo.status = "Order Confirmed";
    orderInfo.timeline.push({
      status: "Order Confirmed",
      timestamp: new Date(),
      description: "Payment verified. Order confirmed.",
    });
    await orderInfo.save();

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

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    const paymentMethod = req.query.paymentMethod;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortBy = req.query.sortBy || 'newest';

    let query = {};

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'address.email': { $regex: search, $options: 'i' } },
        { 'address.firstName': { $regex: search, $options: 'i' } },
        { 'address.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'amount_high':
        sortOptions = { amount: -1 };
        break;
      case 'amount_low':
        sortOptions = { amount: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .select('orderId userId items amount status payment paymentMethod address createdAt timeline');

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, description } = req.body;
    const adminEmail = req.adminEmail;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const validStatuses = [
      'Order Placed', 'Order Confirmed', 'Packed', 'Shipped',
      'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    order.status = status;

    order.timeline.push({
      status,
      timestamp: new Date(),
      description: description || `Order status updated to ${status}`,
      updatedByEmail: adminEmail,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone address')
      .populate('items.productId', 'name images price stock');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

