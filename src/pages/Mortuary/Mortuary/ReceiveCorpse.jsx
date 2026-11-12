import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import Input from "../../../components/formComponent/Input";
import moment from "moment";
import { MortuaryGetSerachDeathPerson } from "../../../networkServices/Mortuary/mourtuaryApi";
import { notify } from "../../../utils/ustil2";

const ReceiveCorpse = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [values, setValues] = useState({});
  const [tableData, setTableData] = useState([]);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleSearch = async () => {
    const payload = {
      MRNo: values?.UHID || "",
      FirstName: values?.FirstName || "",
      LastName: values?.LastName || "",
      IPDNo: values?.IPDNo || "",
      FromDate: moment(values?.deathDate).format("YYYY-MM-DD") || new Date(),
      ToDate: moment(values?.toDate).format("YYYY-MM-DD") || new Date(),
    };
    const response = await MortuaryGetSerachDeathPerson(payload);

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  return (
    <div className="card">
      <Heading isBreadcrumb={true} title={t("Corpse Receiving")} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
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
          className={"form-control required-fields"}
          lable={t("First Name")}
          placeholder=" "
          name="FirstName"
          onChange={(e) => handleInputChange(e, 0, "FirstName")}
          value={values?.FirstName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Last Name")}
          placeholder=" "
          name="LastName"
          onChange={(e) => handleInputChange(e, 0, "LastName")}
          value={values?.LastName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("IPD No.")}
          placeholder=" "
          name="IPDNo"
          onChange={(e) => handleInputChange(e, 0, "IPDNo")}
          value={values?.IPDNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="deathDate"
          name="deathDate"
          value={
            values?.deathDate ? moment(values?.deathDate).toDate() : new Date()
          }
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              deathDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("From Death Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={values?.toDate ? moment(values?.toDate).toDate() : new Date()}
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              toDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("To Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <div className="w-100 d-flex justify-content-end mr-3">
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleSearch()}
          >
            {t("Search")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveCorpse;
