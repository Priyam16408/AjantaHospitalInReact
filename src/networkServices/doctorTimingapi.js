import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const DoctorAppointmentStatusByDoctorID = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      apiUrls.DoctorAppointmentStatusByDoctorID,
      {
        method: "post",
        data: payload,
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
