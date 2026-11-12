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
  SearchPettyCashRequest,
  UpdateRequestStatus,
} from "../../../networkServices/Pettycash";
import moment from "moment";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Tables from "../../../components/UI/customTable";
import {CancelSVG } from "../../../components/SvgIcons";
function PettyCashAccessMaster() {
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
    cashChart: "",
    department: "",
    RequestNo: "",
    remarks: "",
    requestAmount: "",
    currencyCode: "",
    conversionFactor: "",
    branchCenter: "",
    RequestDate: moment(new Date()).toDate(),
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
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
        console.log("No Record Found");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  // Save API

  // SavePCDeptRequest

  const handleSavePCDeptRequest = async () => {
    let payload = {
      coaID: values?.center?.value,
      deptCode: values?.branchCenter?.value,
      requestDate: moment(values?.requestDate).format("YYYY-MMM-DD"),
      specificAmount: values?.requestAmount,
      currencyCode: values?.currencyCode,
      transCurrFactor: 1,
      actualCurrFactor: 1,
      remarks: values?.remarks,
      branchcentreid: values?.department?.value,
    };

    try {
      const ReciveResp = await SavePCDeptRequest(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.message}`, "success");
        setValues({});
      } else {
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  // SearchPettyCashRequest

  const handleSearchPettyCashRequest = async () => {
    let payload = {
      requestNo: values.RequestNo,
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
    };

    try {
      const ReciveResp = await SearchPettyCashRequest(payload);
      if (ReciveResp.success) {
        notify(`${ReciveResp?.data?.length} data found`, "success");
        setSearchPettycah(ReciveResp?.data);
      } else {
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

  const handleUpdateRequestStatus = async (
    entryType,
    entryStatus,
    RequestID
  ) => {
    let payload = {
      entryType: entryType,
      entryStatus: entryStatus,
      requestID: RequestID,
    };

    try {
      const ReciveResp = await UpdateRequestStatus(payload);
      if (ReciveResp.success) {
        handleSearchPettyCashRequest();
      } else {
        notify(ReciveResp?.message, "error");
      }
    } catch (error) {
      notify("Some error occurred", "error");
    }
  };

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
    { width: "5%", name: t("Amount ") },
    { width: "5%", name: t("Entry Date") },
    { width: "5%", name: t("Entry By") },
    { width: "5%", name: t("Verify Status") },
    { width: "5%", name: t("Auth Status") },
    { width: "5%", name: t("Cancel") },
    { width: "5%", name: t("Verify") },
    { width: "5%", name: t("Auth") },
  ];
  const { VITE_DATE_FORMAT } = import.meta.env;
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
            <LabeledInput name="currencyCode" value={values?.Currency?.value} />
          </div>

          <Input
            type="text"
            className="form-control"
            id="ClosingBalance"
            placeholder=" "
            name="ClosingBalance"
            value={values?.currency || ""}
            onChange={handleChange}
            lable={t("Closing Balance")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            className="custom-calendar"
            id="RequestDate"
            name="requestDate"
            lable={t("Request Date")}
            value={values?.requestDate ? moment(values.requestDate).toDate() : null}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            // respclass="col-xl-2 col-md-4 col-lg-4 col-12"
            maxDate={new Date()}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4  col-12"
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

          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <LabeledInput
            className={"my-sm-0 my-1"}
              name="conversionFactor"
              label={t("conversion Factor")}
              value={conversionFactor} />
          </div>

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
            value={`${values?.branchCenter?.value}`}
            name={"branchCenter"}
          />

          <Input
            type="text"
            className="form-control"
            id="remarks"
            placeholder=" " 
            name="remarks"
            value={values?.remarks || ""}
            onChange={handleChange}
            lable={t("Remark")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSavePCDeptRequest}
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
            id="RequestNo"
            placeholder=" "
            name="RequestNo"
            value={values?.RequestNo || ""}
            onChange={handleChange}
            lable={t("Request No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="fromDate"
             className="custom-calendar"
            name="fromDate"
            lable={t("From Date")}
            value={values?.fromDate ? moment(values.fromDate).toDate() : new Date}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            value={values?.toDate ? moment(values.toDate).toDate() : new Date}
            maxDate={new Date()}
            placeholder={VITE_DATE_FORMAT}
            showTime
            hourFormat="12"

            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // maxDate={new Date()}
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
                requestNo: val.RequestNo,
                requestDate: val.RequestDate,
                BranchCenter: val.BranchCentreID,
                pettyCash: val.AccountName,
                Amount: val.RequestAmount,
                EntryDate: val.EntryDate,
                EntryBy: val.EntryBy,
                VerifyStatus: val.IsVerify,
                AuthStatus: val.IsAuth,
                Cancel:
                  val.IsCancel === 1 ? (
                    <span
                      onClick={() =>
                        handleUpdateRequestStatus(4, "Cancel", val?.RequestID)
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
                            val?.RequestID
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
                            val?.RequestID
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

export default PettyCashAccessMaster;
