import { createSlice } from "@reduxjs/toolkit";
import { getTasks, updateTaskStatus } from "./tasksThunks";

const initialState = {
    tasks:[],
    loading:false,
    error:null,
    pagination:{},
    statusUpdateLoading:false,
    statusUpdateError:null
}
const tasksSlice = createSlice({
    name:"tasks",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getTasks.pending, (state,action)=>{
                state.loading=true;
            })
            .addCase(getTasks.fulfilled, (state,action)=>{
                state.loading=false
                state.tasks=[...action.payload.data]
                state.pagination = action.payload.pagination
            })
            .addCase(getTasks.rejected, (state,action)=>{
                state.loading=false
                state.error=action.payload
            })
            .addCase(updateTaskStatus.pending, (state,action)=>{
                state.statusUpdateLoading=true
            })
            .addCase(updateTaskStatus.fulfilled, (state,action)=>{
                state.statusUpdateLoading=false
                state.tasks = state.tasks.map((task)=>
                    task.id === action.payload.data.data.id ? {...task, ...action.payload.data.data} : task
                )
            })
            .addCase(updateTaskStatus.rejected, (state,action)=>{
                state.statusUpdateLoading=false
                state.statusUpdateError=null
            })
    }
})

export default tasksSlice.reducer