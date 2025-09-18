import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image1: {
          url: { type: String, required: true },
          publicId: { type: String },
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    address: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    status: {
      type: String,
      default: "Order Placed", // Placed | Shipped | Delivered | Cancelled
    },

    paymentMethod: {
      type: String, // COD | razorpay
      required: true,
    },
    razorpay_order_id: {
       type: String 
      },


    payment: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Number,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
