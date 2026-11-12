import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const BindRoom = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get",
      };
      const data = await makeApiRequest(
        `${apiUrls.DisplayBindRoom}`,
        options
      );
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };
  

 

  
export const HandlePatientData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.serachBindRoom}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};

  // DisplayBindUser


  export const DisplayBindUser = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get",
      };
      const data = await makeApiRequest(
        `${apiUrls.DisplayBindUser}`,
        options
      );
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };


  // DisplayFloorName


  export const DisplayFloorName = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get",
      };
      const data = await makeApiRequest(
        `${apiUrls.DisplayFloorName}`,
        options
      );
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };


  export const DisplayWardData = async (params) => {
    store.dispatch(setLoading(true));
  
    try { 
      const urlWithParams = `${apiUrls.DisplayWardData}?WardID=${params}`;
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


    export const displayRoom = async (params) => {
    store.dispatch(setLoading(true));
  
    try { 
      const urlWithParams = `${apiUrls.DisplayBindRoom}?WardID=${params}`;
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
  
  // bindCurrentPatient



    
export const bindCurrentPatient = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.bindCurrentPatient}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};


export const BindRoomdata = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.BindRoomdata}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error); 
  }
};


// BindDisplayToken 

// BindDisplayToken


export const BindDisplayToken = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.BindDisplayToken}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};
 
 

 