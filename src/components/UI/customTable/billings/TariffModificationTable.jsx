import React from "react";
import Tables from "..";

const TariffModificationTable = ({ THEAD, tbody }) => {
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Sr No.": index + 1,
          Category: item?.Category,
          "Current Gross Bill": (
            <div className="text-right">{item?.CurrentGrossBill}</div>
          ),
          TotalDiscAmt: <div className="text-right">{item?.TotalDiscAmt}</div>,
          "Proposed Gross Bill": (
            <div className="text-right">{item?.ProposedGrossBill}</div>
          ),
          "Proposed DiscAmt": (
            <div className="text-right">{item?.ProposedDiscAmt}</div>
          ),
          "Gross Amt Diff": (
            <div className="text-right">{item?.GrossAmtDiff}</div>
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ height: "auto" }}
        // getRowClass={getRowClass}
      />
    </>
  );
};

export default TariffModificationTable;
