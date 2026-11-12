import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../../components/formComponent/TextAreaInput";
// import TextAreaInput from "../../formComponent/TextAreaInput";

export default function AddMapObservation({ handleChangeModel, inputData }) {
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
        <TextAreaInput
          lable={t("Add Observation")}
          className="w-100 required-fields"
          id="addobservation"
          rows={4}
          respclass="w-100"
          name="addobservation"
          value={inputs?.addobservation}
          onChange={handlechange}
          maxLength={1000}
        />

        <TextAreaInput
          lable={t("suffix")}
          className="w-100 required-fields"
          id="suffix"
          rows={4}
          respclass="w-100"
          name="suffix"
          value={inputs?.suffix}
          onChange={handlechange}
          maxLength={1000}
        />
      </div>
    </>
  );
}

 
