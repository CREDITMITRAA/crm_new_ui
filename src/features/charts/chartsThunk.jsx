import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchChartDataByChartTypes, fetchChartDataByChartTypes2 } from "./chartsApi";

export const getChartDataByChartType = createAsyncThunk(
  "charts/getChartDataByChartType",
  async (params, thunkAPI) => {
    try {
      const data = await fetchChartDataByChartTypes(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch chart data"
      );
    }
  }
);

export const getChartDataByChartType2 = createAsyncThunk(
  "charts/getChartDataByChartType2",
  async (params, thunkAPI) => {
    try {
      const data = await fetchChartDataByChartTypes2(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch chart data"
      );
    }
  }
);
