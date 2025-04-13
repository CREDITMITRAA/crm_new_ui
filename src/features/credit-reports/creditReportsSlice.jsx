import { createSlice } from "@reduxjs/toolkit";
import {
  addCreditReport,
  deleteCreditReport,
  getCreditReportsByLeadId,
} from "./creditReportsThunks";

const initialState = {
  creditReports: [],
  loading: false,
  error: null,
};

const creditReportsSlice = createSlice({
  name: "creditReports",
  initialState: initialState,
  reducers: {
    resetCreditReportUpdaters: (state, action) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCreditReport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addCreditReport.fulfilled, (state, action) => {
        state.loading = false;
        state.creditReports.push(action.payload.data.data);
      })
      .addCase(addCreditReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCreditReportsByLeadId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCreditReportsByLeadId.fulfilled, (state, action) => {
        state.loading = false;
        state.creditReports = action.payload.data.data;
      })
      .addCase(getCreditReportsByLeadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCreditReport.pending, (state,action)=>{
        state.loading = true;
      })
      .addCase(deleteCreditReport.fulfilled, (state,action)=>{
        state.loading = false;
        state.creditReports = state.creditReports.filter((creditReport)=>creditReport.id !== action.payload.data.data.id)
      })
      .addCase(deleteCreditReport.rejected, (state,action)=>{
        state.loading = false;
        state.error=action.payload
      })
  },
});

export const { resetCreditReportUpdaters } = creditReportsSlice.actions;
export default creditReportsSlice.reducer;
