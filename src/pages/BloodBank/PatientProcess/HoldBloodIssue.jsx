import React, { useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Input from "../../../components/formComponent/Input";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";

const BloodRequest = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const initialValues = {
    Status: { label: "ALL", value: "ALL" },
  };

  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  return (
    <div className="card">
      <Heading title={t("Hold Blood Issue")} isBreadcrumb={true} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control "}
          lable={t("Patient Name")}
          placeholder=" "
          name="PatientName"
          onChange={(e) => handleInputChange(e, 0, "PatientName")}
          value={values?.PatientName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("UHID")}
          placeholder=" "
          name="UHID"
          onChange={(e) => handleInputChange(e, 0, "UHID")}
          value={values?.UHID}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control "}
          lable={t("IPD No")}
          placeholder=" "
          name="IPDNo"
          onChange={(e) => handleInputChange(e, 0, "IPDNo")}
          value={values?.IPDNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm btn-success" type="button">
          {t("Search")}
        </button>
      </div>
      {tableData?.length > 0 && <></>}
    </div>
  );
};

export default BloodRequest;
