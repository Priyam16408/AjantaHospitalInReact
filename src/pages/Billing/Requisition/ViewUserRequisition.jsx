import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ViewRequisitionTable from "../../../components/UI/customTable/requisitionTable/ViewRequisitionTable";
import moment from "moment";
import { ViewRequisition } from "../../../networkServices/InventoryApi";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";
import Heading from "../../../components/UI/Heading";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";

const ViewUserRequisition = ({ storetype }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const [viewReqDetails, setViewReqDetails] = useState([]);
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    RequisitionNo: "",
  };
  const [payload, setPayload] = useState({ ...initialValues });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSearchViewReqDetails = async (item = "") => {
    const requestBody = {
      deptLedgerNo: String(localData?.deptLedgerNo),
      toDate: moment(payload?.toDate).format("YYYY-MM-DD"),
      fromDate: moment(payload?.fromDate).format("YYYY-MM-DD"),
      indentNo: payload?.RequisitionNo || "",

      approvalRequired: 1,
      department: 0,
      status: item ? item : "",
      storeType: storetype,
    };

    try {
      const response = await ViewRequisition(requestBody);
      let data = response?.data?.filter(
        (val) => val?.StatusNew === item || item === ""
      );
      if (data?.length === 0) {
        notify("Data not Found", "error");
      }
      if (response?.data) {
        setViewReqDetails(data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something Went Wrong", error);
    }
  };

  const ViewRequisitionHead = [
    { name: t("S.No."), width: "3%" },
    t("From Center"),
    { name: t("RequisitionDate"), width: "7%" },
    { name: t("RequisitionNo"), width: "10%" },
    t("DepartmentTo"),
    t("DepartmentFrom"),
    { name: t("View"), width: "3%" },
    { name: t("Print"), width: "3%" },
  ];
  const handleCallViewMedReq = (item) => {
    handleSearchViewReqDetails(item);
  };

  return (
    <div className="card">
      <Heading
        title={t("Search Item")}
        secondTitle={
          <>
            <ColorCodingSearch
              color={"color-indicator-11-bg"}
              label={t("Close")}
              onClick={() => {
                handleCallViewMedReq("CLOSE");
              }}
            />

            <ColorCodingSearch
              color={"color-indicator-16-bg"}
              label={t("Pending")}
              onClick={() => {
                handleCallViewMedReq("OPEN");
              }}
            />

            <ColorCodingSearch
              color={"color-indicator-1-bg"}
              label={t("Approved")}
              onClick={() => {
                handleCallViewMedReq("APPROVED");
              }}
            />

            <ColorCodingSearch
              color={"color-indicator-2-bg"}
              label={t("Rejected")}
              onClick={() => {
                handleCallViewMedReq("REJECT");
              }}
            />

            <ColorCodingSearch
              color={"color-indicator-19-bg"}
              label={t("Issued")}
              onClick={() => {
                handleCallViewMedReq("ISSUED");
              }}
            />

            <ColorCodingSearch
              color={"color-indicator-4-bg"}
              label={t("Partial")}
              onClick={() => {
                handleCallViewMedReq("PARTIAL");
              }}
            />
          </>
        }
      />
      <div className="row p-2">
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={
            payload.fromDate
              ? moment(payload?.fromDate, "YYYY-MM-DD").toDate()
              : null
          }
          handleChange={handleChange}
          lable={t("fromDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="toDate"
          name="toDate"
          value={
            payload.toDate
              ? moment(payload?.toDate, "YYYY-MM-DD").toDate()
              : null
          }
          handleChange={handleChange}
          lable={t("toDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <Input
          type="text"
          className="form-control"
          lable={t("RequisitionNo")}
          placeholder=" "
          id="RequisitionNo"
          name="RequisitionNo"
          onChange={handleChange}
          value={payload?.RequisitionNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <div className="col-sm-1">
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleSearchViewReqDetails("")}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      <ViewRequisitionTable
        THEAD={ViewRequisitionHead}
        tbody={viewReqDetails}
        handleSearchViewReqDetails={handleSearchViewReqDetails}
      />
    </div>
  );
};

export default ViewUserRequisition;
