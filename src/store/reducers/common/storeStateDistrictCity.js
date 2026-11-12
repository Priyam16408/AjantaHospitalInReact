import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";


export const storeState = createAsyncThunk(
  "STATE",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        apiUrls.StateInsert,
        options
      );
      dispatch(setLoading(false));
      if (data?.status) {
        notify(data?.message, "success")
      } else {
        notify(data?.message, "error")
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
export const districtInsert = createAsyncThunk(
  "DISTRICT",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        apiUrls.DistrictInsert,
        options
      );
      dispatch(setLoading(false));
      if (data?.status) {
        notify(data?.message, "success")
      } else {
        notify(data?.message, "error")
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const cityInsert = createAsyncThunk(
  "CITY",
  async (data, { dispatch }) => {
    console.log(data)
    const options = {
      method: "POST",
      data,
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        apiUrls.CityInsert,
        options
      );
      dispatch(setLoading(false));
      if (data?.status) {
        notify(data?.message, "success")
      } else {
        notify(data?.message, "error")
      }
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);
