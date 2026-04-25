import express from 'express'
import {
  addProduct,
  listProduct,
  removeProduct,
  getProductDetails,
  updateProduct,
  getFilteredProducts,
  getRecentlyViewed,
  getLowStockProducts,
  updateProductStock,
  getInventorySummary
} from '../controllers/productController.js'
import { upload } from '../middleware/multer.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { isAuth } from '../middleware/isAuth.js'

export const productRouter = express.Router()

// Public routes
productRouter.get('/list', listProduct)
productRouter.get('/filter', getFilteredProducts)
productRouter.get('/:id', getProductDetails)

// Protected routes (require authentication)
productRouter.get('/recently-viewed', isAuth, getRecentlyViewed)

// Admin routes (require admin authentication)
productRouter.post('/addProduct',
  adminAuth,
  upload.fields([
    {name: "image1", maxCount: 1},
    {name: "image2", maxCount: 1},
    {name: "image3", maxCount: 1},
    {name: "image4", maxCount: 1}
  ]),
  addProduct
)

productRouter.put('/:id',
  adminAuth,
  upload.fields([
    {name: "image1", maxCount: 1},
    {name: "image2", maxCount: 1},
    {name: "image3", maxCount: 1},
    {name: "image4", maxCount: 1}
  ]),
  updateProduct
)

productRouter.put('/:id/stock', adminAuth, updateProductStock)
productRouter.get('/low-stock', adminAuth, getLowStockProducts)
productRouter.get('/inventory-summary', adminAuth, getInventorySummary)

productRouter.post('/remove/:id', adminAuth, removeProduct)