import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";

export default function DuplicatePatientAlertModel() {
  const [t] = useTranslation();
//   const [inputs, setInputs] = useState(inputData);
//   const handlechange = (e) => {
//     setInputs((val) => ({ ...val, [e.target.name]: e.target.value }));
//   };

//   useEffect(() => {
//     handleChangeModel(inputs);
//   }, [inputs]);

  return (
    <div className="row p-2 d-flex justify-content-center">
      <h2 style={{fontWeight:"bold"}}>{t("FrontOffice.PatientRegistration.label.DuplicateEntryMessage")}</h2>
    </div>
  );
}
