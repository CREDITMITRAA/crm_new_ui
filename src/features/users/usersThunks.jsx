import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersNameAndId } from "./usersApi";

export const getUsersNameAndId = createAsyncThunk(
    "users/getUsersNameAndId",
    async (_,thunkAPI) => {
        try {
            const data = await fetchUsersNameAndId()
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users name and id ");
        }
    }
)