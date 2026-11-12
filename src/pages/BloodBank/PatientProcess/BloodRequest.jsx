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
      <Heading title={t("Blood Request")} isBreadcrumb={true} />
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
        <ReactSelect
          placeholderName={t("Type")}
          name="Status"
          value={values?.Status?.value}
          handleChange={handleReactSelect}
          dynamicOptions={[
            { label: "OPD", value: "OPD" },
            { label: "IPD", value: "IPD" },
            { label: "EMG", value: "EMG" },
            { label: "ALL", value: "ALL" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          value={values?.fromDate ? values?.fromDate : new Date()}
          maxDate={new Date()}
          handleChange={(e) => {
            // Validate date format here as well when it is being changed
            const dateInput = e.target.value;

            setValues((prev) => ({
              ...prev,
              fromDate: moment(dateInput).toDate(), // Ensure state updates
            }));
          }}
          lable={t("From Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={""}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass="vital-sign-date col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          value={values?.toDate ? values?.toDate : new Date()}
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
          inputClassName={""}
        />
        <div className="w-100 d-flex justify-content-end mr-2">
          <button className="btn btn-sm btn-success" type="button">
            {t("Search")}
          </button>
        </div>
      </div>
      {tableData?.length > 0 && (
        <Heading
          title={t("Search Results")}
          secondTitle={
            <>
              <ColorCodingSearch
                color={"color-indicator-25-bg"}
                label={t("Not Collected")}
              />
              <ColorCodingSearch
                color={"color-indicator-24-bg"}
                label={t("Collected")}
              />
            </>
          }
        />
      )}
    </div>
  );
};

export default BloodRequest;
