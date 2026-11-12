import React from "react";
import Tables from "..";
import Heading from "../../Heading";
import { useTranslation } from "react-i18next";

const PatientAdvanceDetailTable = ({ tbody }) => {
  const { t } = useTranslation();
  const thead = [
    t("Receipt No."),
    t("Payment Mode"),
    t("Amount Paid"),
    t("Date"),
    t("Time"),
    t("Receiver"),
    t("Type"),
  ];

  return (
    <div className="col-sm-12">
      <Heading title={"Patient Advance Detail"} />
      <Tables
        thead={thead}
        tbody={tbody.map((ele, index) => ({
          "Receipt No.": ele?.ReceiptNo,
          "Payment Mode": ele?.PaymentMode,
          "Amount Paid": ele?.AmountPaid,
          " Date": ele?.Date,
          Time: ele?.Time,
          Receiver: ele?.Receiver,
          Type: ele?.Type,
        }))}
      />
    </div>
  );
};

export default PatientAdvanceDetailTable;
