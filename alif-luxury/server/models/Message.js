import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  sessionId: {
    type: String, // To group chats natively by browser session if not logged in
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
