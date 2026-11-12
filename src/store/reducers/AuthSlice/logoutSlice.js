import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest from "../../../networkServices/axiosInstance";
import { apiUrls } from "../../../networkServices/apiEndpoints";
import { notify } from "../../../utils/utils";
import { setLoading } from "../loadingSlice/loadingSlice";

const initialState = {
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const logoutAction = createAsyncThunk(
  "logoutAction",
  async (data, { dispatch }) => {
    const options = {
      method: "POST",
      data,
    };
    try {
      dispatch(setLoading(true));
      await makeApiRequest(apiUrls?.logout, options);

      dispatch(setLoading(false));
      // return data;
    } catch {
      dispatch(setLoading(false));
    }
  }
);

export const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(logoutAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        localStorage.clear();
        window.sessionStorage.clear()
        window.location.href = '/login'
        // window, location.reload()


        // payload?.success === false
        //   ? notify(payload.Message, "error")
        //   : notify(payload.Message, "success");
        // payload?.success &&
        //   useLocalStorage("userData", "set",payload?.data);
      })
      .addCase(logoutAction.rejected, (state, { error }) => {
        console.log(error.message);
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
        notify(error.message, "error");
      });
  },
});

export default logoutSlice.reducer;
