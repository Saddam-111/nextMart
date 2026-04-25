import mongoose from "mongoose";

const orderTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const returnRequestSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
    enum: ['Wrong Item', 'Damaged Product', 'Size Issue', 'Color Not as Expected', 'Quality Issue', 'Changed Mind', 'Other'],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Processed'],
    default: 'Pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  processedDate: Date,
  refundAmount: {
    type: Number,
  },
  refundMethod: {
    type: String,
    enum: ['Original Payment Method', 'Store Credit', 'Bank Transfer'],
  },
  adminNotes: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
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
        images: [{
          url: { type: String },
          publicId: { type: String },
        }],
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
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
      default: "Order Placed",
      enum: ['Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'],
    },

    timeline: [orderTimelineSchema],

    paymentMethod: {
      type: String, // COD | razorpay | card | upi
      required: true,
    },
    razorpay_order_id: String,
    paymentId: String,

    payment: {
      type: Boolean,
      default: false,
    },

    invoiceNumber: {
      type: String,
    },

    returnRequest: returnRequestSchema,

    notes: String,

    date: {
      type: Number,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Generate orderId automatically if not provided
orderSchema.pre('validate', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    this.orderId = `ORD${year}${month}${day}-${random}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
