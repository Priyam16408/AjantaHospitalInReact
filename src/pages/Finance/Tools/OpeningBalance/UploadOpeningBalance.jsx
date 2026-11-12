import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import {
  BindVoucherBillingScreenControls,
  GetCurrencyConversionFactorAPI,
  LoadCentreChartOfAccountAPI,
} from "../../../../networkServices/finance";
import {
  filterByTypes,
  inputBoxValidation,
  notify,
} from "../../../../utils/utils";
import moment from "moment";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import { AMOUNT_REGX } from "../../../../utils/constant";
import Input from "../../../../components/formComponent/Input";
import {
  BalanceTransaferControls,
  BinduploadOpeningBalanceControls,
  GetOpeningBalanceExcell,
  GetOpeningBalanceToUpload,
  SaveOpeningBalance,
} from "../../../../networkServices/InventoryApi";
import { AutoComplete } from "primereact/autocomplete";
import BrowseButton from "../../../../components/formComponent/BrowseButton";
import ColorCodingSearch from "../../../../components/commonComponents/ColorCodingSearch";
import Tables from "../../../../components/UI/customTable";
import CustomSelect from "../../../../components/formComponent/CustomSelect";
import {
  CrossIconSVG,
  ExcelIconSVG,
  PlusIconSVG,
} from "../../../../components/SvgIcons";
import ExcelUploader from "../../../../components/Finance/ExcelUploader";
import { exportToExcel } from "../../../../utils/exportLibrary";
import { transformDataInTranslate } from "../../../../components/WrapTranslate";

