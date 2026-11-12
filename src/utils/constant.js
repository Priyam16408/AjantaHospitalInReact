import moment from "moment";
import { Line, Bar, Pie, Doughnut, Bubble, PolarArea } from "react-chartjs-2";
import { generateColors } from "./utils";
import ConcetForm from "../pages/doctor/OPD/ConcetForm";
import ViewLabReport from "../pages/doctor/OPD/ViewLabReport";
import VitalSign from "../pages/doctor/OPD/VitalSign";
import i18next from "i18next";
import { register } from "../serviceWorker";


export const PATIENT_DETAILS = {
  ADMISSIONTYPE: "",
  roomType: "",
  BillingCategory: "",
  RoomBed: "",
};

export const AGE_TYPE = [
  {
    label: "YRS",
    value: "YRS",
  },
  {
    label: "MONTH(S)",
    value: "MONTH(S)",
  },
  {
    label: "DAYS(S)",
    value: "DAYS(S)",
  },
];

export const BIND_TABLE_OLDPATIENTSEARCH = [
  {
    field: "MRNo",
    title: "UHID",
  },
  {
    field: "PatientName",
    title: "Patient Name",
  },
  {
    field: "ContactNo",
    title: "Contact No.",
  },
  {
    field: "AgeGender",
    title: "Age/Gender",
  },
  // {
  //   field: "",
  //   title: "Gender",
  // },
  // {
  //   field: "DATE",
  //   title: "Date",
  // },
  {
    field: "House_No",
    title: "Address",
  },
];
export const BIND_TABLE_CHEMOPATIENTSEARCH = [
  {
    field: "PatientID",
    title: "UHID",
  },
  {
    field: "PatientName",
    title: "Patient Name",
  },
  {
    field: "MobileNo",
    title: "Contact No.",
  },
  {
    field: "Age",
    title: "Age",
  },
  // {
  //   field: "",
  //   title: "Gender",
  // },
  // {
  //   field: "DATE",
  //   title: "Date",
  // },
  // {
  //   field: "House_No",
  //   title: "Address",
  // },
];
export const BIND_TABLE_OLDPATIENTSEARCH_REG = [
  {
    field: "MRNo",
    title: "UHID",
  },
  {
    field: "PatientName",
    title: "Patient Name",
  },
  {
    field: "ContactNo",
    title: "Contact No.",
  },
  {
    field: "AgeGender",
    title: "Age/Gender",
  },
  // {
  //   field: "",
  //   title: "Gender",
  // },
  // {
  //   field: "DATE",
  //   title: "Date",
  // },
  {
    field: "House_No",
    title: "Address",
  },
  // {
  //   field: "Title",
  //   title: "Title",
  // },
  // {
  //   field: "PFirstName",
  //   title: "First Name",
  // },
  // {
  //   field: "PLastName",
  //   title: "Last Name",
  // },
  // {
  //   field: "MRNo",
  //   title: "UHID",
  // },
  // {
  //   field: "Age",
  //   title: "Age",
  // },
  // {
  //   field: "Gender",
  //   title: "Gender",
  // },
  // {
  //   field: "DATE",
  //   title: "Date",
  // },
  // {
  //   field: "Address",
  //   title: "Address",
  // },
  // {
  //   field: "ContactNo",
  //   title: "Contact No.",
  // },
];
export const BIND_TABLE_OLDPATIENTSEARCH_PHARMECY = [
  {
    field: "PatientID",
    title: "UHID",
  },
  {
    field: "IPDNo",
    title: "IPD No",
  },
  {
    field: "EmergencyNo",
    title: "Emergency No",
  },
  {
    field: "PatientName",
    title: "Patient Name",
  },
  {
    field: "ContactNo",
    title: "Contact No.",
  },
];
export const BIND_TABLE_DEPARTMENT = [
  {
    field: "UnitType",
    title: "Unit Type",
  },
  {
    field: "ItemName",
    title: "Item Name",
  },
  {
    field: "AvlQty",
    title: "Avl Qty",
  },
];
export const BIND_TABLE_OLDPATIENTSEARCH_PHARMECY_RETURN = [
  {
    field: "PatientID",
    title: "UHID",
  },
  {
    field: "IPDNo",
    title: "IPD No",
  },
  {
    field: "EmergencyNo",
    title: "Emergency No",
  },
  {
    field: "PatientName",
    title: "Patient Name",
  },
  {
    field: "ContactNo",
    title: "Contact No.",
  },
];

export const OPDServiceTableData = [
  {
    "S.no": 1,
    Type: "123",
    code: "Asdas",
    value: 0,
    "Item Name": 0,
    Doctor: 1,
    Remarks: 1,
    Rate: 100,
    Qty: 1,
    "Dis(%)": 2,
    "Dis. Amt.": 2,
    Amount: 3,
    u: 3,
    Action: 1,
  },
];

export const THEAD = [
  "Slot",
  "Type",
  "Code",
  " ",
  "Subcategory",
  "Item Name",
  "Last Token",
  "Doctor",
  "Tax Type",
  "Tax (%)",
  "Rate",
  "Qty",
  "Dis(%)",
  "Dis. Amt.",
  "Amount",
  "Tax Amount",
  "Pat.Payable",
  "u",
  "Action",
];

export const ROUNDOFF_VALUE = 2;

export const OBJECT_PAYMENTMODE = {
  Amount: "",
  BaseCurrency: "",
  BankName: "",
  C_Factor: "",
  PaymentMode: "",
  PaymentModeID: "",
  PaymentRemarks: "",
  RefNo: "",
  S_Amount: "",
  S_CountryID: "",
  S_Currency: "",
  S_Notation: "",
  swipeMachine: "",
  patientAdvance: 0,
};

export const PAYMENT_OBJECT = {
  panelID: 1,
  billAmount: 0.0,
  discountAmount: 0.0,
  isReceipt: true,
  patientAdvanceAmount: 0.0,
  autoPaymentMode: 0,
  minimumPayableAmount: null,
  panelAdvanceAmount: 0.0,
  disableDiscount: false,
  refund: false,
  constantMinimumPayableAmount: null,
  coPayPercent: 0.0,
  coPayAmount: 0.0,
  discountReason: "",
  discountApproveBy: "",
};

export const SEARCH_BY_TEST = [
  {
    label: "Name",
    value: 1,
  },
  {
    label: "Code",
    value: 2,
  },
];

export const CostEstimateBillPayload = {
  DepartmentID: "ALL",
  DoctorID: "",
  PanelID: "",
  roomType: "",
  packageID: "",
  surgeryID: "",
  icdCode: "",
  roomType: "",
  limit: "",
  fromDate: moment().format("YYYY-MMM-DD"),
  toDate: moment().format("YYYY-MMM-DD"),
  dateProcedure: moment().format("YYYY-MMM-DD"),
  lengthOfStay: "",
  diagnosis: "",
};

export const Type_list = [
  {
    label: "Refund",
    value: 2,
  },
  {
    label: "Advance",
    value: 1,
  },
];
// Expense Voucher

export const SAVE_EXPENSE = {
  amountPaid: "",
  amtCash: "",
  expenceTypeId: "",
  expenceType: "",
  expenceToId: "",
  expenceTo: "",
  roleID: "",
  employeeID: "",
  naration: "",
  approvedBy: "",
  receivedAgainstReceiptNo: "",
  employeeName: "",
  employeeType: "",
  paymentType: 1,
};

export const OPD_SETTLEMENT_DETAILS = {
  mrNo: "",
  billNo: "",
  centreId: {},
  panelID: {},
  fromDate: moment().format("DD-MMM-YYYY"),
  toDate: moment().format("DD-MMM-YYYY"),
};

