import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Guest checkouts allowed
  },
  email: {
    type: String,
    required: true
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['processing', 'tailoring', 'shipped', 'delivered', 'return_requested', 'returned'],
    default: 'processing'
  },
  returnReason: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  stripeSessionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
