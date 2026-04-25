import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  phone: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  profileImage: {
    url: String,
    publicId: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cartData: {
    type: Object,
    default: {}
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  recentlyViewed: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  orderCount: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  userTags: [{
    type: String,
    enum: ['VIP', 'frequent_buyer', 'new_customer', 'inactive']
  }]
}, {timestamps: true, minimize: false})


const User = mongoose.model("User", userSchema);

export default User