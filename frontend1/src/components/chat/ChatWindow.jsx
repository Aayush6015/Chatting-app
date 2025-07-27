
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
              className={`text-s ${
                isOnline ? "text-green-500" : "text-gray-500"
              }`}
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

                // Define max width conditionally
                const isLong = msg.content && msg.content.length > 100; // Adjust threshold as you like
                const maxWidthClass = isLong ? "max-w-[90%]" : "max-w-xs";

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
                    className={`${maxWidthClass} px-0 py-2 border-1 rounded-2xl ${
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
                        <MessageBubble message={msg} />
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
                    const msg = messages.find(
                      (m) => m._id === contextMenu.messageId
                    );
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
