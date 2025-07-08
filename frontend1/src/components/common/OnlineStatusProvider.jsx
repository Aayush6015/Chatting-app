import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../../utils/socket.js";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
} from "../../features/onlineUsers/onlineUserSlice.js";

const OnlineStatusProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("online-users", (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    socket.on("user-online", (userId) => {
      dispatch(addOnlineUser(userId));
    });

    socket.on("user-offline", (userId) => {
      dispatch(removeOnlineUser(userId));
    });

    return () => {
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [dispatch]);

  return null; // This is a background-only component
};

export default OnlineStatusProvider;
