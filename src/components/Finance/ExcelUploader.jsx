import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { notify } from "../../utils/utils";
import { useTranslation } from "react-i18next";

const ExcelUploader = ({ onDataExtracted, values , title , toBeChecked }) => {

  const [t] = useTranslation();
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (!validateInputs()) return;
    fileInputRef.current.click();
  };

  const validateInputs = () => {
    if (!values) return true;

    if (!values?.AccountName) {
      notify(t("Please Select Account Name"), "error");
      return;
    } else if (!values?.Currency?.value) {
      notify(t("Please Select Currency"), "error");
      return;
    } else if (!values?.ConversionFactor) {
      notify(t("Please Select Conversion Factor"), "error");
      return;
    } else if (!values?.VoucherDate) {
      notify(t("Please Select Voucher Date"), "error");
      return;
    } else if (!values?.VoucherType?.value) {
      notify(t("Please Select Voucher Type"), "error");
      return;
    } else if (!values?.Department?.value) {
      notify(t("Please select Department"), "error");
      return;
    } else if (!values?.Project?.value) {
      notify(t("Please select Project Name"), "error");
      return;
    }

    return true;
  };


  // IF YOU WANT TO SHOW THE FILE NAME AFTER UPLOAD USE THIS FUNCTION
  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   setFileName(file.name);

  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });
  //     // debugger;

  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     const jsonData = XLSX.utils.sheet_to_json(sheet, {
  //       raw: false, // Ensures formatted text values (w) are used instead of raw numbers (v)
  //       cellText: true, // Explicitly enables text extraction
  //     });
  //     console.log("Extracted Data:", jsonData);

  //     // Pass extracted data to the parent component
  //     if (onDataExtracted) {
  //       onDataExtracted(jsonData);
  //     }
  //   };

  //   reader.readAsArrayBuffer(file);
  // };



  // IF YOU DON'T WANT TO SHOW THE FILE NAME AFTER UPLOAD USE THIS FUNCTION
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        raw: false,
        cellText: true,
      });


      if (onDataExtracted) {
        onDataExtracted(jsonData);
      }

      // **Clear the file input after processing**
      setFileName(""); // Clear UI display of filename
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input field
      }
    };

    reader.readAsArrayBuffer(file);
  };

  

  return (
    <div className="excel-uploader">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
      />
      <button
        onClick={handleButtonClick}
        className="btn btn-sm btn-primary ml-2"
      >
        {title}
      </button>
      {fileName && (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-md">
          <span className="text-gray-700 font-medium">📄 {fileName}</span>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
