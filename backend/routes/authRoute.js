import express from 'express'
import { adminLogin, googleLogin, login, logOut, register } from '../controllers/authController.js'

export const authRouter = express.Router()


authRouter.post('/googlelogin', googleLogin)
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logOut)
authRouter.post('/adminLogin', adminLogin)