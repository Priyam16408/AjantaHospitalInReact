import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isTemplate: false,
};

export const reloadDoctor = createSlice({
    name: "reloadDoctor",
    initialState,
    reducers: {
      setLoading: (state, actions) => {
        state.loading = actions.payload;
      },
    },
  });

export const { setLoading } = reloadDoctor.actions;
export default reloadDoctor.reducer;


