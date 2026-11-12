import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../..";

const DischargeSummaryTable = (props) => {
  const { tbody } = props;
  const [t] = useTranslation();

  const THEAD = [
    t("S.No."),
    t("IPD No."),
    t("Entry Date"),
    t("Created By"),
    t("Status"),
    t("Date of Discharge"),
    t("View"),
  ];

  // const [bodyData, setBodyData] = useState([
  //   {
  //     "S.No.": 1,

  //     "IPD No.": (
  //      "s"
  //     ),

  //     "Entry Date	": 1,
  //     "Created By	": 1,
  //     "Status": 1,
  //     "Date of Discharge": 1,
  // "View": (
  //     <>
  //         <i  className='pi pi-eye'></i>
  //     </>
  // ),

  //   },
  // ]);
  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody.map((item, index) => ({
          "S.No.": index + 1,
          "IPD No.": item?.IPDNo,
          "Entry Date": item?.DATE,
          "Created By": item?.EntryBy,
          Status: item?.DStatus,
          "Date of Discharge": item?.DateOfDischarge,
          View: (
            <>
              <i className="pi pi-eye"></i>
            </>
          ),
        }))}
        tableHeight={"tableHeight"}
      />
    </>
  );
};

export default DischargeSummaryTable;
