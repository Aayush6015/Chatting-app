// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../utils/axiosInstance.js";
import axios from "axios";

export const searchUsers = createAsyncThunk(
  "search/users",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/users/search?username=${query}`, {
        withCredentials: true,
      });
      console.log("this is from search slice",res.data.users)
      return res.data.users;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
