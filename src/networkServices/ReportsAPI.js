import { apiUrls } from "../networkServices/apiEndpoints";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { notify } from "../utils/utils";
import makeApiRequest from "./axiosInstance";

export const getBindDetailUser = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(`${apiUrls.BindDetailUser}`, options);
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

export const getBindTypeOfTnx = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(`${apiUrls.BindTypeOfTnx}`, options);
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
export const getBindCountryList = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(`${apiUrls.GetCountryList}`, options);
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
export const getBindStateList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetStateList}?countryId=${payload}`,
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
export const getBindDistrictList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetDistrictList}?countryId=${payload?.countryId}&StateId=${payload?.StateId}`,
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
export const getBindCityList = async ({ DistrictId, StateId }) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.GetCityList}?DistrictId=${DistrictId}&StateId=${StateId}`,
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

export const DailyCollectionDailyCollection = async (payload, type) => {
  try {
    store.dispatch(setLoading(true));
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls?.DailyCollectionDailyCollection}?type=${type}`,
      options
    );

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
  finally {
    store.dispatch(setLoading(false));
  }

};

export const MRDPrintMRDAllReports = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.MRDPrintMRDAllReports, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const PrintMRDAnalysisDetail = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintMRDAnalysisDetail, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const OPDBillRegisterReports = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.OPDBillRegisterReports, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const CreditControlInvoiceSettlementReport = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.CreditControlInvoiceSettlementReport, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const CreditControlInvoiceSettlementPdf = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.CreditControlInvoiceSettlementPdf, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const RefundReport = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.RefundReport, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const ReportsRegistrationDetail = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.ReportsRegistrationDetail,
      options
    );

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const OPDAdvanceOutStandingReport = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.OPDAdvanceOutStandingReport,
      options
    );

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const PatientHistoryDetails = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PatientHistoryDetails, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const PrintFileLocationInMRD = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintFileLocationInMRD, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const PrintFileIssuesStatus = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintFileIssuesStatus, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const PrintBedOccupancyReport = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintBedOccupancyReport, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
}; export const IPDBillPrints = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.IPDBillPrints, options);

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};

export const ReferDoctorApiCall = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls?.ReferDoctorReportList}`,
      options
    );

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
export const MortuarygetReligion = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls?.MortuarygetReligion}`,
      options
    );

    return data;
  } catch (error) {
    console.error(error, "SomeThing Went Wrong");
  }
};
