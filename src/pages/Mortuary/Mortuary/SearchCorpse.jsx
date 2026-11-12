import React, { useState } from "react";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Heading from "../../../components/UI/Heading";
import { SearchCorpseDetails } from "../../../networkServices/Mortuary/mourtuaryApi";
import moment from "moment";

const SearchCorpse = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [values, setValues] = useState({});
  console.log("values", values);
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

  const handleSearch = async () => {
    const payload = {
      corpseNo: values?.CorpseID || "",
      depositeNo: values?.DepositeNo || "",
      firstName: values?.firstName || "",
      lastName: values?.lastName || "",
      fromDate: values?.deathDate || "",
      toDate: values?.toDate || "",
      status: values?.status?.value || "",
    };

    console.log("payload", payload);

    const response = await SearchCorpseDetails(payload);
    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };
  return (
    <div className="card">
      <Heading title={t("Search Corpse")} isBreadcrumb={true} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Corpse ID")}
          placeholder=" "
          name="CorpseID"
          onChange={(e) => handleInputChange(e, 0, "CorpseID")}
          value={values?.CorpseID}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Deposite No.")}
          placeholder=" "
          name="DepositeNo"
          onChange={(e) => handleInputChange(e, 0, "DepositeNo")}
          value={values?.DepositeNo}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("First Name")}
          placeholder=" "
          name="firstName"
          onChange={(e) => handleInputChange(e, 0, "firstName")}
          value={values?.firstName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Last Name")}
          placeholder=" "
          name="lastName"
          onChange={(e) => handleInputChange(e, 0, "lastName")}
          value={values?.lastName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDepositDate"
          name="fromDepositDate"
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
          lable={t("From Deposit Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <DatePicker
          className={`custom-calendar`}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDepositDate"
          name="toDepositDate"
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
          lable={t("To Deposit Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <ReactSelect
          placeholderName={t("Status")}
          name="status"
          value={values?.status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { lable: "Admitted", value: "0" },
            { label: "Released", value: "1" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button className="btn btn-sm btn-success ml-2" onClick={handleSearch}>
          {t("Search")}
        </button>
      </div>
    </div>
  );
};

export default SearchCorpse;
