import React from "react";
import Tables from "..";
import Heading from "../../Heading";
import ColorCodingSearch from "../../../commonComponents/ColorCodingSearch";

const ServiceDetailsTable = ({ THEAD, tbody }) => {
  console.log(tbody)
  return (
    <>
      <Heading
        title={"Service Items"}
        secondTitle={
          <>
            <ColorCodingSearch color={"orange"} label={"Reserved"} />
            <ColorCodingSearch color={"green"} label={"Issued"} />
          </>
        }
      />
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Sr No.": index + 1,
          "Doctor Name": item?.Dname,
          "Blood Group": item?.BloodGroup,
          Component: item?.Iscomponent,
          "Req.Qty": item?.Quantity,
          "Issue Qty": item?.IssueQty,
          "Reject Qty": item?.RejectQty,
          "Pen.Qty": item?.PendingQuantity,
          "Cross Matched Qty": item?.CrossMatchQty,
          "Reserve Date": item?.ReserveDate,
          View: <i className="fa fa-eye" aria-hidden="true"></i>,
        }))}
        tableHeight={"tableHeight"}
        style={{ height: "auto" }}
        // getRowClass={getRowClass}
      />
    </>
  );
};

export default ServiceDetailsTable;
