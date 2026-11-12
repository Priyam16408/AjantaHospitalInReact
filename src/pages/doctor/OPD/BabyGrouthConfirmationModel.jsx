import React, { useEffect, useRef, useState } from "react";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";
import { SaveMidParentalDetailApi } from "../../../networkServices/DoctorApi";
import { notify } from "../../../utils/utils";

// Growth profile fields may come back as PascalCase (C# POCO) or camelCase
// depending on the API's JSON casing, so read both defensively.
const pick = (obj, key) => obj?.[key] ?? obj?.[key?.charAt(0)?.toLowerCase() + key?.slice(1)];

const BabyGrouthConfirmationModel = ({
  setIsDOBModalOpen,
  patientDetail,
  growthProfile,
  onSaved,
}) => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    DOB: patientDetail?.DOB ? new Date(patientDetail.DOB) : new Date(),
    cheight: "",
    cweight: "",
    motherHeight: "",
    fatherHeight: "",
    midParentalHeight: "",
    doctorNotes: "",
    followUpDate: null,
  });
  const prefilled = useRef(false);

  // Baby Growth Chart's own saved detail (Patient_Growth_Profile) arrives
  // asynchronously from the parent; prefill the form with it once available.
  useEffect(() => {
    if (prefilled.current || !growthProfile) return;
    const dob = pick(growthProfile, "DOB");
    setValues((prev) => ({
      ...prev,
      DOB: dob ? new Date(dob) : prev.DOB,
      cheight: pick(growthProfile, "GestationWeeks") ?? prev.cheight,
      cweight: pick(growthProfile, "GestationDays") ?? prev.cweight,
      motherHeight: pick(growthProfile, "MotherHeight") ?? prev.motherHeight,
      fatherHeight: pick(growthProfile, "FatherHeight") ?? prev.fatherHeight,
      midParentalHeight:
        pick(growthProfile, "MidParentalHeight") ?? prev.midParentalHeight,
      doctorNotes: pick(growthProfile, "DoctorNotes") ?? prev.doctorNotes,
      followUpDate: pick(growthProfile, "FollowUpDate")
        ? new Date(pick(growthProfile, "FollowUpDate"))
        : prev.followUpDate,
    }));
    prefilled.current = true;
  }, [growthProfile]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdate = async () => {
    if (!patientDetail?.PatientID) {
      notify("Patient Id not found", "error");
      return;
    }
    const payload = {
      patientId: patientDetail?.PatientID,
      gender: patientDetail?.Gender,
      dob: values?.DOB || null,
      gestationWeeks: values?.cheight ? Number(values.cheight) : null,
      gestationDays: values?.cweight ? Number(values.cweight) : null,
      motherHeight: values?.motherHeight ? Number(values.motherHeight) : null,
      fatherHeight: values?.fatherHeight ? Number(values.fatherHeight) : null,
      midParentalHeight: values?.midParentalHeight ? Number(values.midParentalHeight) : null,
      doctorNotes: values?.doctorNotes || null,
      followUpDate: values?.followUpDate || null,
    };
    const response = await SaveMidParentalDetailApi(payload);
    if (response?.data?.success || response?.success) {
      notify(response?.data?.message || response?.message || "Details updated successfully", "success");
      onSaved?.();
      setIsDOBModalOpen(false);
    } else {
      notify(response?.data?.message || response?.message || "Failed to update details", "error");
    }
  };
  return (
    <>
      <div className="row p-3">
        <DatePicker
          lable={t("Date of Birth")}
          name="DOB"
          value={values.DOB}
          showTime
          hourFormat="12"
          handleChange={handleChange}
          respclass="col-sm-12 w-100"
          className={"w-100"}
        />
        <lable className="col-12 mb-2">
          <b>Gestation Period</b>
        </lable>
        <Input
          type="text"
          className={`form-control`}
          id="cheight"
          lable={t("Weeks")}
          placeholder=" "
          required={true}
          respclass="col-6"
          name="cheight"
          onChange={handleChange}
          value={values?.cheight}
          // disabled={true}
        />
        <Input
          type="text"
          className={`form-control`}
          id="cweight"
          lable={t("Days")}
          placeholder=" "
          required={true}
          respclass="col-6"
          name="cweight"
          onChange={handleChange}
          value={values?.cweight}
          // disabled={true}
        />
        <lable className="col-12 mb-2">
          <b>Mid Parental of Height</b>
        </lable>
        <Input
          type="text"
          className={`form-control`}
          id="motherHeight"
          lable={"Mother"}
          placeholder=" "
          required={true}
          respclass="col-6"
          name="motherHeight"
          onChange={handleChange}
          placeholderLabel="cms"
          value={values?.motherHeight}
          // disabled={true}
        />
        <Input
          type="text"
          className={`form-control`}
          id="fatherHeight"
          lable={"Father"}
          placeholder=" "
          required={true}
          respclass="col-6"
          name="fatherHeight"
          onChange={handleChange}
          value={values?.fatherHeight}
          placeholderLabel="cms"
          // disabled={true}
        />

        {/* <div className="col-6">
          <label style={{ fontSize: "12px", fontWeight: "400" }}>
            Father Height
          </label>
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              className="form-control"
              id="Fatherheight"
              required={true}
              name="Fatherheight"
              onChange={handleChange}
              value={values?.Fatherheight}
              placeholder="Ex: 160cms"
            />
          </div>
        </div> */}
        <lable className="col-12 mb-2 mt-2">
          <b>Doctor Notes &amp; Follow-up</b>
        </lable>
        <TextAreaInput
          className="form-control"
          id="doctorNotes"
          lable={t("Doctor Notes")}
          respclass="col-12"
          name="doctorNotes"
          rows={3}
          onChange={handleChange}
          value={values?.doctorNotes}
        />
        <DatePicker
          lable={t("Follow-up Date")}
          name="followUpDate"
          value={values?.followUpDate}
          handleChange={handleChange}
          respclass="col-sm-12 w-100"
          className={"w-100"}
        />
        <div className="col-12 d-flex justify-content-between">
          <button
            className="btn btn-primary mt-3 w-100"
            onClick={() => setIsDOBModalOpen(false)}
          >
            Do it Later
          </button>
          <button
            className="btn btn-primary mt-3 ml-2 w-100"
            onClick={handleUpdate}
          >
            {t("Continue")}
          </button>
        </div>
      </div>
    </>
  );
};

export default BabyGrouthConfirmationModel;
