import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'Customer' | 'Admin';
  wishlist: mongoose.Types.ObjectId[];
  orderHistory: mongoose.Types.ObjectId[];
  savedAddresses: Array<{
    title: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  savedAddresses: [{
    title: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
