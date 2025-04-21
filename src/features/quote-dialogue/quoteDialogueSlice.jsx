import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isOpen: false,
    navigate: null
}
const quoteDialogueSlice = createSlice({
    name:"quoteDialogue",
    initialState:initialState,
    reducers:{
        showQuoteDialogue: (state, action) => {
            state.isOpen = true
            state.navigate = action.payload
        },
        closeQuoteDialogue: (state) => {
            state.isOpen = false,
            state.navigate = null
        }
    }
})

export const {showQuoteDialogue, closeQuoteDialogue} = quoteDialogueSlice.actions
export default quoteDialogueSlice.reducer