import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";

 
 
export const BindOTImages = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindOTImages}?TID=${TID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
}; 
export const ViewOTImages = async (imageID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.ViewOTImagesURL}?imageID=${imageID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
}; 



export const UpdateOTImages = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.UpdateOTImages}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }  
};
 

export const RemoveOTImages = async (TID, urlImage) => {
  store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.RemoveOTImages}?TID=${TID}&urlImage=${urlImage}`; 
    const data = await makeApiRequest(url, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

 




export const OTImagesUpload = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.OTImagesUpload}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }  
};

