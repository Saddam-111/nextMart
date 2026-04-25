import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Add review to product
 * @route   POST /api/v1/product/:productId/review
 * @access  Private
 */
export const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    const { rating, reviewText } = req.body;

    if (!rating || !reviewText) {
      return res.status(400).json({ success: false, message: "Rating and review text are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user has purchased this product (for verified purchase)
    let verifiedPurchase = false;
    const userOrders = await Order.find({
      userId,
      'items.productId': productId,
      status: 'Delivered'
    });

    if (userOrders.length > 0) {
      verifiedPurchase = true;
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(review =>
      review.userId.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    // Get user name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

     // Add review
     const newReview = {
       userId,
       userName: user.name,
       rating: Number(rating),
       reviewText,
       verifiedPurchase,
       helpful: 0,
     };

    product.reviews.push(newReview);

    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;
    product.totalReviews = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview
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
 * @desc    Get product reviews
 * @route   GET /api/v1/product/:productId/reviews
 * @access  Public
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'newest'; // newest, oldest, highest, lowest, helpful

    const product = await Product.findById(productId).select('reviews averageRating totalReviews');
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let reviews = [...product.reviews];

    // Sort reviews
    switch (sortBy) {
      case 'oldest':
        reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        reviews.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'newest':
      default:
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.status(200).json({
      success: true,
      reviews: paginatedReviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      ratingDistribution,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(reviews.length / limit),
        totalReviews: reviews.length,
        hasNext: endIndex < reviews.length,
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
 * @desc    Update product review
 * @route   PUT /api/v1/product/:productId/review/:reviewId
 * @access  Private
 */
export const updateProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const userId = req.userId;
    const { rating, reviewText } = req.body;

    if (!rating || !reviewText) {
      return res.status(400).json({ success: false, message: "Rating and review text are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find and update the review
    const reviewIndex = product.reviews.findIndex(review =>
      review._id.toString() === reviewId && review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: "Review not found or not authorized" });
    }

    product.reviews[reviewIndex].rating = Number(rating);
    product.reviews[reviewIndex].reviewText = reviewText;
    product.reviews[reviewIndex].createdAt = new Date();

    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: product.reviews[reviewIndex]
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
 * @desc    Delete product review
 * @route   DELETE /api/v1/product/:productId/review/:reviewId
 * @access  Private
 */
export const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const userId = req.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find and remove the review
    const reviewIndex = product.reviews.findIndex(review =>
      review._id.toString() === reviewId && review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: "Review not found or not authorized" });
    }

    product.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }
    product.totalReviews = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
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
 * @desc    Mark review as helpful
 * @route   POST /api/v1/product/:productId/review/:reviewId/helpful
 * @access  Private
 */
export const markReviewHelpful = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.helpful += 1;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review marked as helpful",
      helpfulCount: review.helpful
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};