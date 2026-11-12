import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddFileResultLab from "../../ResultEntry/AddFileResultLab";
import {
  BindApprovedBy,
  BindDepartmentResultEntryLab,
  BindLabReport,
  BindobsAntibiotic,
  BindOrganism,
  BindSampleinfo,
  BindTestDDLlab,
  BindTestResultEntryLab,
  CommentlabObservation,
  CultureLabObservationSearchs,
  GetCommentsDropdown,
  Getpatientlabobservationopdtext,
  GetReportPrintCulture,
  PatientSearchMachineResults,
  SaveCultureObservationOpdDatas,
} from "../../../networkServices/resultEntry";
import { PatientSearchbyBarcode } from "../../../networkServices/opdserviceAPI";
import {
  handleReactSelectDropDownOptions,
  notify,
  reactSelectOptionList,
  SaveLabObservationCultureOpdData,
} from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import Input from "../../../components/formComponent/Input";
import ReactQuill from "react-quill";
import Modal from "../../../components/modalComponent/Modal";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { FaPaperclip } from "react-icons/fa";
import AddReportResultLab from "../../ResultEntry/AddReportResultLab";
import { formats, modules } from "../../../utils/constant";
import ResultEntryCultureReasonModal from "./ResultEntryCultureReasonModal";
import ResultEntryCultureUnApprovedModal from "./ResultEntryCultureUnApprovedModal";
import TimePicker from "../../../components/formComponent/TimePicker";
import CustomLabTable from "../../../components/UI/customTable/CustomLabTable";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { RedirectURL } from "../../../networkServices/PDFURL";
import FullTextEditor from "../../../utils/TextEditor";

