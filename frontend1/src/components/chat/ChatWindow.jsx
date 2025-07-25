// // src/components/chat/ChatWindow.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../../utils/socket.js";
// import {
//   addMessage,
//   markMessagesAsRead,
//   fetchMessages,
// } from "../../features/message/messageSlice.js";
// import MessageInput from "./MessageInput.jsx";

// const [contextMenu, setContextMenu] = useState({
//   visible: false,
//   x: 0,
//   y: 0,
//   messageId: null,
// });

// const ChatWindow = ({ activeConversation }) => {
//   const socket = getSocket();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const messagesFromStore = useSelector(
//     (state) => state.messages.conversationMessages[activeConversation?._id]
//   );

//   const messages = messagesFromStore || [];

//   const chatEndRef = useRef(null);

//   // console.log(socket.connected)

//   useEffect(() => {
//     if (!socket || !activeConversation?._id || !user?._id) return;
//     // if (!activeConversation?._id || !user?._id) return;

//     const conversationId = activeConversation._id;
//     console.log("from chat window", activeConversation.participants);
//     // Fetch previous messages
//     dispatch(fetchMessages(conversationId));

//     // Join conversation room
//     socket.emit("join-conversation", conversationId);
//     console.log(`✅ Joined conversation room: ${conversationId}`);

//     // Mark as read
//     socket.emit("mark-read", {
//       conversationId,
//       readerId: user._id,
//     });

//     dispatch(markMessagesAsRead({ conversationId, readerId: user._id }));

//     // Receive new messages
//     const handleReceiveMessage = (msg) => {
//       dispatch(addMessage({ conversationId: msg.conversation, message: msg }));
//     };

//     socket.on("receive-message", handleReceiveMessage);

//     return () => {
//       socket.off("receive-message", handleReceiveMessage);
//     };

//     const handleDeleted = ({ messageId, conversationId }) => {
//       dispatch(deleteMessage({ conversationId, messageId }));
//     };

//     socket.on("message-deleted", handleDeleted);

//     return () => {
//       socket.off("message-deleted", handleDeleted);
//     };
//   }, [socket, activeConversation?._id, user?._id, dispatch]);

//   // Scroll to bottom when messages change

//   const handleDelete = async(messageId)=>{
//     try {
//         await axios.delete(`http://localhost:3000/api/v1/messages/${messageId}`,
//           {
//             withCredentials:true
//           }
//         )

//     } catch (error) {
//         console.error("Error while deleting message: ",err);
//     }
//   }

//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (contextMenu.visible) {
//         setContextMenu({ ...contextMenu, visible: false });
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, [contextMenu]);
  

//   return (
//     <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-800">
//       {activeConversation ? (
//         <>
//           <div className="p-4 border-b dark:border-gray-700 text-gray-800 dark:text-white font-semibold">
//             Chat with:{" "}
//             {activeConversation.name ||
//               activeConversation.participants?.find((p) => p._id != user._id)
//                 .username ||
//               "unknown"}
//           </div>

//           {/* Message List */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-2">
//             {[...messages]
//               .slice() // ensure it’s a copy
//               .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//               .map((msg) => (
//                 <div
//                   key={msg._id || `${Date.now()}`}
//                   onContextMenu={(e) => {
//                     e.preventDefault();
//                     setContextMenu({
//                       visible: true,
//                       x: e.pageX,
//                       y: e.pageY,
//                       messageId: msg._id,
//                     });
//                   }}
//                   className={`max-w-xs px-4 py-2 rounded-lg ${
//                     msg.sender === user._id
//                       ? "ml-auto bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               ))}
//             {contextMenu.visible && (
//               <div
//                 className="absolute bg-white shadow-md border rounded p-2 z-50"
//                 style={{ top: contextMenu.y, left: contextMenu.x }}
//                 onClick={() =>
//                   setContextMenu({ ...contextMenu, visible: false })
//                 }
//               >
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-gray-100"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(contextMenu.messageId);
//                     setContextMenu({ ...contextMenu, visible: false });
//                   }}
//                 >
//                   Delete Message
//                 </button>
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-gray-400 cursor-not-allowed"
//                   disabled
//                 >
//                   Edit Message (Coming Soon)
//                 </button>
//               </div>
//             )}

//             <div ref={chatEndRef}></div>
//           </div>

//           {/* Message Input */}
//           <MessageInput
//             conversationId={activeConversation._id}
//             participants={activeConversation.participants.map((p) => p._id)}
//             currentUserId={user._id}
//           />
//         </>
//       ) : (
//         <div className="p-4 text-gray-500 dark:text-gray-400">
//           Select a conversation to start chatting.
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;


// src/components/chat/ChatWindow.jsx

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../../utils/socket.js";
// import MessageBubble from "./MessageBubble.jsx";

