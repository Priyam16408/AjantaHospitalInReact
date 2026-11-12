import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";

export default function StateModel({ handleChangeModel ,inputData}) {
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
        id="state"
        name="stateName"
        lable={t("State")}
        placeholder=" "
        respclass="col-12"
        value={inputs?.stateName}
        onChange={handlechange}
      />

    </div>
  )
}
