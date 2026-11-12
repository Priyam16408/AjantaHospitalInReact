import moment from "moment";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const cardPrintSearch = async (data) => {
    store.dispatch(setLoading(true));
    try {
        const cardPrintList = await makeApiRequest(
            `${apiUrls.searchCardPrint}?patientID=${data?.patientID}&&fromDate=${data?.fromDate}&&toDate=${data?.toDate}`,
            {
                method: "get",
            }
        );
        store.dispatch(setLoading(false));
        return cardPrintList
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const cardPrintViewPhoto = async (data) => {
    store.dispatch(setLoading(true));
    const options = {
        method: "GET",
    };
    try {
        const cardPrintList = await makeApiRequest(
            `${apiUrls.ViewPhoto}?patientID=${data?.UHID}&dateEnrolled=${data?.DateEnrolled}`,
            options
        );
        store.dispatch(setLoading(false));
        return cardPrintList?.data;
    } catch (error) {
      
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const cardPrintUploadPhoto = async (params) => {
    store.dispatch(setLoading(true));
    try {
        const options = {
            method: "POST",
            data: params
        };
        const data = await makeApiRequest(
            apiUrls.UploadPhoto, options, 'multipart/form-data'
        );
        store.dispatch(setLoading(false));
        return data
    } catch (err) {
        store.dispatch(setLoading(false));
        // notify("No record found","error")
        console.log(err);
    }
};

// export const PatientFeedBackReportApi = async (data) => {
//     store.dispatch(setLoading(true));
//     try {
//         const cardPrintList = await makeApiRequest(
//             `${apiUrls.PatientFeedBackReport}?patientID=${data?.patientID}&&fromDate=${data?.fromDate}&&toDate=${data?.toDate}`,
//             {
//                 method: "get",
//             }
//         );
//         store.dispatch(setLoading(false));
//         return cardPrintList
//     } catch (error) {
//         store.dispatch(setLoading(false));
//         throw error;
//     }
// };
 export const PatientFeedBackReportApi = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PatientFeedBackReport}`,
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
 export const PatientFeedBackReportPrint = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PatientFeedBackReportPrint}`,
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

