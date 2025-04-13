import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllLeads } from "../leads/leadsApi";
import { scheduleWalkInApi } from "../walk-ins/walkInsApi";

export const getVerificationLeads = createAsyncThunk(
    "verification/getVerificationLeads",
    async (params,thunkAPI) => {
        try {
            const data = await fetchAllLeads(params);
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch verification leads");
        }
    }
)

export const scheduleWalkIn = createAsyncThunk(
    "verification/scheduleWalkIn",
    async (payload, thunkAPI) => {
        try {
            const data = await scheduleWalkInApi(payload);
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to schedule walk-in or call");
        }
    }
)