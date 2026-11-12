import React from "react";
import Tables from "../../../../UI/customTable/index";
import Input from "../../../../formComponent/Input";

const AdditionalEstimationTable = ({ thead, tbody, handleCheck }) => {
  console.log(tbody);
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          "#": index + 1,
          data: (
            <input
              type="checkbox"
              name={"isChecked"}
              checked={ele?.isChecked === "1" ? true : false}
              onChange={(e) => handleCheck(e, index)}
            />
          ),
          Name: ele?.Name,
          Remarks: (
            <>
              <Input
                type="text"
                className="table-input"
                placeholder="Type"
                value={ele?.Remarks || ""}
                name="Remarks"
                onChange={(e) => handleCheck(e, index)}
                disabled={ele?.isChecked == "1" ? false : true}
              />
            </>
          ),
          Amount: (
            <>
              <Input
                type="number"
                className="table-input"
                placeholder="Amount"
                value={ele?.Amount || ""}
                name="Amount"
                disabled={ele?.isChecked == "1" ? false : true}
                onChange={(e) => handleCheck(e, index)}
              />
            </>
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ height: "150px" }}
      />
    </>
  );
};

export default AdditionalEstimationTable;
