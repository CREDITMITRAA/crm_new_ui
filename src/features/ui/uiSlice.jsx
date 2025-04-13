import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    height:null,
    isConfirmationDialogueOpened:false,
    isProfileDialogueOpened:false,
    isAddActivityDialogueOpened:false
}

const uiSlice = createSlice({
    name:'ui',
    initialState:initialState,
    reducers:{
        setHeight:(state,action)=>{
            state.height=action.payload
        },
        setIsConfirmationDialogueOpened:(state,action)=>{
            state.isConfirmationDialogueOpened=action.payload
        },
        setIsProfileDialogueOpened:(state,action)=>{
            state.isProfileDialogueOpened=action.payload
        },
        setIsAddActivityDialogueOpened:(state,action)=>{
            state.isAddActivityDialogueOpened=action.payload
        }
    }
})

export const {setHeight, setIsConfirmationDialogueOpened, setIsProfileDialogueOpened, setIsAddActivityDialogueOpened} = uiSlice.actions
export default uiSlice.reducer