import { apiUrls } from "../networkServices/apiEndpoints";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { OPDCONFIRMATIONSTATE } from "../utils/constant";
import { notify } from "../utils/utils";
import makeApiRequest from "./axiosInstance";


// GET APPOINTMENT DETAIL
export const getAppointmentDetailAPIData = async (params) => {
  console.log("PPPDDDAA", params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.getAppointmentDetails}`, options);
    if(data.status === true){
      notify(data.message, "success");
    }
    console.log(data);
    if(data?.data?.success === false){
        console.log(data?.data?.message);
      notify(data?.data?.message, "error")
    }
  
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};



// GET RADIOLOGY APPOINTMENT DETAIL
export const getRadiologyAppointmentDetail = async (params) => {
  console.log("PPPDDDAA", params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.getRadiologyAppointmentDetails}`, options);
    console.log(data);
    // if(data?.data?.status === 400){
    //     console.log(data?.data?.errors);
    // //   notify(data?.data?.errors?.ExpenceType[0], "error")
    // }
  
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};



// Update  APPOINTMENT Schedu;e
export const updateAppointmentSchedule = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.updateAppointmentShedule}`, options);
    console.log(data);
    store.dispatch(setLoading(false));
    getAppointmentDetailAPIData(OPDCONFIRMATIONSTATE)
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const UpdateRadiologySchedule = async (params) => {
  console.log("PPPDDDAA", params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.UpdateRadiologySchedule}`, options);
    // if(data.success === true){
    //   notify(data.message, "sucess");
     
    // }
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};


export const bindAppointmentDetail = async (App_ID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.bindAppointmentDetail}?App_ID=${App_ID}`, options);
    console.log(data);
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};


export const UpdateAppointmentStatus = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data:params
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.UpdateAppointmentStatus}`, options);
    console.log(data);
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const GetPatientDoctorAppointmentDetails = async (appointmentID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.GetPatientDoctorAppointmentDetails}?appointmentID=${appointmentID}`, options);
    console.log(data);
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const UpdatePatientDetailInAppointmentByAppID = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data:params
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.UpdatePatientDetailInAppointmentByAppID}`, options);
    console.log(data);
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};


// import { apiUrls } from "../networkServices/apiEndpoints";
// import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
// import store from "../store/store";
// import { notify } from "../utils/utils";
// import makeApiRequest from "./axiosInstance";

// // Common function to handle API requests
// const handleApiRequest = async (url, params, successMessage) => {
//   console.log("Request Params:", params);
//   store.dispatch(setLoading(true));
//   try {
//     const options = {
//       method: "POST",
//       data: params,
//     };
//     const data = await makeApiRequest(url, options);
//     if (data.status === true && successMessage) {
//       notify(successMessage, "success");
//     }
//     console.log("Response Data:", data);
//     return data;
//   } catch (error) {
//     console.error("API Request Error", error);
//     notify("An error occurred while processing your request.", "error");
//   } finally {
//     store.dispatch(setLoading(false));
//   }
// };

// // GET APPOINTMENT DETAIL
// export const getAppointmentDetailAPIData = (params) =>
//   handleApiRequest(apiUrls.getAppointmentDetails, params, "Appointment details loaded successfully.");

// // GET RADIOLOGY APPOINTMENT DETAIL
// export const getRadiologyAppointmentDetail = (params) =>
//   handleApiRequest(apiUrls.getRadiologyAppointmentDetails, params);

// // UPDATE APPOINTMENT SCHEDULE
// export const updateAppointmentSchedule = (params) =>
//   handleApiRequest(apiUrls.updateAppointmentShedule, params, "Appointment schedule updated successfully.");

// // UPDATE RADIOLOGY SCHEDULE
// export const UpdateRadiologySchedule = (params) =>
//   handleApiRequest(apiUrls.UpdateRadiologySchedule, params, "Radiology schedule updated successfully.");

// // Function to update appointment schedule and then get appointment details
// export const updateAndFetchAppointmentDetails = async (params) => {
//   try {
//     // First, update the appointment schedule
//     const updateResponse = await updateAppointmentSchedule(params);
//     if (updateResponse.status === true) {
//       // If the update is successful, fetch the appointment details
//       const detailParams = { /* your parameters for getAppointmentDetailAPIData */ };
//       const details = await getAppointmentDetailAPIData(detailParams);
//       return details;
//     }
//   } catch (error) {
//     console.error("Error in updateAndFetchAppointmentDetails", error);
//   }
// };
