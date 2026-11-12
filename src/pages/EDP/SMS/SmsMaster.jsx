import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";

const SmsMaster = ({data}) => {
  const [t] = useTranslation();
  const initialValues = {};
  const [values, setValues] = useState({ ...initialValues });

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
        <ReactSelect
          placeholderName={t("SMS Template Name")}
          name="templateName"
          value={values?.templateName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("SMS Text")}
          placeholder=" "
          name="smsText"
          onChange={(e) => handleInputChange(e, 0, "smsText")}
          value={values?.smsText}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Type")}
          name="Type"
          value={values?.Type?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-1 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2"
          // style={{padding:"12px"}}
          // onClick={handleAdd}
        >
          {t("Append")}
        </button>
      </div>
      <Heading title={"Appended Data"} isBreadcrumb={false} />
      <div className="row p-2">
        <TextAreaInput
          //   id={.name}
          lable={" "}
          className="col-12"
          //   onFocus={onFocus}
          //   name={ele.name}
          //   value={ele.value}
          //   onChange={ele.handleChangeOnchange}
          placeholder=" "
          respclass="col-xl-12 col-md-12 col-sm-12 col-12"
        />
        <div
          className="d-flex justify-content-end w-100 mr-2"
          style={{ gap: "2px" }}
        >
          <button
            className=" btn btn-sm btn-success  "
            // style={{padding:"12px"}}
            // onClick={handleAdd}
          >
            {t("Remove")}
          </button>
          <button
            className=" btn btn-sm btn-success "
            // style={{padding:"12px"}}
            // onClick={handleAdd}
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsMaster;
