import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  updateStatus,
  userOrder,
  verifyRazorpay,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails
} from '../controllers/orderController.js'
import { adminAuth } from '../middleware/adminAuth.js'

export const orderRouter = express.Router()

// User routes
orderRouter.post('/userOrder', isAuth, userOrder)
orderRouter.post('/placeOrder', isAuth, placeOrder)
orderRouter.post('/razorpay', isAuth, placeOrderRazorpay)
orderRouter.post('/verifyrazorpay', isAuth, verifyRazorpay)

// Admin routes
orderRouter.get('/orderList', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Enhanced admin routes
orderRouter.get('/all', adminAuth, getAllOrders)
orderRouter.put('/:orderId/status', adminAuth, updateOrderStatus)
orderRouter.get('/:orderId', adminAuth, getOrderDetails)