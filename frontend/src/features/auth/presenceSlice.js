// presenceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const presenceSlice = createSlice({
  name: 'presence',
  initialState: {
    onlineUsers: [], // Array of userIds
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    userCameOnline: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userWentOffline: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, userCameOnline, userWentOffline } = presenceSlice.actions;
export default presenceSlice.reducer;
