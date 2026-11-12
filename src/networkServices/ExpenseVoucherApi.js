import { apiUrls } from "../networkServices/apiEndpoints";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { notify } from "../utils/utils";
import makeApiRequest from "./axiosInstance";

export const GetEmployeeDoctorByEmployeeType = async (params) => {
  const { value } = params;
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.GetEmployeeDoctors}?employeeType=${value}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error loading currency detail:", error);
  }
};
export const GetExpenceHead = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(`${apiUrls.GetExpenceHead}`, options);
    store.dispatch(setLoading(false));
    return data.data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error loading currency detail:", error);
  }
};

export const GetExpenceSubHeadByExpenceHeadID = async (params) => {
  const { value } = params;
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.GetExpenceSubHead}?expenceHeadID=${value}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error loading currency detail:", error);
  }
};
export const getApprovedAPI = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.getApproveBy}`, options);
    store.dispatch(setLoading(false));

    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error loading currency detail:", error);
  }
};

// Add Expesne API 
export const AddNewExpenseTo = async (params) => {
  console.log("PPPDDDAA", params);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.addNewExpense}`, options);
    console.log(data);
    if(data?.data?.status === 400){
      notify(data?.data?.errors?.ExpenceType[0], "error")
    }
  
    store.dispatch(setLoading(false));
    // GetExpenceSubHeadByExpenceHeadID()
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Add Expense", error);
  }
};

// Get Expense List API
export const GetExpenceList = async ({fromDate,toDate,receiptNo}) => {
  console.log("PICKER",fromDate,toDate,receiptNo);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.getExpenseList}?fromDate=${fromDate}&toDate=${toDate}&receiptNo=${receiptNo}`,options
    );
    store.dispatch(setLoading(false));
    if(data.status === 400){
      notify(data.data.message, "error");
    }
    return data
  } catch (err) {
    store.dispatch(setLoading(false));
    notify("No record found","error")
    console.log(err);
  }
};


// save Expense API

export const saveExpenseData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data:params
    };
    const data = await makeApiRequest(
      apiUrls.saveExpense,options
    );
    store.dispatch(setLoading(false));
    return data
  } catch (err) {
    store.dispatch(setLoading(false));
    // notify("No record found","error")
    console.log(err);
  }
};
