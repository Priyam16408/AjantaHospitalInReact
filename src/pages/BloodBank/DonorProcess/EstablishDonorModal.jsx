import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";  
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";

export default function EstablishDonorModal({
  handleChangeModel,
  inputData,
}) {
  const [t] = useTranslation();
  const [values, setValues] = useState(inputData); 

  useEffect(() => {
    handleChangeModel(values);
  }, [values]);

 

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };  
  
  return (
    <>
      <div className="d-flex align-items-baseline w-100">
    
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <Input
            type="text"
            className="form-control"
            id="VisitorId"
            placeholder=" "
            name="VisitorId"
            value={values?.VisitorId || ""}
            onChange={handleChange}
            lable={t("Visitor ID")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="name"
            name="name"
            value={values?.name || ""}
            onChange={handleChange}
            lable={t("name")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          />


          
          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="contactNo"
            name="contactNo"
            value={values?.contactNo || ""}
            onChange={handleChange}
            lable={t("Contact No.")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
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
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          />


          
          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="DOB"
            name="DOB"
            value={values?.DOB || ""}
            onChange={handleChange}
            lable={t("DOB")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12"
          /> 
         
        </div>
      </div>
    </>
  );
}
