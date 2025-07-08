// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../utils/axiosInstance";
// import {
//   saveToCache,
//   loadFromCache,
//   clearAllCache,
// } from "../../utils/cache.js";

// // Create or get existing conversation
// export const createOrGetConversation = createAsyncThunk(
//   "conversation/createOrGet",
//   async (targetUserId, thunkAPI) => {
//     try {
//       const {data} = await axios.get(
//         " /conversations/${ targetUserId }",
        
//       );
//       // Invalidate cache
//       clearAllCache("conversations");
//       return data.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || "Error");
//     }
//   }
// );

// // Get all conversations (with cache)
// export const fetchAllConversations = createAsyncThunk(
//   "conversation/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const cached = loadFromCache("conversations");
//       if (cached) return cached;

//       const response = await axios.get(" /conversations/all-conversations");
//       saveToCache("conversations", response.data.conversations);
//       return response.data.conversations;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Error");
//     }
//   }
// );

// // Delete conversation
// export const deleteConversation = createAsyncThunk(
//   "conversation/delete",
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       await axios.delete(" /conversations/delete-conversation", {
//         data: { conversationId },
//       });
//       clearAllCache("conversations");
//       return conversationId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Error");
//     }
//   }
// );
// const conversationSlice = createSlice({
//   name: "conversation",
//   initialState: {
//     conversations: [],
//     activeConversation: null,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversation = action.payload;
//     },
//     clearConversationCache: (state) => {
//       state.conversations = [];
//       clearAllCache("conversations");
//     },
//     // ✅ Handle new or updated conversation
//     addOrUpdateConversation: (state, action) => {
//       const updatedConv = action.payload;
//       const index = state.conversations.findIndex(c => c._id === updatedConv._id);
//       if (index !== -1) {
//         state.conversations[index] = updatedConv;
//       } else {
//         state.conversations.push(updatedConv);
//       }
//     },
//     // ✅ Handle deletion
//     removeConversation: (state, action) => {
//       const conversationId = action.payload;
//       state.conversations = state.conversations.filter(c => c._id !== conversationId);
//       if (state.activeConversation?._id === conversationId) {
//         state.activeConversation = null;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createOrGetConversation.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(createOrGetConversation.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.activeConversation = action.payload;
//       })
//       .addCase(createOrGetConversation.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchAllConversations.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllConversations.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.conversations = action.payload;
//       })
//       .addCase(fetchAllConversations.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteConversation.fulfilled, (state, action) => {
//         state.conversations = state.conversations.filter(
//           (conv) => conv._id !== action.payload
//         );
//       });
//   },
// });

// export const {
//   setActiveConversation,
//   clearConversationCache,
//   addOrUpdateConversation,
//   removeConversation,
// } = conversationSlice.actions;

// export default conversationSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";
import { saveToCache, loadFromCache, clearAllCache } from "../../utils/cache.js";

// ✅ Create or get existing conversation
export const createOrGetConversation = createAsyncThunk(
  "conversation/createOrGet",
  async (targetUserId, thunkAPI) => {
    try {
      console.log("this is from converstaion slice",targetUserId)
      const { data } = await axios.get(`/conversations/${targetUserId}`);
      console.log(data);
      clearAllCache("conversations");
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

// ✅ Get all conversations (with cache)
export const fetchAllConversations = createAsyncThunk(
  "conversation/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const cached = loadFromCache("conversations");
      if (cached) return cached;

      const response = await axios.get("/conversations/all-conversations");
      saveToCache("conversations", response.data.conversations);
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

// ✅ Delete conversation
export const deleteConversation = createAsyncThunk(
  "conversation/delete",
  async (conversationId, { rejectWithValue }) => {
    try {
      await axios.delete("/conversations/delete-conversation", {
        data: { conversationId },
      });
      clearAllCache("conversations");
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error");
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    activeConversation: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    clearConversationCache: (state) => {
      state.conversations = [];
      clearAllCache("conversations");
    },
    addOrUpdateConversation: (state, action) => {
      const updatedConv = action.payload;
      const index = state.conversations.findIndex(
        (c) => c._id === updatedConv._id
      );
      if (index !== -1) {
        state.conversations[index] = updatedConv;
      } else {
        state.conversations.push(updatedConv);
      }
    },
    removeConversation: (state, action) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(
        (c) => c._id !== conversationId
      );
      if (state.activeConversation?._id === conversationId) {
        state.activeConversation = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrGetConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrGetConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const conv = action.payload;

        // ✅ Add conversation to list if it's new
        const exists = state.conversations.find((c) => c._id === conv._id);
        if (!exists) {
          state.conversations.push(conv);
        }

        // ✅ Set as active
        state.activeConversation = conv;
      })
      .addCase(createOrGetConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const conversationId = action.payload;
        state.conversations = state.conversations.filter(
          (conv) => conv._id !== conversationId
        );
        if (state.activeConversation?._id === conversationId) {
          state.activeConversation = null;
        }
      });
  },
});

export const {
  setActiveConversation,
  clearConversationCache,
  addOrUpdateConversation,
  removeConversation,
  
} = conversationSlice.actions;

export default conversationSlice.reducer;
