// import React from "react";
// import { useSelector } from "react-redux";
// import { formatDistanceToNow } from "date-fns";

// const MessageItem = ({ message, isLast, isOwn }) => {
//   const { user } = useSelector((state) => state.auth);

//   const messageClass = isOwn
//     ? "bg-blue-500 text-white self-end rounded-br-none"
//     : "bg-gray-200 text-black self-start rounded-bl-none";

//   return (
//     <div className="flex flex-col max-w-[75%] mb-2">
//       <div className={`px-4 py-2 rounded-xl ${messageClass}`}>
//         <div className="text-sm whitespace-pre-line">{message.content}</div>
//       </div>
//       <div className="text-[10px] text-gray-500 mt-1 px-1 self-end">
//         {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
//         {isOwn && isLast && (
//           <span className="ml-2">{message.seen ? "Seen" : "Delivered"}</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageItem;

import React from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

const MessageItem = ({ message, isLast, isOwn }) => {
  const { user } = useSelector((state) => state.auth);

  const messageClass = isOwn
    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white self-end rounded-br-none shadow-lg"
    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white self-start rounded-bl-none shadow-md border border-gray-100 dark:border-gray-700";

  const containerClass = isOwn ? "items-end" : "items-start";

  return (
    <div className={`flex flex-col max-w-[75%] mb-4 ${containerClass} transition-all duration-200 hover:scale-[1.02] transform`}>
      {/* Message Bubble */}
      <div className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${messageClass} relative group`}>
        {/* Message Content */}
        <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
          {message.content}
        </div>
        
        {/* Message Tail */}
        <div 
          className={`absolute bottom-0 w-4 h-4 ${
            isOwn 
              ? "right-0 bg-gradient-to-r from-blue-500 to-purple-500" 
              : "left-0 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700"
          }`}
          style={{
            clipPath: isOwn 
              ? "polygon(0 0, 100% 0, 0 100%)" 
              : "polygon(100% 0, 0 0, 100% 100%)"
          }}
        />
      </div>

      {/* Message Info */}
      <div className={`flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-2 px-2 ${isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Timestamp */}
        <span className="bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
        
        {/* Message Status for Own Messages */}
        {isOwn && isLast && (
          <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
            {message.seen ? (
              <>
                <CheckCheck className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500 font-medium">Seen</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">Delivered</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
};

export default MessageItem;