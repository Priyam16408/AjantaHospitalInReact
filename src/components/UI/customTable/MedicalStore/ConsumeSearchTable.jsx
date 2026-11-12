import React from "react";
import Tables from "..";
import Heading from "../../Heading";

const ConsumeSearchTable = ({ thead, tbody }) => {
  return (
    <>
      {/* <Heading title={"Item Details"} />
      <div className="row"> */}
      <div className="col-sm-12">
        <Tables
          thead={thead}
          tbody={tbody?.map((ele, index) => ({
            SrNo: index + 1,
            ItemName: ele?.ItemName,
            BatchNumber: ele?.BatchNo,
            MedExpiryDate: <div className="text-center">{ele?.ExpiryDate}</div>,
            Consumer: ele?.PName,
            ConsumeDate: <div className="text-center">{ele?.ConsumeDate}</div>,
            UnitPrice: <div className="text-right">{ele?.UnitPrice}</div>,
            Quantity: <div className="text-right">{ele?.Quantity}</div>,
            UnitCost: <div className="text-right">{ele?.UnitPrice}</div>,
          }))}
          tableHeight={"scrollView"}
          style={{ height: "200px" }}
        />
      </div>
      {/* </div> */}
    </>
  );
};

export default ConsumeSearchTable;
