import React, { useEffect, useState } from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";
import Heading from "../../Heading";

const DirectDepartmentItemDetailsTable = ({
  thead,
  tbody,
  handleChangeindex,
  handleChangeCheckbox, // Ensure this is passed from the parent
  transfer,
  tableData,
  setTableData,
}) => {
  const [updatedTbody, setUpdatedTbody] = useState(tbody);


  useEffect(() => {
    setUpdatedTbody(tbody);
  }, [tbody , transfer]);

  const handleInputChange = (e, index) => {
    const newValue = e.target.value;

    const updatedRows = updatedTbody.map((row, i) =>
      i === index
        ? {
            ...row,
            IssueQty: newValue,
            isManual: true,
            isChecked: newValue > 0, 
          }
        : row
    );

    setUpdatedTbody(updatedRows);
    setTableData(updatedRows); 
    handleChangeindex(e, index); 
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <Heading title={"Item Details"} />
        <Tables
          thead={thead}
          tbody={updatedTbody.map((ele, index) => ({
            SrNo: (
              <input
                type="checkbox"
                onChange={(e) => {
                  handleChangeCheckbox(e, ele, index);
                }}
                checked={ele?.isChecked ?? false}
              />
            ),
            ItemName: ele?.ItemName,
            BatchNumber: ele?.BatchNumber,
            MedExpiryDate: (
              <div className="text-center">{ele?.MedExpiryDate}</div>
            ),
            MRP: <div className="text-right">{ele?.MRP}</div>,
            "Unit Price": <div className="text-right">{ele?.UnitPrice}</div>, 
            "HSN Code": <div className="text-right">{ele?.HSNCode}</div>,
            "Unit Type": <div className="text-right">{ele?.UnitType}</div>,
            AvailQty: <div className="text-right">{ele?.AvailQty}</div>,
            UnitCost: (
              <Input
                className="table-input text-right"
                name="IssueQty"
                type="number"
                removeFormGroupClass={true}
                value={ele?.IssueQty ?? ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            ),
          }))}
          style={{ maxHeight: "162px" }}
        />
      </div>
    </div>
  );
};

export default DirectDepartmentItemDetailsTable;