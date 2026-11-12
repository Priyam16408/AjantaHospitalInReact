import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BindVoucherBillingScreenControls,
  FinanceSaveVoucher,
  GetCurrencyConversionFactorAPI,
  LoadCentreChartOfAccountAPI,
} from "../../../../networkServices/finance";
import {
  filterByTypes,
  inputBoxValidation,
  notify,
} from "../../../../utils/utils";
import Input from "../../../../components/formComponent/Input";
import { AMOUNT_REGX } from "../../../../utils/constant";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import DatePicker from "../../../../components/formComponent/DatePicker";
import { GetCurrencyConversionFactors } from "../../../../networkServices/Pettycash";
import moment from "moment";
import { AutoComplete } from "primereact/autocomplete";
import AddReportResultLab from "../../../ResultEntry/AddReportResultLab";
import AttachDoumentModal from "../../../../components/modalComponent/Utils/AttachDoumentModal";
import BrowseButton from "../../../../components/formComponent/BrowseButton";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import {
  GetBankChargesUploadExcel,
  GetBankReconciliationExcel,
  SearchVoucher,
} from "../../../../networkServices/InventoryApi";
import ExcelUploader from "../../../../components/Finance/ExcelUploader";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { transformDataInTranslate } from "../../../../components/WrapTranslate";
import { ExcelIconSVG } from "../../../../components/SvgIcons";
import Tables from "../../../../components/UI/customTable";
import { FinanceSaveVoucherPayload } from "../../../../utils/ustil2";
import Modal from "../../../../components/modalComponent/Modal";
import { Tooltip } from "primereact/tooltip";
import CustomSelect from "../../../../components/formComponent/CustomSelect";
import BankChargesTable from "./BankChargesTable";

