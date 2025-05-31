// controllers/message.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { messageHelpers, conversationHelpers } from "../models/index.js";
import Message from "../models/messages.model.js"
import Conversation from "../models/conversation.model.js";
import {app} from "../app.js"

// 1. Send a message
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    // console.log(conversationId)
    const { content, messageType = "text" } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "Message content is required");
    }

    // const conversation = await conversationHelpers.findByParticipants(req.user._id, conversationId);

    const conversation = await Conversation.findById(conversationId);

if (!conversation) {
    throw new ApiError(404, "Conversation not found");
}

if (!conversation.participants.includes(req.user._id)) {
    throw new ApiError(403, "You are not a participant in this conversation");
}


    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const message = await messageHelpers.createMessage(conversationId, req.user._id, content, messageType);

    const io = req.app.get("io");
    io.to(conversationId).emit("receive-message",message);

    return res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

// 2. Get messages for a conversation
const getMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await messageHelpers.getByConversation(conversationId, parseInt(page), parseInt(limit));

    return res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

// 3. Mark all messages as read in a conversation
const markAsRead = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    await messageHelpers.markManyAsRead(conversationId, req.user._id);
    const result = await Message.updateMany(
        { conversation: conversationId, readBy: { $ne: req.user._id } },
        { $addToSet: { readBy: req.user._id } }
    );
    
    return res.status(200).json(new ApiResponse(200, { updatedCount: result.modifiedCount }, "All messages marked as read"));
    
    // return res.status(200).json(new ApiResponse(200, {}, "All messages marked as read"));
});



// 4. Get unread message count
const getUnreadCount = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    const count = await messageHelpers.getUnreadCount(conversationId, req.user._id);

    return res.status(200).json(new ApiResponse(200, { count }, "Unread count fetched"));
});

// 5. Delete a message (optional)
const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message || message.sender.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized or message not found");
    }

    await message.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, "Message deleted successfully"));
});

// 6. Edit a message (optional)
const editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { newContent } = req.body;

    const message = await Message.findById(messageId);

    if (!message || message.sender.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized or message not found");
    }

    message.content = newContent;
    message.edited = true;
    await message.save();

    return res.status(200).json(new ApiResponse(200, message, "Message edited successfully"));
});

export {
    sendMessage,
    getMessages,
    markAsRead,
    getUnreadCount,
    deleteMessage,
    editMessage


}
