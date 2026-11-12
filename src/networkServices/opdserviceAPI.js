import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { notify } from "../utils/utils";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const Oldpatientsearch = async (searchKey, Type = 0) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.Oldpatientsearch}?SearchKey=${searchKey}&Type=${Type}`,
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

export const PatientSearchbyBarcode = async (PatientID, PatientRegStatus) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.PatientSearchbyBarcode}?PatientID=${PatientID}&PatientRegStatus=${PatientRegStatus}`,
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

export const SaveAdvanceAmount = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveAdvanceAmount}`, {
      method: "Post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const SaveInvItemCheckList = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveInvItemCheckList}`, {
      method: "Post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const bindPanelByPatientID = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.bindPanelByPatientID}?PatientId=${id}`,
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

export const getBindPanelListforchangedetails = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetPanelName}?PanelGroup=${"ALL"}`,
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
// export const getBindPanelListforchangedetails = async()=>{
// //  debugger
//   store.dispatch(setLoading(true));
//     try {
//       const data = await makeApiRequest(
//         `${apiUrls.GetPanelName}?PanelGroup=${"ALL"}`,
//         {
//           method: "get",
//         }
//       );
//       dispatch(setLoading(false));
//       return data;
//     } catch (e) {
//       store.dispatch(setLoading(false));
//     throw error;
//     }
//   }

// export const bindPanel = async (id) => {
//   store.dispatch(setLoading(true));
//   try {
//     const data = await makeApiRequest(
//       `${apiUrls.bindPanelByPatientID}`,
//       {
//         method: "get",
//       }
//     );
//     store.dispatch(setLoading(false));
//     return data;
//   } catch (error) {
//     store.dispatch(setLoading(false));
//     throw error;
//   }
// };
export const GetInvCheckListMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetInvCheckListMaster}`,
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

