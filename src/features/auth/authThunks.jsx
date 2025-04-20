import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatedPasswordApi, updateProfileImageUrlApi } from "./authApi";

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

export const updateProfileImageUrl = createAsyncThunk(
    "auth/updateProfileImageUrl",
    async ({userId, payload}, thunkAPI) => {
        try {
            const data = await updateProfileImageUrlApi(userId,payload)
            return data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to update profile image url");
        }
    }
)