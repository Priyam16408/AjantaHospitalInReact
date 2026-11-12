import React from "react";
import Tables from "..";

const ConsignmentSaleReturnTable = ({
  thead,
  tbody,
  getConsignmentBindItem,
}) => {
  console.log(tbody);
  return (
    <>
      <Tables
        thead={thead}
        tbody={tbody?.map((ele, index) => ({
          index: ele?.TransNo,
          PNAME: ele?.PNAME,
          Address: ele?.Address,
          Select: (
            <i
              className="fa fa-search"
              aria-hidden="true"
              onClick={() => getConsignmentBindItem(ele?.TransactionID)}
            ></i>
          ),
        }))}
        style={{maxHeight:"100px"}}
      />
    </>
  );
};

export default ConsignmentSaleReturnTable;
