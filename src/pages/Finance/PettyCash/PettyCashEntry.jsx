import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
// import {ReactSelect} from "../../../components/formComponent/ReactSelect";
import {
  filterByTypes,
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  BindBackendData,
  BindMainCenter,
  bindVoucherBillingScreenControls,
  GetCOACurrentClosingBalance,
  GetCurrencyConversionFactors,
  GetSessionDate,
  SavePCDeptRequest,
  SavePCEntry,
  searchPettyCashEntry,
  SearchPettyCashRequest,
  updatePettyCashEntryStatus,
  UpdateRequestStatus,
} from "../../../networkServices/Pettycash";
import moment from "moment";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Tables from "../../../components/UI/customTable";
import { CancelSVG } from "../../../components/SvgIcons";
function PettyCashEntry() {
  const [t] = useTranslation();
  const [centerName, setBindCenter] = useState([]);
  const [pettyName, setPettyName] = useState([]);
  const [bindata, setBindData] = useState([]);
  const [coid, setCoid] = useState([]);
  const [PettyCash, setPettyCash] = useState([]);
  const [conversionFactor, setConversionFactor] = useState([]);
  const [searchPettyCash, setSearchPettycah] = useState([]);

  const [values, setValues] = useState({
    center: "",
    currency:"",
    cashInHand: "",
    department: "",
    conversionFactor: "",
    actual:"",
    documentno: "",
    entryDate: moment(new Date()).toDate(),
    documentDate: moment(new Date()).toDate(),
    expenceType:"",
    requestAmount:"",
    approveAmount:"",
    branchCenter:"",
    Remark:"",
    EntryNo:"",

  });
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBindBackendData = async () => {
    let payload = {
      filterType: 1,
      centreID: values?.center?.value,
      coaid: 0,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setCoid(apiResp.data[0].ValueField);
      setPettyName(apiResp.data);
    } else {
      // notify(apiResp?.message, "error");
    }
  };

  const displayBindBackendData = async () => {
    let payload = {
      filterType: 2,
      centreID: values?.center?.value,
      coaid: coid,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setBindData(
        apiResp.data.map((item) => ({
          ...item,
          isVerify: 0,
          isAuth: 0,
        }))
      );
    } else {
      // notify(apiResp?.message, "error");
    }
  };

  const handleGetCurrencyConversionFactosr = async () => {
    try {
      const response = await GetCurrencyConversionFactors(
        "INR",
        moment(new Date()).format("DD-MMM-YYYY")
      );

      if (response.success) {
        setConversionFactor(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleGetSessionDate = async (data) => {
    try {
      const response = await GetSessionDate(
        moment(new Date()).format("DD-MMM-YYYY")
      );

      if (response.success) {
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleBindMainCenter = async () => {
    try {
      const response = await BindMainCenter();
      if (response.success) {
        setBindCenter(response.data);
      } else {
        setBindCenter([]);
      }
    } catch (error) {
      setBindCenter([]);
    }
  };

  const handlebindVoucherBillingScreenControls = async (data) => {
    try {
      const response = await bindVoucherBillingScreenControls(data);

      // var responseData = PageChache.filter(function (i) { return i.TypeID == 13 && i.TypeCode == 'ET' });
      if (response.success) {
        const country = filterByTypes(
          response?.data,
          [4],
          ["TypeID"],
          "TextField",
          "ValueField"
        );
        if (country?.length > 0) {
          setValues((val) => ({
            ...val,
            Currency: { value: country[0]["value"] },
          }));
        }
        setPettyCash(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setPettyCash([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setPettyCash([]);
    }
  };

  const handleCOACurrentClosingBalance = async (coaId) => {
    try {
      const response = await GetCOACurrentClosingBalance(values?.center?.value);
      if (response.success) {
        // setPettyCash(response.data);
        console.log("the response is in GetCOACurrentClosingBalance", response);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setPettyCash([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setPettyCash([]);
    }
  };

  console.log("Currency", values?.Currency);
  const handleSave = async () => {
    let RecPayload = {
      pccoaid: coid,
      empMappingList: bindata
        .filter((val) => val.isChecked)
        .map((val) => ({
          pccoaid: coid,
          employeeID: val.EmployeeID,
          isVerify: val.isVerify,
          isAuth: val.isAuth,
        })),
    };

    try {
      const ReciveResp = await AccessMasterSaveMapping(RecPayload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        handleBindMainCenter();
        handleBindBackendData();
        displayBindBackendData();
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  console.log(values?.center?.value, "the center data is ");

  // Save API

  // SavePCDeptRequest

  const handleSavePettyEntry = async () => {
    let payload = {
      "entryDate": values?.entryDate,
      "deptCode": values?.department?.value,
      "coaID": coid,
      "documentNo": values?.documentno,
      "documentDate": values?.documentDate,
      "expenseTypeCode": values?.expenceType?.value,
      "requestAmount": values?.requestAmount,
      "approvedAmount": values?.approveAmount,
      "currencyCode": values?.currency?.value,
      "transCurrFactor": values?.conversionFactor,
      "actualCurrFactor": 0,
      "remarks": values?.Remark,
      "isUpdate": 0,
      "entryID": 0,
      "entryNo": "string",
      "branchCentreID": "string"
    }

    try {
      const ReciveResp = await SavePCEntry(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success"); 
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  // SearchPettyCashRequest

  const handleSearchPettyCashRequest = async () => {
    let payload = {
      entryNo: values.EntryNo,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
    };

    try {
      const ReciveResp = await searchPettyCashEntry(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.data?.length} data found`, "success");
        setSearchPettycah(ReciveResp?.data);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  const handleUpdateRequestStatus = async (
    entryType,
    entryStatus,
    entryID
  ) => {
    let payload = {
      entryType: entryType,
      entryStatus: entryStatus,
      entryID: entryID,
    };

    try {
      const ReciveResp = await updatePettyCashEntryStatus(payload);
      if (ReciveResp.success) {
        handleSearchPettyCashRequest();
      } else {
        notify("some error occurred", "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  console.log("the searchPettyCash is", searchPettyCash);

  useEffect(() => {
    handleBindMainCenter();
    handleBindBackendData();
    displayBindBackendData();
    handleGetCurrencyConversionFactosr();
    handleGetSessionDate();
    handlebindVoucherBillingScreenControls(1);
    handleCOACurrentClosingBalance();
  }, []);

  const searchPettyCashThead = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("Request No") },
    { width: "5%", name: t("Request Date") },
    { width: "5%", name: t("Branch Centre") },
    { width: "5%", name: t("Petty Cash A/C") },
    { width: "5%", name: t("Request Amount ") },
    { width: "5%", name: t("Approved Amount") },
    { width: "5%", name: t("Document No") },
    { width: "5%", name: t("Expense Type") },
    { width: "5%", name: t("Entry By") },
    { width: "5%", name: t("Verify/Auth. Status") },
    { width: "5%", name: t("Cancel") },
    { width: "5%", name: t("Verify") },
    { width: "5%", name: t("Auth") },
  ];

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Petty Cash A/C")}
            id={"center"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={filterByTypes(
              PettyCash,
              [12],
              ["TypeID"],
              "TextField",
              "ValueField",
              "STD_CODE"
            )}
            handleChange={handleSelect}
            value={`${values?.center?.value}`}
            name={"center"}
          />

          {/* <Input
            type="text"
            className="form-control"
            id="currency"
            placeholder=" "
            name="currency"
            value={values?.currency || ""}
            onChange={handleChange}
            lable={t("Currency")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> */}

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <LabeledInput  name="currency" id="currency"      lable={t("Currency")} value={values?.Currency?.value} />
          </div>

          <Input
            type="text"
            className="form-control"
            id="cashInHand"
            placeholder=" "
            name="cashInHand"
            value={values?.cashInHand || ""}
            onChange={handleChange}
            lable={t("Cash In Hand")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="entryDate"
            name="entryDate"
            lable={t("Entry Date")}
            value={values?.entryDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12" 
          />

          {/* return i.TypeID == 2 && i.TypeCode == 'D' */}

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={filterByTypes(
              PettyCash,
              [2, "D"],
              ["TypeID", "TypeCode"],
              "TextField",
              "ValueField"
            )}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />

          <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
            <LabeledInput
            name="conversionFactor"
            id="conversionFactor"
             lable={t("Conversion Factor")}
            value={conversionFactor} />
          </div>

          {/* <Input
            type="text"
            className="form-control"
            id="ClosingBalance"
            placeholder=" "
            name="ClosingBalance"
            value={values?.currency || ""}
            onChange={handleChange}
            lable={t("Request Amount")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> */}


<div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
            <LabeledInput
             lable={t("Actual")}
             name="actual"
             id="actual"
            value={conversionFactor} />
          </div>     

          <Input
            type="text"
            className="form-control"
            id="documentno"
            placeholder=" "
            name="documentno"
            value={values?.documentno || ""}
            onChange={handleChange}
            lable={t("Document No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="documentDate"
             className="custom-calendar"
            name="documentDate"
            lable={t("Document Date")}
            value={values?.documentDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // maxDate={values?.toDate}
          />

          <ReactSelect
            placeholderName={t("Expense Type")}
            id={"expenceType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={handleReactSelectDropDownOptions(
            //   centerName,
            //   "CentreName",
            //   "MainCentreID"
            // )}

            dynamicOptions={filterByTypes(
              PettyCash,
              [13],
              ["ET"],

            )}
            handleChange={handleSelect}
            value={`${values?.expenceType?.value}`}
            name={"expenceType"}
          />

          <Input
            type="text"
            className="form-control"
            id="requestAmount"
            placeholder=" "
            name="requestAmount"
            value={values?.requestAmount || ""}
            onChange={handleChange}
            lable={t("Request Amount")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

<Input
            type="text"
            className="form-control"
            id="approveAmount"
            placeholder=" "
            name="approveAmount"
            value={values?.approveAmount || ""}
            onChange={handleChange}
            lable={t("Approved Amount")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />


<ReactSelect
            placeholderName={t("Branch Center")}
            id={"branchCenter"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={handleReactSelectDropDownOptions(
              centerName,
              "CentreName",
              "MainCentreID"
            )}
            handleChange={handleSelect}
            value={`${values?.center?.value}`}
            name={"branchCenter"}
          />

          <Input
            type="text"
            className="form-control"
            id="Remark"
            placeholder=" "
            name="Remark"
            value={values?.currency || ""}
            onChange={handleChange}
            lable={t("Remark")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSavePettyEntry}
            >
              {t("Save")}
            </button>
          </div>
        </div>

        <Heading title={t("/Reuest List")} isBreadcrumb={true} />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="EntryNo"
            placeholder=" "
            name="EntryNo"
            value={values?.EntryNo || ""}
            onChange={handleChange}
            lable={t("Entry No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="fromDate"
             className="custom-calendar"
            name="fromDate"
            lable={t("From Date")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="toDate"
             className="custom-calendar"
            name="toDate"
            lable={t("To Date")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSearchPettyCashRequest}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {searchPettyCash.length > 0 && (
          <div className="card">
            <Tables
              thead={searchPettyCashThead}
              tbody={searchPettyCash?.map((val, index) => ({
                sno: index + 1,
                requestNo: val.PCEntryNo,
                requestDate: val.PCEntryDate,
                BranchCenter: val.BranchCentre,
                pettyCash: val.AccountName,
                Amount: val.RequestAmount,
                ApprovalAmount: val.ApprovedAmount,
                DocumentNo:val.DocumentNo,
                ExpenseType: val.ExpenseType,
                EntryBy: val.EntryBy,
                VerifyStatus: `${val.IsVerify} / ${val.IsAuth}`,
                Cancel:
                  val.IsCancelEdit === 1 ? (
                    <span
                      onClick={() =>
                        handleUpdateRequestStatus(4, "Cancel", val?.PCEntryID)
                      }
                    >
                      <CancelSVG />
                    </span>
                  ) : (
                    ""
                  ),
                verify:
                  val.IsVerifyEdit === 1 ? (
                    val.IsVerify === "No" ? (
                      <span
                        onClick={() =>
                          handleUpdateRequestStatus(
                            2,
                            val?.IsVerify,
                            val?.PCEntryID
                          )
                        }
                      >
                        Verify
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleUpdateRequestStatus(
                            2,
                            val?.IsVerify,
                            val?.PCEntryID
                          )
                        }
                      >
                        Un-Verify
                      </span>
                    )
                  ) : null,

                auth:
                  val.IsAuthEdit === 1 ? (
                    val.IsAuth === "No" ? (
                      <span
                        onClick={() =>
                          handleUpdateRequestStatus(
                            3,
                            val?.IsAuth,
                            val?.RequestID
                          )
                        }
                      >
                        Auth
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleUpdateRequestStatus(
                            3,
                            val?.IsAuth,
                            val?.RequestID
                          )
                        }
                      >
                        Un-Auth
                      </span>
                    )
                  ) : null,
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PettyCashEntry;
