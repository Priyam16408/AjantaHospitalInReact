import React, { useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import TimePicker from "../../../components/formComponent/TimePicker";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";

const EmailTemplateMaster = ({ data }) => {
  const [t] = useTranslation();

  const [values, setValues] = useState({});

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
        data={data}
        isBreadcrumb={true}
        isSlideScreen={false}
      />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Email Subject")}
          placeholder=" "
          //   id="ItemName"
          name="EmailSubject"
          onChange={(e) => handleInputChange(e, 0, "EmailSubject")}
          value={values?.EmailSubject}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Status")}
          name="Status"
          value={values?.Status?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "Inactive", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Schedule Type")}
          name="ScheduleType"
          value={values?.ScheduleType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Select", value: "0" },
            { label: "Daily", value: "1" },
            { label: "Monthly", value: "2" },
            { label: "Run Time", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <TimePicker
          lable={t("Time")}
          name="Time"
          value={values?.Time ? values?.Time : new Date()}
          handleChange={(e) => handleInputChange(e, 0, "Time")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {/* <div className="col-xl-2 col-md-4 col-sm-4 col-12"> */}
          <DatePicker
            className="custom-calendar"
            lable={t("Date")}
            name="Date"
            value={values?.Date ? values?.Date : new Date()}
            handleChange={(e) => handleInputChange(e, 0, "Date")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12 w-100"
          />
        {/* </div> */}
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Email Subject")}
          placeholder=" "
          //   id="ItemName"
          name="EmailSubject"
          onChange={(e) => handleInputChange(e, 0, "EmailSubject")}
          value={values?.EmailSubject}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Schedule Type")}
          name="ScheduleType"
          value={values?.ScheduleType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Select", value: "0" },
            { label: "Minutes", value: "Minutes" },
            { label: "Hours", value: "Hours" },
            { label: "Days", value: "Days" },
            { label: "Months", value: "Months" },
            { label: "Week", value: "Week" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Panel Wise")}
          name="PanelWise"
          value={values?.PanelWise?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Yes", value: "1" },
            { label: "No", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {/* <div className="d-flex justify-content-end w-100"> */}
        <button className="btn btn-sm btn-success mx-2" type="button">
          {t("Save")}
        </button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default EmailTemplateMaster;
