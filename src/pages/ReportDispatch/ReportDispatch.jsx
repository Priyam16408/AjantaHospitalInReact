// import React, { useEffect, useState } from "react";
// import Heading from "../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import ReactSelect from "../../components/formComponent/ReactSelect";
// import moment from "moment";
// import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
// import DatePicker from "../../components/formComponent/DatePicker";
// import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
// import {
//   BindDepartmentResultEntryLab,
//   BindLabReport,
// } from "../../networkServices/resultEntry";
// import Tables from "../../components/UI/customTable";
// import Input from "../../components/formComponent/Input";
// import { BindDepartmentDispatch, DipatchBindDoctorDept, DispatchLabReports, DispatchResultEntryLab } from "../../networkServices/DispatchLab";
// import { FaGreaterThan } from "react-icons/fa";
// import { FaLessThan } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux"; 
// import { RedirectURL } from "../../networkServices/PDFURL";
// import { BindDepartmentLab } from "../../networkServices/departmentreceive";
// import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";

// function ReportDispatch() {
//   const [departmentData, setDepartmentData] = useState([]);
//   const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]); 
//   const [doctor,setDoctor] = useState([]);

//   const [page, setPage] = useState(1); 

//   const dispatch = useDispatch();

//   const { GetBindAllDoctorConfirmationData } = useSelector(
//     (state) => state.CommonSlice
//   );

//   const ip = localStorage.getItem("ip");
//   const pagination = (pageNumber) => {
//     if (
//       pageNumber >= 1 &&
//       pageNumber <= tbodyPatientDetail.length / 5 &&
//       pageNumber !== page
//     )
//       setPage(pageNumber);
//   };
//   let [t] = useTranslation();
//   const handleChange = (e) => {
//     setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
//   };

//   const { VITE_DATE_FORMAT } = import.meta.env;

 

//   const PatientTypeTest = [
//     { value: "0", label: "ALL" },
//     { value: "1", label: "OPD" },
//     { value: "2", label: "IPD" },
//   ];

//   const center = [
//     { value: "0", label: "All" },
//     { value: "1", label: "ELAB-PRO" },
//     { value: "2", label: "HOSPEDIA" },
//     { value: "3", label: "INNOPATH" },
//     { value: "3", label: "ITDOSE INFOSYSTEM PVT.LTD" },
//   ];

//   const [values, setValues] = useState({
//     BarcodeNo: "",
//     UHID: "",
//     department: { value: "0", label: "ALL" }, 
//     fromDate: moment(new Date()).toDate(),
//     toDate: moment(new Date()).toDate(),
//     PatientTypeTest: { value: "0", label: "ALL" },
//     center: { value: "0", label: "ALL" },
//     doctor: { value: "0", label: "ALL" },
//   });

//   const theadPatientDetail = [
//     { width: "5%", name: t("SNo") },
//     { width: "15%", name: t("Entry DateTime") },
//     { width: "15%", name: t("Barcode No") },
//     { width: "15%", name: t("UHID No") },
//     { width: "10%", name: t("Patient Name") },
//     { width: "15%", name: t("Age/Sex") },
//     { width: "15%", name: t("Booking Center") },
//     { width: "10%", name: t("Dispatch Mode") },
//     { width: "10%", name: t("Patient Type") },
//     { width: "10%", name: t("Doctor") },
//     { width: "10%", name: t("Department") },
//     { width: "10%", name: t("Investigation") },
//     { width: "10%", name: t(".") }, 
//     { width: "10%", name: t("Outsource") },
//   ]; 

//   // const handleChangeCheckbox = (e, index) => { 
//   //   const updatedData = [...tbodyPatientDetail];
   
//   //   updatedData.forEach((item, i) => {
//   //     item.isChecked = false;
//   //   });
   
//   //   updatedData[index].isChecked = e.target.checked;
   
//   //   setTbodyPatientDetail(updatedData);
//   // };

//   const handleChangeCheckbox = (e, index) => {
//     const updatedData = tbodyPatientDetail.map((item, i) =>
//       i === index ? { ...item, isChecked: e.target.checked } : item
//     );
//     setTbodyPatientDetail(updatedData);
//   };
  
