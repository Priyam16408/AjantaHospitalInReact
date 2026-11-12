import React from "react";
import Tables from "..";

const MedicineInvestigationTable = ({ THEAD, tbody, handleRemoveIR }) => {
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((ele, index) => ({
          Code: ele?.Code,
          "Item Name": ele?.itemName,
          Dose: ele?.Dose,
          Time: ele?.Times,
          Duration: ele?.Duration,
          Route: ele?.Route,
          Meals: ele?.Meals,
          Quantity: ele?.Quantity,
          Remarks: ele?.Remarks,
          Remove: (
            <i
              onClick={() => handleRemoveIR(index)}
              className="fa fa-trash text-danger text-center"
              style={{ color: "red" }}
              aria-hidden="true"
            ></i>
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "120px" }}
      />
    </>
  );
};

export default MedicineInvestigationTable;
