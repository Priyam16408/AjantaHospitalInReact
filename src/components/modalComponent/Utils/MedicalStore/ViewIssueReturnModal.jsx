import React, { useState } from "react";
import ReactSelect from "../../../formComponent/ReactSelect";
import { IssueReportTypeOption } from "../../../../utils/constant";
import { useTranslation } from "react-i18next";

const ViewIssueReturnModal = ({ payload, setPayload, handleReactSelect }) => {
  const [t] = useTranslation();

  return (
    <>
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Search Type")}
          id={"ReportType"}
          searchable={true}
          respclass="col-12"
          name={"ReportType"}
          dynamicOptions={IssueReportTypeOption}
          value={payload?.ReportType}
          handleChange={handleReactSelect}
        />
      </div>
    </>
  );
};

export default ViewIssueReturnModal;
