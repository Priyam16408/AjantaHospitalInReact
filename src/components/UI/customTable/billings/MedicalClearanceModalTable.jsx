import React from "react";
import Tables from "..";

const MedicalClearanceModalTable = ({ THEAD, tbody }) => {
  const tbodyData = [
    {
      Srno: "1",
      "CR.No": "20GENERAL",
      RequisitionDate: "22/02/2024",
      RequisitionNo: "3343",
      ToDepartment: "XYZ",
      ViewRequisition: <i className="fa fa-search" aria-hidden="true"></i>,
    },
  ];
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "#": index + 1,
          dtEntry: item?.dtEntry,
          indentno: item?.indentno,
          DeptTo: item?.DeptTo,
          ViewRequisition:( <i className="fa fa-search" aria-hidden="true"></i>)
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "auto" }}
      />
    </>
  );
};

export default MedicalClearanceModalTable;
