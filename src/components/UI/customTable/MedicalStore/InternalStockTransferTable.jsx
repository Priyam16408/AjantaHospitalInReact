import React from "react";
import Tables from "..";
import Heading from "../../Heading";
import { ReprintSVG } from "../../../SvgIcons";
import ColorCodingSearch from "../../../commonComponents/ColorCodingSearch";

const InternalStockTransferTable = ({
  thead,
  tbody,
  handleApprovalDetails,
  handleViewDetails,
  reportOpen,
  handleSearch,
}) => {
  // console.log("handleViewDetails", handleViewDetails);
  const getRowClass = (val, index) => {

    const item = tbody[index];

    if (item?.StatusNew === "OPEN") {
      return "color-indicator-1-bg";
    }
    if (item?.StatusNew === "CLOSE") {
      return "color-indicator-10-bg";
    }

    if (item?.StatusNew === "REJECT") {
      return "color-indicator-2-bg";
    }

    if (item?.StatusNew === "PARTIAL") {
      return "color-indicator-4-bg";
    }
    console.log("asssssssss", item)
  }
  return (
    <>
      <div className="card py-2 my-1">
        <Heading
          title={"Item Details"}
          isBreadcrumb={false}
          secondTitle={
            <>
                <ColorCodingSearch color={"color-indicator-1-bg"} label={"Approved"} onClick={() => handleSearch("OPEN")} />

                <ColorCodingSearch color={"color-indicator-10-bg"} label={"Issued"} onClick={() => handleSearch("CLOSE")} />

                <ColorCodingSearch color={"color-indicator-2-bg"} label={"Reject"} onClick={() => handleSearch("REJECT")} />
    
                <ColorCodingSearch color={"color-indicator-4-bg"} label={"Partial"} onClick={() => handleSearch("PARTIAL")} />
            </>
          }
        />

        <div className="row">
          <div className="col-sm-12">
            <Tables
              thead={thead}
              tbody={tbody?.map((ele, index) => ({
                SrNo: index + 1,
                dtEntry: ele?.dtEntry,
                indentno: ele?.indentno,
                CentreFrom: ele?.CentreFrom,
                DeptFrom: ele?.DeptFrom,
                RequisitionType: ele?.Type,
                View:
                  ele?.StatusNew === "REJECT" ? (
                    ""
                  ) : (
                    <div className="text-center">
                      <i
                        className="fa fa-search"
                        aria-hidden="true"
                        onClick={() => handleViewDetails(ele)}
                      ></i>
                    </div>
                  ),
                ViewDetails: (
                  <div className="text-center">
                    <i
                      className="fa fa-eye"
                      aria-hidden="true"
                      onClick={() => handleApprovalDetails("40vw", ele)}
                    ></i>{" "}
                  </div>
                ),
                Reprint:
                  ele?.StatusNew === "PARTIAL" ? (
                    <div
                      className="text-center"
                      onClick={() => reportOpen(ele)}
                    >
                      <ReprintSVG />
                    </div>
                  ) : (
                    ""
                  ),
              }))}
              style={{ height: "110px" }}
              getRowClass={getRowClass}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalStockTransferTable;
