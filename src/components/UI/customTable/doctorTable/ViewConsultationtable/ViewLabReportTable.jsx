import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../..";
import { notify } from "../../../../../utils/utils";
import { BindLabReport } from "../../../../../networkServices/resultEntry";
import { RedirectURL } from "../../../../../networkServices/PDFURL";

const ViewLabReportTable = ({ tbody }) => {
  // console.log(props);

  // const {tbody} = props;
  // console.log(tbody);

  const [t] = useTranslation();

  const THEAD = [
    t("Delta Check"),
    t("Date"),
    t("BarcodeNo"),
    t("Department"),
    t("Investigations"),
    t("View Report"),
  ];

  const handleViewReport = () => {
    console.log("View Report Clicked");
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const handleBindLabReport = async (Test_ID) => {
    const payload = {
      testID: Test_ID,
      isOnlinePrint: "1",
      isConversion: "",
      isNabl: "0",
      orderBy: "",
      labType: "1",
      ipAddress: "",
      isPrev: true,
    };
    try {
      const url = `http://lab.neohospital.com/Hospedia/Design/Lab/printLabReport_pdf.aspx?TestID=${Test_ID}&LabType=&LabreportType=11`;
       window.open(`${url}`, "_blank");

      // const apiResp = await BindLabReport(payload);

      // if (!apiResp?.success || !apiResp?.data) {
      //   notify("No records found", "error");
      //   return;
      // } else if (apiResp?.success) {
      // RedirectURL(url);
      //   return;
      // }
    } catch (error) {
      console.error("Error processing PDF:", error);
      notify("An error occurred while fetching data", "error");
    }
  };
  console.log(tbody, "tbody");

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          "Delta Check": (
            <>
              <i className="pi pi-search" style={{ padding: "5px" }}></i>
            </>
          ),
          Date: item?.DATE,
          BarcodeNo: item?.BarcodeNo,
          Department: item?.Department,
          Investigations: item?.Name,
          "Pacs Images": (
            item?.canViewReport === 1 ? (
              <div
                className="d-flex justify-content-center align-items-center hover_effect"
                onClick={() => {
                  handleBindLabReport(item.Test_ID);
                }}
              >
                <i
                  className="fa fa-eye"
                  style={{ padding: "5px", textAlign: "center" }}
                ></i>
              </div>) : <></>
          ),
        }))}
        // tbody={
        //   {
        //     "Delta Check":"",
        //   "Date":props?.tbody?.DATE,
        //   "BarcodeNo":props?.tbody?.BarcodeNo,
        //   "Department":props?.tbody?.Department,
        //   "Investigations":props?.tbody?.Name,
        //   "Pacs Images":"",
        //   }
        // }
        tableHeight={"tableHeight"}
      />
      {/* <Tables
        thead={THEAD}
        tbody={(Array.isArray(tbody) ? tbody : []).map((item, index) => ({
          "Delta Check": (
            <>
              <i className="pi pi-search" style={{ padding: "5px" }}></i>
            </>
          ),
          Date: item?.DATE,
          BarcodeNo: item?.BarcodeNo,
          Department: item?.Department,
          Investigations: item?.Name,
          "Pacs Images": "",
        }))}
      /> */}
    </>
  );
};

export default ViewLabReportTable;