export const number = (e, sliceValue, valueGreater) => {
  if (handleCheckDot(e)) {
    return (e.target.value = e.target.value.replace(".", ""));
  } else {
    if (valueGreater) {
      return e.target.value > valueGreater
        ? (e.target.value = e.target.value.slice(0, e.target.value.length - 1))
        : (e.target.value = e.target.value.slice(0, sliceValue));
    } else {
      return (e.target.value = e.target.value.slice(0, sliceValue));
    }
  }
};

const handleCheckDot = (e) => {
  const data = [...e.target.value];
  return data.includes(".");
};

export const DIRECT_PATIENT_SEARCH_TYPE = {
  Barcode: 1,
  Mobile: 2,
  PFirstName: 3,
};

export const OPDCONFIRMATIONSTATE = {
  doctorID: "",
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  appointmentNo: "",
  isConform: "",
  visitType: "",
  status: "",
  doctorDepartmentID: "",
  pname: "",
};

const rblCon = "1";

export const RECEIPT_REPRINT_PAYLOAD = {
  fromDate: moment().format("DD-MMM-YYYY"),
  toDate: moment().format("DD-MMM-YYYY"),
  receiptNo: "",
  billNo: "",
  patientName: "",
  patientID: "",
  rblCon: "1",
  PrintType: rblCon === "1" ? "1" : rblCon === "0" ? "0" : "1",
};
export const PACKAGE_STATUS_PAYLOAD = {
  fromDate: moment().format("DD-MMM-YYYY"),
  toDate: moment().format("DD-MMM-YYYY"),
  registerNo: "",
  // panel: "",
  // patientName: "",
  packageStatus: "1",
  // patientID: "",
  Statustype: "1",
  PrintType: rblCon === "1" ? "1" : rblCon === "0" ? "0" : "1",
};

export const RADIOLOGYCONFIRMATIONSTATE = {
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  uhid: "",
  pName: "",
  mobile: "",
  subCategoryID: "",
  labNo: "",
  tokenNo: "",
  isConform: "",
  status: "",
};

// creditDebitNote
export const DebitCreditNote_payload = {
  patientID: "",
  transactionID: "",
  patientName: "",
  billNo: "",
  transNo: "",
  crdrNoteType: "",
  panelID: {
    label: "",
    value: "",
  },
  CreditAmt: "",
  Narration: "",
  Amount: "",
};

// end

// Token Management

export const Save_Modality = {
  subcategoryid: "0",
  modalityName: "",
  floor: "",
  floorid: "",
  roomno: "",
  modalityID: "",
  active: "",
  btnvalue: "Save",
  centreID: 1,
};

// Token Management / Reciept Token Master

export const Reciept_Token_Master = {
  centre: "",
  category: "",
  resetTime: "",
  groupName: "",
  tokenPrefix: "",
  mainCategoryName: "",
  subcatid: "",
};

export const MOBILE_NUMBER_VALIDATION_REGX = /^\d{0,10}$/;
export const NUMBER_VALIDATION_REGX = /^\d+$/;
// export const AMOUNT_REGX=new RegExp(`^\\d{0,6}(\\.\\d{0,${decimalPlaces}})?$`);

export const AMOUNT_REGX = (validDigit) => {
  const patern = new RegExp(
    `^\\d{0,${validDigit}}(\\.\\d{0,${ROUNDOFF_VALUE}})?$`
  );
  return patern;
};
export const VARCHAR_REGX = (validDigit) => {
  const patern = new RegExp(`^[a-zA-Z0-9]{0,${validDigit}}$`);
  return patern;
};

export const SEARCHBY = [
  {
    label: "Bill",
    value: "1",
  },
  {
    label: "Receipt",
    value: "0",
  },
];
// -----------------------------------------------------mee--------------------
export const PackageStatus = [
  {
    label: "Open",
    value: "1",
  },
  {
    label: "Close",
    value: "0",
  },
];
export const statusType = [
  {
    label: "OPD-Package",
    value: "1",
  },
  {
    label: "Other",
    value: "0",
  },
];

export const BillPRINTTYPE = [
  {
    label: "Bill",
    value: "1",
  },
  {
    label: "OPD Card",
    value: "2",
  },
  // {
  //   label: "New file registration",
  //   value: "3",
  // },
  // {
  //   label: "Revisit",
  //   value: "4",
  // },


  // {
  //   label: "New file small sticker",
  //   value: "5",
  // },
  {
    label: "New file plastic sticker",
    value: "6",
  },
  {
    label: "New file sticker",
    value: "7",
  },

];


export const ReceiptPRINTTYPE = [
  {
    label: "Receipt",
    value: "1",
  },
  {
    label: "OPD Card",
    value: "2",
  },
];

export const TYPECREDITDEBITLIST = [
  {
    label: "Credit Note on Rate",
    value: 1,
  },
  {
    label: "Credit Note on Discount",
    value: 2,
  },
  {
    label: "Debit Note on Rate",
    value: 3,
  },
  {
    label: "Debit Note on Discount",
    value: 4,
  },
];

export const DOCTOR_TIMING_COLOR = {
  0: "#B6C7AA", //expired
  1: "#B0EBB4", //available,
  3: "#A6D0DD", //seen
  4: "#E9EDC9", //waiting
  5: "#FFD1DA", //Triage
  6: "#98EECC", //confirm
  10: "#E9FF97", //total
  8: "#FFA38F", //notaAvailable
  9: "#F9F7C9", // booked
  7: "#F3D7CA", // unconfirmed
  11: "#C4D7B2", // recheduled
};

// export const DOCTOR_TIMING_COLOR_TEXT_COLOR = {
//   0: "#ffffff", //expired
//   1: "#07812b", //available,
//   3: "blue", //seen
//   4: "#d377c4", //waiting
//   5: "purple", //Triage
//   6: "#11c8df", //confirm
//   7: "#da7f17", //total
//   8: "red", //notaAvailable
//   9: "#96a708", // booked
//   10: "#df667b", // unconfirmed
//   11: "#953403", // recheduled
// };

export const ViewConsultationPayload = {
  mrNo: "",
  pName: "",
  appNo: "",
  doctorID: { label: "All", value: "0" },
  status: "0",
  fromDate: moment().format("DD-MMM-YYYY"),
  toDate: moment().format("DD-MMM-YYYY"),
  docDepartment: { label: "All", value: "0" },
  appStatus: "0",
};

export const VIEWSTATUS = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Closed" },
  { value: "2", label: "All" },
];

// Reports

export const Revenue_Analysis_Report = {
  fromDate: moment().format("YYYY-MM-DD"),
  toDate: moment().format("YYYY-MM-DD"),
  patientTypr: "",
  reportSubType: "",
  panel: "",
  doctor: "",
  subCategory: "",
  category: "",
  item: "",
  department: "",
  RoomType: "",
  reportType: 0,
  centre: 0,
  printType: "",
  dateFilterType: "",
};

export const print_Type = [
  {
    name: "PDF",
    ID: "0",
  },
  // {
  //   name: "Excel",
  //   ID: "1",
  // },
  // {
  //   name: "Word",
  //   ID: "2",
  // },
];

export const print_Type_ReferDoctor = [
  {
    name: "PDF",
    ID: "0",
  },
  {
    name: "Excel",
    ID: "1",
  },
  // {
  //   name: "Word",
  //   ID: "2",
  // },
];



export const PRESCRIBED_MEDICINE = {
  Name: {},
  Dose: {},
  Time: {},
  Duration: {},
  Meal: {},
  Route: {},
  Remarks: {},
  AllItemListData: {},
};