// import {
//   addMessage,
//   markMessagesAsRead,
//   fetchMessages,
//   deleteMessage as deleteMessageAction,
// } from "../../features/message/messageSlice.js";
// import MessageInput from "./MessageInput.jsx";
// import axios from "axios"; // ✅ Needed!

// const ChatWindow = ({ activeConversation }) => {
//   const socket = getSocket();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const [contextMenu, setContextMenu] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     messageId: null,
//   });

//   const messagesFromStore = useSelector(
//     (state) => state.messages.conversationMessages[activeConversation?._id]
//   );

//   const messages = messagesFromStore || [];
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     if (!socket || !activeConversation?._id || !user?._id) return;

//     const conversationId = activeConversation._id;

//     dispatch(fetchMessages(conversationId));

//     socket.emit("join-conversation", conversationId);

//     socket.emit("mark-read", {
//       conversationId,
//       readerId: user._id,
//     });

//     dispatch(markMessagesAsRead({ conversationId, readerId: user._id }));

//     const handleReceiveMessage = (msg) => {
//       dispatch(addMessage({ conversationId: msg.conversation, message: msg }));
//     };

//     socket.on("receive-message", handleReceiveMessage);

//     const handleDeleted = ({ messageId, conversationId }) => {
//       dispatch(deleteMessageAction({ conversationId, messageId }));
//     };

//     socket.on("message-deleted", handleDeleted);

//     return () => {
//       socket.off("receive-message", handleReceiveMessage);
//       socket.off("message-deleted", handleDeleted);
//     };
//   }, [socket, activeConversation?._id, user?._id, dispatch]);

//   const handleDelete = async (messageId) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/messages/single/${messageId}`, {
//         withCredentials: true,
//       });
//       // Note: Server should emit `message-deleted` to all relevant clients.
//       setContextMenu({ ...contextMenu, visible: false });
//     } catch (err) {
//       console.error("Error while deleting message:", err);
//     }
//   };

//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (contextMenu.visible) {
//         setContextMenu({ ...contextMenu, visible: false });
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, [contextMenu]);

//   return (
//     <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-black">
//       {activeConversation ? (
//         <>
//           <div className="p-4 border-b dark:border-gray-700 text-gray-800 dark:text-white font-semibold">
//             Chat with:{" "}
//             {activeConversation.name ||
//               activeConversation.participants?.find(
//                 (p) => p._id !== user._id
//               )?.username ||
//               "unknown"}
//           </div>

//           {/* Message List */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
//             {[...messages]
//               .slice()
//               .sort(
//                 (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//               )
//               .map((msg) => (
//                 <div
//                   key={msg._id}
//                   onContextMenu={ (e) => {
//                     e.preventDefault();
//                     setContextMenu({
//                       visible: true,
//                       x: e.clientX,
//                       y: e.clientY,
//                       messageId: msg._id,
//                     });
//                   }}
//                   className={`max-w-xs px-0 py-2 border-1 rounded-2xl ${
//                     msg.sender === user._id
//                       ? "ml-auto bg-black text-white "
//                       : "bg-black text-white"
//                   }`}
//                 >
//                   <div className="p-0 m-0 max-w-full">
//                   <MessageBubble message={msg} />
//                   </div>
//                   {/* {msg.content} */}
//                 </div>
//               ))}

//             {contextMenu.visible && (
//               <div
//                 className="fixed bg-white shadow-md border rounded p-2 z-50"
//                 style={{ top: contextMenu.y, left: contextMenu.x }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-gray-100"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(contextMenu.messageId);
//                   }}
//                 >
//                   Delete Message
//                 </button>
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-gray-400 cursor-not-allowed"
//                   disabled
//                 >
//                   Edit Message (Coming Soon)
//                 </button>
//               </div>
//             )}

//             <div ref={chatEndRef}></div>
//           </div>

//           {/* Message Input */}
//           <MessageInput
//             conversationId={activeConversation._id}
//             participants={activeConversation.participants.map((p) => p._id)}
//             currentUserId={user._id}
//           />
//         </>
//       ) : (
//         <div className="p-4 text-gray-500 dark:text-gray-400">
//           Select a conversation to start chatting.
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../../utils/socket.js";
// import MessageBubble from "./MessageBubble.jsx";

// import {
//   addMessage,
//   markMessagesAsRead,
//   fetchMessages,
//   deleteMessage as deleteMessageAction,
//   updateEditedMessage
// } from "../../features/message/messageSlice.js";
// import MessageInput from "./MessageInput.jsx";
// import axios from "axios";

// const ChatWindow = ({ activeConversation }) => {
//   const socket = getSocket();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const [contextMenu, setContextMenu] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     messageId: null,
//   });

