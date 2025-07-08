import { searchUsers } from "../../utils/userService.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// features/user/userSlice.js
const initialState = {
  user: null,
  searchResults: [],
  loading: false,
  error: null,
};

export const searchUsersThunk = createAsyncThunk(
  "users/search",
  async (query, thunkAPI) => {
    try {
      const res = await searchUsers(query);
      console.log("this is from user slice",res)
      return res; // should be array of users
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Search error"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.searchResults = []; // optional: clear old results
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload; // ✅ this must be array of users
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default userSlice.reducer;