import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  base: {
    type: String,
    required: true,
    default: 'PKR'
  },
  rates: {
    type: Map,
    of: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Currency = mongoose.model('Currency', currencySchema);

export default Currency;
