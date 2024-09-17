import mongoose from "mongoose";

const orderBillSchema = new Schema({
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Cancelled'], // Example statuses
    default: 'Pending'
  },
  shopName: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export default mongoose.model('Orderbill', orderBillSchema);
