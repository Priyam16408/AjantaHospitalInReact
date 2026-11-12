import React, { useEffect, useState } from "react";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { useTranslation } from "react-i18next";

const PatientClearanceModal = ({ getPayloadData }) => {
  const [t] = useTranslation();
  const initialValues = {
    Narration: "",
  };
  const [payload, setPayload] = useState({ ...initialValues });

  useEffect(() => {
    getPayloadData(payload);
  }, [payload]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  return (
    <>
      <div className="row">
        <div className="col-sm-12 text-center">
          <label className="text-danger bold">
            Please Patient Clearance.
          </label>
        </div>
        <div className="col-xl-12 col-md-12 col-sm-12 col-12">
          <TextAreaInput
            lable={t("Narration")}
            // placeholder="Narration"
            className="w-100 required-fields"
            id="Narration"
            name="Narration"
            maxLength={1000}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default PatientClearanceModal;