// export const PRESCRIBED_MEDICINE = {
//   Name: "",
//   Dose: "",
//   Time: "",
//   Duration: "",
//   Meal: "",
//   Route: "",
//   Remarks: "",
//   AllItemListData: {},
// };

export const IPDHelpDeskPayload = {
  fdSearch: moment().format("DD-MMM-YYYY"),
  tdSearch: moment().format("DD-MMM-YYYY"),
  type: "",
  city: "",
  patientID: "",
  pName: "",
  contactNo: "",
  centre: "",
};

export const IPDTYPE = [
  { value: "Currently Admitted", label: "Currently Admitted" },
  { value: "Admitted", label: "Admitted" },
  { value: "Discharged", label: "Discharged" },
];
export const INVESTIGATION_VIEW = [
  { value: "ALL", label: "ALL" },
  { value: "LAB", label: "Laboratory" },
  { value: "RAD", label: "Radiology" },
];

// export const PackageDetailOPDPayload = {
//   PackageID: "",
// };

export const Reason_list = {
  Reason: "",
  Type: "0",
  amount: null,
};

// Dashboard
export const buttonsGroup = [
  {
    id: 1, //card data
    btnName: "User", //tab name
    ID: ["9", "10", "11"], //graph data
  },
  {
    id: 2,
    btnName: "Patient",
    ID: ["12", "13", "14", "15", "16"],
  },
  {
    id: 3,
    btnName: "Doctor",
    ID: ["18", "19", "20", "21", "22", "23"],
  },
  {
    id: 4,
    btnName: "Pharmacy",
    ID: ["24", "25", "26", "27", "28", "29", "30", "31"],
  },
  {
    id: 5,
    btnName: "Purchase",
    ID: ["32", "33", "34", "35", "36", "37"],
  },
  {
    id: 6,
    btnName: "Laboratory",
    ID: ["38", "39", "40", "41", "42", "43"],
  },
  {
    id: 7,
    btnName: "Radiology",
    ID: ["44", "45", "46", "47", "48", "49"],
  },
  {
    id: 8,
    btnName: "Nursing",
    ID: ["12", "13", "16"],
  },
  {
    id: 9,
    btnName: "Business",
    ID: ["51", "52", "53", "54", "55", "56", "57", "58"],
  },
];

export const dynamicOptions = (name) => {
  switch (name) {
    case "Curve Line chart":
      return {
        scales: {
          x: {
            grid: {
              display: false, // Hide grid lines
            },
            ticks: {
              color: "rgba(0,0,0,0.6)", // X-axis tick color
            },
          },
          y: {
            grid: {
              color: "rgba(0,0,0,0.1)", // Y-axis grid color
            },
            ticks: {
              color: "rgba(0,0,0,0.6)", // Y-axis tick color
            },
          },
        },
      };

    case "Bar chart":
      return {
        scales: {
          x: {
            grid: {
              display: false, // Hide grid lines
            },
            ticks: {
              color: "rgba(0,0,0,0.6)", // X-axis tick color
            },
          },
          y: {
            grid: {
              color: "rgba(0,0,0,0.1)", // Y-axis grid color
            },
            ticks: {
              color: "rgba(0,0,0,0.6)", // Y-axis tick color
            },
          },
        },
      };

    case "Stacked Bar Chart":
      return {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };

    default:
      return {};
  }
};

// Dashboard
export const createGraphData = (data, labelField, valueField, name) => {
  const backgroundColor = generateColors(data?.length);
  const borderColor = backgroundColor.map((color) => color.replace("0.2", "1"));

  const labels = data?.map((item) => item[labelField]);
  let dataSets = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: 1, // Ensures no border is visible
    barPercentage: 0.8, // Adjust bar thickness
    categoryPercentage: 0.8, // Adjust space between bars
    data: data?.map((item) => item[valueField]),
  };

  switch (name) {
    case "Curve Line chart":
      dataSets = {
        ...dataSets,
        fill: true,
        tension: 0.4,
        borderRadius: 5,
        barThickness: 50,
        pointRadius: 0, // Hide the dots
      };
      break;
    case "Bar chart":
      dataSets = {
        ...dataSets,
        borderWidth: 1,
        barPercentage: 1, // Adjust bar width
        categoryPercentage: 0.5, // Adjust spacing between bars
        borderRadius: 5, // Rounded corners
      };
      break;
    case "Line chart":
      break;
    case "Pie chart":
      break;
    case "Polar Area chart":
      break;
    case "Stacked Bar Chart":
      break;
    default:
      break;
  }

  return {
    labels: labels,
    datasets: [dataSets],
  };
};

// export const RANDOM_CHART = () => {

//   const arr = [
//     "Bar chart",
//     "Line chart",
//     "Pie chart",
//     "Curve Line chart",
//     "Polar Area chart",
//   ];

//   const randomIndex = Math.floor(Math.random() * arr.length);

//   const randomValue = arr[randomIndex];

//   return randomValue;

// };

export const BUSSINESS_THEADS = {
  51: ["Type", "C.T(Amt)", "P.T(Amt)", "Analysis"],
  52: ["Type", "C.T(Amt)", "P.T(Amt)", "Analysis"],
  53: ["Type", "C.T(Amt)", "P.T(Amt)", "Analysis"],
  54: ["Type", "C.T(Amt)", "P.T(Amt)", "Analysis"],
  55: [
    "Department",
    "OPD(C.T)",
    "OPD(P.T)",
    "IPD(C.T)",
    "IPD(P.T)",
    "EMG(C.T)",
    "EMG(P.T)",
    "Analysis",
  ],
  56: [
    "Department",
    "OPD(C.T)",
    "OPD(P.T)",
    "IPD(C.T)",
    "IPD(P.T)",
    "EMG(C.T)",
    "EMG(P.T)",
    "Analysis",
  ],
  57: [
    "Doctor",
    "OPD(C.T)",
    "OPD(P.T)",
    "IPD(C.T)",
    "IPD(P.T)",
    "EMG(C.T)",
    "EMG(P.T)",
    "Analysis",
  ],
  58: [
    "Panel",
    "OPD(C.T)",
    "OPD(P.T)",
    "IPD(C.T)",
    "IPD(P.T)",
    "EMG(C.T)",
    "EMG(P.T)",
    "Analysis",
  ],
};

export const RANDOM_CHART = () => {
  const arr = [
    "Bar chart",
    "Line chart",
    "Pie chart",
    "Curve Line chart",
    "Polar Area chart",
    "Stacked Bar Chart",
  ];
  const randomIndex = Math.floor(Math.random() * arr.length);
  const randomValue = arr[randomIndex];
  return randomValue;
};

export const isChecked = (name, state, value, id) => {
  if (id) {
    const data = state?.map((ele) => {
      if (ele?.TestID === id) {
        return ele[name] === value ? true : false;
      } else {
        return ele;
      }
    });
    return data;
  } else {
    const data = state?.map((ele) => {
      return ele[name] == value ? true : false;
    });
    return data;
  }
};

export const doctorOption = [
  {
    name: "Priyam ",
    code: "1",
  },
  {
    name: "Hema",
    code: "1",
  },
  {
    name: "Prity",
    code: "1",
  },
  {
    name: "Sneha",
    code: "1",
  },
  {
    name: "Neha",
    code: "1",
  },
  {
    name: "Soniya",
    code: "1",
  },
];

