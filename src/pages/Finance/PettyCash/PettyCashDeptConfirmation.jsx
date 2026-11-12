import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
// import {ReactSelect} from "../../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import {
  SearchPendingPettyCashApproval,
  UpdatePettyCashApprovalStatus,
} from "../../../networkServices/Pettycash";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
function PettyCashDeptApprovalVerification() {
  const [t] = useTranslation();
  const [centerName, setCenterName] = useState([]);

  const [values, setValues] = useState({
    requestno: "",
    approvalNo: "",
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [pettyCashApproval, setPettyCashApproval] = useState([]);

  const tableHeadData = [
    { width: "10%", name: t("SNo") },
    { width: "10%", name: t(" Approval No") },
    { width: "10%", name: t("Request No") },
    { width: "10%", name: t("Voucher No") },

    { width: "10%", name: t("Request Date") },
    { width: "15%", name: t("Branch Centre") },
    { width: "15%", name: t("Petty Cash A/C") },

    { width: "15%", name: t("Approval Amount") },
    { width: "15%", name: t("Auth Status") },
    { width: "15%", name: t("Confirm Status") },
    { width: "15%", name: t("Auth Date") },
    { width: "15%", name: t("Auth By") },
    { width: "15%", name: t("Confirm By") },
    { width: "15%", name: t("Confirm") },
  ];

  const handleSearchPendingPettyCashApproval = async () => {
    const payload = {
      coaID: 0,
      requestNo: values?.requestno,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      approvalNo: values?.approvalNo,
    };
    try {
      const apiResp = await SearchPendingPettyCashApproval(payload);
      if (apiResp.success) {
        console.log("the api response is", apiResp);
        setPettyCashApproval(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
        setPettyCashApproval([]);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
      setPettyCashApproval([]);
    }
  };
  const ip = localStorage.getItem("ip");

  const handleUpdatePettyCashApprovalStatus = async (id) => {
    const data = pettyCashApproval[id];
    console.log("the data in handleUpdatePettyCashApprovalStatus ",data)
    const payload = {
      entryType: 5,
      entryStatus: data?.IsConfirm,
      approvalID: data?.PCApprovalID,
      ipAddress: ip,
      macAddress: "string",
      pageURL: "string",
    };
    try {
      const apiResp = await UpdatePettyCashApprovalStatus(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        handleSearchPendingPettyCashApproval();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
      setPettyCashApproval([]);
    }
  };

  const SearchCenterName = async () => {
    try {
      const response = await BindDepartmentCountDetail();
      if (response.success) {
        console.log("the department data is", response);
        setCenterName(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setCenterName([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setCenterName([]);
    }
  };

  useEffect(() => {
    SearchCenterName();
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
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                centerName,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.center?.value}`}
            name={"center"}
          />

          <Input
            type="text"
            className="form-control"
            id="requestno"
            placeholder=" "
            name="requestno"
            value={values?.requestno || ""}
            onChange={handleChange}
            lable={t("Request No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="approvalno"
            placeholder=" "
            name="approvalNo"
            value={values?.approvalNo || ""}
            onChange={handleChange}
            lable={t("Approval No")}
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
              onClick={handleSearchPendingPettyCashApproval}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        {pettyCashApproval.length > 0 && (
          <div className="card">
            <Tables
              thead={tableHeadData}
              tbody={pettyCashApproval.map((val, index) => ({
                sno: index + 1,
                PCApprovalNo: val.PCApprovalNo,
                RequestNo: val.RequestNo,
                VoucherNo: val.VoucherNo,
                RequestDate: val.RequestDate,
                BranchCentre: val?.BranchCentre,
                AccountName: val?.AccountName,
                ApprovalAmount: val?.ApprovalAmount,
                IsAuth: val?.IsAuth,
                IsConfirm: val?.IsConfirm,
                AuthDate: val?.AuthDate,
                AuthBy: val?.AuthBy,
                ConfirmBy: val?.ConfirmBy,
                IsConfirmEdit:
                  val?.IsConfirm == "No" ? (
                    <span onClick={()=>handleUpdatePettyCashApprovalStatus(index)} style={{ color: "blue", fontWeight: "bold" }}>
                      Confirm
                    </span>
                  ) : (
                    <span onClick={()=>handleUpdatePettyCashApprovalStatus(index)} style={{ color: "blue", fontWeight: "bold" }}>
                      Un-Confirm
                    </span>
                  ),
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default PettyCashDeptApprovalVerification;
