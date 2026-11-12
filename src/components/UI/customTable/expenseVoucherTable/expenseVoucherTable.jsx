import React from "react";
import Tables from "..";
import { useTranslation } from "react-i18next";

const ExpenseVoucherTable = (props) => {
  const { tbody,handleSetClickData } = props;
  const [t] = useTranslation();

  const THEAD = [
    t("S.no"),
    t("ReceiptNo"),
    t("Received_Against_Receipt"),
    t("Date"),
    t("Amount_Paid"),
    t("Adjustment"),
    t("ExpenceType"),
    t("Name"),
    t("Remarks"),
    t("Receive"),
  ];

  const getRowClass = (rowData) => {
    if (rowData.PaymentType === "Received") {
      return "highlight-row";
    }
    return "";
  };
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody.map((item, index) => ({
          "S.no": index + 1,
          ReceiptNo: item?.ReceiptNo,
          ReceivedAgainstReceiptNo: item?.ReceivedAgainstReceiptNo,
          Date: item?.Date,
          Amount_Paid: item?.AmountPaid,
          Adjustment: item?.AdjustmentAmount ,
          PaymentType: item?.PaymentType,
          Name: item?.NAME,
          Remarks: item?.Naration,
          Receive: (
            <>
              {item.PaymentType === " Issue" ? (
                <i className="pi pi-check" onClick={()=> handleSetClickData(item)}></i>
              ) : (
                null
              )}
            </>
          ),
        }))}
        getRowClass={getRowClass}
        tableHeight={"tableHeight"}
      />
    </>
  );
};

export default ExpenseVoucherTable;
