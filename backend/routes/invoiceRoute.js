import express from "express";
import { generateInvoice, generateAdminInvoice } from "../controllers/invoiceController.js";
import { isAuth } from "../middleware/isAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// User routes (require authentication)
router.get('/:orderId', isAuth, generateInvoice);

// Admin routes (require admin authentication)
router.get('/admin/:orderId', adminAuth, generateAdminInvoice);

export default router;