// features/notifications/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getNotificationsByEmployeeId } from "./notificationsThunk";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        ...action.payload,
        id: action.payload.notificationId || Date.now().toString(),
        isOpen: true,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationsByEmployeeId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNotificationsByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data.data;
      })
      .addCase(getNotificationsByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
