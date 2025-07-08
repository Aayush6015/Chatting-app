import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../utils/axios";
import axios from "../../utils/axiosInstance.js"
import { saveToCache, loadFromCache, clearCache } from "../../utils/cache.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Load cached values
const cachedUser = loadFromCache("user");
const cachedToken = loadFromCache("accessToken");

const initialState = {
  user: cachedUser || null,
  accessToken: cachedToken || null,
  loading: false,
  error: null,
};

// Login with email/username and password
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/users/login", credentials);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
// Google Sign-In via Firebase
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, thunkAPI) => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const { data } = await axios.post("/users/google-signin", {
        idToken,
      });

      return data; // { user, accessToken }
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Google Sign-In failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      console.log("Sending request to /users/register/google", userData);

      // 1. Get the Firebase ID token from the currently signed-in user
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No authenticated Firebase user");
      }

      const idToken = await currentUser.getIdToken();

      // 2. Send the token in the Authorization header
      const { data } = await axios.post("/users/register/google", userData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      return data; // expected: { user, accessToken }
    } catch (err) {
      console.error("Registration error:", err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  }
);

export const sendResetLink = createAsyncThunk(
  "auth/sendResetLink",
  async ({ email }, thunkAPI) => {
    try {
      const { data } = await axios.post("/users/forgot-password", { email });
      console.log(data)
      return data;
    } catch (err) {
      console.log("here - send reset link error")
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send reset link");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const { data } = await axios.post(`/users/reset-password/${token}`, { password });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      clearCache("user");
      clearCache("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.loading = false;
        saveToCache("user", user);
        saveToCache("accessToken", accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.loading = false;
        saveToCache( user);
        saveToCache( accessToken);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google Sign-In failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.loading = false;
        saveToCache("user", user);
        saveToCache("accessToken", accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
