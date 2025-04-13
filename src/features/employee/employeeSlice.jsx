import { createSlice } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, getAllEmployees, updateEmployee } from "./employeeThunks";

const initialState = {
    employees:[],
    loading:false,
    error:null,
    loadingForDeleteEmployee:false
}

const employeeSlice = createSlice({
    name:"employees",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getAllEmployees.pending, (state,action)=>{
                state.loading = true;
            })
            .addCase(getAllEmployees.fulfilled, (state,action)=>{
                state.loading=false
                state.employees=action.payload.data
            })
            .addCase(getAllEmployees.rejected, (state,action)=>{
                state.loading=false
                state.error=null
            })
            .addCase(addEmployee.pending, (state,action)=>{
                state.loading = true;
            })
            .addCase(addEmployee.fulfilled, (state,action)=>{
                state.loading = false
                state.employees = [...state.employees, action.payload.data.data]
            })
            .addCase(addEmployee.rejected, (state,action)=>{
                state.loading=false
                state.error=null
            })
            .addCase(updateEmployee.pending, (state,action)=>{
                state.loading = true;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = state.employees.map(emp =>
                  emp.id === action.payload.data.data.id ? action.payload.data.data : emp
                );
            })              
            .addCase(updateEmployee.rejected, (state,action)=>{
                state.loading=false
                state.error=null
            })
            .addCase(deleteEmployee.pending, (state,action)=>{
                state.loadingForDeleteEmployee = true;
            })
            .addCase(deleteEmployee.fulfilled, (state,action)=>{
                state.loadingForDeleteEmployee = false
                state.employees = state.employees.filter(emp => emp.id !== action.payload.data.data.id)
            })
            .addCase(deleteEmployee.rejected, (state,action)=>{
                state.loadingForDeleteEmployee=false
                state.error=action.payload
            })
    }
})

export default employeeSlice.reducer