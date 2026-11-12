import moment from "moment";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

const ip = useLocalStorage("ip", "get");

export const ModSearchSampleCollection = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.SearchSampleCollection, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindCentreList = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.BindCentre, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SampleTransferSearchInvestigation = async (BarcodeNo) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.SampleTransferSearchInvestigation}?BarcodeNo=${BarcodeNo}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleCollectionType = async (sampletype) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.SampleCollectionType}?sampletype=${sampletype}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SaveSampleTransferAPI = async (payload) => {
  console.log("Sssssss", payload);
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.SaveSampleTransfer, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleDispatchSearch = async (data) => {
  store.dispatch(setLoading(true));
  let payload = {
    dispatchcenter: data?.DispatchCenterTo?.value
      ? data?.DispatchCenterTo?.value
      : "",
    fromdate: moment(data?.fromDate).format("DD-MMM-YYYY"),
    todate: moment(data?.toDate).format("DD-MMM-YYYY"),
  };
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.SampleDispatchSearch, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const LogisticReceiveSearch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.LogisticReceiveSearch, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleCollectionReportSearch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.SampleCollectionReport, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleOutSourceReportSearch = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.SampleOutSource, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleRejectionReport = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: params,
    };
    const data = await makeApiRequest(apiUrls.SampleRejectionReport, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

//====================By Aakash ========================
export const SaveSampleRejectReasonApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.SaveSampleRejectReasonOption,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const getRejectReasonOptionsApi = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.getSampleRejectReasonOption}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
