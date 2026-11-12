import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '../../../../components/formComponent/Input'

export default function UpdateGroupNameModal({ inputData,setModalData }) {
    const [t] = useTranslation()
      const [inputs, setInputs] = useState({...inputData})
      const handlechange = (e) => {
        setInputs((val) => ({ ...val, [e.target.name]: e.target.value }))
      }
      useEffect(() => {
        setModalData((val)=>({...val,modalData:{...inputs,GroupName:inputs?.GroupName}}))
      }, [inputs])
 
    return (
        <>
           <Input
                   type="text"
                   className="form-control required-fields"
                   id="GroupName"
                   name="GroupName"
                   value={inputs?.GroupName}
                   onChange={handlechange}
                   lable={t("Group Name")}
                   placeholder=" "
                   respclass="w-100"
                 />
        </>
    )
}
