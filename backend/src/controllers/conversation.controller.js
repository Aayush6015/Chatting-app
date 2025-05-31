import Conversation  from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloud } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import Message from "../models/messages.model.js"
import { conversationHelpers } from "../models/index.js";


const createOrGetConversation = asyncHandler(async (req, res) => {
    const { targetUserId } = req.body;

    // Validate input
    if (!targetUserId) {
        throw new ApiError(400, "Target user ID is required");
    }

    const currentUserId = req.user._id;

    // Prevent creating conversation with self
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new ApiError(400, "Cannot create conversation with yourself");
    }

    // Find or create conversation
    const conversation = await conversationHelpers.findOrCreateConversation(currentUserId, targetUserId);

    // Populate participants and last message for frontend display
    await conversation.populate('participants', 'username profilePicture email');
    await conversation.populate('lastMessage');

    return res
        .status(200)
        .json(new ApiResponse(200, conversation, "Conversation fetched successfully"));
});

const getAllConversationsForUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    const conversations = await conversationHelpers.getUserConversationsWithDetails(userId);
  
    return res
      .status(200)
      .json(new ApiResponse(200, conversations, "Fetched user conversations"));
  });
  
const deleteConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.body;
    const userId = req.user?._id;
  
    const conversation = await Conversation.findById(conversationId);
  
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
  
    if (!conversation.participants.includes(userId)) {
      throw new ApiError(403, "Not authorized to delete this conversation");
    }
  
    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ conversation: conversationId });

    const io = req.app.get("io");
    conversation.participants.forEach(participantId => {
        io.to(participantId.toString()).emit("conversation-deleted", { conversationId });
    });
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Conversation deleted successfully"));
  });

const getConversationById = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
  
    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'username profilePicture email')
      .populate('lastMessage');

      const io = req.app.get("io");
      io.to(targetUserId.toString()).emit("new-conversation", conversation);
  
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, conversation, "Conversation details fetched"));
  });
  


export {
    createOrGetConversation,
    getAllConversationsForUser,
    deleteConversation,
    getConversationById

}