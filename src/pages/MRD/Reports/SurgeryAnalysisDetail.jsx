import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import { FromAgesTOAges } from "../../../utils/constant";

const SurgeryAnalysisDetail = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter, GetDepartmentList } = useSelector(
    (state) => state.CommonSlice
  );

  const initialValues = {
    centre: [],
    printType: "",
    fromDate: new Date(),
    toDate: new Date(),
    reportType:""
  };
  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
 
  const handleMRDReport = () => {};
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row p-2 justify-content-centers">
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="From Date"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            values={values}
            setValues={setValues}
          />
          <div className="d-flex ">
          <Input type="checkbox" className="mt-2 mx-2"/>
          <label className="mt-1">BillDate</label>
          </div>
          
        <ReactSelect
          placeholderName={t("Report Type")}
          id="reportType"
          searchable
          respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
          dynamicOptions={[
            { label: "Detail Report", value: "Detail Report" },
            { label: "Doctor Wise Summary", value: "Doctor Wise Summary" },
            { label: "Department Wise Summary", value: "Department Wise Summary" },
          ]}
          value={values.reportType}
          name="reportType"
          handleChange={ handleReactSelectChange}
        />
          <ReportPrintType
            placeholderName={t("Print Type")}
            id="printType"
            searchable
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            values={values}
            name={"printType"}
            setValues={setValues}
          />

          <div className="box-inner text-center">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleMRDReport}
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default SurgeryAnalysisDetail;
