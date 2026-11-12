import React from "react";
import Tables from "..";
import Input from "../../../formComponent/Input";
import Heading from "../../Heading";
import moment from "moment";
import { number } from "../../../../utils/constant";

const StockTransferTable = ({
  thead,
  tbody,
  handleChangeindex,
  handleChangeCheckbox,
}) => {
  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <Heading title={"Item Details"} />
          <Tables
            thead={thead}
            tbody={tbody?.map((ele, index) => ({
              SrNo: (
                <input
                  type="checkbox"
                  onChange={(e) => {
                    handleChangeCheckbox(e, ele, index);
                  }}
                  checked={ele?.isChecked ? ele?.isChecked : false}
                />
              ),
              ItemName: ele?.ItemName,
              BatchNumber: ele?.BatchNumber,
              MedExpiryDate: (
                <div className="text-center">{moment(ele?.MedExpiryDate).format("DD-MMM-YYYY")}</div>
              ),
              BuyPrice:ele?.UnitPrice ||"0.0",
              RoundOff:ele?.RoundOff ||"0.0",
              Octroi:ele?.Octroi ||"0.0",
              Freight:ele?.Freight ||"0.0",
              MRP: <div className="text-right">{ele?.MRP ||"0.0"}</div>,
              AvailQty: <div className="text-right">{ele?.AvailQty ||"0.0"}</div>,
              UnitType:ele.UnitTYpe,

              UnitCost: (
                <Input
                  className="table-input"
                  name="IssueQty"
                  type="number"
                  removeFormGroupClass={true}
                  value={ele?.IssueQty?? "0.0"}
                  onChange={(e) => handleChangeindex(e, index)}
                  disabled={ele?.isChecked === true ? false : true}
                />
              ),
            }))}
            // tableHeight={"tableHeight"}
            style={{ maxHeight: "162px" }}
          />
        </div>
      </div>
    </>
  );
};

export default StockTransferTable;
