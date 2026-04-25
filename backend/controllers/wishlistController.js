import User from "../models/userModel.js";
import Product from "../models/productModel.js";

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Add to wishlist if not already present
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // Remove from wishlist
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({ success: true, message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user with populated wishlist
    const user = await User.findById(userId).populate("wishlist", "name price images category");
    
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc    Move product from wishlist to cart
 * @route   POST /api/wishlist/:productId/move-to-cart
 * @access  Private
 */
export const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    const { quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    // Add to cart
    const user = await User.findById(userId);
    
    // Initialize cartData if needed
    if (!user.cartData) {
      user.cartData = {};
    }
    
    // Add or update quantity in cart
    if (user.cartData[productId]) {
      user.cartData[productId] += quantity;
    } else {
      user.cartData[productId] = quantity;
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Product moved to cart", 
      cartData: user.cartData,
      wishlist: user.wishlist 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};