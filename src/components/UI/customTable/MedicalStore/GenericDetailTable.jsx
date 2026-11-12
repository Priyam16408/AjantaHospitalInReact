import React from "react";
import Tables from "..";

const GenericDetailTable = ({ thead, tbody,handleRemove }) => {
  return (
    <Tables
      thead={thead}
      tbody={tbody?.map((ele, index) => ({
        index: index + 1,
        saltname: ele?.saltname,
        Strength: ele?.Strength,
        unit: ele?.Unit,
        Remove: (
          <i
            onClick={() => handleRemove(index,ele)}
            className="fa fa-trash text-danger text-center"
            style={{ color: "red" }}
            aria-hidden="true"
          ></i>
        ),
      }))}
    />
  );
};

export default GenericDetailTable;
