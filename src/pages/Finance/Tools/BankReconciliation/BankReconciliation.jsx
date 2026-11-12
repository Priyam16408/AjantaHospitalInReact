import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../../components/formComponent/MultiSelectComp";
import { PurchaGetBindAllCenter } from "../../../../networkServices/Purchase";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import ReportDatePicker from "../../../../components/ReportCommonComponents/ReportDatePicker";
import {
  BindVoucherBillingScreenControls,
  ChartOfGroupExcel,
} from "../../../../networkServices/finance";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import DatePicker from "../../../../components/formComponent/DatePicker";
import Input from "../../../../components/formComponent/Input";
import moment from "moment";
import {
  BankReconciliationURL,
  BindReconciliationDetails,
  GetBankReconciliationExcel,
  SearchVoucher,
  UpdateReconciliation,
} from "../../../../networkServices/InventoryApi";
import BankReconciliationTable from "./BankReconciliationTable";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import Tables from "../../../../components/UI/customTable";
import Modal from "../../../../components/modalComponent/Modal";
import ColorCodingSearch from "../../../../components/commonComponents/ColorCodingSearch";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { transformDataInTranslate } from "../../../../components/WrapTranslate";
import { ExcelIconSVG } from "../../../../components/SvgIcons";
import ExcelUploader from "../../../../components/Finance/ExcelUploader";
import { useCallback } from "react";

