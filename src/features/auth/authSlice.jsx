import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { loginUser, logoutUser } from "./authApi";
import { updatePassword, updateProfileImageUrl } from "./authThunks";
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
    profile_image_url: initialUser?.user.profile_image_url || null,
    last_login_ago: null,
  },
  reducers: {
    resetError:(state,action)=>{
      state.error=null  
    },
    initializeUser:(state,action)=>{
      state.loading = true
      state.user = action.payload.user;
      state.role = action.payload.user?.user?.role;
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('payload = ', action.payload);
        state.user = action.payload.user;
        state.role = action.payload.user?.user?.role;
        state.profile_image_url = action.payload.user.profile_image_url
        state.last_login_ago = action.payload.last_login_ago
        state.loading = false;
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
      .addCase(updateProfileImageUrl.pending, (state,action)=>{
        state.loading=true
      })
      .addCase(updateProfileImageUrl.fulfilled, (state, action) => {
        console.log('response from thunk = ', action.payload.data);
      
        state.loading = false;
        state.profile_image_url = action.payload.data
      })               
      .addCase(updateProfileImageUrl.rejected, (state, action)=>{
        state.loading=false
        state.error=action.payload
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

      // if(last_login_ago === "less than an hour ago"){
      //   thunkAPI.dispatch(showInteractiveNotification({
      //     show:true,
      //     videoSrc:last_login_ago_video,
      //     message:"Missed having you here! Hope all is well with you!"
      //   }))
      // }
      return {user, last_login_ago};
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

export const {resetError, initializeUser} = authSlice.actions
export default authSlice.reducer;
