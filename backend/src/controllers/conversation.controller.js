import Conversation from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloud } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import Message from "../models/messages.model.js"
import { conversationHelpers } from "../models/index.js";
import redis  from "../utils/cache.js"


const createOrGetConversation = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;

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

  const io = req.app.get("io");
  conversation.participants.forEach(participantId => {
    io.to(participantId.toString()).emit("conversation-updated", conversation);
  });


  return res
    .status(200)
    .json(new ApiResponse(200, conversation, "Conversation fetched successfully"));
});

const getAllConversationsForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const conversationsArray = await conversationHelpers.getUserConversationsWithDetails(userId);

  const sortedConversations = conversationsArray.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const paginatedConversations = sortedConversations.slice(skip, skip + parseInt(limit));

  // You may populate manually if needed (or enhance getUserConversationsWithDetails to return populated versions)

  return res.status(200).json(new ApiResponse(200, {
    conversations: paginatedConversations,
    totalPages: Math.ceil(conversationsArray.length / limit),
    currentPage: parseInt(page)
  }, "Conversations fetched"));
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

  await redis.del(`messages:${conversationId}:*`);

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
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'username profilePicture'
      }
    });
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

  // conversation.participants.forEach(participant => {
  //   io.to(participant?._id.toString()).emit("new-conversation",conversation);
  // })

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