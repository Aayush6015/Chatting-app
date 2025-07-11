// // src/components/sidebar/Sidebar.jsx
// import React from "react";
// import SearchBar from "./searchBar.jsx";
// import ConversationList from "./ConversationList";
// import SettingsButton from "./SettingsButton";
// import LogoutButton from "../auth/LogoutButton";

// const Sidebar = ({ onConversationSelect }) => {
//   return (
//     <div className="w-full sm:w-1/3 lg:w-1/4 h-full flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700">
//       {/* Search */}
//       <div className="p-4 border-b dark:border-gray-700">
//         <SearchBar onUserSelect={onConversationSelect} />
//       </div>

//       {/* Conversation List */}
//       <div className="flex-1 overflow-y-auto">
//         <ConversationList onConversationClick={onConversationSelect} />
//       </div>

//       {/* Footer buttons */}
//       <div className="p-3 border-t dark:border-gray-700 flex flex-col gap-2">
//         <SettingsButton />
//         <LogoutButton />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// src/components/sidebar/Sidebar.jsx
import React from "react";
import SearchBar from "./searchBar.jsx";
import ConversationList from "./ConversationList";
import SettingsButton from "./SettingsButton";
import LogoutButton from "../auth/LogoutButton";

const Sidebar = ({ onConversationSelect }) => {
  return (
    <div className="w-full h-full flex flex-col bg-black border-r border-white">
      {/* Search */}
      <div className="p-4 border-b-4 border-white">
        <SearchBar onUserSelect={onConversationSelect} />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        <ConversationList onConversationClick={onConversationSelect} />
      </div>

      {/* Footer buttons */}
      <div className="p-3 border-t border-white flex flex-col gap-2">
        <SettingsButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;