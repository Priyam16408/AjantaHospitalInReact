import React from "react";
import Tables from "..";

const AddReturnDeptDetailTable = ({ thead, tbody, handleRemove }) => {
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          index: index + 1,
          ItemName: ele?.ItemName,
          BatchNumber: ele?.BatchNumber,
          UnitPrice: ele?.UnitPrice,
          ReturnQty: ele?.ReturnQty,
          Remove: (
            <i
              onClick={() => handleRemove(index)}
              className="fa fa-trash text-danger text-center"
              style={{ color: "red" }}
              aria-hidden="true"
            ></i>
          ),
        }))}
      />
    </>
  );
};

export default AddReturnDeptDetailTable;
