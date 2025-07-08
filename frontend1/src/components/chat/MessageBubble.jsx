// src/components/chat/MessageBubble.jsx
import React from "react";
import { useSelector } from "react-redux";

const MessageBubble = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isSender = message.sender._id === user._id;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isSender
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-white"
        }`}
      >
        <div>{message.content}</div>
        <div className="text-xs text-right mt-1 opacity-60">
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
