import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isArrayFunction, notify, renameKeys } from "../../../utils/utils";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { setLoading } from "../loadingSlice/loadingSlice";
import makeApiRequest from "../../../networkServices/axiosInstance";


const initialState = {
  getBindVitalData: [],
  getSearchListData: [],
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const SearchListData = createAsyncThunk(
    "SearchListData",
    async (params,{ dispatch }) => {    
      const options = {
        method: "POST",
        data: params,
      };
      dispatch(setLoading(true));
      try {
        const data = await makeApiRequest(`${apiUrls.SearchList}`, options);
        dispatch(setLoading(false));
        return data
      } catch (e) {
        dispatch(setLoading(false));
        notify(e?.message, "error");
      }
    }
  );
export const getBindVital = createAsyncThunk(
    "getBindFloor",
    async (transactionID,{ dispatch }) => {    
      const options = {
        method: "GET",
      };
      dispatch(setLoading(true));
      try {
        const data = await makeApiRequest(
            `${apiUrls.BindDetails}?TID=${transactionID}`,
          options
        );
        dispatch(setLoading(false));
        return data
      } catch (e) {
        dispatch(setLoading(false));
        notify(e?.message, "error");
      }
    }
  );

export const vitalSignSlice = createSlice({
  name: "vitalSignSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      

      // Token Management

      .addCase(getBindVital.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getBindVital.fulfilled, (state, { payload }) => {
        state.getBindVitalData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(getBindVital.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
      .addCase(SearchListData.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(SearchListData.fulfilled, (state, { payload }) => {
        state.getSearchListData = payload?.data;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload?.message;
      })
      .addCase(SearchListData.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      })
     
  },
});

export default vitalSignSlice.reducer;
