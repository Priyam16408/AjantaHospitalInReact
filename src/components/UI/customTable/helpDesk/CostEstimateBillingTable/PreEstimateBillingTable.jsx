import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../../UI/customTable/index";
const PreEstimateBillingTable = ({ thead, tbody,handlePreEstimationCheck }) => {
  const [t] = useTranslation();
  console.log("tbody,tbody", tbody);
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          "#": index + 1,
          data: (
            <input
              type="checkbox"
              name={"isItemChecked"}
              checked={ele?.isItemChecked === "1" ? true : false}
              onChange={(e) => handlePreEstimationCheck(e, index)}
            />
          ),
          DisplayName: ele?.DisplayName,
          Remarks: ele?.Qty,
          Amount: ele?.NetAmt,
        }))}
        tableHeight={"tableHeight"}
        style={{ height: "150px" }}
      />
    </>
  );
};

export default PreEstimateBillingTable;
