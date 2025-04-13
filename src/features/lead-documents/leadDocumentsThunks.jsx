import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteLeadDocumentApi, fetchLeadDocumentsByLeadId, uploadLeadDocumentApi } from "./leadDocumentsApi";

export const getLeadDocumentsByLeadId = createAsyncThunk(
    "leadDocuments/getLeadDocumentsByLeadId",
    async (params,thunkAPI) => {
        try {
            const data = await fetchLeadDocumentsByLeadId(params)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch lead documents ");
        }
    }
)

export const uploadLeadDocument = createAsyncThunk(
    "leadDocuments/uploadLeadDocument",
    async (formData,thunkAPI)=>{
        try {
            const data = await uploadLeadDocumentApi(formData)
            return data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to upload lead document");
        }
    }
)

export const deleteLeadDocument = createAsyncThunk(
    "leadDocuments/deleteLeadDocument",
    async (payload, thunkAPI) => {
        try {
            const data = await deleteLeadDocumentApi(payload)
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete lead document");
        }
    }
)