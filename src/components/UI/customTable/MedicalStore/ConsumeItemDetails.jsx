import React from "react";
import Tables from "..";
import Heading from "../../Heading";

const ConsumeItemDetails = ({ thead, tbody, handleDelete }) => {
  return (
    <>
      <Heading title={"Item Details"} />
      <div className="row">
        <div className="col-sm-12">
          <Tables
            thead={thead}
            tbody={tbody?.map((ele, index) => ({
              SrNo: index + 1,
              ItemName: ele?.ItemName,
              BatchNumber: ele?.BatchNumber,
              MedExpiryDate: ele?.MedExpiryDate,
              AvlQty: <div className="text-right">{ele?.AvlQty}</div>,
              UnitPrice: <div className="text-right">{ele?.UnitPrice}</div>,
              Remove: (
                <i
                  className="fa fa-times text-danger"
                  aria-hidden="true"
                  onClick={() => handleDelete(ele, index)}
                ></i>
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
};

export default ConsumeItemDetails;
