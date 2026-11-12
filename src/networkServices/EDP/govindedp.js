import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
import store from "../../store/store";
import { apiUrls } from "../apiEndpoints";
import makeApiRequest from "../axiosInstance";



export const BindJobType = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindJobType}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveJobType = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSaveJobType}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDepartmenttableinMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDepartmenttableinMaster}`, {
      method: "get",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDepartmentHead = async (deptID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDepartmentHead}?deptID=${deptID}`, {
      method: "GET",
      // data:deptID,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDocumentMaster = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDocumentMaster}`, {
      method: "GET",
      // data:deptID,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDocumentMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSaveDocumentMaster}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDesignationDocumentMap = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDesignationDocumentMap}`, {
      method: "GET",
      // data:payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDesignation = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDesignation}`, {
      method: "get",
      // data:payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDocumentForMap = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPBindDocumentForMap}`, {
      method: "get",
      // data:payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDesigDocMap = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSaveDesigDocMap}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPDeleteDocumentMap = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPDeleteDocumentMap}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDepartment = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPSaveDepartment}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetDepratmentHeadID = async (deptID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPGetDepratmentHeadID}?.deptID=${deptID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetRole = async (deptID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.EDPGetRole}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const GetCentreWithPanelGroupMappings = async (roleID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.GetCentreWithPanelGroupMappings}?roleID=${roleID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const BindDepartmentBelong = async (roleID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.BindDepartmentBelong}?.roleID=${roleID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveRoleWiseCentrePanelGroup = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveRoleWiseCentrePanelGroup}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const UpdateStatusmark = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.UpdateStatusmark}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDiscountReasonMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveDiscountReasonMaster}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBasicMasterSavePro = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBasicMasterSavePro}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindPro = async (Status) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPro}?Status=${Status}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindGrid = async (type) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindGrid}?Type=${type}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateDiscountReasonMaster = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateDiscountReasonMaster}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindMappedProDoctor = async (ProID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindMappedProDoctor}?ProID=${ProID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateMappedPRODoctor = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateMappedPRODoctor}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveMapPRoToDoctor = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveMapPRoToDoctor}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdatePRODetail = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdatePRODetail}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSearchMessage = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSearchMessage}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveMessage = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveMessage}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateMessage = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateMessage}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPThresholdLimitSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPThresholdLimitSave}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPThresholdLimitSearch = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPThresholdLimitSearch}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBillCancellationSearch = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBillCancellationSearch}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPCancelAdmitDischargeSearch = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPCancelAdmitDischargeSearch}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPCancelAdmitDischargeSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPCancelAdmitDischargeSave}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBillCancel = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBillCancel}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPAdmitDischUpdate = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPAdmitDischUpdate}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDischargeType = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindDischargeType}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPAdmitDischSearch = async (IPDNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPAdmitDischSearch}?IPDNo=${IPDNo}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindProcessStep = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindProcessStep}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateProcessStep = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateProcessStep}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPPaymentSearch = async (receiptNo) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPPaymentSearch}?receiptNo=${receiptNo}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindPaymentMode = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPaymentMode}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSavePaymentMode = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSavePaymentMode}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadPanel = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadPanel}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadDocument = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadDocument}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveDoc}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdatePanelForDocuments = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdatePanelForDocuments}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSavePanelDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSavePanelDoc}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSavePanelDocument = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSavePanelDocument}`, {
      method: "POST",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadDocumentDetail = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadDocumentDetail}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPEmailBindTemplate = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPEmailBindTemplate}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindRole = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindRole}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindPanel = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPanel}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindEmailDetails = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindEmailDetails}?templateId=${payload?.templateId}&roleId=${payload?.roleId}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindColumnField = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindColumnField}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPEmailTemplateType = async (templateId) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPEmailTemplateType}?templateId=${templateId}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindEmailId = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindEmailId}?id=${id}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetExitingOT = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPGetExitingOT}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPCreateOT = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPCreateOT}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveDoctorSlotAllocations = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveDoctorSlotAllocations}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetDoctorBookedSlots = async (DoctorID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPGetDoctorBookedSlots}?DoctorID=${DoctorID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetOTs = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPGetOTs}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindDocDepartment = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindDocDepartment}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPDoctorSetupSaveDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPDoctorSetupSaveDoc}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateDocDepartment = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateDocDepartment}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const OTGetOTSlots = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.OTGetOTSlots}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveRefDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveRefDoc}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPUpdateRefDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPUpdateRefDoc}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadRefDoc = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadRefDoc}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindOPdPackage = async (CardID) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindOPdPackage}?CardID=${CardID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetBindItem = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPGetBindItem}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};


