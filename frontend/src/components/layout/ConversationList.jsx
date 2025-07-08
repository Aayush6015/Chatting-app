// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { createOrGetConversation } from "../../features/conversation/conversationSlice";
// import { fetchUnreadCount } from "../../features/message/messageSlice";
// import ConversationListItem from "./ConversationListItem";
// import axios from "axios";
// import Loader from "../common/Loader.jsx"
// import { toast } from "react-hot-toast";

// const ConversationList = ({ activeConversation, setActiveConversation }) => {
//   const dispatch = useDispatch();
//   const { conversations, isLoading } = useSelector((state) => state.conversations);
//   const { unreadCountByConversation } = useSelector((state) => state.messages);
//   const { user } = useSelector((state) => state.auth); // Assuming this is your logged-in user

//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     dispatch(createOrGetConversation());
//   }, [dispatch]);

//   useEffect(() => {
//     if (conversations.length > 0) {
//       conversations.forEach((conv) => dispatch(fetchUnreadCount(conv._id)));
//     }
//   }, [conversations, dispatch]);

//   const filteredConversations = conversations.filter((conv) =>
//     conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     conv.participants?.some(p =>
//       p.username.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const handleDelete = async (conversationId) => {
//     try {
//       await axios.delete("/api/v1/conversations", {
//         data: { conversationId },
//       });
//       toast.success("Conversation deleted");
//       dispatch(createOrGetConversation());
//     } catch (error) {
//       toast.error("Failed to delete conversation");
//     }
//   };

//   return (
    
//     <div className="flex flex-col gap-2">
//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search chats..."
//         className="w-full p-2 mb-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white border dark:border-gray-600 focus:outline-none"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {/* Conversation List */}
//       {isLoading ? (
//         <Loader /> 
//       ) : filteredConversations.length === 0 ? (
//         <div className="text-center text-sm text-gray-500 dark:text-gray-400">No chats found.</div>
//       ) : (
//         filteredConversations.map((conversation) => (
//           <ConversationListItem
//             key={conversation._id}
//             conversation={conversation}
//             currentUserId={user._id}
//             isSelected={activeConversation?._id === conversation._id}
//             onClick={() => setActiveConversation(conversation)}
//             onDelete={handleDelete}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default ConversationList;


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrGetConversation } from "../../features/conversation/conversationSlice";
import { fetchUnreadCount } from "../../features/message/messageSlice";
import ConversationListItem from "./ConversationListItem";
import axios from "axios";
import Loader from "../common/Loader.jsx"
import { toast } from "react-hot-toast";
import { Search, MessageCircle } from "lucide-react";

const ConversationList = ({ activeConversation, setActiveConversation }) => {
  const dispatch = useDispatch();
  const { conversations, isLoading } = useSelector((state) => state.conversations);
  const { unreadCountByConversation } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth); // Assuming this is your logged-in user

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(createOrGetConversation());
  }, [dispatch]);

  useEffect(() => {
    if (conversations.length > 0) {
      conversations.forEach((conv) => dispatch(fetchUnreadCount(conv._id)));
    }
  }, [conversations, dispatch]);

  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants?.some(p =>
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (conversationId) => {
    try {
      await axios.delete("/api/v1/conversations", {
        data: { conversationId },
      });
      toast.success("Conversation deleted");
      dispatch(createOrGetConversation());
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Conversation List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No chats found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {searchTerm ? 
                "Try adjusting your search terms to find conversations." : 
                "Start a new conversation to begin chatting."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation._id}
                conversation={conversation}
                currentUserId={user._id}
                isSelected={activeConversation?._id === conversation._id}
                onClick={() => setActiveConversation(conversation)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;