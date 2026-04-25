import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons
} from "../controllers/couponController.js";
import { isAuth } from "../middleware/isAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// User routes (require authentication)
router.route("/validate")
  .post(isAuth, validateCoupon);

router.route("/active")
  .get(isAuth, getActiveCoupons);

// Admin routes (require admin authentication)
router.route("/")
  .get(adminAuth, getAllCoupons)
  .post(adminAuth, createCoupon);

router.route("/:id")
  .put(adminAuth, updateCoupon)
  .delete(adminAuth, deleteCoupon);

export default router;