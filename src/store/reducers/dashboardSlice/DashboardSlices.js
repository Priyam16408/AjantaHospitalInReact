import {  createSlice } from "@reduxjs/toolkit";
import { isArrayFunction, notify, renameKeys } from "../../../utils/utils";
import { getDashboard } from "./CommonFunction";



const initialState = {
  getDashboardData: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const DashboardSlices = createSlice({
  name: "TokenManagementSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
    .addCase(getDashboard?.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.success = false;
    })
    .addCase(getDashboard.fulfilled, (state, { payload }) => {
      state.getDashboardData = payload?.data;
      state.loading = false;
      state.success = true;
      state.error = "";
      state.message = payload?.message;
    })
    .addCase(getDashboard.rejected, (state, { error }) => {
      console.log(error.message);
      state.loading = false;
      state.error = error.message;
      state.success = false;
      state.message = error.message;
      notify(error.message, "error");
    })
  },
});

export default DashboardSlices.reducer;
