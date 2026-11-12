import React, { useState } from "react";
import LabeledInput from "../../formComponent/LabeledInput";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";
import TextAreaInput from "../../formComponent/TextAreaInput";
import { SENDONTYPE } from "../../../utils/constant";
import ReactSelect from "../../formComponent/ReactSelect";

const SendSMSDoctor = (props) => {
  const { phoneNumber, sms, setSms, handleChangeSMS, error } = props;
  const [show, setShow] = useState(false);
  const [t] = useTranslation();
  return (
    <>
    <div className="row"> 
      <ReactSelect
        placeholderName={t("Send On")}
        inputId="SendOn"
        dynamicOptions={SENDONTYPE}
        name="SendOn"
        value={sms?.SendOn}
        handleChange={handleChangeSMS}
        searchable={true}
        removeIsClearable={true}
        respclass="col-xl-6 col-md-6 col-sm-12 col-12"
      />
      <Input
        type="text"
        className="form-control required-fields"
        id="template Name"
        name={"mobileNo"}
        lable={t("Phone Number")}
        placeholder=" "
        respclass="col-xl-6 col-md-6 col-sm-12 col-12 "
        onChange={(e)=>{handleChangeSMS("mobileNo",{value:e.target.value})}}
        value={sms.mobileNo}
        // maxLength={10}
      
      />
      </div>
      {/* <div className="row">
        <div className="col-xl-6 col-md-12 col-sm-12 col-12  mb-2">
    
            <ReactSelect
                  placeholderName={t("Send On")}
                  inputId="SendOn"
                  dynamicOptions={SENDONTYPE}
                  name="SendOn"
                  value={sms?.SendOn}
                  handleChange={handleChangeSMS}
                  searchable={true}
                  removeIsClearable={true}
                  respclass="col-12 "
                />
           
        <div className="mt-3">
     
        </div>
          {show &&   <p style={{color:"red", fontWeight:"800",paddingLeft:"10px"}}>  {error}</p>}
        
        </div>
        

        <div className="col-12 col-sm-12">
       
        </div>

        
      </div> */}
    </>
  );
};

export default SendSMSDoctor;
