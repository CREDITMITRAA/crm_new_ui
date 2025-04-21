import { createAsyncThunk } from "@reduxjs/toolkit";
import { addActivityLogNoteApi, fetchAllActivityLogs } from "./activityLogsApi";

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

export const addActivityLogNote = createAsyncThunk(
    "activityLogs/addActivityLogNote",
    async (payload, thunkAPI) => {
        try {
            const data = await addActivityLogNoteApi(payload)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to add activity log note !");
        }
    }
)