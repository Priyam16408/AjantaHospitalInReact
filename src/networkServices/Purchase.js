import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";

export const PurchaseBindCategory = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.QuotationGetCategories}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
export const PurchaseBindSubCategory = async (id) => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.QuotationGetSubCategories}?categoryid=${id}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
  
export const PurchaseGetTaxAmount = async (id) => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.QuotationGetTaxAmount}?itemID=${id}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  

export const PurchaseBindGetManufacturers = async () => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.QuotationGetManufacturers}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

export const  POApprovalMasterBindEmployee = async (centreID) => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.POApprovalMasterBindEmployee}?CentreID=${centreID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
export const PurchaseBindGetVendors = async () => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.QuotationGetVendors}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
export const PoMasterBindApprovalMaster = async () => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.POApprovalMasterBindApprovalMaster}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  

  export const PODeleteApprovalMaster = async (ID) => {
    try {
      const options = {
        method: "get",
       
      };
      const data = await makeApiRequest(
        `${apiUrls?.PODeleteApprovalMaster}?ID=${ID}`,
        options
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const POBindCategoryApprovalMaster = async () => {
    try {
      const options = {
        method: "get",
       
      };
      const data = await makeApiRequest(
        `${apiUrls?.POBindCategoryApprovalMaster}`,
        options
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


export const PurchaseBindAddItems = async (payload) => {

   
    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.QuotationAddItems}`,
        option
      );
     
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
export const POApprovalMasterSave = async (payload) => {

   
    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.POApprovalMasterSaveApprovalMaster}`,
        option
      );
     
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

export const PurchaseSearchQuotation= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.SearchQuotation}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
export const AddItems= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.AddItems}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
export const PurchaseSaveQuotation= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.SaveQuotation}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  


  export const PurchaseGetCurrencyFactor = async (id) => {


    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetCurrencyFactor}?currencyNotation=${id}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  

  export const PurchaseGetTaxGroup = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetTaxGroup}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  export const PurchaseSetDefault= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.QuotationSetDefault}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  
  export const QuotationGetPurchaseMarkUpPercent = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetPurchaseMarkUpPercent}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  // CreatePurchaseRequest Start


  export const PurchaGetBindAllCenter = async (storeID) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetBindAllCenter}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PurchaGetCategorysByStoreType = async (storeID) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetCategorysByStoreType}?storeID=${storeID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PurchaGetSubCategoryByCategory = async (categoryID) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetSubCategoryByCategory}?categoryID=${categoryID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const PurchaGetItemsByCategory = async (storeID) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetItemsByCategory}?storeID=${storeID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const PurchaGetDepartMent = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetDepartMent}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  // export const PurchaGetItemStockDetails = async (itemID) => {
  //   try {
  //     const option = {
  //       method: "get",
  //     };
  
  //     const data = await makeApiRequest(
  //       `${apiUrls?.GetItemStockDetails}?itemID${itemID}`,
  //       option
  //     );
  //     return data;
  //   } catch (error) {
  //     console.log(error, "SomeThing Went Wrong");
  //   }
  // };

  export const PurchaseGetItems = async (prifix,storeID) => {
    // console.log("getItempayload",payload);
    
    
    try {
      const option = {
        method: "get",
        // data: prifix,
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseGetItems}?storeID=${storeID}&itemtype=${1}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  // export const PurchaseGetItems = async (storeID,itemtype) => {
  //   try {
  //     const option = {
  //       method: "get",
  //     };
  
  //     const data = await makeApiRequest(
  //       `${apiUrls?.PurchaseGetItems}?storeID=${storeID}?&itemtype=${1}`,
  //       option
  //     );
  //     return data;
  //   } catch (error) {
  //     console.log(error, "SomeThing Went Wrong");
  //   }
  // };

  


  export const PurchaseRequestItems= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.GetAutoPurchaseRequestItems}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

 

  

  export const SavePurchaseRequest= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.SavePurchaseRequest}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };





  export const PurchaseGetItemStockDetails = async (ItemID,departmentLedgerID) => {
    try {
      const option = {
        method: "get",

      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetItemStockDetails}?itemID=${ItemID}&departmentLedgerID=${departmentLedgerID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
  export const GetPurchaseRequest= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.GetPurchaseRequest}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };



  export const OnEditPurchaseRequest = async (requestNo) => {
    try {
      const option = {
        method: "get",

      };
  
      const data = await makeApiRequest(
        `${apiUrls?.OnEditPurchaseRequest}?requestNo=${requestNo}`,
        // `${apiUrls?.OnEditPurchaseRequest}?departmentLedgerNo=${departmentLedgerNo}&requestNo=${requestNo}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };



  // CreatePurchaseRequest End

  // CreatePurchaseOrder Start
  
  export const CreatePurchaseOrderGetCategorys = async (storeID) => {
    try {
      const option = {
        method: "get",

      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseOrderGetCategorys}?storeID=${storeID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const GetPurchaseOrderItemDetailsTerms = async (payloadData) => {
    try {
      const option = {
        method: "get",

      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetPurchaseOrderItemDetailsTerms}?purchaseOrderNo=${payloadData}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  
  export const PurchaseOrderGetSubCategory = async (categoryID) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseOrderGetSubCategoryByCategory}?categoryID=${categoryID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const PurchaseOrderGetPOList= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseOrderGetPOList}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const OrderGetPurchaseItems= async (payload) => {

    try {
      const option = {
        method: "post",
        data:payload,
       
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseOrderGetPurchaseItems}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const CreatePurchaseOrderSave= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.CreatePurchaseOrderSave}`,
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const GetPORequest= async (payload) => {

    try {
      const option = {
        method: "get",
        // data: payload,
      };
      
      const data = await makeApiRequest(
      
        `${apiUrls?.CreatePOGetPurchaseRequests}?fromDate=${payload?.fromDate}&toDate=${payload.toDate}&storeType=${payload?.storeType}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const GetTermAndConditions= async (payload) => {

    try {
      const option = {
        method: "get",
        // data: payload,
      };
      
      const data = await makeApiRequest(
      
        `${apiUrls?.POGetTermAndConditions}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const GetPOpuchaseTermsAndConditon= async (payload) => {

    try {
      const option = {
        method: "get",
        // data: payload,
      };
      
      const data = await makeApiRequest(
      
        `${apiUrls?.GetPOpuchaseTermsAndConditon}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const GetPOByTermsandCondition= async (PONumber) => {

    try {
      const option = {
        method: "get",
        // data: payload,
      };
      
      const data = await makeApiRequest(
      
        `${apiUrls?.CreatePurchaseOrderGetPOByTermsandCondition}?PONumber=${PONumber}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  export const GetPurchaseRequestItems= async (payload) => {

    try {
      const option = {
        method: "post",
        data:payload
       
      };
      
      const data = await makeApiRequest(
       
        `${apiUrls?.GetPurchaseRequestItems}`,
        
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  
  export const OnEditGetPurchaseOrderItemDetails = async (orderNo,departmentLedgerID) => {
    try {
      const option = {
        method: "get",

      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GetPurchaseOrderItemDetails}?purchaseOrderNo=${orderNo}&departmentLedgerNo=${departmentLedgerID}`,
        // `${apiUrls?.OnEditPurchaseRequest}?departmentLedgerNo=${departmentLedgerNo}&requestNo=${requestNo}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  // CreatePurchaseOrder End


  //view purchase request start


  export const PurchaseBindGetItems = async () => {

    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.SearchPurchaseRequestBindItem}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  export const POSearchPRSummary= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.SearchPRSummary}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const ViewPurchaseOrderSearchPO= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.ViewPurchaseOrderSearchPO}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  

  export const PRBindEmployee = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.BindEmployee}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const getPOItemsDetails = async (PONumber) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.CreatePurchaseOrderGetPOItemsDetails}?PONumber=${PONumber}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PRBindLedger = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PRBindLedger}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PRGetPRDetailsByPRNo = async (PurchaseRequestNo) => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PRGetPRDetailsByPRNo}?PurchaseRequestNo=${PurchaseRequestNo}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  export const PRSearchPRDetailsPDF= async (payload) => {

    try {
      const option = {
        method: "post",
        data: payload,
      };
      
      const data = await makeApiRequest(
        `${apiUrls?.PRSearchPRDetails}`,
     
        option
      );
      
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  //view purchase request end

  //tools Start
  
  export const GRNGetStore = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GRNGetStore}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const GRNBindRequisitionType = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GRNBindRequisitionType}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const GRNGetVendor = async () => {
    try {
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GRNGetVendor}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const GRNSearch = async (payData) => {
    try {
      const option = {
        method: "post",
        data:payData
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.GRNSearch}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PRPOGRNBindItemapp = async (PRno) => {
    try {
      const option = {
        method: "get",
        // data:payData
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PRPOGRNAnalysisBindItemapp}?PRNo=${PRno}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const RNPOApprovalPOReport= async (payload) => {
   
    try {
      const option = {
        method: "post",
        data:payload
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseOrderApprovalPOReport}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const PReqGetPRDetailsReport= async (payload) => {
    try {
      const option = {
        method: "post",
        data:payload
      };
      const data = await makeApiRequest(
        `${apiUrls?.PRGetPRDetailsReport}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const ViewPurchaseOrderAddRemark= async (payload) => {
    try {
      const option = {
        method: "post",
        data:payload
      };
      const data = await makeApiRequest(
        `${apiUrls?.ViewPurchaseOrderAddRemark}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };


  export const PurchaseReport = async (payload) => {
    // console.log("Payload" , payload)
    try {
      const {CategoryID , SearchTyep , SubCategoryID , UserValidateID} = payload
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.PurchaseReportPrint}?CategoryID=${CategoryID}&SearchTyep=${SearchTyep}&SubCategory=${SubCategoryID}&UserValidateID=${UserValidateID}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  export const ViewPurchaseOrderBindPORemark = async (PONo) => {
    // console.log("Payload" , payload)
    try {
      // const {CategoryID , SearchTyep , SubCategoryID , UserValidateID} = payload
      const option = {
        method: "get",
      };
  
      const data = await makeApiRequest(
        `${apiUrls?.ViewPurchaseOrderBindPORemark}?PONo=${PONo}`,
        option
      );
      return data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };
  //tools end