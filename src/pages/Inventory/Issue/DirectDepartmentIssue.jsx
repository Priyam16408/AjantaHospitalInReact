import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useSelector } from "react-redux";
import {
  getEmployeeWise,
  GetRoleListByEmployeeIDAndCentreID,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import {
  SaveDirectMedicalIssue,
  SearchDirectDepartment,
  SearchItem,
} from "../../../networkServices/InventoryApi";
import { AutoComplete } from "primereact/autocomplete";
import Input from "../../../components/formComponent/Input";
import DirectDepartmentItemDetailsTable from "../../../components/UI/customTable/MedicalStore/DirectDepartmentItemDetailsTable";
import IssueItemDetailsTable from "../../../components/UI/customTable/MedicalStore/IssueItemDetailsTable";
import { notify } from "../../../utils/utils";
import SearchItemEassyUI from "../../../components/commonComponents/SearchItemEassyUI";
import { BIND_TABLE_DEPARTMENT } from "../../../utils/constant";
import { GetDepartmentDetails } from "../../../networkServices/InventoryApi";
import { DirectDepartmentReport } from "../../../networkServices/BillingsApi";
import { RedirectURL } from "../../../networkServices/PDFURL";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";

const DirectDepartmentIssue = () => {
  const [t] = useTranslation();
  const { deptLedgerNo } = useLocalStorage("userData", "get");
  const ip = useLocalStorage("ip", "get");
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const MedicineRef = useRef(null);
  const QuantityRef = useRef(null);
  const [showBlankTable, setShowBlankTable] = useState(false);

  const { GetEmployeeWiseCenter, GetRoleList } = useSelector(
    (state) => state.CommonSlice
  );
  console.log("GetRoleList", GetRoleList);
  const initialPayload = {
    centreID: localdata?.centreID,
    toDate: moment().format("YYYY-MM-DD"),
    fromDate: moment().format("YYYY-MM-DD"),
    DepartmentId: "",
    Quantity: "",
    ItemID: "",
    ItemName: "",
    IssueNo: "",
  };

  const [payload, setPayload] = useState({ ...initialPayload });
  console.log("Payload", payload);

  const handleReactSelect = (name, value) => {
    setPayload((val) => ({ ...val, [name]: value?.value }));
    focusInput(MedicineRef);
  };

  useEffect(() => {
    dispatch(
      GetRoleListByEmployeeIDAndCentreID({
        employeeID: localdata?.employeeID,
        centreID: payload?.centreID,
      })
    );
    if (localdata?.employeeID) {
      dispatch(getEmployeeWise({ employeeID: localdata?.employeeID }));
    }
  }, []);

  const [newRowData, setNewRowData] = useState({});

  const [tableData, setTableData] = useState([]);
  // console.log("TableData", tableData);

  const distributeTransfer = (transfer, rows) => {
    let remainingTransfer = transfer;
    return rows.map((row) => {
      if (row.isManual) {
        return row;
      }
      const allocatable = Math.min(remainingTransfer, row.AvailQty);
      remainingTransfer -= allocatable;
      return {
        ...row,
        IssueQty: allocatable,
        isChecked: allocatable > 0,
      };
    });
  };

  const handleAddDetails = async () => {
    // console.log("LOCALDATA", localdata);
    const deptLedgerNo = localdata?.deptLedgerNo;
    const ItemID = newRowData?.ItemID;
    if (!payload.Quantity || payload.Quantity <= 0) {
      notify(t("Enter a valid Transfer value."), "error");
      return;
    }

    if (!payload?.DepartmentId) {
      notify(t("Please select Department"), "error");
      return;
    }
    try {
      const response = await SearchItem(deptLedgerNo, ItemID);
      const data = response?.data?.map((ele) => ({
        ...ele,
        isChecked: false,
        IssueQty: 0,
      }));

      // Apply the transfer value to the IssueQty
      const updatedData = distributeTransfer(payload.Quantity, data);
      setTableData(updatedData);
      setPayload((prevPayload) => ({
        ...initialPayload, // Reset everything to initial values
        DepartmentId: prevPayload.DepartmentId, // Preserve the existing DepartmentId
      }));

      setSearchPatient({
        label: t("Search by Medicine"),
        id: "",
        value: "",
        patientDetail: {},
      });
      setShowTable(true); // Reset showTable to true when new data is fetched
      setShowBlankTable(false); // Ensure the blank table is hidden
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevState) => ({
      ...prevState,
      [name]: moment(value).format("YYYY-MM-DD"),
    }));
  };

  const thead = [
    { name: t("Action"), width: "1%" },
    { name: t("Item Name"), width: "10%" },
    { name: t("Batch No."), width: "5%" },
    { name: t("Expiry"), width: "5%" },
    { name: t("MRP"), width: "4%" },
    { name: t("Unit Price"), width: "2%" },
    { name: t("HSN Code"), width: "2%" },
    { name: t("Unit Type"), width: "2%" },
    { name: t("Avail. Qty."), width: "1%" },
    { name: t("Issue Qty."), width: "2%" },
  ];
  const IssueHead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Item Name"), width: "5%" },
    { name: t("Batch No."), width: "5%" },
    { name: t("MRP"), width: "4%" },
    { name: t("Quantity"), width: "10%" },
    { name: t("Remove"), width: "2%" },
  ];

  const handleChangeindex = (e, index) => {
    const { value } = e.target;
    const updatedValue =
      value > tableData[index].AvailQty ? tableData[index].AvailQty : value;

    setTableData((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, IssueQty: updatedValue, isChecked: updatedValue > 0 }
          : item
      )
    );
  };

  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
        // Automatically set isChecked to true if IssueQty > 0
        if (val.IssueQty > 0) {
          val.isChecked = true;
        }
      }
      return val;
    });
    setTableData(data);
  };

  const [SearchPatient, setSearchPatient] = useState({
    label: t("Search by Medicine"),
    id: "",
    value: "",
    patientDetail: {},
  });
  const [issTabData, setIssTabData] = useState([]);
  const AddRowData = () => {
    const checkedRows = tableData.filter((row) => row.isChecked === true);
    // console.log("CheckedRows", checkedRows);
    setList((prevList) => [...prevList, ...checkedRows]);
    setShowTable(false); // Hide the DirectDepartmentItemDetailsTable
    setShowBlankTable(true); // Show the blank table
  };
  const handleRemove = (index) => {
    setList((prevState) => prevState.filter((_, i) => i !== index));
  };

  const focusInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput(MedicineRef);
  }, []);
  console.log(list);
  const sendReset = () => {
    setTableData([]);
    setList([]);
    setPayload({ ...initialPayload });
    setValue("");
  };
  const GetSaveDirectMedicalIssue = async () => {
    try {
      const returnMeds = list?.map((ele) => ({
        taxableMRP: ele?.MRP ? Number(ele?.MRP) : 0,
        saleTaxPer: ele?.SaleTaxPer ? Number(ele?.SaleTaxPer) : 0,
        issueQty: ele?.IssueQty ? Number(ele?.IssueQty) : 0,
        unitPrice: ele?.UnitPrice ? Number(ele?.UnitPrice) : 0,
        purTaxPer: ele?.PurTaxPer ? Number(ele?.PurTaxPer) : 0,
        itemID: ele?.ItemID ? Number(ele?.ItemID) : 0,
        stockID: ele?.StockID ? Number(ele?.StockID) : 0,
        batchNumber: ele?.BatchNumber ? String(ele?.BatchNumber) : "",
        medExpiryDate: ele?.MedExpiryDate,
        discPer: ele?.DiscPer ? Number(ele?.DiscPer) : 0,
        igstPercent: ele?.IGSTPercent ? Number(ele?.IGSTPercent) : 0,
        cgstPercent: ele?.CGSTPercent ? Number(ele?.CGSTPercent) : 0,
        sgstPercent: ele?.SGSTPercent ? Number(ele?.SGSTPercent) : 0,
        hsnCode: ele?.HSNCode ? String(ele?.HSNCode) : "",
        gstType: ele?.GSTType ? String(ele?.GSTType) : "",
        itemName: ele?.ItemName ? String(ele?.ItemName) : "",
        minorUnit: ele?.MinorUnit ? String(ele?.MinorUnit) : "",
        majorUnit: ele?.MajorUnit ? String(ele?.MajorUnit) : "",
        subCategoryID: ele?.SubCategoryID ? Number(ele?.SubCategoryID) : 0,
        conversionFactor: ele?.ConversionFactor
          ? Number(ele?.ConversionFactor)
          : 0,
        isExpirable: ele?.IsExpirable ? Number(ele?.IsExpirable) : 0,
        type: ele?.TYPE ? String(ele?.TYPE) : "",
        isBilled: ele?.IsBilled ? Number(ele?.IsBilled) : 0,
        reusable: ele?.Reusable ? Number(ele?.Reusable) : 0,
        taxCalculation: ele?.taxCalculateon ? String(ele?.taxCalculateon) : "",
        igstAmtPerUnit: ele?.IGSTAmtPerUnit ? Number(ele?.IGSTAmtPerUnit) : 0,
        sgstAmtPerUnit: ele?.SGSTAmtPerUnit ? Number(ele?.SGSTAmtPerUnit) : 0,
        cgstAmtPerUnit: ele?.CGSTAmtPerUnit ? Number(ele?.CGSTAmtPerUnit) : 0,
        rate: ele?.Rate ? Number(ele?.Rate) : 0,
      }));

      console.log("payload", payload);
      const Itempayload = {
        dtItem: returnMeds,
        dept: String(payload?.DepartmentId),
        indentNo: String(payload?.RequisitionNo),
        ipAddress: String(ip),
        centreID: String(payload?.centreID),
      };

      const response = await SaveDirectMedicalIssue(Itempayload);

      if (payload?.isPrint) {
        const printPayload = {
          SalesNo: response?.data,
          CentreIDTo: payload?.centreID,
          UserValidateID: localdata?.userValidateID,
        };
        const printResponse = await DirectDepartmentReport(printPayload);
        if (printResponse?.success) {
          RedirectURL(printResponse?.data?.pdfUrl);
        }
      }
      if (response?.success) {
        notify(t(response?.message), "success");
        sendReset();
        setPayload((prevPayload) => ({
          ...prevPayload,
          isChecked: false,
        }));
      } else {
        notify(t(response?.message), "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const getPatientDetail = async (name) => {
    const payload = {
      searchKey: name,
      deptLedgerNo: deptLedgerNo,
    };
    console.log("Payload", payload);
    let apiResp = await GetDepartmentDetails(payload);
    console.log("ApiResp", apiResp?.data[0]?.ItemID);
    setNewRowData(apiResp?.data[0]?.ItemID);
    return apiResp;
  };

  const handleCloseSearchPatient = async (value) => {
    setSearchPatient((val) => ({ ...val, value: value?.ItemName }));
    setNewRowData(value);
    setPayload((prev) => ({
      ...prev,
      ItemID: value?.ItemID,
      ItemName: value?.ItemName,
    }));
    focusInput(QuantityRef);
  };

  const Reprint = async (issNo) => {
    // console.log("LocalDara", localdata);
    // console.log("Print", payload);
    // if (issNo === undefined) {
    //   notify("Please Enter Issue No.", "error");
    //   return;
    // }

    const paylaod = {
      SalesNo: issNo,
      CentreIDTo: payload?.centreID || localdata?.centreID,
      // UserValidateID: localdata?.userValidateID,
    };

    const response = await DirectDepartmentReport(paylaod);

    if (response?.success) {
      notify(response?.message, "success");
      RedirectURL(response?.data?.pdfUrl);
    } else {
      notify(response?.message, "error");
    }

    console.log("Payload", paylaod);
  };
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleSearch = async () => {
    let data = {
      SalesNo: payload?.IssueNo || 0,
      FromDate: payload?.fromDate || "",
      ToDate: payload?.toDate || "",
    };
    console.log(data);

    let response = await SearchDirectDepartment(data);
    if (response?.success) {
      // notify(response?.message, "success");
      setIssTabData(response.data);
    } else {
      notify(response?.message, "error");
    }
  };
  const issTabHead = [
    { name: t("S.No."), width: "1%" },
    { name: t("IssueNo"), with: "5%" },
    { name: t("ItemName"), with: "5%" },
    { name: t("BatchNumber"), with: "5%" },
    { name: t("FromDept"), with: "5%" },
    { name: t("DATE"), with: "5%" },
    { name: t("ToDept"), with: "5%" },
    { name: t("RePrint"), with: "5%" },
  ];

  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Centre")}
            id={"centreID"}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
            dynamicOptions={GetEmployeeWiseCenter?.map((ele) => ({
              label: ele?.CentreName,
              value: ele?.CentreID,
            }))}
            name="centreID"
            handleChange={handleReactSelect}
            value={payload?.centreID}
          />
          <ReactSelect
            placeholderName={t("Department")}
            id={"DepartmentId"}
            searchable={true}
            respclass="col-xl-2 col-md-2 col-sm-4 col-12"
            dynamicOptions={GetRoleList?.map((ele) => {
              return {
                label: ele?.roleName,
                value: ele?.deptLedgerNo,
              };
            })}
            name="DepartmentId"
            handleChange={handleReactSelect}
            value={payload?.DepartmentId}
            requiredClassName={`required-fields`}
          />
          <div className="col-xl-4 col-md-4 col-sm-4 col-12 pb-2">
            <SearchItemEassyUI
              onClick={handleCloseSearchPatient}
              BindListAPI={getPatientDetail}
              BindDetails={SearchPatient}
              Head={BIND_TABLE_DEPARTMENT}
              isSelectFirst={true}
              customInputRef={MedicineRef}
            />
          </div>
          <Input
            ref={QuantityRef}
            type="number"
            className="form-control required-fields"
            id="Quantity"
            name="Quantity"
            display="right"
            value={payload?.Quantity}
            onChange={handleChange}
            lable={t("Quantity")}
            placeholder=" "
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success px-3"
              onClick={handleAddDetails}
            >
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
      {showTable && tableData?.length > 0 && (
        <div className="card mt-2 ">
          <DirectDepartmentItemDetailsTable
            thead={thead}
            tbody={tableData}
            handleChangeindex={handleChangeindex}
            handleChangeCheckbox={handleChangeCheckbox}
            transfer={payload?.Quantity}
            tableDate={tableData}
            setTableData={setTableData}
          />
          <div className="row p-2 font-right">
            {/* <div className="d-flex">
              <Input
                type="checkbox"
                placeholder=" "
                className="mt-2"
                name="isPrint"
                value={payload?.isPrint}
                onChange={handleChange}
                respclass="col-md-1 col-1"
              />
              <label className="mt-2 ml-3">{t("Print")}</label>
            </div> */}
            {/* <div className=""> */}

              <button className="btn btn-sm btn-success px-3" onClick={AddRowData}>
                {t("Add Items")}
              </button>
            {/* </div> */}
          </div>
        </div>
      )}

      {list?.length > 0 && (
        <>
          <div className="card mt-2">
            <IssueItemDetailsTable
              thead={IssueHead}
              tbody={list}
              handleRemove={handleRemove}
            />
            <div style={{ width: "100%" }}>
              <div
                className="col-sm-1 mt-2 mb-2 font-right"
                style={{ float: "right" }}
              >
                <div className="d-flex">
                  <Input
                    type="checkbox"
                    placeholder=" "
                    className="mt-2"
                    name="isPrint"
                    value={payload?.isPrint}
                    onChange={handleChange}
                    respclass="col-md-1 col-1"
                  />
                  <label className="mt-2 ml-3">{t("Print")}</label>
                </div>
                <button
                  className="btn btn-primary btn-sm px-4 ml-1"
                  onClick={GetSaveDirectMedicalIssue}
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-2">
        <div className="card mt-2">
          <div className="row p-2">
            <Input
              type="text"
              className="form-control"
              id="IssueNo"
              name="IssueNo"
              value={payload?.IssueNo}
              onChange={handleChange}
              lable={"Issue No."}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <DatePicker
              className="custom-calendar"
              id="From Data"
              name="fromDate"
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              value={
                payload.fromDate
                  ? moment(payload.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
            />
            <DatePicker
              className="custom-calendar"
              id="toDate"
              name="toDate"
              lable={t("To Date")}
              value={
                payload.toDate
                  ? moment(payload.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={searchHandleChange}
              placeholder={VITE_DATE_FORMAT}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            {/* <Input
              type="text"
              className="form-control"
              id="RequisitionNo"
              name="RequisitionNo"
              display="right"
              value={payload?.RequisitionNo}
              onChange={handleChange}
              lable={"Requisition No."}
              placeholder=" "
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            /> */}


            <div className="col-sm-1">
              <button className="btn btn-sm btn-success px-3" onClick={handleSearch}>{t("Search")}</button>
            </div>
          </div>
        </div>
        {issTabData.length > 0 && (
          <div className="mt-2 spatient_registration_card">
            <Tables
              style={{ maxHeight: "45vh" }}
              thead={issTabHead}
              tbody={issTabData?.map((item, index) => ({
                "S.No": index + 1,
                IssueNo: item?.IssueNo,
                ItemName: item?.ItemName,
                BatchNumber: item?.BatchNumber,
                FromDept: item?.FromDept,
                DATE: moment(item?.DATE).format("DD-MMM-YYYY"),
                ToDept: item?.ToDept,
                RePrint: (
                  <i
                    className="fa fa-print card-print-upload-image-icon"
                    aria-hidden="true"
                    onClick={() => {
                      Reprint(item.IssueNo);
                    }}
                  ></i>
                ),
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DirectDepartmentIssue;
