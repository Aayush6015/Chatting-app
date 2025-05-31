// models/index.js
import {User} from './user.model.js';
import Conversation from './conversation.model.js';
import Message from './messages.model.js';
import bcrypt from 'bcryptjs';

// Helper functions for common operations (without statics/methods)
export const userHelpers = {
    // Compare password
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    // Update user online status
    async setOnlineStatus(userId, status) {
        const updateData = { isOnline: status };
        if (!status) {
            updateData.lastSeen = new Date();
        }
        return await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );
    },

    // Search users by username
    async searchUsers(query, currentUserId, limit = 10) {
        return await User.find({
            _id: { $ne: currentUserId },
            username: { $regex: query, $options: 'i' }
        })
            .select('username profilePicture isOnline lastSeen')
            .limit(limit);
    }
};

export const conversationHelpers = {
    // Find conversation between two users
    async findByParticipants(userId1, userId2) {
        return await Conversation.findOne({
            participants: { $all: [userId1, userId2] },
            conversationType: 'private'
        });
    },

    // Get conversations for a user
    async getByUser(userId) {
        return await Conversation.find({
            participants: userId
        })
            .populate('participants', 'username profilePicture isOnline lastSeen')
            .populate('lastMessage')
            .sort({ lastActivity: -1 });
    },

    // Find or create conversation between two users
    async findOrCreateConversation(userId1, userId2) {
        let conversation = await this.findByParticipants(userId1, userId2);

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId1, userId2],
                conversationType: 'private'
            });
        }

        return conversation;
    },

    // Update last activity
    async updateLastActivity(conversationId) {
        return await Conversation.findByIdAndUpdate(
            conversationId,
            { lastActivity: new Date() },
            { new: true }
        );
    },

    // Get user's conversations with unread counts
    async getUserConversationsWithDetails(userId) {
        const conversations = await this.getByUser(userId);

        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await messageHelpers.getUnreadCount(conv._id, userId);
                return {
                    ...conv.toObject(),
                    unreadCount
                };
            })
        );

        return conversationsWithUnread;
    }
};

export const messageHelpers = {
    // Get messages for a conversation with pagination
    async getByConversation(conversationId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;

        return await Message.find({ conversation: conversationId })
            .populate('sender', 'username profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
    },

    // Mark message as delivered
    async markDelivered(messageId) {
        return await Message.findByIdAndUpdate(
            messageId,
            { delivered: true },
            { new: true }
        );
    },

    // Mark message as read by a user
    async markReadBy(messageId, userId) {
        const message = await Message.findById(messageId);

        // Check if user has already read this message
        const alreadyRead = message.readBy.some(read => read.user.toString() === userId.toString());

        if (!alreadyRead) {
            message.readBy.push({
                user: userId,
                readAt: new Date()
            });
            await message.save();
        }

        return message;
    },

    // Check if message is read by a specific user
    isReadBy(message, userId) {
        return message.readBy.some(read => read.user.toString() === userId.toString());
    },

    // Mark multiple messages as read
    async markManyAsRead(conversationId, userId) {
        return await Message.updateMany(
            {
                conversation: conversationId,
                sender: { $ne: userId },
                'readBy.user': { $ne: userId }
            },
            {
                $push: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                }
            }
        );
    },

    // Get unread message count for user in conversation
    async getUnreadCount(conversationId, userId) {
        return await Message.countDocuments({
            conversation: conversationId,
            sender: { $ne: userId },
            'readBy.user': { $ne: userId }
        });
    },

    // Create and send a new message
    async createMessage(conversationId, senderId, content, messageType = 'text') {
        const message = await Message.create({
            conversation: conversationId,
            sender: senderId,
            content,
            messageType,
            delivered: true // Mark as delivered immediately for now
        });

        // Update conversation's last message and activity
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            lastActivity: new Date()
        });

        // Populate sender info for response
        await message.populate('sender', 'username profilePicture');

        return message;
    }
};

export { User, Conversation, Message };