// export const AUTOCOMPLETE_STATE = {
//   "Chief Complaint": [],
//   "Past History": [],
//   "Treatment History": [],
//   Allergies: [],
//   "Personal/Occupational History": [],
//   "General Examination": [],
//   "Systematic Examination": [],
//   "Provisional Diagnosis": [],
//   "Doctor Advice": [],
//   "Investigation(Lab & Radio)": [],
//   "Prescribed Medicine": [PRESCRIBED_MEDICINE],
//   Diet: [],
//   "Doctor Notes": [],
//   "Prescribed Procedure": [],
//   "Sign & Symptoms": [],
//   "Vaccination Status": [],
//   "Molecular Allergies": [],
// };
export const AUTOCOMPLETE_STATE = {
  "Allergies": [],
  "paExaminantion": [],
  "pvExaminantion": [],
  "Prescribed Medicine": [[PRESCRIBED_MEDICINE]],
  "Known OFF": [],
  "Chief Complaint": [],
  "Menstrual And Obstetrics History": [],
  "Vaccination Status": [],
  "Doctor Advice": [],
  "Investigation(Lab & Radio)": [],
  "Provisional Diagnosis": [],
  "Prescribed Procedure": [],
  "Deatils Of Previous Pregnancies": [],
  "Transfer/Referral For Consultation": [],
  "Personal/Occupational History": [],
  "General Examination": [],
  "Next Visit(with calender)": [],
  "Risk Factor": [],
  "Any Anc Hospitalisations": [],
  "Confidential Data": [],
  "Diet": [],
  "Past History": [],
  "Molecular Allergies": [],
  "Treatment History": [],
  "Family History": [],
  "NST": [],
  "Pelvic Assessment": [],
  "Sign & Symptoms": [],
  "Parturition Details & OutCome": [],
  "Previous Doctor": [],
  "Key Note": [],
  "Doctor Notes": [],
  "Systematic Examination": []
};

export const IPDAdmissionNewPayload = {
  ADMISSIONTYPE: "",
  roomType: "",
  BillingCategory: "",
  RoomBed: "",
  doctor: [],
  admissionDate: moment().format("YYYY-MM-DD"),
  AdmissionTime: "",
  AdmissionReason: "",
  CardQty: "",
};
export const PatientSearchPayload = {
  mrNo: "",
  pName: "",
  panelID: { label: "ALL", value: "0" },
  department: { label: "ALL", value: "ALL" },
  doctorID: { label: "All", value: "0" },
  floor: [],
  IPDCaseTypeID: [],
  ageFrom: "",
  ageTo: "",
  ddlAgeFrom: { value: "YRS", label: "YRS" },
  ddlAgeTo: { value: "YRS", label: "YRS" },
  ipdNo: "",
  OnlyPanelPatient: "",
  parentPanel: "",
  fromDate: new Date(),
  toDate: new Date(),
  id: 0,
  admitDischarge: { value: "CAD", label: "Currently Admitted" },
};

export const ReferedSourceConst = [
  { value: "OPD", label: "OPD" },
  { value: "Emergency", label: "Emergency" },
  { value: "OutSide", label: "OutSide" },
];
export const FromAgesTOAges = [
  { value: "YRS", label: "YRS" },
  { value: "MONTH(S)", label: "MONTH(S)" },
  { value: "DAYS(S)", label: "DAYS(S)" },
];

export const IPDPatientAdmisiion = [
  { value: "CAD", label: "Currently Admitted" },
  { value: "AD", label: "Admissions" },
  { value: "ID", label: "Intimation Discharge" },
  { value: "PC", label: "Pending Pharmacy Clearance" },
  { value: "DI", label: "Discharged" },
  { value: "BNF", label: "Bill Not Finalised" },
  { value: "BF", label: "Bill Finalised" },
];
export const PatientTypeID = [{ value: "1", label: "IPD" }];

export const typeStatus = [
  { value: 0, label: "All" },
  { value: "1", label: "Above Threshold Limit" },
  { value: "2", label: "Below Threshold Limit" },
  { value: "3", label: "Zero Advance" },
  { value: "5", label: "Patient Received" },
  { value: "6", label: "Patient Not Received" },
  { value: "7", label: "Credit Panel Limit Over" },
];
// export  const mockPageList = [
//   {
//     id: 1,
//     component: <VitalSign />,
//     name: "Vital sign",
//     size: "80vw",
//     header: "OPD Service Booking",
//   },
//   {
//     id: 2,
//     component: <ConcetForm />,
//     name: "Consent Form Master",
//     size: "80vw",
//     header: "Confirmation",
//   },
//   {
//     id: 3,
//     component: <ViewLabReport />,
//     name: "View Lab Reports",
//     size: "80vw",
//     header: "View Lab Reports",
//   },
//   {
//     id: 4,
//     component: <ViewLabReport />,
//     name: "Final Daignosis",
//     size: "80vw",
//     header: "Final Daignosis",
//   },
//   {
//     id: 5,
//     component: <ViewLabReport />,
//     name: "View Discharge Summary",
//     size: "80vw",
//     header: "View Discharge Summary",
//   },
// ];

// List of fonts
export const fonts = ["Roboto", "monospace", "sans-serif"];

// Register fonts
export const fontSizes = [
  "8px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
  "32px",
  "34px",
  "36px",
  "38px",
  "40px",
];

// Define modules for the toolbar
export const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["10px", "20px"] }], // Custom font sizes
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: fonts }], // Custom fonts
    [{ align: [] }],
    ["clean"], // remove formatting button
    [
      {
        imageResize: {
          displaySize: true,
        },
      },
    ],
  ],
};

// Define formats supported by the editor
export const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
  "formula",
  "header",
  "list",
  "script",
  "indent",
  "direction",
  "size",
  "color",
  "background",
  "font",
  "align",
  "clean",
];

export const DDLAge = [
  {
    label: "Less Than 60 years old (0 to 59)",
    value: "0",
  },
  {
    label: "80 or more years old",
    value: "1",
  },
  {
    label: "60-69 years old",
    value: "2",
  },
  {
    label: "70-79 years old (less likely age to request help)",
    value: "3",
  },
];

export const DDLMentalStatus = [
  {
    label: "Oriented at all times or comatose",
    value: "0",
  },
  {
    label: "Confusion at all times",
    value: "2",
  },
  {
    label: "Inability to understand and follow directions",
    value: "3",
  },
  {
    label: "Night Time disorientation/ intermittent confusion",
    value: "4",
  },
];

export const DDLLengthofStay = [
  {
    label: "Greater than 7 days",
    value: "0",
  },
  {
    label: "4-7 days",
    value: "1",
  },
  {
    label: "0-3 days",
    value: "2",
  },
];

export const DDlElimination = [
  {
    label: "Independent and continent",
    value: "0",
  },
  {
    label: "Catheter and / or ostomy",
    value: "1",
  },
  {
    label: "Elimination with assistance",
    value: "3",
  },
  {
    label: "Independent and incontinent",
    value: "5",
  },
];

export const DDLImpairment = [
  {
    label: "No impairments known",
    value: "0",
  },
  {
    label: "Mild visual or hearing impairment",
    value: "1",
  },
  {
    label: "Moderate visual or hearing impairment",
    value: "2",
  },
  {
    label: "Confined to bed / chair",
    value: "3",
  },
  {
    label: "Blind or Deaf",
    value: "4",
  },
];

