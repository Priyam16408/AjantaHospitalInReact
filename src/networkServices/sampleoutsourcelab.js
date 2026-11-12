 

import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const SaveDeptReceive = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SaveDeptReceive}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};


export const BindDepartmentLab = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get", 
      };
      const data = await makeApiRequest(`${apiUrls.BindDepartmentOutsourceLab}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 

export const BindlabOutSource = async () => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get", 
      };
      const data = await makeApiRequest(`${apiUrls.BindLabOutSource}`, options);
      store.dispatch(setLoading(false));
      return data; 
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };

  
  export const SaveOutsourceSample = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SaveOutsourceSample}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };



  export const RejectDepartmentDataLab = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.RejectDepartmentDataLab}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };
 