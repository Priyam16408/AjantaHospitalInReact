import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";

const SmsReport = ({data}) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const initialState = {};
  const [values, setValues] = useState({ ...initialState });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
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
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <DatePicker
          id="Fromdate"
          className={"w-100"}
          name="Fromdate"
          placeholder={VITE_DATE_FORMAT}
          value={values?.Fromdate}
          lable={t("From Date")}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          handleChange={handleChange}
        />
        <DatePicker
          id="Todate"
          className={"w-100"}
          name="Todate"
          placeholder={VITE_DATE_FORMAT}
          value={values?.Todate}
          lable={t("To Date")}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          handleChange={handleChange}
        />
        <ReactSelect
          placeholderName={t("Report Type")}
          name="ReportType"
          value={values?.ReportType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2"
          // style={{padding:"12px"}}
          // onClick={handleAdd}
        >
          {t("Search")}
        </button>
      </div>
      <Heading title={"Delivery Status"} isBreadcrumb={false} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("SMS Response")}
          placeholder=" "
          name="response"
          onChange={(e) => handleInputChange(e, 0, "response")}
          value={values?.response}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2"
          // style={{padding:"12px"}}
          // onClick={handleAdd}
        >
          {t("Get Delivery Status")}
        </button>
      </div>
    </div>
  );
};

export default SmsReport;
