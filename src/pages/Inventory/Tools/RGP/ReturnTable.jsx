import React from "react";
import Tables from "../../../../components/UI/customTable";


const ReturnTable = ({ thead, tbody, handleRemove }) => {
  console.log("ReturnItemsTable", tbody);
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => {
          const unitPrice = Number(ele?.UnitPrice) || 0;
          const returnQty = Number(ele?.ReturnQty) || 0;
          const discountPer = Number(ele?.DiscountPer) || 0;
          const gstPer = Number(ele?.PurTaxPer) || 0;

          const discountAmount = (unitPrice * returnQty * discountPer) / 100;
          const gstAmount = (unitPrice * returnQty * gstPer) / 100;
          const totalAmount = (unitPrice * returnQty) - discountAmount + gstAmount;

          return {
            index: index + 1,
            // InvoiceNo: ele?.InvoiceNo,
            ItemName: ele?.ItemName,
            BatchNumber: ele?.BatchNumber,
            MedExpiryDate: ele?.MedExpiryDate,
            // UnitPrice: unitPrice.toFixed(2),
            // ReturnQty: returnQty,
            // GSTPer: gstPer,
            // DisPer: discountPer,
            // DisAmount: discountAmount.toFixed(2),
            // Amount: totalAmount.toFixed(2),
            Remove: (
              <i
                onClick={() => handleRemove(index)}
                className="fa fa-trash text-danger text-center"
                style={{ color: "red" }}
                aria-hidden="true"
              ></i>
            ),
          };
        })}
        style={{ maxHeight: "162px" }}
      />
    </>
  );
};


export default ReturnTable;
