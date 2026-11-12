import React from "react";
import Tables from "..";

const ConsignmentSaleReturnAddedTable = ({ thead, tbody, handleRemove }) => {
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          SrNo: index + 1,
          ItemName: ele?.ItemName,
          BatchNumber: ele?.BatchNumber,
          MRP: <div className="text-right">{ele?.MRP}</div>,
          RetQty: <div className="text-right">{ele?.ReturnQty}</div>,
          RejectQty: <div className="text-right">{ele?.RejectQty}</div>,
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

export default ConsignmentSaleReturnAddedTable;
