// messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';
import { saveToCache, loadFromCache } from '../../utils/cache';
import { getSocket } from '../../utils/socket';

const socket = getSocket();

const initialState = {
  messagesByConversation: {}, // { [conversationId]: { [page]: [messages] } }
  unreadCountByConversation: {}, // { [conversationId]: number }
  isLoading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async ({ conversationId, page = 1 }, thunkAPI) => {
    try {
      const cached = loadFromCache(`messages_${conversationId}_${page}`);
      if (cached) return { conversationId, page, messages: cached };

      const { data } = await axios.get(`/messages/${conversationId}?page=${page}`);
      saveToCache(`messages_${conversationId}_${page}`, data.messages);
      return { conversationId, page, messages: data.messages };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ conversationId, content, receiverId }, thunkAPI) => {
    try {

      const state = thunkAPI.getState();
      const userId = state.auth.user._id;

      const conversation = state.conversation.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Assume it's a 1-to-1 chat: find other participant
      const receiverId = conversation.participants.find(
        (id) => id !== userId
      );
      const { data } = await axios.post(`/messages/${conversationId}`, { content });

      // Emit to socket
      socket.emit('new-message', {
        ...data.message,
        conversationId,
        receiverId,
      });

      return { conversationId, message: data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Send failed');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'message/markAsRead',
  async ({ conversationId, readerId }, thunkAPI) => {
    try {
      await axios.patch(`/messages/mark-read/${conversationId}`);

      // Emit socket event to notify others
      socket.emit('mark-read', { conversationId, readerId });

      return { conversationId, readerId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Mark read failed');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'message/unreadCount',
  async (conversationId, thunkAPI) => {
    try {
      const { data } = await axios.get(` /messages/unread-count/${conversationId}`);
      return { conversationId, count: data.count };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Unread count fetch failed');
    }
  }
);



const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessages: state => {
      state.messagesByConversation = {};
    },
    receiveMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const pages = state.messagesByConversation[conversationId];
      if (!pages) return;

      const lastPage = Math.max(...Object.keys(pages).map(Number));
      state.messagesByConversation[conversationId][lastPage].push(message);
    },
    messagesRead: (state, action) => {
      const { conversationId, readerId } = action.payload;
      // Optionally update message status in state
    },
    updateSeenStatus: (state, action) => {
      const { conversationId, readerId } = action.payload;
      const pages = state.messagesByConversation[conversationId];

      if (!pages) return;

      Object.values(pages).forEach((messages) => {
        messages.forEach((msg) => {
          if (!msg.seenBy.includes(readerId)) {
            msg.seenBy.push(readerId);
          }
        });
      });
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMessages.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, page, messages } = action.payload;
        state.isLoading = false;

        if (!state.messagesByConversation[conversationId]) {
          state.messagesByConversation[conversationId] = {};
        }
        state.messagesByConversation[conversationId][page] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        const pages = state.messagesByConversation[conversationId];
        if (!pages) return;

        const lastPage = Math.max(...Object.keys(pages).map(Number));
        state.messagesByConversation[conversationId][lastPage].push(message);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        const { conversationId, count } = action.payload;
        state.unreadCountByConversation[conversationId] = count;
      });
  },
});

export const { clearMessages, receiveMessage, messagesRead, updateSeenStatus } = messageSlice.actions;
export default messageSlice.reducer;
