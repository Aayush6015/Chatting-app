// import React, { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getSocket } from "../../utils/socket";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { SendHorizonal } from "lucide-react";
// import MessageItem from "./MessageItem"; // ✅ Corrected import
// import Loader from "../common/Loader"; // ✅ Added Loader
// import MessageInput from "./MessageInput";

// import {
//   fetchMessages,
//   sendMessage,
//   updateSeenStatus,
// } from "../../features/message/messageSlice";

// const ChatWindow = ({ activeConversation }) => {
//   const dispatch = useDispatch();
//   const { messages, isLoading } = useSelector((state) => state.messages); // ✅ Added isLoading
//   const { user } = useSelector((state) => state.auth);

//   const [newMessage, setNewMessage] = useState("");
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Fetch messages on conversation change
//   useEffect(() => {
//     if (!activeConversation) return;
//     dispatch(fetchMessages(activeConversation._id));
//   }, [activeConversation, dispatch]);

//   // Mark messages as read
//   useEffect(() => {
//     if (!activeConversation || messages.length === 0 || !socketRef.current)
//       return;

//     socketRef.current.emit("mark-read", {
//       conversationId: activeConversation._id,
//     });

//     dispatch(updateSeenStatus({ conversationId: activeConversation._id }));
//   }, [activeConversation, messages, dispatch]);

//   // Join socket room and listen for messages
//   useEffect(() => {
//     if (!activeConversation) return;

//     socketRef.current = getSocket();
//     socketRef.current.emit("joinRoom", activeConversation._id);

//     socketRef.current.on("messageReceived", (message) => {
//       if (message.conversation === activeConversation._id) {
//         dispatch(fetchMessages(activeConversation._id));
//       }
//     });

//     socketRef.current.on("messageSeen", ({ messageId }) => {
//       dispatch(updateSeenStatus({ messageId }));
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [activeConversation, dispatch]);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "") return;

//     await dispatch(
//       sendMessage({
//         conversationId: activeConversation._id,
//         content: newMessage,
//       })
//     );

//     socketRef.current.emit("sendMessage", {
//       conversationId: activeConversation._id,
//     });

//     setNewMessage("");
//   };

//   const lastMessage =
//     messages.length > 0 ? messages[messages.length - 1] : null;
//   const isOwnLastMessage = lastMessage?.sender?._id === user._id;

//   return (
//     <div className="flex flex-col h-full w-full">
//       {/* Header */}
//       <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b font-semibold">
//         {activeConversation?.name || "Chat"}
//       </div>

//       {/* Messages */}
//       <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto bg-white dark:bg-gray-900">
//         {isLoading ? (
//           <Loader /> // ✅ Show loader while fetching messages
//         ) : (
//           <>
//             {messages.map((msg, index) => {
//               const isOwn = msg.sender._id === user._id;
//               const isLast = index === messages.length - 1 && isOwn;
//               return (
//                 <MessageItem
//                   key={msg._id}
//                   message={msg}
//                   isOwn={isOwn}
//                   isLast={isLast}
//                 />
//               );
//             })}
//             {isOwnLastMessage && (
//               <div className="text-xs text-right pr-2 text-gray-500">
//                 {lastMessage.seen ? "Seen" : "Delivered"}
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </ScrollArea>

//       {/* Message Input */}
//       <div className="flex items-center p-3 border-t bg-gray-50 dark:bg-gray-800">
//         {/* <input
//           type="text"
//           placeholder="Type a message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           className="flex-1 rounded-lg px-3 py-2 mr-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none"
//         /> */}
//         <MessageInput activeConversation={activeConversation} />

//         <button
//           onClick={handleSendMessage}
//           className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
//         >
//           <SendHorizonal size={50} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../../utils/socket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  SendHorizonal,
  Phone,
  Video,
  MoreVertical,
  Users,
  Circle,
} from "lucide-react";
import MessageItem from "./MessageItem";
import Loader from "../common/Loader";
import MessageInput from "./MessageInput";

import {
  fetchMessages,
  sendMessage,
  updateSeenStatus,
} from "../../features/message/messageSlice";

