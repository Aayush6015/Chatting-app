import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchConversations = createAsyncThunk("conversations/fetch", async ({page=1,limit=50}={}, thunkAPI) => {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/v1/conversations/all-conversations?page=${page}&limit=${limit}`, { withCredentials: true });
    console.log(data.data)
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


// export const updateConversationPreview = createAsyncThunk(
//   "conversations/updatePreview",
//   async ({ conversationId, lastMessageContent, senderId }, thunkAPI) => {
//     try {
//       const { data } = await axios.patch(
//         `http://localhost:3000/api/v1/conversations/${conversationId}/preview`,
//         { lastMessageContent, senderId },
//         { withCredentials: true }
//       );
//       return data.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to update preview"
//       );
//     }
//   }
// );

export const createOrGetConversation = createAsyncThunk(
  "conversations/createOrGet",
  async (targetUserId, thunkAPI) => {
    try {
      const state = thunkAPI.getState()
      const token = state.auth?.user?.accessToken;
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/conversations/get-create-conversation/${targetUserId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create/get conversation"
      );
    }
  }
);




const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    list: [],
    totalPages:0,
    currentPage:1,
    loading: false,
    error: null,
  },
  reducers: {
    addOrUpdateConversation: (state, action) => {
      const newConv = action.payload;
      const index = state.list.findIndex(c => c._id === newConv._id);
      if (index > -1) {
        state.list[index] = newConv; // update existing
      } else {
        state.list.unshift(newConv); // add new at beginning
      }
    },
    updateConversationPreview: (state, action) => {
      const { conversation: conversationId, content, sender, timestamp } = action.payload;
      const conversation = state.list.find(c => c._id === conversationId);
      if (conversation) {
        conversation.lastMessage = { content, sender, timestamp };
        conversation.updatedAt = timestamp || new Date();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.conversations;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addOrUpdateConversation, updateConversationPreview} = conversationSlice.actions;
export default conversationSlice.reducer;