import { createSlice } from "@reduxjs/toolkit";
import { addLoanReport, deleteLoanReport, getLoanReportsByLeadId } from "./loanReportsThunks";

const initialState = {
    loanReports:[],
    loading:false,
    error:null
}

const loanReportsSlice = createSlice({
    name:'loanReports',
    initialState:initialState,
    reducers:{
        resetLoanReportUpdaters:(state,action)=>{
            state.loading=false
            state.error=null
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(addLoanReport.pending, (state,action)=>{
                state.loading=true
            })
            .addCase(addLoanReport.fulfilled, (state,action)=>{
                state.loading=false
                state.loanReports.push(action.payload.data.data)
            })
            .addCase(addLoanReport.rejected, (state,action)=>{
                state.loading=false
                state.error=action.payload
            })
            .addCase(getLoanReportsByLeadId.pending, (state,action)=>{
                state.loading=true
            })
            .addCase(getLoanReportsByLeadId.fulfilled, (state,action)=>{
                state.loading=false
                state.loanReports=action.payload.data.data
            })
            .addCase(getLoanReportsByLeadId.rejected, (state,action)=>{
                state.loading=false
                state.error=action.payload
            })
            .addCase(deleteLoanReport.pending, (state,action)=>{
                state.loading=true
            })
            .addCase(deleteLoanReport.fulfilled, (state,action)=>{
                state.loading=false
                state.loanReports = state.loanReports.filter((loanReport)=>loanReport.id !== action.payload.data.data.id)
            })
            .addCase(deleteLoanReport.rejected, (state,action)=>{
                state.loading=false
                state.error=action.payload
            })
    }
})

export const {resetLoanReportUpdaters} = loanReportsSlice.actions
export default loanReportsSlice.reducer