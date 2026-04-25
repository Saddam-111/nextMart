import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/database.js'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/authRoute.js'
import { userRouter } from './routes/userRoute.js'
import { productRouter } from './routes/productRoute.js'
import { cartRouter } from './routes/cartRoute.js'
import { orderRouter } from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import userProfileRouter from './routes/userProfileRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import couponRouter from './routes/couponRoute.js'
import analyticsRouter from './routes/analyticsRoute.js'
import adminUserRouter from './routes/adminUserRoute.js'
import reportsRouter from './routes/reportsRoute.js'
import invoiceRouter from './routes/invoiceRoute.js'
import returnRouter from './routes/returnRoute.js'
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later."
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, please try again later."
    });
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "https://nextmart-sigma.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use('/api/v1/auth', authLimiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/profile', userProfileRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/admin/users', adminUserRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/invoice', invoiceRouter);
app.use('/api/v1/return', returnRouter);

app.get('/', (req, res) => {
  res.send("NextMart API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});