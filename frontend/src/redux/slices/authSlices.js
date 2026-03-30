import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios/axiosInstance.js"; 

// --- Async Thunks ---

// ✅ CORRECT: Call the new check-auth endpoint
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Calls GET /api/auth/check-auth (which checks the cookie)
      const res = await axiosInstance.get("/auth/check-auth");
      return res.data; 
    } catch (error) {
      return rejectWithValue("Session expired");
    }
  }
);

export const userSignup = createAsyncThunk(
  "auth/signup",
  async ({ fullName, email, phone, password, role, avatarUrl }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        fullName,
        email,
        phone,
        password,
        role,
        avatarUrl
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup Failed");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      // No local storage needed; cookie is set automatically
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Verification Failed");
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      // No local storage needed; cookie is set automatically
      return res.data;
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        return rejectWithValue({
          msg: error.response.data.message,
          requiresVerification: true,
          email: error.response.data.email 
        });
      }
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/update-profile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/profile", profileData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout"); 
      return true; 
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

// --- Slice ---

const initialState = {
  user: null, 
  loading: false,       // login/signup/etc. actions
  authChecking: true,   // initial session check only
  error: null,
  requiresVerification: false,
  tempEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.requiresVerification = false;
    },
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth (On Load) — uses authChecking, not loading
      .addCase(checkAuth.pending, (state) => {
        state.authChecking = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authChecking = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authChecking = false;
        state.user = null;
      })

      // Signup
      .addCase(userSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.tempEmail = action.payload.email;
        state.requiresVerification = true; 
        state.error = null;
      })
      .addCase(userSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.requiresVerification = false;
        state.tempEmail = null;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.requiresVerification = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.tempEmail = action.payload.email;
          state.error = action.payload.msg;
        } else {
          state.error = action.payload;
        }
      })

      // Logout
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.user = null; 
        state.error = action.payload;
      })
  },
});

export const { clearError, setTempEmail, setUser } = authSlice.actions;
export default authSlice.reducer;