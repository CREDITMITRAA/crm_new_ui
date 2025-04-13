import { createSlice } from "@reduxjs/toolkit";
import { getUsersNameAndId } from "./usersThunks";

const initialState = {
  users: [],
  loading: false,
  error: null,
  userOptions:[]
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersNameAndId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUsersNameAndId.fulfilled, (state, action) => {
        state.loading = false;
        state.userOptions = action.payload.map((user) => ({
          label: user.name,
          value: user.name,
        }));
        state.users = action.payload
      })
      .addCase(getUsersNameAndId.rejected, (state, action) => {
        console.log("users paylaod = ", action.payload);

        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = usersSlice.actions;
export default usersSlice.reducer;
