import express from "express";
import {
  addProductReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview,
  markReviewHelpful
} from "../controllers/reviewController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Public routes
router.route("/:productId/reviews")
  .get(getProductReviews);

// Protected routes
router.use(isAuth);

router.route("/:productId/review")
  .post(addProductReview);

router.route("/:productId/review/:reviewId")
  .put(updateProductReview)
  .delete(deleteProductReview);

router.route("/:productId/review/:reviewId/helpful")
  .post(markReviewHelpful);

export default router;