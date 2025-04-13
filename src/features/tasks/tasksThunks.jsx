import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTasks, updateTaskStatusApi } from "./tasksApi";

export const getTasks = createAsyncThunk(
    "tasks/getTasks",
    async (params, thunkAPI) => {
        try {
            const data = await fetchAllTasks(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch tasks");
        }   
    }
)

export const updateTaskStatus = createAsyncThunk(
    "tasks/updateTaskStatus",
    async (payload,thunkAPI) => {
        try {
            const data = await updateTaskStatusApi(payload)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to update task");
        }
    }
)