const ChatWindow = ({ activeConversation }) => {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector((state) => state.messages || {});
  const { user } = useSelector((state) => state.auth || {});
  const { onlineUsers } = useSelector((state) => state.presence);

  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch messages on conversation change
  useEffect(() => {
    if (!activeConversation) return;
    dispatch(fetchMessages(activeConversation?._id));
  }, [activeConversation, dispatch]);

  // Mark messages as read
  useEffect(() => {
    if (!activeConversation || messages?.length === 0 || !socketRef.current)
      return;

    socketRef.current.emit("mark-read", {
      conversationId: activeConversation._id,
    });

    dispatch(updateSeenStatus({ conversationId: activeConversation._id }));
  }, [activeConversation, messages, dispatch]);

  // Join socket room and listen for messages
  useEffect(() => {
    if (!activeConversation) return;

    socketRef.current = getSocket();
    socketRef.current.emit("joinRoom", activeConversation._id);

    socketRef.current.on("messageReceived", (message) => {
      if (message.conversation === activeConversation._id) {
        dispatch(fetchMessages(activeConversation._id));
      }
    });

    socketRef.current.on("messageSeen", ({ messageId }) => {
      dispatch(updateSeenStatus({ messageId }));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [activeConversation, dispatch]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    await dispatch(
      sendMessage({
        conversationId: activeConversation._id,
        content: newMessage,
      })
    );

    socketRef.current.emit("sendMessage", {
      conversationId: activeConversation._id,
    });

    setNewMessage("");
  };

  const lastMessage =
    messages?.length > 0 ? messages[messages.length - 1] : null;
  const isOwnLastMessage = lastMessage?.sender?._id === user?._id;

  // Get conversation partner info (for display purposes)
  const getConversationInfo = () => {
    if (!activeConversation) return { name: "Chat", isOnline: false };

    // If it's a group chat
    if (activeConversation.isGroup) {
      return {
        name: activeConversation.name || "Group Chat",
        subtitle: `${activeConversation.participants?.length || 0} members`,
        isGroup: true,
        isOnline: false,
      };
    }

    // For direct messages, find the other participant
    const otherParticipant = activeConversation.participants?.find(
      (p) => p._id !== user?._id
    );

    const isOnline = onlineUsers.includes(otherParticipant?._id);
    console.log("this is from chat window", otherParticipant?.username);
    return {
      name:
        otherParticipant?.username || activeConversation.name || "unknown user",
      subtitle: isOnline ? "Active now" : "Offline", // You can replace this with actual online status
      isOnline, // You can replace this with actual online status
      isGroup: false,
    };
  };

  const conversationInfo = getConversationInfo();

  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Welcome to Chat
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {conversationInfo.isGroup ? (
                  <Users className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {conversationInfo.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {conversationInfo.isOnline && !conversationInfo.isGroup && (
                <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current bg-white dark:bg-gray-800 rounded-full" />
              )}
            </div>

            {/* Name and Status */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {conversationInfo.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversationInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-900">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : (
            <div>
              {messages?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    No messages yet
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Start the conversation by sending a message
                  </p>
                </div>
              ) : (
                <>
                  {messages?.map((msg, index) => {
                    const isOwn = msg.sender._id === user?._id;
                    const isLast = index === messages?.length - 1 && isOwn;
                    return (
                      <MessageItem
                        key={msg._id}
                        message={msg}
                        isOwn={isOwn}
                        isLast={isLast}
                      />
                    );
                  })}

                  {/* Message Status */}
                  {isOwnLastMessage && (
                    <div className="flex justify-end">
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
                        {lastMessage.seen ? (
                          <div className="flex items-center space-x-1">
                            <Circle className="w-2 h-2 text-blue-500 fill-current" />
                            <span>Seen</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Circle className="w-2 h-2 text-gray-400 fill-current" />
                            <span>Delivered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-3 max-w-full">
          {/* Message Input Component */}
          <div className="flex-1">
            <MessageInput activeConversation={activeConversation} />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
