import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import TimePicker from "../../formComponent/TimePicker";
import DatePicker from "../../formComponent/DatePicker";
import {
  DISCHARGEINTIMATION_OPTIONS,
  TYPE_OF_DEATH_OPTIONS,
} from "../../../utils/constant";
import Input from "../../formComponent/Input";

const DischargeModal = ({ getPayloadData, secModalData }) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const initialValues = {
    btnDischarge: "",
    date: new Date(),
    startTime: new Date(),
    entryDateDeath: new Date(),
    entryTimeDeath: new Date(),
    causeOfDeath: "",
    typeOfDeath: "",
    clearanceRemark: "",
  };
  const [payload, setPayload] = useState({ ...initialValues });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const handleReactSelect = async (name, value) => {
    setPayload((prevData) => ({
      ...prevData,
      [name]: value?.value,
    }));
  };
  console.log("secModalData", secModalData);
  useEffect(() => {
    getPayloadData(payload);
  }, [payload]);
  return (
    <>
      <div className="row">
        <ReactSelect
          placeholderName={"Select Type"}
          id="btnDischarge"
          inputId="btnDischarge"
          name="btnDischarge"
          value={payload?.btnDischarge}
          handleChange={handleReactSelect}
          dynamicOptions={DISCHARGEINTIMATION_OPTIONS}
          searchable={true}
          respclass="col-xl-6 col-md-6 col-sm-4 col-12"
          requiredClassName={"required-fields "}
        />
        <DatePicker
          className={`custom-calendar `}
          respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
          id="date"
          name="date"
          value={payload?.date ? payload?.date : new Date()}
          handleChange={handleChange}
          lable={t("Date")}
          placeholder={VITE_DATE_FORMAT}
          inputClassName={"required-fields"}
        />
        <TimePicker
          placeholderName={t("Time")}
          lable={t("Time")}
          respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
          id="startTime"
          name="startTime"
          value={payload?.startTime}
          handleChange={handleChange}
          className="required-fields"
        />
      </div>
      {payload?.btnDischarge === "Death" && (
        <div className="row">
          <DatePicker
            className={`custom-calendar `}
            respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
            id="entryDateDeath"
            name="entryDateDeath"
            value={
              payload?.entryDateDeath ? payload?.entryDateDeath : new Date()
            }
            handleChange={handleChange}
            lable={t("Date Of Death")}
            placeholder={VITE_DATE_FORMAT}
            inputClassName={"required-fields"}
          />
          <TimePicker
            lable={t("Time Of Death")}
            respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
            id="entryTimeDeath"
            name="entryTimeDeath"
            value={payload?.entryTimeDeath}
            handleChange={handleChange}
            className="required-fields"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="causeOfDeath"
            name="causeOfDeath"
            value={payload?.causeOfDeath}
            onChange={handleChange}
            lable={t("Cause Of Death")}
            placeholder=""
            respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
          />

          <ReactSelect
            placeholderName={"Type Of Death"}
            id="typeOfDeath"
            inputId="typeOfDeath"
            name="typeOfDeath"
            value={payload?.typeOfDeath}
            handleChange={handleReactSelect}
            dynamicOptions={TYPE_OF_DEATH_OPTIONS}
            searchable={true}
            respclass="col-xl-3 col-md-3 col-sm-4 col-12"
            requiredClassName={"required-fields "}
          />
          <Input
            type="text"
            className="form-control"
            id="clearanceRemark"
            name="clearanceRemark"
            value={payload?.clearanceRemark}
            onChange={handleChange}
            lable={t("Remarks")}
            placeholder=""
            respclass={"col-xl-3 col-md-3 col-sm-4 col-12"}
          />
        </div>
      )}
    </>
  );
};

export default DischargeModal;
