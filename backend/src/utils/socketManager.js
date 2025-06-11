// src/utils/socketManager.js

const connectedUsers = new Map(); // socket.id => userId
const onlineUsers = new Map();    // userId => socket.id

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const user = socket.handshake.auth?.tokenUser;

    if (!user || !user._id) {
      console.log("Invalid user on socket connection. Disconnecting.");
      socket.disconnect();
      return;
    }

    const userId = user._id;

    // Save socket-user mapping
    connectedUsers.set(socket.id, userId);
    onlineUsers.set(userId, socket.id);

    console.log(`🔌 User connected: ${userId}`);
    console.log("🟢 Online Users:", [...onlineUsers.keys()]);

    // Notify all clients of updated online users
    io.emit("online-users", Array.from(onlineUsers.keys()));

    // Notify others that someone connected
    socket.broadcast.emit("user-connected", { _id: userId });

    // Handle disconnect
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.id);

      socket.on("send-message", async (data) => {
        const { conversationId, sender, content, receiverId } = data;
      
        const newMessage = await Message.create({
          sender,
          content,
          conversationId,
        });
      
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", {
            ...newMessage.toObject(),
            conversationId,
          });
        }
      
        // Optionally, send back to sender too
        socket.emit("receive-message", {
          ...newMessage.toObject(),
          conversationId,
        });
      });
      

      // Remove only if the same socket.id is stored (avoid multi-socket bugs)
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
      }

      console.log(`❌ User disconnected: ${userId}`);
      console.log("🟢 Online Users:", [...onlineUsers.keys()]);

      // Notify all users
      io.emit("online-users", Array.from(onlineUsers.keys()));
      socket.broadcast.emit("user-disconnected", { _id: userId });
    });
  });
};
