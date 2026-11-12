import React from "react";
import Tables from "..";
import Heading from "../../Heading";

const IssueItemDetailsTable = ({ thead, tbody, handleRemove }) => {
  return (
    <>
      {tbody?.length > 0 && (
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
                  MRP: <div className="text-right">{ele?.MRP}</div>,
                  IssueQty: <div className="text-right">{ele?.IssueQty}</div>,
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
                style={{ maxHeight: "150px" }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default IssueItemDetailsTable;
