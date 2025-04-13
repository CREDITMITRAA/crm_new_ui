import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteLoanReportApi, fetchLoanReportsByLeadId, uploadLoanReport } from "./loanReportsApi";

export const addLoanReport = createAsyncThunk(
  "loanReport/addLoanReport",
  async (payload, thunkAPI) => {
    try {
      const data = await uploadLoanReport(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add loan report"
      );
    }
  }
);

export const getLoanReportsByLeadId = createAsyncThunk(
  "loanReport/getLoanReportsByLeadId",
  async (leadId, thunkAPI) => {
    try {
      const data = await fetchLoanReportsByLeadId(leadId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch loan reports"
      );
    }
  }
);

export const deleteLoanReport = createAsyncThunk(
  "loanReport/deleteLoanReport",
  async (payload, thunkAPI) => {
    try {
      const data = await deleteLoanReportApi(payload)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete loan report"
      );
    }
  }
)