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
  reducers: {
    updateLeadStatus: (state, action) => {
      state.leads = state.leads.map(lead => 
        lead.id === action.payload.id
          ? {
              ...lead,
              application_status: action.payload.status,
              last_updated_status: action.payload.status
            }
          : lead
      );
    }
  },
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
        state.statusUpdateLoading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        
        // Debugging: Log the actual values, not proxies
        // console.log('Action payload:', JSON.parse(JSON.stringify(action.payload)));
        
        // // Check if payload has the expected structure
        // if (!action.payload?.data?.data?.id) {
        //   console.error('Invalid payload structure', action.payload);
        //   return;
        // }
      
        // const updatedLead = action.payload.data.data;
        
        // state.leads = state.leads.map((lead) => {
        //   if (Number(lead.id) === Number) {
        //     console.log('Updating lead:', lead.id, 'with:', updatedLead);
        //     return { ...lead, ...updatedLead };
        //   }
        //   return lead;
        // });
      
        // // Verify the update worked
        // const afterUpdate = state.leads.find(lead => lead.id === updatedLead.id);
        // console.log('After update:', JSON.parse(JSON.stringify(afterUpdate)));
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload;
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

export const {updateLeadStatus} = walkInsSlice.actions
export default walkInsSlice.reducer;
