import express from "express";
import {
  generateSalesCSV,
  generateSalesPDF,
  getReportSummary
} from "../controllers/reportsController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

router.get('/sales/csv', generateSalesCSV);
router.get('/sales/pdf', generateSalesPDF);
router.get('/summary', getReportSummary);

export default router;