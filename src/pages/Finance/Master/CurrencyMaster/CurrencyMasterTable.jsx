import React from "react";
import Tables from "../../../../components/UI/customTable";
import { useTranslation } from "react-i18next";

const CurrencyMasterTable = ({bindCurencyData,onEdit}) => {
   const [t] = useTranslation();
  const thead = [
    { name: t("S.No."), width: "1%" },
    { name: t("Base Currency"), width: "10%" },
    { name: t("Currency Code"), width: "10%" },
    { name: t("Country"), width: "10%" },
    { name: t("Entry Date"), width: "10%" },
    { name: t("Entry By"), width: "10%" },
    { name: t("Updated Date"), width: "10%" },
    { name: t("Updated By"), width: "10%" },
    { name: t("Active"), width: "10%" },
    { name: t("Edit"), width: "10%" },
  ];
  
  const tbody = 
  bindCurencyData?.map((val,ind)=>(
    {
      "S.No.":ind+ 1,
      "Base Currency": val?.CurrDescription,
      "Currency Code": val?.CurrencyCode,
      Country: val?.CountryName,
      "Entry Date": val?.EntryDate,
      "Entry By":val?.EntryBy,
      "Updated Date":val?.UpdatedDate,
      "Updated By": val?.LastUpdatedBy,
      Active: val?.Active,
      Edit:<span> <i className="fa fa-edit"onClick={()=>onEdit(val)} ></i></span>,
    }
  ))
  
  return (
    <>
      <Tables thead={thead} tbody={tbody} />
    </>
  );
};

export default CurrencyMasterTable;
