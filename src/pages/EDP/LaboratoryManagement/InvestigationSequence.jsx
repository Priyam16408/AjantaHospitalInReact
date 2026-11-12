import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BindCategorylabortarymanagment,
  BindinvestigationLabOutSource,
  BindInvestigationOrder,
  LoadHeadDepartment,
  SaveInvestigationOrder,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
function InvestigationSequence({ data }) {
  const [departmentData, setDepartmentData] = useState([]);
  const [investigation, settInvestigation] = useState([]);
  const [bindInvestigation, setBindInvestigation] = useState([]);
  const [enabledIndexes, setEnabledIndexes] = useState({});
  console.log(enabledIndexes, "enabledIndexesenabledIndexes", investigation);
  const handleCheckboxChange = (index) => {
    setEnabledIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const [t] = useTranslation();
  const [values, setValues] = useState({
    departmentName: "",
    category: "",
    description: "",
    searchdescription: "",
  });
  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const theadData = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Investigation Name") },
    { width: "15%", name: t("Print Sequence No.") },
    { width: "10%", name: t("Print Separate") },
    { width: "15%", name: t("OutSource") },
    { width: "15%", name: t("OutSource Lab Name") },
    { width: "10%", name: t("Report Type") },
  ];

  const reportTypes = [
    { value: "1", label: "Numeric Report" },
    { value: "3", label: "Text Report" },
    { value: "5", label: "Radiology Report" },
  ];

  // BindCategorylabortarymanagment

  const handleBindCategory = async () => {
    try {
      const response = await LoadHeadDepartment();
      if (response.success) {
        setDepartmentData(response?.data);
        console.log("the response from api is work", response);
      } else {
        setDepartmentData([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setDepartmentData([]);
    }
  };

  //   BindinvestigationLabOutSource,

  const handleBindinvestigationLabOutSource = async () => {
    try {
      const response = await BindinvestigationLabOutSource();
      if (response.success) {
        // setObservation(response?.data);
        console.log("the observation data table is", response);
        setBindInvestigation(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindInvestigation([]);
    }
  };

  const handleBindInvestigationOrder = async () => {
    try {
      const response = await BindInvestigationOrder(
        values?.departmentName?.value
      );
      if (response.success) {
        // setObservation(response?.data);
        console.log("the observation data table is", response);
        settInvestigation(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        settInvestigation([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      settInvestigation([]);
    }
  };

  const handleUpdate = async () => {
    let payload = {
      investigationDetail: investigation?.map((val, index) => ({
        printSeparate: val?.PrintSeperate || 0,
        outSource: val?.IsOutSource || 0,
        reportType: Number(val?.ReportType) || 0,
        investigationID: Number(val?.Investigation_id) || index + 1,
      })),
    };
    try {
      let apiResp = await SaveInvestigationOrder(payload);
      if (apiResp?.success) {
        notify(apiResp?.message, "success");
      } else {
        console.log(apiResp?.message);
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error saving investigation order:", error);
      notify("Failed to save investigation order", "error");
    }
  };

  const handleSelectLab = (name, value, index) => {
    let data = [...investigation];
    data[index][name] = value;
    settInvestigation(data);
    // setValues((val) => ({ ...val, [name]: value }));
  };
  const handleSelectOutSource = (name, value, index) => {
debugger
    let data = [...investigation];
    data[index][name] = value.value;
    settInvestigation(data);
    debugger
    // setValues((val) => ({ ...val, [name]: value }));
  };

  const handleCheckboxFieldChange = (index, fieldName, value) => {
    debugger
    const updatedInvestigation = [...investigation];
    updatedInvestigation[index][fieldName] = value ? 1 : 0;
    settInvestigation(updatedInvestigation);
  };

  useEffect(() => {
    handleBindCategory();
    handleBindinvestigationLabOutSource();
  }, []);

  //   handleBindInvestigationOrder
  useEffect(() => {
    handleBindInvestigationOrder();
  }, [values?.departmentName?.value]);

  return (
    <>
      <div className="spatient_registration_card card">
        <Heading
          title={data?.breadcrumb}
          // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Department Name")}
            id={"departmentName"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            name="departmentName"
            dynamicOptions={[
              //   { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                departmentData,
                "Name",
                "ObservationType_ID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.departmentName?.value}`}
          />
        </div>

        {investigation?.length > 0 ? (
          <>
            <Tables
              thead={theadData}
              tbody={investigation?.map((val, index) => ({

                sno: index + 1,
                Name: val?.Name,
                PrintSequence: val?.ReportType,
                PrintSeparate: <> <input type="checkbox" checked={val?.PrintSeperate}
                  onChange={(e) =>
                    handleCheckboxFieldChange(index, 'PrintSeperate', e.target.checked)
                  }
                /> </>,
                outSource: (
                  <input
                    type="checkbox"
                    onChange={() => {
                      handleCheckboxChange(index);
                      console.log("Checkbox Rendered", index);
                    }}
                    checked={enabledIndexes[index] || false}
                  />
                ),
                outSourceLabName: (
                  <ReactSelect
                    placeholderName={t("OutSource Name")}
                    id={`outSourceName_${index}`}
                    searchable={true}
                    dynamicOptions={handleReactSelectDropDownOptions(
                      bindInvestigation,
                      "Name",
                      "ID"
                    )}
                    value={val?.outSourceName}
                    handleChange={(name, value) =>
                      handleSelectLab(name, value, index)
                    }
                    name="outSourceName"
                    isDisabled={!enabledIndexes[index]}
                  />
                ),
                NumericeReport: (
                  <ReactSelect
                    placeholderName={t("Report Type")}
                    id="ReportType"
                    searchable={true}
                    dynamicOptions={reportTypes}
                    value={val?.ReportType}
                    handleChange={(name, value) =>
                      handleSelectOutSource(name, value, index)
                    }
                    name="ReportType"
                  />
                ),
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
            />

            <div className="col-sm-12 d-flex justify-content-end gap-2">
              <button
                className="btn btn-sm btn-success m-2"
                type="button"
                onClick={handleUpdate}
              >
                {t("Update")}
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default InvestigationSequence;

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import ReactSelect from "../../../components/formComponent/ReactSelect";
// import {
//   BindCategorylabortarymanagment,
//   BindinvestigationLabOutSource,
//   BindInvestigationOrder,
//   SaveInvestigationOrder,
//   LoadHeadDepartment,
// } from "../../../networkServices/edpApi";
// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import Tables from "../../../components/UI/customTable";

// function InvestigationSequence() {
//   const [departmentData, setDepartmentData] = useState([]);
//   const [investigation, settInvestigation] = useState([]);
//   const [bindInvestigation, setBindInvestigation] = useState([]);
//   const [enabledIndexes, setEnabledIndexes] = useState({});
//   const [t] = useTranslation();
//   const [values, setValues] = useState({
//     departmentName: "",
//     category: "",
//     description: "",
//     searchdescription: "",
//   });

//   const handleChange = (e) => {
//     setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = useCallback((index) => {
//     setEnabledIndexes((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   }, []);

//   const theadData = [
//     { width: "5%", name: t("SNo") },
//     { width: "15%", name: t("Investigation Name") },
//     { width: "15%", name: t("Print Sequence No.") },
//     { width: "10%", name: t("Print Separate") },
//     { width: "15%", name: t("OutSource") },
//     { width: "15%", name: t("OutSource Lab Name") },
//     { width: "10%", name: t("Report Type") },
//   ];

//   const reportTypes = [
//     { value: "1", label: "Numeric Report" },
//     { value: "3", label: "Text Report" },
//     { value: "5", label: "Radiology Report" },
//   ];

//   const handleBindCategory = async () => {
//     try {
//       const response = await LoadHeadDepartment();
//       if (response.success) {
//         setDepartmentData(response?.data);
//       } else {
//         setDepartmentData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setDepartmentData([]);
//     }
//   };

//   const handleBindinvestigationLabOutSource = async () => {
//     try {
//       const response = await BindinvestigationLabOutSource();
//       if (response.success) {
//         setBindInvestigation(response?.data);
//       } else {
//         console.error("API returned success as false or invalid response:", response);
//         setBindInvestigation([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       setBindInvestigation([]);
//     }
//   };

//   const handleBindInvestigationOrder = async () => {
//     try {
//       const response = await BindInvestigationOrder(values?.departmentName?.value);
//       if (response.success) {
//         settInvestigation(response?.data);
//       } else {
//         console.error("API returned success as false or invalid response:", response);
//         settInvestigation([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department data:", error);
//       settInvestigation([]);
//     }
//   };

//   const handleUpdate = async () => {
//     const payload = {
//       investigationDetail: investigation?.map((val, index) => ({
//         printSeparate: val?.value || 0,
//         outSource: val?.outSourceName?.value,
//         reportType: val?.reportType?.value || 0,
//         investigationID: val?.investigationID || index + 1,
//       })),
//     };
//     try {
//       let apiResp = await SaveInvestigationOrder(payload);
//       if (apiResp?.success) {
//         notify(apiResp?.message, "success");
//       } else {
//         console.log(apiResp?.message);
//         notify(apiResp?.message, "error");
//       }
//     } catch (error) {
//       console.error("Error saving investigation order:", error);
//       notify("Failed to save investigation order", "error");
//     }
//   };

//   const handleSelectLab = (name, value, index) => {
//     let data = [...investigation];
//     data[index][name] = value;
//     settInvestigation(data);
//   };

//   const handleSelectOutSource = (name, value, index) => {
//     let data = [...investigation];
//     data[index][name] = value;
//     settInvestigation(data);
//   };

//   useEffect(() => {
//     handleBindCategory();
//     handleBindinvestigationLabOutSource();
//   }, []);

//   useEffect(() => {
//     handleBindInvestigationOrder();
//   }, [values?.departmentName?.value]);

//   const memoizedRows = useMemo(() => {
//     return investigation?.map((val, index) => ({
//       sno: index + 1,
//       Name: val?.Name,
//       PrintSequence: val?.ReportType,
//       PrintSeparate: <input type="checkbox" />,
//       outSource: (
//         <input
//           type="checkbox"
//           onChange={() => handleCheckboxChange(index)}
//           checked={enabledIndexes[index] || false}
//         />
//       ),
//       outSourceLabName: (
//         <ReactSelect
//           placeholderName={t("OutSource Name")}
//           id={`outSourceName_${index}`}
//           searchable={true}
//           dynamicOptions={handleReactSelectDropDownOptions(bindInvestigation, "Name", "ID")}
//           value={val?.outSourceName}
//           handleChange={(name, value) => handleSelectLab(name, value, index)}
//           name="outSourceName"
//           isDisabled={!enabledIndexes[index]}
//         />
//       ),
//       NumericeReport: (
//         <ReactSelect
//           placeholderName={t("Report Type")}
//           id="reportType"
//           searchable={true}
//           dynamicOptions={reportTypes}
//           value={val?.reportType}
//           handleChange={(name, value) => handleSelectOutSource(name, value, index)}
//           name="reportType"
//         />
//       ),
//     }));
//   }, [investigation, enabledIndexes]);

//   return (
//     <>
//       <div className="spatient_registration_card card">
//         <Heading title={t("/")} isBreadcrumb={true} />
//         <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
//           <ReactSelect
//             placeholderName={t("Department Name")}
//             id={"departmentName"}
//             searchable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             name="departmentName"
//             dynamicOptions={[
//               ...handleReactSelectDropDownOptions(departmentData, "Name", "ObservationType_ID"),
//             ]}
//             handleChange={handleSelect}
//             value={`${values?.departmentName?.value}`}
//           />
//         </div>

//         {investigation?.length > 0 ? (
//           <>
//             <Tables
//               thead={theadData}
//               tbody={memoizedRows}
//               tableHeight={"scrollView"}
//               style={{ height: "60vh", padding: "2px" }}
//             />

//             <div className="col-sm-12 d-flex justify-content-end gap-2">
//               <button
//                 className="btn btn-sm btn-success m-2"
//                 type="button"
//                 onClick={handleUpdate}
//               >
//                 {t("Update")}
//               </button>
//             </div>
//           </>
//         ) : (
//           <div>No investigations available</div>
//         )}
//       </div>
//     </>
//   );
// }

// export default InvestigationSequence;
