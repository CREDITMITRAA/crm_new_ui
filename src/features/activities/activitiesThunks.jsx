import { createAsyncThunk } from "@reduxjs/toolkit";
import { addActivityApi, fetchRecentActivityLeadId } from "./activitiesApi";

export const addActivity = createAsyncThunk(
  "activities/addActivity",
  async (payload, thunkAPI) => {
    try {
      const data = await addActivityApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add activity"
      );
    }
  }
);

export const getRecentActivity = createAsyncThunk(
  "activities/getRecentActivity",
  async (params, thunkAPI) => {
    try {
      const data = await fetchRecentActivityLeadId(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch recent activity"
      );
    }
  }
);
