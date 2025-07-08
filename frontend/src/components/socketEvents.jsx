import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket,connectSocket,disconnectSocket } from "../utils/socket"; // Fix: use getSocket to support lazy loading
import { receiveMessage, messagesRead } from "../features/message/messageSlice";
import {
  addOrUpdateConversation,
  removeConversation,
} from "../features/conversation/conversationSlice";
import {setOnlineUsers, userCameOnline, userWentOffline}  from "../features/auth/presenceSlice.js"; // ✅ Import online users action


const SocketEvents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(dispatch,user?._id); // Get existing or connect
    socket.connect();

    // Emit user join
    socket.emit("add-user", user._id); // ✅ Let backend track online users

    // ✅ Listen for new messages
    socket.on("receive-message", (messageData) => {
      dispatch(receiveMessage({
        conversationId: messageData.conversationId,
        message: messageData,
      }));
    });

    // ✅ Mark messages as read
    socket.on("messages-read", ({ conversationId, readerId }) => {
      dispatch(messagesRead({ conversationId, readerId }));
    });

    // ✅ Handle conversation updates
    socket.on("conversation-updated", (conversation) => {
      dispatch(addOrUpdateConversation(conversation));
    });

    socket.on("conversation-deleted", (conversationId) => {
      dispatch(removeConversation(conversationId));
    });

    // ✅ Track online users
    socket.on("online-users", (onlineUserIds) => {
      dispatch(setOnlineUsers(onlineUserIds));
    });

    return () => {
      socket.off("receive-message");
      socket.off("messages-read");
      socket.off("conversation-updated");
      socket.off("conversation-deleted");
      socket.off("online-users");
      disconnectSocket();
    };
  }, [user, dispatch]);

  return null;
};

export default SocketEvents;