export const EDPSaveData = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveData}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPSaveItemData = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveItemData}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPBindPkgCategory = async () => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPkgCategory}?configID=${"14"}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPBindPkgSubCategory = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPkgSubCategory}?configID=${"14"}&categoryID=${payload?.CategoryID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPBindIPDPackageMaster = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindIPDPackageMaster}?configID=${"14"}&categoryID=${payload?.CategoryID}&subCategoyrID=${payload?.subCategory}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};

export const EDPLoadPanelCompany = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadPanelCompany}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};


export const EDPLoadRoomType = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadRoomType}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindAllCategory = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindAllCategory}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindAllSubCategory = async (parms) => {
  const categoryID = encodeURIComponent(parms)
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindAllSubCategory}?categoryID=${categoryID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSavePackage = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSavePackage}`, {
      method: "POST",
      data: payload
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindPackageDetails = async (packageID) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindPackageDetails}?packageID=${packageID}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPBindAllItems = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPBindAllItems}`, {
      method: "post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPSaveLocation = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPSaveLocation}`, {
      method: "post",
      data: payload,
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPLoadLocationDetail = async () => {

  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls?.EDPLoadLocationDetail}`, {
      method: "GET",
    });

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const EDPGetStateByCountryID = async (payload) => {

  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPGetStateByCountryID}?countryID=${payload?.countryID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPDeleteState = async (StateID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "DELETE",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPDeleteState}?StateID=${StateID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPInsertState = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPInsertState}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPGetDistrictByCountryAndStateID = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPGetDistrictByCountryAndStateID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPDistrictInsert = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPDistrictInsert}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPDeleteDistrict = async (DistrictID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "DELETE",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPDeleteDistrict}?DistrictID=${DistrictID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPUpdateDistrict = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPUpdateDistrict}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPUpdateState = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPUpdateState}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));

  }
};
export const EDPGetCityByCountryStateDistrictID = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPGetCityByCountryStateDistrictID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPCityInsert = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPCityInsert}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPDeleteCity = async (CityID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "DELETE",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPDeleteCity}?CityID=${CityID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPUpdateCity = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload,
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPUpdateCity}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPBindEmployee = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPBindEmployee}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPApprDisMastSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPApprDisMastSave}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPPurchaseMangeApprBindEmployee = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPPurchaseMangeApprBindEmployee}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPPurchaseMangeApprBindListTable = async () => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPPurchaseMangeApprBindListTable}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPPurchaseMangeApprDelete = async (id) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "get",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPPurchaseMangeApprDelete}?id=${id}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPPurchaseMangeApprSave = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPPurchaseMangeApprSave}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};


export const EDPLoadEmployee = async (roleID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
      // data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPLoadEmployee}?roleID=${roleID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPIPDBillGenBindEmployee = async (roleID) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "GET",
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPIPDBillGenBindEmployee}?roleID=${roleID}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};
export const EDPSaveBillAuthorized = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const options = {
      method: "POST",
      data: payload
    };
    const data = await makeApiRequest(
      `${apiUrls.EDPSaveBillAuthorized}`,
      options
    );
    if (data.status === true) {
      notify(data.message, "success");
    }
    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
  }
};


