import React, { useEffect, useState,forwardRef  } from 'react'
import { useTranslation } from "react-i18next";

import Input from "@app/components/formComponent/Input";
const AccountTypeModel=forwardRef(({ handleChangeModel })=> {
  const [t] = useTranslation();
  const [inputs, setInputs] = useState("")
  const handlechange = (e) => {
    setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    handleChangeModel(inputs)
  }, [inputs])
  return (
    <div className="row p-2">
    <Input
      type="text"
      className="form-control required-fields"
      id="AccountOfReference"
      name="AccountOfReference"
      lable={t("Account Type")}
      reqired={true}
      placeholder=" "
      respclass="col-12"
      onChange={handlechange}
      // ref={ref}
    />
 
  </div>
  )
});

export default AccountTypeModel;