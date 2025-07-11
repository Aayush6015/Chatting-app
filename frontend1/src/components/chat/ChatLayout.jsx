// // src/components/chat/ChatLayout.jsx
// import React, { useEffect, useState } from "react";
// import Sidebar from "../sidebar/Sidebar";
// import ChatWindow from "./ChatWindow";
// import { connectSocket } from "../../utils/socket";
// import { useSelector, useDispatch } from "react-redux";
// import { addMessage } from "../../features/message/messageSlice";
// import { updateConversationPreview } from "../../features/conversation/conversationSlice";
// import {
//   setOnlineUsers,
//   addOnlineUser,
//   removeOnlineUser
// } from "../../features/onlineUsers/onlineUserSlice.js"; // ✅ Import online actions
// import { logoutUser } from "../../features/auth/authSlice.js";

// const ChatLayout = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [activeConversation, setActiveConversation] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) return;
  
//     try {
//       const parsed = JSON.parse(storedUser);
//       if (!parsed?.username || !parsed?._id) {
//         localStorage.removeItem("user");
//         dispatch(logoutUser());
//       }
//     } catch {
//       localStorage.removeItem("user");
//       dispatch(logoutUser());
//     }
//   }, []);

//   useEffect(() => {
//     if (user?.accessToken) {
//       const socket = connectSocket(user.accessToken);

//       socket.on("connect", () => {
//         console.log("✅ Connected to socket.io:", socket.id);
//         if (user?._id) {
//           socket.emit("join-user-room", user._id);
//           console.log(`✅ Joined personal room: ${user._id}`);
//         }
//       });

//       socket.on("online-users", (userIds) => {
//         dispatch(setOnlineUsers(userIds));
//       });

//       socket.on("user-online", (userId) => {
//         dispatch(addOnlineUser(userId));
//       });

//       socket.on("user-offline", (userId) => {
//         dispatch(removeOnlineUser(userId));
//       });

//       socket.on("receive-message", (message) => {
//         dispatch(addMessage({ conversationId: message.conversation, message }));
//         dispatch(updateConversationPreview(message));
//       });

//       socket.on("notify-message", ({ conversationId, message }) => {
//         dispatch(updateConversationPreview(message));
//       });

//       socket.on("messages-read", ({ conversationId, readerId }) => {
//         console.log("✅ Messages read:", conversationId, readerId);
//       });

//       return () => {
//         socket.off("receive-message");
//         socket.off("notify-message");
//         socket.off("messages-read");
//         socket.off("online-users");
//         socket.off("user-online");
//         socket.off("user-offline");
//         socket.disconnect();
//       };
//     }
//   }, [user, dispatch]);

//   const handleConversationSelect = (conversation) => {
//     setActiveConversation(conversation);
//   };

//   return (
//     <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
//       {/* Sidebar */}
//       <Sidebar onConversationSelect={handleConversationSelect} />

//       {/* Chat Window */}
//       <div className="flex-1">
//         {activeConversation ? (
//           <ChatWindow conversation={activeConversation} />
//         ) : (
//           <div className="flex justify-center items-center h-full text-gray-400">
//             Select a conversation to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;

// src/components/chat/ChatLayout.jsx

// import React, { useEffect, useState } from "react";
// import Sidebar from "../sidebar/Sidebar";
// import ChatWindow from "./ChatWindow";
// import { connectSocket } from "../../utils/socket";
// import { useSelector, useDispatch } from "react-redux";
// import { addMessage } from "../../features/message/messageSlice";
// import { updateConversationPreview } from "../../features/conversation/conversationSlice";
// import {
//   setOnlineUsers,
//   addOnlineUser,
//   removeOnlineUser
// } from "../../features/onlineUsers/onlineUserSlice.js";
// import { logoutUser } from "../../features/auth/authSlice.js";

// const ChatLayout = () => {
//   const dispatch = useDispatch();
//   const user  = useSelector((state) => state.auth.user);
//   const accessToken = user?.accessToken
//   console.log(accessToken)
//   const [activeConversation, setActiveConversation] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) return;

//     try {
//       const parsed = JSON.parse(storedUser);
//       if (!parsed?.username || !parsed?._id) {
//         localStorage.removeItem("user");
//         dispatch(logoutUser());
//       }
//     } catch {
//       localStorage.removeItem("user");
//       dispatch(logoutUser());
//     }
//   }, []);
  
