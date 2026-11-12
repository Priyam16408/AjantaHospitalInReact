 

import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const SearchRadiologyAcceptance = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.RadiologyAcceptance}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};

export const RadiologyCallTokens = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.RadiologyCallToken}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };


  export const RadiologyUnCallTokens = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.RadiologyUnCallToken}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };

  export const RadiologySaveAcceptance= async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.RadiologySaveAcceptance}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };
  

  
  export const RadiologyRemoveSample= async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.RadiologyRemoveSample}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };
  
 

 
export const RadiologyBindDepartmentsLab = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get", 
      };
      const data = await makeApiRequest(`${apiUrls.RadiologyBindLabDepartment}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };


  export const BindRadiologybindRoomList = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get", 
      };
      const data = await makeApiRequest(`${apiUrls.RadiologybindRoomList}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };


//   export const SaveSampleRecive = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "POST",
//         data: params,
//       };
//       const data = await makeApiRequest(`${apiUrls.SaveSampleReciveLab}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };


//   export const SaveTransferDataLab = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "POST",
//         data: params,
//       };
//       const data = await makeApiRequest(`${apiUrls.SaveTransferDataLab}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };



//   export const RejectDepartmentDataLab = async (params) => {
//     store.dispatch(setLoading(true));
//     try {
//       const options = {
//         method: "POST",
//         data: params,
//       };
//       const data = await makeApiRequest(`${apiUrls.RejectDepartmentDataLab}`, options);
//       store.dispatch(setLoading(false));
//       return data;
//     } catch (error) {
//       store.dispatch(setLoading(false));
//       console.error("Error Found", error); 
//     }
//   };


 