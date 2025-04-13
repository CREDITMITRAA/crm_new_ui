import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotificationsByEmployeeId } from "./notificationsApi";

export const getNotificationsByEmployeeId = createAsyncThunk(
  "notifications/getNotificationsByEmployeeId",
  async (params, thunkAPI) => {
    try {
      const data = await fetchNotificationsByEmployeeId(params)
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch notifications for the employee"
      );
    }
  }
);
