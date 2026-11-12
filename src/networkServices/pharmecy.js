import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const GetPharmacyPatientDetail = async (searchKey) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyPatientURL}?SearchKey=${searchKey}`,
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
export const PharmacyMedicineItemSearch = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PHMedicineItemSearchURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
export const pharmecyAddItem = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyAddItemURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
export const AddItemByItemIDPharmecy = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyAddItemByItemIDURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
export const PharmacyClinicalTrialAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyClinicalTrialURL}${payload}`,
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
export const GetAllPendingIndentsPharmecy = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyGetAllPendingIndentsURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
export const bindFromDepartments = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.bindFromDepartmentsURL}?${payload}`,
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
export const PendingDraftListAPI = async () => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PendingDraftListURL}`,
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
export const BindItemDetailsAPI = async (URL,payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls[URL]}?${payload}`,
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
  export const getPatientIndentAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetPatientIndentLISTURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const SavePharmecyAPICall = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.SaveOPDPharmacyURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const DraftPharmecyAPICall = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyDraftBillURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const PharmacyOPDReturnSearch = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyOPDReturnSearch}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const PharmacyRejectIndentItem = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyRejectIndentItemURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const SaveReurnAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacySaveOPDReturnURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const SaveIPDReurnAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.SaveIPDReurnURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const PharmacySearchIPDReturn = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacySearchIPDReturnURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const PharmacyIPDReturnItemAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyIPDReturnItemURL}?TransactionNo=${payload}`,
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
  export const PharmacyInvoiceReport = async (TransID, SubcategoryID, Type) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.CurrentStockInvoiceURL}?TransID=${TransID}&SubcategoryID=${SubcategoryID}&Type=${Type}`,
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
  export const BindPharmacySubcategory = async () => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BindPharmacySubcategory}`,
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


  export const GetIPDSearchSalesAPI = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetIPDSearchSalesURL}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
  export const PharmacyBindDoseItem = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyBindDoseItemURL}`,
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
 

  export const BillGenerationSearchDetail = async (ipdno) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.BillGenerationSearchDetail}?IPDNo=${ipdno}`,
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
  

  

  export const GetDetailsAgainstRecieptNOApi = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.GetDetailsAgainstRecieptNO}?receiptNo=${payload}`,
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

  export const UpdatePaymentModeApi = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.UpdatePaymentMode}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };

  export const PharmacyBillReturnCredit = async (payload) => {
    store.dispatch(setLoading(true));
    try {
      const data = await makeApiRequest(
        `${apiUrls.PharmacyBillReturnCredit}`,
        {
          method: "post",
          data:payload
        }
      );
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      throw error;
    }
  };
