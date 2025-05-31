import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  editMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Send and fetch messages
router
  .route("/:conversationId")
  .get(verifyJwt, getMessages)     // Get messages in conversation
  .post(verifyJwt, sendMessage);   // Send a message

// Read status
router
  .route("/mark-read/:conversationId")
  .patch(verifyJwt, markAsRead);   // Mark messages as read

router
  .route("/unread-count/:conversationId")
  .get(verifyJwt, getUnreadCount); // Get unread count

// Edit and delete messages (optional)
router
  .route("/single/:messageId")
  .delete(verifyJwt, deleteMessage) // Delete a message
  .patch(verifyJwt, editMessage);   // Edit a message

export default router;
