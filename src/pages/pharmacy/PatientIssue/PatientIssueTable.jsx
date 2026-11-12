import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tables from '../../../components/UI/customTable'
import Input from '../../../components/formComponent/Input'
import { ROUNDOFF_VALUE } from '../../../utils/constant'

export default function PatientIssueTable({ tbody, handleCustomInput, deleteRowData,handleOpenClinicalTrial ,ischecked}) {
  const [t] = useTranslation()
  const [bodyData, setBodyData] = useState([])

  const thead = [
    { name: t("SNO"), width: "1%" },
    { name: t("Item Name"), width: "1%" },
    { name: t("HSN Code"), width: "1%" },
    { name: t("Batch No"), width: "1%" },
    { name: t("Expiry"), width: "1%" },
    { name: t("Unit"), width: "1%" },
    { name: t("Stock Qty"), width: "1%" },
    { name: t("Unit Cost"), width: "1%" },
    { name: t("Tax Type"), width: "1%" },
    { name: t("Tax")+"(%)", width: "1%" },
    { name: t("Qty."), width: "1%" },
    { name: t("Dis.")+"(%)", width: "1%" },
    { name: t("Dis. Amt."), width: "1%" },
    { name: t("Amount"), width: "1%" },
    { name: t("Tax Amount"), width: "1%" },
    { name: t("Patient Payable"), width: "1%" },
    { name: t("Clinical Trial"), width: "1%" },
    { name: t("Remove"), width: "1%" },

  ]

  useEffect(() => {
    let data = tbody?.map((ele, index) => ({
      SrNo: index + 1,

      ItemName: ele?.ItemName,
      HSNCode: ele?.HSNCode,
      BatchNumber: ele?.BatchNumber,
      MedExpiryDate: ele?.MedExpiryDate,
      UnitType: ele?.UnitType,
      AvlQty: ele?.AvlQty,
      MRP: ele?.MRP?.toFixed(ROUNDOFF_VALUE),
      GSTType: ele?.GSTType,
      PurTaxPer: ele?.PurTaxPer,
      Qty:
        <Input
          type="text"
          disabled={ischecked}
          className="table-input"
          removeFormGroupClass={true}
          display={"right"}
          name={"Quantity"}
          value={ele?.Quantity}
          onChange={(e) => { handleCustomInput(index, "Quantity", e.target.value, "number", Number(ele?.AvlQty)) }}
        />,
      DisPer: <Input
        type="text"
        className="table-input"
        removeFormGroupClass={true}
        display={"right"}
        name={"DisPer"}
        value={ele?.DisPer}
        onChange={(e) => { handleCustomInput(index, "DisPer", e.target.value, "number", 100) }}
      />,
      discountAmount:
        <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          display={"right"}
          name={"discountAmount"}
          value={ele?.discountAmount}
          onChange={(e) => { handleCustomInput(index, "discountAmount", e.target.value, "number", Number(ele?.grossAmount)) }}
        />
      ,
      Amount: ele?.Amount.toFixed(ROUNDOFF_VALUE),
      TaxAmount: ele?.TaxAmount.toFixed(ROUNDOFF_VALUE),
      PayableAmount: ele?.PayableAmount.toFixed(ROUNDOFF_VALUE),
      IsUrgent: <> <input type="checkbox" onChange={(e) => { handleCustomInput(index, "isClinicalTrial", e?.target?.checked) }} checked={ele?.isClinicalTrial} /> <span onClick={()=>{handleOpenClinicalTrial(ele,index)}}><i className="fa fa-eye "></i></span>
      {ele?.isClinicalTrial&&
       <Input
          type="text"
          className="table-input"
          removeFormGroupClass={true}
          placeholder={t("Remark")}
          // display={"right"}
          name={"ClinicalRemark"}
          value={ele?.ClinicalRemark?ele?.ClinicalRemark:""}
          onChange={(e) => { handleCustomInput(index, "ClinicalRemark", e.target.value, "text" ) }}
        />
      }
      </>,

      Reject: <span onClick={() => { deleteRowData(index) }}><i className="fa fa-trash text-danger"></i></span>
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
