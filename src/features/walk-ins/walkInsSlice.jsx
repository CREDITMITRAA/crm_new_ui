import { createSlice } from "@reduxjs/toolkit";
import {
  getAllWalkInLeads,
  getWalkIns,
  getWalkInsCount,
  rescheduleWalkIn,
  updateApplicationStatus,
  updateWalkInOrCallStatus,
} from "./walkInsThunks";

const initialState = {
  walkIns: [],
  loading: false,
  error: null,
  totalWalkInsCount: 0,
  todaysWalkInsCount: 0,
  pagination: {},
  leads: [],
  leadsPagination: {},
  statusUpdateLoading:false,
  statusUpdateError:null,
  rescheduleLoading:false,
  rescheduleError:null,
};

const walkInsSlice = createSlice({
  name: "walkIns",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWalkInsCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getWalkInsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalWalkInsCount = action.payload.totalWalkIns;
        state.todaysWalkInsCount = action.payload.todayWalkIns;
      })
      .addCase(getWalkInsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWalkIns.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getWalkIns.fulfilled, (state, action) => {
        state.loading = false;
        state.walkIns = [...action.payload.data];
        state.pagination = action.payload.pagination;
      })
      .addCase(getWalkIns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllWalkInLeads.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllWalkInLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data.data;
        state.leadsPagination = action.payload.data.pagination;
      })
      .addCase(getAllWalkInLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateApplicationStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.map((lead) =>
          lead.id === action.payload.data.data.id
            ? action.payload.data.data
            : lead
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWalkInOrCallStatus.pending, (state,action)=>{
        state.statusUpdateLoading = true
      })
      .addCase(updateWalkInOrCallStatus.fulfilled, (state,action)=>{
        state.statusUpdateLoading = false
        state.walkIns = state.walkIns.map((walkIn)=>
          walkIn.id === action.payload.data.data.id ? {...walkIn, ...action.payload.data.data} : walkIn
        )
      })
      .addCase(updateWalkInOrCallStatus.rejected, (state,action)=>{
        state.statusUpdateLoading = false
        state.statusUpdateError = action.payload
      })
      .addCase(rescheduleWalkIn.pending, (state,action)=>{
        state.rescheduleLoading = true
      })
      .addCase(rescheduleWalkIn.fulfilled, (state,action)=>{
        state.rescheduleLoading = false
        state.walkIns = state.walkIns.map((walkIn)=>
          walkIn.id === action.payload.data.data.id ? {...walkIn, ...action.payload.data.data} : walkIn
        )
      })
      .addCase(rescheduleWalkIn.rejected, (state,action)=>{
        state.rescheduleLoading = false
        state.rescheduleError = action.payload
      })
  },
});

export default walkInsSlice.reducer;
