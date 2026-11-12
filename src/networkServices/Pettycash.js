 
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";
import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

// PettyCashAccessMaster Controller start here 

 // Bind Main Center Controller
export const BindMainCenter = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "get",
      };
      const data = await makeApiRequest(`${apiUrls.BindMainCenter}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };


// BindBackendData
 



export const BindBackendData = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.BindBackendData}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 

//   Save Controller 

  export const AccessMasterSaveMapping = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.AccessMasterSaveMapping}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 
   

  // PettyCashDeptRequest Controller Start here 

  // getSessionDate ,getCurrencyConversionFactor


  // export const GetSessionDate = async (params) => {
  //   store.dispatch(setLoading(true));
  //   try {
  //     const options = {
  //       method: "get",
  //     };
  //     const data = await makeApiRequest(`${apiUrls.getSessionDate}`, options);
  //     store.dispatch(setLoading(false));
  //     return data;
  //   } catch (error) {
  //     store.dispatch(setLoading(false));
  //     console.error("Error Found", error); 
  //   }
  // };


  
  export const GetSessionDate = async (params) => {
    store.dispatch(setLoading(true));
  
    try { 
      // const urlWithParams = `${apiUrls.DisplayWardData}?${params}`;
      const urlWithParams = `${apiUrls.getSessionDate}?voucherDate=${params}`;
  
      const options = {
        method: "GET",
      };
  
      const data = await makeApiRequest(urlWithParams, options);
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };

  export const GetCurrencyConversionFactors = async (currencyCode, voucherDate) => {
    store.dispatch(setLoading(true));
  
    try { 
      // Construct the URL with multiple query parameters
      const urlWithParams = `${apiUrls.getCurrencyConversionFactor}?currencyCode=${currencyCode}&voucherDate=${voucherDate}`;
      const options = {
        method: "GET",
      };
  
      const data = await makeApiRequest(urlWithParams, options);
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };
  

  

  // export const GetCurrencyConversionFactosr = async (params) => {
  //   store.dispatch(setLoading(true));
  //   try {
  //     const options = {
  //       method: "get",
  //     };
  //     const data = await makeApiRequest(`${apiUrls.getCurrencyConversionFactor}`, options);
  //     store.dispatch(setLoading(false));
  //     return data;
  //   } catch (error) {
  //     store.dispatch(setLoading(false));
  //     console.error("Error Found", error); 
  //   }
  // };


  // bindVoucherBillingScreenControls


  export const bindVoucherBillingScreenControls = async (params) => {
    store.dispatch(setLoading(true));
  
    try { 
      // const urlWithParams = `${apiUrls.DisplayWardData}?${params}`;
      const urlWithParams = `${apiUrls.bindVoucherBillingScreenControls}?filterType=${params}`;
  
      const options = {
        method: "GET",
      };
  
      const data = await makeApiRequest(urlWithParams, options);
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };



  // GetCOACurrentClosingBalance

  export const GetCOACurrentClosingBalance = async (coaID,centreID) => {
    store.dispatch(setLoading(true));

    try {   
      const urlWithParams = `${apiUrls.GetCOACurrentClosingBalance}?coaID=${coaID}`;
      const options = {
        method: "GET",
      };
  
      const data = await makeApiRequest(urlWithParams, options);
  
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error);
    }
  };
  
  // SavePCDeptRequest


  export const SavePCDeptRequest = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SavePCDeptRequest}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 


  export const SearchPettyCashRequest = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SearchPettyCashRequest}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 


  export const UpdateRequestStatus = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.UpdateRequestStatus}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 
  

  export const SearchPendingPettyCashRequest = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SearchPendingPettyCashRequest}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 

 

  export const SavePCRequestApproval = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SavePCRequestApproval}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 
  


  export const searchPendingPettyCashApproval = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.searchPendingPettyCashApproval}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 


  
  export const updatePettyCashApprovalStatus = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.updatePettyCashApprovalStatus}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 

  
  // Save Petty Cash Entry Controller 

  export const SavePCEntry = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.SavePCEntry}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  }; 

  // Search Petty Cash Entry searchPettyCashEntry Controller 

  export const searchPettyCashEntry = async (params) => {
    store.dispatch(setLoading(true));
    try {
      const options = {
        method: "POST",
        data: params,
      };
      const data = await makeApiRequest(`${apiUrls.searchPettyCashEntry}`, options);
      store.dispatch(setLoading(false));
      return data;
    } catch (error) {
      store.dispatch(setLoading(false));
      console.error("Error Found", error); 
    }
  };  


    // Update Petty Cash Entry updatePettyCashEntryStatus Controller 

    export const updatePettyCashEntryStatus = async (params) => {
      store.dispatch(setLoading(true));
      try {
        const options = {
          method: "POST",
          data: params,
        };
        const data = await makeApiRequest(`${apiUrls.updatePettyCashEntryStatus}`, options);
        store.dispatch(setLoading(false));
        return data;
      } catch (error) {
        store.dispatch(setLoading(false));
        console.error("Error Found", error); 
      }
    };  




    export const SearchPendingPettyCashApproval = async (params) => {
      store.dispatch(setLoading(true));
      try {
        const options = {
          method: "POST",
          data: params,
        };
        const data = await makeApiRequest(`${apiUrls.SearchPendingPettyCashApproval}`, options);
        store.dispatch(setLoading(false));
        return data;
      } catch (error) {
        store.dispatch(setLoading(false));
        console.error("Error Found", error); 
      }
    }; 


    

    export const UpdatePettyCashApprovalStatus = async (params) => {
      store.dispatch(setLoading(true));
      try {
        const options = {
          method: "POST",
          data: params,
        };
        const data = await makeApiRequest(`${apiUrls.UpdatePettyCashApprovalStatus}`, options);
        store.dispatch(setLoading(false));
        return data;
      } catch (error) {
        store.dispatch(setLoading(false));
        console.error("Error Found", error); 
      }
    }; 
  

     
  


   
  
  
   

   
 
  

   