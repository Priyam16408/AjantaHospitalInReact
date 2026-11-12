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

const LabCountDetails = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter, GetDepartmentList } = useSelector(
    (state) => state.CommonSlice
  );

  const initialValues = {
    centre: [],
    reportType: "",
    type: "",
    fromDate: new Date(),
    toDate: new Date(),
    IPDNo: "",
    UHID: "",
    countType: "",
    Department: "",
    labType: "",
    Name: "",
    ageFrom: "",
    ageTo: "",
    ddlAgeFrom: { value: "YRS", label: "YRS" },
    ddlAgeTo: { value: "YRS", label: "YRS" },
    gender: "",
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
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
          />
          <ReactSelect
            placeholderName={t("Count Type")}
            id={"countType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "ALL" },
              { label: "Advance", value: "1" },
              { label: "Balance", value: "2" },
            ]}
            name="countType"
            value={values.countType}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t(
              "Department"
            )}
            id={"Department"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                GetDepartmentList,
                "Name",
                "ID"
              ),
            ]}
            handleChange={handleReactSelectChange}
            value={values?.Department}
            name={"Department"}
          />
          <ReactSelect
            placeholderName={t("Lab Type")}
            id={"labType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "ALL" },
              { label: "IPD", value: "IPD" },
              { label: "OPD", value: "OPD" },
              { label: "Emergency", value: "Emergency" },
            ]}
            name="labType"
            value={values.labType}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="AppointmentNo"
            lable={t("Name")}
            placeholder=" "
            // required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="Name"
            value={values.Name}
            onChange={handleChange}
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="row">
              <Input
                type="text"
                className="form-control"
                id="ageFrom"
                name="ageFrom"
                value={values?.ageFrom ? values?.ageFrom : ""}
                onChange={handleChange}
                lable={t("From Age")}
                placeholder=" "
                respclass="col-md-6 col-7"
                showTooltipCount={true}
              />
              <ReactSelect
                placeholderName="Year"
                name="ddlAgeFrom"
                value={`${values?.ddlAgeFrom?.value}`}
                dynamicOptions={FromAgesTOAges}
                handleChange={handleReactSelectChange}
                searchable={true}
                id={"ddlAgeFrom"}
                respclass="col-md-6 col-5"
              />
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12">
            <div className="row">
              <Input
                type="text"
                className="form-control"
                id="ageTo"
                name="ageTo"
                value={values?.ageTo ? values?.ageTo : ""}
                onChange={handleChange}
                lable={t("To Age")}
                placeholder=" "
                respclass="col-md-6 col-7"
                showTooltipCount={true}
              />
              <ReactSelect
                placeholderName="Year"
                name="ddlAgeTo"
                value={`${values?.ddlAgeTo?.value}`}
                handleChange={handleReactSelectChange}
                dynamicOptions={FromAgesTOAges}
                searchable={true}
                id={"ddlAgeTo"}
                respclass="col-md-6 col-5"
              />
            </div>
          </div>
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("FrontOffice.OPD.Report.CollectionReport.fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("FrontOffice.OPD.Report.CollectionReport.toDate")}
            values={values}
            setValues={setValues}
          />

          <ReactSelect
            placeholderName={t("Gender")}
            id={"gender"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Both", value: "Both" },
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            name="gender"
            value={values.gender}
            handleChange={handleReactSelectChange}
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
export default LabCountDetails;