//   console.log(user)
//   useEffect(() => {
//     if (accessToken) {
//       console.log(accessToken)
//       // console.log("connect socket - ",connectSocket(accessToken))
//       const socket = connectSocket(accessToken);
//       console.log(socket) 
//       // console.log(socket.id)/
//       // console.log("chat layout connected socket:",socket.id)

//       socket.on("connect", () => {
//         console.log("✅ Connected to socket.io:", socket.id);
//         if (user?._id) {
//           socket.emit("join-user-room", user._id);
//           console.log(`✅ Joined personal room: ${user._id}`);
//         }
//       });

//       socket.on("online-users", (userIds) => {
//         dispatch(setOnlineUsers(userIds));
//       });

//       socket.on("user-online", (userId) => {
//         dispatch(addOnlineUser(userId));
//       });

//       socket.on("user-offline", (userId) => {
//         dispatch(removeOnlineUser(userId));
//       });

//       socket.on("receive-message", (message) => {
//         dispatch(addMessage({ conversationId: message.conversation, message }));
//         dispatch(updateConversationPreview(message));
//       });

//       socket.on("notify-message", ({ conversationId, message }) => {
//         dispatch(updateConversationPreview(message));
//       });

//       socket.on("messages-read", ({ conversationId, readerId }) => {
//         console.log("✅ Messages read:", conversationId, readerId);
//       });
//       socket.on("disconnect", () => {
//         console.log("❌ [ChatLayout] Socket disconnected");
//       });

//       return () => {
//         socket.off("receive-message");
//         socket.off("notify-message");
//         socket.off("messages-read");
//         socket.off("online-users");
//         socket.off("user-online");
//         socket.off("user-offline");
//         socket.disconnect();
//       };
//     }
//   }, [user,accessToken, dispatch]);

//   const handleConversationSelect = (conversation) => {
//     setActiveConversation(conversation);
//   };

//   return (
//     <div className="h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
//       {/* Sidebar */}
//       <aside className="w-full sm:w-1/3 lg:w-1/4 h-full border-r dark:border-gray-800 shadow-md">
//         <Sidebar onConversationSelect={handleConversationSelect} />
//       </aside>

//       {/* Chat Window */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         {activeConversation ? (
//           <ChatWindow activeConversation={activeConversation} />
//         ) : (
//           <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400 text-lg">
//             Select a conversation to start chatting
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChatLayout;


// import React, { useEffect, useState } from "react";
// import Sidebar from "../sidebar/Sidebar";
// import ChatWindow from "./ChatWindow";
// import { connectSocket } from "../../utils/socket";
// import { useSelector, useDispatch } from "react-redux";
// import { addMessage,replaceTempMessage } from "../../features/message/messageSlice";
// import { updateConversationPreview } from "../../features/conversation/conversationSlice";
// import {
//   setOnlineUsers,
//   addOnlineUser,
//   removeOnlineUser
// } from "../../features/onlineUsers/onlineUserSlice.js";
// import { logoutUser } from "../../features/auth/authSlice.js";

// const ChatLayout = () => {
//   const dispatch = useDispatch();
//   const user  = useSelector((state) => state.auth.user);
//   const accessToken = user?.accessToken
//   console.log(accessToken)
//   const [activeConversation, setActiveConversation] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (!storedUser) return;

//     try {
//       const parsed = JSON.parse(storedUser);
//       if (!parsed?.username || !parsed?._id) {
//         localStorage.removeItem("user");
//         dispatch(logoutUser());
//       }
//     } catch {
//       localStorage.removeItem("user");
//       dispatch(logoutUser());
//     }
//   }, []);
  
//   console.log(user)
//   useEffect(() => {
//     if (accessToken) {
//       console.log(accessToken)
//       // console.log("connect socket - ",connectSocket(accessToken))
//       const socket = connectSocket(accessToken);
//       console.log(socket)

//       // console.log(socket.id)/
//       // console.log("chat layout connected socket:",socket.id)

//       socket.on("connect", () => {
//         console.log("✅ Connected to socket.io:", socket.id);
//         if (user?._id) {
//           socket.emit("join-user-room", user._id);
//           console.log(`✅ Joined personal room: ${user._id}`);
//         }
//       });

//       socket.on("online-users", (userIds) => {
//         dispatch(setOnlineUsers(userIds));
//       });

//       socket.on("user-online", (userId) => {
//         dispatch(addOnlineUser(userId));
//       });

//       socket.on("user-offline", (userId) => {
//         dispatch(removeOnlineUser(userId));
//       });

