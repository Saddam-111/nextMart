import User from "../models/userModel.js"


export const addToCart = async (req , res) => {
  try {
    const {itemId, size} = req.body

    const userData = await User.findById(req.userId);

    if(!userData){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = userData.cartData || {}

    if(cartData[itemId]){
      if(cartData[itemId][size]){
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    }else{
      cartData[itemId] = {}
      cartData[itemId][size] = 1;
    }

    await User.findByIdAndUpdate(req.userId, {cartData})

    return res.status(201).json({
      success: true,
      message: "Added to cart"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Add to cart error",
      error: error.message
    })
  }
}


export const updateCart = async (req , res) => {
  try {
    const {itemId, size, quantity} = req.body
    const userData = await User.findById(req.userId)
    let cartData = await userData.cartData

    cartData[itemId][size] = quantity
    await User.findByIdAndUpdate(req.userId, {cartData})

    return res.status(200).json({
      success: true,
      message: "Cart updated"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update to cart error",
      error: error.message
    })
  }
}

export const getUserCart = async (req , res) => {
  try {
    const userData = await User.findById(req.userId)
    let cartData = await userData.cartData;

    return res.status(200).json({ success: true, cartData })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get cart error",
      error: error.message
    })
  }
}
