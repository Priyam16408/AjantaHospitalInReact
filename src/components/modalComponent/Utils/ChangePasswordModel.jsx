import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import BrowseButton from '../../formComponent/BrowseButton';

export default function ChangePasswordModel({ handleChangeModel, inputData }) {
  const [t] = useTranslation();

  console.log("inputData", inputData)

  const [inputs, setInputs] = useState(inputData)
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    handleChangeModel(inputs)
  }, [inputs])

  return (
    <div className="row p-2">
      <Input
        type="password"
        className="form-control required-fields"
        id="Oldpassword"
        name="Oldpassword"
        lable={t("Oldpassword")}
        placeholder=" "
        respclass=" col-sm-4 col-12"
        value={inputs?.Oldpassword}
        onChange={handlechange}
      />
      <Input
        type="password"
        className="form-control required-fields"
        id="NewPassword"
        name="NewPassword"
        lable={t("NewPassword")}
        placeholder=" "
        respclass=" col-sm-4 col-12"
        value={inputs?.NewPassword}
        onChange={handlechange}
      />
      <Input
        type="password"
        className="form-control required-fields"
        id="ConfirmPassword"
        name="ConfirmPassword"
        lable={t("ConfirmPassword")}
        placeholder=" "
        respclass=" col-sm-4 col-12"
        value={inputs?.ConfirmPassword}
        onChange={handlechange}
      />
     

    </div>
  )
}
