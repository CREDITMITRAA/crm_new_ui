import { createSlice } from "@reduxjs/toolkit";
import { getVerificationLeads, scheduleWalkIn } from "./verificationThunks";

const initialState = {
    leads:[],
    loading:false,
    error:null,
    pagination:{},
    scheduleWalkInLoading:false,
    scheduleWalkInError:null
}

const verificationSlice = createSlice({
    name:'verification',
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getVerificationLeads.pending,(state,action)=>{
                state.loading=true
            })
            .addCase(getVerificationLeads.fulfilled, (state,action)=>{
                state.loading=false
                state.leads = action.payload.data.data
                state.pagination = action.payload.data.pagination;
            })
            .addCase(getVerificationLeads.rejected, (state,action)=>{
                state.loading=false
                state.error=null
            })
            .addCase(scheduleWalkIn.pending, (state,action)=>{
                state.scheduleWalkInLoading=true
            })
            .addCase(scheduleWalkIn.fulfilled, (state,action)=>{
                    state.scheduleWalkInLoading=false
            })
            .addCase(scheduleWalkIn.rejected, (state,action)=>{
                state.scheduleWalkInLoading=false
                state.scheduleWalkInError=action.payload
            })
    }
})

export default verificationSlice.reducer