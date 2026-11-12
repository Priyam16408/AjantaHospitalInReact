import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { serachReceivedCorpse } from "../../../networkServices/Mortuary/mourtuaryApi";
import { notify } from "../../../utils/ustil2";
// import ChatbotUI from "../../../chatGpt/ChatbotUI";

const SearchReceivedCorpse = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [values, setValues] = useState({});
  console.log("values", values);
  const [tableData, setTableData] = useState([]);

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const handleAction = async (buttonType) => {
    const payload = {
      mrNo: values?.UHID,
      ipdNo: values?.IPDNo,
      firstName: values?.FirstName,
      lastName: values?.LastName,
      corpseType: values?.corspeType?.value,
      buttonType: buttonType,
    };

    const response = await serachReceivedCorpse(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };
  return (
    <div className="card">
      <Heading title={t("Search Received Corpse")} isBreadcrumb={true} />
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
        <ReactSelect
          placeholderName={t("Corspe Type")}
          name="corspeType"
          value={values?.corspeType?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { lable: "ALL", value: "0" },
            { label: "Received", value: "1" },
            { label: "Deposited", value: "2" },
            { label: "Released", value: "3" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />

        <button
          className="btn btn-sm btn-success ml-2"
          onClick={() => handleAction("Searching...")}
        >
          {t("Search")}
        </button>
        <button
          className="btn btn-sm btn-success ml-2"
          onClick={() => handleAction("Expoting....")}
        >
          {t("Export To Excel")}
        </button>
      </div>
    </div>
  );
};

export default SearchReceivedCorpse;
