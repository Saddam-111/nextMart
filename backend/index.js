import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/database.js'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/authRoute.js'
import { userRouter } from './routes/userRoute.js'
import { productRouter } from './routes/productRoute.js'
import { cartRouter } from './routes/cartRoute.js'
import { orderRouter } from './routes/orderRoute.js'
dotenv.config()

const app = express()

const port = process.env.PORT

//database connection
await connectDB()


//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://nextmart-nu6u.onrender.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

//apis
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)


app.get('/', (req, res) => {
  res.send("All is well")
})

app.listen(port, () => {
  console.log("Api working")
})