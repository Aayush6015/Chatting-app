// import React from "react";
// import { useSelector } from "react-redux";
// import { Circle } from "lucide-react";

// const OnlineUsersIndicator = () => {
//   const { onlineUsers } = useSelector((state) => state.online); // assuming online users are in redux state

//   if (!onlineUsers || onlineUsers.length === 0) {
//     return (
//       <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
//         No users online
//       </div>
//     );
//   }

//   return (
//     <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
//       <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
//         Online Users
//       </h3>
//       <ul className="space-y-2 max-h-48 overflow-y-auto">
//         {onlineUsers.map((user) => (
//           <li key={user._id} className="flex items-center gap-2 text-sm">
//             <Circle size={10} className="text-green-500 fill-green-500" />
//             <span className="text-gray-800 dark:text-gray-200">{user.name}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default OnlineUsersIndicator;

import React from "react";
import { useSelector } from "react-redux";
import { Circle, Users } from "lucide-react";

const OnlineUsersIndicator = () => {
  const { onlineUsers } = useSelector((state) => state.online); // assuming online users are in redux state

  if (!onlineUsers || onlineUsers.length === 0) {
    return (
      <div className="p-4 bg-gradient-to-br from-gray-50/30 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">No users online</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Circle className="w-3 h-3 text-white fill-current" />
          </div>
          <span>Online Users</span>
        </h3>
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-2 py-1 rounded-full">
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">
            {onlineUsers.length}
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {onlineUsers.map((user, index) => (
          <div 
            key={user._id} 
            className="flex items-center space-x-3 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group cursor-pointer"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-xs">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse">
                <Circle className="w-1.5 h-1.5 text-green-500 fill-current absolute top-0.5 left-0.5" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                {user.name}
              </span>
              <div className="flex items-center space-x-1 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Active now
                </span>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Circle className="w-3 h-3 text-blue-500 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {onlineUsers.length > 5 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {Math.min(onlineUsers.length, 5)} of {onlineUsers.length} users
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineUsersIndicator;