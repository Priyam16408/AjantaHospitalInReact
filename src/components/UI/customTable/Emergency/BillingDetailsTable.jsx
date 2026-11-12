import React, { useEffect, useState } from 'react'
import Tables from "../index";
import { useTranslation } from 'react-i18next';
import RejectModal from '../../../modalComponent/Utils/patientBillingModal/RejectModal';


export default function BillingDetailsTable({ tbody, handleRowChange, setBillDetailList,handleModalState,GetBindBillDepartment }) {
  const [bodyData, setBodyData] = useState([])

  useEffect(() => {
    let data = tbody?.map((val, index) => ({
      SNO: index + 1,
      chekbox: <div className="text-center">
        <input
          type="checkbox"
          checked={val?.isChecked}
          name="isChecked"
          onChange={(e) => handleRowChange(e, index)}
        />
      </div>,
      EntryDate: val?.EntryDate,
      Category: val?.Category,
      Subcategory: val?.Subcategory,
      Item: val?.Item,
      DoctorName: val?.DoctorName,
      Rate: val?.Rate?val?.Rate:"0.00",
      DiscPer: val?.DiscPer?val?.DiscPer:"0.00",
      DiscAmt: val?.DiscAmt?val?.DiscAmt:"0.00",
      Amount: val?.Amount?val?.Amount:"0.00",
      Reject:
      val?.Subcategory!=="MEDICAL" && <i
          className="fa fa-trash text-danger"
        onClick={() =>
          handleModalState(
            true,
            "Rejection Reason",
            <RejectModal
              data={{...val,LedgerTransactionNo:""}}
              handleModalState={handleModalState}
              GetBindBillDepartment={GetBindBillDepartment}
              // GetBindBillDepartment={GetBindBillDepartment}
            />,
            "25vw",
            <></>
          )
        }
        />
      ,
    }))
    setBodyData(data)
  }, [tbody])

  let [t] = useTranslation();
  const isMobile = window.innerWidth <= 800;

  const thead = [
    { name: t("#"), width: "4%" },
    { width: "4%", name: !isMobile ? <input type="checkbox" style={{ "marginLeft": "3px" }} onChange={(e) => { handleChangeCheckboxHeader(e) }} /> : t("NursingWard.NurseAssignment.check"), textAlign: "center" },
    t("Date"),
    t("Category"),
    t("Subcategory"),
    t("Item"),
    t("DocterName"),
    t("Rate"),
    t("Discount"),
    t("DisAmt"),
    { name: t("Amount"), width: "1%" },
    { name: t("Reject"), width: "1%" },
  ]

  const handleChangeCheckboxHeader = (e) => {
    let data = tbody?.map((val) => {
      val.isChecked = e?.target?.checked
      return val
    })
    setBillDetailList(data)
  }

  return (
    <>
      <Tables
        thead={thead}
        tbody={bodyData}
      // getRowClass={getRowClass}
      // style={{ height: "60vh" }}
      // handleClassOnRow={handleClassOnRow}
      />

    </>
  )
}
