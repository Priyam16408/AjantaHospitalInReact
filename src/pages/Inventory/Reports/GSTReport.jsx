import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { useTranslation } from "react-i18next";
import { IssueDetail } from "../../../networkServices/InventoryApi";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  FORMATE_TYPE_OPTION,
  Report_Formate,
  Report_Formate_Pharmacy,
  REPORT_TYPE_OPTION,
} from "../../../utils/constant";
import { getGSTReport } from "../../../networkServices/BillingsApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import moment from "moment";
import { notify } from "../../../utils/utils";
import { RedirectURL } from "../../../networkServices/PDFURL";
import DatePicker from "../../../components/formComponent/DatePicker";

const GSTReport = () => {
  const [t] = useTranslation();
  const localdata = useLocalStorage("userData", "get");
  const [department, setDepartment] = useState([]);
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    departmentId: "0",
    reportType: "1",
    formateType: "1",
    Type: "2",
  };
  const [values, setValues] = useState({ ...initialValues });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleReactSelect = (name, value) => {
    setValues((prevData) => ({
      ...prevData,
      [name]: value?.value || "",
    }));
  };
  const getIssueDetail = async () => {
    try {
      const response = await IssueDetail();
      setDepartment(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
 
  const handleSearch = async () => {
    const requestBody = {
      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      department: Number(values?.departmentId) || 0,
      centreID: Number(localdata?.centreID) || 0,
      formatetype: Number(values?.formateType) || 0,
      reportType: Number(values?.reportType) || 0,
      type: Number(values?.Type) || 0,
    };
    try {
      const response = await getGSTReport(requestBody);

      if (response?.success && response?.data) {
        notify(response?.message, "success");
        RedirectURL(response?.data?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify("Something Went's Wrong", "error");
    }
  };
  useEffect(() => {
    getIssueDetail();
  }, []);
  return (
    <>
      <div className="card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          {/* <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          /> */}
          {/* <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
          /> */}
          <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("FromDate")}
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="fromDate"
          id="fromDate"
          value={values?.fromDate}
          showTime
          hourFormat="12"
          handleChange={(date) => handleChange(date, "fromDate")}
        />
          <DatePicker
          className="custom-calendar"
          placeholder=""
          lable={t("ToDate")}
          respclass={"col-xl-2 col-md-3 col-sm-6 col-12"}
          name="toDate"
          id="toDate"
          value={values?.toDate}
          showTime
          hourFormat="12"
          handleChange={(date) => handleChange(date, "toDate")}
        />
          <ReactSelect
            placeholderName={t("Department")}
            id={"departmentId"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name={"departmentId"}
            dynamicOptions={[
              { label: "All", value: "0" },
              ...department?.map((ele) => ({
                label: ele?.ledgerName,
                value: ele?.ledgerNumber,
              })),
            ]}
            value={values?.departmentId}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name={"reportType"}
            dynamicOptions={REPORT_TYPE_OPTION}
            value={values?.reportType}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Format Type")}
            id={"formateType"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name={"formateType"}
            dynamicOptions={FORMATE_TYPE_OPTION}
            value={values?.formateType}
            handleChange={handleReactSelect}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"Type"}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
            name={"Type"}
            dynamicOptions={Report_Formate_Pharmacy}
            value={values?.Type}
            handleChange={handleReactSelect}
          />
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={handleSearch}
            >
          {t("Report")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GSTReport;
