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
  SavePCRequestApproval,
  SearchPendingPettyCashRequest,
} from "../../../networkServices/Pettycash";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { FaSearch } from "react-icons/fa";
import LabeledInput from "../../../components/formComponent/LabeledInput";
function PettyCashDeptApproval() {
  const [t] = useTranslation();
  const [coid, setCoid] = useState("0");
  const [centerName, setBindCenter] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showData, setShowData] = useState(false);
  const [BankCash, setBankCash] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [CtrlId, setCtrlId] = useState([]);

  const [closingBalance, setClosingBalance] = useState([]);

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState("");
  const [PettyCash, setPettyCash] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [values, setValues] = useState({
    center: { value: "0", label: "ALL" },
    cashChart: "",
    currency: "",
    requestNo: "",
    bankCash: "",
    requestId: "",
    requestDate: "",
    refNo: "",
    remark: "",
    paymentMode: "",
    approvalAmount: singleData?.RequestAmount || "",
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleBindBackendData = async () => {
    let payload = {
      filterType: 1,
      centreID: values?.center?.value,
      coaid: 0,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setCoid(apiResp.data[0].ValueField);
    } else {
    }
  };

  console.log("the bankCash is", values?.bankCash?.value);
  // setCtrlId(values?.bankCash?.value);

  const handleSearchPendingPettyCashRequest = async () => {
    const payload = {
      coaID: coid,
      requestNo: values?.requestNo,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
    };
    try {
      const apiResp = await SearchPendingPettyCashRequest(payload);
      if (apiResp.success) {
        console.log("the api response is", apiResp);
        setTableData(apiResp?.data);
      } else {
        notify("No records found", "error");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTableData([]);
    }
  };

  const HandleViewData = (val, ind) => {
    const ViewData = tableData[ind];
    setShowData(true);
    setSingleData(ViewData);
    console.log("the single data is", singleData);
    setSelectedCurrencyCode(ViewData?.CurrencyCode);
    // setCtrlId(ViewData?.BranchCentreID);
  };

  // console.log("the bankCash api ",values?.bankCash?.value);
  const tableHeadData = [
    { width: "10%", name: t("SNo") },
    { width: "10%", name: t("Request No") },
    { width: "10%", name: t("Request Date") },
    { width: "15%", name: t("Branch Centre") },
    { width: "15%", name: t("Petty Cash A/C") },

    { width: "15%", name: t("Department") },
    { width: "15%", name: t("Entry By") },
    { width: "15%", name: t("Auth. By") },
    { width: "15%", name: t("Auth Date") },
    { width: "5%", name: t("View") },
  ];


  const handleGetCOACurrentClosingBalance = async () => {
    try {
      const response = await GetCOACurrentClosingBalance(coid)
      console.log("the response from data is", response);
      setClosingBalance(response?.data[0]?.ClosingBal);
      console.log("the closing balance is", response?.data[0]?.ClosingBal);
    }
    catch (error) {
      console.error("Error fetching department data:", error);

    }
  }

  const handlebindVoucherBillingScreenControls = async (data) => {
    try {
      const response = await bindVoucherBillingScreenControls(data);
      if (response.success) {
        setPettyCash(response.data);

        const bankCashData = response?.data?.filter((i, ind) => {
          return (
            i.TypeID == 5 &&
            i.ReqAreaCode == selectedCurrencyCode &&
            (i.DeptCode.substring(0, 7) == "1002003" ||
              i.DeptCode.substring(0, 7) == "1002004")
          );
        });

        console.log(
          "the bankCash console is",
          values?.bankCash,
          "and the value is",
          values?.bankCash?.value
        );

        const PaymentCash = response?.data?.filter((i, ind) => {
          return i.TypeID == "10" && i.ValueField == values?.bankCash?.value;
        });

        handleBindBackendData();

        handleGetCOACurrentClosingBalance();
        setBankCash(bankCashData);
        setPaymentMode(PaymentCash);
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

  // SavePCRequestApproval

  const handleSavePCRequestApproval = async () => {
    const payload = {
      requestID: Number(singleData?.RequestID),
      requestNo: String(singleData?.RequestNo),
      requestDate: singleData?.RequestDate,
      deptCode: String(singleData?.DepartmentCode),
      pcCOAID: singleData?.PCCOAID,
      bankCashCOAID: coid,
      specificAmount: "122",
      currencyCode: String(singleData?.CurrencyCode),
      transCurrFactor: String(singleData?.TransCurrFactor),
      actualCurrFactor: String(singleData?.ActualCurrFactor),
      remarks: values?.remark,
      refNo: values?.refNo,
      refDate: String(singleData?.RequestDate),
      paymentModeID: 0,
      paymentMode: "string",
      branchcentreid: singleData?.BranchCentreID,
    };
    try {
      const apiResp = await SavePCRequestApproval(payload);
      if (!apiResp.success) {
        notify("Some error occurs", "error");
      } else {
        notify("Record Save SuccessFully...");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  useEffect(() => {
    // SearchCenterName();
    handleBindMainCenter();
    handleBindBackendData();
  }, [values]);

  useEffect(() => {
    handlebindVoucherBillingScreenControls("1");
  }, [showData, values?.bankCash]);

  console.log("the bankcash value data  is ", BankCash);
  console.log("the PaymentMode data is", PaymentMode);
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
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                centerName,
                "CentreName",
                "MainCentreID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.center?.value}`}
            name={"center"}
          />
          <Input
            type="text"
            className="form-control"
            id="requestNo"
            placeholder=" "
            name="requestNo"
            value={values?.requestNo || ""}
            onChange={handleChange}
            lable={t("Request No.")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />
          <DatePicker
            id="fromDate"
            name="fromDate"
             className="custom-calendar"
            lable={t("fromdate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            maxDate={values?.todate}
          />
          <DatePicker
            id="todate"
            name="todate"
             className="custom-calendar"
            lable={t("todate")}
            value={values?.todate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            maxDate={values?.fromdate}
          />
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-lg btn-success"
              type="button"
              onClick={handleSearchPendingPettyCashRequest}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="card">
          <Tables
            thead={tableHeadData}
            tbody={tableData.map((val, index) => ({
              sno: index + 1,
              RequestNo: val.RequestNo,
              RequestDate: val.RequestDate,
              BranchCentre: val.BranchCentre,
              PettyCash: val.BranchCentre,
              Department: val?.DepartmentName,
              EntryBy: val?.EntryBy,
              AuthBy: val?.AuthBy,
              AuthDate: val?.AuthDate,
              View: <FaSearch onClick={() => HandleViewData("_", index)} />,
            }))}
          />
        </div>
      )}

      {showData ? (
        <div>
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <LabeledInput
                label={t("Request No")}
                value={singleData?.RequestNo}
                name="requestId"
                id="requestId"
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Request Date")}
                value={singleData?.RequestDate}
                name="requestDate"
                id="requestDate"
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Department")}
                value={singleData?.DepartmentName}
                name="department"
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Petty Cash A/C")}
                value={singleData?.AccountName}
                name="accountName"
                id="accountName"
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Currency")}
                value={singleData?.CurrencyCode}
                name="currencyCode"
                id="currencyCode"
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Branch Centre")}
                value={singleData?.BranchCentre}
              />
            </div>
            {/* 
            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2">
              <LabeledInput
                label={t("Approval Amount")}
                value={singleData?.RequestAmount}
                name="requestAmount"
              />
            </div> */}

            <Input
              type="text"
              className="form-control"
              id="approvalAmount"
              placeholder=" "
              name="approvalAmount"
              value={singleData?.RequestAmount}
              onChange={handleChange}
              lable={t("Approval Amount")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-2"
            />

            <ReactSelect
              placeholderName={t("Bank/Cash A/C")}
              id={"bankCash"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 mt-2"
              // dynamicOptions={[BankCash]}
              dynamicOptions={handleReactSelectDropDownOptions(
                BankCash,
                "TextField",
                "ValueField"
              )}
              handleChange={handleSelect}
              value={`${values?.bankCash?.value}`}
              name={"bankCash"}
            />

            <div className="col-xl-2 col-md-4 col-sm-4 col-12  mt-2 ">
              <LabeledInput
                label={t("Currency / C.F.")}
                value={singleData?.TransCurrFactor}
              />
            </div>

            <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-2">
              <LabeledInput
                label={t("Available Balance")}
                value={closingBalance}
              />
            </div>

            <Input
              type="text"
              className="form-control"
              id="refNo"
              placeholder=" "
              name="refNo"
              value={values?.refNo || ""}
              onChange={handleChange}
              lable={t("Ref No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-2"
            />

            <Input
              type="text"
              className="form-control"
              id="remark"
              placeholder=" "
              name="remark"
              value={values?.remark || ""}
              onChange={handleChange}
              lable={t("Remark")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12 mt-2"
            />

            <ReactSelect
              placeholderName={t("Payment Mode")}
              id={"paymentMode"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={handleReactSelectDropDownOptions(
                PaymentMode,
                "TextField",
                "TypeID"
              )}
              handleChange={handleSelect}
              value={`${values?.paymentMode?.value}`}
              name={"paymentMode"}
            />

            <div className="col-sm-2 col-xl-1">
              <button
                className="btn btn-lg btn-success"
                type="button"
                onClick={handleSavePCRequestApproval}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default PettyCashDeptApproval;
