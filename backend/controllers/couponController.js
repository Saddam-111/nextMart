import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";

/**
 * @desc    Create new coupon
 * @route   POST /api/v1/coupon
 * @access  Private (Admin)
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      userUsageLimit,
      validFrom,
      validUntil,
      applicableCategories,
      applicableProducts,
      excludedProducts,
      applicableUsers,
      firstTimeUsersOnly,
    } = req.body;

    // Validation
    if (!code || !description || !type || !value || !validFrom || !validUntil) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    if (!['percentage', 'fixed'].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid coupon type" });
    }

    if (type === 'percentage' && (value < 0 || value > 100)) {
      return res.status(400).json({ success: false, message: "Percentage discount must be between 0 and 100" });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      type,
      value,
      minOrderValue: minOrderValue || 0,
      maxDiscount,
      usageLimit,
      userUsageLimit: userUsageLimit || 1,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      applicableCategories,
      applicableProducts,
      excludedProducts,
      applicableUsers,
      firstTimeUsersOnly: firstTimeUsersOnly || false,
      createdBy: req.userId,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon
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
 * @desc    Get all coupons
 * @route   GET /api/v1/coupon
 * @access  Private (Admin)
 */
export const getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status; // active, inactive, expired

    let query = {};

    // Search by code or description
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      const now = new Date();
      switch (status) {
        case 'active':
          query.isActive = true;
          query.validUntil = { $gte: now };
          query.validFrom = { $lte: now };
          break;
        case 'inactive':
          query.isActive = false;
          break;
        case 'expired':
          query.validUntil = { $lt: now };
          break;
      }
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalCoupons = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      coupons,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCoupons / limit),
        totalCoupons,
        hasNext: page * limit < totalCoupons,
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
 * @desc    Update coupon
 * @route   PUT /api/v1/coupon/:id
 * @access  Private (Admin)
 */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating code if it's being changed
    if (updateData.code) {
      const existingCoupon = await Coupon.findOne({
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCoupon) {
        return res.status(400).json({ success: false, message: "Coupon code already exists" });
      }
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon
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
 * @desc    Delete coupon
 * @route   DELETE /api/v1/coupon/:id
 * @access  Private (Admin)
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully"
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
 * @desc    Validate coupon for user
 * @route   POST /api/v1/coupon/validate
 * @access  Private
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, items } = req.body;
    const userId = req.userId;

    if (!code || !cartTotal) {
      return res.status(400).json({ success: false, message: "Coupon code and cart total are required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    const now = new Date();

    // Check validity period
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ success: false, message: "Coupon is not valid at this time" });
    }

    // Check minimum order value
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
    }

    // Check user-specific usage limit
    const userUsageCount = await Order.countDocuments({
      userId,
      couponCode: code.toUpperCase(),
      status: { $ne: 'Cancelled' }
    });

    if (userUsageCount >= coupon.userUsageLimit) {
      return res.status(400).json({ success: false, message: "You have already used this coupon maximum times" });
    }

    // Check first time users only
    if (coupon.firstTimeUsersOnly) {
      const userOrderCount = await Order.countDocuments({
        userId,
        status: { $ne: 'Cancelled' }
      });

      if (userOrderCount > 0) {
        return res.status(400).json({ success: false, message: "This coupon is only for first-time customers" });
      }
    }

    // Check applicable categories
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = items.some(item =>
        coupon.applicableCategories.includes(item.category)
      );
      if (!hasApplicableCategory) {
        return res.status(400).json({ success: false, message: "Coupon not applicable for items in cart" });
      }
    }

    // Check applicable users
    if (coupon.applicableUsers && coupon.applicableUsers.length > 0) {
      if (!coupon.applicableUsers.includes(userId)) {
        return res.status(400).json({ success: false, message: "Coupon not applicable for your account" });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        discount: discount,
        minOrderValue: coupon.minOrderValue,
        validUntil: coupon.validUntil,
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
 * @desc    Get active coupons for user
 * @route   GET /api/v1/coupon/active
 * @access  Private
 */
export const getActiveCoupons = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { applicableUsers: { $exists: false } },
        { applicableUsers: { $size: 0 } },
        { applicableUsers: userId }
      ]
    }).select('code description type value minOrderValue maxDiscount validUntil applicableCategories firstTimeUsersOnly');

    res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};