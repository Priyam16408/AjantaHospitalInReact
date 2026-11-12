import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; 
import TextAreaInput from "../../../components/formComponent/TextAreaInput";

export default function ResultEntryCultureReasonModal({ handleChangeModel, inputData }) {



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
          lable={t("Hold Remarks")}
          className="w-100 required-fields"
          id="holdRemarks"
          rows={4}
          respclass="w-100"
          name="holdRemarks"
          value={inputs?.holdRemarks ? inputs?.holdRemarks : ""}
          onChange={handlechange}
          maxLength={1000}
        />


      </div>

    </>

  );
}
