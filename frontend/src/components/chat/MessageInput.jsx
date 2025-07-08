import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendHorizonal } from "lucide-react";
import { sendMessage } from "../../features/message/messageSlice";
import { getSocket } from "../../utils/socket";

const MessageInput = ({ activeConversation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState("");
  const socket = getSocket();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    await dispatch(
      sendMessage({
        conversationId: activeConversation._id,
        content: newMessage,
        // receiverId:
      })
    );

    // socket.emit("sendMessage", {
    //   conversationId: activeConversation._id,
    // });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-3 border-t bg-gray-50 dark:bg-gray-800">
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-lg px-3 py-2 mr-2 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
      >
        <SendHorizonal size={24} />
      </button>
    </div>
  );
};

export default MessageInput;
