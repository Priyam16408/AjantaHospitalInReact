 
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

// export const DispatchResultEntryLab = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "get",
//       };
//       const data = await makeApiRequest(`${apiUrls.DispatchResultEntryLab}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };


//   export const TestResultEntryLab = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "get",
//       };
//       const data = await makeApiRequest(`${apiUrls.TestResultEntryLab}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };


  export const DispatchResultEntryLab = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.DispatchResultEntryLab}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };

  // DispatchLabReport

  export const DispatchLabReports = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.DispatchLabReports}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };


 
  

  
//   export const LabObservationSearch = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "POST",
//         data: params,
//       };
//       const data = await makeApiRequest(`${apiUrls.LabObservationSearch}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };

     
  export const DipatchBindDoctorDept = async (params) => {
    store.dispatch(setLoading(true)); 
    try {
      // Construct the URL with query parameters
      const query = new URLSearchParams(params).toString();
  
      const urlWithParams = `${apiUrls.BindDoctorDept}?${query}`;
  
      const options = {
        method: "GET",
      };
  
      const data = await makeApiRequest(urlWithParams, options);
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };



  export const BindInvestigationLab = async (Department) => {
    store.dispatch(setLoading(true));
    try {
      let centerID = useLocalStorage("userData","get")
      const data = await makeApiRequest(
        `${apiUrls.BindInvestigationLabURL}?Department=${Department}&CentreID=${centerID?.centreID}`,
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


  
export const BindDepartmentDispatch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindDepartmentDispatch}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
