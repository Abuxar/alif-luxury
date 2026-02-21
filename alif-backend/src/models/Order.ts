import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    priceAtTimeOfPurchase: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentMethod: 'Credit Card' | 'COD' | 'PayFast' | 'JazzCash' | 'SadaPay';
  shippingStatus: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Returned';
  trackingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTimeOfPurchase: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Credit Card', 'COD', 'PayFast', 'JazzCash', 'SadaPay'], required: true },
  shippingStatus: { type: String, enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned'], default: 'Processing' },
  trackingId: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);