//   const handleSelect = (name, value) => {
//     console.log(value)
//     if(name==="department"){
//       bindBindDoctorDept(value?.value)
//     }
//     setValues((val) => ({ ...val, [name]: value }));
//   };

//   const handleSearchSampleCollection = async () => {
//     console.log("ASdasd",values)
//     let payload = {
//       searchdata: [
//         values.BarcodeNo,
//         values.UHID,
//         values?.department?.value?.toString() ?? "0",
//         moment(values?.fromDate).format("DD-MMM-YYYY"),
//         moment(values?.toDate).format("DD-MMM-YYYY"),
//         values.PatientTypeTest.value,
//         values.center.value,
//         values.doctor.value, 
//         "pli.BarcodeNo",
//         "",
//       ],
//       pageNo: "0",
//       pageSize: "300",
//     };
 

//     try {
//       const apiResp = await DispatchResultEntryLab(payload);
//       if (apiResp.success) {
//         let data = apiResp?.data?.map((val) => {
//           return val;
//         });
//         setTbodyPatientDetail(data); 
//       } else {
//         notify("No records found", "error");
//         setTbodyPatientDetail([]); 
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//       setTbodyPatientDetail([]); 
//     }
//   };

//   const fetchDepartmentData = async () => {
//     try {
//       const response = await BindDepartmentLab();
//       if (response.success) {
//         console.log("the department data is in", response);
//         setDepartmentData(response.data);
//       } else {
//         console.error(
//           "API returned success as false or invalid response:",
//           response
//         );
//         setDepartmentData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setDepartmentData([]);
//     }
//   };
 
 
//       const bindBindDoctorDept = async (value) => { 
     
//         try {
//           const apiResp = await GetBindDoctorDept(value==="0"?"All":value);
//           if (apiResp.success) { 
//             setDoctor(apiResp.data)
//           } else {
//             notify("Some error occurred", "error");
//           }
//         } catch (error) { 
//           notify("An error occurred while fetching data", "error");
//         }
//       };

//       // BindInvestigationLab
 

//   const handlePrevious = () => {
//     if (page > 1) {
//       const newPage = page - 1;
//       setPage(newPage);
//       pagination(newPage);
//     }
//   };

//   const handleNext = () => {
//     if (page < totalPages) {
//       const newPage = page + 1;
//       setPage(newPage);
//       pagination(newPage);
//     }
//   };

//   const handlePageClick = (pageNum) => {
//     setPage(pageNum);
//     pagination(pageNum);
//   };
//   const totalPages = Math.ceil(tbodyPatientDetail.length / 100);


   
  
 

//   const handleDispatch = async (buttonStatus) => { 
//     const checkdata = tbodyPatientDetail.filter((item) => item.isChecked); 
//     const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
//     if (!anyChecked) {
//       notify(
//         "Please Select Test ",
//         "error"
//       );
//       return;
//     }  
//      // Prepare RecPayload as a single object
//      let RecPayload = {
 

//       testID: checkdata.map((item) => String(item.Test_ID)).join(","),
//       isOnlinePrint: "",
//       isConversion: "",
//       isNabl:"",
//       orderBy:"",
//       labType: checkdata.map((item) => String(item.reporttype)).join(","),
//       ipAddress: ip,
//       isPrev: buttonStatus,
//     }; 
//     tbodyPatientDetail?.forEach((val) => {
//       if (val?.isChecked) {
//         RecPayload.testID = val?.Test_ID;
//       }
//     });

//     try {
//       const apiResp = await BindLabReport(RecPayload);
//       if (apiResp?.success === false) {
//         notify("No records found", "error");
//       } else {
//         console.log("The PDF URL link is", apiResp?.pdfUrl);
//         RedirectURL(apiResp?.data?.value?.pdfUrl);
//         handleSearchSampleCollection();
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//     }
//   };

//   // DispatchLabReports

 


//   const handleDispatchReport = async () => {
//     // Check if any items are selected
//     const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
//     const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);
  
//     if (!anyChecked) {
//       notify("Please Select Test", "error");
//       return;
//     }
  