//   const messages = useSelector(
//     (state) => state.messages.conversationMessages[activeConversation?._id] || []
//   );

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     if (!socket || !activeConversation?._id || !user?._id) return;

//     const conversationId = activeConversation._id;

//     console.log("[ChatWindow] Joining conversation:", conversationId);
//     socket.emit("join-conversation", conversationId);

//     dispatch(fetchMessages(conversationId));

//     socket.emit("mark-read", {
//       conversationId,
//       readerId: user._id,
//     });

//     dispatch(markMessagesAsRead({ conversationId, readerId: user._id }));

//     const handleDeleted = ({ messageId, conversationId }) => {
//       console.log("[ChatWindow] Message deleted event received:", messageId);
//       dispatch(deleteMessageAction({ conversationId, messageId }));
//     };

//     socket.on("message-deleted", handleDeleted);

//     socket.on("message-edited",({conversationId, messageId, newContent})=>{
//       dispatch(updateEditedMessage({conversationId,messageId,newContent}));
//     });

//     return () => {
//       socket.off("message-deleted", handleDeleted);
//     };
//   }, [socket, activeConversation?._id, user?._id, dispatch]);

//   const handleDelete = async (messageId) => {
//     try {
//       await axios.delete(
//         `http://localhost:3000/api/v1/messages/single/${messageId}`,
//         { withCredentials: true }
//       );

//       // Local optimistic removal
//       dispatch(deleteMessageAction({
//         conversationId: activeConversation._id,
//         messageId,
//       }));

//       setContextMenu({ ...contextMenu, visible: false });
//     } catch (err) {
//       console.error("Error while deleting message:", err);
//     }
//   };

//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (contextMenu.visible) {
//         setContextMenu({ ...contextMenu, visible: false });
//       }
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, [contextMenu]);

//   const otherUser = activeConversation?.participants?.find((p) => p._id !== user._id);
//   console.log(otherUser)
//   const onlineUsers = useSelector((state)=> state.onlineUsers.list);
//   const  isOnline= onlineUsers.includes(otherUser?._id);

//   return (
//     <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-black">
//       {activeConversation ? (
//         <>
//           <div className="p-4 border-b dark:border-gray-700 text-gray-800 dark:text-white font-semibold flex items-center gap-3">
//             {otherUser?.profilePicture && (
//               <img 
//                 src={otherUser.profilePicture}
//                 alt="Profile Picture"
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             )}
//             <span>{otherUser?.username || "unknown"}</span>
//             <span
//                 className={`text-s ${
//                   isOnline ? "text-green-500" : "text-gray-500"
//                 }`}
//               >
//                 {isOnline ? "Online" : "Offline"}
//               </span>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
//             {[...messages]
//               .slice()
//               .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//               .map((msg) => {
//                 const isOwnMessage = msg.sender === user._id || msg.sender?._id === user._id;

//                 return (
//                   <div
//                     key={msg._id}
//                     onContextMenu={
//                       isOwnMessage
//                         ? (e) => {
//                             e.preventDefault();
//                             setContextMenu({
//                               visible: true,
//                               x: e.clientX,
//                               y: e.clientY,
//                               messageId: msg._id,
//                             });
//                           }
//                         : undefined
//                     }
//                     className={`max-w-xs px-0 py-2 border-1 rounded-2xl ${
//                       isOwnMessage ? "ml-auto bg-black text-white" : "bg-black text-white"
//                     }`}
//                   >
//                     <div className="p-0 m-0 max-w-full">
//                       <MessageBubble message={msg} />
//                     </div>
//                   </div>
//                 );
//               })}

//             {contextMenu.visible && (
//               <div
//                 className="fixed bg-black text-white shadow-md border rounded p-2 z-50"
//                 style={{ top: contextMenu.y, left: contextMenu.x }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-white hover:text-black"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(contextMenu.messageId);
//                   }}
//                 >
//                   Delete Message
//                 </button>
//                 <button
//                   className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-gray-400 cursor-not-allowed"
//                   disabled
//                 >
//                   Edit Message 
//                 </button>
//               </div>
//             )}

//             <div ref={chatEndRef}></div>
//           </div>

//           <MessageInput
//             conversationId={activeConversation._id}
//             participants={activeConversation.participants.map((p) => p._id)}
//             currentUserId={user._id}
//           />
//         </>
//       ) : (
//         <div className="p-4 text-gray-500 dark:text-gray-400">
//           Select a conversation to start chatting.
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../utils/socket.js";
import MessageBubble from "./MessageBubble.jsx";
import {
  addMessage,
  markMessagesAsRead,
  fetchMessages,
  deleteMessage as deleteMessageAction,
  updateEditedMessage,
} from "../../features/message/messageSlice.js";
import MessageInput from "./MessageInput.jsx";
import axios from "axios";

