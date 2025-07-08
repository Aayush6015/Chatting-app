// // components/chat/ConversationListItem.jsx

// import React, { useState } from "react";
// import { useSwipeable } from "react-swipeable";
// import { formatDistanceToNow } from "date-fns";
// import clsx from "clsx";


// const ConversationListItem = ({
//   conversation,
//   isSelected,
//   onClick,
//   onDelete,
//   currentUserId,
// }) => {
//   const [showDelete, setShowDelete] = useState(false);

//   const handlers = useSwipeable({
//     onSwipedLeft: () => setShowDelete(true),
//     onSwipedRight: () => setShowDelete(false),
//     delta: 50, // minimum swipe distance
//     trackMouse: true, // enable desktop
//   });

//   const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);
//   const lastMsg = conversation.lastMessage;
//   const unreadCount = conversation.unreadCount;

//   return (
//     <div {...handlers} className="relative">
//       {/* Delete Button */}
//       {showDelete && (
//         <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
//           <button
//             onClick={() => onDelete(conversation._id)}
//             className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow"
//           >
//             Delete
//           </button>
//         </div>
//       )}

//       {/* Chat item */}
//       <div
//         onClick={onClick}
//         className={clsx(
//           "flex items-center px-4 py-3 cursor-pointer transition-all",
//           isSelected ? "bg-gray-300 dark:bg-gray-800" : "hover:bg-gray-200 dark:hover:bg-gray-700",
//           showDelete ? "translate-x-[-80px] transition-transform duration-200" : ""
//         )}
//       >
//         {/* Profile */}
//         <img
//           src={otherParticipant?.profilePicture || "/default-avatar.png"}
//           alt="avatar"
//           className="w-10 h-10 rounded-full object-cover mr-3"
//         />

//         <div className="flex-1">
//           <div className="flex justify-between items-center">
//             <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
//               {otherParticipant?.username}
//             </h4>
//             {lastMsg?.createdAt && (
//               <span className="text-xs text-gray-500">
//                 {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })}
//               </span>
//             )}
//           </div>
//           <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
//             {lastMsg
//               ? `${lastMsg.sender._id === currentUserId ? "You: " : ""}${lastMsg.content}`
//               : "Start a conversation"}
//           </p>
//         </div>

//         {unreadCount > 0 && (
//           <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
//             {unreadCount}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConversationListItem;


import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { Trash2, User } from "lucide-react";

const ConversationListItem = ({
  conversation,
  isSelected,
  onClick,
  onDelete,
  currentUserId,
}) => {
  const [showDelete, setShowDelete] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowDelete(true),
    onSwipedRight: () => setShowDelete(false),
    delta: 50, // minimum swipe distance
    trackMouse: true, // enable desktop
  });

  const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);
  const lastMsg = conversation.lastMessage;
  const unreadCount = conversation.unreadCount;

  return (
    <div {...handlers} className="relative group">
      {/* Delete Button */}
      {showDelete && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
          <button
            onClick={() => onDelete(conversation._id)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      )}

      {/* Chat item */}
      <div
        onClick={onClick}
        className={clsx(
          "flex items-center px-4 py-4 cursor-pointer transition-all duration-200 rounded-xl mx-2 my-1",
          isSelected 
            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 shadow-sm" 
            : "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm",
          showDelete ? "translate-x-[-80px] transition-transform duration-200" : ""
        )}
      >
        {/* Profile Picture */}
        <div className="relative mr-3">
          {otherParticipant?.profilePicture ? (
            <img
              src={otherParticipant.profilePicture}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          {/* Online indicator (optional - you can add online status logic) */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {otherParticipant?.username || "Unknown User"}
            </h4>
            {lastMsg?.createdAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 pr-2">
              {lastMsg
                ? `${lastMsg.sender._id === currentUserId ? "You: " : ""}${lastMsg.content}`
                : (
                  <span className="italic text-gray-500 dark:text-gray-500">
                    Start a conversation
                  </span>
                )}
            </p>
            
            {unreadCount > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full px-2 py-1 font-medium min-w-[20px] text-center flex-shrink-0">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;