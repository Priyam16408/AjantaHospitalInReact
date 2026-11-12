import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { PrintBedOccupancyReport } from "./ReportsAPI";

export const MRDBindPatientType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientType}?roomID=1`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindCaseType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindCaseType}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindPanelIPD = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindPanelIPD}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindParentPanel = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(`${apiUrls?.MRDBindParentPanel}`, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDischargeType = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDischargeType}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchGrid = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchGrid, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDPatientSearchMRDRecieved = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(
      apiUrls?.MRDPatientSearchMRDRecieved,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDocuments = async (TID) => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDocuments}?TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDFileRegisterSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDFileRegisterSave, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindgrd = async (PID, TID) => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls?.MRDBindgrd}?PID=${PID}&TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDScanFileUpload = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDScanFileUpload, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDScanFileView = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDScanFileView, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRoomCMB = async () => {
  try {
    const option = {
      method: "get",
    };
    const data = await makeApiRequest(apiUrls?.MRDBindRoomCMB, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindAlmirah = async (RmID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDBindAlmirah}?RmID=${RmID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindShelf = async (AlmID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDBindShelf}?AlmID=${AlmID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSetLocation = async (TID) => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDSetLocation}?TID=${TID}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSetLocationSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload
    };
    const response = await makeApiRequest(
      `${apiUrls?.MRDSaveLoation}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchPatient = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchPatient, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveSentFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveSentFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMRDSentfilestatus = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMRDSentfilestatus, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMRDRequisitionSearch = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMRDRequisitionSearch, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveMRDRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveMRDRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSaveMRDReturnFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.SaveMRDReturnFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDGetFileStatus = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDGetFileStatus, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDMLCDetailUpdate = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDMLCDetailUpdate, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDetails = async (TID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindDetails}?TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchMRDRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchMRDRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDApprovedRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDApprovedRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchRequisition = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchRequisition, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSearchIssueFile = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSearchIssueFile, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindPatientDetails = async (TransactionID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientDetails}?TransactionID=${TransactionID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindPatientDetail = async (TransactionID, PatientID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindPatientDetail}?TransactionID=${TransactionID}&PatientID=${PatientID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindFileDetail = async (TransactionID, PatientID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindFileDetailURL}?TransactionID=${TransactionID}&PatientID=${PatientID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const BindMRDRequisitionDetail = async (RequestedID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindRequisitionDetailURL}?RequestedID=${RequestedID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindFileDoc = async (TransactionID, FileID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindFileDocURL}?TransactionID=${TransactionID}&FileID=${FileID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDBindEmployeeAPI = async (RoleID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindEmployeeURL}?RoleID=${RoleID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const handleMRDFileIssueSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDFileIssueSaveURL}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const handleFileReturnSave = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDFileReturnSave}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const handleEnDisableSave = async (TransactionID, RequestID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.EnDisableSave}?TransactionID=${TransactionID}&RequestID=${RequestID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDSearch = async (PID, TID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDSearch}?PID=${PID}&TID=${TID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSavedocument = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSavedocument, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindDocumentlist = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(apiUrls?.MRDBindDocumentlist, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDEditDcouementName = async (documentID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDEditDcouementName}?documentID=${documentID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRoom = async () => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(apiUrls?.MRDBindRoom, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveNewRoom = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };

    const data = await makeApiRequest(apiUrls?.MRDSaveNewRoom, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindMRDRack = async (roomID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindMRDRack}?roomID=${roomID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDSaveNewRack = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.MRDSaveNewRack, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const MRDBindRackDetail = async (RackID) => {
  try {
    const option = {
      method: "get",
    };

    const data = await makeApiRequest(
      `${apiUrls?.MRDBindRackDetail}?RackID=${RackID}`,
      option
    );
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};



export const MRDBedOccupancyReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintBedOccupancyReport, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};
export const MRDPatientICDCodeReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintPatientICDCodeReport, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const  BindNABH = async () => {
  try {
    const option = {
      method: "get",
    };
    const response = await makeApiRequest(`${apiUrls?.BindNABH}`,
      option
    );
    return response;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};

export const PrintNBHReport = async (payload) => {
  try {
    const option = {
      method: "post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls?.PrintNBHReport, option);
    return data;
  } catch (error) {
    console.log(error, "SomeThing Went Wrong");
  }
};