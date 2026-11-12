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
  bindVoucherBillingScreenControls,
  searchPendingPettyCashApproval,
  updatePettyCashApprovalStatus,
  UpdateRequestStatus,
} from "../../../networkServices/Pettycash";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { CancelSVG } from "../../../components/SvgIcons";
function PettyCashDeptApprovalVerification() {
  const [t] = useTranslation();
  const [PettyCash, setPettyCash] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [pettyName, setPettyName] = useState([]);
  const [values, setValues] = useState({
    center: "",
    cashChart: "",
    currency: "",
    RequestNo: "",
    approvalno: "",
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Approval No") },
    { width: "15%", name: t("Request No") },
    { width: "10%", name: t("Request Date") },

    { width: "15%", name: t("Branch Center") },
    { width: "15%", name: t("Petty Cash A/C") },
    { width: "10%", name: t("Bank/Cash  A/C ") },

    { width: "15%", name: t("Appr. Amt.") },
    { width: "15%", name: t("Voucher No") },
    { width: "10%", name: t("Verify Status ") },

    { width: "15%", name: t("Auth Status") },
    { width: "15%", name: t("Cancel") },
    { width: "10%", name: t("Verify") },
    { width: "10%", name: t("Auth") },
  ];

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

  const handleBindBackendData = async () => {
    let payload = {
      filterType: 1,
      centreID: values?.center?.value,
      coaid: 0,
    };
    let apiResp = await BindBackendData(payload);

    if (apiResp?.success) {
      setPettyName(apiResp.data);
    } else {
      // notify(apiResp?.message, "error");
    }
  };

  //  searchPendingPettyCashApproval

  const handleSearchPendingPettyCashApproval = async (isTost = true) => {
    const payload = {
      coaID: values?.center?.value,
      requestNo: values?.RequestNo,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      approvalNo: values?.approvalno,
    };
    try {
      const apiResp = await searchPendingPettyCashApproval(payload);
      if (apiResp.success) {
        console.log(apiResp);
        notify(`${apiResp?.data?.length} records found `, "success");

        setTbodyPatientDetail(apiResp?.data);
      } else { 
        setTbodyPatientDetail([]);
      }
      3;
    } catch (error) {
      console.error("Error while fetching data:", error); 
      setTbodyPatientDetail([]);
    }
  };

const ip = localStorage.getItem("ip");
const { pathname } = location;

    const handleUpdateCashApprovalRequestStatus = async (entryType,entryStatus,PCApprovalID) => {
      let payload = {
        "entryType": entryType,
        "entryStatus": entryStatus,
        "approvalID": PCApprovalID,
        "ipAddress": ip,
        "macAddress": ip,
        "pageURL":String(pathname)
      };
  
      try {
        const ReciveResp = await updatePettyCashApprovalStatus(payload);
        if (ReciveResp.success) {   
          handleSearchPendingPettyCashApproval(); 
        } else {
          notify("some error occurred", "error");
        }
      } catch (error) {
        notify("Some error occurred", "error");
      }
    };

  useEffect(() => {
    handlebindVoucherBillingScreenControls(1);
    handleBindBackendData();
  }, []);

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

          <Input
            type="text"
            className="form-control"
            id="approvalno"
            placeholder=" "
            name="approvalno"
            value={values?.approvalno || ""}
            onChange={handleChange}
            lable={t("Approval No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <DatePicker
            id="fromDate"
            name="fromDate"
             className="custom-calendar"
            lable={t("fromDate")}
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
              onClick={handleSearchPendingPettyCashApproval}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
                ApprovalNo: val?.PCApprovalNo,
                RequestNo: val?.RequestNo,
                RequestDate: val?.EntryDate,
                BranchCenter: val?.BranchCentre,
                PettyCash: val?.AccountName,
                BankCashAc: val?.BankCashCOA,
                ApprAmt: val?.ApprovalAmount,
                VoucherNo: val?.VoucherNo,
                verifyStatus: val?.IsVerify,
                AuthStatus: val?.IsAuth,
                Cancel:
                  val.IsCancel === 1 ? (
                    <span
                      onClick={() =>
                        handleUpdateCashApprovalRequestStatus(4, "Cancel", val?.PCApprovalID)
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
                          handleUpdateCashApprovalRequestStatus(
                            2,
                            val?.IsVerify,
                            val?.PCApprovalID
                          )
                        }
                      >
                        Verify
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleUpdateCashApprovalRequestStatus(
                            2,
                            val?.IsVerify,
                            val?.PCApprovalID
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
                          handleUpdateCashApprovalRequestStatus(
                            3,
                            val?.IsAuth,
                            val?.PCApprovalID
                          )
                        }
                      >
                        Auth
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleUpdateCashApprovalRequestStatus(
                            3,
                            val?.IsAuth,
                            val?.PCApprovalID
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

export default PettyCashDeptApprovalVerification;
