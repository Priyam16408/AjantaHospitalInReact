import React, { useState } from "react";
import Tables from "../../UI/customTable";
import { useTranslation } from "react-i18next";

const StockTransferModal = ({ view }) => {
  const [viewDetail, setViewDetails] = useState(view);
  console.log(view);
  console.log(viewDetail);
  const [t] = useTranslation();
  const thead = [
    t("S.No."),
    t("Indent No."),
    t("Item Name"),
    t("Unit Type"),
    t("Requested Qty."),
    t("Issue Qty."),
    t("Rejected Qty."),
    t("Date"),
  ];
  return (
    <>
      <div>
        <Tables
          thead={thead}
          tbody={viewDetail?.map((ele, index) => ({
            SrNo: index + 1,
            indentno: ele?.IndentNo,
            itemName: ele?.ItemName,
            unitType: ele?.UnitType,
            reqQty: ele?.ReqQty,
            IssueQty: ele?.ReceiveQty,
            rejectQty: ele?.RejectQty,
            Date: ele?.Date,
          }))}
        />
      </div>
    </>
  );
};

export default StockTransferModal;
