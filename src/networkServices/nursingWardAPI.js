import moment from "moment";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

const ip = useLocalStorage("ip", "get");

export const BindAvailablenurse = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.bindAvailablenurse, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindFloor = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.BindFloorNurse, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindRoomType = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.RoomTypeNurse, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SearchAssignNurse = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: {
        centreID: 1,
        caseTypeID: payload?.RoomType?.value,
        floorID: payload?.Floor?.label === "ALL" ? "0" : payload?.Floor?.label,
      },
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.SearchNurse, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SaveNurseAssignment = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.SaveNurseAssignment, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SearchSampleCollection = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.SearchSampleCollectionWord,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SearchInvestigation = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.SearchInvestigation}?LedgerTransactionNo=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const GetBarcodeInfo = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(`${apiUrls.GetBarcodeInfo}`, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SampleCollectionDiagonsis = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.SampleCollectionDiagonsis}?transactionID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SaveSamplecollectionAPI = async (data) => {
  store.dispatch(setLoading(true));
  let payload = {
    data: data,
    ipAddress: ip,
  };
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.SaveSamplecollection, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SampleRejection = async (data) => {
  store.dispatch(setLoading(true));
  let payload = {
    ...data,
    ipAddress: ip,
  };
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.SampleRejection, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BindSampleType = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.BindSampleType}?LedgerTransactionNo=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Medication Reocrd
export const CategoryMedicationRecordNew = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.CategoryMedicationRecord}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicineTimes = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.MedicineTimes}`, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicineRoute = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.Route}`, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicineFreQuency = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.FreQuency}`, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BindMedicineGrid = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.BindMedicineGrid, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindMedicineDetail = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.BindMedicineDetail, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicineDetailsSave = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.MedicineDetailsSave, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const updateMedicineDetailAPI = async (data) => {
  store.dispatch(setLoading(true));

  let payload = {
    dose: data?.Dose ? data?.Dose : "",
    timing: data?.Timing?.value
      ? data?.Timing?.value
      : data?.Timing
        ? data?.Timing
        : "",
    duration: moment(new Date(data?.Duration)).format("yyyy-MM-DD"),
    updatedBy: data?.EName ? data?.EName : "",
    transactionID: data?.tid ? data?.tid : "",
    indentNo: data?.IndentNo ? data?.IndentNo : "",
    medicineID: data?.ItemID ? data?.ItemID : "",
  };

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.SaveDoseDetails, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const MedicineDetailsCancel = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.MedicineDetailsCancel, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SearchVitalSignChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.SearchVitalSignChart}?TID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SaveVitalSignChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveVitalSignChart}`, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const UpdateVitalSignChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateVitalSignChart}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SearchNursingProgress = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.SearchNursingProgress}?TransactionID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SaveNursingProgress = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.SaveNursingProgress}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const UpdateNursingProgress = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.UpdateClickNursingProgress}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const bindOxygenRecord = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.bindOxygenRecord}?TID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const bindOxygenData = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.bindOxygenData}?TID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const validateOxygenRecord = async (payload) => {
  let payloadData = {
    dateOn: payload.oxygenDateON,
    timeOn: payload?.timeOn,
    dateOff: payload.dateOff,
    timeOff: payload?.timeOff,
    NurseTimeOff: payload?.nurseTimeOff?.value
      ? payload?.nurseTimeOff?.value
      : "",
    fillTimeOn: 0,
  };
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payloadData,
    };
    const data = await makeApiRequest(apiUrls.validateOxygenRecord, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SaveOxygenRecord = async (payload) => {
  store.dispatch(setLoading(true));
  payload.nurseTimeOn = payload.nurseTimeOn?.value;
  payload.nurseTimeOff = payload.nurseTimeOff?.value
    ? payload.nurseTimeOff?.value
    : "0";
  payload.typeOfTherapy = payload.typeOfTherapy?.value;
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.SaveOxygenRecord, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const UpdateOxygenRecord = async (payload) => {
  store.dispatch(setLoading(true));
  payload.nurseTimeOn = payload.nurseTimeOn?.value
    ? payload.nurseTimeOn?.value
    : payload.nurseTimeOn;
  payload.nurseTimeOff = payload.nurseTimeOff?.value
    ? payload.nurseTimeOff?.value
    : payload.nurseTimeOff;
  payload.typeOfTherapy = payload.typeOfTherapy?.value
    ? payload.typeOfTherapy?.value
    : payload.typeOfTherapy;

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.UpdateOxygenRecord, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const bindGasBloodChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.bindGasBloodChart}?TID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SaveBloodGasChart = async (payload) => {
  store.dispatch(setLoading(true));
  payload.date = moment(payload?.date).format("yyyy-MM-DD");
  payload.time = moment(payload?.time).format("HH:mm");

  delete payload.type;

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.BloodGasChartSave, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const UpdateBloodGasChart = async (payload) => {
  store.dispatch(setLoading(true));
  payload.date = moment(payload?.date).format("yyyy-MM-DD");
  payload.time = moment(payload?.time).format("HH:mm");
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(apiUrls.BloodGasChartUpdate, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BloodGasChartPrintOutAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: { tid: payload },
    };
    const data = await makeApiRequest(apiUrls.BloodGasChartPrintURL, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const PhysiologicalEarlyWarning = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.BindPhysiologicalEarlyWarning,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const BindPhysiologicalAssessmentList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.PhysiologicalSearchAssessmentData}?TID=${payload}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const PEWSChartPrintOutAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.PhysiologicalEWSPrint}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const SaveEarlyWarningScoringDetails = async (payload) => {
  store.dispatch(setLoading(true));

  try {
    const options = {
      method: "Post",
      data: payload,
    };
    const data = await makeApiRequest(
      apiUrls.SaveEarlyWarningScoringDetails,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BindDiabiaticParticular = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.BindDiabiaticParticular, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardDiabeticChartPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.DiabeticChartPrintURL, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const BindDiabiaticChart = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.BindDiabiaticChart}?TransactionID=${TransactionID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const DiabeticChartSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.DiabeticChartSave, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const DiabeticChartUpdate = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "put",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.DiabeticChartUpdate, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindData = async (TransID, Date) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.NursingWardBindData}?TransID=${TransID}&Date=${Date}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardIntakeOutPutChartPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "Post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.NursingWardIntakeOutPutChartPrintURL}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindDetails = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.NursingWardBindDetails}?TransactionID=${TransactionID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardNursingDischargeSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardNursingDischargeSave,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardNursingDischargeDeleting = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardNursingDischargeDeleting,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindNeedleName = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardBindNeedleName,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardNeedleInjurySave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardNeedleInjurySave,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindInjury = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.NursingWardBindInjury, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardNeedleInjuryPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardNeedleInjuryPrint,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindGraphTemp = async (transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.NursingWardBindGraphTemp}?TID=${transactionID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSerumBilirubinSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls.NursingWardSerumBilirubinSave,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveIntake = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(apiUrls.NursingWardSaveIntake, options);
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// baby chart

export const NursingWardGetBabyCharDetails = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls.NursingWardGetBabyCharDetails}?TID=${TransactionID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveBabyChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls?.NursingWardSaveBabyChart,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardBabyChartPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: { tid: payload },
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls?.NursingWardBabyChartPrintURL,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindPatientDetail = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      `${apiUrls?.NursingWardBindPatientDetail}?TID=${TID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveCheckList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls?.NursingWardSaveCheckList,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardDischargeCheckListPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls?.NursingWardDischargeCheckListPrintURL,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardUpdateCheckList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail
    const data = await makeApiRequest(
      apiUrls?.NursingWardUpdateCheckList,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Decreased Patient Details

export const NursingWardDeceasedSaveCheckList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardDeceasedSaveCheckList,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardDeceasedUpdateCheckList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardDeceasedUpdateCheckList,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindDeceasedPatientDetail = async (TID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.NursingWardBindDeceasedPatientDetail}?TID=${TID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// adult feel risk assessMent

export const NursingWardSaveAssessMentRecord = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardSaveAssessMentRecord,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSearchAssessmentData = async (transactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.NursingWardSearchAssessmentData}?TID=${transactionID}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardUpdateAssessMentRecord = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardUpdateAssessMentRecord,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const NursingWardAdultFallRiskPrintAPI = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardAdultFallRiskPrint,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardPatientDocumentDetail = async (TID, DocumentDate) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.NursingWardPatientDocumentDetail}?TID=${TID}&DocumentDate=${DocumentDate}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveViewUploadDocument = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardSaveViewUploadDocument,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardBindBabyFeeding = async (TID, Date) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.NursingWardBindBabyFeeding}?TID=${TID}&Date=${Date}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveBabyFeeding = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.NursingWardSaveBabyFeeding,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const SampleCollUploadDocument = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      apiUrls?.SampleCollUploadDocument,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const bindSampleColleDocumentList = async (LedgerTransactionNo) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.bindSampleColleDocumentURL}?LedgerTransactionNo=${LedgerTransactionNo}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const handleOpenDocumentAPI = async (fileUrl) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    // api call to load currency detail/
    const data = await makeApiRequest(
      `${apiUrls?.SampleCollOpenDocumentURL}?LedgerTransactionNo=${LedgerTransactionNo}`,
      options
    );
    return data;
  } catch (error) {
    console.error("Error Add Expense", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const PrintVitalSignChart = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    // api call to load currency detail/
    const data = await makeApiRequest(apiUrls?.PrintVitalSignChart, options);
    return data;
  } catch (error) {
    console.error("Error Add PrintVitalSignChart", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardSaveRoomShiftRequset = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    
    const data = await makeApiRequest(apiUrls?.NursingWardSaveRoomShiftRequset, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardSaveRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardRejectRoomShiftRequset = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    
    const data = await makeApiRequest(apiUrls?.NursingWardRejectRoomShiftRequset, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardRejectRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const NursingWardGetRoomShiftRequset = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const url = `${apiUrls.NursingWardGetRoomShiftRequset}?TransactionID=${TransactionID}`
    
    const data = await makeApiRequest(url, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardGetRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const saveMedicineTreatmentAndPrescriptionApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    
    const data = await makeApiRequest(apiUrls?.saveMedicineTreatmentAndPrescription, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardRejectRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};
export const getMedicineTreatmentAndPrescriptionApi = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const url = `${apiUrls.getMedicineTreatmentAndPrescription}?TransactionID=${TransactionID}`
    
    const data = await makeApiRequest(url, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardGetRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const saveNursingWardCrossConsultationsApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "post",
      data: payload,
    };
    
    const data = await makeApiRequest(apiUrls?.saveNursingWardCrossConsultations, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardRejectRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

export const getNursingWardCrossConsultationsApi = async (TransactionID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };

    const url = `${apiUrls.getNursingWardCrossConsultations}?TransactionID=${TransactionID}`
    
    const data = await makeApiRequest(url, options);
    return data;
  } catch (error) {
    console.error("Error Add NursingWardGetRoomShiftRequset", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};