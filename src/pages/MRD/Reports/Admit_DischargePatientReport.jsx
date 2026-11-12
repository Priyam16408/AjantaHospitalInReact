import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";

const Admit_DischargePatientReport = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const initialValues = {
    SearchByName: "",
    fromDate: new Date(),
    fromTime: new Date(),
    toDate: new Date(),
    toTime: new Date(),
    billNo: "",
    reportType: "",
    printType: "",
    listType: "",
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const [values, setValues] = useState({ ...initialValues });
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
       
          <ReactSelect
            placeholderName={t("List Type")}
            id={"listType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { value: "Admission", label: "Admission" },
              { value: "Discharged", label: "Discharged" },
            ]}
            name="listType"
            handleChange={handleReactSelectChange}
            value={values.listType}
            // value={values.}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
          />
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { value: t("Bed Category Wise"), label: "Bed Category Wise" },
              { value: t("Consultant Wise"), label: "Consultant Wise" },
              { value: t("Date Wise"), label: "Date Wise" },
              { value: t("Department Wise"), label: "Department Wise" },
              { value: t("Floor Wise"), label: "Floor Wise" },
              { value: t("Panel Company Wise"), label: "Panel Company Wise" },
            ]}
            name="reportType"
            handleChange={handleReactSelectChange}
            value={values.reportType}
          />
           <Input
            type="text"
            className="form-control"
            id="SearchByName"
            lable={t("Search By Name")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="SearchByName"
            value={values.SearchByName}
            onChange={handleChange}
          />
           <ReportsMultiSelect
            name="type"
            placeholderName={t("Type")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName="required-fields"
          /> 
          <ReportsMultiSelect
          name="centre"
          placeholderName={t("Centre")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={GetEmployeeWiseCenter}
          labelKey="CentreName"
          valueKey="CentreID"
          requiredClassName="required-fields"
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
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Admit_DischargePatientReport;
