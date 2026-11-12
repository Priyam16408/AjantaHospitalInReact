import React, { useEffect } from "react";
import Tables from "..";
import moment from "moment";
import Input from "../../../formComponent/Input";

const MedicineIndentTable = ({
  THEAD,
  tbody,
  handleRateItemsChange,
  handleRemove,
  Authorization,
}) => {
  console.log(tbody);
  console.log(Authorization);

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((ele, index) => ({
          Code: ele?.Code,
          "Item Name": ele?.itemName,
          Payable: ele?.IsPayable ? ele?.IsPayable : "0",
          Date: ele?.Date,
          Remarks: ele?.Remarks,
          Rate:
            Authorization?.IsEdit === 1 ? (
              <Input
                className="table-input"
                name="Rate"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleRateItemsChange(index, "Rate", e.target.value, ele)
                }
                value={ele?.Rate}
              />
            ) : (
              ele?.Rate
            ),
          Quantity: ele?.Quantity,
          "Discount(%)":
            Authorization?.IsDiscount === 1 ? (
              <Input
                className="table-input"
                name="DiscountPer"
                removeFormGroupClass={true}
                type="number"
                onChange={(e) =>
                  handleRateItemsChange(
                    index,
                    "DiscountPer",
                    e.target.value,
                    ele
                  )
                }
                value={ele?.DiscountPer}
              />
            ) : (
              ele?.DiscountPer
            ),
          Amount:
            ele?.Rate && ele?.DiscountPer
              ? ele?.Rate - ele?.Rate * (ele?.DiscountPer / 100)
              : ele?.Rate,
          Remove: (
            <i
              onClick={() => handleRemove(index)}
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

export default MedicineIndentTable;
