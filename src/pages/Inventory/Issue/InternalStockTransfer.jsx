import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { GetStore } from "../../../networkServices/BillingsApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getEmployeeWise } from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import moment from "moment";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  BindDepartmentItemIssueToDept,
  BindSubGroup,
  GetStockItem,
  PrintIssue,
  SaveIssueDepartment,
  SearchDetail,
  View,
  ViewDetail,
} from "../../../networkServices/InventoryApi";
import InternalStockTransferTable from "../../../components/UI/customTable/MedicalStore/InternalStockTransferTable";
import Modal from "../../../components/modalComponent/Modal";
import StockTransferModal from "../../../components/modalComponent/Utils/StockTransferModal";
import ViewStockTransferTable from "../../../components/UI/customTable/MedicalStore/ViewStockTransferTable";
import { RedirectURL } from "../../../networkServices/PDFURL";

const InternalStockTransfer = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const dispatch = useDispatch();
  const [searchedItems, setSearchedItems] = useState([]);
  const [view, setView] = useState([]);
  const [viewDetails, setViewDetails] = useState([]);
  const localdata = useLocalStorage("userData", "get");
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const initialPayload = {
    StoreType: "STO00001",
    fromDate: new Date(),
    toDate: new Date(),
    subCategoryID: "0",
    Centre: "0",
    Department: "ALL",
    RequisitionNo: "",
  };
  const [payload, setPayload] = useState({ ...initialPayload });
  useEffect(() => {
    console.log("Pyaload", payload);
  }, [payload]);
  const [DropDownState, setDropDownState] = useState({
    bindStore: [],
    subcategory: [],
    binddepartment: [],
  });
  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
    prescription: null,
  });
  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const GetBindStoreID = async () => {
    try {
      const response = await GetStore();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetBindSubGroup = async () => {
    const StorLedgerNo = payload?.StoreType;
    try {
      const response = await BindSubGroup(StorLedgerNo);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetDeptList = async () => {
    try {
      const response = await BindDepartmentItemIssueToDept();
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const GetView = async (val) => {
    const Dept = localdata?.deptLedgerNo;
    const IndentNo = val?.indentno;
    try {
      const response = await View(Dept, IndentNo);
      const data = response?.data?.map((ele) => {
        ele.IsChecked = false;
        ele.Reject = "";
        ele.Reason = "";
        return ele;
      });
      setView(data);
      if (data?.length > 0) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const GetBindStockItem = (val, index) => {
    apiStockItem(val, index);
  };

  const apiStockItem = async (val, index) => {
    const ItemID = val?.itemID;
    const DeptNo = localdata?.deptLedgerNo;

    try {
      const response = await GetStockItem(ItemID, DeptNo);
      if (response?.data?.length > 0) {
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching stock items:", error);
    }
  };
  const GetViewDetail = async (val, prescription) => {
    const Status = val?.VIEW === true ? 1 : 0;
    const IndentNo = val?.indentno;
    try {
      const response = await ViewDetail(Status, IndentNo);
      setViewDetails(response?.data);
      setModalData({
        visible: true,
        prescription: prescription,
        component: <StockTransferModal view={response?.data} />,
        size: "50vw",
        Header: t("Requisition Detail"),
        setVisible: false,
        footer: <></>,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const [BindGetStore, BindSubCategory, BindDepartmentID] =
        await Promise.all([
          GetBindStoreID(),
          GetBindSubGroup(payload?.StoreType),
          GetDeptList(),
        ]);

      const dropDownData = {
        bindStore: handleReactSelectDropDownOptions(
          BindGetStore,
          "LedgerName",
          "LedgerNumber"
        ),

        subcategory: [
          { label: "ALL", value: "0" },
          ...handleReactSelectDropDownOptions(
            BindSubCategory,
            "Name",
            "SubCategoryID"
          ),
        ],
        binddepartment: [
          { label: "ALL", value: "ALL" },
          ...handleReactSelectDropDownOptions(
            BindDepartmentID,
            "LedgerName",
            "LedgerNumber"
          ),
        ],
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    FetchAllDropDown();
    if (localdata?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localdata?.employeeID }));
    }
  }, []);

  const handleSearch = async (status = "") => {
    if (!payload?.Department) {
      notify("Please Select Department from", "error");
      return;
    }
    const resbody = {
      storeID: String(payload?.StoreType),
      indentNo: String(payload?.RequisitionNo),
      department: String(payload?.Department),
      fromCentre: String(payload?.Centre),
      subCategoryID: String(payload?.subCategoryID),
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      deptLedNo: String(localdata?.deptLedgerNo),
      status: status,
    };
    try {
      const response = await SearchDetail(resbody);
      setSearchedItems(response?.data);
      if (response?.success) {
        // notify(response?.message, "success");
        setView([]);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };
  const searchHeader = [
    { name: t("S.No."), width: "3%" },
    { name: t("Requisition Date"), width: "8%" },
    { name: t("Requisition No."), width: "13%" },
    t("From Centre"),
    t("From Department"),
    { name: t("Requisition Type"), width: "7%" },
    { name: t("Select"), width: "5%" },
    { name: t("View Details"), width: "5%" },
    { name: t("Reprint"), width: "5%" },
  ];
  const thead = [
    { name: t("S.No."), width: "3%" },
    t("Item Name"),
    { name: t("Dept Available Qty."), width: "3%" },
    { name: t("Store Available Qty."), width: "3%" },
    { name: t("Requested Qty."), width: "3%" },
    { name: t("Rejected Qty."), width: "3%" },

    { name: t("Pending Qty."), width: "3%" },
    "Narration",
    { name: t("Reject"), width: "4%" },

    t("Reason"),
    { name: t("Action"), width: "3%" },
  ];
  const handleApprovalDetails = (prescription, val) => {
    GetViewDetail(val, prescription);
  };
  const [indexRow, setIndexRow] = useState({});

  const handleViewDetails = async (val) => {
    await GetView(val);
    setIndexRow(val);

    setTimeout(() => {
      setView((prevView) => {
        return prevView.map((item, index) => {
          if (
            !item.isopen &&
            (!item.BindSubRowList || item.BindSubRowList.length === 0)
          ) {
            handleClickEdit(item, index, false);
          }
          return {
            ...item,
            isopen: true,
          };
        });
      });
    }, 500);
  };

  const handlePrintIssue = async (val) => {
    const IndentNo = val?.indentno;

    try {
      const response = await PrintIssue(IndentNo);
      if (response?.success) {
        RedirectURL(response?.data?.pdfUrl);
        setPaientAdvanceDetails(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const reportOpen = (val) => {
    handlePrintIssue(val);
  };
  const sendReset = () => {
    setSearchedItems([]);
    setView([]);
    setPayload({ ...initialPayload });
  };

  const handleSave = async () => {
    let viewItems = view.filter((val) => val.IsChecked);
    console.log("ViewItems", viewItems);

    if (!viewItems.length) {
      notify("No items selected for saving", "error");
      return;
    }

    const Indent1 = viewItems.map((ele) => ({
      issueQtynew: Number(ele?.reqQty),
      itemID: String(ele?.itemID),
      rejectqty: Number(ele?.Reject),
      reason: String(ele?.Reason),
      recieveQty: Number(ele?.receiveQty),
      indent2:
        ele?.BindSubRowList?.filter((batch) => batch?.IssueQty > 0)?.map(
          (batch) => ({
            issueQtynewgenric: Number(batch?.IssueQty),
            stockIDnewgenric: String(batch?.StockID),
          })
        ) || [],
    }));

    const requestBody = {
      fromCentreID: Number(indexRow?.CentreID),
      storeID: String(indexRow?.StoreId),
      fromDept: String(indexRow?.LedgerNumber),
      indentNo: String(indexRow?.indentno), //✅
      ipAddress: String(ip),
      fromDate: String(indexRow?.dtEntry),
      toDate: String(indexRow?.dtEntry),
      indent1: Indent1,
    };

    const actualPayload = {
      fromcentreID: Number(indexRow?.CentreID),
      storeID: String(indexRow?.StoreId),
      deptLedgerNo: String(indexRow?.LedgerNumber),
      dept: localdata?.deptLedgerNo,
      indentNo: String(indexRow?.indentno),
      ipAddress: String(ip),
      ledgerTransactionNo: 0,
      indentDetails: viewItems.map((ele) => ({
        indentNo: String(indexRow?.indentno),
        chkSelect: ele?.BindSubRowList?.length < 1 ? false : true,
        itemID: String(ele?.itemID),
        reject: Number(ele?.Reject),
        issueingQty: 0,
        reason: String(ele?.Reason),
        item:
          ele?.BindSubRowList?.filter((batch) => batch?.IssueQty > 0)?.map(
            (batch) => ({
              issueQty1: Number(batch?.IssueQty),
              stockID: String(batch?.StockID),
              itemNew: [
                {
                  issueQtynew: 0,
                  stockIDnew: 0,
                },
              ],
            })
          ) || [],

        itemGenric: [],
      })),
    };

    try {
      const response = await SaveIssueDepartment(actualPayload);
      if (response?.success) {
        notify(response?.message, "success");
        sendReset();
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const handleSecondTableInputChange = async (
    index,
    name,
    value,
    ele,
    parentIndex,
    data
  ) => {
    let dataList = await handleDepartmentSubRow(data, parentIndex);
    dataList[parentIndex]["subRow"]["subRowList"][index]["IssueQty"] = value;
  };
  const handleSelect = (e, index, item) => {
    const { name, checked } = e.target;
    const data = [...view];
    data[index][name] = checked;
    setView(data);
  };

  const handleMini = (index) => {
    const tableData = JSON.parse(JSON.stringify(view));
    tableData[index]["subRow"]["isopen"] = false;
    setView(tableData);
  };

  const handleViewItemTable = (view) => {
    return view?.map((ele, index) => {
      return {
        ...ele,
        SrNo: (
          <input
            type="checkbox"
            checked={ele?.IsChecked || false}
            onChange={(e) => handleSelect(e, index, ele)}
          />
        ),
        itemName: ele?.itemName,
        reqQty: ele?.reqQty,
        issuePossible: ele?.issuePossible,
        rejectQty: ele?.rejectQty,
        deptAvailQty: ele?.deptAvailQty,
        StoreAvlQty: ele?.availQty,
        pendingQty: ele?.pendingQty,
        narration: ele?.narration,
        Reject: ele?.Reject,

        Reason: ele?.Reason,

        Action: ele?.subRow?.isopen ? (
          <div
            onClick={() => {
              handleMini(index);
            }}
            className="text-center"
          >
            <i className="fa fa-minus py-1 " aria-hidden="true"></i>
          </div>
        ) : (
          <div onClick={() => apiStockItem(ele, index)} className="text-center">
            <button
              className="btn btn-sm btn-primary"
              type="button"
              disabled={ele?.IsChecked === true ? false : true}
            >
              <i className="fa fa-plus py-1 " aria-hidden="true"></i>
            </button>
          </div>
        ),

        subRow: ele?.subRow,
      };
    });
  };

  const handleDepartmentSubRow = async (data, parentIndex) => {
    const tableResponse = data?.map((ele, index) => {
      return {
        BatchNumber: ele?.BatchNumber,
        isexpirable: ele?.isexpirable,
        MedExpiryDate: ele?.MedExpiryDate,
        UnitPrice: ele?.UnitPrice,
        MRP: ele?.MRP,
        AvailQty: ele?.AvailQty,
        UnitType: ele?.UnitType,
        IssueQty: (
          <Input
            className="table-input"
            name="IssueQty"
            removeFormGroupClass={true}
            type="number"
            onChange={(e) =>
              handleSecondTableInputChange(
                index,
                "IssueQty",
                e.target.value,
                ele,
                parentIndex,
                data
              )
            }
            value={ele?.IssueQty}
          />
        ),
        Rack: ele?.Rack,
        Shelf: ele?.Shelf,
      };
    });
    let dataList = JSON.parse(JSON.stringify(view));
    dataList[parentIndex]["subRow"] = {
      subRowList: tableResponse,
      isopen: true,
      secondThead: [
        "Batch",
        "Expirable",
        "Expiry",
        "Unit Cost",
        "Selling Price",
        "Avail. Qty.",
        "Unit",
        "Issue Qty.",
        "Rack",
        "Shelf",
      ],
    };

    setView(dataList);
    return dataList;
  };

  const handleClickEdit = async (val, index, isopen) => {
    setView((prevView) => {
      return prevView.map((item, idx) =>
        idx === index ? { ...item, isopen: !isopen } : item
      );
    });
    if (val?.BindSubRowList && val?.BindSubRowList.length > 0) {
      return;
    }

    try {
      const response = await GetStockItem(val?.itemID, localdata?.deptLedgerNo);
      let batches = response?.data?.map((ele) => ({
        ...ele,
        IssueQty: 0,
      }));

      if (batches.length > 0) {
        let remainingQty = parseFloat(val.reqQty);

        batches.sort((a, b) => b.AvailQty - a.AvailQty);
        for (let batch of batches) {
          if (remainingQty <= 0) break;

          let issueAmount = Math.min(batch.AvailQty, remainingQty);
          batch.IssueQty = issueAmount;
          remainingQty -= issueAmount;
        }
        const isChecked = batches.some((batch) => batch.IssueQty > 0);
        setView((prevView) =>
          prevView.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  BindSubRowList: batches,
                  IsChecked: isChecked,
                }
              : item
          )
        );
      } else {
        // notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching stock items:", error);
    }
  };

  return (
    <>
      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={modalData.Header}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          footer={modalData?.footer}
        >
          {modalData?.component}
        </Modal>
      )}
      <div className="card">
        <Heading title={"Issue Items To Department"} isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Store Type")}
            id={"StoreType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"StoreType"}
            dynamicOptions={DropDownState?.bindStore}
            value={payload?.StoreType}
            handleChange={handleReactSelect}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            value={
              payload.fromDate
                ? moment(payload?.fromDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            value={
              payload.toDate
                ? moment(payload?.toDate, "YYYY-MM-DD").toDate()
                : null
            }
            handleChange={handleChange}
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
          />
          <ReactSelect
            placeholderName={t("SubCategory")}
            id={"subCategoryID"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            name={"subCategoryID"}
            dynamicOptions={DropDownState?.subcategory}
            value={payload?.subCategoryID}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Centre")}
            id={"Centre"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            dynamicOptions={[
              { label: "ALL", value: "0" },
              ...GetEmployeeWiseCenter?.map((ele) => ({
                label: ele?.CentreName,
                value: ele?.CentreID,
              })),
            ]}
            name="Centre"
            handleChange={handleReactSelect}
            value={payload?.Centre}
          />
          
    
          <ReactSelect
            placeholderName={t("Department From")}
            id={"Department"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            dynamicOptions={DropDownState?.binddepartment}
            name="Department"
            handleChange={handleReactSelect}
            value={payload?.Department}
            requiredClassName={"required-fields"}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Requisition No.")}
            placeholder=" "
            id="RequisitionNo"
            name="RequisitionNo"
            onChange={handleChange}
            value={payload?.RequisitionNo}
            required={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success px-3"
              onClick={() => handleSearch("")}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

      <InternalStockTransferTable
        thead={searchHeader}
        tbody={searchedItems}
        handleApprovalDetails={handleApprovalDetails}
        handleViewDetails={handleViewDetails}
        reportOpen={reportOpen}
        handleSearch={handleSearch}
        payload={payload}
        setPayload={setPayload}
        setView={setView}
      />
      {view?.length > 0 && (
        <>
          <div className="card p-2 my-1">
            <div className="row">
              <ViewStockTransferTable
                thead={thead}
                tbody={handleViewItemTable(view)}
                view={view}
                setTbody={setView}
                handleSelect={handleSelect}
                GetBindStockItem={GetBindStockItem}
                handleViewDetails={handleViewDetails}
                handleClickEdit={handleClickEdit}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-12 text-right">
              <button
                className=" btn-primary btn-sm px-5 ml-1 custom_save_button required-fields"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InternalStockTransfer;
