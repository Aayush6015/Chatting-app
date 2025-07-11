// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchMessages = createAsyncThunk("messages/fetch", async (conversationId, thunkAPI) => {
//   try {
//     const { data } = await axios.get(`http://localhost:3000/api/v1/messages/${conversationId}`, { withCredentials: true });
//     console.log(data.data)
//     return { conversationId, messages: data.data.messages };
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data.message);
//   }
// }); 

// const messageSlice = createSlice({
//   name: "messages",
//   initialState: {
//     conversationMessages: {}, // { conversationId: [msg, msg, ...] }
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     addMessage: (state, action) => {
//       const { conversationId, message } = action.payload;
//       if (!state.conversationMessages[conversationId]) {
//         state.conversationMessages[conversationId] = [];
//       }
//       state.conversationMessages[conversationId].push(message);
//     },
//     markMessagesAsRead: (state, action) => {
//       const { conversationId, readerId } = action.payload;
//       const messages = state.conversationMessages[conversationId];
//       if (messages) {
//         messages.forEach(msg => {
//           if (!msg.readBy?.includes(readerId)) {
//             msg.readBy = [...(msg.readBy || []), readerId];
//           }
//         });
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMessages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.conversationMessages[action.payload.conversationId] = action.payload.messages;
//       })
//       .addCase(fetchMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { addMessage, markMessagesAsRead } = messageSlice.actions;
// export default messageSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (conversationId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/messages/${conversationId}`,
        { withCredentials: true }
      );
      console.log(data.data);
      return { conversationId, messages: data.data.messages };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    conversationMessages: {}, // { conversationId: [msg, msg, ...] }
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.conversationMessages[conversationId]) {
        state.conversationMessages[conversationId] = [];
      }
    
      const exists = state.conversationMessages[conversationId].some(
        (m) => m._id === message._id
      );
    
      if (!exists) {
        state.conversationMessages[conversationId].push(message);
      }
    },
    
    markMessagesAsRead: (state, action) => {
      const { conversationId, readerId } = action.payload;
      const messages = state.conversationMessages[conversationId];
      if (messages) {
        messages.forEach((msg) => {
          if (!msg.readBy?.includes(readerId)) {
            msg.readBy = [...(msg.readBy || []), readerId];
          }
        });
      }
    },
    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      if (!state.conversationMessages[conversationId]) return;
    
      state.conversationMessages[conversationId] = state.conversationMessages[conversationId].filter(
        (msg) => msg._id !== messageId
      );
    },
    replaceTempMessage: (state, action) => {
      const { conversationId, tempId, message } = action.payload;
    
      const messages = state.conversationMessages[conversationId];
      if (!messages) return;
    
      const index = messages.findIndex((m) => m._id === tempId);
    
      if (index !== -1) {
        messages[index] = message; // Replace temp with real
      } else {
        messages.push(message); // If temp not found, just add
      }
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;

        const { conversationId, messages } = action.payload;
        const existing = state.conversationMessages[conversationId] || [];

        // Combine existing + new
        const combined = [...existing, ...messages];

        // Deduplicate by _id using a map
        const unique = Object.values(
          combined.reduce((acc, msg) => {
            acc[msg._id] = msg;
            return acc;
          }, {})
        );

        // Sort by createdAt ascending (oldest first)
        unique.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        state.conversationMessages[conversationId] = unique;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, markMessagesAsRead, deleteMessage, replaceTempMessage } = messageSlice.actions;
export default messageSlice.reducer;
