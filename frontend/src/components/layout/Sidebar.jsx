// import React, { useState } from "react";
// import { Home, MessageSquare, Users, Menu, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import ProfileDropdown from "./ProfileDropdown";
// import OnlineUserIndicator from "../chat/OnlineUsersIndicator.jsx"; // ✅ Import the component

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(true);

//   const navItems = [
//     { label: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
//     { label: "Chats", icon: <MessageSquare className="w-5 h-5" />, path: "/chats" },
//     { label: "Users", icon: <Users className="w-5 h-5" />, path: "/users" },
//   ];

//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   return (
//     <div className="flex">
//       {/* Toggle Button */}
//       <button
//         className="md:hidden p-2 text-gray-700 dark:text-white"
//         onClick={toggleSidebar}
//       >
//         {isOpen ? <X /> : <Menu />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`${
//           isOpen ? "w-64" : "w-0"
//         } transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900 border-r dark:border-gray-700 h-screen hidden md:flex flex-col justify-between`}
//       >
//         {/* Navigation */}
//         <div className="p-4">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">ChatApp</h2>
//           <nav className="flex flex-col gap-4">
//             {navItems.map((item) => (
//               <button
//                 key={item.label}
//                 onClick={() => navigate(item.path)}
//                 className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* ✅ Show Online Users */}
//           <div className="mt-6">
//             <OnlineUserIndicator />
//           </div>
//         </div>

//         {/* Profile Dropdown */}
//         <div className="p-4 border-t dark:border-gray-700">
//           <ProfileDropdown />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { Home, MessageSquare, Users, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import OnlineUserIndicator from "../chat/OnlineUsersIndicator.jsx"; // ✅ Import the component

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, path: "/" },
    { label: "Chats", icon: <MessageSquare className="w-5 h-5" />, path: "/chats" },
    { label: "Users", icon: <Users className="w-5 h-5" />, path: "/users" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen hidden md:flex flex-col justify-between shadow-sm`}
      >
        {/* Navigation */}
        <div className="p-6">
          {/* App Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ChatApp
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2"></div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* ✅ Show Online Users */}
          <div className="mt-8 p-4 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <OnlineUserIndicator />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-800/30">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;