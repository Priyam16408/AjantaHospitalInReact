import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";

const MedicineReturnTable = ({
  THEAD,
  tbody,
  handleItemsChange,
  handleSelect,
}) => {
  console.log(tbody);
  console.log("handleItemsChange",handleItemsChange)
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((ele, index) => ({
          Code: ele?.Code,
          "Item Name": ele?.ItemName,

          AvailQty: ele?.inHandUnits,
          Rate: ele?.PerUnitSellingPrice,
          Quantity: (
            <Input
              className="table-input"
              name="quantity"
              removeFormGroupClass={true}
              type="number"
              onChange={(e) =>
                handleItemsChange(index, "quantity", e.target.value, ele)
              }
              value={ele?.quantity}
            />
          ),
          Remarks: (
            <Input
              className="table-input"
              name="Remarks"
              removeFormGroupClass={true}
              type="text"
              onChange={(e) =>
                handleItemsChange(index, "Remarks", e.target.value, ele)
              }
              value={ele?.Remarks}
            />
          ),
          Select: (
            <input
              type="checkbox"
              name="IsChecked"
              checked={ele?.IsChecked || false}
              onChange={(e) => handleSelect(e, index, ele)}
            />
          ),
        }))}
        tableHeight={"tableHeight"}
        style={{ maxHeight: "120px" }}
      />
    </>
  );
};

export default MedicineReturnTable;