//     // Prepare RecPayload as a single object
//     const RecPayload = {
//       testID: checkdata.map((item) => String(item.Test_ID)).join(","),  
//       ledgerNo: checkdata.map((item) => String(item.LedgerTransactionNo)).join(","),  
//       isEmail: "0",
//       isSms: "0",
//     };
  
//     try {
//       const apiResp = await DispatchLabReports(RecPayload);
//       if (apiResp?.success === false) {
//         notify("No records found", "error");
//       } else {
//         console.log("The API response is", apiResp); 
//         let RecPayload = {
//           testID: checkdata.map((item) => String(item.Test_ID)).join(","),
//           isOnlinePrint: "1",
//           isConversion: "",
//           isNabl: "0",
//           orderBy: "",
//           labType: "1",
//           ipAddress: ip,
//           isPrev: true,
//         };
    
    
//         try {
//           const apiResp = await BindLabReport(RecPayload);
//           if (apiResp?.success === false) {
//             notify("No records found", "error");
//           } else {
//             console.log("The PDF URL link is", apiResp?.pdfUrl);
//             RedirectURL(apiResp?.data?.value?.pdfUrl);
//             handleSearchSampleCollection();
//           }
//         } catch (error) {
//           notify("An error occurred while fetching data", "error");
//         }
//         handleSearchSampleCollection();
//       }
//     } catch (error) {
//       notify("An error occurred while fetching data", "error");
//     }
//   };
  

  
//   useEffect(() => {
//     fetchDepartmentData();  
//     bindBindDoctorDept(values.department.value);
//   }, []);
  
//   return (
//     <>
//       <div className="m-2 spatient_registration_card card">
//         <Heading
//           title={t("heading")}
//           isBreadcrumb={true}
//         />
//         <div>
//           <div className="row  row-cols-md-2 row-cols-1 p-2">
//             <Input
//               type="text"
//               className="form-control"
//               id="BarcodeNo"
//               placeholder=" "
//               name="BarcodeNo"
//               value={values?.BarcodeNo || ""}
//               onChange={handleChange}
//               lable={t("BarcodeNo")}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             />

//             <Input
//               type="text"
//               placeholder=""
//               className="form-control"
//               id="UHID"
//               name="UHID"
//               value={values?.UHID || ""}
//               onChange={handleChange}
//               lable={t("UHID")}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             />

//             <ReactSelect
//               placeholderName={t("Department")}
//               id={"department"}
//               searchable={true}
//               removeIsClearable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={[
//                 { value: "0", label: "ALL" },
//                 ...handleReactSelectDropDownOptions(
//                   departmentData,
//                   "Name",
//                   "ObservationType_ID"
//                 ),
//               ]}
//               handleChange={handleSelect}
//               value={`${values?.department?.value}`}
//               name={"department"}
//             />
        

//             <DatePicker
//               className="custom-calendar"
//               id="fromDate"
//               name="fromDate"
//               lable={t("FromDate")}
//               value={values?.fromDate || new Date()}
//               handleChange={handleChange}
//               placeholder={VITE_DATE_FORMAT}
//               respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
//             />

//             <DatePicker
//               className="custom-calendar"
//               id="toDate"
//               name="toDate"
//               value={values?.toDate || new Date()}
//               handleChange={handleChange}
//               lable={t("ToDate")}
//               placeholder={VITE_DATE_FORMAT}
//               respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
//             />

//             <ReactSelect
//               placeholderName={t("Test")}
//               id={"PatientTypeTest"}
//               searchable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={PatientTypeTest}
//               handleChange={handleSelect}
//               value={`${values?.PatientTypeTest?.value}`}
//               name={"PatientTypeTest"}
//             />

//             <ReactSelect
//               placeholderName={t("Center")}
//               id={"center"}
//               searchable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={center}
//               handleChange={handleSelect}
//               value={`${values?.center?.value}`}
//               name={"center"}
//             />
//             <ReactSelect
//               placeholderName={t("Doctor")}
//               id={"doctor"}
//               searchable={true}
//               removeIsClearable={true}
//               respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
//               dynamicOptions={[
//                 { value: "0", label: "ALL" },
//                 ...handleReactSelectDropDownOptions(
//                   doctor,
//                   "Name",
//                   "DoctorID"
//                 ),
//               ]}
//               handleChange={handleSelect}
//               value={`${values?.doctor?.value}`}
//               name={"doctor"}
//             />

