import User from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import { generateAdminToken, generateToken } from "../config/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Enter a valid email"
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate token
    const token = await generateToken(user._id);

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: true,  // Secure cookies in production
      sameSite: 'None',  // Cross-origin support
      maxAge: 3 * 24 * 60 * 60 * 1000  // 3 days
    });

    return res.status(201).json({
      user: user.select("-password"),  // Return user object without password
      token: token  // Optionally return the token in the response body
    });

  } catch (error) {
    console.log("Registration error:", error.message);  // More specific error logging
    return res.status(500).json({
      message: "Registration failed, please try again later."
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email"
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    // Check if passwords match
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    // Generate token
    const token = await generateToken(user._id);

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: true,  // Secure cookies in production
      sameSite: 'None',  // Cross-origin support
      maxAge: 3 * 24 * 60 * 60 * 1000  // 3 days
    });

    return res.status(200).json({
      user,  
       token 
    });

  } catch (error) {
    console.log("Login error:", error.message);  // More specific error logging
    return res.status(500).json({
      message: "Login failed, please try again later."
    });
  }
}

export const googleLogin = async (req , res) => {
  try {
    const {name, email} = req.body;
    let user = await User.findOne({ email });
    if (!user) {
     user = await User.create({
      name, email
     })
    }

    // Generate token
    const token = await generateToken(user._id);

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      secure: true,  // Secure cookies in production
      sameSite: 'None',  // Cross-origin support
      maxAge: 3 * 24 * 60 * 60 * 1000  // 3 days
    });

    return res.status(200).json({
      user,  
       token 
    });


  } catch (error) {
    console.log("Google login error:", error.message);  // More specific error logging
    return res.status(500).json({
      message: "google login error."
    });
  }
}

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("User logout error:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};




// admin 


export const adminLogin = async (req , res) => {
  try {
    const {email, password} = req.body
    if(email ===process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      
      const token = await generateAdminToken(email)
      res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 1*24*60*60*1000
    })

    return res.status(200).json(token)
    }
  } catch (error) {
    return res.status(500).json({
      message: "Invalid credentials"
    })
  }
}


export const adminLogOut = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.log("Admin logout error:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
};
