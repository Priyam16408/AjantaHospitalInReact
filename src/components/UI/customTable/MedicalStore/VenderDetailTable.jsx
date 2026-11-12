import React from "react";
import Tables from "..";
import Heading from "../../Heading";
import Input from "../../../formComponent/Input";

const VenderDetailTable = ({
  thead,
  tbody,
  handleChangeCheckbox,
  handleCustomInput,
}) => {
  console.log(tbody);
  return (
    <>
      {tbody?.length > 0 && (
        <>
          <Heading title={"Search Result"} />
          {/* <div className="row"> */}
          <Tables
            thead={thead}
            tbody={tbody?.map((ele, index) => ({
              Action: (
                <div className="text-center">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    onChange={(e) => {
                      handleChangeCheckbox(e, ele, index);
                    }}
                    checked={ele?.isChecked ? ele?.isChecked : false}
                  />
                </div>
              ),
              GRNNo: ele?.billno,
              InvoiceNo: ele?.InvoiceNo,
              ItemName: ele?.ItemName,
              BatchNumber: ele?.BatchNumber,
              MedExpiryDate: ele?.MedExpiryDate,
              AvailQty: ele?.AvailQty,
              UnitPrice: ele?.UnitPrice,
              "New Batch No": (
                <Input
                  className="table-input"
                  name="newBatchNo"
                  type="text" // ✅ Change type to "text" to allow letters
                  display="right"
                  value={ele?.newBatchNo ?? ""}
                  removeFormGroupClass={true}
                  onChange={(e) => {
                    handleCustomInput(
                      index,
                      "newBatchNo",
                      e.target.value,
                      "text",
                      100
                    );
                  }}
                  disabled={ele?.isChecked === true ? false : true}
                />
              ),
              DiscountPer: (
                <Input
                  className="table-input"
                  name="DiscountPer"
                  type="number"
                  display="right"
                  value={ele?.DiscountPer ?? ""}
                  removeFormGroupClass={true}
                  onChange={(e) => {
                    handleCustomInput(
                      index,
                      "DiscountPer",
                      e.target.value,
                      "number",
                      100
                    );
                  }}
                  disabled={ele?.isChecked === true ? false : true}
                />
              ),
              ReturnQty: (
                <Input
                  className="table-input"
                  name="ReturnQty"
                  type="number"
                  display="right"
                  value={ele?.ReturnQty ?? ""}
                  removeFormGroupClass={true}
                  onChange={(e) => {
                    handleCustomInput(
                      index,
                      "ReturnQty",
                      e.target.value,
                      "number",
                      Number(ele?.AvailQty)
                    );
                  }}
                  disabled={ele?.isChecked === true ? false : true}
                />
              ),
            }))}
            style={{ maxHeight: "162px" }}
          />
          {/* </div> */}
        </>
      )}
    </>
  );
};

export default VenderDetailTable;
