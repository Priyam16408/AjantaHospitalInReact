import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";

const IssuedItemsTable = ({
  thead,
  tbody,
  handleChangeCheckbox,
  handleCustomInput,
}) => {
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          Action: (
            <input
              type="checkbox"
              onChange={(e) => {
                handleChangeCheckbox(e, ele, index);
              }}
              checked={ele?.isChecked ? ele?.isChecked : false}
            />
          ),
          ItemName: ele?.ItemName,
          IssueUnits: <div className="text-right">{ele?.IssueUnits}</div>,
          Date: ele?.Date,
          BatchNumber: ele?.BatchNumber,
          MRP:<div className="text-right">{ ele?.MRP}</div>,
          DeptName: ele?.DeptName,
          // DeptName: ele?.DeptName,
          inHandUnits:<div className="text-right">{ ele?.inHandUnits}</div>,
          ReturnQty: (
            <Input
              className="table-input"
              name="ReturnQty"
              type="number"
              display={"right"}
              removeFormGroupClass={true}
              value={ele?.ReturnQty ?? ""}
              onChange={(e) => {
                handleCustomInput(
                  index,
                  "ReturnQty",
                  e.target.value,
                  "number",
                  ele?.IssueUnits
                );
              }}
              disabled={ele?.isChecked === true ? false : true}
            />
          ),
        }))}
      />
    </>
  );
};

export default IssuedItemsTable;
