// src/features/onlineUsers/onlineUserSlice.js
import { createSlice } from "@reduxjs/toolkit";

const onlineUserSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    list: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.list = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.list.includes(action.payload)) {
        state.list.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.list = state.list.filter((id) => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;
