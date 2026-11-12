import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import Input from "../../../components/formComponent/Input";
import moment from "moment";
import DatePicker from "../../../components/formComponent/DatePicker";
import { otPatientSearch } from "../../../networkServices/EDP/karanedp";
import { notify } from "../../../utils/ustil2";

export default function OtBookingModal({ handleChangeModel, inputData }) {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const [patientData,setPatientData] = useState([]);

  const { VITE_DATE_FORMAT } = import.meta.env;

  const [values, setValues] = useState({
    firstName:"",
    lastName:"",
    Address:"",
    contactNo:"",
    UHID: "",
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
  });

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value || new Date(),
    }));
  };


    const handleSearchPatient = async () => {
    const payload = {
   "patientID": String(values?.UHID),
    "pName": String(values?.firstName),
    "lName": String(values?.lastName),
    "contactNo": String(values?.contactNo),
    "address": String(values?.Address),
    "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
    "toDate": moment(values?.toDate).format("DD-MMM-YYYY"),
    "patientRegStatus": 0,
    "isCheck": "",
    "idProof": "",
    "membershipCardNo": "",
    "dob": "",
    "isDOBChecked": 0,
    "relation": "",
    "relationName": "",
    "ipdno": "",
    "panelID": "",
    "cardNo": "",
    "visitID": "",
    "emailID": ""
    }
      try {
        const apiResp = await otPatientSearch(payload);
       
        if (apiResp.success) {
          setPatientData(apiResp?.data);
          notify(apiResp?.message,"success");
        } else {
          notify(apiResp?.message, "error");
        }
      } catch (error) {
        notify("An error occurred while fetching data", "error");
      }
    };

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

  return (
    <>
      {/* <div className="row p-2">
        <TextAreaInput
          lable={t("Reject Reason")}
          className="w-100 required-fields"
          id="RejectReason"
          rows={4}
          respclass="w-100"
          name="RejectReason"
          value={inputs?.RejectReason ? inputs?.RejectReason : ""}
          onChange={handlechange}
          maxLength={1000}
        />
      </div> */}

      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
        <Input
          type="text"
          placeholder=""
          className="form-control"
          id="UHID"
          name="UHID"
          value={values?.UHID || ""}
          onChange={handleChange}
          lable={t("UHID")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          placeholder=""
          className="form-control"
          id="firstName"
          name="firstName"
          value={values?.firstName || ""}
          onChange={handleChange}
          lable={t("First Name")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          placeholder=""
          className="form-control"
          id="lastName"
          name="lastName"
          value={values?.lastName || ""}
          onChange={handleChange}
          lable={t("Last Name")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          placeholder=""
          className="form-control"
          id="address"
          name="address"
          value={values?.address || ""}
          onChange={handleChange}
          lable={t("Address")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          placeholder=""
          className="form-control"
          id="contactNo"
          name="contactNo"
          value={values?.contactNo || ""}
          onChange={handleChange}
          lable={t("Contact No")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <DatePicker
          id="fromDate"
          name="fromDate"
          placeholder={VITE_DATE_FORMAT}
          lable={t("From Date")} 
          value={values?.fromDate ? new Date(values?.fromDate) : new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          maxDate={new Date()}
        />

        <DatePicker
          id="toDate"
          placeholder={VITE_DATE_FORMAT}
          name="toDate"
          lable={t("To Date")}
          value={values?.toDate ? new Date(values?.toDate) : new Date()}
          handleChange={handleChange}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          maxDate={new Date()}
          // minDate={values?.fromDate}
        />

        <div className="col-sm-2 col-xl-1">
          <button
            className="btn btn-sm btn-success"
            type="button"
            onClick={handleSearchPatient}
          >
            {t("Search")}
          </button>
        </div>
      </div>
    </>
  );
}
