import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { apiUrls } from "../apiEndpoints";

// const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
const dynamicUrl = import.meta.env.VITE_APP_REACT_APP_DYNAMIC_URL === "true";
const baseFromEnv = import.meta.env.VITE_APP_REACT_APP_BASE_URL;

const baseUrl = dynamicUrl
  ? `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }/api/v1`
  : baseFromEnv;
const baseurl = baseUrl;
console.log(baseurl);

export const OpenPDFURL = (name, ...args) => {
  const urls = {
    // NursingWard
    NursingWardDeceasedPrint: (TID) =>
      `${apiUrls?.NursingWardDeceasedPrint}?TID=${TID}`,

    OPDSericeReceipt: (LedgerTransactionNo, Type) =>
      `${apiUrls?.CommonReciept_PDFCommonReceiptPdf}?LedgerTransactionNo=${LedgerTransactionNo}&Type=${Type}`,
    PrintIssueReport: (IndentNo, salesno, printall) =>
      `${apiUrls?.PrintIssue}?IndentNo=${IndentNo}&salesno=${salesno}&printall=${printall}`,

    OPDAdvanceReceipt: (LedgerTransactionNo, ReceiptNo, Type) =>
      `${apiUrls?.CommonReciept_PDFCommonReceiptPdf}?LedgerTransactionNo=${LedgerTransactionNo}&IsBill=0&ReceiptNo=${ReceiptNo}&Type=${Type}`,

    PrintVitalSignChart: (TID) => `${apiUrls?.PrintVitalSignChart}?TID=${TID}`,
    NursingProgressPrintOut: (TID, isEmergency) =>
      `${apiUrls?.PrintNurNote}?TransactionID=${TID}&isEmergency=${isEmergency}`,
    NursingWardPrintNurNote: (TransactionID, isEmergency) =>
      `${apiUrls?.NursingWardPrintNurNote}?TransactionID=${TransactionID}&isEmergency=${isEmergency}`,

    NursingWardDischargeCheckListPrint: (TID) =>
      `${apiUrls?.NursingWardDischargeCheckListPrint}?TID=${TID}`,

    NursingWardDiabeticChartPrint: (tid, pid, emgNo) =>
      `${apiUrls?.NursingWardDiabeticChartPrint}?tid=${tid}&pid=${pid}&emgNo=${emgNo}`,

    NursingWardIntakeOutPutChartPrint: (TID, Date) =>
      `${apiUrls?.NursingWardIntakeOutPutChartPrint}?TID=${TID}&Date=${Date}`,
    NursingWardAdultFallRiskPrint: (TID, FromDate, ToDate) =>
      `${apiUrls?.NursingWardAdultFallRiskPrint}?TID=${TID}&FromDate=${FromDate}&ToDate=${ToDate}`,
    NursingWardNeedleInjuryPrint: (TID, Date) =>
      `${apiUrls?.NursingWardNeedleInjuryPrint}?TID=${TID}&Date=${Date}`,
    NursingWardBabyChartPrint: (TID) =>
      `${apiUrls?.NursingWardBabyChartPrint}?TID=${TID}`,
    // print card
    PrintStickerPrintOut: (patId) => `${apiUrls?.PrintSticker}?patId=${patId}`,
    ViewReqEmgPrint: (transactionID) =>
      `${apiUrls?.ViewReqEmgPrintURL}?transactionID=${transactionID}`,
    PrintRequisition: (IndentNo, Status,ReportType) =>
      `${apiUrls?.PrintRequisition}?IndentNo=${IndentNo}&Status=${Status}&ReportType=${ReportType}`,
    PrintCardPrintOut: (pid,LedgerTransactionNo=125) =>
      `${apiUrls?.PrintCard}?pid=${pid}&LedgerTransactionNo=${LedgerTransactionNo}`,

    CommonReceiptPdf: (detail) =>
      `${apiUrls?.CommonReciept_PDFCommonReceiptPdf}?ReceiptNo=${detail?.ReceiptNo}&LedgerTransactionNo=${detail?.LedgerTransactionNo}&IsBill=${detail?.PrintType === "1" ? 1 : 0}&Duplicate=${detail?.IsAllowedOriginalPrintValue ? 0 : 1}&Type=OPD`,

    IPDCommonReceiptPdf: (detail) =>
      `${apiUrls?.CommonReciept_PDFCommonReceiptPdf}?ReceiptNo=${detail?.ReceiptNo}&Duplicate=${detail?.IsAllowedOriginalPrintValue ? 0 : 1}&Type=IPD`,

    PEWSChartPrintOut: (fromDate, toDate, TID) =>
      `${apiUrls?.PhysiologicalEWSPrint}?FromDate=${fromDate}&ToDate=${toDate}&TID=${TID}`,

    GasChartPrintOut: (TID) => `${apiUrls?.BloodGasChartPrint}?TID=${TID}`,

    DoctorPrescriptionPrint: (details) =>
      `${apiUrls?.DoctorPrescriptionPrint}?pid=${details?.PatientID}&TransactionID=${details?.TransactionID}&AppID=${details?.App_ID}`,

    ReportsRegistrationDetail: (details) =>
      `${apiUrls?.ReportsRegistrationDetail}?FromDate=${details?.fromDate}&ToDate=${details?.toDate}&CentreID=${details?.centre}&CountryId=${details?.country}&StateId=${details?.state}&DistrictId=${details?.district}&CityId=${details?.city}&Village=${'""'}`,

    OPDAdvanceOutStandingReport: (details) =>
      `${apiUrls?.OPDAdvanceOutStandingReport}?FromDate=${details?.fromDate}&ToDate=${details?.toDate}&CentreId=${details?.centre}&PaymentModeType=${details?.paymentType}&AdvanceOutStan=${details?.type}&MrNo=${details?.UHID ? details?.UHID : '""'}`,

    RefundReport: (details) =>
      `${apiUrls?.RefundReport}?FromDate=${details?.fromDate}&ToDate=${details?.toDate}&CentreId=${details?.centre}&ReportType=${details?.reportType}`,

    DoctorRealtedOpdReportsRefundReport: (reportParams) =>
      `${apiUrls?.DoctorRealtedOpdReportsRefundReport}?${reportParams}`,
    // OPDBillRegisterReports: (details) =>
    //   `${apiUrls?.OPDBillRegisterReports}?FromDate=${details?.fromDate}&ToDate=${details?.toDate}&CentreId=${details?.centre}&PanelID=${details?.panel}&Type=${details?.type}&groupwise=${details?.groupBy}&BillNo=${details?.billNo}&UHID=${details?.UHID}`,

    PatientHistoryDetails: (details) =>
      `${apiUrls?.PatientHistoryDetails}?FromDate=${details?.fromDate ? details?.fromDate : '""'}&ToDate=${details?.toDate}&UHID=${details?.UHID}`,
    CommonReceiptPdf: (details) =>
      `${apiUrls?.CommonReceiptPdf}?ledgerTransactionNo=${details?.ledgerTransactionNo ? details?.ledgerTransactionNo : '""'}&isBill=${details?.isBill}&receiptNo=${details?.receiptNo ? details?.receiptNo : ""}&duplicate=${details?.duplicate ? details?.duplicate : ""}&type=${details?.type ? details?.type : ""}&supplierID=${details?.supplierID ? details?.supplierID : ""}&billNo=${details?.billNo ? details?.billNo : ""}&isEMGBilling=${details?.isEMGBilling ? details?.isEMGBilling : ""}&isOnlinePrint=${details?.isOnlinePrint ? details?.isOnlinePrint : ""}&isRefound=${details?.isRefound ? details?.isRefound : ""}`,
  };

  GeneratePDFURL(urls[name](...args));
};

export const GeneratePDFURL = (url) => {
  const validUser = useLocalStorage("userData", "get");
  const parameterChecker = () => {
    const symbol = url.includes("?") ? "&" : "?";
    return symbol;
  };
  const finalUrl = validUser
    ? `${url}${parameterChecker()}userValidateID=${validUser?.userValidateID}`
    : url;

  RedirectURL(finalUrl);
  console.log(finalUrl, "finalUrl");
};

export const RedirectURL = (url) => {
  window.open(`${baseurl}/${url}`, "_blank");
  window.focus();
};
export const RedirectEXLURL = (response) => {
  const url = window.URL.createObjectURL(new Blob([response]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Report.xlsx`);
  document.body.appendChild(link);
  link.click();
};

export const RedirectURLReport = (base64, type) => {
  let base64String = base64.startsWith(type) ? base64.split(",")[1] : base64;
  // Handle padding
  const padding = base64String.length % 4;
  if (padding === 2) {
    base64String += "==";
  } else if (padding === 3) {
    base64String += "=";
  }
  // Convert Base64 to a binary string
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Create a Blob from the bytes
  const blob = new Blob([bytes], { type: "application/pdf" });
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  // Open the PDF in a new tab
  window.open(url);
};
