import User from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import { generateAdminToken, generateToken } from "../config/token.js";

let adminPasswordHashCache = null;

async function getAdminPasswordHash() {
  if (adminPasswordHashCache) return adminPasswordHashCache;

  if (process.env.ADMIN_PASSWORD_HASH) {
    adminPasswordHashCache = process.env.ADMIN_PASSWORD_HASH;
  } else if (process.env.ADMIN_PASSWORD) {
    adminPasswordHashCache = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  } else {
    throw new Error('Admin credentials not configured');
  }
  return adminPasswordHashCache;
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = await generateToken(user._id);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 3 * 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = await generateToken(user._id);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 3 * 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
}

export const googleLogin = async (req , res) => {
  try {
    const {name, email} = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    const token = await generateToken(user._id);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 3 * 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Google login error", error: error.message });
  }
}

export const logOut = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax'
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
};

export const adminLogin = async (req , res) => {
  try {
    const {email, password} = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (email !== adminEmail) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const adminPasswordHash = await getAdminPasswordHash();
    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateAdminToken(email);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      maxAge: 1 * 24 * 60 * 60 * 1000
    };

    res.cookie("adminToken", token, cookieOptions);
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
}

export const adminLogOut = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("adminToken", {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax'
    });
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
};

