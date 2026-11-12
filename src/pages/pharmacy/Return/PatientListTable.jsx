import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import { SelectIconSVG } from '../../../components/SvgIcons'

export default function PatientListTable({ tbody,handleSearchIPDPatient}) {
  const [t] = useTranslation()
  const [bodyData, setBodyData] = useState([])

  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("IPD No."), width: "1%" },
    { name: t("UHID"), width: "1%" },
    { name: t("Patient Type"), width: "1%" },
    { name: t("Patient Name"), width: "1%" },
    { name: t("Gender"), width: "1%" },
    { name: t("Age"), width: "1%" },
    { name: t("Address"), width: "1%" },
    { name: t("Status"), width: "1%" },
    // { name: t("Select"), width: "1%" },
  ]

  useEffect(() => {
    let data = tbody?.map((ele, index) => ({
      SrNo: index + 1,
      TransNo: ele?.TransNo,
      PatientID: ele?.PatientID,
      Patient_Type: ele?.Patient_Type,
      PNAME: ele?.PNAME,
      Gender: ele?.Gender,
      Age: ele?.Age,
      Address: ele?.Address,
      STATUS: ele?.STATUS,
      // select:  <span onClick={()=>{handleSearchIPDPatient(ele)}}> <SelectIconSVG/> </span> ,


    }))
    setBodyData(data)
  }, [tbody])

  return (
    <>
      <Tables
        thead={thead}
        tbody={bodyData}
        getRowClick={handleSearchIPDPatient}
      />
    </>
  )
}