function ResultEntryCulture() {
  const [departmentData, setDepartmentData] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [testList, setTestList] = useState([]);
  const [testDetail, setTestDetail] = useState({ isOpen: false });
  const [modalOpen, setModalOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [index, setIndex] = useState(null);
  const [modalData, setModalData] = useState({});
  const [patientDetail, setPatientDetails] = useState([]);
  const [bindTestLab, setBindTestLab] = useState([]);
  const [testData, setTestData] = useState([]);
  const [pdata, setPdata] = useState([]);
  const ip = localStorage.getItem("ip");
  const [bindOrganism, setBindOrganism] = useState([]);
  const [entry, setEntry] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});

  const [templatesDataview, setTemplateData] = useState([]);
  const [bindDoctordata, setBindDoctor] = useState([]);
  const [Editable, setEditable] = useState(false);


  const [TemplatesData, setTemplatesData] = useState([]);
  const [commentMessage, setCommentMessage] = useState("");
  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };



  // const handleEditorVal = (value) => {
  //   setEditorValue(value);
  // };
  const handleEditorVal = (value) => {
    setCommentMessage(value);
    const finalData = [...testList];
    finalData[index]["description"] = value;
    setTestList(finalData);
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

  const handleOpenModal = (val, index) => {
    setCommentMessage(val?.description);
    // setCommentMessage(getTest)
    setIndex(index);
    setModalOpen(true);
    // HandleGetCommentsDropdown("");
    handleCommentlabObservation(val);
    handleGetpatientlabobservationopdtext(val);
  };

  const handleAddFile = (val) => {
    setHandleModelData({
      label: t("NursingWard.SampleCollection.AddFile"),
      buttonName: t("NursingWard.SampleCollection.upload"),
      width: "40vw",
      isOpen: true,
      Component: (
        <AddFileResultLab
          handleChangeModel={handleChangeModel}
          patientDetail={patientDetail}
          bindTestLab={bindTestLab}
          testDetail={testDetail}
          tbodyPatientDetail={tbodyPatientDetail}
          val={val}
        />
      ),
      extrabutton: <></>,
      footer: <></>,
    });
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
        />
      ),
      // handleInsertAPI: saveDocument,
      extrabutton: <></>,
      footer: <></>,
    });
  };

  let [t] = useTranslation();

  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const { VITE_DATE_FORMAT } = import.meta.env;
  const Status = [
    { value: "All", label: "All Patient" },
    { value: "Pending", label: "Pending" },
    { value: "Sample Collected", label: "Sample COllected" },
    { value: "Sample Receive", label: "Sample Receive" },
    { value: "Machine Data", label: "Machine Data" },
    { value: "Tested", label: "Tested" },
    { value: "Forwarded", label: "Forwarded" },
    { value: "ReRun", label: "ReRun" },
    { value: "Approved", label: "Approved" },
    { value: "Hold", label: "Hold" },
    { value: "Printed", label: "Printed" },
  ];

  const selectInput = [
    { value: "0", label: "Barcode No" },
    { value: "1", label: "UHID NO" },
    { value: "2", label: "Patient Name" },
  ];

  const [values, setValues] = useState({
    reportType: { value: "Preliminary 1", label: "Preliminary 1" },
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
    Value: "",
    doctorselect: "",
    Templates: "",
  });

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Reg Date") },
    { width: "15%", name: t("Barcode No") },
    { width: "10%", name: t("UHID No") },
    { width: "15%", name: t("Patient Name") },
    { width: "15%", name: t("Age/Sex") },
    { width: "10%", name: t("Tests") },
    { width: "10%", name: t("Status") },
    { width: "10%", name: t("Attachement") },
    { width: "10%", name: t("Print") },
  ];

  const handleSelect = (name, value) => {
    if (name == "reportType") {
      LabObservationSearchdata(pdata, value?.value);
      setValues((val) => ({ ...val, [name]: value }));
    } else if (name == "Templates") {
      setValues((val) => ({ ...val, [name]: value?.value }));

      HandleGetCommentsDropdown(value?.value ?? "");
    } else setValues((val) => ({ ...val, [name]: value }));
  };

  const theadDetails = [
    { width: "5%", name: t("TEST") },
    { width: "5%", name: t("Value") },
    { width: "5%", name: t("Unit") },
    { width: "5%", name: t("Comment") },
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

  const hanldeBindOrganism = async () => {
    try {
      const response = await BindOrganism();
      if (response.success) {
        setBindOrganism(response.data);
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

  // BindobsAntibiotic
  // console.log(bindOrganism)
  const getOrganimseName = (data, data1) => {
    setEntryShow(true);
    let id = data.split(",").map(Number);
    if (id !== "") {
      let filteredId = bindOrganism.filter((item) => id.includes(item.id));
      filteredId.forEach((entry) => {
        handleBindobsAntibiotic(entry.id, entry.name, data1);
      });
    }
  };

  console.log(entry);

  const handleBindobsAntibiotic = async (id, name, data1) => {
    const payload = {
      obid: id,
      obname: name,
      testid: data1?.Test_ID,
      barcodeno: data1?.BarcodeNo,
      reportnumber: values?.reportType?.value,
    };

    try {
      const apiResp = await BindobsAntibiotic(payload);

      if (apiResp.success) {
        let data = apiResp?.data;
        data = data.map((item, index) => {
          return {
            ...item,
            index: index,
            AntiBioticInterpreatation: item?.VALUE,
            isInput: false,
          };
        });
        setEntryShow(true);
        setEntry((prev) => [...prev, data]);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  const BindTestDDLlabData = async (data) => {
    // console.log("the bindTest lab data is in ", data);
    const params = {
      LedgerTransactionNo: String(data.LedgerTransactionNo),
      TestID: String(data.Test_ID),
    };
    // console.log(data.LedgerTransactionNo, data.Test_ID);
    try {
      const response = await BindTestDDLlab(params);
      if (response.success) {
        setBindTestLab(response.data);
        // console.log("the bindTestLab data is", bindTestLab);
      } else {
        setBindTestLab([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindTestLab([]);
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
          "and pli.CultureStatus='Incubation' and pli.Result_flag=0  and pli.isSampleCollected<>'N'  and pli.isSampleCollected<>'R'";
        break;
      case "Sample Receive":
        sampleColl = "and pli.isSampleCollected='S' and pli.Result_flag=0";
        break;
      case "Sample Collected":
        sampleColl = "and pli.isSampleCollected='Y' and pli.Result_flag=0";
        break;

      case "Machine Data":
        sampleColl =
          "and  pli.Result_Flag='0'  and pli.isSampleCollected<>'R'  and (select count(*) from mac_data md where md.Test_ID=pli.Test_ID  and md.reading<>'')>0";
        break;

      case "Tested":
        sampleColl =
          "and pli.Result_flag=1 and pli.approved=0 and pli.ishold='0'   and pli.isSampleCollected<>'R'";
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
        sampleColl = "and pli.isHold='1'";
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
    const payload = {
      searchType: getSearchType(),
      searchValue: values.selectedInput,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      centreID: "ALL",
      sampleCollectionStatus: sampleColl,
      department: values?.department?.value,
      machineID: values?.Machine?.value,
      zsm: "",
      timeFrom: values?.fromTime,
      timeTo: values?.toTime,
      isUrgent: values?.TestType?.value || "",
      investigationId: values?.Test?.value || "",
      panelId: "",
      sampleStatusText: values?.Status?.value || "All Patient",
      remarks: "",
      comments: "",
      reportType: "",
    };

    try {
      setTestDetail({ isOpen: false });
      const apiResp = await PatientSearchMachineResults(payload);

      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return {
            ...val,
            isChecked: false,
            colorcode: getColorByLabel(val.Status),
          };
        });
        console.log(data);
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

  const selectReportType = [
    { value: "Preliminary 1", label: "Preliminary 1" },
    { value: "Preliminary 2", label: "Preliminary 2" },
    { value: "Preliminary 3", label: "Preliminary 3" },
    { value: "Final Report", label: "Final Report" },
  ];
  const [entryShow, setEntryShow] = useState(false);
  const LabObservationSearchdata = async (data, reportNumber) => {
    setEntry([]);
    console.log(data);
    let payload = {
      labNo: data?.LedgerTransactionNo,
      testID: data?.Test_ID,
      ageInDays: data?.AGE_in_Days,
      rangeType: data?.Urgent,
      gender: data?.Gender,
      machineID: "ALL",
      macId: "",
      reportNumber: reportNumber,
    };
    try {
      const apiResp = await CultureLabObservationSearchs(payload);

      const patientDetaildata = await PatientSearchbyBarcode(data.PatientID, 1);
      setPatientDetails(patientDetaildata.data);
      if (apiResp.success) {
        // console.log(data)
        apiResp?.data[0]?.micro != "" &&
          getOrganimseName(apiResp?.data[0]?.micro, data);
        setTestList(apiResp?.data);
        // console.log("the laboversation search data is", apiResp?.data);
      } else {
        setTestList([]);
      }
    } catch (error) {
      setTestList([]);
    }
  };

  const handleSelectDoctor = (name, value) => {
    const data = testList?.map((ele) => {
      return {
        ...ele,
        [name]: name == "DoctorId" ? value?.EmployeeID : value?.MachineID,
      };
    });
    setTestList(data);
  };
  // console.log(testList);


  const getColorByLabel = (label) => {
    switch (label) {
      case t("Collected"):
        return "#CC99FF";
      case t("Pending"):
        return "bisque";
      case t("MacData"):
        return "#FF0000";
      case t("Tested"):
        return "#a2b4da";
      case t("Rerun"):
        return "#daa2da";
      case t("Forward"):
        return "#3399FF";
      case t("Approved"):
        return "#90EE90";
      case t("Printed"):
        return "#00FFFF";
      case t("Hold"):
        return "#FFFF00";
      case t("Received"):
        return "lightblue";
      default:
        return "white";
    }
  };

  const handleOpenTest = (val, index) => {
    let data = tbodyPatientDetail[index];
    setTemplateData(data);
    setPdata({ index: index, ...data });
    LabObservationSearchdata(data, "Preliminary 1");
    BindTestDDLlabData(data);
    setTestDetail({ isOpen: true, detail: data });
  };

  const handleSave = async (status) => {
    let payload = SaveLabObservationCultureOpdData(
      testList,
      values,
      entry,
      pdata,
      values?.reportType?.value,
      status
    );
    try {
      const apiResp = await SaveCultureObservationOpdDatas(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setEntryShow(false);
        setEntry([]);
        setTestDetail({ isOpen: false });
        notify("data saved successfully", "success");
      } else {
        notify(apiResp.data.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleApprove = async (status) => {

    if (pdata?.Status == "Approved" || pdata?.Status === "Printed") {
      notify("This Test is Approved", "error");
    } else if (status == "Approved" && testList[0]?.DoctorId == "") {
      notify("Kindly Select Doctor", "error");
    }
    else {
      let payload = SaveLabObservationCultureOpdData(
        testList,
        values,
        entry,
        pdata,
        values?.reportType?.value,
        status
      );
      try {
        const apiResp = await SaveCultureObservationOpdDatas(payload);
        if (apiResp.success) {
          handleSearchSampleCollection();
          setEntryShow(false);
          setEntry([]);
          setTestDetail({ isOpen: false });
          notify("data Approved SuccessFully", "success");
        } else {
          notify(apiResp.data.message, "error");
        }
      } catch (error) {
        notify("An error occurred while saving data", "error");
      }
    }
  };

  const handleChangeRejectModel = (data) => {
    setModalData(data);
  };

  // Hold

  const handleHold = async (data) => {
    let payload = SaveLabObservationCultureOpdData(
      testList,
      values,
      entry,
      pdata,
      values?.reportType?.value,
      "Hold"
    );

    try {
      const apiResp = await SaveCultureObservationOpdDatas(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setHandleModelData({ isOpen: false });
        notify("data approved successfully", "success");
      } else {
        notify(apiResp.data.message, "warn");
      }
    } catch (error) {
      notify("An error occurred while approving data", "error");
    }
  };


  const handleUnHold = async (status) => {

    let payload = SaveLabObservationCultureOpdData(
      testList,
      values,
      entry,
      pdata,
      values?.reportType?.value,
      status
    );
    try {
      const apiResp = await SaveCultureObservationOpdDatas(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setEntryShow(false);
        setEntry([]);
        setTestDetail({ isOpen: false });
        notify("data Approved SuccessFully", "success");
      } else {
        notify(apiResp.data.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };


  const handleHoldModal = (item) => {
    setHandleModelData({
      label: t("Hold Remars Reason"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <ResultEntryCultureReasonModal
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleHold,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  // UnApproved

  const handleReject = async (data) => {
    let payload = SaveLabObservationCultureOpdData(
      testList,
      values,
      entry,
      pdata,
      values?.reportType?.value,
      "Not Approved"
    );

    try {
      const apiResp = await SaveCultureObservationOpdDatas(payload);
      if (apiResp.success) {
        handleSearchSampleCollection();
        setHandleModelData({ isOpen: false });
        // setHandleModelData((val) => ({ ...val, isOpen: false }));
        setIshold(true);
        notify("data approved successfully", "success");
      } else {
        notify(apiResp.data.message, "error");
      }
    } catch (error) {
      notify("An error occurred while approving data", "error");
    }
  };

  // const handleReject = async (status) => {
  //   // let payload = SaveLabObservationCultureOpdData(
  //   //   testList,
  //   //   "Not Approved",
  //   //   data?.unApprovedRemarks
  //   // );

  //   let payload = SaveLabObservationCultureOpdData(
  //     testList,
  //     values,
  //     entry,
  //     pdata,
  //     values?.reportType?.value,
  //     status,  
  //   );
  //   try {
  //     const apiResp = await SaveCultureObservationOpdDatas(payload);
  //     if (apiResp.success) {
  //       handleSearchSampleCollection();
  //       setIsApproved(false);
  //       setHandleModelData({ isOpen: true });
  //       setHandleModelData((val) => ({ ...val, isOpen: false }));
  //       notify("data UnApproved successfully", "success");
  //     } else {
  //       notify(apiResp.data.message, "error");
  //     }
  //   } catch (error) {
  //     notify("An error occurred while approving data", "error");
  //   }
  // };

  const handleUnApproved = (item) => {
    setHandleModelData({
      label: t("Un Approved Remarks"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <ResultEntryCultureUnApprovedModal
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleReject,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  // LabSampleRejection
  const Sensitivity = [
    { value: "Sensitive", label: "Sensitive" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Resistant", label: "Resistant" },
  ];

  // Static data for 'entry' (list of antibiotic entries)

  // Static options for organism selection
  // const bindOrganism = [
  //   { value: "organism1", label: "Escherichia coli" },
  //   { value: "organism2", label: "Staphylococcus aureus" },
  //   { value: "organism3", label: "Pseudomonas aeruginosa" },
  // ];

  // Static function for handling filtering of organism at specific index (you may adapt this logic)
  function addItemAtIndex(outerIndex) {
    const newEntry = [...entry];
    const newItem = {
      ...newEntry[outerIndex][0],
      name: "",
      index: newEntry[outerIndex]?.length + 1,
      id: "0",
      isInput: true,
      AntiBioticInterpreatation: "",
      mic: "",
    };
    newEntry[outerIndex] = [...newEntry[outerIndex], newItem];
    setEntry(newEntry);
  }
  const handleFilterOrg = (outerIndex, innerIndex) => {
    const updatedEntry = [...entry];
    updatedEntry[outerIndex] = [...updatedEntry[outerIndex]];
    updatedEntry[outerIndex].splice(innerIndex, 1);
    setEntry(updatedEntry);
  };

  const removeArrayAtIndex = (index) => {
    const newData = [...entry];
    newData.splice(index, 1);
    setEntry(newData);
  };
  const handleSensitivity = (value, outerIndex, innerIndex, name) => {
    const newEntry = [...entry];
    newEntry[outerIndex][innerIndex][name] = value;
    setEntry(newEntry);
  };
  function setValuesForOuterIndex(outerIndex, name, value) {
    const newEntry = [...entry];
    newEntry[outerIndex] = newEntry[outerIndex].map((item) => {
      return {
        ...item,
        [name]: value,
      };
    });
    setEntry(newEntry);
  }

  const handleChangeModel = (inputData) => {
    setModalData(inputData);
  };

  const handleSetModalData = (data) => {
    // console.log("the value in data is", data);
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
              placeholder=""
              // value={data?.LedgerTransactionNo || ""}
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
              tableHeight={"scrollView"}
            />
          </div>
        </div>
      ),
      extrabutton: <></>,
      footer: <></>,
    });
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

  const handleCancelComment = () => {
    setValues({
      ...values,
      Templates: "",
    });

    setIndex(-1);
    setModalOpen(false);
    setCommentMessage("");
  };

  const handleBindSampleinfo = async (val) => {
    // LabObservationSearchdata();
    // console.log("the ledgerTransactionNo is", val?.LedgerTransactionNo);
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
  // console.log(pdata)
  // console.log(testList)
  const handleBindLabReport = async () => {
    const payload = {
      "testID": pdata.Test_ID,
      "isOnlinePrint": "1",
      "reportNumber": ""
    };

    try {
      const apiResp = await GetReportPrintCulture(payload);
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        // console.log("the pdf Url link is", apiResp?.pdfUrl);
        RedirectURL(apiResp?.data?.value?.pdfUrl);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
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




  useEffect(() => {
    BindTestDDLlabData();
    fetchTestData();
    handleBindApprovedBy();
    fetchDepartmentData();
    hanldeBindOrganism();
  }, []);



  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading title={t("heading")} isBreadcrumb={true} />

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
                  { value: "0", label: "ALL" },
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
              />

              <DatePicker
                // className="custom-calendar"
                id="toDate"
                name="toDate"
                value={values?.toDate || new Date()}
                handleChange={handleChange}
                lable={t("ToDate")}
                placeholder={VITE_DATE_FORMAT}
                respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
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

              <ReactSelect
                placeholderName={t("Test")}
                id={"Test"}
                searchable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={[
                  ...reactSelectOptionList(testData, "testname", "testid"),
                ]}
                handleChange={handleSelect}
                value={`${values?.testData?.value}`}
                name={"Test"}
              />

              <div className="col-sm-2 col-xl-2">
                <button
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={handleSearchSampleCollection}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
            {/* Color Coding Section */}
            <Heading
              title=""
              isBreadcrumb={false}
              secondTitle={
                <>
                  <ColorCodingSearch label={t("Collected")} color="#CC99FF" />
                  <ColorCodingSearch label={t("Pending")} color="bisque" />
                  <ColorCodingSearch label={t("MacData")} color="#FF0000" />
                  <ColorCodingSearch label={t("Tested")} color="#a2b4da" />
                  <ColorCodingSearch label={t("Rerun")} color="#daa2da" />
                  <ColorCodingSearch label={t("Forward")} color="#3399FF" />
                  <ColorCodingSearch label={t("Approved")} color="#90EE90" />
                  <ColorCodingSearch label={t("Printed")} color="#00FFFF" />
                  <ColorCodingSearch label={t("Hold")} color="#FFFF00" />
                </>
              }
            />
          </div>
        )}

        {/* {console.log(testDetail)} */}
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
                    <strong>{patientDetail.Age}</strong>
                  </div>
                  <div>
                    <strong>{patientDetail.Gender}</strong>
                  </div>

                  <div>
                    <strong>{patientDetail.DateEnrolled}</strong>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id="reportType"
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-4 col-md-4 col-sm-4 col-sm-4 col-12 mt-2"
                    dynamicOptions={selectReportType}
                    handleChange={handleSelect}
                    value={`${values?.reportType?.value}`}
                    name="reportType"
                  />
                  <Tables
                    thead={theadDetails}
                    tbody={[
                      ...testList.map((val, index) => {
                        if (val.inv === 3) {
                          return {
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

                            value: "",
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 1 && val?.priorty == 0) {
                          return {
                            Test: (
                              <div>
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {val.labObservationName}
                                </span>
                              </div>
                            ),
                            value: "",
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 0 && val?.priorty == 0) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 0 && val?.priorty == 1) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 0 && val?.priorty == 2) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                                    onClick={() => setEntryShow(true)}
                                  >
                                    <FaRegEdit />
                                  </div>
                                </div>
                              </div>
                            ),
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 0 && val?.priorty == 3) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 2 && val?.priorty == null) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                            UNIT: "",
                            COMMENT: "",
                          };
                        } else if (val.inv === 2) {
                          return {
                            Test: (
                              <div>
                                <span>{val.labObservationName}</span>
                              </div>
                            ),

                            VAL: (
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
                            UNIT: "",
                            COMMENT: "",
                          };
                        }

                        return {};
                      }),
                    ]}
                    tableHeight={"scrollView"}
                  />
                </div>
                <div className="col-lg-6">
                  {entryShow && (
                    <div>
                      {
                        <div className="p-2">
                          <>
                            <div
                              style={{
                                maxHeight: "400px",
                                overflowY: "auto",
                              }}
                            >
                              <CustomLabTable>
                                <thead
                                  className="cf"
                                  style={{
                                    position: "sticky",
                                    zIndex: 99,
                                    top: 0,
                                  }}
                                >
                                  <tr>
                                    {[
                                      "#",
                                      "Antibiotic Entry",
                                      "Interpretation",
                                      "MIC",
                                    ].map((ele, index) => (
                                      <th key={index}>{ele}</th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {
                                    <>
                                      {entry.map((subArray, outerIndex) => (
                                        <>
                                          <tr

                                            className="background-theme-color"
                                          >
                                            <td colSpan={4}>
                                              <div className="row p-1 text-white p-2">
                                                <label className="col-sm-6  text-white p-2">
                                                  {
                                                    subArray[0]
                                                      ?.OrganismNameDisplayname
                                                  }
                                                </label>
                                                <div className="col-sm-2">
                                                  <button
                                                    className="mx-2  btn btn-danger btn-sm"
                                                    onClick={() =>
                                                      removeArrayAtIndex(
                                                        outerIndex
                                                      )
                                                    }
                                                  >
                                                    {t("Remove")}
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="row">
                                                <label className="col-sm-3  text-white ml-1">
                                                  Organism Display Name :
                                                </label>
                                                <div className="col-sm-4">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    type="text"
                                                    value={
                                                      subArray[0]
                                                        ?.OrganismNameDisplayname
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col-sm-4 ml-1">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    value={
                                                      entry[outerIndex][0]
                                                        ?.colonycount
                                                    }
                                                    onChange={(e) =>
                                                      setValuesForOuterIndex(
                                                        outerIndex,
                                                        "colonycount",
                                                        e?.target?.value
                                                      )
                                                    }
                                                    type="text"
                                                    placeholder="Colony Count"
                                                  />
                                                </div>
                                                <div className="col-sm-6">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    onChange={(e) =>
                                                      setValuesForOuterIndex(
                                                        outerIndex,
                                                        "colonycountcomment",
                                                        e?.target?.value
                                                      )
                                                    }
                                                    value={
                                                      entry[outerIndex][0]
                                                        ?.colonycountcomment
                                                    }
                                                    type="text"
                                                    placeholder="Comment"
                                                  />
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                          {subArray.map((item, innerIndex) => (
                                            <>
                                              <tr>
                                                <td
                                                  className="text-center"
                                                  style={{ width: "30px" }}
                                                >
                                                  {innerIndex + 1}
                                                  &nbsp;&nbsp;&nbsp;
                                                  {item?.isInput && (
                                                    <button
                                                      type="button"
                                                      className="btn btn-sm btn-danger"
                                                      onClick={() =>
                                                        handleFilterOrg(
                                                          outerIndex,
                                                          innerIndex
                                                        )
                                                      }
                                                      style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "2px 7px",
                                                        fontSize: "12px",
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                      }}
                                                    >
                                                      X
                                                    </button>
                                                  )}
                                                </td>
                                                <td>
                                                  {item?.isInput ? (
                                                    <Input
                                                      className="select-input-box form-control input-sm"
                                                      value={item?.name}
                                                      onChange={(e) =>
                                                        handleSensitivity(
                                                          e?.target?.value,
                                                          outerIndex,
                                                          innerIndex,
                                                          "name"
                                                        )
                                                      }
                                                    />
                                                  ) : (
                                                    item?.name
                                                  )}
                                                </td>

                                                <td colSpan={2}>
                                                  <div className="row">
                                                    <div className="col-sm-10">
                                                      <div
                                                        className="btn-group btn-group-toggle p-1"
                                                        data-toggle="buttons"
                                                      >
                                                        {Sensitivity.map(
                                                          (option, index) => (
                                                            <>
                                                              <input
                                                                type="checkbox"
                                                                // name=`{sensitivity-${outerIndex}-${innerIndex}}
                                                                value={
                                                                  option.value
                                                                }
                                                                checked={
                                                                  entry[
                                                                  outerIndex
                                                                  ][innerIndex][
                                                                  "AntiBioticInterpreatation"
                                                                  ] ===
                                                                  option.value
                                                                }
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  handleSensitivity(
                                                                    e?.target
                                                                      ?.checked
                                                                      ? e.target
                                                                        ?.value
                                                                      : "",
                                                                    outerIndex,
                                                                    innerIndex,
                                                                    "AntiBioticInterpreatation"
                                                                  );
                                                                }}
                                                                style={{
                                                                  appearance:
                                                                    "none",
                                                                  WebkitAppearance:
                                                                    "none",
                                                                  MozAppearance:
                                                                    "none",
                                                                  outline:
                                                                    "none",
                                                                  border:
                                                                    "1px solid #ccc",
                                                                  backgroundColor:
                                                                    entry[
                                                                      outerIndex
                                                                    ][
                                                                      innerIndex
                                                                    ][
                                                                      "AntiBioticInterpreatation"
                                                                    ] ===
                                                                      option.value
                                                                      ? "#007bff"
                                                                      : "#fff",
                                                                  color:
                                                                    entry[
                                                                      outerIndex
                                                                    ][
                                                                      innerIndex
                                                                    ][
                                                                      "AntiBioticInterpreatation"
                                                                    ] ===
                                                                      option.value
                                                                      ? "#fff"
                                                                      : "#000",
                                                                  padding:
                                                                    "6px 12px",
                                                                  cursor:
                                                                    "pointer",
                                                                  borderRadius:
                                                                    "5px",
                                                                  marginRight:
                                                                    "5px",
                                                                }}
                                                              />
                                                              <span
                                                                style={{
                                                                  textAlign:
                                                                    "center",
                                                                  marginRight:
                                                                    "3px",
                                                                }}
                                                              >
                                                                {" "}
                                                                {
                                                                  option.label
                                                                }{" "}
                                                              </span>
                                                            </>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-2">
                                                      <input
                                                        onChange={(e) =>
                                                          handleSensitivity(
                                                            e?.target?.value,
                                                            outerIndex,
                                                            innerIndex,
                                                            "mic"
                                                          )
                                                        }
                                                        value={item?.mic}
                                                        className="select-input-box form-control input-sm"
                                                      />
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            </>
                                          ))}
                                          <tr>
                                            <button
                                              className="mt-1 mb-1 ml-1 btn btn-primary btn-sm"
                                              onClick={() =>
                                                addItemAtIndex(outerIndex)
                                              }
                                            >
                                              Add Row
                                            </button>
                                          </tr>
                                        </>
                                      ))}
                                    </>
                                  }
                                </tbody>
                              </CustomLabTable>
                            </div>
                            <div
                              className="row mt-2"
                              style={{
                                background: "lightblue",
                                border: "1px solid lightblue",
                              }}
                            >
                              <h5
                                style={{ fontWeight: "bold" }}
                                className="col-sm-4"
                              >
                                {t("Select Organism")} :
                              </h5>
                              <div
                                className="col-sm-8"
                                style={{
                                  marginTop: "0px",
                                  backgroundColor: "white",
                                }}
                              >
                                <ReactSelect
                                  dynamicOptions={[
                                    ...handleReactSelectDropDownOptions(
                                      bindOrganism,
                                      "name",
                                      "id"
                                    ),
                                  ]}
                                  value={null}
                                  placeholderName="Select Organism"
                                  menuPosition={"fixed"}
                                  maxMenuHeight={250}
                                  handleChange={(_, e) => {
                                    // console.log(e);
                                    handleBindobsAntibiotic(
                                      e.value,
                                      e.label,

                                      pdata
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        </div>
                      }
                    </div>
                  )}
                </div>
              </div>

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
                      ›
                    </button>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={() => handleSave("Save")}
                    >
                      {t("Save")}
                    </button>

                    <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={() => {
                        handleSearchSampleCollection();
                        setEntryShow(false);
                        setEntry([]);
                      }}
                    >
                      {t("Main List")}
                    </button>
                  </div>

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

                  {/* <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={handleApprove}
                    >
                      {t("Approved")}
                    </button>  */}

                  <div>
                    {pdata?.Status == "Approved" || pdata?.Status === "Printed" ? <button
                      className="btn btn-md btn-danger mx-2 px-4 py-2"
                      type="button"
                      onClick={() => handleUnApproved("Not Approved")}
                    >
                      {t("Un Approved")}
                    </button> : <button
                      className="btn btn-md btn-success mx-2 px-4 py-2"
                      type="button"
                      onClick={() => handleApprove("Approved")}
                    >
                      {t("Approved")}
                    </button>}
                    {/* {isApproved ? (
                      <button
                        className="btn btn-md btn-danger mx-2 px-4 py-2"
                        type="button"
                        onClick={() => handleUnApproved("Not Approved")}
                      >
                        {t("Un Approved")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-md btn-success mx-2 px-4 py-2"
                        type="button"
                        onClick={() => handleApprove("Approved")}
                      >
                        {t("Approved")}
                      </button>
                    )} */}
                  </div>

                  <div>
                    {
                      console.log("the pdata is hold", testList)}
                    {testList[0]?.isHold == 1 ? (
                      <button
                        className="btn btn-md btn-danger mx-2 px-4 py-2"
                        type="button"
                        onClick={() => handleUnHold("UnHold")}
                      >
                        {t("Un Hold")}
                      </button>
                    ) : (
                      <button
                        className="btn btn-md btn-success mx-2 px-4 py-2"
                        type="button"
                        onClick={handleHoldModal}
                      >
                        {t("Hold")}
                      </button>
                    )}
                  </div>

                  {/* 
                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={handleSampleRejection}
                  >
                    {t("Forward")}
                  </button> */}

                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={() => {
                      handleAddFile(pdata);
                    }}
                  >
                    {t("Add File")}
                  </button>
                  <button
                    className="btn btn-md btn-success mx-2 px-4 py-2"
                    type="button"
                    onClick={handleOpenDocument}
                  >
                    {t("Add Report")}
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
                RegDate: "",
                BarcodeNo:
                  (
                    <strong
                      className="text-primary"
                      onClick={() => handleOpenTest(val, index)}
                    >
                      {val.BarcodeNo}
                    </strong>
                  ) || "",
                UHIDno: val.PatientID || "",
                PatientName: val.PName || "",
                AgeSex: val.Age_Gender || "",
                Tests: val.Test || "",
                colorcode: val?.colorcode,
                status: val.Status || "",
                Attachement: (
                  <div
                    onClick={() => {
                      handleAddFile(val);
                    }}
                  >
                    {" "}
                    <FaPaperclip />{" "}
                  </div>
                ),
                Print: val.TestName || "",
              }))}
              style={{ height: "55vh", padding: "2px" }}
              tableHeight={"scrollView"}
              getRowClass={getColorByLabel}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        // <Modal modalWidth="60vw" visible={modalOpen} setVisible={setModalOpen}>
        //   {/* <ReactQuill
        //     value={editorValue}
        //     onChange={handleEditorVal}
        //     modules={modules}
        //     formats={formats}
        //     style={{
        //       marginBottom: "10px",
        //       height: "180px",
        //       backgroundClip: "#FFF",
        //       width: "100%",
        //     }}
        //   /> */}
        //   <ReactQuill
        //     value={commentMessage}
        //     onChange={handleEditorVal}
        //     modules={modules}
        //     formats={formats}
        //     style={{
        //       marginBottom: "10px",
        //       height: "180px",
        //       backgroundClip: "#FFF",
        //       width: "100%",
        //     }}
        //   />
        // </Modal>
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
          {handleModelData?.Component}
        </Modal>
      )}
    </>
  );
}
export default ResultEntryCulture;
