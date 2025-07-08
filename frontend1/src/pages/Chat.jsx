// src/pages/ChatPage.jsx
import React from "react";
import ChatLayout from "../components/chat/ChatLayout";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Chat = () => {
  
  const user = useSelector((state) => state.auth.user);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <ChatLayout />;
};

export default Chat;