export const BindPRO = async (referDoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindPRO}?referDoctorID=${referDoctorID}`,
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

export const GetBindDoctorDept = async (Department) => {
  store.dispatch(setLoading(true));
  try {
    let centerID = useLocalStorage("userData", "get")
    const data = await makeApiRequest(
      `${apiUrls.BindDoctorDept}?Department=${encodeURIComponent(Department)}&CentreID=${centerID?.centreID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const GetBindDoctorforChangePatient = async (Department) => {
  store.dispatch(setLoading(true));
  try {
    let centerID = useLocalStorage("userData", "get")
    const data = await makeApiRequest(
      `${apiUrls.BindDoctorDept}?Department=${"All"}&CentreID=${centerID?.centreID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetRoleWiseOPDServiceBookingControls = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.RoleWiseOPDServiceBookingControls}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const GetLoadOPD_All_ItemsLabAutoComplete = async (payload) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.LoadOPD_All_ItemsLabAutoComplete}`,
      {
        method: "post",
        data: payload,
      }
    );


    return data?.data ? data : { ...data, data: [] };
  } catch {
    throw error;
  }
};

export const GetPackageExpirayDate = async (PackageID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.PackageExpirayDate}?PackageID=${PackageID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetValidateDoctorMap = async (itemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.ValidateDoctorMap}?itemID=${itemID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetValidateDoctorLeave = async (itemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.ValidateDoctorLeave}?itemID=${itemID}`,
      {
        method: "get",
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAlreadyPrescribeItem = async (PatientID, ItemID) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.getAlreadyPrescribeItem}?PatientID=${PatientID}&ItemID=${ItemID}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetDiscountWithCoPay = async (
  itemID,
  panelID,
  patientTypeID,
  memberShipCardNo
) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetDiscountWithCoPay}?itemID=${itemID}&panelID=${panelID}&patientTypeID=${patientTypeID}&memberShipCardNo=${memberShipCardNo}`,
      {
        method: "get",
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetBindLabInvestigationRate = async (
  panelID,
  itemID,
  CategoryID,
  IsInternational,
  TID,
  IPDCaseTypeID,
  panelCurrencyFactor
) => {
  try {
    const data = await makeApiRequest(apiUrls.BindLabInvestigationRate, {
      method: "post",
      data: {
        panelID: panelID,
        itemID: itemID,
        CategoryID: CategoryID,
        IsInternational: IsInternational,
        tid: TID,
        ipdCaseTypeID: IPDCaseTypeID,
        panelCurrencyFactor: panelCurrencyFactor,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAppointmentCount = async (doctorID, appointmentDate) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetAppointmentCount}?doctorID=${doctorID}&appointmentDate=${appointmentDate}`,
      {
        method: "get",
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
export const PackageDetail = async (LedgerTransactionNo) => {
  try {
    const data = await makeApiRequest(
      `${apiUrls.PackageDetail_report}?LedgerTransactionNo=${LedgerTransactionNo}`,
      {
        method: "get",
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// export const SearchOPDBillsData = async (params) => {
//   try {
//     const options = {
//       method: "POST",
//       data: params,
//     };
//     const data = await makeApiRequest(`${apiUrls.SearchOPDBills}`, {
//       method: "post",
//       data: params,
//     });
//     console.log("Asdasdas", data);
//     return data;
//   } catch {
//     throw error;
//   }
// };

export const SearchOPDBillsData = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(`${apiUrls.SearchOPDBills}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const SaveOPDSettlement = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(`${apiUrls.SaveOPDSettlement}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.error("Error Found", error);
  }
};

export const GetSwipMachine = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(`${apiUrls.GetSwipMachine}`, options);
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};

export const ReceiptDetailnew = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.GetReceiptDetailnew}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};
export const ReceiptBillClose = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: params,
    };
    const data = await makeApiRequest(
      `${apiUrls.OPDBillClosed}`,
      options
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log("Error Occure", error);
  }
};

export const GetDoctorAppointmentTimeSlotConsecutive = async (
  doctorID,
  appointmentDate
) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetDoctorAppointmentTimeSlotConsecutive}?DocId=${doctorID}&date=${appointmentDate}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindPackageItemDetailsNew = async (PackageID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindPackageItemDetailsNew}?PackageID=${PackageID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const GetInvestigationTimeSlot = async (
  Date,
  CentreID,
  SubCategoryID,
  ModalityID
) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetInvestigationTimeSlot}?Date=${Date}&CentreID=${CentreID}&SubCategoryID=${SubCategoryID}&ModalityID=${ModalityID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindModality = async (SubcategoryID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindModality}?SubcategoryID=${SubcategoryID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const HoldTimeSlot = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(apiUrls.HoldTimeSlot, {
      method: "post",
      data: params,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const GetEligiableDiscountPercent = async (employeeID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetEligiableDiscountPercent}?employeeID=${employeeID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const CheckblacklistAPI = async (PackageID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.checkblacklist}?patientID=AM24-04150003&molbileno=2342342344`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const GetDiscReasonList = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetDiscReason}?Type=${type}`, {
      method: "get",
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const BindDisApprovalList = async (HOSPITAL, type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.BindDisApproval}?approvalType=${HOSPITAL}&type=${type}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const BindInvestigation = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(apiUrls.BindInvestigation, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const GetLastVisitDetail = async (PatientID, DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetLastVisitDetail}?PatientID=${PatientID}&DoctorID=${DoctorID}  `,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const LastVisitDetails = async (PatientID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.LastVisitDetails}?patientID=${PatientID}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const bindHashCode = async () => {
  try {
    const data = await makeApiRequest(`${apiUrls.bindHashCode}`, {
      method: "get",
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};

export const SaveCreditDebitDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveCreditDebitDetails}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const SaveLabPrescriptionOPD = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SaveLabPrescriptionOPD}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const StickerPrintVisitWiseReport = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.StickerPrintVisitWiseReport}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const SavePharmacyIssueApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.SavePharmacyIssue}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const GetPendingResultEntryPdfApi = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.PrintResultEntryPendingList}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const OPDGetChangeBillDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.OPDGetChangeBillDetails}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const OPDUpdateBillDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.OPDUpdateBillDetails}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const ChangeTransactionalPanel = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.ChangeTransactionalPanel}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const ChangePatientRelationDetail = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.ChangePatientRelationDetail}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};
export const OPDPatientRelationDetail = async (TransactionId) => {
  try {
    const data = await makeApiRequest(`${apiUrls.OPDPatientRelationDetail}?TransactionId=${TransactionId}`, {
      method: "get",
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};
export const OPDChangeTransactionalDoctor = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.OPDChangeTransactionalDoctor}`, {
      method: "post",
      data: payload,
    });
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.log(error, "error");
    store.dispatch(setLoading(false));
  }
};

export const OPDDoctorConsulationData = async (doctorID) => {
  try {
    const data = await makeApiRequest(`${apiUrls.OPDDoctorConsulationData}?DoctorID=${doctorID}`, {
      method: "get",
    });

    return data;
  } catch (error) {
    console.log(error, "error");
  }
};




export const OPDGetIsFollowUpExist = async (PatientID, DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.OPDGetIsFollowUpExist}?DoctorID=${DoctorID}&PatientID=${PatientID}  `,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};


export const CheckPanelWiseRate = async (PanelID, LedgerTransactionNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.OPDCheckPanelWiseRate}?PanelID=${PanelID}&LedgerTransactionNo=${LedgerTransactionNo}  `,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const OPDCheckDoctorWiseRate = async (DoctorID, LedgerTransactionNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.OPDCheckDoctorWiseRate}?DoctorID=${DoctorID}&LedgerTransactionNo=${LedgerTransactionNo}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};
export const CommonAPIBindOPDAdvanceMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      apiUrls.CommonAPIBindOPDAdvanceMaster,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};

export const GetOpdPackageDetail = async (PackageId , LedgerTransactionNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(
      `${apiUrls.GetOpdPackageDetail}?PackageId=${PackageId}&LedgerTransactionNo=${LedgerTransactionNo}`,
      {
        method: "get",
      }
    );
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    console.log(error, "error");
  }
};