const ChatWindow = ({ activeConversation }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [newContent, setNewContent] = useState("");

  const messages = useSelector(
    (state) =>
      state.messages.conversationMessages[activeConversation?._id] || []
  );

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !activeConversation?._id || !user?._id) return;

    const conversationId = activeConversation._id;
    dispatch(fetchMessages(conversationId));
    socket.emit("join-conversation", conversationId);

    socket.emit("mark-read", {
      conversationId,
      readerId: user._id,
    });
    dispatch(markMessagesAsRead({ conversationId, readerId: user._id }));

    const handleDeleted = ({ messageId, conversationId }) => {
      dispatch(deleteMessageAction({ conversationId, messageId }));
    };

    const handleEdited = ({ conversationId, messageId, newContent }) => {
      dispatch(updateEditedMessage({ conversationId, messageId, newContent }));
    };

    socket.on("message-deleted", handleDeleted);
    socket.on("message-edited", handleEdited);

    return () => {
      socket.off("message-deleted", handleDeleted);
      socket.off("message-edited", handleEdited);
    };
  }, [socket, activeConversation?._id, user?._id, dispatch]);

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/messages/single/${messageId}`,
        { withCredentials: true }
      );
      dispatch(
        deleteMessageAction({
          conversationId: activeConversation._id,
          messageId,
        })
      );
      setContextMenu({ ...contextMenu, visible: false });
    } catch (err) {
      console.error("Error while deleting message:", err);
    }
  };

  const handleEdit = async () => {
    if (!newContent.trim()) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/messages/single/${editingMessageId}`,
        { newContent },
        { withCredentials: true }
      );

      socket.emit("edit-message", {
        messageId: editingMessageId,
        newContent,
      });

      setEditingMessageId(null);
      setNewContent("");
      setContextMenu({ ...contextMenu, visible: false });
    } catch (err) {
      console.error("Error while editing message:", err);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const otherUser = activeConversation?.participants?.find(
    (p) => p._id !== user._id
  );

  const onlineUsers = useSelector((state) => state.onlineUsers.list);
  const isOnline = onlineUsers.includes(otherUser?._id);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-black">
      {activeConversation ? (
        <>
          <div className="p-4 border-b dark:border-gray-700 text-gray-800 dark:text-white font-semibold flex items-center gap-3">
            {otherUser?.profilePicture && (
              <img
                src={otherUser.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <span>{otherUser?.username || "unknown"}</span>
            <span
              className={`text-s ${isOnline ? "text-green-500" : "text-gray-500"}`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
            {[...messages]
              .slice()
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((msg) => {
                const isOwnMessage =
                  msg.sender === user._id || msg.sender?._id === user._id;
                const isEditing = editingMessageId === msg._id;

                return (
                  <div
                    key={msg._id}
                    onContextMenu={
                      isOwnMessage
                        ? (e) => {
                            e.preventDefault();
                            setContextMenu({
                              visible: true,
                              x: e.clientX,
                              y: e.clientY,
                              messageId: msg._id,
                            });
                          }
                        : undefined
                    }
                    className={`max-w-xs px-0 py-2 border-1 rounded-2xl ${
                      isOwnMessage
                        ? "ml-auto bg-black text-white"
                        : "bg-black text-white"
                    }`}
                  >
                    <div className="p-0 m-0 max-w-full">
                      {isEditing ? (
                        <div className="flex flex-col w-full">
                        <input
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          className="bg-black text-white px-5 py-2 rounded-xl outline-none w-full text-base font-semibold placeholder-gray-400"
                          placeholder="Edit your message..."
                          autoFocus
                        />
                        <div className="flex justify-center gap-4 mt-2">
                          <button
                            onClick={handleEdit}
                            className="bg-green-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-green-600 active:scale-95 transition duration-150"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingMessageId(null);
                              setNewContent("");
                            }}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-red-600 active:scale-95 transition duration-150"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      ) : (
                        <MessageBubble message={msg}  />
                      )}
                    </div>
                  </div>
                );
              })}

            {contextMenu.visible && (
              <div
                className="fixed bg-black text-white shadow-md border rounded p-2 z-50"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="block w-full text-left px-2 py-1 hover:bg-white hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(contextMenu.messageId);
                  }}
                >
                  Delete Message
                </button>
                <button
                  className="block w-full text-left px-2 py-1 hover:bg-white hover:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMessageId(contextMenu.messageId);
                    const msg = messages.find((m) => m._id === contextMenu.messageId);
                    setNewContent(msg?.content || "");
                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                >
                  Edit Message
                </button>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <MessageInput
            conversationId={activeConversation._id}
            participants={activeConversation.participants.map((p) => p._id)}
            currentUserId={user._id}
          />
        </>
      ) : (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
