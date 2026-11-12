import { apiUrls } from "./apiEndpoints";
import makeApiRequest from "./axiosInstance";
import { setLoading } from "../store/reducers/loadingSlice/loadingSlice";
import store from "../store/store";

export const BindItemGRN = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetItemList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindGST = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetTaxGroups, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindManufacturer = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetManufacturer, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

//Gate Entry 
export const GateEntryBindGateEntryItems = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntryBindGateEntryItems, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveGateEntry = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntrySaveGateEntry, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GateEntryUserValidate = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntryUserValidate, {
      method: "get",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GateEntrySearchGetEntry = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.EDPGateEntrySearchGetEntry, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GateEntryGetPurchaseOrders = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntryGetPurchaseOrders, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GateEntryReport = async (payload) => {
  try {
    store.dispatch(setLoading(true));
    const data = await makeApiRequest(apiUrls.GateEntryGateEntryGateEntryReport, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
  finally{
    store.dispatch(setLoading(false));
  }
};

export const BindGateEntryItems = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntryBindGateEntryItems, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const UpdateGateEntry = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GateEntryUpdateGateEntry, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SaveGRN = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveGRN, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const UpdateGRN = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.UpdateGRN, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const DirectGRNReport = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.DirectGRNReport, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GetGRNList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetGRNList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const updateInvoiceDetails = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.updateInvoiceDetails, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GRNPost = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GRNPost, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GRNReject = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GRNReject, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindGRNItems = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BindGRNItems, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const ReprintGRN = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ReprintGRN, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetDepartmentDetails = async (payload) => {
  store.dispatch(setLoading(true));
  const { searchKey, deptLedgerNo } = payload;
  try {
    const data = await makeApiRequest(
      `${apiUrls.LoadStock}?SearchType=${searchKey}&deptLedgerNo=${deptLedgerNo}`,
      {
        method: "get",
        data: { searchKey, deptLedgerNo }
      }
    );

    store.dispatch(setLoading(false));
    return data;
  } catch (error) {
    store.dispatch(setLoading(false));
    throw error;
  }
};
export const BindVendor = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BindVendor, {
      method: "get",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const ConsumeBindItem = async (ConfigID, Dept) => {
  try {
    const url = `${apiUrls.ConsumeBindItem}?ConfigID=${ConfigID}&Dept=${Dept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ShowStock = async (ItemID, DeptLedNo) => {
  try {
    const url = `${apiUrls.ShowStock}?ItemID=${ItemID}&DeptLedNo=${DeptLedNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindStock = async (ItemID, DeptLedNo) => {
  try {
    const url = `${apiUrls.BindStock}?ItemID=${ItemID}&DeptLedNo=${DeptLedNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveConsume = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveConsume, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SearchStock = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SearchStock, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetDataToFill = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetDataToFill, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const StockTakeSaveData = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.StockTakeSaveData, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SearchDetail = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SearchDetail, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const BindSubGroup = async (StorLedgerNo) => {
  try {
    const url = `${apiUrls.BindSubGroup}?StorLedgerNo=${StorLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const View = async (Dept, IndentNo) => {
  try {
    const url = `${apiUrls.View}?Dept=${Dept}&IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ViewDetail = async (Status, IndentNo) => {
  try {
    const url = `${apiUrls.ViewDetail}?Status=${Status}&IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const PrintIssue = async (IndentNo, ReportType) => {
  try {
    const url = `${apiUrls.PrintIssue}?IndentNo=${IndentNo}&ReportType=${2}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveIssueDepartment = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveIssueDepartment, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetStockItem = async (ItemID, DeptNo) => {
  try {
    const url = `${apiUrls.GetStockItem}?ItemID=${ItemID}&DeptNo=${DeptNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const ViewRequisition = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ViewRequisition, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const ViewIndent = async (IndentNo, Status, Type, TID) => {
  try {
    const url = `${apiUrls.ViewIndent}?IndentNo=${IndentNo}&Status=${Status},&Type=${Type}&TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const Reject = async (RejectResion, ItemID, IndentNo) => {
  try {
    const url = `${apiUrls.Reject}?RejectResion=${RejectResion}&ItemID=${ItemID}&IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const Approve = async (IndentNo) => {
  try {
    const url = `${apiUrls.Approve}?IndentNo=${IndentNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const PrintRequisition = async (IndentNo, Status, Type) => {
  try {
    const url = `${apiUrls.PrintRequisition}?IndentNo=${IndentNo}&Status=${Status}&Type=${Type}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindPhysicalData = async (StoreLedgerNo) => {
  try {
    const url = `${apiUrls.BindPhysicalData}?StoreLedgerNo=${StoreLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GridView1_RowCommand = async (EntryNo, Type, StoreType) => {
  try {
    const url = `${apiUrls.GridView1_RowCommand}?EntryNo=${EntryNo}&Type=${Type}&StoreType=${StoreType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindMedicineStoreDepartment = async (DeptID) => {
  try {
    const url = `${apiUrls.BindMedicineStoreDepartment}?DeptID=${DeptID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindStoreGroup = async (DeptLedgerNo) => {
  try {
    const url = `${apiUrls.BindStoreGroup}?DeptLedgerNo=${DeptLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindStoreSubCategory = async (CategoryID) => {
  try {
    const url = `${apiUrls.BindStoreSubCategory}?CategoryID=${CategoryID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindStoreItems = async (Subcategory, ItemName) => {
  try {
    const url = `${apiUrls.BindStoreItems}?Subcategory=${Subcategory}&ItemName=${ItemName}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const IssueDetail = async () => {
  try {
    const url = `${apiUrls.IssueDetail}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindUser = async () => {
  try {
    const url = `${apiUrls.BindUser}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSearchSalesItem = async () => {
  try {
    const url = `${apiUrls.BindSearchSalesItem}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchSales = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SearchSales, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const StoreCommonReceiptPdf = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.StoreCommonReceiptPdf}`, {
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

export const BindItemForLabelPrint = async (LedgerTnxID) => {
  try {
    const url = `${apiUrls.BindItemForLabelPrint}?LedgerTnxID=${LedgerTnxID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetConsignmentList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetConsignmentList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindConsignmentItemList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BindConsignmentItemList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const ReportDetail = async (payload) => {
  store.dispatch(setLoading(true));
  try {
    const data = await makeApiRequest(`${apiUrls.ReportDetail}`, {
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

export const LoadStock = async (DeptLedgerNo) => {
  try {
    const url = `${apiUrls.LoadStock}?DeptLedgerNo=${DeptLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SearchItem = async (DeptLedgerNo, ItemID) => {
  try {
    const url = `${apiUrls.SearchItem}?DeptLedgerNo=${DeptLedgerNo}&ItemID=${ItemID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const getBindDetails = async (status, TID, Type, Dept) => {
  try {
    const url = `${apiUrls.getBindDetails}?status=${status}&TID=${TID}&Type=${Type}&Dept=${Dept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const medViewRequisition = async (IndentNo, TID) => {
  try {
    const url = `${apiUrls.medViewRequisition}?IndentNo=${IndentNo}&TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ConsignmentPost = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentPost, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const ConsignmentCancelAll = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentCancelAll, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const ConsignmentRejectItem = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentRejectItem, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GetConsignmentEditDetails = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetConsignmentEditDetails, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveDirectMedicalIssue = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveDirectMedicalIssue, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const FromDepartment = async (StoreLedgerNo) => {
  try {
    const url = `${apiUrls.FromDepartment}?StoreLedgerNo=${StoreLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const ReturnBindItem = async (Dept, StoreType, FromDept) => {
  console.log("Dept", Dept, "StoreType", StoreType, "FromDept", FromDept);
  try {
    const url = `${apiUrls.ReturnBindItem}?Dept=${Dept}&StoreType=${StoreType}&FromDept=${FromDept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchDirectDepartment = async (payload) => {
  try {
    const url = `${apiUrls.SearchDirectDepartment}?FromDate=${payload?.FromDate}&ToDate=${payload?.ToDate}&SalesNo=${payload?.SalesNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchDepartmet = async (ItemID, StoreType, FromDept, Dept) => {
  try {
    const url = `${apiUrls.SearchDepartmet}?ItemID=${ItemID}&StoreType=${StoreType}&FromDept=${FromDept}&Dept=${Dept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BarCode = async (Dept, StockID) => {
  try {
    const url = `${apiUrls.BarCode}?Dept=${Dept}&StockID=${StockID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ReturnBindVendor = async (StoreType) => {
  try {
    const url = `${apiUrls.ReturnBindVendor}?StoreType=${StoreType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveFromDepartment = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveFromDepartment, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const PatientReturnReport = async (SalesNo, Dept) => {
  try {
    const url = `${apiUrls.PatientReturnReport}?SalesNo=${SalesNo}&Dept=${Dept}&ReportType=${2}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ConsignmentStockItemList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentStockItemList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const AddItemList = async (ItemId) => {
  try {
    const url = `${apiUrls.AddConsignmentStockItemList}?ItemId=${ItemId}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SaveConsignment = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveConsignmentStockTransfer, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindConsignmentVendorList = async (ItemId) => {
  try {
    const url = `${apiUrls.BindConsignmentVendorList}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ConsignmentReturnSearchList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentReturnSearchList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveConsignmentItemReturnList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveConsignmentItemReturnList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const ConsignmentReturnPrint = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentReturnPrint, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const PatientSearchList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.PatientSearchList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindPatientDetailsList = async (TransactionID, PName) => {
  try {
    const url = `${apiUrls.BindPatientDetailsList}?TransactionID=${TransactionID}&PatientID=${PName}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ConsignmentReceivePrint = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentReceivePrint, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindItemSupplair = async (StoreType) => {
  try {
    const url = `${apiUrls.BindItemSupplair}?StoreType=${StoreType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SearchSupplair = async (ReturnOn, ItemID) => {
    store.dispatch(setLoading(true));
  try {
    const url = `${apiUrls.SearchSupplair}?ReturnOn=${ReturnOn}&ItemID=${ItemID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
  store.dispatch(setLoading(false));
    return data;
  } catch (error) {
  store.dispatch(setLoading(false));
    throw error;
  }
};

export const SaveSupplair = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveSupplair, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveRGP = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.RGPSaveRGP, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const consignmentReturnSearch = async (TransNo, PatientName, Dept) => {
  try {
    const url = `${apiUrls.consignmentReturnSearch}?TransNo=${TransNo}&PatientName=${PatientName}&Dept=${Dept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ConsignmentBindItem = async (TID) => {
  try {
    const url = `${apiUrls.ConsignmentBindItem}?TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindPatientReturn = async (TID) => {
  try {
    const url = `${apiUrls.BindPatientReturn}?TID=${TID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ReturnItem = async (TID, ItemID) => {
  try {
    const url = `${apiUrls.ReturnItem}?TID=${TID}&ItemID=${ItemID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const MasterSearchItem = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.MasterSearchItem, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const ConsignmentSave = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ConsignmentSave, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveManufacture = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveManufacture, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveVendor = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveVendor, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const UpdateVendor = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.UpdateVendor, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindTerms = async () => {
  try {
    const url = `${apiUrls.BindTerms}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const VendorReportList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.VendorForExcelReport, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const ItemMasterBindGroup = async (
  IsAsset,
  CategoryId,
  CategoryName
) => {
  try {
    const url = `${apiUrls.ItemMasterBindGroup}?IsAsset=${IsAsset}&CategoryId=${CategoryId}&CategoryName=${CategoryName}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindManufactureData = async (IsAsset) => {
  try {
    const url = `${apiUrls.BindManufactureData}?IsAsset=${IsAsset}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSaltItem = async (ItemID) => {
  try {
    const url = `${apiUrls.BindSaltItem}?ItemID=${ItemID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
// export const GetPurchaseOrders = async (StoreType,purchaseOrderFromDate,purchaseOrderToDate,purchaseOrderNumber,vendorID) => {
//   try {
//     const url = `${apiUrls.GetPurchaseOrders}?StoreType=${StoreType}&purchaseOrderFromDate=${purchaseOrderFromDate}&purchaseOrderToDate=${purchaseOrderToDate}&purchaseOrderNumber=${purchaseOrderNumber}&vendorID=${vendorID}`;
//     const data = await makeApiRequest(url, {
//       method: "get",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const GetPurchaseOrders = async (
  StoreType,
  purchaseOrderFromDate,
  purchaseOrderToDate,
  purchaseOrderNumber,
  vendorID
) => {
  try {
    let queryParams = new URLSearchParams({
      StoreType,
      purchaseOrderFromDate,
      purchaseOrderToDate,
    });
    if (purchaseOrderNumber) {
      queryParams.append("purchaseOrderNumber", purchaseOrderNumber);
    }
    if (vendorID) {
      queryParams.append("vendorID", vendorID);
    }

    const url = `${apiUrls.GetPurchaseOrders}?${queryParams.toString()}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const BindVatType = async () => {
  try {
    const url = `${apiUrls.BindVatType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindVatLine = async () => {
  try {
    const url = `${apiUrls.BindVatLine}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSaleVatType = async (IsAsset) => {
  try {
    const url = `${apiUrls.BindSaleVatType}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindSaleVatLine = async () => {
  try {
    const url = `${apiUrls.BindSaleVatLine}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindDrugCategoryMaster = async () => {
  try {
    const url = `${apiUrls.BindDrugCategoryMaster}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindMajorUnit = async () => {
  try {
    const url = `${apiUrls.BindMajorUnit}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindMinorUnit = async () => {
  try {
    const url = `${apiUrls.BindMinorUnit}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindServiceItems = async () => {
  try {
    const url = `${apiUrls.BindServiceItems}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const Bind_Active_salt = async () => {
  try {
    const url = `${apiUrls.Bind_Active_salt}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const viewItem = async (IndentNo, Status) => {
  try {
    const url = `${apiUrls.viewItem}?IndentNo=${IndentNo}&Status=${Status}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SearchVendor = async (SupplierName) => {
  try {
    const url = `${apiUrls.SearchVendor}?SupplierName=${SupplierName}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetItemNameList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.BindInventoryGrid, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const ManufactureReportList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls?.ManufactureReportList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const UpdateManufacture = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.UpdateManufacture, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveNewItem = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveNewItem, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const BindGeneric = async (params) => {
  store.dispatch(setLoading(true));
  try {
    const queryData = params?.event?.query;

    const urlWithParams = `${apiUrls.BindGeneric}?SearchType=${queryData}`;

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

export const SaveGenericEdit = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveGenericEdit, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const AddNewGeneric = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.AddNewGeneric, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const SearchGenericItem = async (payload) => {

//   try {
//     console.log("Payload" , payload)
//     const SearchType = payload?.SearchType;
//     const url = `${apiUrls.SearchGenericItem}?SearchType=${SearchType}`;
//     console.log("urls",url)
//     const data = await makeApiRequest(url, {
//       method: "get",
//     });
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const SearchGenericItem = async (params) => {
  store.dispatch(setLoading(true));

  try {
    const querydata = params?.event?.query;

    const urlWithParams = `${apiUrls.SearchGenericItem}?SearchType=${querydata}`;

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

export const BindUnitMaster = async () => {
  try {
    const url = `${apiUrls.BindUnitMaster}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const BindItemIdList = async (itemId) => {
  try {
    const url = `${apiUrls.BindItemIdList}?itemId=${itemId}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveGeneric = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveGeneric, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GenericDeleteitem = async (itemId, saltid) => {
  try {
    const url = `${apiUrls.GenericDeleteitem}?itemId=${itemId}&saltid=${saltid}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const ReportList = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.ReportList, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GenericReportList = async (payload) => {
  console.log("Payload when in GenericReportLIst", payload?.reportTypeMajor)
  try {
    const data = await makeApiRequest(`${apiUrls.GenericReport}?ReportType=${payload?.reportTypeMajor} `, {
      method: "get",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const GetExpiryItems = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.GetExpiryItems, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SaveItemExpiry = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveItemExpiry, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const SearchChangeMRP = async (
  Dept,
  Subcategory,
  ItemID,
  Price,
  StoreLedgerNo
) => {
  try {
    const url = `${apiUrls.SearchChangeMRP}?Dept=${Dept}&Subcategory=${Subcategory}&ItemID=${ItemID}&Price=${Price}&StoreLedgerNo=${StoreLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const SaveChangeMRP = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveChangeMRP, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const BindToolItem = async (SubCategoryID, StoreLedgerNo) => {
  try {
    const url = `${apiUrls.BindToolItem}?SubCategoryID=${SubCategoryID}&StoreLedgerNo=${StoreLedgerNo}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SaveDepartmentWiseRack = async (payload) => {
  try {
    const data = await makeApiRequest(apiUrls.SaveDepartmentWiseRack, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const BindDepartmentItemIssueToDept = async () => {
  try {
    const url = `${apiUrls.BindDepartmentItemIssueToDept}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetPurchaseOrderItems = async (payload) => {
  try {
    const url = `${apiUrls.GetPurchaseOrderItems}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const BinduploadOpeningBalanceControls = async (userValidateID) => {
  try {
    const url = `${apiUrls.BinduploadOpeningBalanceControls}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const BindReconciliationDetails = async (payload) => {
  try {
    const url = `${apiUrls.BindReconciliationDetails}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const BankReconciliationURL = async () => {
  try {
    const url = `${apiUrls.BankReconciliationURL}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const SearchVoucher = async ({ filterType, voucherNo }) => {
  try {
    const url = `${apiUrls.SearchVoucher}?filterType=${filterType}&voucherNo=${voucherNo}`;
    const data = await makeApiRequest(url, {
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const UpdateReconciliation = async (payload) => {
  try {
    const url = `${apiUrls.UpdateReconciliation}`;
    const data = await makeApiRequest(url, {
      method: "POST",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const GetBankChargesUploadExcel = async () => {
  try {
    const url = `${apiUrls.GetBankChargesUploadExcel}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const BalanceTransaferControls = async ({ CentreID }) => {
  try {
    const url = `${apiUrls.BalanceTransaferControls}?centreID=${CentreID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const GetBankReconciliationExcel = async () => {
  try {
    const url = `${apiUrls.GetBankReconciliationExcel}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const GetBalanceToTransafer = async (payload) => {
  try {
    const url = `${apiUrls.GetBalanceToTransafer}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const UploadBalanceTransfer = async (payload) => {
  try {
    const url = `${apiUrls.UploadBalanceTransfer}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const SearchAccountBookReport = async (payload) => {
  try {
    const url = `${apiUrls.SearchAccountBookReport}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const GetOpeningBalanceToUpload = async (payload) => {
  try {
    const url = `${apiUrls.GetOpeningBalanceToUpload}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}


export const GetOpeningBalanceExcell = async (payload) => {
  try {
    const url = `${apiUrls.GetOpeningBalanceExcell}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}
export const SaveOpeningBalance = async (payload) => {
  try {
    const url = `${apiUrls.SaveOpeningBalance}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const NabhManualGetNabhDetail = async () => {
  try {
    const url = `${apiUrls.NabhManualGetNabhDetail}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
}
//store item master 

export const ItemMasterBindDetail = async (TypeId) => {
  try {
    const url = `${apiUrls.ItemMasterBindDetail}?TypeId=${TypeId}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const SearchGateEntryItem = async (payload) => {
  try {
    const url = `${apiUrls.SearchGateEntryItem}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GateEntryViewDetailGRNItem = async (GateNo) => {
  store.dispatch(setLoading(true));
  
  try {
    const data = await makeApiRequest(
      `${apiUrls.GateEntryViewDetailGRNItem}?GateNo=${GateNo}`,
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

export const GateEntryGRNPost = async (payload) => {
  try {
    const url = `${apiUrls.GateEntryGRNPost}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GateEntryPostToGRN = async (payload) => {
  try {
    const url = `${apiUrls.GateEntryPostToGRN}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const GateEntryGRNUnPost = async (payload) => {
  try {
    const url = `${apiUrls.GateEntryGRNUnPost}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GRNCancel = async (payload) => {
  try {
    const url = `${apiUrls.GRNCancel}`;
    const data = await makeApiRequest(url, {
      method: "post",
      data: payload
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GRNSameStateBuyierSupplier = async (VendorID) => {
  try {
    const url = `${apiUrls.GRNSameStateBuyierSupplier}?VendorID=${VendorID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetDrugFormularyPdf = async (ID) => {
  try {
    const url = `${apiUrls.GetDrugFormularyPdf}?ID=${ID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetDrugFormulary = async (ID) => {
  try {
    const url = `${apiUrls.GetDrugFormulary}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const NabhManualGetNabhpdf = async (ID) => {
  try {
    const url = `${apiUrls.NabhManualGetNabhpdf}?ID=${ID}`;
    const data = await makeApiRequest(url, {
      method: "get",
    });
    return data;
  } catch (error) {
    throw error;
  }
};