import React from "react";
import Input from "../formComponent/Input";
const ForgetPasswordForm = () => {
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <form className="patient_registration card">
          <div className="row p-2 align-items-center">
            <Input
              type="text"
              className="form-control required-fields"
              id="txtCounter"
              name="txtCounter"
              // onChange={(e) => setSaveCounterState(e.target.value)}
              lable={"Old Password"}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="NewPassword"
              name="NewPassword"
              // onChange={(e) => setSaveCounterState(e.target.value)}
              lable={"New Password"}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="ConfirmnewPassword"
              name="ConfirmnewPassword"
              // onChange={(e) => setSaveCounterState(e.target.value)}
              lable={"Confirm new Password"}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgetPasswordForm;
