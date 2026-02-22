import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  linkText: { type: String, required: true, default: 'Shop Now' },
  linkUrl: { type: String, required: true, default: '#' },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Slide = mongoose.models.Slide || mongoose.model('Slide', SlideSchema);

export default Slide;