const BankReconciliation = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const isMobile = window.innerWidth <= 800;

  // STATE INITIALIZATION START

  const [bindMapping, setBindMapping] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    console.log("SelecctedReowslkdjflsd", selectedRows);
  }, [selectedRows]);

  const selectAllRef = useRef(null);

  const areAllSelected =
    selectedRows.length === bindMapping.length && bindMapping.length > 0;

  const intialState = {
    Centre: [
      {
        name: "MOHANDAI OSWAL HOSPITAL",
        code: 1,
      },
    ],
    fromDate: new Date(),
    toDate: new Date(),
    Currency: {
      value: "",
      label: "",
    },
    ChequeDate: "",
    Cheque_no: "",
    Voucher_no: "",
    Clear: {
      value: "0",
      label: "No",
    },
    realization: "",
  };

  const [dropDonwState, setDropDownState] = useState({
    GetBindAllCenter: [],
    BankName: [],
  });
  const [excelData, setExcelData] = useState([]);
  // useEffect(() => {
  //   console.log("ExcelData" , excelData)
  // },[excelData])
  const [list, setList] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [payload, setPayload] = useState({
    ...intialState,
  });
  console.log("pyalo", payload);

  const [values, setValues] = useState({ ...intialState });

  const [modalState, setModalState] = useState({
    show: false,
    name: null,
    component: null,
    size: null,
    footer: null,
  });

  const [clearStatus, setClearStatus] = useState({});

  // STATE INITIALIZATION END

  // USE-EFFECT FUNCTION INITIALIZATION START

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    console.log("API RESP  FROM BINDLIST ", apiResp);
    if (apiResp?.success) {
      const currency = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const BankCOA = filterByTypes(
        apiResp?.data,
        [5],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );

      // console.log("Bank", Bank);
      if (currency?.length > 0) {
        setValues((val) => ({
          ...val,
          Currency: { value: currency[0]["extraColomn"] },
        }));
      }
      setList(apiResp?.data);
    }
  };

  const BindBanks = async () => {
    try {
      const response = await BankReconciliationURL();
      if (response?.success) {
        setDropDownState((val) => ({
          ...val,
          BankName: response?.data?.map((item) => ({
            value: item?.ValueField,
            label: item?.TextField,
          })),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getBindAllCenterAPI = async () => {
    try {
      const response = await PurchaGetBindAllCenter();
      setDropDownState((val) => ({
        ...val,
        GetBindAllCenter: response?.data?.map((item) => ({
          name: item?.CentreName,
          code: item?.CentreID,
        })),
      }));
    } catch (error) {
      console.log("Error found ", error);
    }
  };

  // USE-EFFECT FUNCTION INITIALIZATION END

  // FUNCTION INITIALIZATION START

  const handleMultiSelectChange = (name, selectedOptions) => {
    setPayload({ ...payload, [name]: selectedOptions });
  };

  const handleReactSelect = (e) => {
    const { name, value } = e.target;
    setPayload((val) => ({ ...val, [name]: value }));
  };

  const handleCurrencyChange = (e, name) => {
    console.log("E", e, "Name", name);
    setPayload((val) => {
      return {
        ...val,
        [e]: {
          value: name?.value,
          label: name?.label,
        },
      };
    });
    setClearStatus({ value: name?.value, label: name?.label });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleCustomInput = (index, name, value, type, max) => {
    if (name === "newBatchNo") {
      // Allow only letters and numbers, max 12 characters
      if (value.length > 12 || /[^A-Za-z0-9]/.test(value)) return;
    } else if (name === "ReturnQty") {
      // Allow only numbers, max 8 digits
      if (!/^\d{0,8}$/.test(value)) return;
    } else {
      if (!isNaN(value) && Number(value) <= max) {
        const data = [...tableData];
        data[index][name] = value;
        setTableData(data);
      } else {
        return;
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIndices = bindMapping.map((_, index) => index);
      setSelectedRows(allIndices);
    } else {
      setSelectedRows([]);
    }
  };

  const handleChangeCheckbox = (e, ele, index) => {
    let data = tableData.map((val, i) => {
      if (i === index) {
        val.isChecked = e?.target?.checked;
      }
      return val;
    });
    setTableData(data);
  };

  const handleSearch = async () => {
    const fromDate = new Date(payload?.fromDate);
    const toDate = new Date(payload?.toDate);
    const diffInDays = (toDate - fromDate) / (1000 * 3600 * 24);

    if (diffInDays > 5) {
      notify(
        "You can search for a maximum of 5 Days Voucher's. Please check From Date and To Date.",
        "error"
      );
      return;
    }

    if (
      !payload?.BankName ||
      !payload?.fromDate ||
      !payload?.toDate ||
      !payload?.Clear?.value
    ) {
      notify("Please fill all required fields", "error");
      return;
    } else if (!payload?.Centre) {
      notify("Please Select Center");
    }

    const payloadGoing = {
      fromDate: moment(payload?.fromDate).format(VITE_DATE_FORMAT),
      toDate: moment(payload?.toDate).format(VITE_DATE_FORMAT),
      bankCoaID: payload?.BankName?.value,
      checkDate: moment(payload?.ChequeDate).format(VITE_DATE_FORMAT),
      checkNo: String(payload?.Cheque_no),
      voucherNo: String(payload?.Voucher_no),
      clearStatus: String(payload?.Clear?.value),
      branchCentreID: String(payload?.Center?.map((item) => item?.code)),
    };

    console.log("Payload before saving ", payloadGoing);
    const response = await BindReconciliationDetails(payloadGoing);

    if (response?.success) {
      notify("Record Found", "success");

      setTableData(response?.data);
      setBindMapping(
        response?.data.map((newItem) => ({
          ...newItem,
          realization: "",
        }))
      );
      setPayload([]);

      // ✅ Functional update to avoid infinite re-renders
      // setPayload((prev) => ({
      //   ...prev,
      //   Cheque_no: "",
      //   Voucher_no: "",
      //   realization: "",
      // }));
    } else {
      notify(response?.message, "error");
    }
  };

  // const handleRowSelect = (index) => {
  //   setSelectedRows((prevSelectedRows) => {
  //     let updatedSelectedRows;
  //     if (prevSelectedRows.includes(index)) {
  //       updatedSelectedRows = prevSelectedRows.filter((i) => i !== index); // Remove if already selected
  //     } else {
  //       updatedSelectedRows = [...prevSelectedRows, index]; // Add if not selected
  //     }
  //     return updatedSelectedRows;
  //   });
  // };

  const handleRowSelect = useCallback((index, ele) => {
    setSelectedRows((prevSelectedRows) => {
      if (ele?.matched && ele?.amountMatched) {
        return [...new Set([...prevSelectedRows, index])];
      }

      // Toggle selection if not auto-selected
      return prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((i) => i !== index)
        : [...prevSelectedRows, index];
    });
  }, []);

  const thead = [
    t("S.No."),
    t("Cheque No."),
    t("Cheque Date"),
    t("Cheque Amount"),
    t("Status"),
    t("Voucher No"),
    t("Voucher Date"),
    t("RC Cheque No."),
    t("RC Cheque Amount"),
    {
      name: isMobile ? (
        t("check")
      ) : (
        <input
          type="checkbox"
          style={{ marginRight: "20px" }}
          // name="isAssetActive"
          // id="isAssetActive"
          // onChange={handleChange}
          // checked={bindMapping?.isChecked}
          ref={selectAllRef}
          checked={areAllSelected}
          onChange={handleSelectAll}
        />
      ),
      width: "1%",
    },
    t("Realization"),
    t("Details"),
  ];

  const handleTableDetails = async (ele, i) => {
    console.log("ele", ele);
    try {
      const payload = {
        voucherNo: ele?.VoucherNo,
        filterType: 2,
        // filterType: ele?.filterType
      };
      const apiResmodel = await SearchVoucher(payload);
      console.log("apiRESMODAL", apiResmodel.data);
      if (apiResmodel.success) {
        handleModalState(
          true,
          "Details",
          <>
            <BankReconciliationTable data={apiResmodel?.data} />
          </>,
          "80vw",
          <></>
        );
      }
    } catch (error) {
      console.log(error, "Something went wrong");
    }
  };

  const handleModalState = (show, name, component, size, footer) => {
    setModalState({
      show: show,
      name: name,
      component: component,
      size: size,
      footer: footer,
    });
  };

  const handleInputChange = (e, index) => {
    // console.log(e.target.value);

    // Update the bindMapping state
    const newData = [...bindMapping];
    newData[index].realization = e.target.value;
    setBindMapping(newData);

    // Automatically select the row if realization is entered
    setSelectedRows((prevSelectedRows) => {
      if (!prevSelectedRows.includes(index)) {
        return [...prevSelectedRows, index]; // Add to selectedRows if not already present
      }
      return prevSelectedRows;
    });
  };

  const handleUpload = () => {};

  const handleDownload = async () => {
    // debugger;
    const response = await GetBankReconciliationExcel();
    if (response?.success) {
      console.log("Response", response);
    }
  };

  const handleSave = async () => {
    console.log("Selected Row", selectedRows);
    if (selectedRows?.length <= 0) {
      notify("Kindly Select At Least One Cheque", "error");
      return;
    }

    const selectedData = selectedRows.map((index) => bindMapping[index]);

    console.log("SelectedData", selectedData);
    const payloadtobe = {
      reconciliation: selectedData.map((item) => ({
        chequeNo: item?.ChequeNo,
        status: item?.cheque_status,
        voucherNo: item?.VoucherNo,
        bankCoaID: item?.COAID,
        remark: item?.realization,
        entryDetailsID: item?.EntryDetailID,
        chequeEntryID: item?.chequeentryId,
        transacionType: item?.TransacionType,
        chequeAmount: item?.SpecificAmount,
      })),
      clearStatus: clearStatus?.value,
    };

    const saveResponse = await UpdateReconciliation(payloadtobe);

    if (saveResponse?.success) {
      notify(saveResponse?.message, "success");
      // setPayload([]);
      setBindMapping([]);
      setTableData([]);
      setClearStatus({ value: "", label: "" });
    } else {
      notify(saveResponse?.message, "error");
    }
  };

  const handleExportExcel = async () => {
    let apiResp = await GetBankReconciliationExcel();
    if (apiResp?.success) {
      exportToExcel(transformDataInTranslate(apiResp?.data, t));
    } else {
      notify(apiResp?.message, "error");
    }
  };

  // const handleDataExtracted = (data) => {
  //   console.log("Uploaded Excel Data:", data);
  //   setExcelData(data); // Store the uploaded data

  //   const updatedTable = tableData.map((row) => {
  //     const matchedEntry = data.find(
  //       (entry) =>
  //         String(entry["CHEQUE NUMBER"]).trim() === String(row.ChequeNo).trim()
  //     );

  //     if (matchedEntry) {
  //       return {
  //         ...row,
  //         matched: true,
  //         amountMatched:
  //           Number(matchedEntry["CHEQUE AMOUNT"]) ===
  //           Number(row.SpecificAmount),
  //       };
  //     }

  //     return { ...row, matched: false, amountMatched: false };
  //   });

  //   console.log("Updated Table Data:", updatedTable);
  //   setTableData(updatedTable);
  // };

  // FUNCTION INITIALIZATION END

  // USE-EFFECT START

  const handleDataExtracted = (data) => {
    console.log("Uploaded Excel Data:", data);
    setExcelData(data); // Store the uploaded data

    const updatedTable = tableData.map((row) => {
      const matchedEntry = data.find(
        (entry) =>
          String(entry["CHEQUE NUMBER"]).trim() === String(row.ChequeNo).trim()
      );

      if (matchedEntry) {
        return {
          ...row,
          matched: true,
          amountMatched:
            Number(matchedEntry["CHEQUE AMOUNT"]) ===
            Number(row.SpecificAmount),
        };
      }

      return { ...row, matched: false, amountMatched: false };
    });

    setTableData(updatedTable);

    // ✅ Automatically select rows that are matched and amountMatched
    const matchedRows = updatedTable
      .map((row, index) => (row.matched && row.amountMatched ? index : null))
      .filter((index) => index !== null);

    console.log("Matched Rows:", matchedRows);
    setSelectedRows(matchedRows);
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.inderterminate =
        selectedRows.length > 0 && selectedRows.length < bindMapping.length;
    }
  }, [selectedRows, bindMapping.length]);

  useEffect(() => {
    getBindAllCenterAPI();
    bindListData();
    BindBanks();
  }, []);

  // USE-EFFECT END

  return (
    <div className="mt-2 card border">
      <Heading title={t("Bank Reconciliation")} isBreadcrumb={true} />
      <div className="row p-2">
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="Center"
          searchable={true}
          id="Center"
          placeholderName={t("Branch From")}
          dynamicOptions={dropDonwState?.GetBindAllCenter}
          handleChange={handleMultiSelectChange}
          value={payload?.Center}
          requiredClassName={"required-fields"}
        />
        <DatePicker
          className="custom-calendar"
          inputClassName={"required-fields"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={
            payload.fromDate
              ? moment(payload?.fromDate, "YYYY-MM-DD").toDate()
              : null
          }
          handleChange={handleChange}
          lable={t("FromDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <DatePicker
          className="custom-calendar"
          inputClassName={"required-fields"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={
            payload.toDate
              ? moment(payload?.toDate, "YYYY-MM-DD").toDate()
              : null
          }
          handleChange={handleChange}
          lable={t("ToDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <ReactSelect
          placeholderName={t("Bank Name")}
          id="BankName"
          name="BankName"
          value={payload?.BankName?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleCurrencyChange(name, e)}
          dynamicOptions={dropDonwState?.BankName}
          searchable={true}
          requiredClassName={"required-fields"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Currency")}
          id="Currency"
          name="Currency"
          value={payload?.Currency?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleCurrencyChange(name, e)}
          dynamicOptions={filterByTypes(
            list,
            [4],
            ["TypeID"],
            "TextField",
            "ValueField",
            "STD_CODE"
          )}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("Cheque Date")}
          name="ChequeDate"
          id="ChequeDate"
          value={values?.ChequeDate}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          showTime
          hourFormat="12"
          handleChange={handleReactSelect}
        />
        <Input
          type="text"
          className="form-control"
          id="Cheque_no"
          name="Cheque_no"
          value={payload?.Cheque_no ? payload?.Cheque_no : ""}
          onChange={handleReactSelect}
          lable={t("Cheque No")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="Voucher_no"
          name="Voucher_no"
          value={payload?.Voucher_no ? payload?.Voucher_no : ""}
          onChange={handleReactSelect}
          lable={t("Voucher No.")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Clear")}
          id="Clear"
          name="Clear"
          value={payload?.Clear?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleCurrencyChange(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
          requiredClassName={"required-fields"}
        />
        <div className="box-inner ">
          <button
            className="btn btn-sm btn-primary ml-2"
            type="submit"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {tableData?.length > 0 && (
        <>
          <div className="patient_registration">
            <Heading title={t("Bank Reconciliation")} />
            {payload?.Center?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  marginTop: "5px",
                }}
              >
                <h1
                  style={{
                    marginRight: "10px",
                    fontWeight: "bolder",
                    marginTop: "5px",
                  }}
                >
                  {t("Selected Branch")}:{" "}
                </h1>
                <div className="col-4">
                  <div className="doctorBind">
                    <div className="doctorsName">
                      {payload?.Center?.map((item) => {
                        return item?.name;
                      }).join("  ,  ")}
                    </div>
                  </div>
                </div>
                <div className="row ml-2">
                  <ColorCodingSearch
                    color={"rgba(24, 189, 79, 0.41)"}
                    label={t("Matched")}
                  />
                  <ColorCodingSearch
                    color={"#FFBDBD"}
                    label={t("Not Matched")}
                  />
                </div>
              </div>
            )}

            <div className="mt-2 spatient_registration_card">
              <Tables
                style={{ maxHeight: "40vh" }}
                thead={thead}
                tbody={tableData?.map((ele, index) => ({
                  "S.No.": index + 1,
                  "Cheque No.": ele?.ChequeNo,
                  "Cheque Date": ele?.ChequeDate,
                  "Cheque Amount": ele?.SpecificAmount,
                  Status: ele?.cheque_status,
                  "Voucher No": ele?.VoucherNo,
                  "Voucher Date": ele?.VoucherDate,
                  "RC Cheque No.": ele?.RCChequeNo,
                  "RC Cheque Amount": ele?.RCChequeAmount,
                  checkbox: (
                    <input
                      type="checkbox"
                      checked={
                        ele.matched && ele.amountMatched
                          ? true
                          : selectedRows.includes(index)
                      }
                      onChange={(e) => handleRowSelect(index, ele)}
                      disabled={excelData.length > 0 || ele.matched}
                    />
                  ),
                  Realization: (
                    <Input
                      className="table-input"
                      name="realization"
                      type="text" // ✅ Change type to "text" to allow letters
                      display="right"
                      value={bindMapping[index]?.realization}
                      removeFormGroupClass={true}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ),
                  Details: (
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTableDetails(ele, index)}
                    >
                      {t("Details")}
                    </button>
                  ),
                  colorcode:
                    excelData.length === 0
                      ? "white" // Before upload, keep white
                      : ele.matched && ele.amountMatched
                        ? "rgba(24, 189, 79, 0.41)" // Green for match
                        : ele.matched
                          ? "white"
                          : "rgba(212, 35, 16, 0.52)",
                }))}
              />
              <div className="row mt-2 p-2">
                <ReactSelect
                  placeholderName={t("Reconcile Bank")}
                  id="BankName"
                  name="BankName"
                  value={payload?.BankName?.value}
                  removeIsClearable={true}
                  handleChange={(name, e) => handleCurrencyChange(name, e)}
                  dynamicOptions={dropDonwState?.BankName}
                  searchable={true}
                  // requiredClassName={"required-fields"}
                  isDisabled={true}
                  respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                />
                <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                  <LabeledInput
                    label={t("Reconciliation Amount")}
                    value={selectedRows
                      .map((index) => bindMapping[index])
                      ?.reduce((acc, item) => acc + item?.SpecificAmount, 0)}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                  <LabeledInput
                    label={t("Un-Reconciliation")}
                    value={bindMapping
                      .filter((_, index) => !selectedRows.includes(index)) // Get unchecked rows
                      ?.reduce(
                        (acc, item) => acc + (item?.SpecificAmount || 0),
                        0
                      )}
                  />
                </div>
                <div className="box-inner row">
                  {/* <button
                    className="btn btn-sm btn-primary ml-2"
                    type="upload"
                    onClick={handleUpload}
                  >
                    {t("Upload")}
                  </button> */}
                  <ExcelUploader
                    onDataExtracted={handleDataExtracted}
                    handleRowSelect={handleRowSelect}
                  />
                  <span onClick={handleExportExcel}>
                    <ExcelIconSVG />{" "}
                  </span>
                  <button
                    style={{ cursor: "pointer" }}
                    className="btn btn-sm btn-primary ml-2"
                    type="Download"
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        Header={modalState?.name}
        modalWidth={modalState?.size}
        visible={modalState?.show}
        setVisible={() => {
          handleModalState(false, null, null, null, <></>);
        }}
        footer={modalState?.footer}
      >
        {modalState?.component}
      </Modal>
    </div>
  );
};

export default BankReconciliation;
