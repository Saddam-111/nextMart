import express from 'express'
import { 
  adminLogin, 
  googleLogin, 
  login, 
  logOut, 
  register, 
  adminLogOut 
} from '../controllers/authController.js'

export const authRouter = express.Router()

// User routes
authRouter.post('/googlelogin', googleLogin)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logOut)  // clears user token

// Admin routes
authRouter.post('/adminLogin', adminLogin)        // sets adminToken cookie
authRouter.get('/adminLogout', adminLogOut)      // clears adminToken cookie
