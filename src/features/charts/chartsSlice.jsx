import { createSlice } from "@reduxjs/toolkit";
import { getChartDataByChartType, getChartDataByChartType2 } from "./chartsThunk";

const initialState = {
  data: {},
  loading: false,
  error: null,
  data2:{},
  loading2:false,
  error2:null
};

const chartSlice = createSlice({
  name: "charts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChartDataByChartType.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getChartDataByChartType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
      })
      .addCase(getChartDataByChartType.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getChartDataByChartType2.pending, (state, action) => {
        state.loading2 = true;
      })
      .addCase(getChartDataByChartType2.fulfilled, (state, action) => {
        state.loading2 = false;
        state.data2 = action.payload.data.data;
      })
      .addCase(getChartDataByChartType2.rejected, (state, action) => {
        state.loading2 = false;
        state.error2 = null;
      });
  },
});

export default chartSlice.reducer
