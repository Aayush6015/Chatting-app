// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'], // Will expand in later phases
    default: 'text'
  },
  edited:{
    type:Boolean,
    default:false,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === 'text';
    },
    maxlength: 1000
  },
  fileUrl: {
    type: String, // For images/files in later phases
    required: function () {
      return this.messageType !== 'text';
    }
  },
  fileName: {
    type: String // Original filename for file uploads
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  delivered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster message retrieval
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;