import { createSlice } from "@reduxjs/toolkit";
import { deleteLeadDocument, getLeadDocumentsByLeadId, uploadLeadDocument } from "./leadDocumentsThunks";
import { CREDIT_BUREAU, OTHER_DOCS, PAYSLIP } from "../../utilities/AppConstants";

const initialState = {
    payslips:[],
    bureaus:[],
    other:[],
    loading:false,
    error:null,
    uploadDocumentsLoading:false,
    uploadDocumentsError:null,
    deleteDocumentLoading:false,
    deleteDocumentError:null
}

const leadDocumentsSlice = createSlice({
    name:"leadDocuments",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(getLeadDocumentsByLeadId.pending, (state,action)=>{
                state.loading=true;
            })
            .addCase(getLeadDocumentsByLeadId.fulfilled, (state,action)=>{
                console.log('payslips = ', action.payload.data);
                state.loading = false
                action.payload.data.data.forEach((document)=>{
                    switch(document.document_type){
                        case PAYSLIP:
                            state.payslips.push(document)
                            break;
                        case CREDIT_BUREAU:
                            state.bureaus.push(document)
                            break;
                        case OTHER_DOCS:
                            state.other.push(document)
                            break;
                    }
                })
            })
            .addCase(getLeadDocumentsByLeadId.rejected, (state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(uploadLeadDocument.pending, (state,action)=>{
                state.uploadDocumentsLoading = true
            })
            .addCase(uploadLeadDocument.fulfilled, (state,action)=>{
                state.uploadDocumentsLoading = false
                const uploadedDocument = action.payload?.data?.dbData
                console.log('uploaded documents in fulfilled state = ', uploadedDocument);
                
                switch(uploadedDocument.document_type){
                    case PAYSLIP:
                        state.payslips.push(uploadedDocument)
                        break;
                    case CREDIT_BUREAU:
                        state.bureaus.push(uploadedDocument)
                        break;
                    case OTHER_DOCS:
                        state.other.push(uploadedDocument)
                        break;
                }
            })
            .addCase(uploadLeadDocument.rejected, (state,action)=>{
                state.uploadDocumentsLoading = false
                state.uploadDocumentsError = action.payload
            })
            .addCase(deleteLeadDocument.pending, (state,action)=>{
                state.deleteDocumentLoading=true
            })
            .addCase(deleteLeadDocument.fulfilled, (state,action)=>{
                state.deleteDocumentLoading=false
                const {documentId, documentType} = action.payload.data.data;
                switch(documentType){
                    case PAYSLIP:
                        state.payslips = state.payslips.filter((payslip) => payslip.id !== documentId);
                        break;
                    case CREDIT_BUREAU:
                        state.bureaus = state.bureaus.filter((bureau) => bureau.id !== documentId);
                        break;
                    case OTHER_DOCS:
                        state.other = state.other.filter((other) => other.id !== documentId);
                        break;
                }
            })
            .addCase(deleteLeadDocument.rejected, (state,action)=>{
                state.deleteDocumentLoading=false
                state.deleteDocumentError=null
            })
    }
})

export const {removeDocument} = leadDocumentsSlice.actions
export default leadDocumentsSlice.reducer