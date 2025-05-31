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


import 'dotenv/config';
import express from "express";
import { app } from './app.js';
import connectDB from './db/db.js';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken'; // ⬅️ Add this

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set("io", io);

// ⬇️ Authenticate socket before allowing connection
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
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

io.on("connection", (socket) => {
    console.log("User connected via socket:", socket.userId);

    // Join user to their personal room (for notifications)
    if (socket.userId) {
        socket.join(socket.userId); // ⬅️ userId-based room
        console.log(`Socket ${socket.id} joined room ${socket.userId}`);
    }

    // Join a conversation room
    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Receive and broadcast message to other participants
    socket.on("new-message", (message) => {
        const { conversationId, ...msgData } = message;
        socket.to(conversationId).emit("receive-message", msgData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId);
    });
});

// Connect DB and start server
connectDB()
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port : ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Mongo DB connection failed -- ", error);
    });
