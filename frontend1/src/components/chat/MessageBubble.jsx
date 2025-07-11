// // src/components/chat/MessageBubble.jsx
// import React from "react";
// import { useSelector } from "react-redux";

// const MessageBubble = ({ message }) => {
//   const { user } = useSelector((state) => state.auth);
//   const isSender = message.sender._id === user._id;

//   return (
//     <div className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
//       <div
//         // Added 'relative' to the bubble div for absolute positioning of timestamp
//         className={`max-w-[75%] px-4 py-2 text-sm break-words relative shadow-sm ${
//           isSender
//             ? "sender-bubble-chat pr-12" // Add padding-right to make space for absolute timestamp
//             : "receiver-bubble-chat pr-12" // Add padding-right for absolute timestamp
//         }`}
//       >
//         <div>{message.content}</div>
//         {/* Timestamp now uses absolute positioning */}
//         <div className="bubble-timestamp-chat">
//           {new Date(message.createdAt).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;

// src/components/chat/MessageBubble.jsx
import React from "react";
import { useSelector } from "react-redux";

const MessageBubble = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isSender = message.sender._id === user._id;

  return (
    // <div className={`flex mb-0.5 ${isSender ? "justify-end" : "justify-start"}`}>
    <div className={"w-full"}>
      <div
        className={`max-w-[95%] items-center my-0 pl-5 pr-0 py-0.5 rounded-xl text-l  relative `}
      >
        <div className="font-semibold">{message.content}</div>
        <div className=" text-xs text-right mt-1"> {/* Custom class for timestamp color */}
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

