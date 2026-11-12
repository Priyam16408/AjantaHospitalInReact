import React, { useEffect, useRef, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { FaSearch } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import moment from "moment";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
  SaveObjerrvationResutlEntry,
} from "../../utils/utils";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import {
  BindApprovedBy,
  BindAttachment,
  BindDepartmentResultEntryLab,
  BindDoctor,
  BindLabReport,
  BindMachine,
  BindSampleinfo,
  BindTestDDLlab,
  BindTestResultEntryLab,
  CommentlabObservation,
  GetCommentsDropdown,
  Getpatientlabobservationopdtext,
  helpMenu,
  HoverDeltaCheck,
  HoverHeaderresultEntry,
  LabObservationSearch,
  LabSampleRejection,
  SaveResultEntryLabdata,
  SearchResultEntryLab,
  UpdateSerialMarkViewLab
} from "../../networkServices/resultEntry";
import Tables from "../../components/UI/customTable";
import ReactQuill from "react-quill";
import {
  dynamicOptions,
  formats,
  isChecked,
  modules,
} from "../../utils/constant";
import Modal from "../../components/modalComponent/Modal";
import Input from "../../components/formComponent/Input";
import {
  GetInvCheckListMaster,
  GetPendingResultEntryPdfApi,
  PatientSearchbyBarcode,
  SaveInvItemCheckList,
} from "../../networkServices/opdserviceAPI";
import AddReportResultLab from "./AddReportResultLab";
import AddFileResultLab from "./AddFileResultLab";
import SaveButton from "../../components/UI/SaveButton";
import { RedirectURL } from "../../networkServices/PDFURL";
import TimePicker from "../../components/formComponent/TimePicker";
import axios from "axios";
import { toast } from "react-toastify";
import ResultModelRejectModel from "./ResultModelRejectModel";
import { Checkbox } from "primereact/checkbox";
import HoldRemarksModal from "./HoldRemarksModal";
import Button from "../../components/formComponent/Button";
import { UpdateStatusmark } from "../../networkServices/EDP/govindedp";
import { exportToExcel } from "../../utils/exportLibrary";
import FullTextEditor from "../../utils/TextEditor";

