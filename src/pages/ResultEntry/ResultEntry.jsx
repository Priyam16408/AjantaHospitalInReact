import React, { useEffect, useMemo, useRef, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { FaSearch } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbList, TbUrgent } from "react-icons/tb";
import moment from "moment";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
  SaveNotApprovedResutlEntry,
  SaveObjerrvationResutlEntry,
} from "../../utils/utils";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import {
  BindApprovedBy,
  BindAttachment,
  BindAttachmentPdf,
  BindDepartmentResultEntryLab,
  BindLabReport,
  BindMachine,
  BindSampleinfo,
  BindTestDDLlab,
  BindTestResultEntryLab,
  CommentlabObservation,
  GetAmendmentReportsByTestId,
  getBindDefaultMachineApi,
  GetCommentsDropdown,
  Getpatientlabobservationopdtext,
  GetRadiologyAndDoctor,
  helpMenu,
  HoverDeltaCheck,
  HoverHeaderresultEntry,
  LabObservationSearch,
  LabSampleRejection,
  SaveResultEntryLabdata,
  SaveSampleRejectReasonApi,
  saveSaveLabTemplateAndCommentApi,
  SaveUnHoldReason,
  SearchResultEntryLab,
  updateLabBloodGroupApi,
  UpdateSerialMarkViewLab,
} from "../../networkServices/resultEntry";
import Tables from "../../components/UI/customTable";
import {
  dynamicOptions,
  formats,
  isChecked,
  modules,
} from "../../utils/constant";
import Modal from "../../components/modalComponent/Modal";
import Input from "../../components/formComponent/Input";
import {
  GetBindDoctorDept,
  GetInvCheckListMaster,
  GetPendingResultEntryPdfApi,
  PatientSearchbyBarcode,
  SaveInvItemCheckList,
} from "../../networkServices/opdserviceAPI";
import AddReportResultLab from "./AddReportResultLab";
import AddFileResultLab from "./AddFileResultLab";
import { RedirectURL } from "../../networkServices/PDFURL";
import TimePicker from "../../components/formComponent/TimePicker";
import { toast } from "react-toastify";
import ResultModelRejectModel from "./ResultModelRejectModel";
import { Checkbox } from "primereact/checkbox";
import { UpdateStatusmark } from "../../networkServices/EDP/govindedp";
import { exportToExcel } from "../../utils/exportLibrary";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import TextAreaInput from "../../components/formComponent/TextAreaInput";
import HoldRemarksModal from "./HoldRemarksModal";
import TextAreaModal from "../../components/modalComponent/Utils/TextAreaModal";
import FullTextEditor from "../../utils/TextEditor";
import { getBloodGroupApi } from "../../networkServices/BillingsApi";
import { BloodGroupFeeding } from "../../components/FrameMenu/BloodGroupFeeding";

