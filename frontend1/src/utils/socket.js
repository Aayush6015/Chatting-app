// utils/socket.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {

  if(socket)
  {
    console.log("Closing old socket")
    socket.disconnect();
    socket = null;
  }
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { token },
      withCredentials: true,
    });

    // Optional debug:
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};
