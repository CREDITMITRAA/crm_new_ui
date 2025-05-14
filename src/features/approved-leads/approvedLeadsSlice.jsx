import { createSlice } from "@reduxjs/toolkit";
import { getApprovedLeads } from "./approvedLeadsThunks";

const initialState = {
    leads: [],
    loading: false,
    error: null,
    pagination: {},
    statusUpdateLoading:false,
    statusUpdateError:null,
}

const approvedLeadsSlice = createSlice({
    name: 'approvedLeads',
    initialState: initialState,
    reducers:{} ,
    extraReducers: (builder) => {
        builder
            .addCase(getApprovedLeads.pending, (state,action)=>{
                state.loading=true
            })
            .addCase(getApprovedLeads.fulfilled, (state,action)=>{
                state.loading = false
                state.leads = action.payload.data.data
                state.pagination = action.payload.data.pagination
            })
            .addCase(getApprovedLeads.rejected, (state,action)=>{
                state.loading = false
                state.error = action.payload
            })
    }
})

export const {} = approvedLeadsSlice.actions
export default approvedLeadsSlice.reducer