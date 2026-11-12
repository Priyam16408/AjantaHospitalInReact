import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";

const CurrentStockTable = ({ thead, tbody, handleCustomInput }) => {
  return (
    <Tables
      thead={thead}
      tbody={tbody?.map((ele, index) => ({
        "Sr No": index + 1,
        StockID: ele?.StockID,
        StockDate: ele?.StockDate,
        ItemName: ele?.ItemName,
        BatchNumber: ele?.BatchNumber,
        UnitPrice: ele?.UnitPrice,
        AvailableQty: ele?.AvailableQty,
        ExpiryDate: ele?.ExpiryDate,
        "New Unit. Price": (
          <Input
            className="table-input"
            name="newUnitPrice"
            type="number"
            display={"right"}
            removeFormGroupClass={true}
            value={ele?.newUnitPrice ?? ""}
            onChange={(e) => {
              handleCustomInput(
                index,
                ele,
                "newUnitPrice",
                e.target.value,
                "number",
                ele?.AvailableQty
              );
            }}
          />
        ),
      }))}
      tableHeight={"tableHeight"}
      style={{ maxHeight: "200px" }}
    />
  );
};

export default CurrentStockTable;
