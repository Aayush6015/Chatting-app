// import "dotenv/config"
import { io } from "socket.io-client";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
} from "../features/online/onlineSlice";

const URL = import.meta.env.VITE_BACKEND_URL;
let socket = null;

/**
 * Connects socket and sets up listeners for online user tracking
 * @param {Function} dispatch - Redux dispatch function
 * @param {String} userId - Current logged-in user ID (to filter self events)
 * @returns socket instance
 */
export const connectSocket = (dispatch, userId) => {
  const token = localStorage.getItem("accessToken");

  socket = io(URL, {
    withCredentials: true,
    auth: { token },
    transports: ["websocket"],
  });

  // Online users list on initial connection
  socket.on("online-users", (users) => {
    dispatch(setOnlineUsers(users));
  });

  // Someone connected
  socket.on("user-connected", (user) => {
    if (user._id !== userId) {
      dispatch(addOnlineUser(user));
    }
  });

  // Someone disconnected
  socket.on("user-disconnected", (user) => {
    if (user._id !== userId) {
      dispatch(removeOnlineUser(user));
    }
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
