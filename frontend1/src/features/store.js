import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js"
import conversationReducer from "./conversation/conversationSlice.js"
import messageReducer from "./message/messageSlice.js"
import onlineuserReducer from "./onlineUsers/onlineUserSlice.js"
import searchReducer from "./search/searchSlice.js"


const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    onlineUsers:onlineuserReducer,
    search:searchReducer,
  },
});

export default store;