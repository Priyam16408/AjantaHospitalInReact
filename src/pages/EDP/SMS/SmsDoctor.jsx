import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Tables from "../../../components/UI/customTable";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";

const SmsDoctor = ({ data }) => {
  const [t] = useTranslation();

  const initialValues = {};

  const THEAD = [
    { name: <input type="checkbox" /> },
    { name: t("Doctor Name") },
    { name: t("Contact No.") },
  ];

  const initialData = [
    { name: "ABHISEKH SWAIN", contact: "9536851421" },
    { name: "ABINASH DAS", contact: "9132498885" },
    { name: "Administrator", contact: "7839222117" },
    { name: "AKSHAY SAMANTRAY", contact: "" },
    { name: "ANAND JAISWAL", contact: "NA" },
    { name: "Avadesh", contact: "9978787777" },
    { name: "DELIVERY TEAM", contact: "34343434" },
    { name: "emp11", contact: "NA" },
  ];

  const [values, setValues] = useState({ ...initialValues });
  const [tableData, setTableData] = useState(initialData);

  const handleReactSelect = (label, value) => {
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
          placeholderName={t("Specialization")}
          name="Specialization"
          value={values?.Specialization?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Department")}
          name="Department"
          value={values?.Department?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Doctor Name")}
          name="DoctorName"
          value={values?.DoctorName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Doctor Group")}
          name="DoctorGroup"
          value={values?.DoctorGroup?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Excel", value: "0" },
            { label: "PDF", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success"
          // style={{padding:"12px"}}
          // onClick={handleAdd}
        >
          {t("Search")}
        </button>
      </div>
      <div>
        <Heading title={t("Doctor Details")} isBreadcrumb={false} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            checkBox: (
              <input
                type="checkbox"
                disabled={ele?.contact === "" ? true : false}
              />
            ),
            EmployeeName: ele?.name,
            contact: ele?.contact,
          }))}
        />

        <div className="row p-2">
          <TextAreaInput
            id="SMSText"
            lable={"SMS Text"}
            className="col-12"
            //   onFocus={onFocus}
            //   name={ele.name}
            //   value={ele.value}
            //   onChange={ele.handleChangeOnchange}
            placeholder=" "
            respclass="col-xl-4 mt-2 col-md-4 col-sm-6 col-12"
          />
          <button
            className=" btn btn-sm btn-success mt-2"
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

export default SmsDoctor;
