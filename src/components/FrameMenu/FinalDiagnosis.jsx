// // // import React, { useState ,   useImperativeHandle, forwardRef, } from "react";
// // // import Input from "../../../components/formComponent/Input";
// // // import { t } from "i18next";
// // // import Modal from "../../../components/modalComponent/Modal";
// // // import PatientDaignosisInformationModal from "./PatientDaignosisInformationModal";
// // // import ICDDaignosisDescription from "../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription";
// // // import { AutoComplete } from "primereact/autocomplete";
// // // import {
// // //   DiagnosisInformationSave,
// // //   SearchByICDCode,
// // //   SearchByICDDesc,
// // // } from "../../../networkServices/DoctorApi";
// // // const FinalDiagnosis = forwardRef((props, ref) => {
// // //   console.log(ref, props);
// // //   const {toggleAction,setActionType} = props
// // //   const [modalData, setModalData] = useState({
// // //     visible: false,
// // //     component: null,
// // //     size: null,
// // //     Header: null,
// // //     setVisible: false,
// // //   });
// // //   const [searchByICD, setSearchByICD] = useState({
// // //     searchByICDDecs: "",
// // //   });
// // //   const [suggestions, setSuggestions] = useState([]);
// // //   const handleOpenModal = () => {
// // //     setModalData((prev) => ({ ...prev, visible: true, size: "80vw" }));
// // //   };
// // //   const SearchByICDDescData = async (query) => {
// // //     try {
// // //       const apiRes = await SearchByICDDesc({
// // //         prefixText: query,
// // //         count: 10,
// // //       });

// // //       // Extract the 'who_full_desc' values and update suggestions
// // //       const suggestionData = apiRes?.data?.map((item) => ({
// // //         WHO_Full_Desc: item?.WHO_Full_Desc,
// // //         ICD10_3_Code:item?.ICD10_3_Code        ,
// // //       }));
// // //       console.log(suggestionData);

// // //       setSuggestions(suggestionData);
// // //     } catch (error) {
// // //       console.error(error);
// // //     }
// // //   };
// // //   const itemTemplate = (item) => {
// // //     //console.log(item);

// // //     return (
// // //         <div>
// // //             <strong>{item.WHO_Full_Desc            }</strong>  ({(item?.ICD10_3_Code)  })

// // //         </div>
// // //     );
// // // };


// // //   const SearchByICDDescgetData = (event) => {
// // //     const { query } = event;
// // //     SearchByICDDescData(query); // Trigger the API call with the user's input
// // //   };


// // //   const handleKeyPress = (e) => {
// // //     // if (e.key === "Enter" && searchByICDDecs) {
// // //     //   console.log("Selected ICD Code:", searchByICDDecs);
// // //     //   // Here, you can bind the selected ICD code to the table or perform any other action
// // //     // }
// // //   };

// // //   const handleChangebySerachByICD = (e, name) => {
// // //     const { value } = e;
// // //     setSearchByICD((prev) => ({
// // //       ...prev,
// // //       [name]: value,
// // //     }));
// // //   };

// // //   // Table Save Row API

// const saveDiagnosisInformationSave = async () => {
//   // toggleAction("SaveDiagnosis")
//   debugger
//   setActionType("SaveDiagnosis")
//   try {
//     const res = await DiagnosisInformationSave({
//       diagnosisInformation: [
//         {
//           codeID: "1",
//           icdCode: "M9080/1",
//           patientID: "AM24-08020005",
//           tid: "460",
//         },
//       ],
//     });
//     console.log(res);
//   } catch (error) {}
// };

