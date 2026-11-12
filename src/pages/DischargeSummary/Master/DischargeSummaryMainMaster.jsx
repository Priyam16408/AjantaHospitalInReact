import React from "react";
import DischargeSummaryHeaderMaster from "./DischargeSummaryHeaderMaster";
import DischargeSummarySetHeaderDept from "./DischargeSummarySetHeaderDept";
import DischargeSummarySetHeaderMandatory from "./DischargeSummarySetHeaderMandatory";

const DischargeSummaryMainMaster = () => {
  return (
    <div className="row">
      <div className="col-md-12 col-xl-6 ">
        <DischargeSummaryHeaderMaster />
      </div>
      <div className="col-md-12 col-xl-6 ">
        <DischargeSummarySetHeaderDept />
      </div>
      <div className="col-12">
        <DischargeSummarySetHeaderMandatory />
      </div>
    </div>
  );
};

export default DischargeSummaryMainMaster;
