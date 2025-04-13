import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatedPasswordApi } from "./authApi";

export const updatePassword = createAsyncThunk(
    "auth/updatedPassword",
    async(params,thunkAPI) => {
        try {
            const data = await updatedPasswordApi(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to update password");
        }
    }
)