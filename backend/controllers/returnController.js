import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

/**
 * @desc    Create return request
 * @route   POST /api/v1/return-request
 * @access  Private
 */
export const createReturnRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId, reason, description } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: "Order ID and reason are required" });
    }

    const order = await Order.findOne({ orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not authorized" });
    }

    // Check if order is eligible for return (delivered but not returned/refunded)
    if (order.status !== 'Delivered') {
      return res.status(400).json({ success: false, message: "Only delivered orders can be returned" });
    }

    // Check if return request already exists
    if (order.returnRequest && order.returnRequest.status !== 'Rejected') {
      return res.status(400).json({ success: false, message: "Return request already exists for this order" });
    }

    // Initialize return request if not exists
    if (!order.returnRequest) {
      order.returnRequest = {};
    }

    // Set return request details
    order.returnRequest.reason = reason;
    order.returnRequest.description = description || '';
    order.returnRequest.status = 'Pending';
    order.returnRequest.requestDate = new Date();

    await order.save();

    res.status(201).json({
      success: true,
      message: "Return request submitted successfully",
      returnRequest: order.returnRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get user return requests
 * @route   GET /api/v1/return-requests
 * @access  Private
 */
export const getUserReturnRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      'returnRequest.0': { $exists: true }
    })
    .populate('items.productId', 'name images')
    .select('orderId status amount createdAt returnRequest')
    .sort({ 'returnRequest.requestDate': -1 });

    res.status(200).json({
      success: true,
      returnRequests: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get all return requests (Admin)
 * @route   GET /api/v1/admin/return-requests
 * @access  Private (Admin)
 */
export const getAllReturnRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = {
      'returnRequest.0': { $exists: true }
    };

    if (status) {
      query['returnRequest.status'] = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'name')
      .sort({ 'returnRequest.requestDate': -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('orderId userId status amount createdAt returnRequest');

    const totalRequests = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      returnRequests: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRequests / limit),
        totalRequests,
        hasNext: page * limit < totalRequests,
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

/**
 * @desc    Process return request (Admin)
 * @route   PUT /api/v1/admin/return-request/:orderId/process
 * @access  Private (Admin)
 */
export const processReturnRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, refundAmount, refundMethod, adminNotes } = req.body;
    const adminId = req.userId;

    const validStatuses = ['Approved', 'Rejected', 'Processed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.returnRequest) {
      return res.status(400).json({ success: false, message: "No return request found for this order" });
    }

    // Update return request
    order.returnRequest.status = status;
    order.returnRequest.processedDate = new Date();
    order.returnRequest.refundAmount = refundAmount || 0;
    order.returnRequest.refundMethod = refundMethod || 'Original Payment Method';
    order.returnRequest.adminNotes = adminNotes || '';

     // Update order status based on return request status
     if (status === 'Approved') {
       order.status = 'Returned';
     } else if (status === 'Processed') {
       order.status = 'Refunded';
       // Restore stock atomically for returned items
       for (const item of order.items) {
         await Product.findByIdAndUpdate(
           item.productId,
           { $inc: { stock: item.quantity } }
         );
       }
     } else if (status === 'Rejected') {
       // Keep original status or set back to delivered if appropriate
       if (order.status === 'Returned') {
         order.status = 'Delivered'; // Revert to delivered if was previously marked as returned
       }
     }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Return request ${status.toLowerCase()} successfully`,
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

/**
 * @desc    Get return request stats
 * @route   GET /api/v1/return-requests/stats
 * @access  Private (Admin)
 */
export const getReturnRequestStats = async (req, res) => {
  try {
    const totalRequests = await Order.countDocuments({
      'returnRequest.0': { $exists: true }
    });

    const pendingRequests = await Order.countDocuments({
      'returnRequest.status': 'Pending'
    });

    const approvedRequests = await Order.countDocuments({
      'returnRequest.status': 'Approved'
    });

    const processedRequests = await Order.countDocuments({
      'returnRequest.status': 'Processed'
    });

    const rejectedRequests = await Order.countDocuments({
      'returnRequest.status': 'Rejected'
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalRequests,
        pending: pendingRequests,
        approved: approvedRequests,
        processed: processedRequests,
        rejected: rejectedRequests
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