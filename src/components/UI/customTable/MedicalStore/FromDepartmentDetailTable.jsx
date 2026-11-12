import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";

const FromDepartmentDetailTable = ({
  thead,
  tbody,
  handleChangeCheckbox,
  handleCustomInput,
}) => {
  return (
    <Tables
      thead={thead}
      tbody={tbody?.map((ele, index) => ({
        Action: (
          <input
            type="checkbox"
            className="table-checkbox"
            onChange={(e) => {
              handleChangeCheckbox(e, ele, index);
            }}
            checked={ele?.ReturnQty ? true : false}
          />
        ),
        ItemName: ele?.ItemName,
        BatchNumber: ele?.BatchNumber,
        Date: ele?.Date,
        AvailQty: <div className="text-right">{ele?.AvailQty}</div>,
        UnitPrice: <div className="text-right">{ele?.UnitPrice}</div>,
        ReturnQty: (
          <Input
            className="table-input"
            name="ReturnQty"
            type="number"
            removeFormGroupClass={true}
            value={ele?.ReturnQty ?? ""}
            onChange={(e) => {
              handleCustomInput(
                index,
                "ReturnQty",
                e.target.value,
                "number",
                ele?.AvailQty
              );
            }}
          />
        ),
      }))}
    />
  );
};

export default FromDepartmentDetailTable;
