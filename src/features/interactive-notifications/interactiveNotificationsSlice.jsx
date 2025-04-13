import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show:false,
    videoSrc:"",
    message:""
}

const interactiveNotificationsSlice = createSlice({
    name: "interactiveNotifications",
    initialState: initialState,
    reducers:{
        showInteractiveNotification:(state,action)=>{
            state.show=true;
            state.videoSrc=action.payload.videoSrc;
            state.message=action.payload.message;
        },
        hideInteractiveNotification:(state,action)=>{
            state.show=false;
            state.videoSrc="";
            state.message="";
        }
    },
    extraReducers: () => {

    }
})

export const {showInteractiveNotification, hideInteractiveNotification} = interactiveNotificationsSlice.actions
export default interactiveNotificationsSlice.reducer