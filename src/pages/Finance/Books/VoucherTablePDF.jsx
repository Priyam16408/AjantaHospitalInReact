import React from "react";
import html2pdf from "html2pdf.js";
import IconsColor from "../../../utils/IconsColor";

const VoucherTablePDF = ({ tableData }) => {
  const generatePDF = () => {
    // Create a hidden table element
    const tableElement = document.createElement("div");
    tableElement.innerHTML = `
      <h2 style="text-align: center; font-weight: bold; font-size: 18px;">Voucher Report</h2>
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Voucher Name</th>
            <th>Account Name</th>
            <th>Voucher No</th>
            <th>Voucher Date</th>
            <th>Currency</th>
            <th>Entry Date</th>
            <th>Credit Amount</th>
            <th>Debit Amount</th>
            <th>Periods</th>
          </tr>
        </thead>
        <tbody>
          ${tableData
            .map(
              (item) => `
              <tr>
                <td>${item.VoucherName}</td>
                <td>${item.AccountName}</td>
                <td>${item.VoucherNo}</td>
                <td>${item.VoucherDate}</td>
                <td>${item.CurrencyCode}</td>
                <td>${item.EntryDate}</td>
                <td>${item.AmountDisplayCr || "-"}</td>
                <td>${item.AmountDisplayDr || "-"}</td>
                <td>${item.Periods}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    html2pdf()
      .from(tableElement)
      .set({
        margin: 10,
        filename: "Account_Book_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .save();
  };

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={generatePDF}>
        <IconsColor ColorCode={"PDF"} />
      </div>
    </div>
  );
};

export default VoucherTablePDF;
