import express from 'express'
import { isAuth } from '../middleware/isAuth.js'
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrder, verifyRazorpay } from '../controllers/orderController.js'
import { adminAuth } from '../middleware/adminAuth.js'

export const orderRouter = express.Router()



orderRouter.post('/userOrder', isAuth,userOrder)
orderRouter.post('/placeOrder', isAuth,placeOrder)
orderRouter.post('/razorpay', isAuth,placeOrderRazorpay)
orderRouter.post('/verifyrazorpay', isAuth,verifyRazorpay)




orderRouter.get('/orderList',adminAuth, allOrders)
orderRouter.post('/status',adminAuth, updateStatus)