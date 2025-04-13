import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { loginUser, logoutUser } from "./authApi";
import { updatePassword } from "./authThunks";
import { showInteractiveNotification } from "../interactive-notifications/interactiveNotificationsSlice";
import last_login_ago_video from '../../assets/videos/interactive-notification-videos/last_login_ago.mp4'

const token = localStorage.getItem("token");
const initialUser = token ? jwtDecode(token) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
    role: initialUser?.user.role || null,
  },
  reducers: {
    resetError:(state,action)=>{
      state.error=null  
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.user.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to login page
      })
      .addCase(updatePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.data };
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const { token, last_login_ago } = await loginUser({ email, password });
      localStorage.setItem("token", token);
      const user = jwtDecode(token);

      if(last_login_ago === "less than an hour ago"){
        thunkAPI.dispatch(showInteractiveNotification({
          show:true,
          videoSrc:last_login_ago_video,
          message:"Missed having you here! Hope all is well with you!"
        }))
      }
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await logoutUser();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const {resetError} = authSlice.actions
export default authSlice.reducer;
