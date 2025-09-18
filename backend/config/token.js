import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken = async(userId) => {
    try {
      const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"3d"})
      return token;
    } catch (error) {
      console.log(error)
    }
}


export const generateAdminToken = async(email) => {
    try {
      const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"3d"})
      return token;
    } catch (error) {
      console.log(error)
    }
  }