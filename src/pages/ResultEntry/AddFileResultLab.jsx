import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import SaveButton from "../../components/UI/SaveButton";
import {
  BindAttachmentLab,
  BindPatientDetails,
  BindPatientDetailsImage
} from "../../networkServices/resultEntry";
import { notify, removeBase64Data } from "../../utils/utils";
import LabeledInput from "../../components/formComponent/LabeledInput";
import { NursingWardDiabeticChartPrintAPI } from "../../networkServices/nursingWardAPI";
import { RedirectURL } from "../../networkServices/PDFURL";
import { BindAttachment } from "../../networkServices/resultEntry";
export default function AddFileResultLab({ handleChangeModel, patientDetail, val, pdata }) {
  console.log(val);
  const [t] = useTranslation();
  const [inputs, setInputs] = useState(patientDetail);
  const [fileData, setFileData] = useState([]);
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({
    BarcodeNo: val?.BarcodeNo || "",
    PatientName: val?.PName || "",
    UHID: val?.PatientID || "",
  });

  const handleBindPatientDetails = async (LedgerTransactionNo) => {
    const params = LedgerTransactionNo ? `LedgerTransactionNo=${LedgerTransactionNo}` : `LedgerTransactionNo=${pdata.LedgerTransactionNo}`
    // console.log("sssss", params);

    try {
      const response = await BindPatientDetails(params);
      if (response.success) {
        setFileData(response.data.grvAttachment);
      } else {
        console.error("API returned success as false or invalid response:", response);
        setFileData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setFileData([]);
    }
  };

  useEffect(() => {
    handleBindPatientDetails(val?.LedgerTransactionNo);
  }, []);

  const handleDocumentChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];

    if (!file) return;

    // Validate file type
    // if (!["image/jpeg", "image/png"].includes(file.type)) {
    //   notify("Only JPEG and PNG files are allowed.", "warning");
    //   return;
    // }
    if (file.type !== "application/pdf") {
      notify("Only PDF files are allowed.", "warning");
      return;
    }


    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      notify("File size exceeds 2MB.", "warning");
      return;
    }

    let reader = new FileReader();
    reader.onloadend = () => {
      setInputs((prev) => ({ ...prev, document: reader.result }));
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleAttachment = async () => {
    if (!inputs?.document) {
      notify("Please upload an image before submitting.", "error");
      return;
    }
    // debugger
    const payload = {
      id: "",
      ledgerTransactionNo: val?.LedgerTransactionNo,
      patientID: val?.PatientID,
      fileName: file?.name || "Doc",
      fileUrl: "",
      documentName: "",
      testID: "",
      attachedFile: "",
      entryDate: "",
      isOutsourced: "",
      flag: "",
      file: removeBase64Data(inputs.document),
    };

    try {
      const apiResp = await BindAttachmentLab(payload);
      if (apiResp.success) {
        notify("pdf uploaded successfully!", "success");
        setFile(null);
        setInputs((prev) => ({ ...prev, document: "" }));
        document.getElementById("document").value = "";

        await handleBindPatientDetails(val?.LedgerTransactionNo);
      } else {
        notify("Upload failed. Please try again.", "error");
      }
    } catch (error) {
      notify("An error occurred while uploading.", "error");
      console.error("Upload Error:", error);
    }
  };

  useEffect(() => {
    handleChangeModel(inputs);
  }, [inputs]);




  const viewImage = async (data, index) => {
    const payload = {
      id: data.Id,
      FileName: data.FileName,
      LedgerTransactionNo: val?.LedgerTransactionNo,
    }
    const resp = await BindPatientDetailsImage(payload)
    // console.log("button is working", resp);
    // if (resp.success && resp.data) {
    //   const base64Image = resp.data.url; // No prefix
    //   const imageMimeType = "image/png"; // or "image/jpeg"
    //   const imageSrc = `data:${imageMimeType};base64,${base64Image}`;

    //   const newTab = window.open();
    //   if (newTab) {
    //     newTab.document.write(`<img src="${imageSrc}" alt="Image"/>`);
    //     newTab.document.close();
    //     notify("success", "Image opened successfully");
    //   } else {
    //     notify("error", "Popup blocked");
    //   }
    // } else {
    //   notify(resp?.message || "Failed to load image", "error");
    // }


    if (resp.success && resp.data) {
      const base64Data = resp.data?.url;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, "_blank");
      notify("success", "PDF opened successfully");

    } else {
      notify(response?.message || "Failed to load PDF", "error");
    }

  }

  const thead = [t("View File"), t("File Name"), t("Uploaded By"), t("Date")];

  return (
    <>
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
        <div className="col-xl-4 col-md-4 col-sm-4 col-12">
          <LabeledInput label={t("BarCode")} value={values?.BarcodeNo || ""} readOnly />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-4 col-12">
          <LabeledInput label={t("Patient Name")} value={values?.PatientName || ""} readOnly />
        </div>
        <div className="col-xl-4 col-md-4 col-sm-4 col-12">
          <LabeledInput label={t("UHID")} value={values?.UHID || ""} readOnly />
        </div>
      </div>
      {!fileData?.length > 0 && (
        <>
          <div className="row">
            <input
              type="file"
              name="document"
              id="document"
              style={{ marginLeft: 10 }}
              onChange={handleDocumentChange}
              // accept="image/jpeg, image/png"
              accept="application/pdf"
            />
          </div>

          <div className="ftr_btn mb-4">
            <SaveButton btnName={"Upload"} onClick={handleAttachment} />
          </div>
        </>)}
      <Tables
        thead={thead}
        tbody={fileData?.map((val, index) => ({
          viewBtn: <i onClick={() => viewImage(val, index)} className="fa fa-search" aria-hidden="true"></i>,
          fileName: val.FileName,
          UploadedBy: val?.UploadedBy,
          Updatedate: val?.Updatedate,
        }))}
        tableHeight={"scrollView"}
      />
    </>
  );
}
