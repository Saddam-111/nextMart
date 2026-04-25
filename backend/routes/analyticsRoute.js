import express from "express";
import {
  getDashboardAnalytics,
  getSalesReport
} from "../controllers/analyticsController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

router.route("/dashboard")
  .get(getDashboardAnalytics);

router.route("/sales-report")
  .get(getSalesReport);

export default router;