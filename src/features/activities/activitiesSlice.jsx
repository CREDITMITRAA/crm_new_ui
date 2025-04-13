import { createSlice } from "@reduxjs/toolkit";
import { addActivity, getRecentActivity } from "./activitiesThunks";

const initialState = {
  activities: [],
  recentActivity: {},
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activities",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addActivity.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addActivity.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRecentActivity.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload.data.data;
      })
      .addCase(getRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default activitySlice.reducer;