//             <div className="">
//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleSearchSampleCollection}
//               >
//                 {t("Search")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={()=>handleDispatch(true)}

//               >
//                 {t("Preview")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={()=>handleDispatch(false)}
//               >
//                 {t("Print")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleDispatchReport}
//               >
//                 {t("Dispatch")}
//               </button>

//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleDispatch}
//               >
//                 {t("Print Outsource Report")}
//               </button>
//             </div>
//           </div>
//           {/* Color Coding Section */}

//           <Heading
//             title=""
//             isBreadcrumb={false}
//             secondTitle={
//               <>
//                 <ColorCodingSearch label={t("New")} color="#CC99FF" />

//                 <ColorCodingSearch
//                   label={t("SampleCollected")}
//                   color="#FFE4C4"
//                 />

//                 <ColorCodingSearch
//                   label={t("SampleRejected")}
//                   color="#FF0000"
//                 />
//                 <ColorCodingSearch
//                   label={t("DepartmentRecieved")}
//                   color="#FFFFFF"
//                 />
//                 <ColorCodingSearch label={t("Tested")} color="#FFC0CB" />
//                 <ColorCodingSearch label={t("Approved")} color="#90EE90" />
//                 <ColorCodingSearch label={t("Printed")} color="#00FFFF" />
//                 <ColorCodingSearch label={t("Disptached")} color="#44A3AA" />
//                 <ColorCodingSearch label={t("Abnormal")} color="#993300" />
//                 <ColorCodingSearch label={t("Critical")} color="#99A300" />
//               </>
//             }
//           />
//         </div>

//         <div className="card table-responsive">
//           <Tables
//             thead={theadPatientDetail}
//             tbody={tbodyPatientDetail
//               .slice(page * 100 - 100, page * 100)
//               .map((val, index) => ({
//                 sno: (page - 1) * 100 + index + 1,
//                 EntryDateTime: val.EntryDate,
//                 BarcodeNo: val.BarcodeNo,
//                 UHIDNo: val.PatientID,
//                 PatientName: val.PName,
//                 AgeSex: val.pinfo,
//                 BookingCenter: val.centre,
//                 DispatchMode: val.DispatchMode || null,
//                 PatientType: val.PatientType,
//                 DoctorName: val.DoctorName,
//                 department: val.Dept,
//                 ItemName: val.ItemName, 
//                 colorcode: val.rowColor,
//                 approved:
//                   val.Approved ? (
//                     <input
//                       type="checkbox"
//                       checked={val.isChecked}
//                       onChange={(e) => handleChangeCheckbox(e, index)}
//                     />
//                   ) : (
//                     ""
//                   ),
//                   Outsource:
//                   val.isoutsource=="1" ? (
//                     <input
//                       type="checkbox"
//                       checked={val.isChecked}
//                       onChange={(e) => handleChangeCheckbox(e, index)}
//                     />
//                   ) : (
//                     ""
//                   ),
//                 // colorcode: getRowClass(val),
//               }))}
//             style={{ height: "55vh", padding: "2px" }}
//             tableHeight={"scrollView"}
//           />
//         </div>

//         <div className="pagination">
//           {page > 1 && (
//             <button className="paginationBtn" onClick={handlePrevious}>
//               <FaLessThan />
//             </button>
//           )}
//           {Array.from({ length: totalPages }).map((_, i) => {
//             const pageNum = i + 1;
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => handlePageClick(pageNum)}
//                 className={`paginationBtn ${page === pageNum ? "selected_page" : ""}`}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
//           {page < totalPages && (
//             <button className="paginationBtn" onClick={handleNext}>
//               <FaGreaterThan />
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default ReportDispatch;


import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import {
  BindAttachment,
  BindAttachmentPdf,

  BindLabReport,
  BindPatientDetails,
  BindPatientDetailsImage,
} from "../../networkServices/resultEntry";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import {
  BindDepartmentDispatch,
  DipatchBindDoctorDept,
  DispatchLabReports,
  DispatchResultEntryLab,
} from "../../networkServices/DispatchLab";
import { FaGreaterThan, FaPaperclip } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RedirectURL } from "../../networkServices/PDFURL";
import { BindDepartmentLab } from "../../networkServices/departmentreceive";
import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";
import { reach } from "yup";
import { Checkbox } from "primereact/checkbox";

