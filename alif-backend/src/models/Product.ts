import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  sku: string;
  price: number;
  salePrice?: number;
  description: string;
  components: Array<{
    name: string; // e.g., "Embroidered Front"
    measurement: string; // e.g., "1.25m"
  }>;
  fabricComposition: string;
  careInstructions: string;
  colorFamily: string;
  occasionTags: string[];
  media: string[];
  coverImage: string;
  inventoryCount: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  description: { type: String, required: true },
  components: [{
    name: { type: String, required: true },
    measurement: { type: String, required: true }
  }],
  fabricComposition: { type: String, required: true },
  careInstructions: { type: String },
  colorFamily: { type: String },
  occasionTags: [{ type: String }],
  media: [{ type: String }],
  coverImage: { type: String, required: true },
  inventoryCount: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
