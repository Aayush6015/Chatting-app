import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import conversationReducer from "../features/conversation/conversationSlice";
import messageReducer from "../features/message/messageSlice";
import onlineReducer from "../features/online/onlineSlice";
import searchReducer from "../features/search/searchSlice.js"
import presenceReducer from "../features/auth/presenceSlice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    online:onlineReducer,
    search:searchReducer,
    presence:presenceReducer,
  },
});