const UploadOpeningBalance = () => {
  const [t] = useTranslation();
  const userSession = useLocalStorage("newSession", "get");
  // console.log("User Data ", userSession);
  const userData = useLocalStorage("userData", "get");

  const thead = [
    { name: t("SrNo"), width: "5%" },
    { name: t("Add/Edit"), width: "7%" },
    { name: t("Account Name") },
    { name: t("Group Name") },
    { name: t("Opening Balance") },
    { name: t("Opening Balance Base") },
    { name: t("Type") },
  ];

  const initialValues = {
    FinancialYear: {
      label: "FY : 01-Apr-2023 - 31-Mar-2024",
      value: "1",
    },
    Group: {
      label: "STOCK MEDICAL",
      value: "1002002001",
      extraColomn: "COG",
    },
    // VoucherDate: new Date(),
  };

  const [financialYearOptions, setFinancialYearOptions] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  // console.log(" Values ", values);
  const [department, setDepartment] = useState({});
  const [list, setList] = useState([]);
  const [group, setGroup] = useState([]);
  const [items, setItems] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [tableData, setTableData] = useState([]);
  // console.log("TableData", tableData);

  const [dropDownState, setDropDownState] = useState({
    FYyear: [],
  });


  const handleReactSelect = (name, selectedOption) => {
    setValues({ ...values, [name]: selectedOption });
  };

  const bindFYData = async () => {
    const payloadToBe = {
      CentreID: values?.allCenter?.CentreID ? values?.allCenter?.CentreID : 1,
    };
    let apiResp = await BalanceTransaferControls(payloadToBe);

    // console.log("ApieRes", apiResp);
    if (apiResp?.success) {
      const currency = filterByTypes(
        apiResp?.data,
        [1],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );

      const FYyear = apiResp?.data?.filter((item) => item?.TypeName === "FY");

      setDropDownState((val) => ({
        ...val,
        FYyear: FYyear.map((item) => ({
          label: item?.GroupCode,
          value: item?.ValueField,
        })),
      }));
    } else {
      // setList([])
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

  const getGroups = async () => {
    // debugger
    // console.log("userValidateId", userValidateId)
    let apiResp = await BinduploadOpeningBalanceControls();
    if (apiResp?.success) {
      const group = filterByTypes(
        apiResp?.data,
        [2],
        ["TypeID"],
        "TextField",
        "ValueField",
        "TypeCode"
      );
      if (group?.length > 0) {
        setValues((val) => {
          return {
            ...val,
            Group: { value: group[0]["value"] },
          };
        });
        setGroup(apiResp?.data);
      } else {
        setGroup([]);
      }
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
      if (currency?.length > 0) {
        setValues((val) => ({
          ...val,
          Currency: { value: currency[0]["extraColomn"] },
        }));
        await GetCurrencyConversionFactor(
          currency[0]["extraColomn"],
          moment(userSession ? userSession : new Date()).format("DD-MMM-YYYY")
        );
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

  const handleChange = (e) => {
    const { value, name } = e?.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleCurrencyChange = (e, name) => {
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
    const { value } = e;
    // console.log("values from validate", value);
    value.branchCentre = { value: userData?.defaultCentre };
    value.balanceType = { value: value?.balanceType };
    setValues((val) => ({ ...val, [name]: value }));
    setBodyData((val) => [...val, value]);
  };



  const handleDonwload = async () => {
    const payloadToBe = {
      fyId: values?.FinancialYear?.value,
      currencyCode: values?.Currency?.value,
      groups: values?.Group?.value,
      coaID: values?.AccountName?.value ? values?.AccountName?.value : 0,
    };
    const Apiresp = await GetOpeningBalanceExcell(payloadToBe);
    // console.log("Apiresp", Apiresp?.data);

    if (Apiresp?.success) {
      exportToExcel(
        transformDataInTranslate(Apiresp?.data?.dt, t),
        t("Opening Balance")
      );
    } else {
      notify(Apiresp?.message, "error");
    }
  };

  const handleSearch = async () => {
    
    const payloadToBe = {
      FyId: values?.FinancialYear?.value,
      CurrencyCode: values?.Currency?.value,
      Groups: values?.Group?.value,
      CoaID: values?.AccountName?.ValueField,
    };
    const resp = await GetOpeningBalanceToUpload(payloadToBe);
    if (resp?.success) {
      let data = resp?.data;
      data = data.map((item) => {
        return {
          ...item,
          GroupName: {
            label: item?.GroupName,
            value: item?.GroupCode,
          },
          BalanceType: {
            label: item?.BalanceType,
            value: item?.BalanceType,
          },
        };
      });
      setTableData(data);
    } else {
      notify(resp?.message, "error");
    }
  };

  const handleCustomInput = (index, name, value) => {
    setTableData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [name]: value };
      return updatedData;
    });
  };

  const handleUpload = async () => {
    const payloadToBe = tableData.map((item) => {
      const periodParts = item.Period.match(/\d{2}-[A-Za-z]+-\d{4}/g) || [];
      const fyStartDate = periodParts.length > 0 ? periodParts[0] : "";
      const fyEndDate = periodParts.length > 1 ? periodParts[1] : "";
      // debugger;

      return {
        accountName: item.AccountName || "",
        groupCode: item.GroupName?.value || "",
        openingBalanceID: item.OpeningBalanceID || 0,
        fyid: String(item.FYID || ""),
        fyStartDate,
        fyEndDate,
        currencyCode: values?.Currency?.value || "",
        coaid: String(item.COAID || ""),
        baseAmountOpening: String(item.BaseAmountOpening || ""),
        baseAmountOpeningBalanceType: item.BalanceType?.value || "",
        specificAmountOpening: String(item.BaseAmountOpening || ""),
        specificAmountOpeningBalanceType:item.BalanceType?.value || "",
        isNew: item?.isNew || 0,
        isSave: item.ISFirstTimeSave || item?.isSave,
        GroupName: item.GroupName?.label || "",
      };
    });

    const resp = await SaveOpeningBalance(payloadToBe);

    if (resp?.success) {
      notify(resp?.message, "success");
      setTableData([]);
    } else {
      notify(resp?.message, "error");
    }
  };

  const handleAddRow = () => { // Log separately to avoid modifying array
    
    setTableData((prevData) => [
      ...prevData, // Spread existing data
      {
        OpeningBalanceID: 0, // Set 0 for new row
        GroupCode: values?.Group?.value || "",
        GroupName: "",
        COAID: values?.AccountName?.ValueField || 0,
        AccountName: "",
        Period: "",
        FYID: values?.FinancialYear?.value || "",
        BaseAmountOpening: "",
        BalanceType: {
          label: "",
          value: "",
        },
        ISFirstTimeSave: 0,
        isNew: 1,
        isSave: 0,
      },
    ]);
  };
  

  const handleRemoveRow = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const getRowClass = (value, index) => {
    if (tableData[index]?.ISFirstTimeSave === 1) {
      return "color-indicator-7-bg";
    } else if (tableData[index]?.ISFirstTimeSave === 0) {
      return "color-indicator-2-bg";
    } else {
      return "white";
    }
  };

  const handleDataExtracted = (data) => {
    // console.log("Raw Excel Data:", data);

    // Validation: Ensure required values are selected before processing
    if (
      !values?.AccountName ||
      !values?.FinancialYear?.value ||
      !values?.Currency?.value ||
      !values?.Group?.value || 
      !values?.ConversionFactor
    ) {
      notify(
        "Please select all necessary fields before uploading the Excel Sheet",
        "error"
      );
      return;
    }

    if (!data || data.length < 2) {
      console.error("Invalid Excel Data");
      return;
    }

    // Transform data while mapping to correct column names
    const structuredData = data.slice(1).map((item, index) => ({
      OpeningBalanceID: Number(item["OPENING BALANCE"] || index + 1),
      GroupCode: item["__EMPTY"]?.trim() || "",
      GroupName: {
        label: item["__EMPTY_1"]?.trim() || "",
        value: item["__EMPTY"]?.trim() || "",
      },
      COAID: Number(item["__EMPTY_2"] || 0),
      AccountName: item["__EMPTY_3"]?.trim() || "Unnamed Account", // Ensure correct mapping
      Period: item["__EMPTY_4"]?.trim() || "FY : 01-Apr-2024 - 31-Mar-2025",
      FYID: Number(item["__EMPTY_5"] || 1),
      BaseAmountOpening: Number(item["__EMPTY_6"] || 0),
      BalanceType: {
        label: item["__EMPTY_7"]?.trim() || "Cr",
        value: item["__EMPTY_7"]?.trim() || "Cr",
      },
      ISFirstTimeSave: Number(item["__EMPTY_8"] || 1),
    }));

    // console.log("Formatted Data:", structuredData);

    setTableData(structuredData);
  };

  useEffect(() => {
    bindListData();
    getGroups();
    bindFYData();
  }, []);

  return (
    <div className="mt-2 card border">
      <Heading title={t("Upload Opening Balance")} isBreadcrumb={true} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Financial Year")}
          id="FinancialYear"
          name="FinancialYear"
          value={values?.FinancialYear}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.FYyear}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          // isDisabled={true}
          requiredClassName="required-fields"
        />
        <ReactSelect
          placeholderName={t("Currency")}
          requiredClassName="required-fields"
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
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className="form-control required-fields"
          id="ConversionFactor"
          name="ConversionFactor"
          value={values?.ConversionFactor ? values?.ConversionFactor : ""}
          // onChange={handleChange}
          onChange={(e) => {
            inputBoxValidation(AMOUNT_REGX(8), e, handleChange);
          }}
          lable={t("Conversion Factor")}
          placeholder=" "
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
          <LabeledInput
            label={t("Actual Conversion Factor")}
            value={values?.Actual ? values?.Actual : ""}
          />
        </div>
        <ReactSelect
        requiredClassName="required-fields"
          placeholderName={t("Group")}
          id="Group"
          name="Group"
          value={values?.Group?.value}
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={filterByTypes(
            group,
            [2],
            ["TypeID"],
            "TextField",
            "ValueField",
            "TypeCode"
          )}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
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
        <div
          className="pl-3 pt-2 row w-full d-flex align-items-center justify-content-end"
          style={{ marginLeft: "-15px" }}
        >
          <div className="row ml-1 mt-1 ml-2 mt-2 ml-2">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="Download"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
            <ExcelUploader
              values2={values}
              onDataExtracted={handleDataExtracted}
            />
            {/* <span onClick={handleExportExcel}> */}
            <span onClick={handleDonwload} style={{ marginLeft: "6px" }}>
              <ExcelIconSVG />{" "}
            </span>
          </div>

          {/* <div className="col-sm-1 row ml-2 mt-2" style={{ cursor: "pointer" }}>
            <ColorCodingSearch
              color={"#9DE9AB"}
              label={"Approved"}
              onClick={() => handleSearch("OPEN")}
            />
          </div>
          <div className="col-sm-1 row ml-2 mt-2" style={{ cursor: "pointer" }}>
            <ColorCodingSearch
              color={"#18A154"}
              label={"Issued"}
              onClick={() => handleSearch("CLOSE")}
            />
          </div> */}
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="card">
          <Heading title={t("Opening Balance Table")} isBreadcrumb={false} />
          <div>
            <div>
              <Tables
                style={{ maxHeight: "50vh" }}
                thead={thead}
                tbody={tableData.map((item, index) => {
                  // console.log("firstfirstfirstfirst" , group.find((g) => g.ValueField === item.GroupCode)
                  // ? {
                  //     label: group.find((g) => g.ValueField === item.GroupCode).TextField,
                  //     value: group.find((g) => g.ValueField === item.GroupCode).ValueField,
                  //   }
                  // : null)
                  const isLastRow = index === tableData.length - 1;
                  // debugger
                  return {
                    SrNo: index + 1,
                    "Add/Edit": (
                      <div
                        style={{
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                          marginBottom: "10px",
                        }}
                      >
                        {isLastRow && (
                          <div onClick={handleAddRow}>
                            
                            <PlusIconSVG />
                          </div>
                        )}
                        {item?.isNew && (
                          <div onClick={() => handleRemoveRow(index)}>
                            <CrossIconSVG />
                          </div>
                        )}
                      </div>
                    ),
                    AccountName: (
                      <Input
                        // onChange={(e) => {
                        //   inputBoxValidation(AMOUNT_REGX(8), e, handleCustomInput);
                        // }}
                        onChange={(e) =>
                          handleCustomInput(
                            index,
                            "AccountName",
                            e.target.value
                          )
                        }
                        type="text"
                        className="table-input"
                        // id="AccountName"
                        name="AccountName"
                        value={item?.AccountName}
                        respclass="w-100"
                      />
                    ),
                    "Group Name": (
                      <CustomSelect
                        // isRemoveSearchable={true}
                        placeHolder={t("Group Name")}
                        name="GroupName"
                        onChange={(name, e) => {
                          handleCustomInput(index, "GroupName", e);
                        }}
                        isRemoveSearchable={false}
                        value={item?.GroupName?.value}
                        option={filterByTypes(
                          group,
                          [2],
                          ["TypeID"],
                          "TextField",
                          "ValueField",
                          "TypeCode"
                        )}
                      />
                    ),
                    "Opening Balance": (
                      <Input
                        onChange={(e) =>
                          handleCustomInput(
                            index,
                            "BaseAmountOpening",
                            e.target.value
                          )
                        }
                        type="text"
                        className="table-input"
                        // id="OpeningBalance"
                        name="OpeningBalance"
                        value={item?.BaseAmountOpening}
                        respclass="w-100"
                        removeFormGroupClass={true}
                      />
                    ),
                    "Opening Balance Base": item?.BaseAmountOpening
                      ? item?.BaseAmountOpening
                      : "0.00",
                    BalanceType: (
                      <CustomSelect
                        placeHolder={t("Bal. Type")}
                        name="BalanceType"
                        onChange={(name, e) => {
                          handleCustomInput(index, "BalanceType", e);
                        }}
                        isRemoveSearchable={true}
                        value={item?.BalanceType?.value}
                        option={[
                          { label: "Cr", value: "Cr" },
                          { label: "Dr", value: "Dr" },
                        ]}
                      />
                    ),
                  };
                })}
                getRowClass={getRowClass}
              />
              {/* <button
                className="btn btn-sm btn-primary ml-2"
                type="Download"
                onClick={""}
              >
                {t("Balance Transfer")}
              </button> */}
              <div className="mt-2 p-2 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-primary ml-sm-2 ml-0"
                  type="submit"
                  onClick={handleUpload}
                >
                  {t("Upload Opening Balance")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadOpeningBalance;
