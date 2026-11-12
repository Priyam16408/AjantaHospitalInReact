import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { setLoading } from "../loadingSlice/loadingSlice";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { notify } from "../../../utils/utils";

// Token Management
export const getBindFloor = createAsyncThunk(
    "getBindFloor",
    async (_,{ dispatch }) => {    
      const options = {
        method: "GET",
      };
      dispatch(setLoading(true));
      try {
        const data = await makeApiRequest(
          `${apiUrls.getBindFloorAPI}`,
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

  export const getBindCategory = createAsyncThunk(
    "getBindCategory",
    async (_,{ dispatch }) => {    
      const options = {
        method: "GET",
      };
      dispatch(setLoading(true));
      try {
        const data = await makeApiRequest(
          `${apiUrls.BindCategory}?Type=1`,
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