export const DDLBloodPressure = [
  {
    label: "Blood pressure WNL",
    value: "0",
  },
  {
    label: "Systolic BP consistently Less than 90",
    value: "1",
  },
  {
    label: "BP of Greater than 20mm Hg with change of position",
    value: "2",
  },
];
export const RateOnOptions = [
  {
    label: "Surgery",
    value: "1",
  },
  {
    label: "Surgeon",
    value: "2",
  },
];
export const PanelApprovalType = [
  {
    label: "Additional",
    value: "A",
  },
  {
    label: "Cummulative",
    value: "C",
  },
];
export const AmountApprovalType = [
  {
    label: "Open Approval",
    value: "Open",
  },
  {
    label: "Fixed By Date Approval",
    value: "Fix",
  },
];
export const CalculateOption = [
  {
    label: "Amount",
    value: "1",
  },
  {
    label: "%age",
    value: "2",
  },
];
export const RateType = [
  {
    label: "Surgery Billing",
    value: "Surgery",
  },
  {
    label: "OT Booking",
    value: "OT",
  },
];

export const DISCHARGESUMMARY_TYPE = [
  {
    label: "New Medications",
    value: "2",
  },
  {
    label: "AllReady Prescribed",
    value: "4",
  },
];
export const DISCHARGEINTIMATION_OPTIONS = [
  {
    label: "Normal",
    value: "Normal",
  },
  {
    label: "LAMA",
    value: "LAMA",
  },
  {
    label: "Absconding",
    value: "Absconding",
  },
  {
    label: "Discharge On Request",
    value: "Discharge On Request",
  },
  {
    label: "Death",
    value: "Death",
  },
  {
    label: "Patient On Leave",
    value: "Patient On Leave",
  },
  {
    label: "Referred",
    value: "Referred",
  },
];
export const TYPE_OF_DEATH_OPTIONS = [
  {
    label: "Emergency Death",
    value: "1",
  },
];
export const BILLINGSTYPE_OPTION = [
  {
    label: "Open Bill",
    value: "1",
  },
  {
    label: "Package Bill",
    value: "2",
  },
  {
    label: "Mixed Bill",
    value: "3",
  },
];
export const AdvanceTypeOption = [
  {
    label: "IPD",
    value: "IPD",
  },
  {
    label: "CTB",
    value: "CTB",
  },
];
export const BillAccountOption = [
  {
    label: "ADVANCE-COL",
    value: "LSHHI11",
  },
  {
    label: "FINAL BILL SETTLEMENT",
    value: "LSHHI12",
  },
  {
    label: "IPD-REFUND",
    value: "LSHHI7018",
  },
];

export const Medical_Payload = {
  Type: "",
  ReqType: { label: "Service", value: "SE" },
};

// export const ReqTypeOptions = [
//   {
//     label: "Service",
//     value: "SE",
//   },
//   {
//     label: "Medicine Issue",
//     value: "MI",
//   },
//   {
//     label: "Medicine Return",
//     value: "MR",
//   },
// ];

export const ReqTypeOptions = [
  { value: "SE", label: "Service" },
  { value: "MI", label: "Medicine Issue" },
  { value: "MR", label: "Medicine Return" },
];

export const BIND_IPDPATIENTSEARCH = [
  {
    field: "PatientID",
    title: "UHID",
  },
  {
    field: "IPDNo",
    title: "IPD No",
  },
  {
    field: "pname",
    title: "Name",
  },
  {
    field: "company_name",
    title: "Panel",
  },
  {
    field: "roomno",
    title: "Room No.",
  },
];

export const BIND_FILE_STATUS = [
  { label: "All", value: "2" },
  {
    label: "Not Received",
    value: "0",
  },
  {
    label: "Received",
    value: "1",
  },
];

export const BIND_ITEM_DETAILS = [
  {
    field: "Department",
    title: "Department",
  },
  {
    field: "CTB Code",
    title: "CTB Code",
  },
  {
    field: "TypeName",
    title: "Surgery name",
  },
  {
    field: "ID",
    title: "Key",
  },
  {
    field: "type",
    title: "Booking",
  },
];

export const TypeOptions = [
  {
    label: "Service",
    value: "SE",
  },
  {
    label: "Medicine Issue",
    value: "MI",
  },
  {
    label: "Medicine Return",
    value: "MR",
  },
];
export const RequestTypeOptions = [
  {
    label: "Normal",
    value: "1",
  },
  {
    label: "Urgent",
    value: "2",
  },
  {
    label: "Immediate",
    value: "3",
  },
];
export const MEALOPTIONS = [
  {
    label: "After Meal",
    value: "After Meal",
  },
  {
    label: "Before Meal",
    value: "Before Meal",
  },
];
export const INDENTOPTIONS = [
  {
    label: "Prescribe Set",
    value: "Set",
  },
  {
    label: "Indent Medicine",
    value: "indent",
  },
];

export const ALLTABSAVE = {
  rate: 0,
  type: "",
  qty: 0,
  itemDiscPer: 0,
  ltdNo: "",
  ipAddress: "",
  cancelReason: "",
};

export const ChangeTypeOption = [
  {
    label: "On Change of Billing Category",
    value: "2",
  },
  {
    label: "On Change of Panel",
    value: "1",
  },
];

export const DOCTOR_REPORT_OPTION = [
  { value: "APPSTR", label: "☛ Appointment Status Report" },
  { value: "DAPPDRPT", label: "☛ Doctors App. Details Report" },
  { value: "DAPPSRPT", label: "☛ Doctors App. Summary Report" },
  { value: "BSSRPT", label: "☛ Doctors OPD Business Report" },
  { value: "DRFFR", label: "☛ Doctors Refferal Patient Report" },
  { value: "PROR", label: "☛ PRO Refferal Patient Report" },
  { value: "DCR", label: "☛ Doctor Consultation Report" },
];
export const DOCTOR_VISIT_TYPE_OPTION = [
  { value: "All", label: "All" },
  { value: "Old Patient", label: "Old Patient" },
  { value: "New Patient", label: "New Patient" },
];
export const DOCTOR_APP_STATUS = [
  { value: "All", label: "All" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "ReScheduled", label: "ReScheduled" },
  { value: "Canceled", label: "Canceled" },
  { value: "Pending", label: "Pending" },
  { value: "App Time Expired", label: "App Time Expired" },
];
export const DOCTOR_REPORT_APP_TYPE = [
  { value: "0", label: "App. Detail" },
  { value: "1", label: "Patient Type" },
];
export const DOCTOR_REPORT_TYPE = [
  { value: "0", label: "ALL" },
  { value: "1", label: "Review Patient" },
  { value: "2", label: "New Patient" },
];
export const DOCTOR_REPORT_AMOUNT_TYPE = [
  { value: "1", label: "Gross Amount" },
  { value: "2", label: "Net Amount" },
];
export const DOCTOR_REPORT_PATIENT_TYPE = [
  { value: "1", label: "OPD" },
  { value: "2", label: "IPD" },
  { value: "3", label: "BOTH" },
];
export const DOCTOR_REPORT_TYPE_FORMATE = [
  { value: "1", label: "PDF" },
  { value: "0", label: "Excel" },
];

export const MRDPatientSearch_Reports = {
  centre: [],
  reportType: "",
  type: "",
  fromDate: new Date(),
  toDate: new Date(),
  IPDNo: "",
  UHID: "",
  PatientName: "",
  RoomName: "",
  RackName: "",
  ShelfNo: "",
};

export const MRDPatientSearchDetails_Reports = {
  centre: [],
  reportType: "",
  type: "",
  fromDate: new Date(),
  toDate: new Date(),
  IPDNo: "",
  UHID: "",
  PatientName: "",
  RoomName: "",
  RackName: "",
  ShelfNo: "",
  patientType: "",
};

