// // components/chat/SearchBar.jsx
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { searchUsers } from "../../features/search/searchSlice.js";

// const SearchBar = ({ onUserSelect }) => {
//   const dispatch = useDispatch();
//   const [query, setQuery] = useState("");

//   const { searchResults = [], loading = false } = useSelector(
//     (state) => state.user || {}
//   );

//   console.log(searchResults);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (query.trim()) {
//         dispatch(searchUsers(query));
//       }
//     }, 300); // debounce to prevent excessive API calls

//     return () => clearTimeout(delayDebounce);
//   }, [query, dispatch]);

//   return (
//     <div className="p-2 border-b relative">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search users..."
//         className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
//       />

//       {loading && (
//         <p className="text-sm text-gray-500 mt-1">Searching...</p>
//       )}

//       {query.trim() && (
//         <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
//           {searchResults.length === 0 && !loading && (
//             <li className="p-2 text-gray-500 text-sm">No users found</li>
//           )}

//           {searchResults.map((user) => (
//             <li
//               key={user._id}
//               onClick={() => {
//                 onUserSelect(user);
//                 setQuery(""); // optional: clear search input
//               }}
//               className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
//             >
//               <img
//                 src={user.profilePicture || "./default-avatar.jpg"}
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full mr-3 object-cover"
//               />
//               <div className="flex flex-col">
//                 <span className="font-medium dark:text-white">{user.username}</span>
//                 <span className="text-xs text-gray-500">
//                   {user.isOnline ? "Online" : "Offline"}
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;


// components/chat/SearchBar.jsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { searchUsers } from "../../features/search/searchSlice.js";
// import { addOrUpdateConversation, createOrGetConversation } from "../../features/conversation/conversationSlice.js";

// const SearchBar = ({ onUserSelect }) => {
//   const dispatch = useDispatch();
//   const [query, setQuery] = useState("");

//   // ✅ Fix: select from the correct slice
//   const { users: searchResults = [], loading = false } = useSelector(
//     (state) => state.search || {}
//   );

//   console.log("Search Results:", searchResults);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (query.trim()) {
//         dispatch(searchUsers(query));
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [query, dispatch]);

//   return (
//     <div className="p-2 border-b relative">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search users..."
//         className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
//       />

//       {loading && (
//         <p className="text-sm text-gray-500 mt-1">Searching...</p>
//       )}

//       {query.trim() && (
//         <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
//           {searchResults.length === 0 && !loading && (
//             <li className="p-2 text-gray-500 text-sm">No users found</li>
//           )}

//           {searchResults.map((user) => (
//             <li
//               key={user._id}
//               onClick={() => {
//                 onUserSelect(user);
//                 setQuery("");
//                 createOrGetConversation(user?._id);
//               }}
//               className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
//             >
//               <img
//                 src={user.profilePicture || "./default-avatar.jpg"}
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full mr-3 object-cover"
//               />
//               <div className="flex flex-col">
//                 <span className="font-medium dark:text-white">{user.username}</span>
//                 <span className="text-xs text-gray-500">
//                   {user.isOnline ? "Online" : "Offline"}
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../features/search/searchSlice.js";
import { addOrUpdateConversation, createOrGetConversation } from "../../features/conversation/conversationSlice.js";

const SearchBar = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  // ✅ Fix: select from the correct slice
  const { users: searchResults = [], loading = false } = useSelector(
    (state) => state.search || {}
  );

  console.log("Search Results:", searchResults);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchUsers(query));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, dispatch]);

  const handleUserSelect = async (user) => {
    try {
      onUserSelect(user);
      setQuery("");
      // ✅ FIX: Dispatch the action instead of calling it directly
      console.log("sending user id for conversation")
      const conversation = await dispatch(createOrGetConversation(user?._id)).unwrap();
      await dispatch(addOrUpdateConversation(conversation));
      if(onUserSelect)
      {
        onUserSelect(conversation);
      }

      console.log("conversation created")
    } catch (error) {
      console.error("Error creating/getting conversation:", error);
    }
  };

  return (
    <div className="p-2 border-b relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
      />

      {loading && (
        <p className="text-sm text-gray-500 mt-1">Searching...</p>
      )}

      {query.trim() && (
        <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
          {searchResults.length === 0 && !loading && (
            <li className="p-2 text-gray-500 text-sm">No users found</li>
          )}

          {searchResults.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <img
                src={user.profilePicture || "./default-avatar.jpg"}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium dark:text-white">{user.username}</span>
                <span className="text-xs text-gray-500">
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;