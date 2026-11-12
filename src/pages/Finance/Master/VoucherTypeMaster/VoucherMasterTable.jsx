import React from "react";
import Tables from "../../../../components/UI/customTable";
import { useTranslation } from "react-i18next";

const VoucherMasterTable = ({bindVoucherData,onEdit,handleDeactive}) => {
 const [t] = useTranslation();

  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Code"), width: "10%" },
    { name: t("Voucher Type"), width: "10%" },
    { name: t("Voucher Name"), width: "10%" },
    { name: t("Full Name"), width: "10%" },
    { name: t("Auto Verify HIS Data"), width: "10%" },
    { name: t("Auto Auth HIS Data"), width: "10%" },
    { name: t("Created By"), width: "10%" },
    { name: t("Created Date"), width: "10%" },
    { name: t("Status"), width: "10%" },
    { name: t("Edit"), width: "10%" },
    { name: t("Action"), width: "10%" },
  ];
  

  const tbody =  bindVoucherData.map((val,index)=>(
    {
      "S.No.": index+1,
      Code: val?.VoucherCode,
      VoucherType: val?.TransactionType,
      VoucherName: val?.VoucherName,
      FullName: val?.VoucherFullName,
      AutoVerifyHISData: val?.IsAutoVerifyHISData,
      AutoAuthHISData: val?.IsAutoAuthByHISData,
      CreatedBy: val?.EntryBy,
      CreatedDate: val?.EntryDate,
      Status: val?.Active,
      Edit:<span> <i className="fa fa-edit" onClick={()=>onEdit(val)}></i></span>,
      Action: <span style={{fontWeight:"500", color:"blue"}} onClick={()=>handleDeactive(val)}>{val?.EAction}</span>,
    }
))
  return (
    <>
      <Tables thead={thead} tbody={[...tbody]} />
    </>
  );
};

export default VoucherMasterTable;
