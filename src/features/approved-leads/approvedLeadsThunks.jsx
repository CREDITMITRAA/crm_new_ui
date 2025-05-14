import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchApprovedLeads, updateApplicationStatusApi } from "./approvedLeadsApi";

export const getApprovedLeads = createAsyncThunk(
    "approvedLeads/getApprovedLeads",
    async (params, thunkAPI) => {
        try {
            const data = await fetchApprovedLeads(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch approved leads"
              );
        }
    }
)

export const updateApplicationStatus = createAsyncThunk(
  "approvedLeads/updateApplicationStatus",
  async (payload, thunkAPI) => {
    try {
      const data = await updateApplicationStatusApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update application status"
      );
    }
  }
);