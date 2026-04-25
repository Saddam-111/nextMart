import express from "express";
import {
  createReturnRequest,
  getUserReturnRequests,
  getAllReturnRequests,
  processReturnRequest,
  getReturnRequestStats
} from "../controllers/returnController.js";
import { isAuth } from "../middleware/isAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// User routes (require authentication)
router.post('/', isAuth, createReturnRequest);
router.get('/user', isAuth, getUserReturnRequests);

// Admin routes (require admin authentication)
router.get('/', adminAuth, getAllReturnRequests);
router.put('/:orderId/process', adminAuth, processReturnRequest);
router.get('/stats', adminAuth, getReturnRequestStats);

export default router;