import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import LabeledInput from "../../formComponent/LabeledInput";
import Tables from "../../UI/customTable";
import ReactSelect from "../../formComponent/ReactSelect";
import DatePicker from "../../formComponent/DatePicker";
import { WithoutObjecthandleReactSelectDropDownOptions } from "../../../utils/utils";

export default function EditMedicineDetailsModel({ handleChangeModel, inputData,medicineTime }) {


  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
  };


  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);


  return (
    <>
      <div className="row p-2">

        <Input
          type="text"
          className="form-control required-fields"
          id="Dose"
          name="Dose"
          value={inputs?.Dose?inputs?.Dose:""}
          lable={t("Dose")}
          placeholder=" "
          respclass="col-md-4 col-sm-6 col-12 mb-2"
          onChange={handlechange}
        />


        <ReactSelect
          placeholderName={t("Time")}
          searchable={true}
          id="Timing"
          dynamicOptions={WithoutObjecthandleReactSelectDropDownOptions(medicineTime)}
          name="Timing"
          value={`${inputs?.Timing}`}
          handleChange={(name,value)=>{setInputs((val)=>({...val,[name]:value}))}}
          respclass="col-md-4 col-sm-6 col-12 mb-2"
        />

        <DatePicker
          className={`custom-calendar `}
          respclass="col-md-4 col-sm-6 col-12 mb-2"
          id="Duration"
          name="Duration"
          inputClassName={"required-fields"}
          value={inputs?.Duration ? new Date(inputs?.Duration) : ""}
          handleChange={handlechange}
          lable={t("Duration")}
          placeholder={VITE_DATE_FORMAT}

        />


      </div>

    </>

  );
}
