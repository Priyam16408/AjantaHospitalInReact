import React from "react";
import LabeledInput from "../../formComponent/LabeledInput";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";

const SendEmailDoctor = (props) => {
  const {emailHandleChange,emailSend,setEmailSend,error} = props
  const [t] = useTranslation();
  return (
    <>
      <div className="row">
       
        <Input
          type="text"
          className="form-control"
          id="template Name"
          name={"toEmailID"}
          lable={t("Email")}
          placeholder=" "
          respclass="col-xl-12 col-md-12 col-sm-12 col-12 "
          value={emailSend.toEmailID}
          onChange={emailHandleChange}
        />
       <p style={{color:"red", fontWeight:"bold", margin:"0 10px"}}> {error}</p>
        <Input
          type="text"
          className="form-control"
          id="template Name"
          name={"emailSubject"}
          lable={t("Subject")}
          placeholder=" "
          respclass="col-xl-12 col-md-12 col-sm-12 col-12 "
          value={emailSend.emailSubject}
          onChange={emailHandleChange}
        />
        <div className="col-12">
          <textarea
            className="w-100"
            rows={5}
            placeholder="Remarks"
            name="emailBody"
            value={emailSend.emailBody}
            onChange={emailHandleChange}
          />
        </div>
      </div>
    </>
  );
};

export default SendEmailDoctor;
