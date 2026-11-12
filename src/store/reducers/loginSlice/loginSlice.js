import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { getLocalIP, notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk(
  "signIn",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    try {
      dispatch(setLoading(true));
      const data = await makeApiRequest(apiUrls?.login, options);
      dispatch(setLoading(false));
      return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(signInAction.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = payload.message;
        payload?.success === false
          ? notify(payload.Message, "error")
          : notify(payload.Message, "success");
          
        if (payload?.success) {
          useLocalStorage("userData", "set", payload?.data?.userDetails);
          useLocalStorage("token", "set", payload?.data?.token);
          useLocalStorage("ip", "set", "10.0.2.175")
        //   getLocalIP(ip => {
        //     useLocalStorage("ip", "set", ip?ip:"10.0.2.175")
        // });
     
        }
      })
      .addCase(signInAction.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      });
  },
});

export default authSlice.reducer;
