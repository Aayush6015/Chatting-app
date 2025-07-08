// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { LogOut, Moon, Sun } from "lucide-react"; // optional: Lucide icons
// import { logoutUser } from "../../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const ProfileDropdown = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const toggleDropdown = () => setIsOpen((prev) => !prev);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     toast.success("Logged out");
//     navigate("/login");
//   };

//   const handleClickOutside = (e) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//       >
//         <img
//           src={user?.profilePicture || "/default-avatar.png"}
//           alt="avatar"
//           className="w-8 h-8 rounded-full object-cover"
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
//           <div className="p-4 border-b dark:border-gray-700">
//             <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.username}</p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
//           </div>

//           <div className="flex flex-col">
//             {/* Optional: Toggle dark mode */}
//             {/* <button
//               onClick={() => {}}
//               className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
//             >
//               <Moon className="w-4 h-4" />
//               Toggle Dark Mode
//             </button> */}

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 text-sm text-red-600 dark:text-red-100"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileDropdown;


import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Moon, Sun, User, Settings, Circle } from "lucide-react"; // optional: Lucide icons
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-3 w-full rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
      >
        {/* Avatar Container */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Online Status Indicator */}
          <Circle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-green-500 fill-current bg-white dark:bg-gray-800 rounded-full" />
        </div>

        {/* User Info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {user?.username || 'User'}
          </p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Active now
            </p>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 backdrop-blur-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Optional: Profile Settings */}
            <button className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 transform hover:scale-[1.02] group">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-200">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">Profile Settings</span>
            </button>

            {/* Optional: Toggle dark mode */}
            {/* <button
              onClick={() => {}}
              className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 transform hover:scale-[1.02] group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center group-hover:from-yellow-100 group-hover:to-orange-100 dark:group-hover:from-yellow-900/30 dark:group-hover:to-orange-900/30 transition-all duration-200">
                <Moon className="w-4 h-4" />
              </div>
              <span className="font-medium">Toggle Dark Mode</span>
            </button> */}

            {/* Divider */}
            <div className="my-2 mx-4 border-t border-gray-100 dark:border-gray-700"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 text-sm text-red-600 dark:text-red-400 transition-all duration-200 transform hover:scale-[1.02] group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200 dark:group-hover:from-red-800/40 dark:group-hover:to-pink-800/40 transition-all duration-200">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;