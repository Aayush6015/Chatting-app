
import { useState, useEffect, useRef} from "react";
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
  const wrapper = useRef(null);


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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapper.current && !wrapper.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  

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
    <div className="relative" ref={wrapper}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={()=>{
          if(query.trim() ) setShowDropdown(true);
        }}
        placeholder="Search "
        className="w-full py-2 px-4 m-1 rounded-xl border bg-black text-white "
      />

      {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}

      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow">
          {searchResults.length === 0 && !loading && (
            <li className="p-2 text-white text-sm">No users found</li>
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
