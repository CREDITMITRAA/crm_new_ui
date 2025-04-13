import { createSlice } from "@reduxjs/toolkit";
import {
  getAllDistinctLeadSources,
  getAllInvalidLeads,
  getAllLeads,
  getLeadByLeadId,
  getLeadsByAssignedUserId,
  getRecentActivityNotesByLeadId,
  getTodaysLeadsCount,
  getTotalLeadsCount,
  updateLeadDetails,
  updateLeadStatus,
  updateVerificationStatus,
} from "./leadsThunks";
import { updateEmployee } from "../employee/employeeThunks";

const initialState = {
  leads: [],
  loading: false,
  error: null,
  totalLeadsCount: 0,
  todaysLeadsCount: 0,
  pagination: {},
  leadSources: [],
  invalidLeads: [],
  invalidLeadsPagination: {},
  lead: {},
  recentActivityNotes: [],
};

const leadsSlice = createSlice({
  name: "leads",
  initialState: initialState,
  reducers: {
    updateLeadFields: (state, action) => {
      const { id, ...updatedFields } = action.payload;
      if (state.lead && state.lead.id === id) {
        state.lead = { ...state.lead, ...updatedFields };
      }
    },
    resetLead: (state,action)=>{
      state.lead = initialState.lead
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTotalLeadsCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTotalLeadsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalLeadsCount = action.payload;
      })
      .addCase(getTotalLeadsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTodaysLeadsCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTodaysLeadsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.todaysLeadsCount = action.payload;
      })
      .addCase(getTodaysLeadsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllLeads.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllDistinctLeadSources.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllDistinctLeadSources.fulfilled, (state, action) => {
        state.loading = false;
        state.leadSources = action.payload.map((leadSource) => ({
          label: leadSource,
          value: leadSource,
        }));
      })
      .addCase(getAllDistinctLeadSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllInvalidLeads.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllInvalidLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.invalidLeads = action.payload.data.data;
        state.invalidLeadsPagination = action.payload.data.pagination;
      })
      .addCase(getAllInvalidLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getLeadByLeadId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLeadByLeadId.fulfilled, (state, action) => {
        state.loading = false;
        state.lead = action.payload.data.data;
      })
      .addCase(getLeadByLeadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeadDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateLeadDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.lead = {...state.lead, ...action.payload.data.data}
      })
      .addCase(updateLeadDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRecentActivityNotesByLeadId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getRecentActivityNotesByLeadId.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivityNotes = action.payload.data.data;
      })
      .addCase(getRecentActivityNotesByLeadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeadStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.map((lead) =>
          lead.id === action.payload.data.data.id
            ? action.payload.data.data
            : lead
        );
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVerificationStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateVerificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.map((lead) =>
          lead.id === action.payload.data.data.id
            ? action.payload.data.data
            : lead
        );
      })
      .addCase(updateVerificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeadsByAssignedUserId.pending, (state,action)=>{
        state.loading=true
      })
      .addCase(getLeadsByAssignedUserId.fulfilled, (state,action)=>{
        state.loading=false
        state.leads = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getLeadsByAssignedUserId.rejected, (state,action)=>{
        state.loading=false
        state.error=action.payload
      })
  },
});

export const { updateLeadFields, resetLead } = leadsSlice.actions;
export default leadsSlice.reducer;
