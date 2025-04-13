import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllActivityLogs } from "./activityLogsApi";

export const getAllActivityLogs = createAsyncThunk(
    "activityLogs/getAllActivityLogs",
    async (params, thunkAPI) => {
        try {
            const data = await fetchAllActivityLogs(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch activity logs");
        }
    }
)