import { createSlice } from "@reduxjs/toolkit";
import {
  getAllDistinctLeadSources,
  getAllInvalidLeads,
  getAllLeads,
  getExEmployeesLeads,
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
import { ASSIGNED_TABLE, EX_EMPLOYEES_LEADS_TABLE, INVALID_LEADS_TABLE, NOT_ASSIGNED_TABLE } from "../../utilities/AppConstants";

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
  exEmployeesLeads: [],
  exEmployeesPagination: {},
  lead: {},
  recentActivityNotes: [],
  filters:{},
  currentTableType:ASSIGNED_TABLE
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
    },
    setLeadsFilters: (state,action) => {
      state.filters = action.payload
    },
    setPagination: (state,action) => {
      switch(action.payload.tableType){
        case ASSIGNED_TABLE:
        case NOT_ASSIGNED_TABLE:
          state.pagination.page = action.payload.pagination.page
          state.pagination.pageSize = action.payload.pagination.pageSize
          break;
        case INVALID_LEADS_TABLE:
          state.invalidLeadsPagination.page = action.payload.pagination.page
          state.invalidLeadsPagination.pageSize = action.payload.pagination.pageSize
          break;
        case EX_EMPLOYEES_LEADS_TABLE:
          state.exEmployeesPagination.page = action.payload.pagination.page
          state.exEmployeesPagination.pageSize = action.payload.pagination.pageSize
          break;
      }
    },
    setCurrentTableType: (state,action)=>{
      state.currentTableType = action.payload
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
      .addCase(getExEmployeesLeads.pending, (state,action)=>{
        state.loading=true
      })
      .addCase(getExEmployeesLeads.fulfilled, (state,action)=>{
        state.loading=false
        state.exEmployeesLeads=action.payload.data.data
        state.exEmployeesPagination = action.payload.data.pagination;
      })
      .addCase(getExEmployeesLeads.rejected, (state,action)=>{
        state.loading=false
        state.error=action.payload
      })
  },
});

export const { updateLeadFields, resetLead, setLeadsFilters, setPagination, setCurrentTableType } = leadsSlice.actions;
export default leadsSlice.reducer;
