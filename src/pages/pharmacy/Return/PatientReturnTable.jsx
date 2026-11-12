import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import Input from '../../../components/formComponent/Input'

export default function PatientReturnTable({ tbody, handleCustomInput, SearchType }) {
  const [t] = useTranslation()
  const [bodyData, setBodyData] = useState([])

  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Bill No."), width: "1%" },
    { name: t("Indent Number"), width: "1%" },
    { name: t("Item Name"), width: "1%" },
    { name: t("Batch"), width: "1%" },
    { name: t("Expiry"), width: "1%" },
    { name: t("Unit"), width: "1%" },
    { name: t("HSN Code"), width: "1%" },
    { name: t("Tax Type"), width: "1%" },
    { name: t("Discount(%)"), width: "1%" },
    { name: t("MRP"), width: "1%" },
    { name: t("Avail Qty."), width: "1%" },
    { name: t("Return Qty."), width: "1%" }
  ]


  useEffect(() => {
    let data = tbody?.map((ele, index) => ({
      SrNo: index + 1,
      BillNo: ele?.BillNo,
      IndentNo: ele?.IndentNo,
      ItemName: ele?.ItemName,
      BatchNumber: ele?.BatchNumber,
      MedExpiryDate: ele?.MedExpiryDate,
      UnitType: ele?.UnitType,
      HSNCode: ele?.HSNCode,
      GSTType: `${ele?.GSTType ? ele?.GSTType : ""} (${ele?.SaleTaxAmount ? ele?.SaleTaxAmount : "0"})`,
      DiscountPercentage: ele?.DiscountPercentage ? ele?.DiscountPercentage : "0",
      MRP: ele?.MRP,
      AvlQty: ele?.AvlQty,
      Qty:
        <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          display={"right"}
          name={"returnQty"}
          value={ele?.returnQty}
          onChange={(e) => { handleCustomInput(index, "returnQty", e.target.value, "number", Number(ele?.AvlQty)) }}
        />
    }))
    setBodyData(data)
  }, [tbody])

  return (
    <>
      <Tables
        thead={thead}
        tbody={bodyData}
      />
    </>
  )
}
