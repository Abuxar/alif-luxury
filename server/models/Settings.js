import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  announcementBar: {
    isActive: { type: Boolean, default: false },
    text: { type: String, default: 'Welcome to Alif Luxury. Complimentary worldwide shipping on all orders.' },
    link: { type: String, default: '' },
    backgroundColor: { type: String, default: '#0D0D12' },
    textColor: { type: String, default: '#C9A84C' }
  }
}, {
  timestamps: true
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