export const MRD_ANALYSIS_REPORTS = [
  { label: "Total Registration", value: 14 },
  { label: "Notifiable Disease", value: 1 },
  { label: "OPD Consultation", value: 2 },
  { label: "Type of Discharge", value: 3 },
  {
    label: "OPD-IPD Investigation",
    value: 4,
  },
  { label: "MLC-Cases", value: 5 },
  { label: "Death Case", value: 6 },
  {
    label: "Department Wise Admission-Discharge",
    value: 7,
  },
  { label: "Birth Statistic", value: 8 },
  { label: "Statistics", value: 9 },
  { label: "Major Minor Surgery", value: 10 },
  {
    label: "Major Surgery Dept Wise",
    value: 12,
  },
  {
    label: "Major Surgery Doctor Wise",
    value: 13,
  },
];

export const MRD_ALL_REPORTS = [
  { label: "Patient Master File", value: 1 },
  { label: "Emergency To IPD Patient Register", value: 2 },
  { label: "Currently IP Patient Register", value: 4 },
  { label: "HIV Lab Test Register", value: 6 },
  { label: "Lab Radiology Register", value: 7 },
  { label: "IPD Patient Register (Hourly)", value: 8 },
  { label: "New Emergency Patient Register", value: 12 },
  { label: "ChaperOn Services", value: 14 },
  { label: "Emergency Patient Register", value: 16 },
  { label: "OP Patient Register", value: 17 },
  { label: "IP Patient Register", value: 18 },
  { label: "IP Discharge Register", value: 19 },
  { label: "Dialysis Register", value: 20 },
  { label: "Physiotherapy Count Register", value: 21 },
  { label: "Current IP Surgery Register", value: 23 },
  { label: "Emergency Hourly Report", value: 25 },
  { label: "OP Patient Register (Hourly)", value: 26 },
];

export const REFUND_REPORT_TYPE = [
  { label: "All", value: "1" },
  { label: "OPD", value: "2" },
  { label: "IPD", value: "3" },
];

export const OPD_BILLREGISTER_GROUPBY = [
  { label: "Bill Wise", value: "B" },
  { label: "Category Wise", value: "C" },
  { label: "Sub Category Wise", value: "S" },
  { label: "Item Wise", value: "I" },
];

export const BedOccupancyReportType = [
  { label: "Summarised", value: "1" },
  { label: "Detailed", value: "2" },
  { label: "Administrative", value: "3" },
];
export const BedOccupancyType = [
  { label: "ALL", value: "ALL" },
  {
    label: "Specialization Wise,Room Type Wise",
    value: "Specialization,BedCategory",
  },
  {
    label: "Panel Group Wise,Panel Wise,Specialization Wise",
    value: "PanelGroup,Company_Name,Specialization",
  },
  {
    label: "Specialization Wise,Doctor Wise",
    value: "Specialization,ConsultantName",
  },
];
export const DISTCHARGETYPE = [
  { label: "Normal", value: "Normal" },
  { label: "Referal", value: "Referal" },
  { label: "Death", value: "Death" },
  {
    label: "Leave Against Medical Advice",
    value: "Leave Against Medical Advice",
  },
];

export const DDlRequisitionType = [
  {
    label: "Normal",
    value: "1",
  },
  {
    label: "Urgent",
    value: "2",
  },
  {
    label: "Immediate",
    value: "3",
  },
  {
    label: "Amended",
    value: "4",
  },
];
export const EMGVISITTYPE = [
  { label: "First Visit", value: "853" },
  { label: "Free Visit", value: "854" },
  { label: "Follow up Visit", value: "855" },
];
export const EMGMED_REQUISION_TYPE = [
  { label: "Item Wise", value: "0" },
  { label: "Generic Wise", value: "1" },
];
export const MEDICINE_SET_INDENT_TYPE = [
  { label: "Prescribe Set", value: "Set" },
  { label: "Indent Medicine", value: "indent" },
];

export const BIND_TABLE_BY_MED_FIRST_NAME = [
  {
    field: "ItemName",
    title: "ItemName",
  },
  {
    field: "HSNCode",
    title: "HSNCode",
  },
  {
    field: "AvlQty",
    title: "Avl. Qty.",
  },
];
export const BIND_TABLE_BY_MED_FIRST_NAME_PHARMECY = [
  {
    field: "ItemName",
    title: "ItemName",
    width: 200,
  },
  {
    field: "BatchNumber",
    title: "Batch No.",
    width: 100,
  },
  {
    field: "AvlQty",
    title: "Avl. Qty.",
    width: 80,
  },
  {
    field: "Expiry",
    title: "Expiry",
    width: 80,
  },
  {
    field: "MRP",
    title: "MRP",
    width: 80,
  },
  {
    field: "UnitPrice",
    title: "Unit Price",
    width: 80,
  },
  {
    field: "Rack",
    title: "Rack",
    width: 80,
  },
  {
    field: "Shelf",
    title: "Shelf",
    width: 80,
  },
  {
    field: "ManufactureName",
    title: "Manufacture Name",
    width: 80,
  },
  {
    field: "Generic",
    title: "Generic",
    width: 80,
  },
];

export const StoreTypeOptions = [
  {
    label: "Medical Item",
    value: "1",
  },
  {
    label: "General Item	",
    value: "2",
  },
];
export const ReportTypeOptions = [
  { label: "Summarised", value: "0" },
  { label: "Detailed", value: "1" },
];
export const ReportsTypeOptions = [
  { label: "Summarised", value: "S" },
  { label: "Detailed", value: "D" },
];
export const IssueTypeOptions = [
  { label: "ALL", value: "B" },
  { label: "Patient", value: "P" },
  { label: "Department", value: "D" },
  { label: "Out Supplier", value: "S" },
];
export const TransactionTypeOptions = [
  { label: "Both", value: "B" },
  { label: "Issue", value: "I" },
  { label: "Return", value: "R" },
];
export const PatientTypeOption = [
  { label: "All", value: "0" },
  { label: "OPD", value: "1" },
  { label: "IPD", value: "2" },
  { label: "EMG", value: "3" },
];
export const stockReportOptions = [
  { label: "Current Stock Report", value: "1" },
  { label: "Stock Status Report", value: "2" },
  { label: "Stock Bin Card", value: "3" },
  { label: "Stock Consume Detail", value: "4" },
  { label: "ABC Analysis", value: "5" },
  { label: "Adjustment Detail", value: "6" },
  { label: "Low Stock Detail", value: "7" },
  { label: "Item Moment Detail", value: "8" },
  { label: "Stock Ledger", value: "9" },
];

export const Report_Formate = [
  {
    label: "PDF",
    value: "PDF",
  },
  {
    label: "Excel",
    value: "Excel",
  },
];
export const IssueReturnTypeOptions = [
  {
    label: "Issue",
    value: "Pharmacy-Issue",
  },
  {
    label: "Return",
    value: "Pharmacy-Return",
  },
];
export const SearchtypeOptions = [
  {
    label: "ALL",
    value: "ALL",
  },
  {
    label: "OPD/EMG",
    value: "OPD",
  },
  {
    label: "WalkIn",
    value: "Walk",
  },
];
export const SearchSalesOption = [
  {
    label: "Bill",
    value: "1",
  },
  {
    label: "Receipt",
    value: "2",
  },
];
export const IssueReportTypeOption = [
  {
    label: "Item Wise",
    value: "1",
  },
  {
    label: "Detail",
    value: "2",
  },
];
export const NoOfPrintsOption = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
];
export const PrchaseTypeOption = [
  {
    label: "Purchase Price",
    value: "0",
  },
  {
    label: "MRP",
    value: "1",
  },
];

