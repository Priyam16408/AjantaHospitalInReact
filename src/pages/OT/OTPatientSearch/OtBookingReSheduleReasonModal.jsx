 
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import TextAreaInput from "../../../components/formComponent/TextAreaInput";

export default function OtBookingReSheduleReasonModal({
  handleChangeModel,
  inputData,
}) {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(inputData);  

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);

 
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };   
  
  return (
    <>
      <div className="d-flex align-items-baseline w-100">
        <div className="row p-2 w-100">
      
         
            <div className="w-100">
              <TextAreaInput
                placeholder={""}
                lable={t("Enter Reason")}
                className="w-100 required-fields"
                id="reshudleReason"
                rows={4}
                respclass="w-100"
                name="reshudleReason" 
                value={inputs?.reshudleReason ? inputs?.reshudleReason : ""} 
                onChange={handleChange}
                maxLength={1000}
              />
               
            </div> 
        </div>
      </div>
    </>
  );
}
