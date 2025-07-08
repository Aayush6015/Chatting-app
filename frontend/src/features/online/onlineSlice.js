import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: {
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      const exists = state.onlineUsers.find((user) => user._id === action.payload._id);
      if (!exists) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (user) => user._id !== action.payload._id
      );
    },
    resetOnlineUsers: (state) => {
      state.onlineUsers = [];
    },
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  resetOnlineUsers,
} = onlineSlice.actions;

export default onlineSlice.reducer;
