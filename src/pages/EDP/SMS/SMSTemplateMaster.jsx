import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";

const SMSTemplateMaster = ({data}) => {
  const [t] = useTranslation();
  const initialValues = {};
  const [values, setValues] = useState({ ...initialValues });
  const initialTemplateData = [
    {
      templateName: "Test",
      patientInfo: "Age",
      isActive: "Yes",
    },
    {
      templateName: "Test01",
      patientInfo: "PatientName",
      isActive: "Yes",
    },
  ];
  const [tableData, setTableData] = useState(initialTemplateData);
  const THEAD = [
    { name: "S.No" },
    { name: "Template Name" },
    { name: "Patient Info" },
    { name: "IsActive" },
    { name: "Edit" },
  ];

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
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
        <MultiSelectComp
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          name="patientInfo"
          id="patientInfo"
          placeholderName={t("Patient Info")}
          // dynamicOptions={LevelofConsciousness}
          handleChange={handleMultiSelectChange}
          value={values?.patientInfo}
        />
        <button
          className=" btn btn-sm btn-success ml-2"
          // style={{padding:"12px"}}
          // onClick={handleAdd}
        >
          {t("Save")}
        </button>
      </div>
      <div>
        <Heading title={t("Employee Details")} isBreadcrumb={false} />

        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            "S.no": index + 1,
            TemplateName: ele?.templateName,
            PateintInfo: ele?.patientInfo,
            isActive: ele?.isActive,
            Edit: <div className="fa fa-edit"></div>,
          }))}
        />
      </div>
    </div>
  );
};

export default SMSTemplateMaster;
