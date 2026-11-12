// import React, { useEffect } from "react";
// import { getBindVital } from "../../store/reducers/DoctorModule/VitalSign";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import Tables from "../UI/customTable";

// const PrintDesign = ({
//   loadSaveDataPrisciption,
//   patientDetail,
//   prescription,
// }) => {
//   const dispatch = useDispatch();
//   console.log(loadSaveDataPrisciption);
//   const { getBindVitalData, getSearchListData } = useSelector(
//     (state) => state.vitalSignSlice
//   );
//   useEffect(() => {
//     dispatch(getBindVital(patientDetail?.currentPatient?.TransactionID));
//   }, []);
//   const Thead = ["Sr No.", "Name", "Dose", "Time", "Duration", "Meal", "Route"];
//   const dynamicItem = (val, sectionKey) => {
//     console.log(val);

//     let content;

//     if (sectionKey === "medicines") {
//       content = (
//         <>
//           {/* <span>{val?.medicineName || "No Medicine Name"}</span> */}

//           <Tables
//             thead={Thead}
//             tbody={val?.map((medItem, index) => ({
//               "Sr No.": index + 1,
//               Name: medItem?.medicineName,
//               Dose:medItem.dose,
//               Time:medItem.noTimesDay,
//               Duration:medItem.noOfDays,
//               // Meal:medItem.
//             }))}
//           />
//         </>
//       );
//     } else if (sectionKey === "investigations") {
//       content = <span>{val?.name || "No Name"}</span>;
//     } else {
//       content = <span>{val}</span>;
//     }

//     return <>{content}</>;
//   };

//   const renderListDynamic = (item, matchedValue, sectionKey) => {
//     return (
//       <>
//         <div key={item?.AccordianName}>
//           <p>
//             {item?.AccordianName}:{" "}
//             <span>
//               {matchedValue.length > 0
//                 ? // Display medicine names for "medicines" section
//                   dynamicItem(matchedValue, sectionKey)
//                 : "N/A"}
//             </span>
//           </p>
//         </div>
//       </>
//     );
//   };

//   const renderLoadPrisciptionList = () => {
//     return (
//       <>
//         {prescription.map((item) => {
//           // Convert AccordianName to camelCase (assuming loadSaveDataPrisciption keys follow this convention)
//           const toCamelCase = (str) => {
//             return str
//               .toLowerCase()
//               .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
//                 index === 0 ? match.toLowerCase() : match.toUpperCase()
//               )
//               .replace(/\s+/g, "");
//           };

//           // Get the dynamic key by converting AccordianName to camelCase
//           let sectionKey = toCamelCase(item?.AccordianName);

//           // Replace "prescribedMedicine" with "medicines" dynamically
//           if (sectionKey === "prescribedMedicine") {
//             sectionKey = "medicines"; // Replace with the desired key
//           }
//           if (sectionKey === "investigation(Lab&Radio)") {
//             sectionKey = "investigations"; // Replace with the desired key
//           }

//           // Find the corresponding value dynamically from loadSaveDataPrisciption
//           let matchedValue = loadSaveDataPrisciption?.[sectionKey]?.value || [];

//           // For medicines, directly access the mapped data
//           if (sectionKey === "medicines") {
//             matchedValue = loadSaveDataPrisciption?.medicines || [];
//           }
//           if (sectionKey === "investigations") {
//             matchedValue = loadSaveDataPrisciption?.investigations || [];
//           }

//           // Debugging the matched value
//           console.log(`Section Key: ${sectionKey}`, matchedValue);
//           return renderListDynamic(item,  matchedValue, sectionKey);
//           {
//             /* return (
//             <div key={item?.AccordianName}>
//               <p>
//                 {item?.AccordianName}:{" "}
//                 <span>
//                   {matchedValue.length > 0
//                     ? matchedValue.map((val, index) => (
//                         // Display medicine names for "medicines" section
//                         <span key={index}>
//                           {sectionKey === "medicines" ? (
//                             <span>
//                               {val?.medicineName || "No Medicine Name"}
//                             </span>
//                           ) : (
//                             <span>{val}</span>
//                           )}
//                         </span>
//                       ))
//                     : "N/A"}
//                 </span>
//               </p>
//             </div>
//           ); */
//           }
//         })}
//       </>
//     );
//   };
//   return (
//     <>
//       <div className="resportDesign">
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <div className="headRpt">
//                 <div className="row">
//                   <div className="col-6">
//                     <ul>
//                       <li>
//                         <p>
//                           UHID: <span>{patientDetail?.PatientID}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Patient Name: <span>{patientDetail?.Pname}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Age/Sex:{" "}
//                           <span>{`${patientDetail?.Age}/${patientDetail?.Sex}`}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Ph No: <span>{patientDetail?.ContactNo}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Address: <span>N/A</span>
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="col-6">
//                     <ul>
//                       <li>
//                         <p>
//                           Panel: <span>{patientDetail?.PanelName}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>Bill No: N/A</p>
//                       </li>
//                       <li>
//                         <p>
//                           Doctor: <span>{patientDetail?.DName}</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Department: <span>N/A</span>
//                         </p>
//                       </li>
//                       <li>
//                         <p>
//                           Visit Date: <span>N/A</span>
//                         </p>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="headRpt">
//                 <div className="row">
//                   <div className="col-3">
//                     <div className="vitalChartList">
//                       <ul>
//                         <div className="h-100">
//                           <ul className="vitalListing">
//                             <h4>Current Vitals:</h4>
//                             <li>
//                               <p>
//                                 BP:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.BP || "N/A"} mm/Hg
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 Pulse:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.P || "N/A"} bpm
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 Resp:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.Resp || "N/A"} bpm
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 Temp:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.T || "N/A"} <sup>o</sup>
//                                   C
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 {" "}
//                                 Height:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.HT || "N/A"} cm
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 {" "}
//                                 Weight:{" "}
//                                 <span>
//                                   {getBindVitalData[0]?.WT || "N/A"} Kg
//                                 </span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 BMI:{" "}
//                                 <span>{getBindVitalData[0]?.BMI || "N/A"}</span>
//                               </p>
//                             </li>
//                             <li>
//                               <p>
//                                 {" "}
//                                 SPO<sub>2</sub>:
//                                 <span>
//                                   {getBindVitalData[0]?.SPO2 || "N/A"} %
//                                 </span>
//                               </p>
//                             </li>
//                           </ul>
//                         </div>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="col-9">
//                     <ul>
//                       <li>
//                         <div>{renderLoadPrisciptionList()}</div>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PrintDesign;


import React from 'react'

const PrintDesign = () => {
  return (
    <div>PrintDesign</div>
  )
}

export default PrintDesign