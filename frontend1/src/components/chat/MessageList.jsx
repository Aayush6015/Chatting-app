// src/components/chat/MessageList.jsx
import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageList;
