import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const GetBindDoctorGroup = async () => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindGroup}`,
        {
          method: "get",
        }
      );
      store.dispatch(setLoading(false));
      return data;
    } catch {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
export const TemperatureRoomSearchAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      // {
      //   "mrNo": "",
      //   "pName": "Rita Devi",
      //   "appNo": "1",
      //   "doctorID": "1",
      //   "status": "0",
      //   "fromDate": "2024-05-01",
      //   "toDate": "2024-08-01",
      //   "drGroup": "1",
      //   "panelID": 92,
      //   "appointmentType": "853"
      // }
      const data = await makeApiRequest(
        `${apiUrls.TemperatureRoomSearch}`,
        {
          method: "POST",
          data:payload
        }
      );
      store.dispatch(setLoading(false));
      return data;
    } catch {
      store.dispatch(setLoading(false));
      throw error;
    }
  };

  export const UpdateTemperatureRoomOut = async (App_ID) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.UpdateTemperatureRoomOut}?App_ID=${App_ID}`,
        {
          method: "get",
        }
      );
      store.dispatch(setLoading(false));
      return data;
    } catch {
      store.dispatch(setLoading(false));
      throw error;
    }
  };

 