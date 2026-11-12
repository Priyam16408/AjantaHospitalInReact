import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Input from "../../../components/formComponent/Input";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { EDPGetCenter, EDPResetPassword } from "../../../networkServices/EDP/edpApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ChangePassword = (data) => {
  const localData = useLocalStorage("userData", "get");
  console.log("Daa", localData);

  const [t] = useTranslation();
  const initialState = {};

  const [values, setValues] = useState(initialState);

  const [dropDownState, setDropDownState] = useState({
    Department: [],
    Center: [],
  });

  console.log("DropDownState", dropDownState?.Center);

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleInputChange = (e, index, label) => {
    setValues((val) => ({ ...val, [label]: e.target.value }));
  };

  const bindCenter = async () => {
    const empID = data?.data?.EmployeeID;
    // 
    const dataReceived = await EDPGetCenter(empID);

    if (dataReceived?.success) {
      setDropDownState((val) => ({
        ...val,
        Center: handleReactSelectDropDownOptions(
          dataReceived?.data,
          "CentreName",
          "CentreID"
        ),
      }));
    }
  };

  useEffect(() => {
    bindCenter();
  }, []);

  const handleSave = async () => {

    if(values?.NewPassword != values?.ConfirmPassword){
      notify("Confirm Password do not match New Password" , "error");
      return
    }
    const payloadToBe = {
      employeeID: data?.data?.EmployeeID,
      newPassword: values?.NewPassword,
      confirmPassword: values?.ConfirmPassword,
      centreID: dropDownState?.Center[0]?.CentreID,
    };



    const dataSaved = await EDPResetPassword(payloadToBe);


    if(dataSaved?.success === true){
      notify(dataSaved?.message , "success");
    }else{
      notify(dataSaved?.message , "error")
    }
  };

  return (
    <div className="mt-2 card">
      <Heading title={t("Login Details")} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Centre")}
          id="Centre"
          removeIsClearable={true}
          requiredClassName={"required-fields"}
          name="Centre"
          value={values?.Centre?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.Center}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <LabeledInput
          label={t("Username")}
          value={data?.data?.NAME}
          className={"col-xl-2 col-md-4 col-sm-6 col-12 mt-1"}
        />
        {/* <Input
          type="OldPassword"
          className={"form-control "}
          lable={t("Old Password")}
          placeholder=" "
          id="NewPassword"
          name="NewPassword"
          onChange={(e) => handleInputChange(e, 0, "OldPassword")}
          value={values?.OldPassword}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
        /> */}
        <Input
          type="password"
          className={"form-control "}
          lable={t("New Password")}
          placeholder=" "
          id="NewPassword"
          name="NewPassword"
          onChange={(e) => handleInputChange(e, 0, "NewPassword")}
          value={values?.NewPassword}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
        />
        <Input
          type="password"
          className={"form-control "}
          lable={t("Confirm Password")}
          placeholder=" "
          id="ConfirmPassword"
          name="ConfirmPassword"
          onChange={(e) => handleInputChange(e, 0, "ConfirmPassword")}
          value={values?.ConfirmPassword}
          // required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12 mt-1"
        />
        <button
          className="btn btn-sm btn-success ml-2 mt-1"
          onClick={handleSave}
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