export const SENDONTYPE = [
  {
    label: "SMS",
    value: "0",
  },
  {
    label: "WhatsApp",
    value: "1",
  },
  {
    label: "Both",
    value: "3",
  },
];
export const DayOptions = [
  {
    label: "Day",
    value: "D",
  },
  {
    label: "Month",
    value: "M",
  },
  {
    label: "Year",
    value: "Y",
  },
];
export const Expiry_Status = [
  {
    label: "Expired",
    value: "P",
  },
  {
    label: "About to Expired",
    value: "F",
  },
];
export const type_ReportOption = [
  {
    label: "Non Moving Item",
    value: "N",
  },
  {
    label: "Slow Moving Item",
    value: "S",
  },
  {
    label: "Fast Moving Item",
    value: "F",
  },
];
export const Stock_TypeOption = [
  {
    label: "Adjustment(+)	",
    value: "A",
  },
  {
    label: "Process(-)",
    value: "P",
  },
];
export const consumeType_Option = [
  {
    label: "All",
    value: "0",
  },
  {
    label: "Consume",
    value: "C",
  },
  {
    label: "Gather",
    value: "G",
  },
];

export const Report_Formate_Pharmacy = [
  {
    label: "PDF",
    value: "2",
  },
  {
    label: "Excel",
    value: "1",
  },
];
export const StoreLedgerNumber = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Medical Store",
    value: "11",
  },
  {
    label: "General Store",
    value: "28",
  },
];
export const GenericStatusOptions = [
  {
    label: "Active",
    value: "1",
  },
  {
    label: "InActive",
    value: "0",
  },
];

export const GenericReport_Formate = [
  // {
  //   label: "PDF",
  //   value: "1",
  // },
  {
    label: "Excel",
    value: "2",
  },
];
export const GRN_purChase_option = [
  {
    label: "GRN Date",
    value: "G",
  },
  {
    label: "GRN Post Date",
    value: "P",
  },
  {
    label: "Invoice Date",
    value: "I",
  },
  {
    label: "Delivery Note Date",
    value: "C",
  },
];
export const ReferenceNo_option = [
  {
    label: "GRN No.",
    value: "G",
  },
  {
    label: "Invoice No.",
    value: "I",
  },
  {
    label: "Delivery Note Date",
    value: "C",
  },
  {
    label: "PO No.",
    value: "P",
  },
  {
    label: "Vendor Return No.",
    value: "V",
  },
];
export const itemType_option = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Posted",
    value: "P",
  },
  {
    label: "Rejected",
    value: "R",
  },
  {
    label: "Canceled",
    value: "C",
  },
];
export const Transaction_option = [
  {
    label: "Both",
    value: "B",
  },
  {
    label: "Purchase",
    value: "P",
  },
  {
    label: "Return",
    value: "R",
  },
];
export const requisitionTypeOption = [
  {
    label: "Patient Requisition",
    value: "PIndent",
  },
  {
    label: "Department Requisition",
    value: "DIndent",
  },
];
export const RequisitionStatusOption = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Partial",
    value: "Partial",
  },
  {
    label: "Open",
    value: "Open",
  },
  {
    label: "Reject",
    value: "Reject",
  },
  {
    label: "Close",
    value: "Close",
  },
];
export const EXPIRABLE_OPTION = [
  {
    label: "Yes",
    value: "Yes",
  },




  {
    label: "No",
    value: "No",
  },
];
export const DRUGCATEGORYMASTERMODAL_OPTIONS = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];

export const GST_TYPE_OPTION = [
  {
    label: "0",
    value: "0",
  },
  {
    label: "5",
    value: "5",
  },
  {
    label: "12",
    value: "12",
  },
  {
    label: "18",
    value: "18",
  },
  {
    label: "28",
    value: "28",
  }
];

export const Active_OPTION = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];
export const Is_Consignment_OPTION = [
  // {
  //   label: "",
  //   value: "0",
  // },
  {
    label: "IsStent",
    value: "1",
  },
  {
    label: "Is CSSD",
    value: "2",
  },
  {
    label: "Is Laundry",
    value: "3",
  },
];
export const Is_CSSD_OPTION = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];
export const Is_Laundry_OPTION = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];

export const MapGeneric_OPTION = [
  {
    label: "Yes",
    value: "1",
  },
  {
    label: "No",
    value: "0",
  },
];

export const PHARMACY_ITEMINDENT_TYPE = [
  { label: "IPD No.", value: "id.TransactionID" },
  { label: "UHID", value: "id.PatientID" },
  { label: "Emergency No.", value: "emg.EmergencyNo" },
  { label: "Indent No.", value: "id.IndentNo" },
  { label: "Item Name", value: "id.ItemName" },
];

export const PHARMACY_ITEMINDENT_STATUS = [
  { label: "OPEN", value: "OPEN" },
  { label: "PARTIAL", value: "PARTIAL" },
  { label: "OPEN & Partial", value: "OPEN','PARTIAL" },
  { label: "CLOSE", value: "CLOSE" },
  { label: "REJECT", value: "REJECT" },
  { label: "ALL", value: "ALL" },
];
export const REPORT_TYPE_OPTION = [
  { label: "Sale Issue", value: "1" },
  { label: "Sale Return", value: "2" },
  { label: "Purchase", value: "3" },
  { label: "Purchase Return", value: "4" },
  { label: "Summary of All Type", value: "5" },
];
export const FORMATE_TYPE_OPTION = [
  { label: "Bill-Wise", value: "1" },
  { label: "Item-Wise", value: "2" },
  { label: "HSN-Wise", value: "3" },
  { label: "Detail", value: "4" },
];

export const Pharmacy_Type = [
  { label: "Details", value: "1" },
  { label: "Summary", value: "2" },
];
export const GOBIMedicationsList = [
  {
    label: "ANTIICIPATED AIRWAY PROBLEMS",
    name: "ANTIICIPATED_AIRWAY",
    options: [
      { label: "NIL DIFFICULT", value: false },
      { label: "VENTILATION DIFFICULT", value: false },
      { label: "INTUBATION", value: false },
    ],
  },
  {
    label: "RESPIRATORY",
    name: "RESPIRATORY",
    options: [
      { label: "WNL", value: false },
      { label: "SMOKER", value: false, type: "textbox", name: "Years" },
      { label: "ASTHMA", value: false },
      { label: "COPD", value: false },
      { label: "RECENT URI", value: false },
      { label: "SLEEP APNEA", value: false },
    ],
  },
  {
    label: "CARDIOVASCULAR",
    name: "CARDIOVASCULAR",
    options: [
      { label: "WNL", value: false },
      { label: "IHD,CAD", value: false },
      { label: "HTN", value: false },
      { label: "OTHERS", value: false, type: "textbox", name: "Others" },
    ],
  },
  {
    label: "RENAL/ENDOCRINE",
    name: "RENAL_ENDOCRINE",
    options: [
      { label: "WNL", value: false },
      { label: "DIABETES:NIDDM/IDDM", value: false },
      { label: "RENAL FAILURE/DIALYSIS", value: false },
      { label: "RECENT STEROIDS", value: false },
      { label: "THYROID DISEASE", value: false, },
    ],
  },
  {
    label: "HEPATO/GASTROINTESTINAL",
    name: "HEPATO_GASTROINTESTINAL",
    options: [
      { label: "WNL", value: false },
      { label: "PONV", value: false },
      { label: "OTHERS", value: false, type: "textbox", name: "Others" },
    ],
  },
  {
    label: "NEURO/MUSCULOSKELETAL",
    name: "NEURO_MUSCULOSKELETAL",
    options: [
      { label: "WNL", value: false },
      { label: "SERIZURES", value: false },
      { label: "PARALYSIS", value: false },
      { label: "NEUROMUSCULAR DISEASE", value: false },
      { label: "OTHERS", value: false, type: "textbox", name: "Others" },
    ],
  },
  {
    label: "OTHERS",
    name: "OTHERS",
    options: [
      { label: "COAGULOPATHY", value: false },
      { label: "OBESITY", value: false },
      { label: "PREGNANCY", value: false },
      { label: "SUBSTANCE ABUSE", value: false },
    ],
  },
  {
    label: "PRESENT MEDICATIONS",
    name: "PRESENT_MEDICATIONS",
    options: [
      { label: "ANTIHTN", value: false },
      { label: "ANTIPLATELETS", value: false },
      { label: "ANTIDIABETIC", value: false },
      { label: "OTHERS", value: false, type: "textbox", name: "Others" },
    ],
  },
]

