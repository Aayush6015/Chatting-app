import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../features/message/messageSlice";
import { getSocket } from "../../utils/socket"; // ✅ Import getSocket

const MessageInput = ({ conversationId, participants, currentUserId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSend = (e) => {
    e.preventDefault();

    const socket = getSocket();
    if (!socket || !socket.connected) { // Improved check for socket connection
      console.error("Socket not connected. Cannot send message.");
      // Optionally show a toast error to the user
      toast.error("Connection error. Please try again.");
      return;
    }
    if (!message.trim()) return;

    const tempId = Date.now().toString();

    const receiverId = participants.find((p) => p !== user._id);
    const messageData = {
      content: message.trim(),
      conversationId,
      sender: currentUserId,
      receiverId,
      tempId,
    };

    // Emit the message via socket
    socket.emit("send-message", messageData);

    // Optimistic update for UI
    dispatch(
      addMessage({
        conversationId,
        message: { ...messageData, _id:tempId, createdAt: new Date().toISOString() }, // Add createdAt for timestamp
      })
    );

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className=" max-h-[15%] flex items-center gap-3 p-4 bg-[#1F1F2B] border-t border-gray-700 shadow-lg" // Dark background for input area
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-3 rounded-xl message-input-bg focus:outline-none focus:ring-2 border-white border-2" // Custom class for input background
      />
      <button
        type="submit"
        className="px-6 py-3 focus:ring-2 border-white border-2 hover:bg-white hover:text-black rounded-xl text-white font-semibold message-send-button" // Custom class for send button gradient
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
// // src/components/chat/MessageInput.jsx
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addMessage } from "../../features/message/messageSlice";
// import { getSocket } from "../../utils/socket"; // ✅ Import getSocket

// const MessageInput = ({ conversationId, participants, currentUserId }) => {
//   // console.log(conversationId," ",participants," ",currentUserId) // it is working
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const handleSend = (e) => {
//     e.preventDefault();

//     // console.log("get socket - ",getSocket());
//     const socket = getSocket(); // ✅ Correct use
//     console.log("Socket in message input:", socket.connected);
//     if (!socket) {
//       console.log("Socket null");
//       return;
//     }
//     if (!message.trim()) return;
//     console.log(socket);
//     const receiverId = participants.find((p) => p !== user._id);
//     console.log(receiverId);
//     const messageData = {
//       content: message.trim(),
//       conversationId,
//       sender: currentUserId,
//       receiverId,
//     };

//     // Emit the message via socket
//     console.log(messageData)
//     const d = socket.emit("send-message", messageData);
//     console.log(d);

//     // Optionally dispatch to update UI immediately (optimistic update)
//     dispatch(
//       addMessage({
//         conversationId,
//         message: { ...messageData, _id: Date.now().toString() },
//       })
//     );

//     setMessage("");
//   };

//   return (
//     <form
//       onSubmit={handleSend}
//       className="flex items-center gap-2 p-2 border-t dark:border-gray-700"
//     >
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         className="flex-1 p-2 rounded border dark:bg-gray-800 dark:text-white"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </form>
//   );
// };

// export default MessageInput;

// src/components/chat/MessageInput.jsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addMessage } from "../../features/message/messageSlice"; // thunk that posts message

// const MessageInput = ({ conversationId }) => {
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     try {
//       await dispatch(addMessage({
//         conversationId,
//         message: {
//           content: message.trim()
//         }
//       }));
//       setMessage("");
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   return (
//     <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t dark:border-gray-700">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         className="flex-1 p-2 rounded border dark:bg-gray-800 dark:text-white"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </form>
//   );
// };

// export default MessageInput; // date - 27 6 2025 8 am

// // src/components/chat/MessageInput.jsx
// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addMessage } from "../../features/message/messageSlice";
// import { getSocket } from "../../utils/socket";

// const MessageInput = ({ conversationId, participants, currentUserId }) => {
//   const [message, setMessage] = useState("");
//   const dispatch = useDispatch();

//   const handleSend = (e) => {
//     e.preventDefault();
//     const socket = getSocket();

//     if (!message.trim() || !socket) return;

//     // ✅ Identify receiverId (anyone other than current user)
//     const receiverId = participants.find((p) => p !== currentUserId);

//     const messageData = {
//       content: message.trim(),
//       conversationId,
//       sender: currentUserId,
//       receiverId,
//     };

//     // ✅ Emit message to server
//     socket.emit("send-message", messageData);

//     // ✅ Optimistically update UI
//     dispatch(addMessage({
//       conversationId,
//       message: { ...messageData, _id: Date.now().toString() },
//     }));

//     setMessage("");
//   };

//   return (
//     <form onSubmit={handleSend} className="flex items-center gap-2 p-2 border-t dark:border-gray-700">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         className="flex-1 p-2 rounded border dark:bg-gray-800 dark:text-white"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Send
//       </button>
//     </form>
//   );
// };

// export default MessageInput;
