import User from "../models/userModel.js"


export const getCurrentUser = async(req ,res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    if(!user){
        return res.status(400).json({
        message: "User not found"
      })
    }
    return res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      message: "Failed to load currentUser user"
    })
  }
}


export const getAdmin = async (req , res) => {
  try {
    const adminEmail = req.adminEmail;
    if(!adminEmail){
      return res.status(400).json({
        message: "Admin not found"
      })
    }
    return res.status(200).json({
      email: adminEmail,
      role: "admin"
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to load Admin"
    })
  }
}