// useImperativeHandle(ref, () => ({
//   callChildFunctionSaveDiagnosisInformationSave: saveDiagnosisInformationSave,
// }));
// // //   return (
// // //     <>
// // //       <div className="row g-4 m-2 align-items-center">
// // //         <AutoComplete
// // //           completeMethod={(e) => SearchByICDDescgetData(e)}
// // //           className="tag-input"
// // //           value={searchByICD.searchByICDDecs}
// // //           placeholder="Search By ICD Desc and press type enter"
// // //           onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
// // //           suggestions={suggestions}
// // //           name={"searchByICDDecs"}
// // //           // onSelect={(e) => onSelected(e, item?.AccordianName)}
// // //           id="searchByICDDecs"
// // //           onKeyPress={handleKeyPress}
// // //           itemTemplate={itemTemplate}
// // //         />



// // //         <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
// // //           <button
// // //             className="btn btn-sm custom-button w-100"
// // //             onClick={handleOpenModal}
// // //           >
// // //             Create new ICD Code
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {modalData.visible && (
// // //         <Modal
// // //           visible={modalData.visible}
// // //           Header={modalData.Header}
// // //           modalWidth={modalData?.size}
// // //           onHide={modalData?.setVisible}
// // //           // handleAPI={saveDiagnosisInformationSave}
// // //           // handleAPI={modalData.prescription.AccordianName=== "Prescribed Medicine"? handleSaveMedicine:handleSaveTemplate}
// // //           setVisible={() => {
// // //             setModalData((val) => ({ ...val, visible: false }));
// // //           }}
// // //         >
// // //           <PatientDaignosisInformationModal />
// // //         </Modal>
// // //       )}
// // //       <ICDDaignosisDescription />
// // //     </>
// // //   );
// // // } )

// // // export default FinalDiagnosis;

// // import React, { useState, useImperativeHandle, forwardRef } from "react";
// // import { AutoComplete } from "primereact/autocomplete";
// // import { DiagnosisInformationSave, SearchByICDCode, SearchByICDDesc } from "../../../networkServices/DoctorApi";
// // import Modal from "../../../components/modalComponent/Modal";
// // import PatientDaignosisInformationModal from "./PatientDaignosisInformationModal";
// // import ICDDaignosisDescription from "../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription";

// // const FinalDiagnosis = forwardRef((props, ref) => {
// //   const { toggleAction, setActionType } = props;
// //   const [modalData, setModalData] = useState({
// //     visible: false,
// //     component: null,
// //     size: null,
// //     Header: null,
// //     setVisible: false,
// //   });
// //   const [searchByICD, setSearchByICD] = useState({
// //     searchByICDDecs: "",
// //   });
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [selectedICDData, setSelectedICDData] = useState(null);

// //   const handleOpenModal = () => {
// //     setModalData((prev) => ({ ...prev, visible: true, size: "80vw" }));
// //   };

// //   const SearchByICDDescData = async (query) => {
// //     try {
// //       const apiRes = await SearchByICDDesc({
// //         prefixText: query,
// //         count: 10,
// //       });

// //       const suggestionData = apiRes?.data?.map((item) => ({
// //         WHO_Full_Desc: item?.WHO_Full_Desc,
// //         ICD10_3_Code: item?.ICD10_3_Code,
// //         ...item // Include the entire object for later use
// //       }));

// //       setSuggestions(suggestionData);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   const itemTemplate = (item) => (
// //     <div>
// //       <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
// //     </div>
// //   );

// //   const SearchByICDDescgetData = (event) => {
// //     const { query } = event;
// //     SearchByICDDescData(query);
// //   };

// //   const handleChangebySerachByICD = (e, name) => {
// //     const { value } = e;
// //     setSearchByICD((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSelect = (e) => {
// //     const selectedValue = e.value;
// //     setSelectedICDData(selectedValue); // Bind the selected value to display below
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter" && suggestions.length > 0) {
// //       const selectedValue = suggestions[0]; // Automatically select the first suggestion on Enter
// //       setSelectedICDData(selectedValue);
// //       setSearchByICD({ searchByICDDecs: selectedValue.WHO_Full_Desc });
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="row g-4 m-2 align-items-center">
// //         <AutoComplete
// //           completeMethod={(e) => SearchByICDDescgetData(e)}
// //           className="tag-input"
// //           value={searchByICD.searchByICDDecs}
// //           placeholder="Search By ICD Desc and press Enter"
// //           onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
// //           suggestions={suggestions}
// //           name={"searchByICDDecs"}
// //           onSelect={handleSelect}
// //           id="searchByICDDecs"
// //           onKeyPress={handleKeyPress}
// //           itemTemplate={itemTemplate}
// //         />

// //         <div className="col-xl-2 col-md-4 col-sm-4 col-12">
// //           <button className="btn btn-sm custom-button w-100" onClick={handleOpenModal}>
// //             Create new ICD Code
// //           </button>
// //         </div>
// //       </div>

// //       {/* Render the selected ICD data */}
// //       {selectedICDData && (
// //         <div className="selected-icd-data">
// //           <h4>Selected ICD Data:</h4>
// //           <p><strong>Description:</strong> {selectedICDData.WHO_Full_Desc}</p>
// //           <p><strong>ICD Code:</strong> {selectedICDData.ICD10_3_Code}</p>
// //           {/* Add more fields as needed */}
// //         </div>
// //       )}

// //       {modalData.visible && (
// //         <Modal
// //           visible={modalData.visible}
// //           Header={modalData.Header}
// //           modalWidth={modalData?.size}
// //           onHide={modalData?.setVisible}
// //           setVisible={() => {
// //             setModalData((val) => ({ ...val, visible: false }));
// //           }}
// //         >
// //           <PatientDaignosisInformationModal />
// //         </Modal>
// //       )}
// //       <ICDDaignosisDescription />
// //     </>
// //   );
// // });

// // export default FinalDiagnosis;

// import React, { useState, useImperativeHandle, forwardRef } from "react";
// import { AutoComplete } from "primereact/autocomplete";
// import { DiagnosisInformationSave, SearchByICDCode, SearchByICDDesc } from "../../../networkServices/DoctorApi";
// import Modal from "../../../components/modalComponent/Modal";
// import PatientDaignosisInformationModal from "./PatientDaignosisInformationModal";
// import ICDDaignosisDescription from "../../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription";

// const FinalDiagnosis = forwardRef((props, ref) => {
//   const { toggleAction, setActionType } = props;
//   const [modalData, setModalData] = useState({
//     visible: false,
//     component: null,
//     size: null,
//     Header: null,
//     setVisible: false,
//   });
//   const [searchByICD, setSearchByICD] = useState({
//     searchByICDDecs: "",
//   });
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedICDData, setSelectedICDData] = useState([]);

//   const handleOpenModal = () => {
//     setModalData((prev) => ({ ...prev, visible: true, size: "80vw" }));
//   };

//   const SearchByICDDescData = async (query) => {
//     try {
//       const apiRes = await SearchByICDDesc({
//         prefixText: query,
//         count: 10,
//       });

//       const suggestionData = apiRes?.data?.map((item) => ({
//         WHO_Full_Desc: item?.WHO_Full_Desc,
//         ICD10_3_Code: item?.ICD10_3_Code,
//         ...item // Include the entire object for later use
//       }));

//       setSuggestions(suggestionData);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const itemTemplate = (item) => (
//     <div>
//       <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
//     </div>
//   );

//   const SearchByICDDescgetData = (event) => {
//     const { query } = event;
//     SearchByICDDescData(query);
//   };

//   const handleChangebySerachByICD = (e, name) => {
//     const { value } = e;
//     setSearchByICD((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSelect = (e) => {
//     const selectedValue = e.value;
//     setSelectedICDData((prev) => [...prev, selectedValue]); // Add to array
//     setSearchByICD({ searchByICDDecs: "" }); // Clear the input
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && suggestions.length > 0) {
//       const selectedValue = suggestions[0]; // Automatically select the first suggestion on Enter
//       setSelectedICDData((prev) => [...prev, selectedValue]); // Add to array
//       setSearchByICD({ searchByICDDecs: "" }); // Clear the input
//     }
//   };

//   return (
//     <>
//       <div className="row g-4 m-2 align-items-center">
//         <AutoComplete
//           completeMethod={(e) => SearchByICDDescgetData(e)}
//           className="tag-input"
//           value={searchByICD.searchByICDDecs}
//           placeholder="Search By ICD Desc and ICD Code press Enter"
//           onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
//           suggestions={suggestions}
//           name={"searchByICDDecs"}
//           onSelect={handleSelect}
//           id="searchByICDDecs"
//           onKeyPress={handleKeyPress}
//           itemTemplate={itemTemplate}
//         />

//         <div className="col-xl-2 col-md-4 col-sm-4 col-12">
//           <button className="btn btn-sm custom-button w-100" onClick={handleOpenModal}>
//             Create new ICD Code
//           </button>
//         </div>
//       </div>

//       {/* Render the selected ICD data */}
//       {selectedICDData.length > 0 && (
//         <div className="selected-icd-data">
//           <h4>Selected ICD Data:</h4>
//           <ul>
//             {selectedICDData.map((data, index) => (
//               <li key={index}>
//                 <p><strong>Description:</strong> {data.WHO_Full_Desc}</p>
//                 <p><strong>ICD Code:</strong> {data.ICD10_3_Code}</p>
//                 {/* Add more fields as needed */}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {modalData.visible && (
//         <Modal
//           visible={modalData.visible}
//           Header={modalData.Header}
//           modalWidth={modalData?.size}
//           onHide={modalData?.setVisible}
//           setVisible={() => {
//             setModalData((val) => ({ ...val, visible: false }));
//           }}
//         >
//           <PatientDaignosisInformationModal />
//         </Modal>
//       )}
//       <ICDDaignosisDescription />
//     </>
//   );
// });

// export default FinalDiagnosis;




































import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { DeleteDiagnosis, DiagnosisInformationSave, GetPatientDiagnosis, SearchByICDCode, SearchByICDDesc } from "../../networkServices/DoctorApi";
import Modal from "../../components/modalComponent/Modal";
import PatientDaignosisInformationModal from "../../pages/doctor/OPD/PatientDaignosisInformationModal";
import ICDDaignosisDescription from "../../components/UI/customTable/doctorTable/FinalDiagnosis/ICDDaignosisDescription";
import { notify } from "../../utils/utils";
import Heading from "../../components/UI/Heading";
import GetPatientDiagnosisList from "../../components/UI/customTable/doctorTable/FinalDiagnosis/GetPatientDiagnosisList";

const FinalDiagnosis = forwardRef((props, ref) => {
  const { toggleAction, setActionType, patientDetail, data } = props;
  console.log(patientDetail);

  const [modalData, setModalData] = useState({
    visible: false,
    component: null,
    size: null,
    Header: null,
    setVisible: false,
  });
  const [searchByICD, setSearchByICD] = useState({
    searchByICDDecs: "",
  });
  const [apiData, setApiData] = useState({
    GetPatientDiagnosisData: []
  })
  const [suggestions, setSuggestions] = useState([]);
  const [selectedICDData, setSelectedICDData] = useState([]);
  console.log(selectedICDData);

  const [error, setError] = useState(""); // Error state to handle duplicate entries

  const handleOpenModal = () => {
    setModalData((prev) => ({ ...prev, visible: true, size: "80vw" }));
  };

  const SearchByICDDescData = async (query) => {
    try {
      const apiRes = await SearchByICDDesc({
        prefixText: query,
        count: 10,
      });

      const suggestionData = apiRes?.data?.map((item) => ({
        WHO_Full_Desc: item?.WHO_Full_Desc,
        ICD10_3_Code: item?.ICD10_3_Code,
        ...item // Include the entire object for later use
      }));

      setSuggestions(suggestionData);
    } catch (error) {
      console.error(error);
    }
  };

  const itemTemplate = (item) => (
    <div>
      <strong>{item.WHO_Full_Desc}</strong> ({item.ICD10_3_Code})
    </div>
  );

  const SearchByICDDescgetData = (event) => {
    const { query } = event;
    SearchByICDDescData(query);
  };

  const handleChangebySerachByICD = (e, name) => {
    const { value } = e;
    setSearchByICD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSelect = (e) => {
    const selectedValue = e.value;
    const isDuplicate = selectedICDData.some(
      (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
    );

    if (!isDuplicate) {
      setSelectedICDData((prev) => [...prev, selectedValue]);
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      setError(""); // Clear any previous error
    } else {
      const errorMessage = "This ICD code has already been added.";
      setError(errorMessage); // Set the error state
      setSearchByICD({ searchByICDDecs: "" }); // Clear the input
      notify(errorMessage, "error"); // Notify the user
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      const selectedValue = suggestions[0];
      const isDuplicate = selectedICDData.some(
        (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
      );

      if (!isDuplicate) {
        setSelectedICDData((prev) => [...prev, selectedValue]);
        setSearchByICD({ searchByICDDecs: "" }); // Clear the input
        setError(""); // Clear any previous error
      } else {
        const errorMessage = "This ICD code has already been added.";
        setError(errorMessage); // Set the error state
        setSearchByICD({ searchByICDDecs: "" }); // Clear the input
        notify(errorMessage, "error"); // Notify the user
      }
    }
  };

  const handleDelete = (item) => {
    //console.log(item);
    const delItem = selectedICDData.filter((val => val.id !== item.id))
    setSelectedICDData(delItem)
  }

  // const handleSelect = (e) => {
  //   const selectedValue = e.value;
  //   const isDuplicate = selectedICDData.some(
  //     (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
  //   );

  //   if (!isDuplicate) {
  //     setSelectedICDData((prev) => [...prev, selectedValue]);
  //     setSearchByICD({ searchByICDDecs: "" }); // Clear the input
  //     setError(""); // Clear any previous error
  //   } else {
  //     setError("This ICD code has already been added."); // Show error message
  //     setSearchByICD({ searchByICDDecs: "" }); // Clear the input
  //   }
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter" && suggestions.length > 0) {
  //     const selectedValue = suggestions[0];
  //     const isDuplicate = selectedICDData.some(
  //       (item) => item.ICD10_3_Code === selectedValue.ICD10_3_Code
  //     );

  //     if (!isDuplicate) {
  //       setSelectedICDData((prev) => [...prev, selectedValue]);
  //       setSearchByICD({ searchByICDDecs: "" }); // Clear the input
  //       setError(""); // Clear any previous error
  //       // notify(error, "error")
  //     } else {
  //       setError("This ICD code has already been added." ); // Show error message
  //       setSearchByICD({ searchByICDDecs: "" }); // Clear the input
  //       notify(error, "error")
  //     }
  //   }
  // };

  useImperativeHandle(ref, () => ({
    callChildFunctionSaveDiagnosisInformationSave: saveDiagnosisInformationSave,
  }));

  //   const payload = {
  //     "diagnosisInformation":
  //     [
  //     {
  //       "icd_id": "",
  //       "transactionID": "",
  //       "icD_Code": "",
  //       "patientID": "",
  //       "whoFullDesc": "",
  //       "isActive": "",
  //       "isOT": ""
  // }
  // ]
  //   }
  console.log("asdasd", data)
  const saveDiagnosisInformationSave = async () => {
    // toggleAction("SaveDiagnosis")
    // debugger
    // setActionType("SaveDiagnosis")
    const newPayload = {
      "diagnosisInformation": selectedICDData.map((ele) => ({
        "icd_id": ele.icd_id,
        "transactionID": data?.transactionID,
        "icD_Code": ele.ICD10_Code,
        "patientID": data?.patientID,
        "whoFullDesc": ele.WHO_Full_Desc,
        "isActive": 1,
        "isOT": 0
      }))
    };


    try {
      const res = await DiagnosisInformationSave(newPayload);
      console.log(res);

      if (res.success) {
        notify(res.message, "success")
        setSelectedICDData([])
        getGetPatientDiagnosisAPI()
      }
      console.log(res);
    } catch (error) { }
  };


  const getGetPatientDiagnosisAPI = async () => {
    try {
      const res = await GetPatientDiagnosis(
        {
          "patientID": data?.patientID,
          "transactionID": data?.transactionID,
          "appID": data?.app_ID,
        }
      )
      setApiData((prev) => ({ ...prev, GetPatientDiagnosisData: res.data }))
      console.log(res);

    } catch (error) {

    }
  }

  useEffect(() => {
    getGetPatientDiagnosisAPI()
  }, []);

  const handleDeleteGetRow = async (item) => {
    console.log(item);

    try {
      const res = await DeleteDiagnosis(
        {
          "icd_id": item?.icd_id,
          "patientID": data?.patientID,
          "transactionID": data?.transactionID,
          "appID": data?.app_ID,
        }
      )
      console.log(res);

      if (res.success) {
        notify(res.message, "success")
        getGetPatientDiagnosisAPI()
      }
    } catch (error) {

    }
  }

  const handleDiagonosisInsertAPI = () => {
    setModalData({
      visible: false,
    });

  }

  return (
    <>
      <div className="m-2 spatient_registration_card">

        <div className="patient_registration card">
          <Heading
            title={("Patient Diagnosis Information ( with ICD Codes )")}
          // isBreadcrumb={true}
          />
          <div className="row g-4 m-2 align-items-center">



            <AutoComplete
              completeMethod={(e) => SearchByICDDescgetData(e)}
              className="tag-input"
              value={searchByICD.searchByICDDecs}
              placeholder="Search By ICD Desc and press Enter"
              onChange={(e) => handleChangebySerachByICD(e, "searchByICDDecs")}
              suggestions={suggestions}
              name={"searchByICDDecs"}
              onSelect={handleSelect}
              id="searchByICDDecs"
              onKeyPress={handleKeyPress}
              itemTemplate={itemTemplate}
            />

            {/* <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <button className="btn btn-sm btn-success  w-100" onClick={handleOpenModal}>
                Create new ICD Code
              </button>
            </div> */}
            <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex align-items-center">
              <button
                className="btn btn-sm btn-success w-100"
                // onClick={btnValue === "Save"?handleclickSavePatientConsent:handelEditSaveData}
                onClick={saveDiagnosisInformationSave}
              >
                {"Save"}
              </button>
            </div>
          </div></div>
      </div>

      {/* Display error message */}
      {/* {error && notify(error, "error")} */}

      {/* Render the selected ICD data */}
      {/* {selectedICDData.length > 0 && (
        <div className="selected-icd-data">
          <h4>Selected ICD Data:</h4>
          <ul>
            {selectedICDData.map((data, index) => (
              <li key={index}>
                <p><strong>Description:</strong> {data.WHO_Full_Desc}</p>
                <p><strong>ICD Code:</strong> {data.ICD10_3_Code}</p>
              
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {modalData.visible && (
        <Modal
          visible={modalData.visible}
          Header={"Patient Diagnosis Information ( with ICD Codes )"}
          modalWidth={modalData?.size}
          onHide={modalData?.setVisible}
          setVisible={() => {
            setModalData((val) => ({ ...val, visible: false }));
          }}
          handleAPI={handleDiagonosisInsertAPI}
        >
          <PatientDaignosisInformationModal />
        </Modal>
      )}
      <ICDDaignosisDescription tbody={selectedICDData} handleDelete={handleDelete} />
      {/* <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 d-flex align-items-center">
              <button
                className="btn btn-sm custom-button w-100"
                // onClick={btnValue === "Save"?handleclickSavePatientConsent:handelEditSaveData}
                // onClick={handleclickSavePatientConsent}
              >
              {"btnValue"}
              </button>
              </div> */}
      <GetPatientDiagnosisList tbody={apiData.GetPatientDiagnosisData} handleDelete={handleDeleteGetRow} />
    </>
  );
});

export default FinalDiagnosis;