export const PreOpInstructionList = [
  {
    label: "MALAMPATTI SCORE",
    name: "malampattiScore",
    type: "single",
    options: [
      { label: "I", value: false },
      { label: "II", value: false },
      { label: "III", value: false },
      { label: "IV", value: false },
    ],
  },
  {
    label: "TEETH",
    name: "teeth",
    options: [
      { label: "N", value: false },
      { label: "LOOSE", value: false },
      { label: "MISSING", value: false },
    ],
  },
  {
    label: "T.M DISTANCE",
    name: "tmDistance",
    options: [
      { label: "ADEQUATE", value: false },
      { label: "INADEQUATE", value: false },
    ],
  },
  {
    label: "ASA CLASS",
    name: "asaClass",
    options: [
      { label: "1", value: false },
      { label: "2", value: false },
      { label: "3", value: false },
      { label: "4", value: false },
      { label: "5", value: false },
      { label: "6", value: false },
      { label: "E", value: false },
    ],
  },
  {
    label: "MOUTH OPENING ADEQATE",
    name: "mouthOpening",
    type: "single",
    options: [
      { label: "YES", value: false },
      { label: "NO", value: false },
    ],
  },
  {
    label: "DENTURES",
    name: "dentures",
    options: [
      { label: "FIXED", value: false },
      { label: "REMOVABLE", value: false },
    ],
  },
  {
    label: "NCEK MOVEMENTS",
    name: "neckMovements",
    options: [
      { label: "ADEQUATE", value: false },
      { label: "INADEQUATE", value: false },
    ],
  },
]

export const graphDataInitialvalue =  [
        {
            id: 1,
            key: "verticalBar",
            title: "Vertical Bar Chart",
            type: "Bar",
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                    {
                        label: "Sales",
                        data: [65, 59, 80, 81, 56, 55],
                        backgroundColor: "rgba(75,192,192,0.6)",
                    },
                ],
            },
        },
        {
            id: 2,
            key: "horizontalBar",
            title: "Horizontal Bar Chart",
            type: "Bar",
            data: {
                labels: ["Marvel Universe", "Star Wars", "Harry Potter", "Avengers", "Spider Man", "James Bond"],
                datasets: [
                    {
                        label: "Total Revenue of Franchise",
                        data: [22.55, 10.32, 9.18, 8.66, 8.36, 7.88],
                        backgroundColor: "#90EE90",
                        barThickness: 6,
                    },
                    // {
                    //     label: "Highest Grossing Movie in Series",
                    //     data: [2.8, 2.07, 1.34, 2.8, 1.91, 1.1],
                    //     backgroundColor: "#8A2BE2",
                    //     barThickness: 6,
                    // },
                ],
            },
            options: { indexAxis: "y" },
        },
        {
            id: 3,
            key: "stackedBar",
            title: "Stacked Bar Chart",
            type: "Bar",
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                    {
                        label: "Sales",
                        data: [65, 59, 80, 81, 56, 55],
                        backgroundColor: "rgba(75,192,192,0.6)",
                    },
                    {
                        label: "Expenses",
                        data: [28, 48, 40, 19, 86, 27],
                        backgroundColor: "rgba(255,99,132,0.6)",
                    },
                ],
            },
            options: {
                scales: {
                    x: { stacked: true },
                    y: { stacked: true },
                },
            },
        },
        {
            id: 4,
            key: "groupedBar",
            title: "Grouped Bar Chart",
            type: "Bar",
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                    {
                        label: "Sales",
                        data: [65, 59, 80, 81, 56, 55],
                        backgroundColor: "rgba(75,192,192,0.6)",
                    },
                    {
                        label: "Expenses",
                        data: [28, 48, 40, 19, 86, 27],
                        backgroundColor: "rgba(255,99,132,0.6)",
                    },
                ],
            },
        },
        {
            id: 5,
            key: "areaChart",
            title: "Area Chart",
            type: "Line",
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                    {
                        label: "Sales",
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: "#36A2EB",
                        fill: true,
                        backgroundColor: "rgba(54,162,235,0.2)",
                    },
                ],
            },
        },
        {
            id: 6,
            key: "lineChart",
            title: "Line Chart",
            type: "Line",
            data: {
                labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00"],
                datasets: [
                    {
                        label: "Webhook",
                        data: [1, 3, 2, 5, 1, 4],
                        borderColor: "#FF6384",
                        fill: true,
                        backgroundColor: "rgba(255,99,132,0.2)",
                    },
                    {
                        label: "PagerDuty",
                        data: [2, 1, 3, 4, 2, 5],
                        borderColor: "#36A2EB",
                        fill: true,
                        backgroundColor: "rgba(54,162,235,0.2)",
                    },
                    {
                        label: "Slack",
                        data: [0, 2, 1, 3, 2, 4],
                        borderColor: "#FFCE56",
                        fill: true,
                        backgroundColor: "rgba(255,206,86,0.2)",
                    },
                ],
            },
        },
        {
            id: 7,
            key: "multiaxisLine",
            title: "Multiaxis Line Chart",
            type: "Line",
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                    {
                        label: "Sales",
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: "#36A2EB",
                        yAxisID: "y",
                    },
                    {
                        label: "Expenses",
                        data: [28, 48, 40, 19, 86, 27],
                        borderColor: "#FF6384",
                        yAxisID: "y1",
                    },
                ],
            },
            options: {
                scales: {
                    y: { type: "linear", display: true, position: "left" },
                    y1: { type: "linear", display: true, position: "right" },
                },
            },
        },
        {
            id: 8,
            key: "doughnutChart",
            title: "Doughnut Chart",
            type: "Pie",
            data: {
                labels: ["Red", "Blue", "Yellow"],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                ],
            },
        },
        {
            id: 9,
            key: "polarArea",
            title: "Polar Area Chart",
            type: "Pie",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
                datasets: [
                    {
                        data: [11, 16, 7, 3, 14],
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    },
                ],
            },
            options: { type: "polarArea" },
        },
        {
            id: 10,
            key: "scatterChart",
            title: "Scatter Chart",
            type: "Scatter",
            data: {
                datasets: [
                    {
                        label: "Scatter Dataset",
                        data: [
                            { x: -10, y: 0 },
                            { x: 0, y: 10 },
                            { x: 10, y: 5 },
                            { x: 0.5, y: 5.5 },
                        ],
                        backgroundColor: "rgba(255,99,132,1)",
                    },
                ],
            },
        },
        {
            id: 11,
            key: "bubbleChart",
            title: "Bubble Chart",
            type: "Bubble",
            data: {
                datasets: [
                    {
                        label: "Bubble Dataset",
                        data: [
                            { x: 20, y: 30, r: 15 },
                            { x: 40, y: 10, r: 10 },
                            { x: 30, y: 20, r: 20 },
                        ],
                        backgroundColor: "rgba(255,99,132,0.6)",
                    },
                ],
            },
        },
    ];;