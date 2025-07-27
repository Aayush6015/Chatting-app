
import 'dotenv/config';
import express from "express";
import { app } from './app.js';
import connectDB from './db/db.js';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import redis from './utils/cache.js';
import { verifySocketToken } from "./middlewares/auth.middleware.js";
import { connectedUsers, onlineUsers } from "./utils/socketManager.js";
import Message from "./models/messages.model.js"; // <-- Import here!

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);

// ✅ Authenticate socket before connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("Missing token")
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded._id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.use(verifySocketToken);

// ✅ All your socket logic here:
io.on("connection", (socket) => {
  const userId = socket.userId;

  if (!userId) {
    console.log("❌ Invalid user on socket connection. Disconnecting.");
    socket.disconnect();
    return;
  }

  connectedUsers.set(socket.id, userId);
  onlineUsers.set(userId, socket.id);

  console.log(`🔌 User connected: ${userId}`);
  console.log("🟢 Online Users:", [...onlineUsers.keys()]);

  // Send online users to everyone
  io.emit("online-users", Array.from(onlineUsers.keys()));
  socket.broadcast.emit("user-connected", { _id: userId });

  // Handle joining a user room
  socket.join(userId);
  console.log(`Socket ${socket.id} joined room: ${userId}`);

  // Join conversation room
  socket.on("join-conversation", (conversationId) => {
    console.log("from server.js")
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Send-message logic
  // socket.on("send-message", async (data) => {
  //   console.log("received data",data);

  //   const { conversationId, sender, content, receiverId,tempId } = data;

  //   try {
  //     const newMessage = await Message.create({
  //       sender,
  //       content,
  //       conversation: conversationId,
  //     });

  //     const receiverSocketId = onlineUsers.get(receiverId);

  //     if (receiverSocketId && receiverSocketId!==socket.id) {
  //       io.to(receiverSocketId).emit("receive-message", {
  //         ...newMessage.toObject(),
  //         conversationId,
  //         tempId,
  //       });
  //     }

  //   } catch (error) {
  //     console.error("💥 Error sending message:", error);
  //     socket.emit("error", "Message could not be sent");
  //   }
  // });

  socket.on("edit-message", async ({ messageId, newContent }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit("error", "Message not found");
        return;
      }
      if (message.sender.toString() != socket.userId.toString()) {
        socket.emit("error", "Not authorized");
        return ;

      }
      message.content = newContent;
      message.edited = true;
      await message.save();

      const conversationId = message.conversation.toString();
      await redis.del(`message:${conversationId}:page:1`); // deleting from cache

      io.to(conversationId).emit("message-edited",{
        conversationId,
        messageId,
        newContent,
      });

    } catch (error) {
        console.log(error);
        socket.emit("error","could not edit message");
    }
  });

  socket.on("send-message", async (data) => {
    console.log("received data", data);

    const { conversationId, sender, content, receiverId, tempId } = data;

    try {
      const newMessage = await Message.create({
        sender,
        content,
        conversation: conversationId,
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      // ✅ Send to receiver if online & not self
      if (receiverSocketId && receiverSocketId !== socket.id) {
        io.to(receiverSocketId).emit("receive-message", {
          ...newMessage.toObject(),
          conversation: conversationId, // NOTE: use same key as client expects
          tempId, // ✅ So they know it’s linked
        });
      }

      // ✅ Always send back to sender too — so they can replace temp message
      socket.emit("receive-message", {
        ...newMessage.toObject(),
        conversation: conversationId,
        tempId,
      });

    } catch (error) {
      console.error("💥 Error sending message:", error);
      socket.emit("error", "Message could not be sent");
    }
  });


  // Mark as read
  socket.on("mark-read", ({ conversationId, readerId }) => {
    io.to(conversationId).emit("messages-read", {
      conversationId,
      readerId,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);

    if (onlineUsers.get(userId) === socket.id) {
      onlineUsers.delete(userId);
    }

    console.log(`❌ User disconnected: ${userId}`);
    console.log("🟢 Online Users:", [...onlineUsers.keys()]);

    io.emit("online-users", Array.from(onlineUsers.keys()));
    socket.broadcast.emit("user-disconnected", { _id: userId });
  });
});


// ✅ Connect DB + start server
connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection failed -- ", error);
  });
