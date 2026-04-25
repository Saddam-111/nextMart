import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

/**
 * @desc    Get current user
 * @route   GET /api/v1/user/current
 * @access  Private
 */
export const getCurrentUser = async(req, res) => {
   try {
     const user = await User.findById(req.userId).select("-password");
     if(!user){
       return res.status(400).json({
         success: false,
         message: "User not found"
       });
     }
     return res.status(200).json(user);
   } catch (error) {
     res.status(500).json({
       success: false,
       message: "Failed to load current user",
       error: error.message
     });
   }
};

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/v1/user/admin/all
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // active, blocked

    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'active') {
      query.isBlocked = false;
    }

    const users = await User.find(query)
      .select('-password -cartData')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Add order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();

        // Get user's order stats
        const orderStats = await Order.aggregate([
          { $match: { userId: user._id, status: { $ne: 'Cancelled' } } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: '$amount' },
              lastOrderDate: { $max: '$createdAt' }
            }
          }
        ]);

        if (orderStats.length > 0) {
          userObj.orderStats = orderStats[0];
        } else {
          userObj.orderStats = {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null
          };
        }

        return userObj;
      })
    );

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
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
 * @desc    Block/Unblock user (Admin)
 * @route   PUT /api/v1/user/admin/:userId/block
 * @access  Private (Admin)
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true, runValidators: true }
    ).select('-password -cartData');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
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
 * @desc    Update user tags (Admin)
 * @route   PUT /api/v1/user/admin/:userId/tags
 * @access  Private (Admin)
 */
export const updateUserTags = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tags } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { userTags: tags },
      { new: true, runValidators: true }
    ).select('-password -cartData');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User tags updated successfully",
      user
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
 * @desc    Get user details with orders (Admin)
 * @route   GET /api/v1/user/admin/:userId/details
 * @access  Private (Admin)
 */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -cartData');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get user's orders
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId amount status payment createdAt items');

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        orderStats: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          completedOrders: 0,
          cancelledOrders: 0
        }
      },
      recentOrders: orders
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
 * @desc    Get admin info
 * @route   GET /api/v1/user/admin
 * @access  Private (Admin)
 */
export const getAdmin = async (req, res) => {
  try {
    const adminEmail = req.adminEmail;
    if(!adminEmail){
      return res.status(400).json({
        success: false,
        message: "Admin not found"
      });
    }
    return res.status(200).json({
      email: adminEmail,
      role: "admin"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load Admin",
      error: error.message
    });
  }
};