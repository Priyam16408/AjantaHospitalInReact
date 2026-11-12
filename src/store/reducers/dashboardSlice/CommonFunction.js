import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { setLoading } from "../loadingSlice/loadingSlice";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { notify } from "../../../utils/utils";
import store from "../../../store/store";

// Token Management
export const getDashboard = createAsyncThunk(
  "getDashboardData",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data:data
    };
    dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(`${apiUrls.HIMSDashboard}`, options);
      dispatch(setLoading(false));
      return data;
    } catch (e) {
      dispatch(setLoading(false));
      notify(e?.message, "error");
    }
  }
);

export const GetLangaugeAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetLangaugeURL}?Language=${payload}`,
      {
        method: "get"
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const changeLanguageAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.UpdateLangaugeURL}`,
      {
        method: "post",
        data:payload
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const handleSaveLanguage = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.SaveLanguage}`,
      {
        method: "post",
        data:payload
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};