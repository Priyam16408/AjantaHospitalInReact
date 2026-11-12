import React, { useState } from "react";
import Heading from "../../../../components/UI/Heading";
import Accordion from "../../../../components/UI/Accordion";
import { useTranslation } from "react-i18next";
import HandsOffReport from "../FlowSheet/HandsOffReport";

const FlowSheet = () => {
  const [t] = useTranslation();
  const thead = [
    { name: "S.No", width: "1%" },
    { name: "Status" },
    { name: "Name" },
    { name: "Date" },
    { name: "Time" },
  ];

  const [tableData, setTableData] = useState([
    {
      sno: 1,
      status: "Report Given/ Received by: (print name/title)",
      name: "Dhgyfer",
      date: "02-Oct-2024",
      time: "12:00 AM",
    },
    {
      sno: 2,
      status: "Report Given/ Received by: (print name/title)",
      name: "",
      date: "",
      time: "",
    },
    {
      sno: 3,
      status: "OR Report Given/ Received by: (print name/title)",
      name: "",
      date: "",
      time: "",
    },
  ]);
  return (
    <div className="card">
      <Heading title={t("Flow Sheet")} isBreadcrumb={true}></Heading>

      <Accordion title={t("Panel Details")} defaultValue={true}>
        <h1>Work In Progress</h1>
      </Accordion>
      <Accordion title={t("Patient Belongings")} defaultValue={true}>
        <h1>Work In Progress</h1>
      </Accordion>
      <Accordion title={t("Operating Rooms Preparation")} defaultValue={true}>
        <h1>Work In Progress</h1>
      </Accordion>
      <Accordion
        title={t(
          "Hands-Off Report(including Opportunity to ask & respond to questions)"
        )}
        defaultValue={true}
      >
        <HandsOffReport thead={thead} tableData={tableData} />
      </Accordion>

      <div className="p-2 d-flex justify-content-end" style={{ gap: "4px" }}>
        <button className="btn btn-sm btn-primary">Save</button>
        <button className="btn btn-sm btn-primary">Print</button>
      </div>
    </div>
  );
};

export default FlowSheet;
