import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
  },
  image1: {
    url: { type: String },
  publicId: { type: String },
  },
  image2: {
    url: { type: String },
  publicId: { type: String },
  },
  image3: {
    url: { type: String },
  publicId: { type: String },
  },
  image4: {
    url: { type: String },
  publicId: { type: String },
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  bestSeller: {
    type: Boolean,
    
  },

}, {timestamps: true})

const Product = mongoose.model("Product", productSchema)
export default Product