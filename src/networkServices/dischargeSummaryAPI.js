import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";


export const DischargeSummaryBindReportHeader = async () => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindReportHeader,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryDRHeader = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryDRHeader,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const createDischargeNextVisitApi = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.createDischargeNextVisit,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindConsultant = async (TID) => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.DischargeSummaryBindConsultant}?TID=${TID}`,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const getDischargeNextVisitByPatientIDApi = async (patientId) => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.getDischargeNextVisitByPatientID}?patientId=${patientId}`,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryConsultantAdd = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryConsultantAdd,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryDeleteConsultant = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryDeleteConsultant,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindRoute = async () => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindRoute,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "Something Went Wrong");
  }
};

export const DischargeSummaryBindTimeofNextDose = async () => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindTimeofNextDose,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindMeal = async () => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindMeal,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindTime = async () => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindTime,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryEMRMedicine = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryEMRMedicine,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryICDDescriptionSave = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryICDDescriptionSave,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindPatient = async (TID) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DischargeSummaryBindPatient}?TID=${TID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryICDCodeRemove = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryICDCodeRemove,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryICDMasterSave = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryICDMasterSave,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

// master

export const DischargeSummarySaveEMRHeader = async (HeaderName) => {
  try {
    const options = {
      method: "post",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DischargeSummarySaveEMRHeader}?HeaderName=${HeaderName}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindEMRHeader = async () => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindEMRHeader,
      options
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const DischargeSummarySaveEMRHeaderTable = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls?.DischargeSummarySaveEMRHeaderTable,
      options
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

// set Header Deptwise

export const DischargeSummaryBindHeaderList = async (Department) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DischargeSummaryBindHeaderList}?Department=${Department}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummarySaveSetHeaderDeptWise = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummarySaveSetHeaderDeptWise,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

// setHEaderMandaortoy

export const DischargeSummaryBindHeader = async () => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      apiUrls?.DischargeSummaryBindHeader,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DischargeSummaryBindDischargeType = async (DischargeName) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DischargeSummaryBindDischargeType}?DischargeName=${DischargeName}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsGetDRDetails = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.DRDetailsGetDRDetails, options);

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsLoadHeaders = async (
  department,
  DischargeName,
  TransactionID
) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsLoadHeaders}?department=${department}&DischargeName=${DischargeName}&TransactionID=${TransactionID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsLoadTemplates = async (TempHeaderID) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsLoadTemplates}?TempHeaderID=${TempHeaderID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsTemplateChange = async (TemplateID) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsTemplateChange}?TemplateID=${TemplateID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsTemplateDelete = async (TemplateID) => {
  try {
    const options = {
      method: "delete",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsTemplateDelete}?TemplateID=${TemplateID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsSaveDischargeSummary = async (payload) => {
  try {
    const options = {
      method: "Post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.DRDetailsSaveDischargeSummary,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsBindDetails = async (transactionID) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsBindDetails}?TransactionID=${transactionID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsPatientTemplateDelete = async (
  transactionID,
  ReportTypeHeaderID
) => {
  try {
    const options = {
      method: "delete",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsPatientTemplateDelete}?TransactionID=${transactionID}&ReportTypeHeaderID=${ReportTypeHeaderID}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsBindApprovalDoctor = async () => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsBindApprovalDoctor}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsApproveDischargeSummary = async (
  ApprovedDoctorID,
  TransactionID,
  Type
) => {
  try {
    const options = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.DRDetailsApproveDischargeSummary}?ApprovedDoctorID=${ApprovedDoctorID}&TransactionID=${TransactionID}&Type=${Type}`,
      options
    );

    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const DRDetailsPrintDischargeReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };

    const response = await makeApiRequest(
      `${apiUrls?.DRDetailsPrintDischargeReport}`,
      options
    );

    return response;
  } catch (error) {
    console.error("Error in DRDetailsPrintDischargeReport:", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BindEMRMedicine = async (TID) => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.BindEMRMedicine}?TID=${TID}`,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const DeleteEMRMedicine = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.DeleteEMRMedicine, options);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const NuclearMedicineApi = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.NuclearMedicine, options);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const GetNuclearMedicinesData = async (date) => {
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.GetNuclearMedicineTable}?InvestigationDate=${date}`,
      options
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const UpdateNuclearMedTest = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.UpdateNuclearMedTest, options);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const BindEMRInvItemApi = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.BindEMRInvItem, options);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const SaveEMRInvItemApi = async (payload) => {
  try {
    const options = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.SaveEMRInvItem, options);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
