import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWalkIns,
  fetchWalkInsCount,
  rescheduleWalkInApi,
  updateApplicationStatusApi,
  updateWalkInOrCallStatusApi,
} from "./walkInsApi";
import { fetchAllLeads } from "../leads/leadsApi";

export const getWalkIns = createAsyncThunk(
  "walkIns/getWalkIns",
  async (params, thunkAPI) => {
    try {
      const data = await fetchWalkIns(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch walk ins"
      );
    }
  }
);

export const getWalkInsCount = createAsyncThunk(
  "walkIns/getWalkInsCount",
  async (params, thunkAPI) => {
    try {
      const data = await fetchWalkInsCount(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch walk ins"
      );
    }
  }
);

export const getAllWalkInLeads = createAsyncThunk(
  "walkIns/getAllWalkInLeads",
  async (params, thunkAPI) => {
    try {
      const data = await fetchAllLeads(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch walk in leads"
      );
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "walkIns/updateApplicationStatus",
  async (payload, thunkAPI) => {
    try {
      const data = await updateApplicationStatusApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update application status"
      );
    }
  }
);

export const updateWalkInOrCallStatus = createAsyncThunk(
  "walkIns/updateWalkInOrCallStatus",
  async (payload, thunkAPI) => {
    try {
      const data = await updateWalkInOrCallStatusApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update walk-in or call status"
      );
    }
  }
);

export const rescheduleWalkIn = createAsyncThunk(
  "walkIns/rescheduleWalkIn",
  async (payload, thunkAPI) => {
    try {
      const data = await rescheduleWalkInApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to reschedule walk-in or call status"
      );
    }
  }
);
