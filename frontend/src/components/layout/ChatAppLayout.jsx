import React, { useEffect, useState } from "react";
import ChatWindow from "../chat/ChatWindow";
import ConversationList from "./ConversationList";
import Sidebar from "./Sidebar";
import Loader from "../common/Loader";
import SearchBar from "../chat/SearchBar";

const ChatLayout = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true); // Show loader initially

  useEffect(() => {
    // Simulate loading or fetch conversations here
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - responsive */}
      <div className="w-full md:w-1/4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <Sidebar>
          <h2 className="text-xl font-bold mb-4 px-4 pt-4 text-gray-800 dark:text-white">
            Chats
          </h2>
          <ConversationList
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
        </Sidebar>
      </div>
<SearchBar onUserSelect={(conversation) => setActiveConversation(conversation)} />
      


      {/* Main Chat Area */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-gray-900/80">
            <Loader />
          </div>
        ) : activeConversation ? (
          <ChatWindow activeConversation={activeConversation} />
        ) : (
          <div className="h-full flex items-center justify-center px-4 text-center text-gray-600 dark:text-gray-300">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;


// import React, { useState } from "react";
// import ChatWindow from "../chat/ChatWindow";
// import ConversationList from "./ConversationList";
// import Sidebar from "./Sidebar";
// import Loader from "../common/Loader";
// import { MessageCircle, Users, Settings, Search, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const ChatLayout = () => {
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
//       {/* Enhanced Sidebar */}
//       <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col">
//         {/* Sidebar Header */}
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                 <MessageCircle className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Messages
//               </h1>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50"
//             >
//               <Settings className="w-5 h-5" />
//             </Button>
//           </div>

//           {/* Search Bar */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10"
//             />
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="flex-1 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               New Chat
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className="flex-1 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
//             >
//               <Users className="w-4 h-4 mr-2" />
//               New Group
//             </Button>
//           </div>
//         </div>

//         {/* Conversation List Container */}
//         <div className="flex-1 overflow-hidden">
//           <Sidebar>
//             <div className="px-6 py-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//                   Recent Chats
//                 </h2>
//                 <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
//                   12 active
//                 </span>
//               </div>
//             </div>
//             <ConversationList
//               activeConversation={activeConversation}
//               setActiveConversation={setActiveConversation}
//               searchQuery={searchQuery}
//             />
//           </Sidebar>
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col relative bg-white dark:bg-gray-900">
//         {/* Loading Overlay */}
//         {loading && (
//           <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
//               <Loader />
//               <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
//                 Loading conversation...
//               </p>
//             </div>
//           </div>
//         )}

//         {activeConversation ? (
//           <ChatWindow activeConversation={activeConversation} />
//         ) : (
//           /* Enhanced Empty State */
//           <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900/30 dark:via-gray-800 dark:to-gray-900/30">
//             <div className="text-center max-w-md mx-auto px-6">
//               {/* Animated Icon */}
//               <div className="relative mb-8">
//                 <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//                   <MessageCircle className="w-16 h-16 text-blue-500 dark:text-blue-400" />
//                 </div>
//                 <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce delay-500">
//                   <Plus className="w-4 h-4 text-white" />
//                 </div>
//               </div>

//               {/* Welcome Text */}
//               <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
//                 Welcome to Your Messages
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
//                 Select a conversation from the sidebar to start chatting, or create a new conversation to connect with friends.
//               </p>

//               {/* Call-to-Action Buttons */}
//               <div className="space-y-3">
//                 <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105">
//                   <Plus className="w-5 h-5 mr-2" />
//                   Start New Conversation
//                 </Button>
                
//                 <div className="flex space-x-3">
//                   <Button
//                     variant="outline"
//                     className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg"
//                   >
//                     <MessageCircle className="w-4 h-4 mr-2" />
//                     Browse Chats
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg"
//                   >
//                     <Users className="w-4 h-4 mr-2" />
//                     Create Group
//                   </Button>
//                 </div>
//               </div>

//               {/* Feature Highlights */}
//               <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div className="space-y-2">
//                     <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
//                       <MessageCircle className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Real-time messaging
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
//                       <Users className="w-5 h-5 text-green-500" />
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Group conversations
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
//                       <Search className="w-5 h-5 text-purple-500" />
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Search & find
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;

// import React, { useState } from "react";
// import ChatWindow from "../chat/ChatWindow";
// import ConversationList from "./ConversationList";
// import Sidebar from "./Sidebar";
// import Loader from "../common/Loader";
// import { MessageCircle, Users } from "lucide-react";

// const ChatLayout = () => {
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [loading, setLoading] = useState(false); // Optional loader toggle

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       {/* Sidebar */}
//       <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
//         <Sidebar>
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
//                 <MessageCircle className="w-5 h-5 text-white" />
//               </div>
//               <h2 className="text-xl font-bold text-gray-800 dark:text-white">
//                 Chats
//               </h2>
//             </div>
//           </div>
          
//           <div className="flex-1 overflow-hidden">
//             <ConversationList
//               activeConversation={activeConversation}
//               setActiveConversation={setActiveConversation}
//             />
//           </div>
//         </Sidebar>
//       </div>

//       {/* Main Chat Window */}
//       <div className="flex-1 relative bg-white dark:bg-gray-800 rounded-l-2xl shadow-xl border border-gray-200 dark:border-gray-700 ml-1">
//         {loading && (
//           <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-l-2xl">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
//               <Loader />
//             </div>
//           </div>
//         )}

//         {activeConversation ? (
//           <div className="h-full rounded-l-2xl overflow-hidden">
//             <ChatWindow activeConversation={activeConversation} />
//           </div>
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 rounded-l-2xl">
//             <div className="text-center space-y-6 max-w-md px-8">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
//                 <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
//               </div>
              
//               <div className="space-y-3">
//                 <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//                   Welcome to Chat
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
//                   Select a conversation from the sidebar to start chatting with your contacts.
//                 </p>
//               </div>
              
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
//                 <p className="text-sm text-blue-700 dark:text-blue-300">
//                   💡 Tip: Click on any conversation to begin messaging
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;