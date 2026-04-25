import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist, moveToCart } from "../controllers/wishlistController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// Protect all routes
router.use(isAuth);

router.route("/")
  .get(getWishlist);

router.route("/:productId")
  .post(addToWishlist)
  .delete(removeFromWishlist);

router.route("/:productId/move-to-cart")
  .post(moveToCart);

export default router;