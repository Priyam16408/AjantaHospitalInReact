import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const bindFieldList = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EmergencyAdmissionFeildSearchPatientDropDown}`,
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
export const bindEmergencyRoomType = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EmergencyAdmissionbindEmergencyRoomType}`,
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
export const bindEmergencyRoomBed = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EmergencyAdmissionBindAllRoomDetail}?caseType=${payload?.value}`,
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
export const SaveEmergencyAdmission = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.SaveEmergencyAdmission,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const EmergencyPatientSearchAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.EmergencyPatientSearch,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const SaveEmergencyServicesAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.SaveEmergencyServices,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const RelaseForIPDAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.EmergencyRelaseForIPD,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const getEmergencyBillItemDetails = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.getEmergencyBillItemDetails}?LTnxNo=${payload}`,
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

export const DischargePatientAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.EmergencyBtnDischarge_Click,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const shiftEmergencyBedAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.shiftEmergencyBed,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const BindItemMedicine = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.EmgBindItemMed,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const SaveEMGMedReq = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.SaveEMGMedReq,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const GetUrgencyLevelsReq = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.GetUrgencyLevelsReq,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const BindSubcategoryMedReq = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.BindSubcategoryMedReq,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const GetTimeRouteDurationMedReq = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            apiUrls.GetTimeRouteDurationMedReq,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const ViewEmgRequisition = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.ViewEmgRequisition}?transactionID=${payload}`,
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
export const getEmergencyPatientDetailsAPI = async (payload) => {
    store.dispatch(setLoading(true));

    try {
        const data = await makeApiRequest(
            `${apiUrls.getEmergencyPatientDetails}?EmergencyNo=${payload}`,
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
export const CheckClearanceAPI = async (payload, url) => {
    store.dispatch(setLoading(true));

    try {
        const data = await makeApiRequest(
            `${apiUrls[url]}?transactionId=${payload}`,
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
export const SaveClearanceAPI = async (payload, url) => {
    store.dispatch(setLoading(true));

    try {
        const data = await makeApiRequest(
            `${apiUrls[url]}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const BindInvestigationViewList = async (payload) => {
    store.dispatch(setLoading(true));

    try {
        const data = await makeApiRequest(
            `${apiUrls?.BindInvestigationViewListEMG}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const bindEmergencyBillingCtg = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.IPDDetailBillingCategory}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const shipttoIpdSaveEmg = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.ShiftToIPDEmg}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const LoadMedSetIndentMedAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.LoadMedSetIndentMedURL}?TID=${payload}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const SaveEmergencyVisitAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.SaveEmergencyVisitURL}`,
            {
                method: "POST",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const MedicineRequisitionGrdRequsition_RowCommand = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.MedicineRequisitionGrdRequsition_RowCommandURL}`,
            {
                method: "POST",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const EMGGetItemRateByType_ID = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EMGGetItemRateByType_IDURL}?${payload}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const handleSaveDialysisAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.handleSaveDialysisURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const bindDialysisFormListAPI = async (transactionid) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.bindDialysisFormListURL}?transactionid=${transactionid}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const dialysisFormDeleteAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.dialysisFormDeleteURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const bindDoctorCarePlanList = async (PID) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.bindDoctorCarePlanURL}?PID=${PID}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const SaveDoctorProgressNoteAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EMGSaveDoctorProgressNoteURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const getEmgBindBloodCategory = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.BloodBankGetCategoriesURL}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const getBloodGroupList = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.getBloodGroupURL}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const getBloodBankLoadItems = async () => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.getBloodBankLoadURl}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const GetEmergencyRate = async (params) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.GetEmergencyRateURL}?${params}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const getBloodBankList = async (params) => {


    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.BindRequestDetailsURL}?TransactionID=${params}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const BindItemStockDetailView = async (params) => {


    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.BindItemStockDetailURL}?ServiceRequestID=${params}`,
            {
                method: "get"
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const UpdateBloodgroupAPI = async (bloodGroup, patientID) => {
    let payload = {
        "bloodGroup": bloodGroup,
        "patientID": patientID
    }

    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.UpdateBloodgroup}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const handleBloodBankSaveAPI = async (payload) => {


    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.SaveBloodBankURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};

export const UpdatePanelEMGAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.UpdatePanelEMGURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
export const EmgRegReportApi = async (payload) => {
    store.dispatch(setLoading(true));
    try {
        const data = await makeApiRequest(
            `${apiUrls.EmgRegReportURL}`,
            {
                method: "post",
                data: payload
            }
        );

        store.dispatch(setLoading(false));
        return data;
    } catch (error) {
        store.dispatch(setLoading(false));
        throw error;
    }
};
