import {  createSlice } from "@reduxjs/toolkit";
import { isArrayFunction, notify, renameKeys } from "../../../utils/utils";
import { getBindCategory, getBindFloor } from "./CommonExportFunction";


const initialState = {
  getBindFloorData: [],
  getBindCategoryData:[],
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const TokenManagementSlice = createSlice({
  name: "TokenManagementSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      

      // Token Management

      .addCase(getBindFloor.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindFloor.fulfilled, (state, { payload }) => {
        state.getBindFloorData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindFloor.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      .addCase(getBindCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindCategory.fulfilled, (state, { payload }) => {
        state.getBindCategoryData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindCategory.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
     

  },
});

export default TokenManagementSlice.reducer;
