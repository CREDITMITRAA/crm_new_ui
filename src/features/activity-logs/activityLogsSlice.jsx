import { createSlice } from "@reduxjs/toolkit";
import { addActivityLogNote, getAllActivityLogs } from "./activityLogsThunks";

const initialState = {
  activityLogsEmployeeWise: [],
  activityLogs:[],
  loading: false,
  error: null,
  pagination: {},
};

const activityLogsSlice = createSlice({
  name: "activityLogs",
  initialState: initialState,
  reducers: {
    resetActivityLogs: (state) => {
      state.activityLogs = [];
      state.pagination = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivityLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllActivityLogs.fulfilled, (state, action) => {
        state.activityLogsEmployeeWise = {}
        state.activityLogs = {}
        const groupedActivityLogsEmployeeWise = groupRecordsByCreatedBy(
          action.payload.data.data
        );
        const groupedActivityLogs = groupRecordsByDateAndTime(
          action.payload.data.data
        )
        state.loading = false;
        state.activityLogsEmployeeWise = groupedActivityLogsEmployeeWise;
        state.activityLogs = groupedActivityLogs
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getAllActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addActivityLogNote.pending, (state,action)=>{
        state.loading = true
      })
      .addCase(addActivityLogNote.fulfilled, (state,action)=>{
        state.loading = false
      })
      .addCase(addActivityLogNote.rejected, (state,action)=>{
        state.loading = false
        state.error = action.payload
      })
  },
});

export const { resetActivityLogs } = activityLogsSlice.actions;
export default activityLogsSlice.reducer;

// ✅ Group by date and time (hh:mm), and avoid duplicate logs by `id`
function groupRecordsByDateAndTime(records) {
  return records.reduce((acc, record) => {
    const dateObj = new Date(record.createdAt);

    // Format date as dd-mm-yyyy
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const date = `${day}-${month}-${year}`;

    // Format time as hh:mm (truncate seconds)
    const hours = String(dateObj.getUTCHours()).padStart(2, "0");
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const createdBy = record.created_by;
    const leadId = record.lead_id;

    if (!acc[date]) acc[date] = {};
    if (!acc[date][time]) acc[date][time] = {};
    if (!acc[date][time][createdBy]) acc[date][time][createdBy] = {};
    if (!acc[date][time][createdBy][leadId]) {
      acc[date][time][createdBy][leadId] = [];
    }

    // Check for uniqueness by record ID before pushing
    const alreadyExists = acc[date][time][createdBy][leadId].some(
      (log) => log.id === record.id
    );

    if (!alreadyExists) {
      acc[date][time][createdBy][leadId].push(record);
    }

    return acc;
  }, {});
}

function groupRecordsByCreatedBy(records) {
  return records.reduce((acc, record) => {
    const dateObj = new Date(record.createdAt);

    // Format date as dd-mm-yyyy
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const date = `${day}-${month}-${year}`;

    // Format time as hh:mm (truncate seconds)
    const hours = String(dateObj.getUTCHours()).padStart(2, "0");
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const createdBy = record.created_by;
    const leadId = record.lead_id;

    // Group by createdBy first
    if (!acc[createdBy]) acc[createdBy] = {};
    
    // Then group by date under createdBy
    if (!acc[createdBy][date]) acc[createdBy][date] = {};
    
    // Then group by time under date
    if (!acc[createdBy][date][time]) acc[createdBy][date][time] = {};
    
    // Finally group by leadId under time
    if (!acc[createdBy][date][time][leadId]) {
      acc[createdBy][date][time][leadId] = [];
    }

    // Check for uniqueness by record ID before pushing
    const alreadyExists = acc[createdBy][date][time][leadId].some(
      (log) => log.id === record.id
    );

    if (!alreadyExists) {
      acc[createdBy][date][time][leadId].push(record);
    }

    return acc;
  }, {});
}
