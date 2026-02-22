import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
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

// We check if the model exists to prevent "Cannot overwrite model once compiled" errors during Vercel hot reload
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
