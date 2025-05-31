// models/Conversation.js
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }], // iska matlab ek array hoga chat karne waalo ka
  conversationType: {
    type: String,
    enum: ['private'], // Will add 'group' in Phase 3
    default: 'private'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

conversationSchema.pre('save', function (next) {
  if (this.isModified('lastMessage')) {
    this.lastActivity = Date.now();
  }
  next();
});

// Ensure only 2 participants for private chats
conversationSchema.pre('save', function(next) {
  if (this.conversationType === 'private' && this.participants.length !== 2) {
    return next(new Error('Private conversations must have exactly 2 participants'));
  }
  next();
});

// Index for faster queries
conversationSchema.index({ participants: 1, lastActivity: -1 });

 const Conversation = mongoose.model('Conversation', conversationSchema);
 export default Conversation

