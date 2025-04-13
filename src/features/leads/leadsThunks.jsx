import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllInvalidLeads,
  fetchAllLeads,
  fetchDistinctLeadSources,
  fetchLeadByLeadId,
  fetchLeadsByAssignedUserId,
  fetchTodaysLeadsCount,
  fetchTotalLeadsCount,
  updateLeadDetailsApi,
  updateLeadStatusApi,
  updateVerificationStatusApi,
} from "./leadsApi";
import { fetchRecentActivityNotesByLeadId } from "../activities/activitiesApi";

export const getTotalLeadsCount = createAsyncThunk(
  "leads/getTotalLeadsCount",
  async (params, thunkAPI) => {
    try {
      const data = await fetchTotalLeadsCount(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads count"
      );
    }
  }
);

export const getTodaysLeadsCount = createAsyncThunk(
  "leads/getTodaysLeadsCount",
  async (params, thunkAPI) => {
    try {
      const data = await fetchTodaysLeadsCount({ ...params ,today: true });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch todays leads count"
      );
    }
  }
);

export const getAllLeads = createAsyncThunk(
  "leads/getAllLeads",
  async (params, thunkAPI) => {
    try {
      const data = await fetchAllLeads(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads"
      );
    }
  }
);

export const getAllDistinctLeadSources = createAsyncThunk(
  "leads/getAllDistinctLeadSources",
  async (_, thunkAPI) => {
    try {
      const data = await fetchDistinctLeadSources();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads"
      );
    }
  }
);

export const getAllInvalidLeads = createAsyncThunk(
  "leads/getAllInvalidLeads",
  async (params, thunkAPI) => {
    try {
      const data = fetchAllInvalidLeads(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads"
      );
    }
  }
);

export const getLeadByLeadId = createAsyncThunk(
  "leads/getLeadByLeadId",
  async ({ leadId, params }, thunkAPI) => {
    try {
      const data = fetchLeadByLeadId(leadId, params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lead "
      );
    }
  }
);

export const updateLeadDetails = createAsyncThunk(
  "leads/updateLeadDetails",
  async ({ id, payload }, thunkAPI) => {
    try {
      const data = await updateLeadDetailsApi(id, payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update lead details "
      );
    }
  }
);

export const getRecentActivityNotesByLeadId = createAsyncThunk(
  "leads/getRecentActivityNotesByLeadId",
  async (params, thunkAPI) => {
    try {
      const data = await fetchRecentActivityNotesByLeadId(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch recent activity notes "
      );
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  "leads/updateLeadStatus",
  async (payload, thunkAPI) => {
    try {
      const data = await updateLeadStatusApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update lead status"
      );
    }
  }
);

export const updateVerificationStatus = createAsyncThunk(
  "leads/updateVerificationStatus",
  async (payload, thunkAPI) => {
    try {
      const data = updateVerificationStatusApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update verification status"
      );
    }
  }
);

export const getLeadsByAssignedUserId = createAsyncThunk(
  "leads/getLeadsByAssignedUserId",
  async (params, thunkAPI) => {
    try {
      const data = await fetchLeadsByAssignedUserId(params)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads by assigned user id"
      );
    }
  }
)
