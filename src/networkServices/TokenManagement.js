import { apiUrls } from "../networkServices/apiEndpoints";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { OPDCONFIRMATIONSTATE } from "../utils/constant";
import { notify } from "../utils/utils";
import makeApiRequest from "./axiosInstance";

// Save modality Data
export const saveModalityData = async (params) => {
  console.log("PPPDDDAA", params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    
    const data = await makeApiRequest(`${apiUrls.saveModality}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    if (data?.data?.success === false) {
      console.log(data?.data?.message);
      notify(data?.data?.message, "error");
    }

    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
// get modality search
export const getModalitySearch = async ({ subcategoryid, centreID }) => {
  console.log("PPPDDDAA", subcategoryid, centreID);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.SearchModality}?subcategoryId=${subcategoryid}&CentreID=${centreID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// Exam Counter Master Page API

export const getCounterList = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(`${apiUrls.GetCounter}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// save counter

export const saveCounter = async (saveCounterstate) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.SaveCounter}?txtCounter=${saveCounterstate}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// delete counter

export const deleteCounter = async (ID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "PUT",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.deleteCounter}?id=${ID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// update counter

export const updateCounter = async ({ Id, name }) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "PUT",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.updateCounter}?id=${Id}&counter=${name}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getCheckCenterExists = async (Countername) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.CheckCenterExists}?Countername=${Countername}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const SearchInvestigationSlotSchedule = async (params) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    
    const data = await makeApiRequest(
      `${apiUrls.SearchInvestigationSlotSchedule}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    console.log(data);
    // if(data?.data?.success === false){
    //     console.log(data?.data?.message);
    //   notify(data?.data?.message, "error")
    // }

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getBindDoctorTimingShift = async (params) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(`${apiUrls.BindDocTimingShift}`, options);
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const getDataBindDetail = async (params) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.GetBindDetail}?CategoryID=${params}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const saveTokenMasterDetail = async (params) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    
    const data = await makeApiRequest(
      `${apiUrls.SaveTokenmasterDetail}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const GropuNameCheckExits = async ({ groupName, centreID }) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.IsGroupNameExists}?groupName=${groupName}&CentreID=${centreID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const checkTokenPrefixNameExits = async ({ Prefix, centreID }) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.CheckTokenPrefixExist}?Prefix=${Prefix}&CentreID=${centreID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const findGetCategoryName = async (CategoryID) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.GetCategoryName}?CategoryID=${CategoryID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

export const getBindSubCategoryName = async (SubCategoryID) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.GetSubCategoryName}?SubCategoryID=${SubCategoryID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
export const getBindGetGroupName = async (GroupID) => {
  // console.log(params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    
    const data = await makeApiRequest(
      `${apiUrls.GetGroupName}?GroupID=${GroupID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};
