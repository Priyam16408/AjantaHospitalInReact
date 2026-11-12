import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import DatePicker from "../../../components/formComponent/DatePicker";
import TimePicker from "../../../components/formComponent/TimePicker";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  DoctorAddBabyGrowth,
  DoctorUpdateBabyGrowth,
} from "../../../networkServices/DoctorApi";
import { useTranslation } from "react-i18next";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import LabeledInput from "../../../components/formComponent/LabeledInput";

const BabyGrowthForm = ({
  patientDetail,
  effectiveDOB,
  setIsFormModalOpen,
  values,
  setValues,
  handleSaveUpdate,
  isUpdate,
  setIsUpdate,
}) => {
  console.log(patientDetail, "patient Details");

  const [t] = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };
  // Baby Growth Chart's own DOB (Patient_Growth_Profile) takes precedence over
  // patient_master's DOB when this module has saved its own value.
  const formattedDOB = new Date(
    effectiveDOB || patientDetail?.DOB,
  ).toLocaleDateString("en-GB");
  useEffect(() => {
    const height = parseFloat(values.height);
    const weight = parseFloat(values.weight);

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      setValues((prev) => ({
        ...prev,
        BMI: bmi.toFixed(2),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        BMI: "",
      }));
    }
  }, [values.height, values.weight]);

  return (
    // <div className="card patient_registration border mt-2">
    //   <Heading title={t("Baby Growth Form")} isBreadcrumb={false} />
    <div className="row p-2">
      <LabeledInput
        label={"DOB"}
        className={"col-xl-3 col-md-4 col-sm-4 col-12"}
        value={formattedDOB ?? "-"}
      />
      <DatePicker
        className="custom-calendar"
        placeholder=""
        lable="Date Of Measurements"
        respclass={"col-xl-3 col-md-4 col-sm-4 col-12"}
        name="date"
        id="date"
        value={values?.date}
        showTime
        hourFormat="12"
        handleChange={handleChange}
      />

      {/* <TimePicker
        placeholderName=""
        lable={t("Time")}
        id="time"
        name="time"
        value={values?.time}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        handleChange={handleChange}
      /> */}
      <Input
        type="number"
        className="form-control "
        id="height"
        lable={t("Height")}
        placeholder=" "
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        name="height"
        value={values?.height}
        onChange={handleChange}
        placeholderLabel={"cm"}
      />
      <Input
        type="number"
        className="form-control "
        id="weight"
        lable={t("Weight")}
        placeholder=" "
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        name="weight"
        value={values?.weight}
        onChange={handleChange}
        placeholderLabel={"kg"}
      />
      <Input
        type="number"
        className="form-control "
        id="BMI"
        lable={t("BMI")}
        placeholder=" "
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        name="BMI"
        value={values?.BMI}
        onChange={handleChange}
        placeholderLabel={"kg/m²"}
        readOnly={true}
      />
      <Input
        type="number"
        className="form-control "
        id="OFC"
        lable={t("OFC")}
        placeholder=" "
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        name="OFC"
        value={values?.OFC}
        onChange={handleChange}
        placeholderLabel={"cm"}
      />
      {/* <Input
        type="number"
        // id="weight"
        name="weight"
        className="form-control"
        lable={"Weight"}
        placeholder=" "
        value={values?.weight}
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        onChange={handleChange}
      /> */}
      {/* <ReactSelect
        placeholderName={t("Select Unit")}
        // id={"action"}
        searchable={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-sm-4 col-12"
        dynamicOptions={[
          { value: "Kg", label: "Kg" },
          { value: "Gram", label: "Gram" },
        ]}
        removeIsClearable={true}
        handleChange={handleSelect}
        value={values?.weightUnit?.value}
        name={"weightUnit"}
      />
      <Input
        type="number"
        name="length"
        className="form-control"
        lable={"length In cm."}
        placeholder=" "
        value={values?.length}
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        onChange={handleChange}
      />
      <Input
        type="number"
        name="age"
        className="form-control"
        lable={"Age in Months"}
        placeholder=" "
        value={values?.age}
        required={true}
        respclass="col-xl-3 col-md-4 col-sm-4 col-12"
        onChange={handleChange}
      /> */}

      <button
        className="btn btn-sm btn-success"
        type="button"
        onClick={handleSaveUpdate}
      >
        {isUpdate ? t("Update") : t("Save")}
      </button>
    </div>
    // </div>
  );
};

export default BabyGrowthForm;
