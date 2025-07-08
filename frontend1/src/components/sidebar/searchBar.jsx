// // src/components/sidebar/SearchBar.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import debounce from "lodash.debounce";

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Fetch users based on searchTerm
//   const fetchSuggestions = async (query) => {
//     if (!query.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     try {
//       const { data } = await axios.get(`http://localhost:3000/api/v1/users/search?query=${query}`, {
//         withCredentials: true,
//       });

//       setSuggestions(data.users || []);
//       setShowDropdown(true);
//     } catch (err) {
//       console.error("Search failed:", err.message);
//       setSuggestions([]);
//     }
//   };

//   // Debounce API calls
//   const debouncedSearch = debounce((value) => fetchSuggestions(value), 300);

//   useEffect(() => {
//     debouncedSearch(searchTerm);
//     return () => debouncedSearch.cancel();
//   }, [searchTerm]);

//   const handleSelect = (user) => {
//     onSearch && onSearch(user); // send selected user to parent
//     setSearchTerm(""); // clear input
//     setShowDropdown(false);
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={searchTerm}
//         placeholder="Search users..."
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full px-3 py-2 border rounded"
//       />

//       {showDropdown && suggestions.length > 0 && (
//         <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
//           {suggestions.map((user) => (
//             <li
//               key={user._id}
//               onClick={() => handleSelect(user)}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {user.username || user.email}
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
import {
  addOrUpdateConversation,
  createOrGetConversation,
} from "../../features/conversation/conversationSlice.js";

const SearchBar = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);


  const { users: searchResults = [], loading = false } = useSelector(
    (state) => { 
        // console.log(state);
      return state.search || {}}
  );

  const onlineUsers = useSelector((state) => state.onlineUsers.list);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     if (query.trim()) {
  //       dispatch(searchUsers(query));
  //     }
  //   }, 300);

  //   return () => clearTimeout(delayDebounce);
  // }, [query, dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        setShowDropdown(true); // ✅ show dropdown when user types
        dispatch(searchUsers(query));
      } else {
        setShowDropdown(false); // ✅ hide when input is cleared
      }
    }, 300);
  
    return () => clearTimeout(delayDebounce);
  }, [query, dispatch]);
  

  const handleUserSelect = async (user) => {
    try {
      setShowDropdown(false);
      setQuery("");
      const conversation = await dispatch(
        createOrGetConversation(user?._id)
      ).unwrap();
      await dispatch(addOrUpdateConversation(conversation));
      if (onUserSelect) {
        onUserSelect(conversation);
      }
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

      {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}

      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
          {searchResults.length === 0 && !loading && (
            <li className="p-2 text-gray-500 text-sm">No users found</li>
          )}

          {searchResults.map((user) => {
            const isOnline = onlineUsers.includes(user._id);

            return (
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
                  <span className="font-medium dark:text-white">
                    {user.username}
                  </span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
