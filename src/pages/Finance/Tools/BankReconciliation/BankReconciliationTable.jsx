import React from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../../../components/formComponent/LabeledInput";
import Tables from "../../../../components/UI/customTable";
import Input from "../../../../components/formComponent/Input";
import { useState } from "react";

const BankReconciliationTable = ({
    data,
}) => {
  const [t] = useTranslation();

  const headData = [
    t("S.No."),
    t("Account Name"),
    t("Amount Local"),
    t("Amount"),
    t("Bal Type"),
    t("Cheque No"),
    t("Cheque Date"),
    t("Remarks"),
  ];
  return (
    <div className="mt-2">
      <div className="row p-2">
        <Tables
          thead={headData}
          tbody={data?.map((ele, index) => ({
            SNo: index + 1,
            AccountName: ele?.AccountName,
            AccountLocal: ele?.AmountBase,
            Amount: ele?.AmountSpecific,
            BalType: ele?.BalType,
            ChequeNo: ele?.RefNo,
            ChequeDate: ele?.RefDate,
            Remarks: ele?.Remarks,
          }))}
        />
      </div>
    </div>
  );
};

export default BankReconciliationTable;
