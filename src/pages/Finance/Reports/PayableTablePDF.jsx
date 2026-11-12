import React, { useEffect } from "react";
import html2pdf from "html2pdf.js";
import IconsColor from "../../../utils/IconsColor";

const PayableTablePDF = ({ theadData, tableData, payabletableData, paybleLederData, filename, heading, onComplete, autoGenerate = false,tBTableData }) => {
debugger
  console.log(tBTableData);

  useEffect(() => {
    if (autoGenerate) {
      generatePDF();
    }
  }, [autoGenerate]);
  const generatePDF = () => {
    // Create a hidden table element
    const tableElement = document.createElement("div");
    tableElement.innerHTML = `
      <h2 style="text-align: center; font-weight: bold; font-size: 18px;">${heading}</h2>
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
        <thead>
          <tr style="background-color: #f2f2f2;">
           ${theadData.map((header) => `<th>${header?.name}</th>`).join("")}
          </tr>
        </thead>
        <tbody style="">
        

      ${paybleLederData && paybleLederData.length > 0 ?
        paybleLederData?.map((val, index) => `
          <tr>
            <td>${val["S.No"] || ""}</td>
            <td>${val["BranchCenter"] || ""}</td>
            <td>${val["Voucher Date"] || ""}</td>
            <td>${val["Voucher type"] || ""}</td>
            <td>${val["Voucher No."] || ""}</td>
            <td>${val["Bill No."] || ""}</td>
            <td>${val["Bill Date."] || ""}</td>
            <td>${val["Narration"] || ""}</td>
            <td>${val["Ref No."] || ""}</td>
            <td>${val["Ref Date."] || ""}</td>
            <td>${val.Debit || ""}</td>
            <td>${val.Credit || ""}</td>
            <td>${val["Running Bal."] || ""}</td>
            <td>${val.Type || ""}</td>
          </tr>
        `).join("")
        : ""
      }

        ${tableData && tableData.length > 0 ?
        tableData?.map((val, index) => `
          <tr ${val["S.No"] === "Total" ? 'style="background-color: #003366; color: white; font-weight: bold;"' : ''}>
            <td>${val["S.No"] ? val["S.No"] : index + 1}</td>
            <td>${val["Trade Type"] || val.TradeType || ""}</td>
            <td>${val["A/C Name"] || val.AccountName || ""}</td>
            <td>${val["Total Inv Amt"] || val.SpecificAmountDisplay || "0.00"}</td>
            <td>${val["Adjusted Amt"] || val.AdjustmentSpecificAmountDisplay || "0.00"}</td>
            <td>${val["Pending Amount"] || val.PendingSpecificAmountDisplay || "0.00"}</td>
            <td>${val["1 Year"] || val.Section1 || "0.00"}</td>
            <td>${val["2 Year"] || val.Section2 || "0.00"}</td>
            <td>${val["3 Year"] || val.Section3 || "0.00"}</td>
            <td>${val["4 Year"] || val.Section4 || "0.00"}</td>
            <td>${val["5 Year"] || val.Section5 || "0.00"}</td>
            <td>${val["5 Year Above"] || val.Section6 || "0.00"}</td>
          </tr>
        `).join("")
        : ""}

        ${payabletableData && payabletableData.length > 0 ?
        payabletableData?.map((val, index) => ` 
          <tr>
            <td>${index + 1}</td>
            <td>${val.COAID}</td>
            <td>${val.AccountName}</td>
            <td>${val.CurrencyCode}</td>
            <td>${val.BalanceType}</td>
            <td>${val.BillNo}</td>
            <td>${val.BillDate}</td>
            <td>${val.SpecificAmountDisplay}</td>
            <td>${val.AdjustmentSpecificAmountDisplay}</td>
            <td>${val.PendingSpecificAmountDispaly}</td>
            <td>${val.CF}</td>
          </tr>
        `).join("") : ""}


        </tbody >
      </table >
  `;

    html2pdf()
      .from(tableElement)
      .set({
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      })
      .save()
      .then(() => {
        if (onComplete) onComplete(); // Call the callback after PDF generation
      });
  };

  // return null;
  return (
    <>
      {!autoGenerate && (
        <div style={{ cursor: "pointer" }} onClick={generatePDF}>
          <IconsColor ColorCode={"PDF"} />
        </div>
      )}
    </>
  );
};

export default PayableTablePDF;