//       socket.on("receive-message", (message) => {
//         if (message.tempId) {
//           dispatch(({
//             conversationId: message.conversation,
//             tempId: message.tempId,
//             message: message,
//           }));
//         } else {
//           dispatch(addMessage({ conversationId: message.conversation, message }));
//         }
      
//         dispatch(updateConversationPreview(message));
//       });
      

//       socket.on("notify-message", ({ conversationId, message }) => {
//         dispatch(updateConversationPreview(message));
//       });

//       socket.on("messages-read", ({ conversationId, readerId }) => {
//         console.log("✅ Messages read:", conversationId, readerId);
//       });
//       socket.on("disconnect", () => {
//         console.log("❌ [ChatLayout] Socket disconnected");
//       });

//       return () => {
//         socket.off("receive-message");
//         socket.off("notify-message");
//         socket.off("messages-read");
//         socket.off("online-users");
//         socket.off("user-online");
//         socket.off("user-offline");
//         socket.disconnect();
//       };
//     }
//   }, [user,accessToken, dispatch]);

//   const handleConversationSelect = (conversation) => {
//     setActiveConversation(conversation);
//   };

//   return (
//     <div className="h-screen flex bg-black text-white">
//       {/* Sidebar - Left side */}
//       <aside className="w-full sm:w-1/3 lg:w-1/5 h-full border-r border-white shadow-md bg-black">
//         <Sidebar onConversationSelect={handleConversationSelect} />
//       </aside>

//       {/* Chat Window - Right side */}
//       <main className="flex-1 flex flex-col overflow-hidden ">
//         {activeConversation ? (
//           <ChatWindow activeConversation={activeConversation} />
//         ) : (
//           <div className="flex justify-center items-center h-full text-white text-lg">
//             Select a conversation to start chatting
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChatLayout;

import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatWindow from "./ChatWindow";
import { connectSocket } from "../../utils/socket";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  replaceTempMessage,
} from "../../features/message/messageSlice";
import { updateConversationPreview } from "../../features/conversation/conversationSlice";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
} from "../../features/onlineUsers/onlineUserSlice.js";
import { logoutUser } from "../../features/auth/authSlice.js";

const ChatLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const accessToken = user?.accessToken;
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed?.username || !parsed?._id) {
        localStorage.removeItem("user");
        dispatch(logoutUser());
      }
    } catch {
      localStorage.removeItem("user");
      dispatch(logoutUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) {
      const socket = connectSocket(accessToken);

      socket.on("connect", () => {
        console.log("✅ Connected to socket.io:", socket.id);
        if (user?._id) {
          socket.emit("join-user-room", user._id);
          console.log(`✅ Joined personal room: ${user._id}`);
        }
      });

      socket.on("online-users", (userIds) => {
        dispatch(setOnlineUsers(userIds));
      });

      socket.on("user-online", (userId) => {
        dispatch(addOnlineUser(userId));
      });

      socket.on("user-offline", (userId) => {
        dispatch(removeOnlineUser(userId));
      });

      socket.on("receive-message", (message) => {
        if (message.tempId) {
          dispatch(
            replaceTempMessage({
              conversationId: message.conversation,
              tempId: message.tempId,
              message: message,
            })
          );
        } else {
          dispatch(addMessage({ conversationId: message.conversation, message }));
        }

        dispatch(updateConversationPreview(message));
      });

      socket.on("notify-message", ({ conversationId, message }) => {
        dispatch(updateConversationPreview(message));
      });

      socket.on("messages-read", ({ conversationId, readerId }) => {
        console.log("✅ Messages read:", conversationId, readerId);
      });

      socket.on("disconnect", () => {
        console.log("❌ [ChatLayout] Socket disconnected");
      });

      return () => {
        socket.off("receive-message");
        socket.off("notify-message");
        socket.off("messages-read");
        socket.off("online-users");
        socket.off("user-online");
        socket.off("user-offline");
        socket.disconnect();
      };
    }
  }, [user, accessToken, dispatch]);

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="h-screen flex bg-black text-white">
      {/* Sidebar - Left side */}
      <aside className="w-full sm:w-1/3 lg:w-1/5 h-full border-r border-white shadow-md bg-black">
        <Sidebar onConversationSelect={handleConversationSelect} />
      </aside>

      {/* Chat Window - Right side */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeConversation ? (
          <ChatWindow activeConversation={activeConversation} />
        ) : (
          <div className="flex justify-center items-center h-full text-white text-lg">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatLayout;
