import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const userFromLocal = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user:  null,
  // user: userFromLocal || null,
  loading: false,
  error: null,
};


// Register User with optional profile picture
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ formData, idToken }, thunkAPI) => {
    try {
      console.log("this is form data - ",formData,"and id token - ", idToken)
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register/google",
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);


// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/v1/users/login", credentials, {
        withCredentials: true,
      });
      // localStorage.setItem("user", JSON.stringify(data.data));
      console.log(data)
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/logout", {}, { withCredentials: true });
      // localStorage.removeItem("user");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);



export const sendResetLink = createAsyncThunk(
  "auth/sendResetLink",
  async ({ email }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/forgot-password", { email }, {
        withCredentials: true
      });
      console.log(res)
      return res.data.message;
    } catch (err) {
      console.log("here - send reset link error")
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send reset link");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, password }, thunkAPI) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/users/reset-password/${resetToken}`, // ✅ token in URL
        { password },
        { withCredentials: true }
      );
      return res.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, profilePicture, currentPassword }, thunkAPI) => {
    try {
      // Verify current password (required for security)
      await axios.post(
        "http://localhost:3000/api/v1/users/update-password",
        {
          oldPassword: currentPassword,
          newPassword: currentPassword, // dummy update
        },
        { withCredentials: true }
      );

      // Update username if provided
      if (username) {
        await axios.post(
          "http://localhost:3000/api/v1/users/update-username",
          { username },
          { withCredentials: true }
        );
      }

      // Update profile picture if provided
      if (profilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        await axios.post(
          "http://localhost:3000/api/v1/users/update-profile-picture",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // Fetch updated user data
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/users/user-profile",
        {},
        { withCredentials: true }
      );

      return data.data; // updated user object

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log(action.payload)
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload.data.user,
          accessToken:action.payload.data.accessToken // storing accesstoken
        }
        localStorage.setItem("user", JSON.stringify({...action.payload.data.user, accessToken:action.payload.data.accessToken}))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload.data.user,
          accessToken:action.payload.data.accessToken // storing accesstoken
        }
        localStorage.setItem("user", JSON.stringify({...action.payload.data.user, accessToken:action.payload.data.accessToken}))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
