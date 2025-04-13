// features/onlineUsers/onlineUsersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    onlineUsers: [],
};

const onlineUsersSlice = createSlice({
    name: 'onlineUsers',
    initialState,
    reducers: {
        addOnlineUser: (state, action) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },
        removeOnlineUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter(
                userId => userId !== action.payload
            );
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const { addOnlineUser, removeOnlineUser, setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;