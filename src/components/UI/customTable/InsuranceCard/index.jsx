import React from "react";
import Tables from "..";

function InsuranceCardGrid() {
  const THEAD = [
    "S.No",
    "Panel Name",
    "Name On Card",
    "Parent Panel",
    "Policy Card No.",
    "Expire Date",
  ];

  const TBODY = [
    {
      "S.No": 1,
      Panel: "AEXM2425-000001",
      "Parent Panel ": 1,
      "Policy Card No. ": 1,
      "Name On Card ": "Sahil",
      "Expire Date ": 1,
    },
  ];
  return (
    <div>
      <Tables thead={THEAD} tbody={TBODY} />
    </div>
  );
}

export default InsuranceCardGrid;
