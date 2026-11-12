import React, { useState } from "react";
// import Tables from "..";
// import { OpenPDFURL } from "../../../../networkServices/PDFURL"; 
import Tables from "../../../components/UI/customTable";
import { OpenPDFURL, RedirectURL } from "../../../networkServices/PDFURL";
import { PatientFeedBackReportPrint } from "../../../networkServices/cardPrint";
import moment from "moment";
function CardPrintTable({ bodyData, setBodyData }) {
  const THEAD = [
    { name: "S.no", width: "2%" },
    { name: "Patient ID", width: "" },
    { name: "Patient Name", width: "" },
    { name: "Contact No", width: "" },
    { name: "FeedBack Date", width: "" },
    { name: "Print Card", width: "" },
  ];

 
  const handlePrintCard = async (data) => {
    const payload= {
      PatientID: data?.PatientID,
      EntryFeedBackDate: data?.EntryFeedBackDate,
    }
    try {
      const res = await PatientFeedBackReportPrint(payload);
  
      if (res.success) {
        // window.open(res.data.pdfUrl, "_blank");
        RedirectURL(res?.data?.pdfUrl);
      } else {
        console.error("PDF URL not found in response", res);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  


  return (
    <div className="card">
      <Tables
        style={{ height: "65vh" }}
        thead={THEAD}
        tbody={bodyData.map((row, index) => ({
        //   ...row,
          "S.no": index + 1,
          "Patient ID": row.PatientID, 
          "Patient Name": row.PatientName, 
          "Contact No": row.MobileNo, 
          "Date Enrolled": row.EntryFeedBackDate, 
          "Print Card": (
            <i
              className="fa fa-print card-print-upload-image-icon"
              aria-hidden="true"
              onClick={() => handlePrintCard(row)} 
            ></i>
          ),
        }))}
      />
    </div>
  );
}

export default CardPrintTable;