function ResultEntry() {
  const [departmentData, setDepartmentData] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [testList, setTestList] = useState([]);
  const [Editable, setEditable] = useState(false);
  const [testlistAllData, setTestlistAllData] = useState([]);
  // const [checklistCompleted, setChecklistCompleted] = useState(false);
  const [checklistCompleted, setChecklistCompleted] = useState(false);
  const [labdata, setLabdata] = useState([]);
  const [initialTextValue, setInitialTextValue] = useState("");
  const [testDetail, setTestDetail] = useState({ isOpen: false });
  const [notApproveRemarks, setNotApproveRemarks] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [modalData, setModalData] = useState({});
  const [patientDetail, setPatientDetails] = useState([]);
  const [bindTestLab, setBindTestLab] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const [bindDoctordata, setBindDoctor] = useState([]);
  const [bindMachine, setBindMachine] = useState([]);
  const [showAmendedData, setShowAmendedData] = useState({
    showAsAmended: false,
    showAmendedRemark: ""
  })
  const [hovertestData, setHoverTestData] = useState([]);
  const [deltaData, setDeltaData] = useState([]);
  const [getText, setGetText] = useState("");
  const [MarkAsView, setMarkAsView] = useState(false);
  const userData = useLocalStorage("userData", "get");
  const [showModal, setShowModal] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportValue, setSelectedReportValue] = useState(null);
  const [bloodGroupValues, setBloodGroupValues] = useState({
    bloodGroup: "",
    remarks: ""
  });

  console.log(patientDetail, "amamam")
  // const [isNewTemplate, setIsNewTemplate] = useState(false);

  // const handleIsCheckboxChange = (e) => {
  //   setIsNewTemplate(e.target.checked);
  // };

  const [PreviousTestResult, setPreviousTestResult] = useState([
    {
      BookingDate: "21-Feb-2025 07:17 PM",
      LabObservationName: "Neutrophils",
      Value: "423",
      ReadingFormat: "%",
      MinValue: "",
      MaxValue: "",
      DisplayReading: "",
    },
  ]);

  const [testData, setTestData] = useState([]);

  const [isHovered, setIsHovered] = useState(false);
  const [isDeltaHovered, setIsDeltaHovered] = useState(false);
  const [pdata, setPdata] = useState({});
  // const [Editable, setEditable] = useState(true);
  const [newTemplate, setNewTemplate] = useState("");
  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [helpmenu, setHelpMenu] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const myRefs = useRef([]);
  const [isDLCEnabled, setIsDLCEnabled] = useState(true);
  const ip = localStorage.getItem("ip");
  const [isNewModalTemplate, setIsNewModalTemplate] = useState(false);
  const baseurl = import.meta.env.VITE_APP_REACT_APP_BASE_URL;
  const [handleModelData, setHandleModelData] = useState({});
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const closeEditorModal = () => {
    setModalOpen(false);
    setGetText("");
    setNewTemplate("");
    setIsNewModalTemplate(false);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status) {
      const filtered = testlistAllData.filter((item) => item.Status === status);
      if (filtered.length === 0) {
        notify("No Data Found", "warn");
      }
      setTbodyPatientDetail(filtered);
    } else {
      setTbodyPatientDetail(testlistAllData);
    }
  };

  const [hoveredData, setHoveredData] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hoverTimeout = useRef(null);

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(4px)",
    },
    modal: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "30px 25px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      position: "relative",
      animation: "fadeIn 0.3s ease-in-out",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "20px",
      fontSize: "22px",
      fontWeight: "bold",
      border: "none",
      background: "transparent",
      color: "#333",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    closeButtonHover: {
      transform: "scale(1.2)",
    },
    reportItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    viewButton: {
      background: "#0066ff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "background 0.2s ease",
    },
  };

  const handleChangeModel = (inputData) => {
    setModalData(inputData);
  };

  const handlePacImage = () => {
    window.open(
      `https://mohpacs.actoneng.com:3000/?patient=${patientDetail?.PatientID}`
    );
  };

  const handleMouseEnter = (val, index) => {
    clearTimeout(hoverTimeout.current);
    const filteredData = deltaData.filter((item) => item.id === val.id);
    setHoveredData(filteredData);
    setHoveredIndex(index);
    setIsTooltipVisible(true);
    handleHoverDeltaCheck(val);
  };
  const findCurrentDepartment = () => {
    console.log(departmentData, userData, "daaaaa")
    const data = departmentData?.find(
      (item) => item?.NAME?.toUpperCase() === userData?.roleName?.toUpperCase()
    );
    return data
  };


  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsTooltipVisible(false);
      setHoveredData(null);
      setHoveredIndex(null);
    }, 200);
  };
  const getReportTypeValue = () => {
    const finalData = [...testList];
    const finalDataReportType = finalData?.filter(
      (ele) => ele?.reportType == 5
    );
    return finalDataReportType[0]?.description ?? "";
  };
  const handleEditorValRadio = (value) => {
    setEditable(false);
    setGetText(value);
    const finalData = [...testList];
    const finalDataReportType = finalData?.map((ele) => {
      return {
        ...ele,
        method: "1",
        description: ele?.reportType == 5 ? value : ele?.description,
      };
    });
    setTestList(finalDataReportType);
  };

  const handleOpenModal = (val, index) => {
    setGetText(val?.description);
    setIndex(index);
    setModalOpen(true);
    handleCommentlabObservation(val, testList);

    handleGetpatientlabobservationopdtext(val);
  };

  // const handleEditorVal = (value) => {
  //   setGetText(value);
  //   const finalData = [...testList];
  //   finalData[index]["description"] = value;
  //   setTestList(finalData);
  // };
  const handleEditorVal = (value, index) => {
    setGetText(value);

    setTestList((prev) => {
      const updatedList = [...prev];

      // Make sure the item exists before updating
      if (updatedList[index]) {
        updatedList[index] = {
          ...updatedList[index],
          description: value,
        };
      }

      return updatedList;
    });
  };

  const handleCancelComment = () => {
    setValues({
      ...values,
      Templates: "",
    });

    setIndex(-1);
    setModalOpen(false);
    setGetText("");
  };


  const handleOpenDocument = (val) => {
    setHandleModelData({
      label: t("AddFile"),
      buttonName: t("Upload"),
      width: "40vw",
      isOpen: true,
      Component: (
        <AddReportResultLab
          handleChangeModel={handleChangeModel}
          patientDetail={patientDetail}
          bindTestLab={bindTestLab}
          pdata={val}
        // fileData={fileData}
        />
      ),
      // handleInsertAPI: saveDocument,
      extrabutton: <></>,
      footer: <></>,
    });
  };

  const handleOpenDocumentPdf = async (val) => {
    try {
      const params = {
        TestID: String(val?.Test_ID),
      };
      const response = await BindAttachment(params);
      if (response.success) {
        const payload = {
          testID: response?.data[0]?.Test_ID,
          FileUrl: response?.data[0]?.FileUrl,
          id: response?.data[0]?.id
        }
        const resp = await BindAttachmentPdf(payload)

        if (resp?.success && resp?.data) {
          const base64Data = resp?.data;
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
      } else {
        notify(response?.message, "error")
      }
    } catch (error) {

    }
  }

  let [t] = useTranslation();

  const [buttonDisabled, setButtonDisabled] = useState();
  // checkbox logic here

  const isMobile = window.innerWidth <= 800;

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  // const [commentMessage, setCommentMessage] = useState("");

  const handleListSearch = (data, name, index) => {
    const val = [...testList];
    val[index][name] = data?.Help;
    setTestList(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };

  const getHelpMenuData = async (e, labObservationId, labObservationName) => {
    setHiddenDropDownHelpMenu(true);
    const params = {
      invName: String(labObservationName),
      labObservationid: String(labObservationId),
    };
    try {
      const response = await helpMenu(params);
      if (response.success) {
        const data = response?.data;
        const finalData = data?.map((ele) => {
          return {
            ...ele,
            Value: labObservationId,
          };
        });
        setHelpMenu(finalData);
      } else {
        setHiddenDropDownHelpMenu(false);
      }
    } catch (error) {
      setHiddenDropDownHelpMenu(false);
    }
  };

  const [bindDoctor, setBindDoctordata] = useState([]);

  const BindDoctorApi = async () => {
    try {
      const response = await GetRadiologyAndDoctor(userData.defaultRole);

      if (response.success) {
        setBindDoctordata(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const handleKeyUp = (e, targetElem, index) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };
  const handleIndex = (e, index) => {
    const { name } = e.target;
    switch (name) {
      case "Value":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(helpmenu.length - 1);
            }
            break;
          case 40:
            if (helpmenu.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            if (HiddenDropDownHelpMenu) {
              handleListSearch(helpmenu[indexMatch], name, index);
              setIndexMatch(0);
            }
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  };
  const { VITE_DATE_FORMAT } = import.meta.env;
  const selectInput = [
    { value: "0", label: "Barcode No" },
    { value: "1", label: "UHID NO" },
    { value: "2", label: "Patient Name" },
  ];

  const Status = [
    { value: "All Patient", label: "All Patient" },
    { value: "Pending", label: "Pending" },
    { value: "Sample COllected", label: "Sample COllected" },
    { value: "Sample Receive", label: "Sample Receive" },
    { value: "Machine Data", label: "Machine Data" },
    { value: "Tested", label: "Tested" },
    { value: "Forwarded", label: "Forwarded" },
    { value: "ReRun", label: "ReRun" },
    { value: "Approved", label: "Approved" },
    { value: "Hold", label: "Hold" },
    { value: "Printed", label: "Printed" },
  ];
  const PatientType = [
    { value: "0", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMERGENCY" },
  ];

  const FlagData = [
    { value: "Normal", label: "Normal" },
    { value: "Low", label: "Low" },
    { value: "High", label: "High" },
    { value: "MAXC", label: "MAXC" },
    { value: "MINC", label: "MINC" },
  ];

  const tatoption = [
    { value: "ALL", label: "All" },
    { value: "1", label: "WithIn TAT" },
    { value: "2", label: "Near TAT" },
    { value: "3", label: "Outside TAT" },
  ];
  const TestTypedata = [{ value: "1", label: "Urgent Test" }];
  const Machine = [{ value: "ALL", label: "All Machine" }];
  const [TemplatesData, setTemplatesData] = useState([]);


  const [values, setValues] = useState({
    BarcodeNo: "",
    department: { value: "", label: '' },
    Status: { value: "All Patient", label: "All Patient" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    Test: { value: "", label: "ALL" },
    PatientType: { value: "0", label: "ALL" },
    Machine: { value: "ALL", label: "ALL" },
    TestType: "",
    tatoption: { value: "ALL", label: "All" },
    toTime: new Date(),
    fromTime: new Date(),
    reason: "",
    SearchType: { label: "Barcode No", value: "pli.BarcodeNo" },
    TestMachine: "",
    selectInput: { value: "0", label: "Barcode No." },
    selectedInput: "",
    doctorselect: "",
    Value: "",
    dlcChecked: "",
    Templates: "",
    Comments: "",
    viewFinding: "",
    IsCriticalRadiology: "",
    DoctorId: null,
    ApprovedBy1: null,
    ApprovedBy2: null,
    MachineID: '',
    showAsAmended: ""
  });
  console.log(values, "shshs")

  const [data, setData] = useState([]);
  const [templatesDataview, setTemplateData] = useState([]);
  const [bloodGroupList, setBloodGroupList] = useState([])
  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("TAT") },
    { width: "15%", name: t("Bill Date") },
    { width: "10%", name: t("Type") },
    { width: "15%", name: t("Barcode No") },
    { width: "15%", name: t("IPDNo") },
    // { width: "10%", name: t("UHID No.") },
    { width: "10%", name: t("Patient Name") },
    { width: "10%", name: t("Age/Sex") },
    { width: "5%", name: t("TestName") },
    { width: "10%", name: t("Status") },
    { width: "10%", name: t("Doctor") },
    { width: "10%", name: t("Panel") },
    { width: "10%", name: t("Booking Center") },
    { width: "10%", name: t("Time Diff") },
    { width: "10%", name: t("Dept Rec Date") },
    { width: "10%", name: t("Decation Time") },
    { width: "10%", name: t("Mark Row") },
    { width: "10%", name: t("Unmark Row") },
    { width: "10%", name: t("IS Amendement") },
    { width: "10%", name: t("View Detail") },
    { width: "10%", name: t("View Reports") },
    { width: "10%", name: t("View Document") },
  ];

  const theadDetails = [
    { width: "5%", name: t(".") },
    { width: "5%", name: t("Test") },
    { width: "15%", name: t("Value") },
    { width: "15%", name: t("Comment") },
    { width: "10%", name: t("Flag") },
    { width: "15%", name: t("Detail Value") },
    { width: "10%", name: t("MacReading") },
    { width: "10%", name: t("ReadingFormat") },
    { width: "10%", name: t("minValue") },
    { width: "10%", name: t("maxValue") },
    { width: "10%", name: t("Machine Name") },
    { width: "10%", name: t("Reading1") },
    { width: "10%", name: t("Reading2") },
    { width: "10%", name: t("Method Name") },
    { width: "10%", name: t("Display Reading") },
    { width: "10%", name: t("Remarks") },
  ];

  const SampleInfohead = [
    { width: "5%", name: t("Investigation Name") },
    { width: "15%", name: t("Sample Drawn Name") },
    { width: "15%", name: t("Reg. Date") },
    { width: "10%", name: t("Reg. By") },
    { width: "15%", name: t("Collection Date") },
    { width: "10%", name: t("Collected By") },
    { width: "10%", name: t("Received Date") },
    { width: "10%", name: t("Received By") },
    { width: "10%", name: t("Rejected Date") },
    { width: "10%", name: t("Rejected By") },
    { width: "10%", name: t("Reading1") },
    { width: "10%", name: t("Sample Rejected Reason") },
    { width: "10%", name: t("Result Entered Date") },
    { width: "10%", name: t("Result Entered By") },
    { width: "10%", name: t("Approved Date") },
    { width: "10%", name: t("Approved By") },
    { width: "10%", name: t("Hold By") },
    { width: "10%", name: t("Hold Reason") },
  ];

  const BindTestDDLlabData = async (data) => {
    const params = {
      LedgerTransactionNo: String(data.LedgerTransactionNo),
      TestID: String(data.Test_ID),
    };
    try {
      const response = await BindTestDDLlab(params);
      if (response.success) {
        setBindTestLab(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindTestLab([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindTestLab([]);
    }
  };

  // Getpatientlabobservationopdtext

  const handleGetpatientlabobservationopdtext = async (data) => {
    const params = {
      TestID: String(data.test_ID),
    };
    try {
      const response = await Getpatientlabobservationopdtext(params);
      if (response.success) {
        setGetText(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  // BindAttachment

  const handleBindAttachment = async (data) => {
    const params = {
      TestID: String(data?.Test_ID),
    };
    try {
      const response = await BindAttachment(params);
      if (response.success) {
        setAttachment(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setAttachment([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setAttachment([]);
    }
  };

  const handleGetBloodGroups = async () => {

    try {
      const response = await getBloodGroupApi();
      if (response?.success) {
        setBloodGroupList(response?.data?.map((item) => (
          {
            label: item?.BloodGroup,
            value: item?.BloodGroup
          }
        )));
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response?.message
        );
      }
    } catch (error) {
      console.log(error?.message)
    }
  }


  const fetchTestData = async () => {
    try {
      const response = await BindTestResultEntryLab();
      if (response.success) {
        setTestData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setTestData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setTestData([]);
    }
  };

  const handleBindApprovedBy = async () => {
    try {
      const response = await BindApprovedBy();
      if (response.success) {
        setBindDoctor(response?.data);
      } else {
        setBindDoctor([]);
      }
    } catch (error) {
      setBindDoctor([]);
    }
  };

  //  To Handle Machine
  const handleBindMachine = async () => {
    try {
      const response = await BindMachine();
      if (response.success) {
        const data = response?.data;
        setBindMachine(data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  const getSearchType = () => {
    switch (values.selectInput.value) {
      case "0":
        return "pli.BarcodeNo";
      case "1":
        return "lt.PatientID";
      case "2":
        return "pm.PName";
      default:
        return "";
    }
  };

  const handleSearchSampleCollection = async () => {
    setTestList(() => []);
    let payload = {
      // searchType: "",
      // searchValue: "",

      searchType: getSearchType(),
      searchValue: values.selectedInput,
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
      sampleColl: values?.Status?.value,
      department: values?.department?.value,
      machineID: values?.Machine?.value || "ALL",
      zsm: "null",
      timeFrom: values?.fromTime,
      timeTo: values?.toTime,
      isUrgent: values?.TestType?.value || "",
      investigationId: values?.Test?.value || "",
      panelId: "",
      sampleStatusText: values?.Status?.value || "All Patient",
      chRemarks: "0",
      chComments: "0",
      tatOption: values?.tatoption?.value || "ALL",
      patientType: values.PatientType.value,
    };

    try {
      setTestDetail({ isOpen: false });
      const apiResp = await SearchResultEntryLab(payload);

      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return {
            ...val,
            isChecked: false,
            colorcode: getColorByLabel(val.Status),
          };
        });
        notify(`${data?.length} records found`, "success");
        setTestlistAllData(data);
        setTbodyPatientDetail(data);
      } else {
        notify("No records found", "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await BindDepartmentResultEntryLab();
      if (response.success) {
        setDepartmentData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };
  const checklistData = async () => {
    try {
      const response = await GetInvCheckListMaster();

      if (response.success) {
        setData(response.data);
        // setDepartmentData(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching checklist data:", error);
    }
  };

  const returnFlagColor = (data) => {
    const value = Number(data?.value);
    const minCritical = Number(data?.minCritical);
    const maxCritical = Number(data?.maxCritical);

    const hasMinMaxCritical = maxCritical !== 0 || minCritical !== 0;

    if (!isNaN(value) && hasMinMaxCritical) {
      if (!isNaN(minCritical) && minCritical !== 0 && value <=minCritical) {
        return "orange";
      }
      if (!isNaN(maxCritical) && maxCritical !== 0 && value >= maxCritical) {
        return "red";
      }
    }

    if (data?.flag === "High") return "#FFC0CB";
    if (data?.flag === "Low") return "#FFFF00";
    return "";
  };

  const [fetchReportVal, setFetchReport] = useState([]);
  console.log(fetchReportVal, "fetchReportVal data");

  const LabObservationSearchdata = async (data) => {

    console.log(values?.MachineID);
    let payload = {
      labNo: data.LedgerTransactionNo,
      testID: data.Test_ID,
      ageInDays: data.AGE_in_Days,
      rangeType: "Normal",
      gender: data.Gender,
      machineID: "",
      macId: values?.MachineID?.value || values?.MachineID,
    };
    try {
      const apiResp = await LabObservationSearch(payload);
      console.log("the api response fetchReportVal data is", apiResp?.data);
      setFetchReport(apiResp?.data);
      const patientDetaildata = await PatientSearchbyBarcode(data.PatientID, 1);
      setPatientDetails(patientDetaildata.data);

      if (apiResp.success) {
        const criticalValue =
          apiResp?.data
            ?.find((ele) => ele?.reportType === 5)
            ?.isCriticalRadiology?.toString() ?? "";
        const datas = apiResp?.data?.map((ele) => ({
          ...ele,
          minValue: ele?.minValue == null ? "" : ele?.minValue,
          maxValue: ele?.maxValue == null ? "" : ele?.maxValue,
          Value: ele?.value == null ? "" : ele?.value,
          isChecked: true,
          formula: ele?.formula == null ? "" : ele?.formula,
          DoctorId: "",
          MachineID: bindMachine[0]?.MachineID,
          colorcode: returnFlagColor(ele),
          flag: ele?.flag,
          findingValue: ele?.reportType == 5 ? ele?.value : "",
          IsCriticalRadiology: criticalValue,
          isNewTemplate: 0,

          // ele?.flag == "High"
          //   ? "#FFC0CB"
          //   : ele?.flag == "Low"
          //     ? "#FFFF00"
          //     : "",
        }));
        const checkReportTypevalue = datas.filter(
          (item) => item.reportType === 3 || item.reportType === 5
        );
        setShowAmendedData({
          showAsAmended: apiResp?.data[2]?.isShowAmendment == 1 ? true : false,
          showAmendedRemark: apiResp?.data[2]?.showAmendmentRemarks
        })
        checkReportTypevalue?.length > 0 &&
          handleCommentlabObservation(data, datas);
        HandleGetCommentsDropdown(data);
        setTestList(datas);
        // console.log(datas);
        // setTestlistAllData(datas);
      } else {
        setTestList([]);
        // setTestlistAllData([]);
      }
    } catch (error) {
      setTestList([]);
      // setTestlistAllData([]);
    }
    finally {
      setEditable(false);
    }
  };

  const getFIndingValue = () => {
    const findingValueget = testList?.filter((ele) => ele?.reportType);
    return findingValueget[0]?.findingValue ?? "";
  };

  const getIsCriticalRadiology = () => {
    const findingValueget = testList?.filter((ele) => ele?.reportType == 5);
    return findingValueget[0]?.IsCriticalRadiology ?? "";
  };

  const IsCriticalRadiology = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const [invalidSelections, setInvalidSelections] = useState({});

  const handleDoctorChange = (name, value) => {
    if (!value) return;
    const selectedDoctorName = value?.label || value?.Name;
    console.log("the selectedDoctorName ", selectedDoctorName);

    const doctorName = testList[0]?.DoctorIdName || testList[2]?.pDoctorName;
    const approvedBy1 =
      testList[0]?.ApprovedBy1Name || testList[2]?.approvedBy1Name;
    const approvedBy2 =
      testList[0]?.ApprovedBy2Name || testList[2]?.approvedBy2Name;

    const selectedMap = {
      DoctorId: doctorName,
      ApprovedBy1: approvedBy1,
      ApprovedBy2: approvedBy2,
    };

    const otherNames = Object.entries(selectedMap)
      .filter(([key]) => key !== name)
      .map(([, val]) => val);

    if (
      selectedDoctorName !== "select" &&
      selectedDoctorName &&
      otherNames.includes(selectedDoctorName)
    ) {
      notify(
        "Doctor name is already selected in another field. Please choose a different doctor.",
        "error"
      );

      // Reset the invalid selection
      setInvalidSelections((prev) => ({ ...prev, [name]: true }));
      return;
    }

    // Clear the invalid selection flag if value is valid
    setInvalidSelections((prev) => ({ ...prev, [name]: false }));

    const updatedList = testList.map((ele) => ({
      ...ele,
      [name]: value?.value || value?.EmployeeID,
      [`${name}Name`]: selectedDoctorName,
    }));

    setTestList(updatedList);
  };

  const handleChangeFinding = (e) => {
    const data = testList?.map((ele) => {
      return {
        ...ele,
        [e.target.name]: e.target.value,
      };
    });

    setTestList(data);
  };

  const handleIsCrititcal = (name, value) => {
    const data = testList?.map((ele) => {
      return {
        ...ele,
        [name]: value?.value ?? "",
      };
    });

    setTestList(data);
  };

  const handleChangetemplatevalue = (e) => {
    ;
    const { name, type, checked, value } = e.target;

    const data = testList?.map((ele, index) => {
      return {
        ...ele,
        ...(type === "checkbox"
          ? { [name]: checked ? 1 : 0 }
          : { [name]: value }),
      };
    });

    setTestList(data);
  };

  const handleSelect = (name, value) => {
    if (name == "Templates") {
      setValues((val) => ({ ...val, [name]: value?.value }));
      HandleGetCommentsDropdown(value?.value ?? "");
    } else if (name == "MachineID") {
      setValues((val) => ({ ...val, [name]: value?.value }));
      LabObservationSearchdata(labdata);
    } else setValues((val) => ({ ...val, [name]: value }));
  };

  useEffect(() => {
    LabObservationSearchdata(labdata);
  }, [values.MachineID]);

  const HandleGetCommentsDropdown = async (data) => {
    console.log(checkReportTypevalue, "checkReportTypevalue data is");
    const payload = {
      cmntID: data,
      type: checkReportTypevalue.length > 0 ? "Value" : "comments",
      barcodeNo: templatesDataview?.BarcodeNo,
      testID: templatesDataview?.Test_ID,
    };
    try {
      const response = await GetCommentsDropdown(payload);
      if (response?.success) {
        // Update testList if reportType === 5
        const updatedList = testList.map((item) => ({
          ...item,
          description:
            item?.reportType === 5 ? response.data : item.description,
        }));
        setTestList(updatedList);
        setEditable(true);
        setGetText(response.data ?? "");
      } else {
        setGetText("");
      }
    } catch (error) {
      setGetText("");
    }
  };

  // const HandleGetCommentByvalue = async (data) => {
  //   console.log("Selected Template ID:", data);

  //   const payload = {
  //     cmntID: data,
  //     type: "Value",
  //     barcodeNo: templatesDataview?.BarcodeNo,
  //     testID: templatesDataview?.Test_ID,
  //   };

  //   try {
  //     const response = await GetCommentsDropdown(payload);

  //     if (response?.success) {
  //       // Update testList if reportType === 5
  //       const updatedList = testList.map((item) => ({
  //         ...item,
  //         description:
  //           item?.reportType === 5 ? response.data : item.description,
  //       }));
  //       setTestList(updatedList);

  //       // Update getText with returned data

  //       setGetText(response.data ?? "");

  //       console.log("Comments updated:", response.data);
  //     } else {
  //       setGetText("");
  //       console.warn("API did not return success");
  //     }
  //   } catch (error) {
  //     setGetText("");
  //     console.error("Error fetching comments:", error);
  //   }
  // };

  const checkReportTypevalue = testList.filter(
    (item) => item.reportType === 3 || item.reportType === 5
  );

  const handleCommentSave = async (data) => {
    if (isNewModalTemplate) {
      if (!newTemplate) {
        notify("Please enter a template name", "error");
        return;
      }
      if (!getText) {
        notify("Please enter a  template value", "error");
        return;
      }
      const payload = {
        id: "",
        templateName: newTemplate,
        templateValue: getText,
        type: checkReportTypevalue?.length > 0 ? "Value" : "comment",
        labObservation_ID: selectedReportValue?.labObservation_ID,
      };
      const res = await saveSaveLabTemplateAndCommentApi(payload);
      if (res.success) {
        notify("Template saved successfully", "success");
      } else {
        notify("Failed to save template", "error");
      }
    }

    setValues({
      ...values,
      Templates: "",
    });

    const finalData = [...testList];
    finalData[index]["description"] = getText;

    setTestList(finalData);
    setIndex(-1);
    closeEditorModal();
    setGetText("");
  };

  const handleCommentlabObservation = async (data, datas) => {
    setSelectedReportValue(data);
    const checkReportTypevalue = datas.filter(
      (item) => item.reportType === 3 || item.reportType === 5
    );

    let payload = {
      LabObservation_ID:
        checkReportTypevalue?.length > 0
          ? data?.Test_ID != null
            ? data?.Test_ID
            : data?.labObservation_ID
          : data?.labObservation_ID,
      Type: checkReportTypevalue?.length > 0 ? "Value" : "comments",
    };

    try {
      const response = await CommentlabObservation(payload);

      if (response.success) {
        setTemplatesData(response?.data);
      } else {
        setTemplatesData([]);
      }
    } catch (error) {
      setTemplatesData([]);
    }
  };

  // const handleCommentlabObservationbyValue = async (data) => {
  //   console.log("the data value is", data);
  //   let payload = {
  //     LabObservation_ID: data?.Test_ID,
  //     Type: "Value",
  //   };
  //   try {
  //     const response = await CommentlabObservation(payload);

  //     if (response.success) {
  //       // setTemplatesData(response?.data);
  //     } else {
  //       // setTemplatesData([]);
  //     }
  //   } catch (error) {
  //     setTemplatesData([]);
  //   }
  // };

  const handleHoverHeaderresultEntry = async (data) => {
    let payload = {
      TestID: data?.test_ID,
    };
    try {
      const response = await HoverHeaderresultEntry(payload);
      if (response.success) {
        setHoverTestData(response?.data);
      } else {
        setHoverTestData("");
      }
    } catch (error) {
      setHoverTestData("");
    }
  };

  const handleHoverDeltaCheck = async (val) => {
    let payload = {
      TestID: val?.test_ID,
      LabObservationID: val?.labObservation_ID,
    };
    try {
      const response = await HoverDeltaCheck(payload);
      if (response.success) {
        setDeltaData(response?.data);
      } else {
        setDeltaData("");
      }
    } catch (error) {
      setDeltaData("");
    }
  };

  useEffect(() => {
    checklistData();
    fetchDepartmentData();
    handleBindApprovedBy();
    handleBindMachine();
    BindDoctorApi();
    handleGetBloodGroups()
  }, []);
  useEffect(() => {
    const currentDepartment = findCurrentDepartment();
    if (currentDepartment) {
      setValues((prev) => ({
        ...prev,
        department: {
          value: currentDepartment?.SubCategoryID || "",
          label: currentDepartment?.NAME || ""
        }
      }));
    }
  }, [departmentData]);

  useEffect(() => {
    const handleBindDefaultMachine = async (data) => {
      try {
        const response = await getBindDefaultMachineApi(data?.Test_ID);
        if (response?.success) {
          setValues((prev) => ({
            ...prev,
            MachineID: response?.data,
          }));
        } else {
          console.log(response?.message)
        }
      } catch (error) {
        console.log(error?.message)
      }
    };
    if (labdata) {
      handleBindDefaultMachine(labdata)
    }
  }, [labdata]);

  useEffect(() => {
    const isAllDone = data?.every((item) => item.IsTaken === 0);

    if (isAllDone) {
      setChecklistCompleted(false);
    } else {
      setChecklistCompleted(false);
    }
  }, [data]);

  useEffect(() => {
    if (testList[2]?.markAsView === 1) {
      setMarkAsView(true);
    } else {
      setMarkAsView(false);
    }
  }, [testList]);
  const handleAllCheckBoxResult = (e) => {
    const isChecked = e.target.checked;
    const updatedList = testList.map((ele) => ({
      ...ele,
      isChecked: isChecked,
    }));

    setTestList(updatedList);
  };

  const tblList = {
    checkbox: (
      <div>
        {/* <input 
         type="checkbox" 
         onClick={(e) => handleAllCheckBoxResult(e)}
         /> */}

        <input
          type="checkbox"
          onChange={handleAllCheckBoxResult}
          checked={testList.every((item) => item.isChecked)}
        />
      </div>
    ),
    testName: <></>,
    Value: <></>,
    comment: <></>,
    flag: <></>,
    detailVal: <></>,
    MacReading: <></>,
    ReadingFormat: "",
    minValue: "",
    maxValue: "",
    btn: (
      <button
        className="btn btn-sm btn-success "
        type="button"
        onClick={() => handleOpenDocument(pdata)}
        disabled={buttonDisabled}
      >
        {t("Add Report")}
      </button>
    ),
    Attachmentbtn: (
      <button
        className="btn btn-sm btn-success "
        type="button"
        onClick={() => {
          handleAddFile(pdata);
        }}
        disabled={buttonDisabled}
      >
        {t("Add Attachment")}
      </button>
    ),
    commentbtn: <div></div>,
    DLCcheck: (
      <label>
        <input
          type="checkbox"
          name="dlcChecked"
          checked={isDLCEnabled}
          onChange={(e) => setIsDLCEnabled(e.target.checked)}
        />{" "}
        DLC Check
      </label>
    ),
    displayReading: "",
    remarks: <></>,
  };

  const handleOpenTest = (val, index) => {
    setEditable(true);
    let data = tbodyPatientDetail[index];
    setLabdata(data);

    setTemplateData(data);
    setPdata({ index: index, ...data });
    LabObservationSearchdata(data);
    console.log("2");
    // handleCommentlabObservationbyValue(data);

    BindTestDDLlabData(data);
    // handleGetpatientlabobservationopdtext(data);
    handleBindAttachment(data);
    // handleBindAttachment(data);
    setTestDetail({ isOpen: true, detail: data });
  };
  const ApplyFormula = (testid) => {
    if (testList.length) {
      for (let i = 0; i < testList.length; i++) {
        var Formula = "";
        Formula = testList[i].formula;
        if (Formula != "" && testList[i].test_ID === testid) {
          for (var j = 0; j < testList.length; j++) {
            try {
              var aa = Number(testList[j].Value);
              if (aa == "") {
                aa = "0";
              }
              if (testList[i].reportType == "1") {
                Formula = Formula.replace(
                  new RegExp(testList[j].labObservation_ID + "@", "g"),
                  aa
                );
              }
            } catch (e) { }
          }
          try {
            var vv = Math.round(eval(Formula) * 100) / 100;
            if (vv == "0" || isNaN(vv)) {
              testList[i].Value = "";
            } else {
              testList[i].Value = vv.toString();
            }
          } catch (e) {
            testList[i].Value = "";
          }
          var ans = testList[i].Value;
          for (let i = 0; i < testList.length; i++) {
            const value = parseFloat(testList[i].Value);
            const minValue = parseFloat(testList[i]["minValue"]);
            const maxValue = parseFloat(testList[i]["maxValue"]);
            const minCritical = parseFloat(testList[i]["minCritical"]);
            const maxCritical = parseFloat(testList[i]["maxCritical"]);

            const hasMinMax = minValue !== 0 || maxValue !== 0;
            const hasMinMaxCritical = maxCritical !== 0 || minCritical !== 0;
            if (hasMinMax) {
              if (
                !isNaN(minCritical) &&
                value <=minCritical &&
                hasMinMaxCritical
              ) {
                testList[i]["flag"] = "MINC";
                testList[i]["colorcode"] = "orange";
              } else if (
                !isNaN(maxCritical) &&
                value >= maxCritical &&
                hasMinMaxCritical
              ) {
                testList[i]["flag"] = "MAXC";
                testList[i]["colorcode"] = "red";
              } else if (!isNaN(maxValue) && value > maxValue) {
                testList[i]["flag"] = "High";
                testList[i]["colorcode"] = "#FFC0CB";
              } else if (!isNaN(minValue) && value < minValue) {
                testList[i]["flag"] = "Low";
                testList[i]["colorcode"] = "#FFFF00";
              }
            }
          }

          if (testList[i].Value === "") {
            testList[i]["flag"] = "";
            testList[i]["colorcode"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            testList[i].Value = "";
            testList[i]["flag"] = "";
            testList[i]["colorcode"] = "";
          }
        }
      }
    }
  };

  const handleCustomInput = (
    index,
    name,
    value,
    type,
    max,
    test_ID,
    formula
  ) => {
    if (type === "number") {
      if (!isNaN(value) && Number(value) <= max) {
        const data = [...testList];
        data[index][name] = value;
        setTestList(data);
      } else {
        return false;
      }
    } else {
      const data = [...testList];
      data[index][name] = value;
      if (value == "") {
        data[index]["flag"] = "";
        data[index]["colorcode"] = "";
      }
      if (name === "Value" && value !== "") {
        const numValue = Number(value);
        const minCritical = Number(data[index]?.minCritical);
        const maxCritical = Number(data[index]?.maxCritical);
        const minValue = Number(data[index]?.minValue);
        const maxValue = Number(data[index]?.maxValue);
        const hasMinMax = minValue !== 0 || maxValue !== 0;
        const hasMinMaxCritical = maxCritical !== 0 || minCritical !== 0;

        if (!isNaN(numValue && hasMinMax)) {
          if (
            !isNaN(minCritical) &&
            numValue <=minCritical &&
            hasMinMaxCritical
          ) {
            data[index]["flag"] = "MINC";
            data[index]["colorcode"] = "orange";
          } else if (
            !isNaN(maxCritical) &&
            numValue >= maxCritical &&
            hasMinMaxCritical
          ) {
            data[index]["flag"] = "MAXC";
            data[index]["colorcode"] = "red";
          } else if (!isNaN(minValue) && numValue < minValue) {
            data[index]["flag"] = "Low";
            data[index]["colorcode"] = "#FFFF00";
          } else if (!isNaN(maxValue) && numValue > maxValue) {
            data[index]["flag"] = "High";
            data[index]["colorcode"] = "#FFC0CB";
          } else {
            data[index]["flag"] = "Normal";
            data[index]["colorcode"] = "";
          }
        }
      }

      // dynamicOptions = {};

      setTestList(data);
    }
    ApplyFormula(test_ID);
  };

  console.log(testDetail, "testDetail data is");
  const handleSave = async () => {
    if (isNewModalTemplate) {
      if (!newTemplate) {
        notify("Please enter a template name", "error");
        return;
      }
      if (!getText && !initialTextValue) {
        notify("Please enter a  template value", "error");
        return;
      }
      const payload = {
        id: "",
        templateName: newTemplate,
        templateValue: getText ? getText : initialTextValue,
        type: "Value",
        labObservation_ID: testDetail?.detail?.Test_ID || "",
        //test_ID: testDetail?.detail?.Test_ID || "",
      };
      const res = await saveSaveLabTemplateAndCommentApi(payload);
      if (res.success) {
        notify("Template saved successfully", "success");
        setNewTemplate("");
        setGetText("");
        setIsNewModalTemplate(false);
      } else {
        notify("Failed to save template", "error");
      }
    }

    if (pdata?.Status === "Approved" || pdata?.Status === "Printed") {
      toast.error("This Test is Approved");
      return;
    }

    if (isDLCEnabled) {
      let dlcSum = testList
        .filter((val) => val.isDLCCheck == 1)
        .reduce((sum, val) => sum + (parseFloat(val.Value) || 0), 0);

      if (dlcSum !== 0 && dlcSum !== 100) {
        toast.error("Sum of DLC values must be either 0 or 100");
        return;
      }
    }
    const doctorId = testList[0]?.DoctorId || testList[2]?.pDoctorID;

    if (!doctorId) {
      notify("Please select a Doctor 1", "warn");
      return;
    }

    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      testList,
      "Save",
      "",
      testDetail?.IsCriticalRadiology
    );

    payload.datas[0].DoctorId = testList[0]?.DoctorId || testList[2]?.pDoctorID;
    payload.ApprovedBy = testList[0]?.DoctorId || testList[2]?.pDoctorID;
    payload.ApprovedBy1 = Number(
      testList[0]?.ApprovedBy1 || testList[2]?.approvedBy1
    );
    payload.ApprovedBy2 = Number(
      testList[0]?.ApprovedBy2 || testList[2]?.approvedBy2
    );
    payload.IsCriticalRadiology = Number(
      payload?.IsCriticalRadiology || testList[2]?.IsCriticalRadiology
    );
    payload.IsShowAmendment = showAmendedData?.showAsAmended ? 1 : 0;
    payload.ShowAmendmentRemarks = showAmendedData?.showAmendedRemark;
    payload.machineID_Manual = values?.MachineID?.value || values?.MachineID;

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        // handleSearchSampleCollection();
        setTestDetail({ isOpen: true });
        notify("Data saved successFully", "success");
        HandleGetCommentsDropdown();
        LabObservationSearchdata(templatesDataview);
        setShowAmendedData({
          showAsAmended: false,
          showAmendedRemark: ""
        })
        // setEditable(false);
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data");
    }
  };

  const DeltaResponse = async () => {
    // const response = await
    setPreviousTestResult([
      {
        BookingDate: "21-Feb-2025 07:17 PM",
        LabObservationName: "Neutrophils",
        Value: "423",
        ReadingFormat: "%",
        MinValue: "",
        MaxValue: "",
        DisplayReading: "",
      },
    ]);
  };

  const handleApprove = async (status) => {
    if (pdata?.Status == "Approved" || pdata?.Status === "Printed") {
      notify("This Test is Approved", "error");
    } else if (
      status === "Approved" &&
      !(testList?.[0]?.DoctorId || testList?.[2]?.pDoctorID)
    ) {
      notify("Kindly Select Doctor", "error");
      return;
    } else {
      let dlcSum = testList
        .filter((val) => val.isDLCCheck === 1)
        .reduce((sum, val) => sum + (parseFloat(val.Value) || 0), 0);

      if (dlcSum !== 0 && dlcSum !== 100) {
        notify("Sum of DLC values must be either 0 or 100", "error");
        return;
      }

      let payload = SaveObjerrvationResutlEntry(
        testDetail?.detail,
        testList,
        status
      );
      payload.machineID_Manual = values?.MachineID?.value || values?.MachineID;

      try {
        const apiResp = await SaveResultEntryLabdata(payload);
        if (apiResp.success) {
          handleSearchSampleCollection();
          setTestDetail({ isOpen: false });
          notify("Data approved successfully", "success");
        } else {
          notify(apiResp.message, "error");
        }
      } catch (error) {
        notify("An error occurred while approving data", "error");
      }
    }
  };



  const handleHoldRemarks = async (status, val, index) => {
    if (status?.rejectreason === "") {
      notify("Please Enter Not Approve Remarks", "error");
      return;
    }
    const reasonPayload = {
      unHoldReason: status?.newReason || status?.rejectreason,
    };
    try {
      const reasonResponse = await SaveUnHoldReason(reasonPayload);
      if (reasonResponse?.success) {
        notify("Reason saved successfully", "success");
      } else {
        notify("Error saving reason", "error");
        return;
      }
    } catch (error) {
      notify("Error saving reason", "error");
      return;
    }

    const updatedTestList = testList.map((item) => ({
      ...item,
      IsAmendmentUnapproved: 1,
      ApprovedBy1: "",
      ApprovedBy2: "",
      UnApproveDate: moment(new Date()).format("DD-MMM-YYYY"),
    }));

    setTestList(updatedTestList);

    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      updatedTestList,
      // status?.status
      "Hold",
      status.newReason || status?.rejectreason
    );

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setTestDetail({ isOpen: false });
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        notify("Data Un Approved successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while Not Approving data", "error");
    }
  };

  const handleUnHoldRemarks = async (status, val, index) => {
    const reasonPayload = {
      unHoldReason: status?.newReason || status?.rejectreason,
    };
    try {
      const reasonResponse = await SaveUnHoldReason(reasonPayload);
      if (reasonResponse?.success) {
        notify("Reason saved successfully", "success");
      } else {
        notify("Error saving reason", "error");
        return;
      }
    } catch (error) {
      notify("Error saving reason", "error");
      return;
    }

    const updatedTestList = testList.map((item) => ({
      ...item,
      IsAmendmentUnapproved: 1,
      ApprovedBy1: "",
      ApprovedBy2: "",
      UnApproveDate: moment(new Date()).format("DD-MMM-YYYY"),
    }));

    setTestList(updatedTestList);

    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      updatedTestList,
      // status?.status
      "UnHold",
      status.newReason || status?.rejectreason
    );

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setTestDetail({ isOpen: false });
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        notify("Data Un Approved successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while Not Approving data", "error");
    }
  };

  const handleHold = (e, val, index) => {
    setHandleModelData({
      label: t("Hold Reason"),
      buttonName: t(""),
      width: "30vw",
      isOpen: true,
      Component: (
        <HoldRemarksModal
          setNotApproveRemarks={setNotApproveRemarks}
          handleChangeModel={handleChangeRejectModel}
          notApproveRemarks={notApproveRemarks}
        />
      ),
      handleInsertAPI: (status) => handleHoldRemarks(status, val, index),
    });
  };
  const handleUpdateBloodGroup = async (data) => {
    const payload = {
      bloodGroup: data?.bloodGroup,
      patientID: patientDetail?.PatientID,
      BloodGroupRemark: data?.remarks
    }
    try {
      const response = await updateLabBloodGroupApi(payload);
      if (response?.success) {
        notify(response?.message, "success");
        setHandleModelData((prev) => ({ ...prev, isOpen: false }));

      } else {
        notify(response?.message, "error");
        return;
      }
    } catch (error) {
      notify(error?.message, "error");
      return;
    }
  }
  const handleBloodGoroupModal = (e, val, index) => {
    setHandleModelData({
      label: t("Blood Group Feeding"),
      buttonName: t("Save"),
      width: "25vw",
      isOpen: true,
      Component: (
        <BloodGroupFeeding bloodGroupData={bloodGroupList} handleChangeModal={handleUpdateBloodGroup} PatientID={patientDetail?.PatientID} />
      ),
      // handleInsertAPI: handleUpdateBloodGroup,
      footer: (<></>)
    });
  };

  // const [reportTypeData,setReportTypeData] = useState("");

  const handleUnHold = (e, val, index) => {
    setHandleModelData({
      label: t("Un Hold Reason"),
      buttonName: t(""),
      width: "30vw",
      isOpen: true,
      Component: (
        <HoldRemarksModal
          setNotApproveRemarks={setNotApproveRemarks}
          handleChangeModel={handleChangeRejectModel}
          notApproveRemarks={notApproveRemarks}
        />
      ),
      handleInsertAPI: (status) => handleUnHoldRemarks(status, val, index),
    });
  };

  const checkReportType = useMemo(() => {
    const flag = testList?.filter((ele) => ele?.reportType == 5);

    return flag?.length > 0 ? false : true;
  }, [testList]);
  const showCriticalFiledByReport = useMemo(() => {
    const flag = testList?.filter((ele) => ele?.reportType == 5 || ele?.reportType == 3);

    return flag?.length > 0 ? false : true;
  }, [testList]);

  //   const checkReportTypevalue = useMemo(() => {
  //   const flag = testList?.some(
  //     (ele) => ele?.reportType === 3 || ele?.reportType === 5
  //   );
  //   return flag ? false : true;
  // }, [testList]);

  // const [reportTypeData, setReportTypeData] = useState("");

  // const checkReportTypevalue = useMemo(() => {
  //   console.log("The testList data is", testList);

  //   const flag = testList?.filter(
  //     (ele) => ele?.reportType === 3 || ele?.reportType === 5
  //   );

  //   return flag.length > 0;
  // }, [testList]);

  // const checkReportTypevalue = useMemo(() => {
  //   // console.log("Checking reportType in testList", testList);
  //   return testList?.some(item => item?.reportType == 3 || item?.reportType == 5);
  // }, [testList]);

  // const checkReportTypevalue = Array.isArray(testList)
  //   ? testList.filter(item => Number(item?.reportType) === 3 || Number(item?.reportType) === 5)
  //   : [];

  // const checkReportTypeValue = useMemo(() => {
  //   return testList?.some(
  //     (ele) => Number(ele?.reportType) === 3 || Number(ele?.reportType) === 5
  //   );
  // }, [testList]);
  // const reportTypeData = testList.some(item => item.reportType == 5);
  // console.log(reportTypeData,"hasreport type  valye");

  // Update state based on the computed value
  // useEffect(() => {
  //   setReportTypeData(checkReportTypeValue);
  // }, [checkReportTypeValue]);

  // setReportTypeData(checkReportTypevalue);

  // console.log("the checkReportTypevalue value is",checkReportTypevalue);
  // console.log()

  const notApproved = async (status, val, index, base64) => {
    if (status?.newReason) {
      const payloadReason = {
        reasion: status?.newReason,
      };
      try {
        const response = await SaveSampleRejectReasonApi(payloadReason);
        if (response?.success) {
          notify("Reason saved successfully", "success");
          setIsInput(false);
        }
      } catch (error) {
        console.log("Error fetching data", "error");
      }
    }

    const updatedTestList = testList.map((item) => ({
      ...item,
      IsAmendmentUnapproved: 1,
      UnApprovalReason: status.rejectreason || status.newReason,
      ApprovedBy1: "",
      ApprovedBy2: "",
      UnApproveDate: moment(new Date()).format("DD-MMM-YYYY"),
    }));

    setTestList(updatedTestList);

    let payload = SaveNotApprovedResutlEntry(
      base64,
      updatedTestList,
      "Not Approved"
    );
    payload.machineID_Manual = values?.MachineID ?? "";

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setTestDetail({ isOpen: false });
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        notify("Data Un Approved successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while Not Approving data", "error");
    }
  };

  const getbase64 = async (link) => {
    const response = await fetch(link);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleClickRejectdata = async (status, val, index) => {
    const payload2 = {
      testID: pdata?.Test_ID,
      isOnlinePrint: "1",
      isConversion: "",
      isNabl: "0",
      orderBy: "",
      labType: "1",
      ipAddress: ip,
      isPrev: true,
      SerialNo: testList[2].serialNo,
    };

    const apiResp = await BindLabReport(payload2);

    if (!apiResp?.success || !apiResp?.data) {
      notApproved(status, val, index, "");
      notify("No records found", "error");
      return;
    }

    if (apiResp?.message === "0") {
      const fileUrl = `${baseurl}/${apiResp?.data}`;
      try {
        const base64String = await getbase64(fileUrl);
        notApproved(status, val, index, base64String);
      } catch (err) {
        notify("Failed to load report", "error");
      }
    }
  };

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      delete ele?.TypeID;
      delete ele?.TypeName;
      delete ele?.DetailID;
      delete ele?.ColorCode;
      delete ele?.Gender;
      delete ele?.isrerun;
      delete ele?.ReferLab;
      delete ele?.LedgerTransactionNo;
      delete ele?.SampleLocation;
      delete ele?.CombinationSample;
      delete ele?.Centre;
      delete ele?.AGE_in_Days;
      delete ele?.RemarkStatus;
      delete ele?.DocumentStatus;
      delete ele?.isChecked;
      delete ele?.colorcode;
      delete ele?.markStatus;
      delete ele?.ReferLab;
      delete ele?.SampleLocation;
      delete ele?.Samplerequestdate;
      delete ele?.TATDelay;
      delete ele?.TATIntimate;
      delete ele?.TatDelayinSecond;
      delete ele?.Urgent;
      delete ele?.isrerun;
      delete ele?.Test_ID;
      delete ele?.TimeDiff;
      delete ele?.Acutalwithdrawdate;
      delete ele?.Admission_Type;
      delete ele?.Comments;
      delete ele?.DevationTime;
      delete ele?.ObservationType_Id;
      delete ele?.CombinationSampleDept;
      delete ele?.srno;

      return { ...ele };
    });

    return modifiedResponseData;
  };

  const handleClickReject = (e, val, index) => {
    setHandleModelData({
      label: t("Reject Reason"),
      buttonName: t("Un Approved"),
      width: "30vw",
      isOpen: true,
      Component: (
        <ResultModelRejectModel
          // inputData={item}
          setNotApproveRemarks={setNotApproveRemarks}
          handleChangeModel={handleChangeRejectModel}
          notApproveRemarks={notApproveRemarks}
        />
      ),
      handleInsertAPI: (status) => handleClickRejectdata(status, val, index),
    });
  };
  const handlePrintPendingList = async (type) => {
    if (type === "excel") {
      exportToExcel(
        ExceldataFormatter(tbodyPatientDetail),
        "Pending Patient Report",
        "",
        "pending_list",
        "pending_list"
      );
    }
    if (type === "pdf") {
      const payload = {
        reportType: "pdf",
        labType: "OPD",
        searchType: getSearchType(),
        searchValue: values.selectedInput,
        fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
        sampleColl: values?.Status?.value,
        department: values?.department?.value,
        machineID: values?.Machine?.value || "ALL",
        zsm: "null",
        timeFrom: values?.fromTime,
        timeTo: values?.toTime,
        isUrgent: values?.TestType?.value || "",
        investigationId: values?.Test?.value || "",
        panelId: "",
        sampleStatusText: values?.Status?.value || "All Patient",
        chRemarks: "0",
        chComments: "0",
        tatOption: values?.tatoption?.value || "ALL",
        patientType: values.PatientType.value,
      };
      try {
        const response = await GetPendingResultEntryPdfApi(payload);
        if (response.success) {
          RedirectURL(response?.data?.pdfUrl);
        }
      } catch (error) {
        notify(error?.message, "error");
      }
    }
  };

  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const handleCheckBoxResult = (e, val) => {
    const isChecked = e.target.checked;
    // setIsHeaderChecked(isChecked);
    const updatedData = testList.map((ele) => ({
      ...ele,
      isChecked:
        ele.investigation_ID == val.investigation_ID
          ? isChecked
          : ele.isChecked, // isChecked,
    }));
    setTestList(updatedData);
    // setTbodyPatientDetail(updatedData);
  };

  const handleSetModalData = (data) => {
    setHandleModelData({
      label: t("Sample Information"),
      buttonName: t(""),
      width: "80vw",
      isOpen: true,
      Component: (
        <div>
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.LedgerTransactionNo || ""}
              lable={t("Barcode No")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.SampleType || ""}
              lable={t("Sample Type")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.PName || ""}
              lable={t("Patient Name")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Age || ""}
              lable={t("Age/Gender")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Mobile || ""}
              lable={t("Phone/Mobile")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.DepartmentName || ""}
              lable={t("Department ss")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.ReferDoctor || ""}
              lable={t("Refer Doctor")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.Panel_Code || ""}
              lable={t("Panel")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.BarcodeNo || ""}
              lable={t("Barcode No.")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              className="form-control"
              placeholder=" "
              value={data?.DOB || ""}
              lable={t("DOB")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          </div>

          <div>
            <Tables
              thead={SampleInfohead}
              tbody={[
                {
                  InvestigationName: data.name || "",
                  SampleDrawnName: data.SampleReceivedBy || "",
                  RegDate: "",
                  RegBy: "",
                  CollectionDate: data.SampleReceiveDate || "",
                  CollectedBy: data.SampleCollector || "",
                  ReceivedDate: data.SampleReceiveDate || "",
                  ReceivedBy: data.SampleReceivedBy || "",
                  RejectedDate: data.RejectDate || "",
                  RejectedBy: data.RejectUser || "",
                  Reading1: "",
                  SampleRejectedReason: data.RejectionReason || "",
                  ResultEnteredDate: data.ResultEnteredDate || "",
                  ResultEnteredBy: data.ResultEnteredName || "",
                  ApprovedDate: data.ApprovedDate || "",
                  ApprovedBy: data.ApprovedName || "",
                  HoldBy: data.holdByName || "",
                  HoldReason: data.Hold_Reason || "",
                },
              ]}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      ),
      extrabutton: <></>,
      footer: <></>,
    });
  };

  const [insufficientRemarks, setInsufficientRemarks] = useState("");
  const handleBindSampleinfo = async (val) => {
    // LabObservationSearchdata();
    const payload = {
      LedgerTransactionNo: val.LedgerTransactionNo,
      TestID: val.Test_ID,
    };
    try {
      const apiResp = await BindSampleinfo(payload);
      if (apiResp.success) {
        handleSetModalData(apiResp?.data[0]);
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  console.log(values, testList, "val'")

  const handleCheckboxChange = async (name, checked) => {
    setMarkAsView(checked);
    try {
      const payload = {
        testId: testList[0].test_ID,
        serialNo: testList[2].SerialNo || testList[2].serialNo,
        markAsView: checked ? 1 : 0,
      };
      const resp = await UpdateSerialMarkViewLab(payload);
      if (resp.success) {
        notify(resp.message, "success");
      }
    } catch (error) { }
  };

  const handleBindLabReport = async () => {
    const payload = {
      testID: pdata?.Test_ID,
      isOnlinePrint: "1",
      isConversion: "",
      isNabl: "0",
      orderBy: "",
      labType: "1",
      ipAddress: ip,
      isPrev: true,
      SerialNo: testList[2].serialNo,
    };

    try {
      const apiResp = await BindLabReport(payload);

      if (!apiResp?.success || !apiResp?.data) {
        notify("No records found", "error");
        return;
      }

      if (apiResp?.message === "0") {
        RedirectURL(apiResp?.data);
        return;
      }

      // const htmlString = apiResp.data;

      // const match = htmlString.match(
      //   /<iframe[^>]+src=['"](data:application\/pdf;base64,[^'"]+)['"]/
      // );

      // if (match && match[1]) {
      //   const pdfSrc = match[1];
      //   const base64Data = pdfSrc.split(",")[1];

      //   const savePayload = {
      //     testID: pdata?.Test_ID,
      //     base64PDF: base64Data,
      //     createdAt: new Date().toISOString(),
      //   };

      //   const saveResp = await fetch(
      //     "https://your-api-url.com/api/labreport/save",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(savePayload),
      //     }
      //   );

      //   const result = await saveResp.json();

      //   if (!result?.success) {
      //     notify("Failed to save PDF", "error");
      //     return;
      //   }

      //   const newTab = window.open();
      //   newTab.document.write(
      //     `<iframe src="${pdfSrc}" width="100%" height="100%" style="border:none;"></iframe>`
      //   );
      // } else {
      //   notify("Failed to extract PDF", "error");
      // }
    } catch (error) {
      notify("An error occurred while processing the PDF", "error");
    }
  };

  const openModal = async (val) => {
    try {
      setLoading(true);
      const response = await GetAmendmentReportsByTestId(val?.Test_ID);
      if (response.success && Array.isArray(response.data)) {
        setReportList(response.data);
        setShowModal(true);
      } else {
        console.error("No report data found");
      }
    } catch (err) {
      console.error("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = (base64String) => {
    try {
      const base64Data = base64String.split(",").pop();
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Invalid PDF data", err);
    }
  };

  const handleAddFile = (val, index) => {
    setHandleModelData({
      label: t("AddFile"),
      buttonName: t("NursingWard.SampleCollection.upload"),
      width: "40vw",
      height: "40vh",
      isOpen: true,
      Component: (
        <AddFileResultLab
          handleChangeModel={handleChangeModel}
          patientDetail={patientDetail}
          bindTestLab={bindTestLab}
          testDetail={testDetail}
          tbodyPatientDetail={tbodyPatientDetail}
          val={val}
          pdata={tbodyPatientDetail[index]}
        />
      ),
      extrabutton: <></>,
      footer: <></>,
    });
  };

  // const filteredLabObservationNames = testList
  //   .filter((val) => val.inv === "1")
  //   .map((val) => val.labObservationName)
  //   .join("\n");

  const filteredLabObservations = testList.filter((val) => val.inv === "1");

  useEffect(() => {
    BindTestDDLlabData();
    fetchTestData();
  }, []);

  // const getColorByVal = (label) => {
  //   // console.log(label?.colorcode)
  //   switch (label?.colorcode) {
  //     case "High":
  //       return "red";
  //     case "Low":
  //       return "yellow";
  //     default:
  //       return "white";
  //   }
  // };

  const getColorByLabel = (label) => {
    switch (label) {
      case "Collected":
        return "#CC99FF";
      case "Pending":
        return "bisque";
      case "MacData":
        return "#FF0000";
      case "Tested":
        return "#a2b4da";
      case "Rerun":
        return "#daa2da";
      case "Forward":
        return "#3399FF";
      case "Approved":
        return "#90EE90";
      case "Printed":
        return "#00FFFF";
      case "Hold":
        return "#FFFF00";
      case "Received":
        return "lightblue";
      case "Insufficient":
        return "#A53860";
      default:
        return "white";
    }
  };

  const handleInsufficient = (val, status) => {
    setModalData({ data: val, status: status });
    setHandleModelData({
      label: t("Remarks Modal"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: <TextAreaModal handleChangeModel={setModalData} />,
      handleInsertAPI: handleMarkUnMarked,
      extrabutton: <></>,
    });
  };

  const handleMarkUnMarked = async (data) => {
    const payload = {
      markStatus: data?.status,
      BarCode: data?.data?.BarcodeNo,
      testId: data?.data?.Test_ID,
      MarkStatusReason: data?.insufficientRemarks,
    };

    try {
      const apiResp = await UpdateStatusmark(payload);
      if (apiResp.success) {
        notify("Data marked successfully", "success");
        handleSearchSampleCollection();
        setHandleModelData({ isOpen: false });
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      // console.error("Error processing PDF:", error);
      notify("An error occurred while fetching data", "error");
    }
  };
  const handleReactSelect = (index, name, value) => {
    const labelList = JSON.parse(JSON.stringify(data));
    labelList[index][name] = value;
    setData(labelList);
  };

  const handleSaveCheckComplete = async () => {
    const payload = data.map((item) => ({
      Id: item.Id,
      Name: item.Name,
      IsTaken: item.IsAlreadyDone.value,
    }));

    const resp = await SaveInvItemCheckList(payload);

    if (resp.success) {
      setChecklistCompleted(false);
    } else {
      const firstKey = Object.keys(resp.data.errors)[0];
      const firstMessage = resp.data.errors[firstKey][0];
      notify(`Row ${firstKey.split()} ${firstMessage}`, "warn");
    }
  };

  const handleInputChange = (name, value) => {
    const updatedList = testList.map((item) => ({
      ...item,
      [name]: value,
    }));
    setTestList(updatedList);
  };

  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...testList];
    updatedData[index].isChecked = e.target.checked;
    setTestList(updatedData);
  };

  useEffect(() => {
    const text = getReportTypeValue()
    setInitialTextValue(getReportTypeValue());
    // setGetText(text)
    // if(!modalOpen){

    //   setEditable(true); 
    // }
  }, [testList]);


  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading title={t("heading")} isBreadcrumb={true} />
        {checklistCompleted ? (
          <>
            <Modal
              modalWidth="60vw"
              visible={true}
              setVisible={setModalOpen}
              Header={t("Check List Item Details")}
              handleAPI={handleSaveCheckComplete}
              IsCancelFlag={true}
              footer={
                <>
                  <button
                    onClick={handleSaveCheckComplete}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </>
              }
            // handleCancelComment={handleCancelComment}
            >
              <table className="table-auto w-full border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.Id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{item?.Name}</td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-4 ">
                          <ReactSelect
                            placeholderName={"Select Taken"}
                            name={"IsAlreadyDone"}
                            value={item?.IsAlreadyDone?.value}
                            removeIsClearable={true}
                            dynamicOptions={[
                              { label: "No", value: "0" },
                              { label: "Yes", value: "1" },
                            ]}
                            handleChange={(name, e) =>
                              handleReactSelect(index, name, e)
                            }
                            respclass={"col-sx-12 col-12 col-md-8 col-sm-6"}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Modal>
          </>
        ) : (
          <>
            {!testDetail?.isOpen && (
              <div>
                <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
                  <ReactSelect
                    placeholderName={t("Select Search Type")}
                    id="selectInput"
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={selectInput}
                    handleChange={handleSelect}
                    value={`${values?.selectInput?.value}`}
                    name="selectInput"
                  />
                  <Input
                    type="text"
                    id="selectedInput"
                    className="form-control"
                    placeholder=" "
                    value={values.selectedInput}
                    lable={t(values.selectInput.label)}
                    onChange={handleChange}
                    name="selectedInput"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />
                  <ReactSelect
                    placeholderName={t("Department")}
                    id={"department"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { value: "", label: "ALL" },
                      ...handleReactSelectDropDownOptions(
                        departmentData,
                        "NAME",
                        "SubCategoryID"
                      ),
                    ]}
                    handleChange={handleSelect}
                    value={`${values?.department?.value}`}
                    name={"department"}
                  />

                  <ReactSelect
                    placeholderName={t("Status")}
                    id={"Status"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={Status}
                    handleChange={handleSelect}
                    value={values?.Status?.value}
                    name={"Status"}
                  />

                  <DatePicker
                    id="fromDate"
                    className="custom-calendar"
                    name="fromDate"
                    lable={t("FromDate")}
                    value={values?.fromDate || new Date()}
                    handleChange={handleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                  />

                  <TimePicker
                    placeholderName="From Time"
                    lable={t("From Time")}
                    id="fromTime"
                    name="fromTime"
                    value={values?.fromTime}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    handleChange={handleChange}
                  />

                  <DatePicker
                    className="custom-calendar"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate || new Date()}
                    handleChange={handleChange}
                    lable={t("ToDate")}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-4 col-12"}
                    maxDate={new Date()}
                  />
                  <TimePicker
                    placeholderName="To Time"
                    lable={t("To Time")}
                    id="toTime"
                    name="toTime"
                    value={values?.toTime}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    handleChange={handleChange}
                  />

                  <ReactSelect
                    placeholderName={t("Test")}
                    id={"Test"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { value: "", label: "ALL" },
                      ...handleReactSelectDropDownOptions(
                        testData,
                        "testname",
                        "testid"
                      ),
                    ]}
                    handleChange={handleSelect}
                    value={`${values?.Test?.value}`}
                    name={"Test"}
                  />
                  <ReactSelect
                    placeholderName={t("Tat Option")}
                    id={"tatoption"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={tatoption}
                    handleChange={handleSelect}
                    value={values?.tatoption?.value}
                    name={"tatoption"}
                  />
                  <ReactSelect
                    placeholderName={t("Machine")}
                    id={"Machine"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={Machine}
                    handleChange={handleSelect}
                    value={`${values?.Machine?.value}`}
                    name={"Machine"}
                  />

                  <ReactSelect
                    placeholderName={t("Patient Type")}
                    id={"PatientType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={PatientType}
                    handleChange={handleSelect}
                    value={`${values?.PatientType?.value}`}
                    name={"PatientType"}
                  />

                  <ReactSelect
                    placeholderName={t("TestType")}
                    id={"TestType"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={TestTypedata}
                    handleChange={handleSelect}
                    value={`${values?.TestType?.value}`}
                    name={"TestType"}
                  />

                  <div className="ml-2 d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-success"
                      type="button"
                      onClick={handleSearchSampleCollection}
                    >
                      {t("Search")}
                    </button>
                    {tbodyPatientDetail?.length > 0 && (
                      <div className=" pl-3">
                        <button
                          className="btn btn-sm btn-primary "
                          type="button"
                          onClick={() => handlePrintPendingList("pdf")}
                        >
                          {t("Print Pdf")}
                        </button>
                        <button
                          className="btn btn-sm btn-primary ml-2"
                          type="button"
                          onClick={() => handlePrintPendingList("excel")}
                        >
                          {t("Print Excel")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Color Coding Section */}
                <Heading
                  title=""
                  isBreadcrumb={false}
                  secondTitle={
                    <>
                      <ColorCodingSearch
                        label={t("Collected")}
                        color="#CC99FF"
                        onClick={() => handleStatusChange("Collected")}
                      />
                      <ColorCodingSearch
                        label={t("Pending")}
                        color="bisque"
                        onClick={() => handleStatusChange("Pending")}
                      />
                      <ColorCodingSearch
                        label={t("MacData")}
                        color="#FF0000"
                        onClick={() => handleStatusChange("MacData")}
                      />
                      <ColorCodingSearch
                        label={t("Tested")}
                        color="#a2b4da"
                        onClick={() => handleStatusChange("Tested")}
                      />
                      <ColorCodingSearch
                        label={t("Rerun")}
                        color="#daa2da"
                        onClick={() => handleStatusChange("ReRun")}
                      />
                      <ColorCodingSearch
                        label={t("Forward")}
                        color="#3399FF"
                        onClick={() => handleStatusChange("Forwarded")}
                      />
                      <ColorCodingSearch
                        label={t("Approved")}
                        color="#90EE90"
                        onClick={() => handleStatusChange("Approved")}
                      />
                      <ColorCodingSearch
                        label={t("Printed")}
                        color="#00FFFF"
                        onClick={() => handleStatusChange("Printed")}
                      />
                      <ColorCodingSearch
                        label={t("Hold")}
                        color="#FFFF00"
                        onClick={() => handleStatusChange("Hold")}
                      />
                      <ColorCodingSearch
                        label={t("Received")}
                        color="lightblue"
                        onClick={() => {
                          handleStatusChange("Received");
                        }}
                      />
                      <ColorCodingSearch
                        label={t("Insufficient")}
                        color="#A53860"
                        onClick={() => {
                          handleStatusChange("Insufficinet");
                        }}
                      />
                    </>
                  }
                />
              </div>
            )}
          </>
        )}

        {/* Main Table Section */}
        <div className="card table-responsive">
          {testDetail?.isOpen ? (
            <>
              <div
                className="text-white default_theme main-header"
                style={{
                  width: "100%",
                  padding: 5,
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between text-white">
                  <div>
                    <strong>{patientDetail.PatientID}</strong>
                  </div>
                  <div>
                    <strong>{patientDetail.Title + patientDetail.PName}</strong>
                  </div>
                  <div>
                    <strong>PAT/00280</strong>
                  </div>
                  <div>
                    <strong>{patientDetail.Age}</strong>
                  </div>
                  <div>
                    <strong>{patientDetail.Gender}</strong>
                  </div>
                  <div>
                    <strong>MARKETING TEAM</strong>
                  </div>
                  <div>
                    <strong>{patientDetail.patientType}</strong>
                  </div>
                  <div>
                    <strong>+ MARKETING TEAM-R</strong>
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={handleBloodGoroupModal}
                    >
                      {t("Blood Update")}
                    </button>
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={handleSearchSampleCollection}
                    >
                      {t("Main List")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="position-relative d-inline-block">
                {filteredLabObservations.map((val, index) => (
                  <span
                    key={index}
                    className="fw-bold  px-2"
                    style={{
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "bolder",
                      color: "red",
                    }}
                    onMouseEnter={() => {
                      setIsHovered(true);
                      handleHoverHeaderresultEntry({ test_ID: val.test_ID });
                    }}
                  >
                    {val?.labObservationName}
                  </span>
                ))}

                {isHovered && PreviousTestResult.length > 0 && (
                  <div
                    onMouseLeave={() => setIsHovered(false)}
                    className="position-absolute bg-white border rounded shadow p-3 mt-1"
                    style={{ width: "100%", maxWidth: "600px", zIndex: 9999 }}
                  >
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered text-center">
                        <thead className="table-primary">
                          <tr>
                            <th>Result Enter Date</th>
                            <th>Test</th>
                            <th>Value</th>
                            <th>Unit</th>
                            <th>Min</th>
                            <th>Max</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hovertestData.map((ele, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor: getColorByLabel(ele?.status),
                              }}
                            >
                              <td>{ele?.BookingDate || "-"}</td>
                              <td>{ele?.LabObservationName || "-"}</td>
                              <td>{ele?.Value || "-"}</td>
                              <td>{ele?.readingFormat || "-"}</td>
                              <td>{ele?.MinValue || "-"}</td>
                              <td>{ele?.MaxValue || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* labortary  */}
              {checkReportType ? (
                <Tables
                  thead={theadDetails}
                  tbody={[
                    tblList,
                    ...testList.map((val, index) => {
                      if (val.inv === "3") {
                        return {
                          isChecked: <></>,
                          Test: (
                            <span
                              style={{
                                color: "#800000",
                                fontWeight: "bolder",
                                fontSize: "30px",
                              }}
                            >
                              {val.labObservationName}
                            </span>
                          ),
                          VAL: <div style={{ padding: 10 }}></div>,
                          Comment: "",
                          Flag: "",
                          DetailVal: "",
                          MacReading: val.macReading,
                          ReadingFormat: val.readingFormat,
                          minValue: val.minValue,
                          maxValue: val.maxValue,
                          MachineName: val.machinename,
                          Reading1: val.reading1,
                          Reading2: val.reading2,
                          MethodName: val.method,
                          DisplayReading: val.displayReading,
                          Remarks: val.remarks,
                        };
                      } else if (val.inv === "1") {
                        return {
                          isChecked: (
                            <input
                              type="checkbox"
                              checked={val.isChecked}
                              // checked={isHeaderChecked}
                              onClick={(e) => handleCheckBoxResult(e, val)}
                            />
                          ),
                          Test: (
                            <div>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                {val.labObservationName}
                              </span>
                            </div>
                          ),
                          VAL: <div style={{ padding: 10 }}></div>,
                          Comment: "",
                          Flag: "",
                          DetailVal: "",
                          MacReading: (
                            <span style={{ backgroundColor: "blue" }}>
                              {val.macReading}
                            </span>
                          ),
                          ReadingFormat: val.readingFormat,
                          minValue: val.minValue,
                          maxValue: val.maxValue,
                          Hold:
                            val?.isHold == "1" ? (
                              <button
                                className="btn btn-md btn-success  p-2"
                                type="button"
                                onClick={() => handleUnHold("UnHold", val)}
                              >
                                {t("UnHold")}
                              </button>
                            ) : (
                              <button
                                className="btn btn-md btn-success  p-2"
                                type="button"
                                onClick={() => handleHold("Hold", val)}
                              >
                                {t("HOLD")}
                              </button>
                            ),
                          UnHold: "",
                          UnApproved: (
                            <button
                              className="btn btn-sm btn-success  p-2 "
                              disabled={
                                !(
                                  pdata?.Status === "Approved" ||
                                  pdata?.Status === "Printed"
                                )
                              }
                              type="button"
                              onClick={() =>
                                handleClickReject("Not Approved", val, index)
                              }
                            >
                              {t("Not Approved")}
                            </button>
                          ),
                          MethodName: val.method,
                          DisplayReading: val.displayReading,
                          Remarks: val.remarks,
                        };
                      } else if (val.inv === "4") {
                        return {
                          isChecked: (
                            <input
                              type="checkbox"
                              checked={val.isChecked}
                              disabled={true}
                            />
                          ),
                          Test: <span>{val.labObservationName}</span>,
                          VAL: <div style={{ padding: 10 }}></div>,
                          Comment: "",
                          Flag: "",
                          DetailVal: "",
                          MacReading: val.macReading,
                          ReadingFormat: val.readingFormat,
                          minValue: val.minValue,
                          maxValue: val.maxValue,
                          MachineName: val.machinename,
                          Reading1: val.reading1,
                          Reading2: val.reading2,
                          MethodName: val.method,
                          DisplayReading: val.displayReading,
                          Remarks: val.remarks,
                        };
                      } else if (val.inv === "2") {
                        return {
                          isChecked: <></>,
                          Test: (
                            <div>
                              <span>{val.labObservationName}</span>
                            </div>
                          ),
                          VAL: (
                            <Input
                              type="text"
                              className="table-input"
                              disabled={true}
                              name="Value"
                              value={val?.Value ? val?.Value : ""}
                              onChange={(e) => {
                                handleCustomInput(
                                  index,
                                  "Value",
                                  e.target.value,
                                  "text",
                                  100000,
                                  val?.test_ID,
                                  val?.formula
                                );
                              }}
                              placeholder=" "
                              respclass="ResultEntrytableinput"
                              removeFormGroupClass={true}
                            />
                          ),

                          Comment: (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div
                                className="mx-2"
                                style={{ cursor: "pointer", fontSize: 24 }}
                                onClick={() => handleOpenModal(val, index)}
                              >
                                <IoMdAddCircleOutline />
                              </div>
                            </div>
                          ),
                          Flag: "",
                          DetailVal: "",
                          MacReading: (
                            <span style={{ backgroundColor: "blue" }}>
                              {val.macReading}
                            </span>
                          ),
                          ReadingFormat: val.readingFormat,
                          minValue: val.minValue,
                          maxValue: val.maxValue,
                          MachineName: val.machinename,
                          Reading1: val.reading1,
                          Reading2: val.reading2,
                          MethodName: val.method,
                          DisplayReading: val.displayReading,
                          Remarks: val.remarks,

                          colorcode: val?.colorcode,
                        };
                      } else if (val.inv === null) {
                        return {
                          isChecked: (
                            <input
                              type="checkbox"
                              checked={val.isChecked}
                              onChange={(e) => handleChangeCheckbox(e, index)}
                            />
                          ),

                          Test: (
                            <span
                              className={
                                val.isDLCCheck == 1
                                  ? "isDLCCheck"
                                  : val.help != ""
                                    ? "helpMenu"
                                    : val.formula != ""
                                      ? "formula"
                                      : ""
                              }
                            >
                              {val.labObservationName}
                            </span>
                          ),
                          Val:
                            val?.reportType == "1" ? (
                              val.help == "" ? (
                                <Input
                                  type="text"
                                  className="table-input"
                                  name="Value"
                                  value={val?.Value ? val?.Value : ""}
                                  onChange={(e) => {
                                    handleCustomInput(
                                      index,
                                      "Value",
                                      e.target.value,
                                      "text",
                                      100000,
                                      val?.test_ID,
                                      val?.formula
                                    );
                                  }}
                                  // onChange={handleChange}
                                  placeholder=" "
                                  respclass="ResultEntrytableinput"
                                  removeFormGroupClass={true}
                                />
                              ) : (
                                // <div style={{ position: "relative" }}>
                                //   <Input
                                //     style={{
                                //       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000" height="16" width="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke-width="2" stroke="black" fill="black"/></svg>')`,
                                //       backgroundPosition:
                                //         "calc(100% - 10px) center",
                                //       backgroundRepeat: "no-repeat",
                                //       paddingRight: "30px",
                                //     }}
                                //     ref={(el) => (myRefs.current[index] = el)}
                                //     type="text"
                                //     className="table-input"
                                //     name="Value"
                                //     value={val?.Value ? val?.Value : ""}
                                //     onChange={(e) => {
                                //       handleCustomInput(
                                //         index,
                                //         "Value",
                                //         e.target.value,
                                //         "text",
                                //         100000,
                                //         val?.test_ID,
                                //         val?.formula
                                //       );
                                //     }}
                                //     onKeyDown={(e) => {
                                //       getHelpMenuData(
                                //         e,
                                //         val?.labObservation_ID,
                                //         val?.labObservationName
                                //       );
                                //       handleIndex(e, index);
                                //     }}
                                //     onKeyUp={(e) =>
                                //       handleKeyUp(
                                //         e,
                                //         myRefs.current[
                                //         index === testList.length - 1
                                //           ? 0
                                //           : index + 1
                                //         ],
                                //         index
                                //       )
                                //     }
                                //     // onChange={handleChange}
                                //     placeholder=" "
                                //     respclass="ResultEntrytableinput"
                                //     removeFormGroupClass={true}
                                //   />

                                //   {helpmenu.length > 0 &&
                                //     helpmenu[0]?.Value ==
                                //     val?.labObservation_ID &&
                                //     HiddenDropDownHelpMenu && (
                                //       <ul
                                //         className={"suggestion-data-help"}
                                //         style={{
                                //           width: "100%",
                                //           position: "absolute",
                                //           right: "0px",
                                //           border: "1px solid #dddfeb",
                                //         }}
                                //       >
                                //         {helpmenu.map((data, helpmenuindex) => (
                                //           <li
                                //             onClick={() =>
                                //               handleListSearch(
                                //                 data,
                                //                 "Value",
                                //                 index
                                //               )
                                //             }
                                //             key={helpmenuindex}
                                //             className={`${helpmenuindex === indexMatch &&
                                //               "matchIndex"
                                //               }`}
                                //           >
                                //             {data?.Help}
                                //           </li>
                                //         ))}
                                //       </ul>
                                //     )}
                                // </div>
                                <div style={{ position: "relative" }}>
                                  <Input
                                    style={{
                                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000" height="16" width="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke-width="2" stroke="black" fill="black"/></svg>')`,
                                      backgroundPosition:
                                        "calc(100% - 10px) center",
                                      backgroundRepeat: "no-repeat",
                                      paddingRight: "30px",
                                    }}
                                    ref={(el) => (myRefs.current[index] = el)}
                                    type="text"
                                    className="table-input"
                                    name="Value"
                                    value={val?.Value ? val?.Value : ""}
                                    onChange={(e) => {
                                      handleCustomInput(
                                        index,
                                        "Value",
                                        e.target.value,
                                        "text",
                                        100000,
                                        val?.test_ID,
                                        val?.formula
                                      );
                                    }}
                                    onFocus={(e) => {
                                      // 👇 Show help menu on focus
                                      getHelpMenuData(
                                        e,
                                        val?.labObservation_ID,
                                        val?.labObservationName
                                      );
                                      setHiddenDropDownHelpMenu(true); // 👈 Ensure menu shows
                                    }}
                                    onKeyDown={(e) => {
                                      getHelpMenuData(
                                        e,
                                        val?.labObservation_ID,
                                        val?.labObservationName
                                      );
                                      handleIndex(e, index);
                                    }}
                                    onKeyUp={(e) =>
                                      handleKeyUp(
                                        e,
                                        myRefs.current[
                                        index === testList.length - 1
                                          ? 0
                                          : index + 1
                                        ],
                                        index
                                      )
                                    }
                                    placeholder=" "
                                    respclass="ResultEntrytableinput"
                                    removeFormGroupClass={true}
                                  />

                                  {helpmenu.length > 0 &&
                                    helpmenu[0]?.Value ==
                                    val?.labObservation_ID &&
                                    HiddenDropDownHelpMenu && (
                                      <ul
                                        className="suggestion-data-help"
                                        style={{
                                          width: "100%",
                                          position: "absolute",
                                          right: "0px",
                                          border: "1px solid #dddfeb",
                                          background: "#fff", // Ensure visibility
                                          zIndex: 10, // On top of other elements
                                        }}
                                      >
                                        {helpmenu.map((data, helpmenuindex) => (
                                          <li
                                            onClick={() =>
                                              handleListSearch(
                                                data,
                                                "Value",
                                                index
                                              )
                                            }
                                            key={helpmenuindex}
                                            className={`${helpmenuindex === indexMatch
                                              ? "matchIndex"
                                              : ""
                                              }`}
                                          >
                                            {data?.Help}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                </div>
                              )
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <div>
                                  <div
                                    className="mx-2"
                                    style={{ cursor: "pointer", fontSize: 24 }}
                                    onClick={() => handleOpenModal(val, index)}
                                  >
                                    <IoMdAddCircleOutline />
                                  </div>
                                </div>
                              </div>
                            ),
                          Comment:
                            val?.reportType == "1" ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                                onMouseLeave={handleMouseLeave}
                              >
                                <div
                                  className="mx-2"
                                  style={{ cursor: "pointer", fontSize: 24 }}
                                  onClick={() => handleOpenModal(val, index)}
                                >
                                  <IoMdAddCircleOutline />
                                </div>
                                <div className="position-relative d-inline-block">
                                  <div className="d-inline-block position-relative">
                                    <span
                                      className="fa fa-exclamation-triangle mx-2"
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "25px",
                                        fontWeight: "bolder",
                                      }}
                                      onMouseEnter={() =>
                                        handleMouseEnter(val, index)
                                      }
                                    ></span>

                                    {isTooltipVisible &&
                                      hoveredIndex === index &&
                                      deltaData?.length > 0 && (
                                        <div
                                          className="position-absolute bg-white border rounded shadow p-3 mt-1"
                                          style={{
                                            width: "auto",
                                            maxWidth: "600px",
                                            minWidth: "300px",
                                            zIndex: 9999,
                                            top: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            overflowX: "auto",
                                          }}
                                          onMouseEnter={() =>
                                            clearTimeout(hoverTimeout)
                                          }
                                          onMouseLeave={handleMouseLeave}
                                        >
                                          <div className="table-responsive">
                                            <table className="table table-hover table-bordered text-center">
                                              <thead className="table-primary">
                                                <tr>
                                                  <th>Booking Date</th>
                                                  <th>Lab Observation Name</th>
                                                  <th>Value</th>
                                                  <th>Reading Format</th>
                                                  <th>Min</th>
                                                  <th>Max</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {deltaData.map((ele, index) => (
                                                  <tr
                                                    key={index}
                                                    style={{
                                                      backgroundColor:
                                                        getColorByLabel(
                                                          ele?.status
                                                        ),
                                                    }}
                                                  >
                                                    <td>
                                                      {ele?.BookingDate || "-"}
                                                    </td>
                                                    <td>
                                                      {ele?.LabObservationName ||
                                                        "-"}
                                                    </td>
                                                    <td>{ele?.Value || "-"}</td>
                                                    <td>
                                                      {ele?.ReadingFormat ||
                                                        "-"}
                                                    </td>
                                                    <td>
                                                      {ele?.MinValue || "-"}
                                                    </td>
                                                    <td>
                                                      {ele?.MaxValue || "-"}
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                  {/* ))} */}
                                </div>
                              </div>
                            ) : (
                              ""
                            ),
                          Flag: (
                            <ReactSelect
                              placeholderName={t("")}
                              id={"Flag"}
                              searchable={true}
                              dynamicOptions={FlagData}
                              handleChange={handleSelect}
                              respclass="ResultEntrytableinput"
                              value={val?.flag}
                              isDisabled={true}
                              name={"flag"}
                            />
                          ),
                          DetailVal: "",
                          MacReading: val.macReading,
                          ReadingFormat: val.readingFormat,
                          minValue: val.minValue,
                          maxValue: val.maxValue,
                          MachineName: val.machinename,
                          Reading1: val.reading1,
                          Reading2: val.reading2,
                          MethodName: val.method,
                          DisplayReading: val.displayReading,
                          Remarks: val.remarks,
                          colorcode: val?.colorcode,
                        };
                      }
                      return {
                        isChecked: <input type="checkbox" disabled={true} />,
                        Test: val.labObservationName,
                        VAL: (
                          <Input
                            type="text"
                            className="table-input"
                            name="Value"
                            value={val?.Value ? val?.Value : ""}
                            onChange={(e) => {
                              handleCustomInput(
                                index,
                                "Value",
                                e.target.value,
                                "text",
                                100000,
                                val?.test_ID,
                                val?.formula
                              );
                            }}
                            placeholder=" "
                            respclass="ResultEntrytableinput"
                            removeFormGroupClass={true}
                          />
                        ),
                        Comment: (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            <div>
                              <div
                                className="mx-2"
                                style={{ cursor: "pointer", fontSize: 24 }}
                                onClick={() => handleOpenModal(val, index)}
                              >
                                <IoMdAddCircleOutline />
                              </div>
                            </div>
                            <span>
                              <i className="fa fa-exclamation-triangle mx-2"></i>
                            </span>
                          </div>
                        ),
                        Flag: (
                          <ReactSelect
                            placeholderName={t("")}
                            id={"Flag"}
                            searchable={true}
                            dynamicOptions={FlagData}
                            handleChange={handleSelect}
                            respclass="ResultEntrytableinput"
                            value={val?.flag}
                            isDisabled={true}
                            name={"flag"}
                          />
                        ),
                        DetailVal: "",
                        MacReading: val.macReading,
                        ReadingFormat: val.readingFormat,
                        minValue: val.minValue,
                        maxValue: val.maxValue,
                        MachineName: val.machinename,
                        Reading1: val.reading1,
                        Reading2: val.reading2,
                        MethodName: val.method,
                        DisplayReading: val.displayReading,
                        Remarks: val.remarks,

                        colorcode: val?.colorcode,
                      };
                    }),
                  ]}
                  tableHeight={"scrollView"}
                  notSingleClick={false}
                />
              ) : (
                <div>
                  <div className="ml-2">
                    <div className="d-flex justify-content-start align-items-center flex-wrap">
                      <ReactSelect
                        placeholderName={t("Templates")}
                        id={"Templates"}
                        searchable={true}
                        removeIsClearable={true}
                        respclass="col-xl-3 col-md-4 col-sm-4 col-sm-4 col-12"
                        dynamicOptions={[
                          { value: "", label: "Select" },
                          ...handleReactSelectDropDownOptions(
                            TemplatesData,
                            "Temp_Head",
                            "Template_ID"
                          ),
                        ]}
                        handleChange={handleSelect}
                        value={`${values?.Templates}`}
                        name={"Templates"}
                      />
                      <div className="form-check d-flex align-items-center pb-1 pl-4.5">
                        <input
                          className="form-check-input col-xl-4 mt-0"
                          type="checkbox"
                          name="isNewTemplate"
                          id="isNewTemplate"
                          checked={isNewModalTemplate}
                          onChange={(e) =>
                            setIsNewModalTemplate(e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label ml-2"
                          htmlFor="isNewTemplate"
                        >
                          New Templates
                        </label>
                      </div>

                      {isNewModalTemplate ? (
                        <Input
                          type="text"
                          className="form-control"
                          id="newTemplate"
                          placeholder=""
                          name="newTemplate"
                          value={newTemplate || ""}
                          onChange={(e) => setNewTemplate(e.target.value)}
                          lable={t("Template Name")}
                          respclass="col-xl-4 col-md-4 col-sm-4 col-12"
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* {/* <div className="p-2 col-sm-12"> */}
                  <FullTextEditor
                    value={getReportTypeValue()}
                    // value={getText}
                    setValue={handleEditorValRadio}
                    EditTable={Editable}
                    setEditTable={setEditable}
                  />

                  {/* <ReactQuill
            value={getText}
            onChange={handleEditorVal}
            modules={modules}
            formats={formats}
            style={{
              marginBottom: "10px",
              height: "180px",
              backgroundClip: "#FFF",
              width: "100%",
            }}
            /> */}
                </div>
              )}

              {!showCriticalFiledByReport && (
                <TextAreaInput
                  type="text"
                  className="form-control"
                  id="findingValue"
                  placeholder=" "
                  name="findingValue"
                  value={getFIndingValue()}
                  onChange={handleChangeFinding}
                  lable={t("findingValue")}
                  respclass="col-xl-12 col-md-4 col-sm-4 col-12"
                />
              )}

              <div>
                <div className="row mt-3 mr-1  d-flex flex-wrap ml-2">
                  <div className="col-sm-1">
                    <button
                      className="previous roundarrow btn-success mx-2"
                      onClick={() => handleOpenTest("", pdata?.index - 1)}
                      disabled={pdata?.index - 1 <= 0}
                    >
                      ‹
                    </button>
                    <button
                      className="next roundarrow btn-success"
                      onClick={() => handleOpenTest("", pdata?.index + 1)}
                      disabled={pdata?.index == tbodyPatientDetail?.length}
                    >
                      {" "}
                      ›
                    </button>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={handleSave}
                    >
                      {t("Save")}
                    </button>

                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={handleSearchSampleCollection}
                    >
                      {t("Main List")}
                    </button>
                  </div>

                  {showCriticalFiledByReport ? (
                    <></>
                  ) : (
                    (console.log("tehe is critical value", testList[2]),
                      (
                        <>
                          <ReactSelect
                            placeholderName={t("IsCriticalRadiology")}
                            id={"IsCriticalRadiology"}
                            searchable={true}
                            // removeIsClearable={true}
                            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                            dynamicOptions={IsCriticalRadiology}
                            handleChange={handleIsCrititcal}
                            value={getIsCriticalRadiology()}
                            name={"IsCriticalRadiology"}
                          />
                        </>
                      ))
                  )}

                  <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect1"
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { value: "0", label: "select" },
                      ...handleReactSelectDropDownOptions(
                        bindDoctordata,
                        "Name",
                        "EmployeeID"
                      ),
                    ]}
                    handleChange={handleDoctorChange}
                    value={
                      invalidSelections["DoctorId"]
                        ? null
                        : `${testList[0]?.DoctorId || testList[2]?.pDoctorID}`
                    }
                    name="DoctorId"
                  />

                  <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect2"
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { value: "0", label: "select" },
                      ...handleReactSelectDropDownOptions(
                        bindDoctor,
                        "DoctorName",
                        "DoctorID"
                      ),
                    ]}
                    handleChange={handleDoctorChange}
                    value={
                      invalidSelections["ApprovedBy1"]
                        ? null
                        : `${testList[0]?.ApprovedBy1 || testList[2]?.approvedBy1}`
                    }
                    name="ApprovedBy1"
                  />

                  <ReactSelect
                    placeholderName={t("select doctor")}
                    id="doctorselect3"
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={[
                      { value: "0", label: "select" },
                      ...handleReactSelectDropDownOptions(
                        bindDoctor,
                        "DoctorName",
                        "DoctorID"
                      ),
                    ]}
                    handleChange={handleDoctorChange}
                    value={
                      invalidSelections["ApprovedBy2"]
                        ? null
                        : `${testList[0]?.ApprovedBy2 || testList[2]?.approvedBy2}`
                    }
                    name="ApprovedBy2"
                  />

                  {checkReportTypevalue[0]?.reportType !== 5 ? (

                    <ReactSelect
                      placeholderName={t("Test Machine")}
                      id={"MachineID"}
                      searchable={true}
                      removeIsClearable={true}
                      respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                      dynamicOptions={[
                        ...handleReactSelectDropDownOptions(
                          bindMachine,
                          "MachineName",
                          "MachineID"
                        ),
                      ]}
                      // handleChange={handleSelectDoctor}
                      handleChange={handleSelect}
                      // value={`${testList[0]?.MachineID}`}
                      name={"MachineID"}
                      value={values?.MachineID?.value || values?.MachineID}
                    />
                  ) : (<></>)}

                  <Input
                    type="text"
                    className="form-control"
                    id="serialNo"
                    removeFormGroupClass={false}
                    name="serialNo"
                    lable={t("Serial Number")}
                    required={true}
                    value={testList[2]?.serialNo || ""}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                    // onKeyDown={handleKeyDown} // Add keydown event handler
                    // inputRef={inputRef}
                    // value={value}
                    respclass="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12"
                  />

                  {!pdata?.Status?.includes("Approved", "Printed") ? (
                    <>
                      <button
                        className="btn btn-md btn-success mx-2 px-4 py-2"
                        // disabled={pdata?.Status!="Approved"}
                        type="button"
                        onClick={() => handleApprove("Approved")}
                      >
                        {t("APPROVED")}
                      </button>
                    </>
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm btn-success  p-2 "
                        disabled={
                          !pdata?.Status?.includes("Approved", "Printed")
                        }
                        type="button"
                        onClick={() =>
                          handleClickReject("Not Approved", "val", index)
                        }
                      >
                        {t("Not Approved")}
                      </button>
                    </div>
                  )}

                  {/* <button
                              className="btn btn-sm btn-success  p-2 "
                              disabled={
                                !pdata?.Status?.includes("Approved", "Printed")
                              }
                              type="button"
                              // onClick={() =>
                              //   handleNotApproveModel("Not Approved", val)
                              // }
                              // onClick={handleClickReject}
                              onClick={() =>
                                handleClickReject("Not Approved", "val", index)
                              }
                            >
                              {t("Not Approved")}
                            </button> */}

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={() => {
                      handleBindSampleinfo(pdata);
                    }}
                  >
                    {t("PATIENT DETAILS")}
                  </button>
                  {/* <span>
                    <label
                      className="d-flex align-items-center ml-3"
                      style={{ cursor: "pointer" }}
                    >
                      <Checkbox
                        id="NABH"
                        className="mt-2"
                        name="NABH"
                        onChange={(e) =>
                          handleCheckboxChange(e.target.name, e.target.checked)
                        }
                        checked={testList[0]?.NABH || false}
                      />
                      {t("NABH")}
                    </label>
                  </span>

                  <span>
                    <label
                      className="d-flex align-items-center ml-3"
                      style={{ cursor: "pointer" }}
                    >
                      <Checkbox
                        id="Hospital"
                        className="mt-2"
                        name="Hospital"
                        onChange={(e) =>
                          handleCheckboxChange(e.target.name, e.target.checked)
                        }
                        checked={testList[0]?.Hospital || false}
                      />
                      {t("Hospital")}
                    </label>
                  </span> */}

                  {/* <span>
                    <label
                      className="d-flex align-items-center ml-3"
                      style={{ cursor: "pointer" }}
                    >
                      <Checkbox
                        id="Outsource_Lab"
                        className="mt-2"
                        name="Outsource_Lab"
                        onChange={(e) =>
                          handleCheckboxChange(e.target.name, e.target.checked)
                        }
                        checked={testList[0]?.Outsource_Lab || false}
                      />
                      {t("Outsource Lab")}
                    </label>
                  </span> */}

                  {/* <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    // onClick={() => {
                    //   handleBindSampleinfo(pdata);
                    // }}
                  >
                    {t("Un Approved")}
                  </button> */}

                  <span>
                    <label
                      className="d-flex align-items-center ml-3"
                      style={{ cursor: "pointer" }}
                    >
                      <Checkbox
                        id="MarkAsView"
                        className="mt-2"
                        name="MarkAsView"
                        onChange={(e) =>
                          handleCheckboxChange(e.target.name, e.target.checked)
                        }
                        disabled={MarkAsView}
                        checked={MarkAsView}
                      />
                      {t("MarkAsView")}
                    </label>
                  </span>
                  <div className="d-flex align-items-center">
                    <label
                      className="d-flex align-items-center ml-3"
                      style={{ cursor: "pointer" }}
                    >
                      <Checkbox
                        id="showAsAmended"
                        className="mt-2"
                        name="showAsAmended"
                        onChange={(e) =>
                          setShowAmendedData({
                            ...showAmendedData,
                            showAsAmended: e.target.checked
                          })}
                        // disabled={showAsAmended}
                        checked={showAmendedData?.showAsAmended}
                      />
                      {t("Show as amended")}
                    </label>
                    {showAmendedData?.showAsAmended && (

                      <Input name="showAmendedRemark" value={showAmendedData?.showAmendedRemark} lable={t("Amended Rematks")}
                        className='form-control ml-2'
                        respclass={"col-xl-6 col-md-4 col-sm-4 col-sm-4 col-12"}
                        onChange={(e) =>
                          setShowAmendedData({
                            ...showAmendedData,
                            showAmendedRemark: e.target.value
                          })} />
                    )}
                  </div>

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={handleBindLabReport}
                  >
                    {t("PRINT PDF")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: (
                  <>
                    {index + 1}
                    {val.Urgent === "Y" && (
                      <TbUrgent
                        style={{
                          marginLeft: "4px",
                          color: "red",
                          fontWeight: "bold",
                        }}
                        size={20}
                      />
                    )}
                  </>
                ),

                TAT: val.TimeDiff,
                BillDate: val.BillDate || "",
                PatientType: val.PatientType || "",
                BarcodeNo:
                  (
                    <strong
                      className="text-primary"
                      onClick={() => handleOpenTest(val, index)}
                    >
                      {val.BarcodeNo}
                    </strong>
                  ) || "",
                UHIDno: val.UHIDno || "",
                PName: (
                  <div className={val?.MLC_NO ? "blink-red" : ""}>
                    {val.PName}
                  </div>
                ),
                Age_Gender: val.Age_Gender || "",
                Test: val.Test || "",
                Status: val.Status || "",
                Doctor: val.Doctor || "",
                Panel: val.panelname || "",
                Centre: val.Centre || "",
                TimeDiff: val.TimeDiff || "",
                Samplerequestdate: val.Samplerequestdate || "",
                DevationTime: val.DevationTime || "",
                Marked: (
                  <input
                    type="checkbox"
                    checked={val.markStatus === 1}
                    disabled={val.markStatus === 1}
                    onClick={() => handleInsufficient(val, "1")}
                  />
                ),
                UnMarked: (
                  <input
                    type="checkbox"
                    disabled={val.markStatus === 0}
                    checked={val.markStatus === 0}
                    onClick={() => handleInsufficient(val, "0")}
                  />
                ),
                IsAmendmentUnapproved:
                  val.IsAmendmentUnapproved > 0 ? (
                    <div
                      onClick={() => openModal(val)}
                      style={{ backgroundColor: "#ffc800", padding: "2%" }}
                    >
                      Amendment {val.IsAmendmentUnapproved} times{" "}
                    </div>
                  ) : (
                    <></>
                  ),
                "View Detail": (
                  <div
                    onClick={() => {
                      handleBindSampleinfo(val);
                    }}
                  >
                    <FaSearch />{" "}
                  </div>
                ),

                "View Reports": (
                  <div
                    onClick={() => handleOpenDocument(val)}
                    // onClick={() => {
                  //   handleAddFile(val, index);
                  // }}
                  >
                    {" "}
                    <FaPaperclip />
                  </div>
                ),
                "View Document": (
                  <div
                    onClick={() => {
                      handleAddFile(val, index);
                    }}
                  >
                    {" "}
                    <FaPaperclip />
                  </div>
                ),
                
                //   amendedReport: (
                //   <div
                //     onClick={() => {
                //       handleViewPdf(val, index);
                //     }}
                //   >
                //     {" "}
                //     <FaPaperclip />{" "}
                //   </div>
                // ),
                //                 amendedReport: (
                //   <div
                //     style={{ cursor: "pointer" }}
                //     onClick={() => openModal(val)}
                //   >
                //     <FaPaperclip />
                //   </div>
                // ),
                // ViewDocument: "",
                colorcode: val?.colorcode,
              }))}
              style={{ height: "55vh", padding: "2px" }}
              getRowClass={getColorByLabel}
              tableHeight={"scrollView"}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal
          modalWidth="60vw"
          visible={modalOpen}
          setVisible={closeEditorModal}
          handleAPI={handleCommentSave}
          IsCancelFlag={true}
          handleCancelComment={handleCancelComment}
        >
          <div className="d-flex justify-content-start align-items-center flex-wrap">
            <ReactSelect
              placeholderName={t("Templates")}
              id={"Templates"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-3 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { value: "", label: "Select" },
                ...handleReactSelectDropDownOptions(
                  TemplatesData,
                  "Temp_Head",
                  "Template_ID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.Templates}`}
              name={"Templates"}
            />
            <div className="form-check d-flex align-items-center pb-1 pl-4.5">
              <input
                className="form-check-input col-xl-4 mt-0"
                type="checkbox"
                name="isNewTemplate"
                id="isNewTemplate"
                checked={isNewModalTemplate}
                onChange={(e) => setIsNewModalTemplate(e.target.checked)}
              />
              <label className="form-check-label ml-2" htmlFor="isNewTemplate">
                New Templates
              </label>
            </div>

            {isNewModalTemplate ? (
              <Input
                type="text"
                className="form-control"
                id="newTemplate"
                placeholder=""
                name="newTemplate"
                value={newTemplate || ""}
                onChange={(e) => setNewTemplate(e.target.value)}
                lable={t("Template Name")}
                respclass="col-xl-4 col-md-4 col-sm-4 col-12"
              />
            ) : null}
          </div>

          <div className="p-2 col-sm-12">
            <FullTextEditor
              value={getText}
              // value={getReportTypeValue()}
              setValue={handleEditorValRadio}
              EditTable={Editable}
              setEditTable={setEditable}
            />
          </div>
        </Modal>
      )}

      <>
        {showModal && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
              <button
                style={modalStyles.closeButton}
                onClick={() => setShowModal(false)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.2)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                title="Close"
              >
                ✕
              </button>

              <h1 style={{ marginBottom: "20px", color: "#222" }}>
                📄 Amendment Reports
              </h1>

              {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
              ) : reportList.length > 0 ? (
                reportList.map((report, idx) => (
                  <div key={idx} style={modalStyles.reportItem}>
                    <span style={{ fontSize: "16px", color: "#333" }}>
                      {report.Date || `Report ${idx + 1}`}
                    </span>
                    <button
                      style={modalStyles.viewButton}
                      onClick={() => handleViewPdf(report.Report)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#0052cc")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "#0066ff")
                      }
                    >
                      View PDF
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#777" }}>
                  No reports found.
                </p>
              )}
            </div>
          </div>
        )}
      </>

      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"submit"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {/* //uguiguiguiguig */}
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
}
export default ResultEntry;
