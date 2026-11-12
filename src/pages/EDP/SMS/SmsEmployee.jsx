import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import Input from "../../../components/formComponent/Input";

const SmsEmployee = ({data}) => {
  const [t] = useTranslation();

  const initialValues = {};
  const THEAD = [
    { name: <input type="checkbox"></input> },
    { name: t("Employee Name") },
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
          placeholderName={t("Report Type")}
          name="ReportType"
          value={values?.ReportType?.value}
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
      {tableData?.length > 1 && (
        <div>
          <Heading title={t("Employee Details")} isBreadcrumb={false} />

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

          <div className="row p-2 d-flex justify-content-end mr-2">
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
            <button
              className=" btn btn-sm btn-success"
              // style={{padding:"12px"}}
              // onClick={handleAdd}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsEmployee;
