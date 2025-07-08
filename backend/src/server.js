// import 'dotenv/config';
// import express from "express";
// import { app } from './app.js';
// import connectDB from './db/db.js';
// import { Server } from 'socket.io';
// import http from 'http';

// const server = http.createServer(app);

// // Create a new instance of Socket.IO server
// const io = new Server(server, {
//     cors: {
//         origin: process.env.CORS_ORIGIN,
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// app.set("io",io);

// // Setup DB connection and start server
// connectDB()
//     .then(() => {
//         server.listen(process.env.PORT , () => {
//             console.log(`Server is running on port : ${process.env.PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.log("Mongo DB connection failed -- ", error);
//     });

// // Socket.IO logic
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Join a specific conversation room
//     socket.on("join-conversation", (conversationId) => {
//         socket.join(conversationId);
//         console.log(`User ${socket.id} joined conversation ${conversationId}`);
//     });

//     // Receive and broadcast message to other participants in the room
//     socket.on("new-message", (message) => {
//         const { conversationId, ...msgData } = message;
//         socket.to(conversationId).emit("receive-message", msgData);
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });

// import 'dotenv/config';
// import express from "express";
// import { app } from './app.js';
// import connectDB from './db/db.js';
// import { Server } from 'socket.io';
// import http from 'http';
// import jwt from 'jsonwebtoken';
// import redis from './utils/cache.js';
// import { verifySocketToken } from "./middlewares/auth.middleware.js";
// import { setupSocket } from "./utils/socketManager.js";

// // await redis.connect();

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         // methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// app.set("io", io);

// // Authenticate socket before allowing connection
// io.use((socket, next) => {
//     const token = socket.handshake.auth?.token;

//     if (!token) {
//         return next(new Error("Authentication token missing"));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         socket.userId = decoded._id;
//         next();
//     } catch (err) {
//         next(new Error("Invalid token"));
//     }
// });
// io.use(verifySocketToken);
// setupSocket(io);

// io.on("connection", (socket) => {
//     // console.log("socket handshake: ",socket.handshake.auth)
//     console.log("User connected via socket:", socket.userId);

//     // Add user to online set
//     if (socket.userId) {
//         onlineUsers.add(socket.userId);

//         // Send the current list of online users to this client
//         socket.emit("online-users", Array.from(onlineUsers));

//         // Notify other users that this user is online
//         socket.broadcast.emit("user-online", socket.userId);

//         // Join personal notification room
//         socket.join(socket.userId);
//         console.log(`Socket ${socket.id} joined room ${socket.userId}`);
//     }

//     // Join a conversation room
//     socket.on("join-conversation", (conversationId) => {
//         socket.join(conversationId);
//         console.log(`User ${socket.id} joined conversation ${conversationId}`);
//     });
    
//     socket.on("join-user-room",(userId)=>{
//         socket.join(userId);
//         console.log(`Socket ${socket.id} joined personal room: ${userId}`)
//     });

//     // Handle new message
//     socket.on("new-message", (message) => {
//         const { conversationId, ...msgData } = message;

//         // Emit to conversation room
//         socket.to(conversationId).emit("receive-message", msgData);

//         // Emit notification to recipients
//         if (msgData.recipients && Array.isArray(msgData.recipients)) {
//             msgData.recipients.forEach(recipientId => {
//                 if (recipientId !== socket.userId) {
//                     io.to(recipientId).emit("notify-message", {
//                         conversationId,
//                         message: msgData,
//                     });
//                 }
//             });
//         }
//     });

//     // Mark messages as read
//     socket.on("mark-read", ({ conversationId, readerId }) => {
//         io.to(conversationId).emit("messages-read", {
//             conversationId,
//             readerId
//         });
//     });

//     // On disconnect
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.userId);

//         if (socket.userId) {
//             onlineUsers.delete(socket.userId);
//             socket.broadcast.emit("user-offline", socket.userId);
//         }
//     });
// });

// // Connect DB and start server
// connectDB()
//     .then(() => {
//         server.listen(process.env.PORT, () => {
//             console.log(`Server is running on port : ${process.env.PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.log("Mongo DB connection failed -- ", error);
//     });


//--------------------------------------------------------------
// // ✅ server.js (fixed)
// import 'dotenv/config';
// import express from "express";
// import { app } from './app.js';
// import connectDB from './db/db.js';
// import { Server } from 'socket.io';
// import http from 'http';
// import jwt from 'jsonwebtoken';
// import redis from './utils/cache.js';
// import { verifySocketToken } from "./middlewares/auth.middleware.js";
// import { setupSocket } from "./utils/socketManager.js";

// // await redis.connect();

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true
//   }
// });

// app.set("io", io);

// // ✅ Authenticate socket before connection
// io.use((socket, next) => {
//   const token = socket.handshake.auth?.token;

//   if (!token) {
//     return next(new Error("Authentication token missing"));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     socket.userId = decoded._id;
//     next();
//   } catch (err) {
//     next(new Error("Invalid token"));
//   }
// });

// io.use(verifySocketToken);

// // ✅ Setup all socket logic in ONE place
// setupSocket(io);

// // ✅ REMOVE THIS (it’s now redundant):
// // io.on("connection", (socket) => { ... });
// // ❌ Delete it completely.


// // ✅ Connect DB and start server
// connectDB()
//   .then(() => {
//     server.listen(process.env.PORT, () => {
//       console.log(`Server is running on port : ${process.env.PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log("Mongo DB connection failed -- ", error);
//   });


//--------------------------------------------------------------
// server.js
//--------------------------------------------------------------
// ✅ server.js

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
  // socket.on("join-conversation", (conversationId) => {
  //   socket.join(conversationId);
  //   console.log(`User ${socket.id} joined conversation ${conversationId}`);
  // });

  // Send-message logic
  socket.on("send-message", async (data) => {
    console.log("received data",data);

    const { conversationId, sender, content, receiverId } = data;

    try {
      const newMessage = await Message.create({
        sender,
        content,
        conversation: conversationId,
      });

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId && receiverSocketId!==socket.id) {
        io.to(receiverSocketId).emit("receive-message", {
          ...newMessage.toObject(),
          conversationId,
        });
      }

      // socket.emit("receive-message", {
      //   ...newMessage.toObject(),
      //   conversationId,
      // });
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