function ReportDispatch() {
  const [departmentData, setDepartmentData] = useState([]);
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [selectedChecked, setSelectedChecked] = useState([]);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  const ip = localStorage.getItem("ip");
  const pagination = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= tbodyPatientDetail.length / 5 &&
      pageNumber !== page
    )
      setPage(pageNumber);
  };
  let [t] = useTranslation();
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  const { VITE_DATE_FORMAT } = import.meta.env;

  const PatientTypeTest = [
    { value: "0", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
  ];

  const center = [
    { value: "0", label: "All" },
    { value: "1", label: "ELAB-PRO" },
    { value: "2", label: "HOSPEDIA" },
    { value: "3", label: "INNOPATH" },
    { value: "3", label: "ITDOSE INFOSYSTEM PVT.LTD" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    UHID: "",
    department: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    PatientTypeTest: { value: "0", label: "ALL" },
    center: { value: "0", label: "ALL" },
    doctor: { value: "0", label: "ALL" },
  });

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Entry DateTime") },
    { width: "15%", name: t("Barcode No") },
    { width: "15%", name: t("UHID No") },
    { width: "10%", name: t("Patient Name") },
    { width: "15%", name: t("Age/Sex") },
    { width: "15%", name: t("Booking Center") },
    { width: "10%", name: t("Dispatch Mode") },
    { width: "10%", name: t("Patient Type") },
    { width: "10%", name: t("Doctor") },
    { width: "10%", name: t("Department") },
    { width: "10%", name: t("Investigation") },
    { width: "10%", name: t(".") },
    { width: "10%", name: t("Outsource") },
    { width: "10%", name: t("View Reports") },
    { width: "10%", name: t("View Document") },
  ];
  const handleChangeCheckbox = (item) => {
    setSelectedChecked((prev) => {
      if (prev.includes(item.Test_ID)) {
        return prev.filter((id) => id !== item.Test_ID);
      } else {
        return [...prev, item.Test_ID];
      }
    });
  };
  // const handleChangeCheckbox = (e, index) => {
  //   const updatedData = tbodyPatientDetail.map((item, i) =>
  //     i === index ? { ...item, isChecked:e.target.checked } : item
  //   );

  //   setTbodyPatientDetail(updatedData);
  // };

  const handleSelect = (name, value) => {
    if (name === "department") {
      bindBindDoctorDept(value?.value);
    }
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSearchSampleCollection = async () => {
    let payload = {
      searchdata: [
        values.BarcodeNo,
        values.UHID,
        values?.department?.value?.toString() ?? "0",
        moment(values?.fromDate).format("DD-MMM-YYYY"),
        moment(values?.toDate).format("DD-MMM-YYYY"),
        values.PatientTypeTest.value,
        values.center.value,
        values.doctor.value,
        "pli.BarcodeNo",
        "",
      ],
      pageNo: "0",
      pageSize: "300",
    };

    try {
      const apiResp = await DispatchResultEntryLab(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return val;
        });

        setTbodyPatientDetail(data);
        setSelectedChecked([]);

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
      const response = await BindDepartmentLab();
      if (response.success) {
        console.log("the department data is in", response);
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

  const bindBindDoctorDept = async (value) => {
    try {
      const apiResp = await GetBindDoctorDept(value === "0" ? "All" : value);
      if (apiResp.success) {
        setDoctor(apiResp.data);
      } else {
        notify("Some error occurred", "error");
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  // BindInvestigationLab

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      pagination(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      pagination(newPage);
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    pagination(pageNum);
  };
  const totalPages = Math.ceil(tbodyPatientDetail.length / 100);

  const handleDispatch = async (buttonStatus) => {
    const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);
    if (!selectedChecked?.length > 0) {
      notify("Please Select Test", "error");
      return;
    }

    const selectedTestId = selectedChecked
      .map((item) => String(item))
      .join(",");
    let RecPayload = {
      testID: selectedTestId,
      isOnlinePrint: "",
      isConversion: "",
      isNabl: "",
      orderBy: "",
      labType: checkdata.map((item) => String(item.reporttype)).join(","),
      ipAddress: ip,
      isPrev: buttonStatus,
    };

    try {
      const apiResp = await BindLabReport(RecPayload);
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        console.log("The PDF URL link is", apiResp?.data);
        RedirectURL(apiResp?.data);
        handleSearchSampleCollection();
        setSelectedChecked([]);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  // DispatchLabReports

  const handleDispatchReport = async () => {
    // Check if any items are selected
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    const checkdata = tbodyPatientDetail.filter((item) => item.isChecked);

    if (!anyChecked) {
      notify("Please Select Test", "error");
      return;
    }

    // Prepare RecPayload as a single object
    const RecPayload = {
      testID: checkdata.map((item) => String(item.Test_ID)).join(","),
      ledgerNo: checkdata
        .map((item) => String(item.LedgerTransactionNo))
        .join(","),
      isEmail: "0",
      isSms: "0",
    };

    try {
      const apiResp = await DispatchLabReports(RecPayload);
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        console.log("The API response is", apiResp);
        let RecPayload = {
          testID: checkdata.map((item) => String(item.Test_ID)).join(","),
          isOnlinePrint: "1",
          isConversion: "",
          isNabl: "0",
          orderBy: "",
          labType: "1",
          ipAddress: ip,
          isPrev: true,
        };

        try {
          const apiResp = await BindLabReport(RecPayload);
          if (apiResp?.success === false) {
            notify("No records found", "error");
          } else {
            console.log("The PDF URL link is", apiResp?.pdfUrl);
            RedirectURL(apiResp?.data?.value?.pdfUrl);
            handleSearchSampleCollection();
          }
        } catch (error) {
          notify("An error occurred while fetching data", "error");
        }
        handleSearchSampleCollection();
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  };

  useEffect(() => {
    fetchDepartmentData();
    bindBindDoctorDept(values.department.value);
  }, []);



  const handleOpenReport = async (val) => {
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
        debugger

        if (resp.success && resp.data) {
          const base64Data = resp.data;
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

  };

  const handleDocumentView = async (val,index) => {
    try {
      debugger
      const params = val?.LedgerTransactionNo ? `LedgerTransactionNo=${val?.LedgerTransactionNo}` : ``
      const response = await BindPatientDetails(params)
      if (response?.success) {
        const payload = {
          id: response?.data?.grvAttachment[0]?.Id ?? '',
          FileName: response?.data?.grvAttachment[0]?.FileName ?? '',
          LedgerTransactionNo: val?.LedgerTransactionNo ?? '',
        }
        const resp = await BindPatientDetailsImage(payload)
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
      }else{
        notify("Record Not Found","error")
      }
    } catch (error) {

    }
  }

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading title={t("heading")} isBreadcrumb={true} />
        <div>
          <div className="row  row-cols-md-2 row-cols-1 p-2">
            <Input
              type="text"
              className="form-control"
              id="BarcodeNo"
              placeholder=" "
              name="BarcodeNo"
              value={values?.BarcodeNo || ""}
              onChange={handleChange}
              lable={t("BarcodeNo")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />

            <Input
              type="text"
              placeholder=""
              className="form-control"
              id="UHID"
              name="UHID"
              value={values?.UHID || ""}
              onChange={handleChange}
              lable={t("UHID")}
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
                  "Name",
                  "ObservationType_ID"
                ),
              ]}
              handleChange={handleSelect}
              value={`${values?.department?.value}`}
              name={"department"}
            />

            <DatePicker
              className="custom-calendar"
              id="fromDate"
              name="fromDate"
              lable={t("FromDate")}
              value={values?.fromDate || new Date()}
              handleChange={handleChange}
              placeholder={VITE_DATE_FORMAT}
              respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
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
            />

            <ReactSelect
              placeholderName={t("Test")}
              id={"PatientTypeTest"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={PatientTypeTest}
              handleChange={handleSelect}
              value={`${values?.PatientTypeTest?.value}`}
              name={"PatientTypeTest"}
            />

            <ReactSelect
              placeholderName={t("Center")}
              id={"center"}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={center}
              handleChange={handleSelect}
              value={`${values?.center?.value}`}
              name={"center"}
            />
            <ReactSelect
              placeholderName={t("Doctor")}
              id={"doctor"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                { value: "0", label: "ALL" },
                ...handleReactSelectDropDownOptions(doctor, "Name", "DoctorID"),
              ]}
              handleChange={handleSelect}
              value={`${values?.doctor?.value}`}
              name={"doctor"}
            />

            <div className="">
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleSearchSampleCollection}
              >
                {t("Search")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={() => handleDispatch(true)}
              >
                {t("Preview")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={() => handleDispatch(false)}
              >
                {t("Print")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleDispatchReport}
              >
                {t("Dispatch")}
              </button>

              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleDispatch}
              >
                {t("Print Outsource Report")}
              </button>
            </div>
          </div>
          {/* Color Coding Section */}

          <Heading
            title=""
            isBreadcrumb={false}
            secondTitle={
              <>
                <ColorCodingSearch label={t("New")} color="#CC99FF" />

                <ColorCodingSearch
                  label={t("SampleCollected")}
                  color="#FFE4C4"
                />

                <ColorCodingSearch
                  label={t("SampleRejected")}
                  color="#FF0000"
                />
                <ColorCodingSearch
                  label={t("DepartmentRecieved")}
                  color="#FFFFFF"
                />
                <ColorCodingSearch label={t("Tested")} color="#FFC0CB" />
                <ColorCodingSearch label={t("Approved")} color="#90EE90" />
                <ColorCodingSearch label={t("Printed")} color="#00FFFF" />
                <ColorCodingSearch label={t("Disptached")} color="#44A3AA" />
                <ColorCodingSearch label={t("Abnormal")} color="#993300" />
                <ColorCodingSearch label={t("Critical")} color="#99A300" />
              </>
            }
          />
        </div>

        <div className="card table-responsive">
          <Tables
            thead={theadPatientDetail}
            tbody={tbodyPatientDetail
              .slice(page * 100 - 100, page * 100)
              .map((val, index) => ({
                sno: (page - 1) * 100 + index + 1,
                EntryDateTime: val?.EntryDate,
                BarcodeNo: val?.BarcodeNo,
                UHIDNo: val?.PatientID,
                PatientName: val?.PName,
                AgeSex: val?.pinfo,
                BookingCenter: val?.centre,
                DispatchMode: val?.DispatchMode || null,
                PatientType: val?.PatientType,
                DoctorName: val?.DoctorName,
                department: val?.Dept,
                ItemName: val?.ItemName,
                colorcode: val?.rowColor,
                approved: val?.Approved ? (
                  <input
                    type="checkbox"
                    checked={selectedChecked.includes(val?.Test_ID)}
                    onChange={(e) => handleChangeCheckbox(val)}
                  />
                ) : (
                  ""
                ),
                Outsource:
                  val.isoutsource == "1" ? (
                    <input
                      type="checkbox"
                      checked={selectedChecked.includes(val?.Test_ID)}
                      onChange={(e) => handleChangeCheckbox(val)}
                    />
                  ) : (
                    ""
                  ),
                "View Reports": (
                  <div
                    onClick={() => handleOpenReport(val)}
                  >
                    {" "}
                    <FaPaperclip />
                  </div>
                ),
                "View Document": (
                  <div
                    onClick={() => {
                      handleDocumentView(val, index);
                    }}
                  >
                    {" "}
                    <FaPaperclip />
                  </div>
                ),


                // colorcode: getRowClass(val),
              }))}
            style={{ height: "55vh", padding: "2px" }}
            tableHeight={"scrollView"}
          />
        </div>

        <div className="pagination">
          {page > 1 && (
            <button className="paginationBtn" onClick={handlePrevious}>
              <FaLessThan />
            </button>
          )}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                className={`paginationBtn ${page === pageNum ? "selected_page" : ""}`}
              >
                {pageNum}
              </button>
            );
          })}
          {page < totalPages && (
            <button className="paginationBtn" onClick={handleNext}>
              <FaGreaterThan />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ReportDispatch;