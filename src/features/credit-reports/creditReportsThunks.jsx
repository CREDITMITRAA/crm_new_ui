import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteCreditReportApi,
  fetchCreditReportsByLeadId,
  uploadCreditReport,
} from "./creditReportsApi";

export const addCreditReport = createAsyncThunk(
  "creditReport/addCreditReport",
  async (payload, thunkAPI) => {
    try {
      const data = await uploadCreditReport(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add credit report"
      );
    }
  }
);

export const getCreditReportsByLeadId = createAsyncThunk(
  "creditReport/getCreditReportsByLeadId",
  async (leadId, thunkAPI) => {
    try {
      const data = await fetchCreditReportsByLeadId(leadId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch credit reports"
      );
    }
  }
);

export const deleteCreditReport = createAsyncThunk(
  "creditReport/deleteCreditReport",
  async (payload, thunkAPI) => {
    try {
      const data = await deleteCreditReportApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete credit report"
      );
    }
  }
);
