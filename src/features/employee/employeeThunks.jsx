import { createAsyncThunk } from "@reduxjs/toolkit";
import { addEmployeeApi, deleteEmployeeApi, fetchAllEmployees, updateEmployeeApi } from "./employeeApi";

export const getAllEmployees = createAsyncThunk(
  "employees/getAllEmployees",
  async (params, thunkAPI) => {
    try {
      const data = await fetchAllEmployees(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch employees"
      );
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (params, thunkAPI) => {
    try {
      const data = await addEmployeeApi(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add employee"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const data = await updateEmployeeApi(userId, payload);
      return data; // Return updated employee data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update employee"
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",
    async (params,thunkAPI) => {
        try {
            const data = await deleteEmployeeApi(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete employee"
              );
        }
    }
)