const BankChargesUpload = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const userData = useLocalStorage("userData", "get");

  const initialValues = {
    AccountName: "",
    VoucherType: {
      label: "",
      value: "",
    },
    Actual: 1,
    ConversionFactor: 1,
    Currency: {
      value: "INR",
    },
    Department: {
      value: "D-000001",
      label: "FINANCE",
    },
    VoucherNumber: "",
    Remark: "",
    VoucherDate: new Date(),
    VoucherType: {
      value: "Dr",
    },
  };
  const [values, setValues] = useState({ ...initialValues });
  useEffect(() => {
    console.log("values", values);
  }, [values]);
  const [voucherList, setVoucherList] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  // console.log("BodyData", bodyData);
  const [amounts, setAmounts] = useState({});
  const [modalData, setModalData] = useState({ visible: false });
  const [voucherNo, setVoucherNo] = useState("");
  console.log("VoucherNo", voucherNo);
  // console.log("Amounts", amounts);

  const [rowSelected, setRowSelected] = useState({});
  const [isuploadDocOpen, setIsuploadDocOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [excelData2, setExcelData2] = useState({});
  console.log("ExcelData", excelData);
  // useEffect(() => {
  //   console.log("eXCEL DATA", excelData);
  // }, [excelData]);
  // console.log("Excel Data", excelData);
  const [handleModelData, setHandleModelData] = useState({
    label: t("AddFile"),
    buttonName: "",
    width: "",
    isOpen: true,
    Component: <></>,
    extrabutton: <></>,
    footer: <></>,
  });
  const [list, setList] = useState([]);
  const [items, setItems] = useState([]);
  const [documentsList, setDocumentsList] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRows] = useState({});
  const [preview, setPreview] = useState({});

  const thead = [
    { name: "S.No.", width: "1%" },
    { name: "A/C Name", width: "15%" },
    // { name: "Branch Centre", width: "15%" },
    // "Department",
    { name: "Amount", width: "8%" },
    { name: "Amount Local", width: "10%" },
    { name: "Bal Type", width: "10%" },
    { name: "Remarks", width: "10%" },
    { name: "Payment Mode", width: "10%" },
    { name: "Ref. No.", width: "10%" },
    { name: "Ref. Date", width: "10%" },
  ];
  const Searchthead = [
    { name: "S/No.", width: "5%" },
    { name: "Voucher No", width: "15%" },
    { name: "Voucher Date", width: "10%" },
    { name: "Amount Local", width: "10%" },
    { name: "Entry Date", width: "10%" },
    { name: "Entry By", width: "10%" },
    { name: "View", width: "5%" },
    { name: "Edit", width: "5%" },
    { name: "Review Resolved", width: "10%" },
    { name: "Print", width: "5%" },
  ];

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleCurrencyChange = (e, name) => {
    // console.log("E", e, "Name", name);
    setValues((val) => {
      return {
        ...val,
        [e]: {
          value: name?.value,
          label: name?.label,
        },
      };
    });
  };

  const handleChange = (e) => {
    const { value, name } = e?.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSelectDate = (e) => {
    GetCurrencyConversionFactor(
      values?.Currency?.value,
      moment(e?.value).format("DD-MMM-YYYY")
    );
  };

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1);
    if (apiResp?.success) {
      const currency = filterByTypes(
        apiResp?.data,
        [4],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const project = filterByTypes(
        apiResp?.data,
        [3],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      const department = filterByTypes(
        apiResp?.data,
        [2],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      // console.log("Project", project, currency, department);
      if (project?.length === 1) {
        setValues((val) => ({
          ...val,
          ProjectName: { value: project[0]["value"] },
        }));
      }
      if (currency?.length > 0) {
        setValues((val) => ({
          ...val,
          Currency: { value: currency[0]["extraColomn"] },
        }));
        await GetCurrencyConversionFactor(
          currency[0]["extraColomn"],
          moment(values?.VoucherDate ? values?.VoucherDate : new Date()).format(
            "DD-MMM-YYYY"
          )
        );
        // console.log("Currency", currency[0]["extraColomn"]);
      }
      if (department?.length > 0) {
        setValues((val) => ({
          ...val,
          Department: { value: department[0]["value"] },
        }));
      }
      setList(apiResp?.data);
    } else {
      setList([]);
    }
  };

  const GetCurrencyConversionFactor = async (currencyCode, voucherDate) => {
    let apiResp = await GetCurrencyConversionFactorAPI(
      currencyCode,
      voucherDate
    );
    if (apiResp?.success) {
      setValues((val) => ({
        ...val,
        ConversionFactor: apiResp?.data,
        Actual: apiResp?.data,
      }));
    }
  };

  const itemTemplate = (item) => {
    return (
      <div className="p-clearfix">
        <div style={{ float: "left", fontSize: "12px", width: "100%" }}>
          {item?.TextField}
        </div>
      </div>
    );
  };

  const search = async (event, name) => {
    setValues((val) => ({ ...val, [name]: event?.query }));
    if (event?.query?.length > 2) {
      const payload = {
        // groupCode: String(values?.ChartOfGroup?.value),
        accountTypeID: 0,
        currencyCode: String(values?.Currency?.value),
        accountName: String(event?.query),
      };
      let results = await LoadCentreChartOfAccountAPI(payload);
      if (results?.success) {
        setItems(results?.data);
      } else {
        setItems([]);
        // notify(results?.message,"error")
      }
    } else {
      // setItems([])
    }
  };

  const validateInvestigation = async (e, name) => {
    // debugger;
    if (!values?.VoucherType?.value) {
      notify("Please Select Voucher Type", "error");
      return 0;
    }
    const { value } = e;
    console.log("values from validate", value);
    // value.branchCentre = { value: userData?.defaultCentre };
    value.balanceType = { value: value?.balanceType };
    setValues((val) => ({
      ...val,
      [name]: value?.TextField,
      coaid: value?.ValueField, // Add coaid with value from valueType
    }));

    setBodyData((val) => [...val, value]);
  };

  const handleDataExtracted = (data) => {
    // debugger
    setExcelData(
      data?.map((item) => {
        const paymentModeData = filterByTypes(
          list,
          [10, item.PaymentMode],
          ["TypeID", "TextField"],
          "TextField",
          "ValueField"
        );

        return {
          ...item,
          Refnumber: item?.RefNo,
          AccountName: values?.AccountName,
          balanceType: { value: item.Type },
          ValueField: values?.coaid,
          PaymentMode: paymentModeData?.length > 0 ? paymentModeData[0] : null, // Ensure it's a single object
        };
      })
    );

    console.log("ExcelData from handleDataExtracted", excelData);

    // Store the uploaded data

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

    // console.log("Matched Rows:", matchedRows);
    setSelectedRows(matchedRows);
  };

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

  const handleEdit = async (ele, index, filterTypeMaster = 2) => {
    const filterType = filterTypeMaster ? filterTypeMaster : 1;
    const voucherNo = ele?.VoucherNo;
    let data = await SearchVoucher({ filterType, voucherNo });
    if (data?.success && filterTypeMaster === 2) {
      setExcelData(
        data?.data?.map((item) => ({
          ...item,
          isEdit: 1,
          Refnumber: item?.RefNo,
          Amount: item?.AmountSpecific,
          balanceType: { value: String(item?.BalType) },
          PaymentMode: { value: String(item?.PaymentModeID) },
          VoucherType: { value: item?.VoucherType },
        }))
      );
      setValues((val) => ({
        ...val,
        VoucherType: { value: data?.data[0]?.VoucherType },
        VoucherNumber: voucherNo,
        isEdit: 1,
      }));

      // debugger;

      console.log("Voucher Data", voucherNo);

      handleEdit({ VoucherNo: voucherNo }, index, 3);
      // setVoucherList({});
      // setVoucherList([])
      // setVoucherNo("");
    }
  };

  const HandleView = (value, index) => {
    return (
      <>
        {" "}
        <Tooltip
          target={`#icon-${index}`}
          content={`Verify By :${value?.VerifiedBy}\nVerify Date :${value?.VerifyDate}\nVerify Remark :${value?.VerifyRemark}\nAuth By :${value?.AuthBy}\nAuth Date :${value?.AuthDate}\nAuth Remark :${value?.AuthRemark}\nReview By :${value?.ReviewBy}\nReview Date :${value?.ReviewDate}\nReview Remark :${value?.ReviewRemarks}\nReview Resolved By :${value?.ReviewResolvedBy}\nReview Resolved Date :${value?.ReviewResolvedDate}\nReview Resolved Remark :${value?.ReviewResolvedRemarks}`}
          event="hover"
          position="top"
        />{" "}
        <strong id={`icon-${index}`} className="cursor-pointer text-danger">
          {" "}
          {t("View")}
        </strong>
      </>
    );
  };

  useEffect(() => {
    let processedData = Array.isArray(excelData)
      ? excelData
      : Object.values(excelData ?? {});

    let data = processedData?.reduce(
      (accumulator, currentItem) => {
        // debugger
        if (currentItem?.balanceType?.value === "Dr") {
          accumulator["Dr Amount"] += currentItem?.Amount
            ? Number(currentItem?.Amount)
            : 0;
          accumulator["Dr Local Amount"] +=
            values?.ConversionFactor * currentItem?.Amount > 0
              ? Number(values?.ConversionFactor * currentItem?.Amount)
              : 0;
        } else if (currentItem?.balanceType?.value === "Cr") {
          accumulator["Cr Amount"] += currentItem?.Amount
            ? Number(currentItem?.Amount)
            : 0;
          accumulator["Cr Local Amount"] +=
            values?.ConversionFactor * currentItem?.Amount > 0
              ? Number(values?.ConversionFactor * currentItem?.Amount)
              : 0;
        }
        return accumulator;
      },
      {
        "Cr Amount": 0,
        "Dr Amount": 0,
        "Cr Local Amount": 0,
        "Dr Local Amount": 0,
      }
    );
    console.log("datadatadatadata", processedData);
    // Calculate difference amounts
    data["Diff Amount"] = data["Cr Amount"] - data["Dr Amount"];
    data["Diff Local Amount"] =
      data["Cr Local Amount"] - data["Dr Local Amount"];

    // Update state
    setAmounts({
      "Amount (Dr)": data["Dr Amount"],
      "Amount (Cr)": data["Cr Amount"],
      "Diff Amount": Math.abs(data["Cr Amount"] - data["Dr Amount"]),
      "Base Amount (Cr)": data["Cr Local Amount"],
      "Base Amount (Dr)": data["Dr Local Amount"],
      "Diff Base Amount": Math.abs(data["Diff Local Amount"]),
    });
  }, [excelData, values?.ConversionFactor]);

  const handleSave = async () => {
    // console.log("Excel Data inside save", excelData);
    const payload = FinanceSaveVoucherPayload(excelData, amounts, values);
    console.log("New Payload", payload);
    let apiResp = await FinanceSaveVoucher(payload);
    if (apiResp?.success) {
      notify(apiResp?.message, "success");
      setBodyData([]);
      setValues((val) => ({
        ...initialValues,
        Currency: values?.Currency,
        ConversionFactor: values?.ConversionFactor,
        Actual: values?.Actual,
        voucherNumber: apiResp?.data,
      }));
      setVoucherNo(apiResp?.data);

      setModalData({
        visible: true,
        width: "25vw",
        label: t("Voucher Number"),
        CallAPI: () => {},
        footer: <></>,
        Component: (
          <h1 className="text-center  PatientUHID">
            {" "}
            <span className="text-red PatientUHID"> {apiResp?.data} </span>{" "}
          </h1>
        ),
      });
      setExcelData([]);
      setVoucherList([]);
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const handleExportExcel = async () => {
    let apiResp = await GetBankChargesUploadExcel();
    if (apiResp?.success) {
      exportToExcel(
        transformDataInTranslate(apiResp?.data, t),
        "",
        "",
        "",
        "Bank Charges Upload"
      );
    } else {
      notify(apiResp?.message, "error");
    }
  };

  const handleSearch = async ({ voucherNoMaster }, filterTypeMaster) => {
    // debugger
    const filterType = filterTypeMaster ? filterTypeMaster : 1;
    const voucherNo = voucherNoMaster ? voucherNoMaster : values?.VoucherNumber;
    let apiResp = await SearchVoucher({ filterType, voucherNo });
    if (apiResp?.success) {
      setVoucherList(apiResp?.data);
      return apiResp?.data;
    } else {
      notify(apiResp?.message, "error");
      setVoucherList([]);
    }
  };

  const handleCustomInput = (index, name, value, type, max = 9999999999999) => {
    setExcelData((data) => {
      const updatedData = Array.isArray(data) ? [...data] : [];
      if (updatedData[index]) {
        updatedData[index][name] =
          type === "number" && value > max ? max : value;
      } else {
        updatedData[index] = { [name]: value };
      }

      return updatedData;
    });
  };

  useEffect(() => {
    bindListData();
  }, []);

  return (
    <div className="mt-2 card border">
      <Heading title={t("Bank Charges Upload")} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Voucher Type")}
          id="VoucherType"
          requiredClassName={"required-fields"}
          name="VoucherType"
          value={values?.VoucherType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={filterByTypes(
            list,
            [1],
            ["TypeID"],
            "TextField",
            "ValueField",
            "STD_CODE"
          )}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          // isDisabled={true}
        />
        <ReactSelect
          placeholderName={t("Currency")}
          id="Currency"
          name="Currency"
          value={values?.Currency?.value}
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
          requiredClassName={"required-fields"}
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="ConversionFactor"
          name="ConversionFactor"
          value={values?.ConversionFactor ? values?.ConversionFactor : ""}
          // onChange={handleChange}
          // disabled={excelData?.length > 0 ? true : false}
          onChange={(e) => {
            inputBoxValidation(AMOUNT_REGX(8), e, handleChange);
          }}
          lable={t("Conversion Factor")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
          <LabeledInput
            label={t("Actual Conversion Factor")}
            value={values?.Actual ? values?.Actual : ""}
          />
        </div>
        <DatePicker
          className="custom-calendar required-fields"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="VoucherDate"
          name="VoucherDate"
          value={
            values?.VoucherDate
              ? moment(values?.VoucherDate).toDate()
              : new Date()
          }
          maxDate={new Date()}
          handleChange={handleChange}
          handleSelect={handleSelectDate}
          lable={t("Voucher Date")}
          placeholder={VITE_DATE_FORMAT}
        />
        <ReactSelect
          placeholderName={t("Department")}
          id="Department"
          name="Department"
          value={values?.Department?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleCurrencyChange(name, e)}
          dynamicOptions={filterByTypes(
            list,
            [2],
            ["TypeID"],
            "TextField",
            "ValueField",
            "STD_CODE"
          )}
          searchable={true}
          requiredClassName={"required-fields"}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Project")}
          id="Project"
          name="Project"
          value={values?.Project?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleCurrencyChange(name, e)}
          dynamicOptions={filterByTypes(
            list,
            [3],
            ["TypeID"],
            "TextField",
            "ValueField",
            "STD_CODE"
          )}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          requiredClassName={"required-fields"}
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
          <LabeledInput
            label={t("Type")}
            value={values?.Type ? values?.Type : "BANK CHARGES"}
          />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-6 col-12">
          <AutoComplete
            value={
              values?.AccountName?.TextField
                ? values?.AccountName?.TextField
                : values?.AccountName
            }
            suggestions={items}
            completeMethod={(e) => {
              search(e, "AccountName", 5);
            }}
            className="w-100 required-fields"
            onSelect={(e) => validateInvestigation(e, "AccountName")}
            id="AccountName"
            itemTemplate={itemTemplate}
          />
          <label
            className="label lable truncate ml-3 p-1"
            style={{ fontSize: "5px !important" }}
          >
            {t("Account Name")}
          </label>
        </div>
        <div className="row ml-1 mt-1 ml-2 mt-2">
          <ExcelUploader
            title={t("Upload Excel Sheet")}
            values={values}
            onDataExtracted={handleDataExtracted}
            handleRowSelect={handleRowSelect}
          />
          <span onClick={handleExportExcel}>
            <ExcelIconSVG />{" "}
          </span>
        </div>
      </div>
      {excelData?.length > 0 && (
        <>
          <div className="mt-2 card">
            <Heading title={t("Billing Details")} isBreadcrumb={false} />
            <Tables
              thead={thead}
              tbody={excelData?.map((ele, index) => ({
                SNo: index + 1,
                AccountName: ele?.AccountName,
                Amount: (
                  <Input
                    type="text"
                    className="table-input required-fields"
                    removeFormGroupClass={true}
                    respclass="w-100"
                    name={t("Amount")}
                    value={
                      ele?.Amount
                        ? ele?.Amount
                        : "" ||
                          ele?.AdjustmentSpecificAmount ||
                          ele?.AmountSpecific
                    }
                    onChange={(e) => {
                      handleCustomInput(index, "Amount", e.target.value);
                    }}
                  />
                ),
                "Amount Local":
                  ele?.Amount === 0
                    ? "0.000"
                    : (ele?.Amount || ele?.VoucherAmount || ele?.AmountBase) *
                      values?.ConversionFactor,
                "Bal Type":
                  ele?.Amount === 0 ? "0.000" : ele?.Amount || ele?.BalType,
                Remarks: ele?.Remark
                  ? ele?.Remark
                  : `Bank Charges` || ele?.ReviewRemarks,
                "Payment Mode": (
                  <CustomSelect
                    placeHolder={t("Payment Mode")}
                    requiredClassName={"required-fields"}
                    name="PaymentMode"
                    onChange={(name, e) => {
                      handleCustomInput(index, "PaymentMode", e);
                    }}
                    isRemoveSearchable={true}
                    value={ele?.PaymentMode?.value}
                    option={filterByTypes(
                      list,
                      [10],
                      ["TypeID"],
                      "TextField",
                      "ValueField"
                    )}
                  />
                ),
                "Ref. No.": (
                  <Input
                    type="text"
                    className="table-input required-fields"
                    removeFormGroupClass={true}
                    respclass="w-100"
                    name={t("Refnumber")}
                    value={ele?.Refnumber ? ele?.Refnumber : ""}
                    onChange={(e) => {
                      handleCustomInput(index, "Refnumber", e.target.value);
                    }}
                  />
                ),
                "Ref. Date.": (
                  <DatePicker
                    className="custom-calendar-table"
                    inputClassName={"required-fields"}
                    id="InvoiceDate"
                    respclass="w-100"
                    name={t("RefDate")}
                    value={ele?.RefDate ? new Date(ele?.RefDate) : new Date()}
                    maxDate={new Date()}
                    handleChange={(e) =>
                      handleCustomInput(index, "RefDate", e.target.value)
                    }
                    placeholder={VITE_DATE_FORMAT}
                  />
                ),
              }))}
              setOldBodyData={setExcelData}
              list={list}
              values={values}
            />
          </div>
        </>
      )}

      {excelData?.length > 0 && (
        <div className="mt-2 spatient_registration_card">
          <div className="patient_registration card">
            <div className="row px-2 pt-2">
              <div className="col-12">
                <div className="row">
                  {Object.keys(amounts)?.map((val) => {
                    return (
                      <div className="col-xl-2 col-md-4 col-sm-4 col-14 mb-2">
                        <LabeledInput label={t(val)} value={amounts[val]} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12  w-100 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-primary mb-2 mr-1"
                  type="button"
                  onClick={handleSave}
                >
                  {excelData[0]?.isEdit ? t("Update") : t("Save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          {/* {excelData?.length > 0 && <BankChargesTable excelData={excelData} />} */}
        </div>
      </div>
      <div className="mt-2">
        <Heading title={t("Bank Charges Upload")} isBreadcrumb={false} />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control "
            id="VoucherNumber"
            name="VoucherNumber"
            value={values?.VoucherNumber ? values?.VoucherNumber : ""}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
            }}
            lable={t("Voucher No")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <button
            className="btn btn-sm btn-primary ml-2"
            type="Download"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
          {/* <Input
            type="text"
            className="form-control "
            id="Remark"
            name="Remark"
            value={values?.Remark ? values?.Remark : ""}
            // onChange={handleChange}
            onChange={(e) => {
              handleChange(e);
            }}
            lable={t("Remark")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          /> */}
        </div>
      </div>
      <Modal
        visible={modalData?.visible}
        setVisible={() => {
          setModalData((val) => ({ ...val, visible: false }));
        }}
        modalData={modalData?.modalData}
        modalWidth={modalData?.width}
        Header={modalData?.label}
        buttonType="button"
        buttonName={modalData?.buttonName}
        footer={modalData?.footer}
        handleAPI={modalData?.CallAPI}
      >
        {modalData?.Component}
      </Modal>
      {voucherList?.length > 0 && (
        <Tables
          tbody={voucherList.map((ele, index) => ({
            SNo: index + 1,
            "Voucher Number": ele?.VoucherNo,
            "Voucher Date": ele?.VoucherDate,
            "Amount Local": ele?.VoucherAmount,
            "Entry Date": ele?.EntryDate,
            "Entry By": ele?.EntryBy,
            View: HandleView(ele, index),
            Edit: (
              <i
                className="fa fa-edit"
                aria-hidden="true"
                onClick={() => {
                  handleEdit(ele, index);
                }}
              ></i>
            ),
            "Review Resolved": ele?.IsReviewResolvedEdit ? "Yes" : "No",
            Print: <i className="pi pi-print"></i>,
          }))}
          thead={Searchthead}
          style={{ maxHeight: "60vh" }}
        />
        // <BankChargesTable
        //   excelData={<BankChargesTable excelData={voucherList} />}
        // />
      )}
    </div>
  );
};

export default BankChargesUpload;