function ResultEntry() {
  const [departmentData, setDepartmentData] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [testList, setTestList] = useState([]);

  console.log("Test List", testList);
  const [testlistAllData, setTestlistAllData] = useState([]);

  // const [checklistCompleted, setChecklistCompleted] = useState(false);
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  const [testDetail, setTestDetail] = useState({ isOpen: false });
  const [holdRemarks, setHoldRemarks] = useState("");
  const [notApproveRemarks, setNotApproveRemarks] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [index, setIndex] = useState(null);
  const [modalData, setModalData] = useState({});
  const [patientDetail, setPatientDetails] = useState([]);
  const [bindTestLab, setBindTestLab] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const [bindDoctordata, setBindDoctor] = useState([]);
  const [bindMachine, setBindMachine] = useState([]);

  const [hovertestData, setHoverTestData] = useState([]);
  const [deltaData, setDeltaData] = useState([]);
  const [getTest, setGetText] = useState({});

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
  const [MarkAsView, setMarkAsView] = useState(false)



  const [isHovered, setIsHovered] = useState(false);
  const [isDeltaHovered, setIsDeltaHovered] = useState(false);
  const [pdata, setPdata] = useState({});

  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [helpmenu, setHelpMenu] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const myRefs = useRef([]);
  const [isDLCEnabled, setIsDLCEnabled] = useState(true);
  const ip = localStorage.getItem("ip");

  const [handleModelData, setHandleModelData] = useState({});
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status) {
      const filtered = testlistAllData.filter((item) => item.Status === status);
      if (filtered.length === 0) {
        notify("No Data Found", "warn");
      }
      console.log(filtered);
      setTbodyPatientDetail(filtered);
    } else {
      setTbodyPatientDetail(testlistAllData);
    }
  };

  const [hoveredData, setHoveredData] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    if (testList[2]?.markAsView === 1) {
      setMarkAsView(true);
    } else {
      setMarkAsView(false);
    }
    const serialNo = testList[2]?.SerialNo || testList[2]?.serialNo;
  }, [testList, testList[2]?.SerialNo, testList[2]?.serialNo]);
  // console.log(testlistAllData)

  // const handleMouseEnter = (val, index) => {
  //   clearTimeout(hoverTimeout);
  //   const filteredData = deltaData.filter((item) => item.id === val.id); // Filter relevant data
  //   setHoveredData(filteredData);
  //   setHoveredIndex(index);
  //   setIsTooltipVisible(true);
  //   handleHoverDeltaCheck(val);
  // };

  // const handleMouseLeave = () => {
  //   hoverTimeout = setTimeout(() => {
  //     setIsTooltipVisible(false);
  //     setHoveredData(null);
  //     setHoveredIndex(null);
  //   }, 200);
  // };

  const handleChangeModel = (inputData) => {
    setModalData(inputData);
  };

  const handleMouseEnter = (val, index) => {
    clearTimeout(hoverTimeout.current);
    const filteredData = deltaData.filter((item) => item.id === val.id);
    setHoveredData(filteredData);
    setHoveredIndex(index);
    setIsTooltipVisible(true);
    handleHoverDeltaCheck(val);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsTooltipVisible(false);
      setHoveredData(null);
      setHoveredIndex(null);
    }, 200);
  };

  const handleEditorVal = (value) => {
    setCommentMessage(value);
    const finalData = [...testList];
    finalData[index]["description"] = value;
    setTestList(finalData);
  };
  const handleOpenModal = (val, index) => {
    setCommentMessage(val?.description);
    setIndex(index);
    setModalOpen(true);
    handleCommentlabObservation(val);
    handleGetpatientlabobservationopdtext(val);
  };
  const handleCancelComment = () => {
    setValues({
      ...values,
      Templates: "",
    });

    setIndex(-1);
    setModalOpen(false);
    setCommentMessage("");
  };

  const handleCommentSave = (data) => {
    setValues({
      ...values,
      Templates: "",
    });

    const finalData = [...testList];
    finalData[index]["description"] = commentMessage;
    setTestList(finalData);
    setIndex(-1);
    setModalOpen(false);
    setCommentMessage("");
  };

  const handleOpenDocument = () => {
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
          pdata={pdata}
        // fileData={fileData}
        />
      ),
      // handleInsertAPI: saveDocument,
      extrabutton: <></>,
      footer: <></>,
    });
  };

  let [t] = useTranslation();

  const [buttonDisabled, setButtonDisabled] = useState();
  // checkbox logic here

  const isMobile = window.innerWidth <= 800;

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const [commentMessage, setCommentMessage] = useState("");

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

  // const getHelpMenuData = (e, labObservationId) => {
  //   if (e?.which !== 13) {
  //     setHiddenDropDownHelpMenu(true);
  //     axios
  //       .post(
  //         "https://itd2.fw.ondgni.com/HospediaAPI/api/v1/RE/getHelpMenuInvestigationWise",
  //         {
  //           InvestigationID: labObservationId,
  //         }
  //       )
  //       .then((res) => {
  //         const data  = [
  //       {
  //           "label": "Positive",
  //           "Value": 30247399,
  //           "HelpMenuBold": 0
  //       }
  //   ],
  //         setHelpMenu(res.data?.message);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };
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
    { value: "Rejected Sample", label: "Rejected Sample" },
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
    department: { value: "", label: "ALL" },
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
  });
  const [data, setData] = useState([]);
  const [Editable, setEditable] = useState(false);

  const [templatesDataview, setTemplateData] = useState([]);
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
    { width: "10%", name: t("View Detail") },
    { width: "10%", name: t("View Document") },
  ];

  const handleSelect = (name, value) => {
    if (name == "Templates") {
      setValues((val) => ({ ...val, [name]: value?.value }));

      HandleGetCommentsDropdown(value?.value ?? "");
    } else setValues((val) => ({ ...val, [name]: value }));
  };

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
    // debugger
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
        const finalMachineData = data?.map((ele) => {
          return {
            MachineID: ele?.MachineID,
            Machine: ele?.MachineID,
          };
        });
        setBindMachine(finalMachineData);
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
    let sampleColl = "";

    switch (values?.Status?.value) {
      case "All Patient":
        sampleColl = "and pli.isSampleCollected<>'N'";
        break;
      case "Pending":
        sampleColl =
          "and pli.Result_flag=0 and pli.isSampleCollected<>'N' and pli.isSampleCollected<>'R'";
        break;
      case "Sample Receive":
        sampleColl = "and pli.isSampleCollected='Y' and pli.Result_flag=0";
        break;
      case "Sample Collected":
        sampleColl = "and pli.isSampleCollected='S' and pli.Result_flag=0";
        break;

      case "Machine Data":
        sampleColl =
          "and  pli.Result_Flag='0'  and pli.isSampleCollected<>'R'  and (select count(*) from mac_data md where md.Test_ID=pli.Test_ID  and md.reading<>'')>0";
        break;

      case "Tested":
        sampleColl =
          "and pli.Result_flag=1 and pli.approved=0 and pli.ishold='0'  and pli.isSampleCollected<>'R'   -tested";
        break;

      case "Forwarded":
        sampleColl =
          "and pli.Result_flag=1 and pli.isForward=1 and pli.Approved=0  and pli.isSampleCollected<>'R'";
        break;

      case "ReRun":
        sampleColl =
          "and pli.Result_flag=0 and pli.IsTestRerun=1 and  pli.isSampleCollected<>'N'  and pli.isSampleCollected<>'R'";
        break;

      case "Approved":
        sampleColl =
          "and pli.Approved=1 and pli.isPrint=0 and pli.isSampleCollected<>'R'";
        break;

      case "Hold":
        sampleColl = "and pli.isHold='1' and pli.approved=0";
        break;

      case "Printed":
        sampleColl =
          "and pli.isPrint=1  and pli.isSampleCollected<>'R' and pli.Approved=1";
        break;

      case "Rejected Sample":
        sampleColl = "and pli.isSampleCollected='R'";
        break;

      default:
        sampleColl = "";
        break;
    }

    let payload = {
      // searchType: "",
      // searchValue: "",

      searchType: getSearchType(),
      searchValue: values.selectedInput,
      fromDate: moment(values?.fromDate).format("YYYY-MMM-DD"),
      toDate: moment(values?.toDate).format("YYYY-MMM-DD"),
      sampleColl: sampleColl,
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
  const LabObservationSearchdata = async (data) => {
    let payload = {
      labNo: data.LedgerTransactionNo,
      testID: data.Test_ID,
      ageInDays: data.AGE_in_Days,
      rangeType: "Normal",
      gender: data.Gender,
      machineID: "",
      macId: "",
    };
    try {
      const apiResp = await LabObservationSearch(payload);
      const patientDetaildata = await PatientSearchbyBarcode(data.PatientID, 1);
      setPatientDetails(patientDetaildata.data);

      if (apiResp.success) {
        const datas = apiResp?.data?.map((ele) => ({
          ...ele,
          minValue: ele?.minValue == null ? "" : ele?.minValue,
          maxValue: ele?.maxValue == null ? "" : ele?.maxValue,
          Value: ele?.value == null ? "" : ele?.value,
          isChecked: true,
          formula: ele?.formula == null ? "" : ele?.formula,
          DoctorId: "",
          MachineID: bindMachine[0]?.MachineID,
        }));

        setTestList(datas);
        console.log("sss", datas);
        // setTestlistAllData(datas);
      } else {
        setTestList([]);
        // setTestlistAllData([]);
      }
    } catch (error) {
      setTestList([]);
      // setTestlistAllData([]);
    }
  };

  // const LabObservationSearchdata = async (data) => {
  //   let payload = {
  //     labNo: data.LedgerTransactionNo,
  //     testID: data.Test_ID,
  //     ageInDays: data.AGE_in_Days,
  //     rangeType: "Normal",
  //     gender: data.Gender,
  //     machineID: "",
  //     macId: "",
  //   };
  //   try {
  //     const apiResp = await LabObservationSearch(payload);
  //     const patientDetaildata = await PatientSearchbyBarcode(data.PatientID, 1);
  //     setPatientDetails(patientDetaildata.data);
  //     if (apiResp.success) {
  //       const datas = apiResp?.data?.map((ele) => {
  //         return {
  //           ...ele,
  //           minValue: ele?.minValue == null ? "" : ele?.minValue,
  //           maxValue: ele?.maxValue == null ? "" : ele?.maxValue,
  //           Value: ele?.value == null ? "" : ele?.value,
  //           isChecked: true,
  //           formula: ele?.formula == null ? "" : ele?.formula,
  //           DoctorId: "",
  //           MachineID: bindMachine[0]?.MachineID,
  //         };
  //       });
  //       setTestList(datas);
  //      setTestlistAllData(datas);
  //     } else {
  //       setTestList([]);
  //     }
  //   } catch (error) {
  //     setTestList([]);
  //   }
  // };

  // GetCommentsDropdown
  const handleSelectDoctor = (name, value) => {
    // debugger
    const data = testList?.map((ele) => {
      return {
        ...ele,
        [name]: name == "DoctorId" ? value?.EmployeeID : value?.MachineID,
      };
    });
    setTestList(data);
  };

  const HandleGetCommentsDropdown = async (data) => {
    let payload = {
      cmntID: data,
      type: "Value",
      barcodeNo: templatesDataview?.BarcodeNo,
      testID: templatesDataview?.Test_ID,
    };
    try {
      const response = await GetCommentsDropdown(payload);
      if (response.success) {
        setCommentMessage(response?.data);
      } else {
        setCommentMessage("");
      }
    } catch (error) {
      setCommentMessage("");
    }
  };

  const handleCommentlabObservation = async (data) => {
    let payload = {
      LabObservation_ID: data?.labObservation_ID,
      Type: "Value",
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
  }, []);

  useEffect(() => {
    const isAllDone = data?.every((item) => item.IsTaken === 0);
    console.log(isAllDone);

    if (isAllDone) {
      setChecklistCompleted(true); // Don't show modal
    } else {
      setChecklistCompleted(false);
    }
  }, [data]);

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
    testName: "",
    Value: "",
    comment: "",
    flag: "",
    detailVal: "",
    MacReading: "",
    ReadingFormat: "",
    minValue: "",
    maxValue: "",
    btn: (
      <button
        className="btn btn-sm btn-success "
        type="button"
        onClick={handleOpenDocument}
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
    remarks: "",
  };
  console.log("iiiiiiiiiiiii", tblList);

  const handleOpenTest = (val, index) => {
    setIsDLCEnabled(true);

    let data = tbodyPatientDetail[index];
    setTemplateData(data);
    // debugger
    setPdata({ index: index, ...data });
    // handleCommentlabObservation(data)
    LabObservationSearchdata(data);
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
          if (
            (parseFloat(testList[i]["maxValue"]) != 0 &&
              parseFloat(testList[i]["minValue"]) != 0) ||
            parseFloat(testList[i]["maxValue"]) > 0 ||
            parseFloat(testList[i]["minValue"]) > 0 ||
            parseFloat(testList[i]["maxValue"]) < 0 ||
            parseFloat(testList[i]["minValue"] < 0)
          ) {
            if (
              parseFloat(testList[i].Value) >
              parseFloat(testList[i]["maxValue"])
            ) {
              testList[i]["flag"] = "High";
            }
            if (
              parseFloat(testList[i].Value) <
              parseFloat(testList[i]["minValue"])
            ) {
              testList[i]["flag"] = "Low";
            }

            if (
              parseFloat(testList[i].Value) >=
              parseFloat(testList[i]["minValue"]) &&
              parseFloat(testList[i].Value) <=
              parseFloat(testList[i]["maxValue"])
            ) {
              testList[i]["flag"] = "Normal";
            }
          }
          if (testList[i].Value === "") {
            testList[i]["flag"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            testList[i].Value = "";
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
      }
      if (name === "Value" && value != "") {
        if (Number(value) < Number(data[index]?.minValue)) {
          data[index]["flag"] = "Low";
        } else if (Number(value) > Number(data[index]?.maxValue)) {
          data[index]["flag"] = "High";
        } else {
          data[index]["flag"] = "Normal";
        }
      }
      // dynamicOptions = {};

      setTestList(data);
    }
    ApplyFormula(test_ID);
  };

  // Handle Save
  // const handleSave = async () => {
  //   let payload = SaveObjerrvationResutlEntry(testDetail?.detail, testList, "");
  //   try {
  //     const apiResp = await SaveResultEntryLabdata(payload);
  //     if (apiResp.success) {
  //       handleSearchSampleCollection();
  //       // setTestDetail({ isOpen: false });
  //       notify("data saved successfully", "success");
  //     } else {
  //       notify(apiResp.data.message, "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while saving data", "error");
  //   }
  // };
  const handleSave = async () => {
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

    let payload = SaveObjerrvationResutlEntry(testDetail?.detail, testList, "");

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        // handleSearchSampleCollection();
        setTestDetail({ isOpen: true });
        notify("Data saved successFully", "success");
        // LabObservationSearchdata(templatesDataview);
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data");
    }
  };
  // Handle Approve
  // const handleApprove = async () => {
  //   let payload = SaveObjerrvationResutlEntry(
  //     testDetail?.detail,
  //     testList,
  //     "Approved"
  //   );
  //   try {
  //     const apiResp = await SaveResultEntryLabdata(payload);
  //     if (apiResp.success) {
  //       handleSearchSampleCollection();
  //       setTestDetail({ isOpen: false });
  //       notify("data approved successfully", "success");
  //     } else {
  //       notify(apiResp.data.message, "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while approving data", "error");
  //   }
  // };

  // const DeltaResponse = (data) => {
  //   axiosInstance
  //     .post("RE/DeltaCheck", {
  //       TestID: data?.TestID,
  //       LabObservation_ID: data?.labObservationID,
  //     })
  //     .then((res) => {
  //       const data = res.data.message;
  //       if (data.length > 0) {
  //         setPreviousTestResult(data);
  //       } else {
  //         setPreviousTestResult([]);
  //       }
  //     })
  //     .catch((err) => {
  //
  //     });
  // };

  const DeltaResponse = async () => {
    // debugger;
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
    } else if (status == "Approved" && testList[0]?.DoctorId == "") {
      notify("Kindly Select Doctor", "error");
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

  const handleHoldRemarks = async (status) => {
    if (status?.remark === "") {
      notify("Please Enter Hold Remarks", "error");
      return;
    }
    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      testList,
      status?.status
    );
    payload.holdRemarks = status?.remark;

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setHandleModelData({ isOpen: false });
        notify("Data Hold successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while holding data", "error");
    }
  };

  const handleHold = async (status, val) => {
    setModalData({ status: status });
    setHandleModelData({
      label: t("Hold Remarks"),
      width: "30vw",
      isOpen: true,
      Component: (
        <HoldRemarksModal
          setHoldRemarks={setHoldRemarks}
          setModalData={setModalData}
          holdRemarks={holdRemarks}
        />
      ),
      extrabutton: <></>,
      buttonName: t("Save"),
      handleInsertAPI: handleHoldRemarks,

      // footer: (
      //   <>
      //     <div className="d-flex align-items-center justify-content-end">
      //       <Button
      //         name={t("Save")}
      //         className={"btn btn-sm btn-primary mx-1 btn-lg"}
      //         handleClick={()=>handleHoldRemarks(status)}
      //       />
      //     </div>
      //   </>
      // ),
    });

    const TestList = testList?.filter((ele) => ele?.test_ID == val?.test_ID);
    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      TestList,
      status
    );

    // try {
    //   const apiResp = await SaveResultEntryLabdata(payload);
    //   if (apiResp.success) {
    //     // handleSearchSampleCollection();
    //     notify("Data Hold successfully", "success");
    //     setTestDetail({ isOpen: true });
    //     LabObservationSearchdata(templatesDataview);
    //   } else {
    //     notify(apiResp.message, "error");
    //   }
    // } catch (error) {
    //   notify("An error occurred while Holding data", "error");
    // }
  };
  const [rejectReason, setRejectReason] = useState("");

  const handleNotApproveModel = async (status, val) => {
    setModalData({ status: status });
    setHandleModelData({
      label: t("Not Approve Remarks"),
      width: "30vw",
      isOpen: true,
      Component: (
        <HoldRemarksModal
          setNotApproveRemarks={setNotApproveRemarks}
          setModalData={setModalData}
          notApproveRemarks={notApproveRemarks}
        />
      ),
      extrabutton: <></>,
      buttonName: "Save",
      handleInsertAPI: handleNotApprove,
    });
    const TestList = testList?.filter((ele) => ele?.test_ID == val?.test_ID);
    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      TestList,
      status
    );
  };

  const handleNotApprove = async (status) => {
    // const TestList = testList?.filter((ele) => ele?.test_ID == val?.test_ID);
    // let payload = SaveObjerrvationResutlEntry(
    //   testDetail?.detail,
    //   TestList,
    //   status
    // );
    console.log("asdasdasdasdas", status);
    if (status?.remark === "") {
      notify("Please Enter Not Approve Remarks", "error");
      return;
    }
    let payload = SaveObjerrvationResutlEntry(
      testDetail?.detail,
      testList,
      status?.status
    );

    payload.holdRemarks = status?.remark;

    try {
      const apiResp = await SaveResultEntryLabdata(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setTestDetail({ isOpen: false });
        notify("Data Un Approved successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while Not Approving data", "error");
    }
  };

  // LabSampleRejection

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  const RejectSampleCollection = async (data) => {
    let payload = {
      rejectReason: data?.RejectReason,
      testID: pdata.Test_ID,
      ipAddress: ip,
      currentPageName: "",
    };
    try {
      const apiResp = await LabSampleRejection(payload);
      if (apiResp.success) {
        setHandleModelData((val) => ({ ...val, isOpen: false }));
        handleSearchSampleCollection();
        notify("data Reject successfully", "success");
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      notify("An error occurred while approving data", "error");
    }
  };
  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    const modifiedResponseData = HardCopy?.map((ele, index) => {
      delete ele?.TypeID;
      delete ele?.TypeName;
      delete ele?.DetailID;
      delete ele?.ColorCode;

      return { ...ele };
    });

    return modifiedResponseData;
  };

  const handleClickReject = () => {
    setHandleModelData({
      label: t("Reject Reason"),
      buttonName: t("Reject"),
      width: "30vw",
      isOpen: true,
      Component: (
        <ResultModelRejectModel
          // inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: RejectSampleCollection,
    });
  };
  const handlePrintPendingList = async (type) => {
    if (type === "excel") {
      exportToExcel(
        ExceldataFormatter(tbodyPatientDetail),
        theadPatientDetail,
        "Patient Report",
        "Summary by Department",
        true,
        "pending_list"
      );
    }
    if (type === "pdf") {
      const payload = {
        reportType: "pdf",
        labType: "OPD",
        fromDate: values.fromDate,
        toDate: values.toDate,
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

  // const handleSampleRejection = async () => {
  //   setHandleModelData({
  //     label: t("Rejected Sample"),
  //     buttonName: t("NursingWard.SampleCollection.upload"),
  //     width: "40vw",
  //     isOpen: true,
  //     Component: (
  //       <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
  //         <Input
  //           type="text"
  //           className="form-control"
  //           id="reason"
  //           name="reason"
  //           value={values?.reason}
  //           onChange={handleChange}
  //           lable="Rejected Reason"
  //           respclass="col-xl-8 col-md-4 col-sm-4 col-12"
  //         />
  //         <div className="ftr_btn mb-4">
  //           <SaveButton btnName={"Submit"} onClick={handleReject} />
  //         </div>
  //       </div>
  //     ),
  //     // handleInsertAPI: saveDocument,
  //     extrabutton: <></>,
  //     footer: <></>,
  //   });
  // };

  // const handleAllCheckBoxResult = (e, val) => {
  //   const filterData = testList?.map((ele) => {
  //     return {
  //       ...ele,
  //       isChecked:  !ele.isChecked
  //     };
  //   });

  //   setTestList(filterData);

  // };

  const handleCheckBoxResult = (e, val) => {
    const filterData = testList?.map((ele) => {
      return {
        ...ele,
        isChecked:
          ele.investigation_ID == val.investigation_ID
            ? !ele.isChecked
            : ele.isChecked,
      };
    });

    setTestList(filterData);
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
              lable={t("Department")}
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
              // tbody={[{  name:  data.name ,sampleDeawn:data.SampleReceivedBy,
              //   collectiondate:data.SegratedDate,collectedby:data.SampleCollector,reviveddate:data.SampleReceiveDate
              //   ,recievedBy:data.SampleReceivedBy,rejectdate:data.RejectDate,rejectedBy:"",readingone:"",samplerejected:data.SegratedDate
              //   ,resultenteredDate:"",resultenteredBy:data.ResultEnteredName,approveddate:data.ApprovedDate,
              //   approvedBy:data.ApprovedDoneBy,holdBy:data.holdByName,holdReason:data.Hold_Reason
              //  }]}
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      ),
      extrabutton: <></>,
      footer: <></>,
    });
  };

  const [pdfSrc, setPdfSrc] = useState(null);
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

  const handleCheckboxChange = async (name, checked) => {

    setMarkAsView(checked)
    try {
      const payload = {
        testId: testList[0].test_ID,
        serialNo: testList[2].SerialNo || testList[2].serialNo,
        markAsView: checked ? 1 : 0
      }
      const resp = await UpdateSerialMarkViewLab(payload);
      console.log(resp);

    } catch (error) {
      console.log(error);

    }
  };

  // const handleBindLabReport = async () => {

  //   const payload = {
  //     testID: pdata.Test_ID,
  //     isOnlinePrint: "1",
  //     isConversion: "",
  //     isNabl: "0",
  //     orderBy: "",
  //     labType: "1",
  //     ipAddress: ip,
  //     isPrev: true,
  //   };

  //   try {
  //     const apiResp = await BindLabReport(payload);
  //     if (apiResp?.success === false) {
  //       notify("No records found", "error");
  //     } else {
  //       RedirectURL(apiResp?.data?.value?.pdfUrl);
  //     }
  //   } catch (error) {
  //     notify("An error occurred while fetching data", "error");
  //   }
  // };

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
      serial: testList[2].serialNo,
    };

    try {
      const apiResp = await BindLabReport(payload);
      console.log(apiResp);

      if (!apiResp?.success || !apiResp?.data) {
        notify("No records found", "error");
        return;
      } else if (apiResp?.message == "0") {
        RedirectURL(apiResp?.data?.value?.pdfUrl);
        return;
      }

      const htmlString = apiResp.data; // API returns an HTML string

      // Extract the Base64 PDF URL from the iframe
      const match = htmlString.match(
        /<iframe[^>]+src=['"](data:application\/pdf;base64,[^'"]+)['"]/
      );

      if (match && match[1]) {
        const pdfSrc = match[1]; // Extracted PDF Base64 URL

        // Open the PDF in a new tab
        const newTab = window.open();
        newTab.document.write(
          `<iframe src="${pdfSrc}" width="100%" height="100%" style="border:none;"></iframe>`
        );
      } else {
        notify("Failed to extract PDF", "error");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      notify("An error occurred while fetching data", "error");
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
        return "#FF0000";
      default:
        return "white";
    }
  };

  const handleMarkUnMarked = async (data, status) => {
    const payload = {
      markStatus: status,
      BarCode: data?.BarcodeNo,
      testId: data?.Test_ID,
    };

    try {
      const apiResp = await UpdateStatusmark(payload);
      if (apiResp.success) {
        notify("Data marked successfully", "success");
        handleSearchSampleCollection();
      } else {
        notify(apiResp.message, "error");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
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
      console.log(firstKey, firstMessage);
      notify(`Row ${firstKey.split()} ${firstMessage}`, "warn");

    }
  };

  const handleInputChange = (name, value) => {
    // debugger
    const updatedList = testList.map((item) => ({
      ...item,
      [name]: value,
    }));
    setTestList(updatedList);
  };

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
                  <button onClick={handleSaveCheckComplete} className="btn btn-primary">Save</button>
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

                  {/* <DatePicker
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
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    handleChange={handleChange}
                  /> */}
                  <DatePicker
                    id="fromDate"
                    className="custom-calendar"
                    name="fromDate"
                    lable={t("FromDate")}
                    value={values?.fromDate || new Date()}
                    handleChange={handleChange}
                    placeholder={VITE_DATE_FORMAT}
                    respclass={"col-xl-2 col-md-4 col-sm-8 col-12"}
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
                    respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
                    maxDate={new Date()}
                  />
                  <TimePicker
                    placeholderName="To Time"
                    lable={t("To Time")}
                    id="toTime"
                    name="toTime"
                    value={values?.toTime}
                    respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    handleChange={handleChange}
                  />
                  {/* <ReactSelect
                <DatePicker
                  className="custom-calendar"
                  id="toDate"
                  name="toDate"
                  value={values?.toDate || new Date()}
                  handleChange={handleChange}
                  lable={t("ToDate")}
                  placeholder={VITE_DATE_FORMAT}
                  respclass={"col-xl-2 col-md-4 col-sm-8 col-12"}
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
                {/* <ReactSelect
                placeholderName={t("Test")}
                id={"Test"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  ...reactSelectOptionList(testData, "testname", "testid"),
                ]}
                handleChange={handleSelect}
                value={`${values?.Test?.value}`}
                name={"Test"}
              />
              */}
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

                  <div className="col-sm-2 col-xl-2">
                    <button
                      className="btn btn-sm btn-success w-100"
                      type="button"
                      onClick={handleSearchSampleCollection}
                    >
                      {t("Search")}
                    </button>
                  </div>
                  {values?.Status?.value === "Pending" &&
                    tbodyPatientDetail?.length > 0 && (
                      <div className="d-flex align-items-center pl-3">
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
                          console.log("Received");
                        }}
                      />
                      <ColorCodingSearch
                        label={t("Insufficient")}
                        color="#FF6347"
                        onClick={() => {
                          handleStatusChange("Insufficinet");
                          console.log("Insufficinet");
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
                  <div>
                    <strong>{patientDetail.DateEnrolled} 08:34 pm</strong>
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
                            <th>Booking Date</th>
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
              {console.log("ttttttttttt", testList)}
              <Tables
                thead={theadDetails}
                tbody={[
                  tblList,
                  ...testList.map((val, index) => {
                    if (val.inv === "3") {
                      return {
                        isChecked: "",
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
                            onClick={(e) => handleCheckBoxResult(e, val)}
                          />
                        ),
                        Test: (
                          <div>
                            <span style={{ color: "red", fontWeight: "bold" }}>
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
                              onClick={() => handleHold("UnHold", val)}
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
                              !pdata?.Status?.includes("Approved", "Printed")
                            }
                            type="button"
                            onClick={() =>
                              handleNotApproveModel("Not Approved", val)
                            }
                          >
                            {t("Not Approve")}
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
                      // Render the row with `Test` in red and bold
                      return {
                        isChecked: "",
                        Test: (
                          <div>
                            <span>{val.labObservationName}</span>
                          </div>
                        ),
                        VAL: (
                          <div style={{ padding: 2 }}>
                            <Input
                              type="text"
                              className="table-input"
                              name="value"
                              value={val?.value ? val?.value : ""}
                              onChange={(e) => {
                                handleCustomInput(
                                  index,
                                  "value",
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
                          </div>
                        ),
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
                        MachineName: val.machinename,
                        Reading1: val.reading1,
                        Reading2: val.reading2,
                        MethodName: val.method,
                        DisplayReading: val.displayReading,
                        Remarks: val.remarks,
                      };
                    } else if (val.inv === null) {
                      // Render all keys in a row
                      return {
                        isChecked: (
                          <input
                            type="checkbox"
                            checked={val.isChecked}
                            disabled={true}
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
                                  // onChange={handleChange}
                                  placeholder=" "
                                  respclass="ResultEntrytableinput"
                                  removeFormGroupClass={true}
                                />

                                {helpmenu.length > 0 &&
                                  helpmenu[0]?.Value ==
                                  val?.labObservation_ID &&
                                  HiddenDropDownHelpMenu && (
                                    <ul
                                      className={"suggestion-data-help"}
                                      style={{
                                        width: "100%",
                                        position: "absolute",
                                        right: "0px",
                                        border: "1px solid #dddfeb",
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
                                          className={`${helpmenuindex === indexMatch &&
                                            "matchIndex"
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
                                              {deltaData?.map((ele, index) => (
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
                                                    {ele?.ReadingFormat || "-"}
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
                    };
                  }),
                ]}
                tableHeight={"scrollView"}
              />

              <div>
                <div className="row mt-3 mr-1  d-flex flex-wrap">
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

                  {/* <ReactSelect
                    placeholderName={t("select doctor")}
                    id={"doctorselect"}
                    searchable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    handleChange={handleSelect}
                    name={"doctorselect"}
                  /> */}

                  <ReactSelect
                    placeholderName={t("select doctor")}
                    id={"doctorselect"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={[
                      ...handleReactSelectDropDownOptions(
                        bindDoctordata,
                        "Name",
                        "EmployeeID"
                      ),
                    ]}
                    handleChange={handleSelectDoctor}
                    value={`${testDetail[0]?.DoctorId}`}
                    name={"DoctorId"}
                  />

                  <ReactSelect
                    placeholderName={t("Test Machine")}
                    id={"MachineID"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                    dynamicOptions={[
                      ...handleReactSelectDropDownOptions(
                        bindMachine,
                        "Machine",
                        "MachineID"
                      ),
                    ]}
                    handleChange={handleSelectDoctor}
                    value={`${testDetail[0]?.MachineID}`}
                    name={"MachineID"}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="serialNo"
                    removeFormGroupClass={false}
                    name="serialNo"
                    lable={t("Serial Number")}
                    required={true}
                    value={testList[2]?.serialNo}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                    // onKeyDown={handleKeyDown} // Add keydown event handler
                    // inputRef={inputRef}
                    // value={value}
                    respclass="col-xl-1 col-md-4 col-sm-4 col-sm-4 col-12"
                  />



                  {/* <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={handleSearchSampleCollection}
                  >
                    {t("Preview")}
                  </button> */}

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    // disabled={pdata?.Status!="Approved"}

                    type="button"
                    onClick={() => handleApprove("Approved")}
                  >
                    {t("Approve")}
                  </button>

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={() => {
                      handleClickReject();
                    }}
                  >
                    {t("Reject")}
                  </button>

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={() => {
                      handleBindSampleinfo(pdata);
                    }}
                  >
                    {t("Patient Details")}
                  </button>

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
                        checked={MarkAsView}
                      />
                      {t("MarkAsView")}
                    </label>
                  </span>

                  {/* <span>
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
                  </span>

                  <span>
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

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={handleBindLabReport}
                  >
                    {t("Print PDF")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
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
                // PName: val.PName || "",
                PName: (
                  <div
                    className={val?.Admission_Type == "14" ? "blink-red" : ""}
                  >
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
                    onClick={() => handleMarkUnMarked(val, "1")}
                  />
                ),
                UnMarked: (
                  <input
                    type="checkbox"
                    disabled={val.markStatus === 0}
                    checked={val.markStatus === 0}
                    onClick={() => handleMarkUnMarked(val, "0")}
                  />
                ),
                DevationTimee: (
                  <div
                    onClick={() => {
                      handleBindSampleinfo(val);
                    }}
                  >
                    <FaSearch />{" "}
                  </div>
                ),

                Detail: (
                  <div
                    onClick={() => {
                      handleAddFile(val, index);
                    }}
                  >
                    {" "}
                    <FaPaperclip />{" "}
                  </div>
                ),
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
          setVisible={setModalOpen}
          handleAPI={handleCommentSave}
          IsCancelFlag={true}
          handleCancelComment={handleCancelComment}
        >
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
          {/* <ReactQuill
            value={commentMessage}
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
          <FullTextEditor
            value={commentMessage}
            // value={getTest}
            setValue={handleEditorVal}
            EditTable={Editable}
            setEditTable={setEditable}
          />
        </Modal>
      )}

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
