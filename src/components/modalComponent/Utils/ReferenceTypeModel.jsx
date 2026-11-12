import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import Input from "@app/components/formComponent/Input";
export default function ReferenceTypeModel({ handleChangeModel ,inputData}) {
  const [t] = useTranslation();
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
      type="text"
      className="form-control"
      id="typeOfReference"
      name="typeOfReference"
      lable={t("ReferenceType")}
      placeholder=" "
      respclass="col-12"
      onChange={handlechange}
    />
 
  </div>
  )
}
