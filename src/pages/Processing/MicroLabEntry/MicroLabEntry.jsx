import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import { notify } from "../../../utils/utils";
import {
  GetMicroScopyDataAfterSave,
  LabGetMicroScopyData,
  MicroLabEntrySavedData,
  MicroLabEntryy,
  SaveIncubationdataa,
  SaveMicroScopicdataa,
  SavePlatingdataa,
  UpdateAllMicroLab,
} from "../../../networkServices/LabWorkSheet";
import Tables from "../../../components/UI/customTable";
import LabeledInput from "../../../components/formComponent/LabeledInput"; 
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import CustomLabTable from "../../../components/UI/customTable/CustomLabTable";

function MicroLabEntry() {
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [patientData, setPatientData] = useState({});
  // const [Incubation, setIncubation] = useState({});
  const [microLabData, setMicroLabData] = useState([]);
  const [getMicroData, setMicroData] = useState([]);
  const [platingData, setPlatingData] = useState([]);
  const [t] = useTranslation();
  const type = [
    { value: "Microscopic", label: "MicroScopy" },
    { value: "Plating", label: "Plating" },
    { value: "Incubation", label: "Incubation" },
    { value: "ALL", label: "All" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    PatientName: "",
    LABNo: "",
    UHID: "",
    type: { value: "ALL", label: "ALL" },
    SampleCollected: { value: "N", label: "Sample Not Colleted" },
    Department: { value: "0", label: "ALL" },
    Doctor: { value: "0", label: "ALL" },
    Panel: { value: "", label: "ALL" },
    Status: { value: "0", label: "ALL" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    PatientTypeTest: { value: "0", label: "ALL" },
    PrintStatus: { value: "0", label: "ALL" },
  });
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(getMicroData);

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "10%", name: t("UHID No") },
    { width: "10%", name: t("Barcode No") },
    { width: "15%", name: t("Patient Name") },
    { width: "15%", name: t("Test Name") },
  ];

  const theadmicroLabPatient = [
    { width: "5%", name: t("SNo") },
    { width: "10%", name: t("Observation.") },
    { width: "10%", name: t("Value.") },
    { width: "15%", name: t("Unit") },
  ];

  const handleSearchSampleCollection = async (status) => {
    const payload = {
      cultureStatus: values?.type?.value?.toString(),
      startDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      endDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      patientID: values?.UHID,
      barcodeNo: values?.BarcodeNo,
      status: status,
    };
    try {
      const apiResp = await MicroLabEntryy(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          return val;
        });
        notify(`${data.length} records found`, "success");
        setTbodyPatientDetail(data);
        console.log("the microlabEntry data is", data);
      } else {
        notify("No records found", "error");
        setTbodyPatientDetail([]);
      }
      setMicroLabData([]);
      setPlatingData([]);

      setPatientData({});
    } catch (error) {
      setMicroLabData([]);
      setPlatingData([]);

      setPatientData({});
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const handleLabGetMicroScopyData = async (data) => {
    let payload = {
      investigationId: data?.Investigation_ID,
      labNo: data?.LedgerTransactionNo,
      barcodeNo: data?.BarcodeNo,
      gender: data?.Gender,
      ageInDays: data?.AgeInDays,
      testId: data?.Test_ID,
    };
    try {
      const apiResp = await LabGetMicroScopyData(payload);
      if (apiResp.success) {

        console.log("the api response data is",apiResp)
        // let data = apiResp?.data?.map((val) => {
        //   return val;
        // });

        // const final = data?.map((ele) => {
        //   return {
        //     ...ele,
        //     NoofPlate: "0",
        //   };
        // });
        setMicroLabData(apiResp?.data);
      } else {
        setMicroLabData([]);
      }
    } catch (error) {
      setMicroLabData([]);
    }
  };
  console.log(patientData);

  
  const [microScopyDataAfterSave,setMicroScopyDataAfterSave] = useState([]);
  const handleGetMicroScopyDataAfterSave = async (index)=>{
    const patientData = tbodyPatientDetail[index];
    console.log("the patinent data is handleGetMicroScopyDataAfterSave" ,patientData);
    const payload = 
      {
        "investigationId": patientData?.Investigation_ID,
        "labNo": patientData?.LedgerTransactionNo,
        "barcodeNo": patientData?.BarcodeNo,
        "gender": patientData?.Gender,
        "ageInDays": patientData?.Age,
        "testId": patientData?.Test_ID
      }


      try {
        const apiResp = await GetMicroScopyDataAfterSave(payload);
        console.log(apiResp);
        if (apiResp.success) {
          setMicroScopyDataAfterSave(apiResp?.data);
          console.log("the api respone data is",apiResp);
        } else {
          notify(apiResp?.message, "error");
        }
      } catch (error) {
        notify(apiResp?.message, "error");
      }
    
  }
  const handleMicroLabEntrySavedData = async (_, index) => {
   
    const patientData = tbodyPatientDetail[index];
    handleLabGetMicroScopyData(tbodyPatientDetail[index]);

    setPatientData(patientData);
    const params = {
      testid: String(patientData.Test_ID),
    };
    try {
      const response = await MicroLabEntrySavedData(params);
      console.log(response);
      if (response.success) {
        const platingData = response.data;
        if (!platingData[0]?.PlateNumber == "") {
          const values = platingData[0]?.PlateNumber.split(",");
          const result = values?.map((value) => ({ plateNumber: value }));
          setPlatingData(result);
          handleGetMicroScopyDataAfterSave(index);
        } else {
          setPlatingData([]);
        }

        setMicroData(response.data);
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
  const ip = localStorage.getItem("ip");

  //

  const getRowClass = (val, index) => {
    let type = tbodyPatientDetail[index]?.rowcolor;
    if (type === "lightyellow") {
      return "color-indicator-11-bg";
    } else if (type === "#00FFFF") {
      return "color-indicator-2-bg";
    }
    else if (type === "pink") {
      return "color-indicator-19-bg";
    }
    else if (type === "lightgreen") {
      return "color-indicator-15-bg";
    } 
  };

  const [selectedValue, setSelectedValue] = useState(0);

  const handleDropdownChange = (event) => {
    setSelectedValue(parseInt(event.target.value));
  };

  const renderTableRows = () => {
    // SavePlatingdataa

    const rows = [];
    for (let i = 0; i < selectedValue; i++) {
      rows.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            <Input
              type="text"
              className="form-control"
              placeholder={`Enter Plate ${i + 1}`}
              id={`comment-${i + 1}`}
              name={`comment-${i + 1}`}
              style={{ border: "1px solid green", width: "90%" }}
            />
          </td>
        </tr>
      );
    }
    return rows;
  };
  // fix bug
  const MicroScopyComponent = ({ data, _ }) => {
    const [bodyData, setBodyData] = useState(microLabData);
    const handleSaveMicroScopicdata = async () => {
      const finalData = bodyData?.map((ele) => {
        return {
          ...ele,
          ipAddress: ip,
          test_ID: data?.Test_ID,
          labObservation_ID: ele?.labObservation_ID,
          labObservationName: ele?.labObservationName,
          value: ele?.valueinput,
          readingFormat: ele?.Unit,
          reportType: "Preliminary 1",
          ledgerTransactionNo: data?.LedgerTransactionNo,
          barcodeNo: data?.BarcodeNo,
        };
      });

      try {
        const apiResp = await SaveMicroScopicdataa(finalData);
        if (apiResp.success) {
          setMicroLabData([]);
          setPlatingData([]);
          handleSearchSampleCollection("");
          setPatientData({});
        } else {
          toast.error("Error Occured");
        }
      } catch (error) {
        toast.error("Error Occured");
      }
    };
    const handleMicroChange = (e, index) => {
      const data = JSON.parse(JSON.stringify(microLabData));
      data[index][e.target.name] = e.target.value;
      setBodyData(data);
    };
 
    return (
      <>
        {theadmicroLabPatient.length > 0 && (
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="data-display">
                  <div className="mb-4">
                    <Tables
                      thead={theadmicroLabPatient}
                      tbody={bodyData?.map((val, index) => ({
                        sno: index + 1,
                        objervation: val.labObservationName || "",
                        value: (
                          <Input
                            type="text"
                            className="table-input"
                            removeFormGroupClass={true}
                            name="valueinput"
                            placeholder=" "
                            value={val.valueinput ? val.valueinput : ""}
                            onChange={(e) => handleMicroChange(e, index)}
                          />
                        ),
                        unit: (
                          <Input
                            type="text"
                            className="form-control"
                            id="Unit"
                            name="Unit"
                            lable={t("")}
                            placeholder=" "
                            value={val.Unit ? val.Unit : ""}
                            onChange={(e) => handleMicroChange(e, index)}
                          />
                        ),
                      }))}
                      tableHeight={"scrollView"}
                    />

                    {microLabData.length > 0 ? (
                      <button
                        onClick={handleSaveMicroScopicdata}
                        className="mt-4 col-sm-2 btn btn-block btn-info"
                      >
                        Save
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const PlatingComponent = ({ data, show }) => {
    const [microLabDetail, setMicroLabDetail] = useState({
      PlatingComment: "",
      NoofPlate: "0",
    });

    const [platingData, setPlatingData] = useState([]);

    const handleSavePlatingdataa = async () => {
      const plateNumbers = platingData
        .map((item) => item.plateNumber)
        .join(",");
      const payload = {
        test_ID: data?.Test_ID,
        noofPlate: microLabDetail.NoofPlate,
        plateNumber: plateNumbers,
        platingComment: microLabDetail.PlatingComment,
        ipAddress: ip,
      };

      try {
        const apiResp = await SavePlatingdataa(payload);
        console.log(apiResp);
        if (apiResp.success) {
          setMicroLabData([]);
          setPlatingData([]);
          handleSearchSampleCollection("");
          setPatientData({});
        } else {
          notify("Error Occured", "error");
        }
      } catch (error) {
        notify("Error occurred while saving data", "error");
      }
    };

    const handlePlatingChangeNumber = (e, index) => {
      const updatedData = [...platingData];
      updatedData[index][e.target.name] = e.target.value;
      setPlatingData(updatedData);
    };

    const handlePlatingChange = (e) => {
      const { name, value } = e.target;
      setMicroLabDetail((prev) => ({ ...prev, [name]: value }));

      if (name === "NoofPlate") {
        const noOfPlates = parseInt(value, 10);
        const updatedPlatingData = Array.from(
          { length: noOfPlates },
          (_, index) => {
            return platingData[index] || { plateNumber: "" };
          }
        );
        setPlatingData(updatedPlatingData);
      }
    };

    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <label
            htmlFor="dropdown"
            style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
          >
            No of Plate:
          </label>
          <select
            id="dropdown"
            className="form-control"
            name="NoofPlate"
            value={microLabDetail.NoofPlate}
            onChange={handlePlatingChange}
            style={{ maxWidth: "80px" }}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <Input
            type="text"
            placeholder="Enter Plating Comments"
            className="form-control"
            id="PlatingComment"
            name="PlatingComment"
            value={microLabDetail.PlatingComment}
            onChange={handlePlatingChange}
            label="Enter Plating Comments"
          />
        </div>

        <CustomLabTable>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Plate Number</th>
            </tr>
          </thead>
          <tbody>
            {platingData.map((ele, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <Input
                    type="text"
                    placeholder="Enter Plate Number"
                    className="form-control"
                    id={`plateNumber-${index}`}
                    name="plateNumber"
                    value={ele.plateNumber}
                    onChange={(e) => handlePlatingChangeNumber(e, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </CustomLabTable>

        <button
          onClick={handleSavePlatingdataa}
          type="button"
          className="btn btn-primary col-sm-2 btn-block mt-2 mb-2"
        >
          Save
        </button>
      </div>
    );
  };

  const handleSaveIncubationdataa = async () => {
    let payload = {
      test_ID: patientData?.Test_ID,
      incubationPeriod: microLabData[0]?.incubationPeriod || "",
      incubationBatch: microLabData[0]?.incubationBatch || "",
      incubationComment: microLabData[0]?.incubationComment || "",
      ipAddress: ip,
    };

    try {
      const apiResp = await SaveIncubationdataa(payload);
      if (apiResp.success) {
        setMicroLabData([]);
        setPlatingData([]);
        handleSearchSampleCollection("");
        setPatientData({});
      } else {
        notify("Some error occured", "error");
      }
    } catch (error) {
      notify("Error occurred while saving data", "error");
    }
  };

  // fix bug
  const IncubationComponent = ({
    data,
    show,
    microLabData,
    setMicroLabData,
  }) => {
    console.log(data, microLabData);
    const [values, setValues] = useState({});
    const handleIncubationChange = (e) => {
      setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
      microLabData[0][e.target.name] = e.target.value;
      setMicroLabData(microLabData);
    };
    return (
      <>
        <div className="">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="timedropdown"
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              Incubation Period:
            </label>
            <select
              id="timedropdown"
              name="incubationPeriod"
              className="form-control"
              value={microLabData[0]?.incubationPeriod || ""}
              onChange={handleIncubationChange}
              style={{ maxWidth: "80px" }}
            >
              <option value="">Select</option>
              <option value="12">12 Hours</option>
              <option value="24">24 Hours</option>
              <option value="48">48 Hours</option>
              <option value="7d">7 Days</option>
              <option value="14d">14 Days</option>
            </select>
          </div>

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="incubationBatch"
            name="incubationBatch"
            value={values?.incubationBatch ? values?.incubationBatch : ""}
            onChange={handleIncubationChange}
            lable={t("Batch/Rack No")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="incubationComment"
            name="incubationComment"
            value={microLabData[0]?.incubationComment || ""}
            onChange={handleIncubationChange}
            lable={t("Incubation Comment")}
            respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
          />
        </div>

        <button
          type="button"
          onClick={handleSaveIncubationdataa}
          className="btn btn-primary col-sm-2 btn-block mt-2 mb-2 ml-2"
        >
          Save
        </button>
      </>
    );
  }; 

  // const UpdateComponent = ({ data, show }) => { 

  //   const handleUpdateAllMicroLab = async () => {
  //     const plateNumbers = platingData
  //       .map((item) => item.plateNumber)
  //       .join(",");
  //     const payload = {
  //       testID: data?.Test_ID || "",
  //       microScopic: getMicroData[0]?.MicroScopic || "",
  //       microScopicComment: getMicroData[0]?.MicroScopicComment || "",
  //       noofPlate: getMicroData[0]?.NoofPlate || "",
  //       platingComment: getMicroData[0]?.PlatingComment || "",
  //       plateNumber: plateNumbers,
  //       incubationPeriod: getMicroData[0]?.IncubationPeriod || "",
  //       incubationBatch: getMicroData[0]?.IncubationBatch || "",
  //       incubationComment: getMicroData[0]?.IncubationComment || "",
  //       ipAddress: ip,
  //       datatosave: microLabData.map((item) => ({
  //         test_ID: data?.Test_ID || "",
  //         labObservation_ID: data.LedgerTransactionNo || "",
  //         labObservationName: data.labObservationName || "",
  //         value: item.value || "",
  //         readingFormat: item.readingFormat || "",
  //         reportType: item.reportType || "",
  //       })),
  //     };

  //     try {
  //       const apiResp = await UpdateAllMicroLab(payload);
  //       console.log(apiResp);
  //       if (apiResp.success) {
  //         notify("Update SuccessFull...", "success");
  //         handleSearchSampleCollection("");
  //       } else {
  //         notify("Error occurred while saving data", "error");
  //       }
  //     } catch (error) {
  //       notify("Error occurred while saving data", "error");
  //     }
  //   };

  //   const handleMicroUpdateChange = (e, index = null, isPlating = false) => {
  //     const { name, value } = e.target;

  //     if (isPlating && index !== null) {
  //       setPlatingData((prev) =>
  //         prev.map((item, i) =>
  //           i === index ? { ...item, [name]: value } : item
  //         )
  //       );
  //     } else {
  //       setMicroData((prev) =>
  //         prev.map((item) => ({
  //           ...item,
  //           [name]: value,
  //         }))
  //       );
  //     }
  //   };

  //   const handleNoofPlateChange = (e) => {
  //     const noOfPlates = Number(e.target.value);
  //     const updatedPlatingData = Array.from(
  //       { length: noOfPlates },
  //       (_, index) => platingData[index] || { plateNumber: "" }
  //     );
  //     setPlatingData(updatedPlatingData);

  //     setMicroData((prev) =>
  //       prev.map((item) => ({
  //         ...item,
  //         NoofPlate: e.target.value,
  //       }))
  //     );
  //   };

  //   return (
  //     <>
  //       <div className="container-fluid">
  //         <div className="row">
  //           <div className="col-lg-6 col-md-12">
  //             <div className="data-display">
  //               <div className="mb-4">
  //                 <Tables
  //                   thead={theadmicroLabPatient}
  //                   tbody={microScopyDataAfterSave?.map((val, index) => ({
  //                     sno: index + 1,
  //                     objervation: val.labObservationName || "",
  //                     value: (
  //                       <Input
  //                         type="text"
  //                         className="form-control"
  //                         id="value"
  //                         name="value"
  //                         placeholder=" "
  //                         value={val.value || ""}
  //                         onChange={(e) => handleMicroUpdateChange(e)}
  //                       />
  //                     ),
  //                     unit: (
  //                       <Input
  //                         type="text"
  //                         className="form-control"
  //                         id="Unit"
  //                         name="Unit"
  //                         placeholder=" "
  //                         value={val.Unit || ""}
  //                         onChange={(e) => handleMicroUpdateChange(e)}
  //                       />
  //                     ),
  //                   }))}
  //                   tableHeight={"scrollView"}
  //                 />
  //               </div>
  //             </div>

  //             <div>
  //               <p style={{ fontWeight: "bold" }}>
  //                 MicroScopy Done By :
  //                 <span style={{ fontWeight: "400" }}>
  //                   {" "}
  //                   {getMicroData[0]?.MicroScopicDoneBy}{" "}
  //                 </span>
  //               </p>
  //               <p style={{ fontWeight: "bold" }}>
  //                 Plating Done By :
  //                 <span style={{ fontWeight: "400" }}>
  //                   {" "}
  //                   {getMicroData[0]?.PlatingDoneBy}{" "}
  //                 </span>
  //               </p>
  //               <p style={{ fontWeight: "bold" }}>
  //                 Incubation Done By :
  //                 <span style={{ fontWeight: "400" }}>
  //                   {" "}
  //                   {getMicroData[0]?.IncubationDoneBy}{" "}
  //                 </span>
  //               </p>
  //             </div>
  //           </div>

  //           <div className="col-lg-6 col-md-12">
  //             <div
  //               style={{
  //                 display: "flex",
  //                 alignItems: "center",
  //                 gap: "10px",
  //                 marginBottom: "20px",
  //               }}
  //             >
  //               <label
  //                 htmlFor="dropdown"
  //                 style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
  //               >
  //                 No of Plate:
  //               </label>
  //               <select
  //                 id="dropdown"
  //                 className="form-control"
  //                 name="NoofPlate"
  //                 value={getMicroData[0]?.NoofPlate || ""}
  //                 onChange={handleNoofPlateChange}
  //                 style={{ maxWidth: "80px" }}
  //               >
  //                 <option value="0">0</option>
  //                 <option value="1">1</option>
  //                 <option value="2">2</option>
  //                 <option value="3">3</option>
  //                 <option value="4">4</option>
  //               </select>

  //               <Input
  //                 type="text"
  //                 placeholder=" "
  //                 className="form-control"
  //                 id="PlatingComment"
  //                 name="PlatingComment"
  //                 value={getMicroData[0]?.PlatingComment || ""}
  //                 onChange={handleMicroUpdateChange}
  //                 lable={t("Enter Plating Comments")}
  //                 respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
  //               />
  //             </div>

  //             <div className="mb-3">
  //               <CustomLabTable>
  //                 <thead>
  //                   <tr>
  //                     <th>Sr.No</th>
  //                     <th>Plate Number</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {platingData?.map((ele, index) => (
  //                     <tr key={index}>
  //                       <td>{index + 1}</td>
  //                       <td>
  //                         <Input
  //                           type="text"
  //                           placeholder=" "
  //                           className="form-control"
  //                           id="plateNumber"
  //                           name="plateNumber"
  //                           value={ele?.plateNumber || ""}
  //                           onChange={(e) =>
  //                             handleMicroUpdateChange(e, index, true)
  //                           }
  //                         />
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </CustomLabTable>
  //             </div>

  //             <div
  //               style={{
  //                 display: "flex",
  //                 alignItems: "center",
  //                 gap: "10px",
  //                 marginBottom: "20px",
  //               }}
  //             >
  //               <label
  //                 htmlFor="timedropdown"
  //                 style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
  //               >
  //                 Incubation Period:
  //               </label>
  //               <select
  //                 id="timedropdown"
  //                 name="IncubationPeriod"
  //                 value={getMicroData[0]?.IncubationPeriod || ""}
  //                 onChange={handleMicroUpdateChange}
  //                 className="form-control"
  //                 style={{ maxWidth: "80px" }}
  //               >
  //                 <option value="12">12 Hours</option>
  //                 <option value="24">24 Hours</option>
  //                 <option value="48">48 Hours</option>
  //                 <option value="7d">7 Days</option>
  //                 <option value="14d">14 Days</option>
  //               </select>
  //             </div>

  //             <Input
  //               type="text"
  //               placeholder=" "
  //               className="form-control"
  //               id="IncubationBatch"
  //               name="IncubationBatch"
  //               value={getMicroData[0]?.IncubationBatch || ""}
  //               onChange={handleMicroUpdateChange}
  //               lable={t("Batch/Rack No")}
  //               respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
  //             />

  //             <Input
  //               type="text"
  //               placeholder=" "
  //               className="form-control"
  //               id="IncubationComment"
  //               name="IncubationComment"
  //               value={getMicroData[0]?.IncubationComment || ""}
  //               onChange={handleMicroUpdateChange}
  //               lable={t("Incubation Comment")}
  //               respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
  //             />
  //           </div>

  //           <div>
  //             <p style={{ fontWeight: "bold" }}>
  //               MicroScopicDate:
  //               <span style={{ fontWeight: "400" }}>
  //                 {getMicroData[0]?.MicroScopicDate}
  //               </span>
  //             </p>

  //             <p style={{ fontWeight: "bold" }}>
  //               PlatingDate :
  //               <span style={{ fontWeight: "400" }}>
  //                 {getMicroData[0]?.PlatingDate}
  //               </span>
  //             </p>

  //             <p style={{ fontWeight: "bold" }}>
  //               IncubationDate :
  //               <span style={{ fontWeight: "400" }}>
  //                 {getMicroData[0]?.IncubationDate}
  //               </span>
  //             </p>
  //           </div>
  //         </div>

  //         <button
  //           onClick={handleUpdateAllMicroLab}
  //           type="button"
  //           className="btn btn-primary col-sm-2 btn-block mt-2 mb-2"
  //         >
  //           Update
  //         </button>
  //       </div>
  //     </>
  //   );
  // }; 
 
  const UpdateComponent = ({ data, show }) => { 
    const handleUpdateAllMicroLab = async () => {
      const plateNumbers = platingData
        .map((item) => item.plateNumber)
        .join(",");
      const payload = {
        testID: data?.Test_ID || "",
        microScopic: getMicroData[0]?.MicroScopic || "",
        microScopicComment: getMicroData[0]?.MicroScopicComment || "",
        noofPlate: getMicroData[0]?.NoofPlate || "",
        platingComment: getMicroData[0]?.PlatingComment || "",
        plateNumber: plateNumbers,
        incubationPeriod: getMicroData[0]?.IncubationPeriod || "",
        incubationBatch: getMicroData[0]?.IncubationBatch || "",
        incubationComment: getMicroData[0]?.IncubationComment || "",
        ipAddress: ip,
        datatosave: microLabData.map((item) => ({
          test_ID: data?.Test_ID || "",
          labObservation_ID: data.LedgerTransactionNo || "",
          labObservationName: data.labObservationName || "",
          value: item.value || "",
          readingFormat: item.readingFormat || "",
          reportType: item.reportType || "",
        })),
      };
  
      try {
        const apiResp = await UpdateAllMicroLab(payload);
        console.log(apiResp);
        if (apiResp.success) {
          notify("Update SuccessFull...", "success");
          handleSearchSampleCollection("");
        } else {
          notify("Error occurred while saving data", "error");
        }
      } catch (error) {
        notify("Error occurred while saving data", "error");
      }
    };
  
    const handleMicroUpdateChange = (e, index = null, isPlating = false) => {
      const { name, value } = e.target;
      const inputElement = e.target; // Store input reference
  
      if (isPlating && index !== null) {
        setPlatingData((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
          )
        );
      } else {
        setMicroData((prev) =>
          prev.map((item) => ({
            ...item,
            [name]: value,
          }))
        );
      }
  
      // Restore focus after state update
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    };
  
    const handleTableInputChange = (e, index) => {
      const { name, value } = e.target;
      const inputElement = e.target;
  
      setMicroScopyDataAfterSave((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
  
      // Restore focus after state update
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    };
  
    const handleNoofPlateChange = (e) => {
      const noOfPlates = Number(e.target.value);
      const updatedPlatingData = Array.from(
        { length: noOfPlates },
        (_, index) => platingData[index] || { plateNumber: "" }
      );
      setPlatingData(updatedPlatingData);
  
      setMicroData((prev) =>
        prev.map((item) => ({
          ...item,
          NoofPlate: e.target.value,
        }))
      );
    };
  
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="data-display">
                <div className="mb-4">
                  <Tables
                    thead={theadmicroLabPatient}
                    tbody={microScopyDataAfterSave?.map((val, index) => ({
                      sno: index + 1,
                      objervation: val.labObservationName || "",
                      value: (
                        <Input
                          type="text"
                          className="form-control"
                          id={`value-${index}`} // Unique ID for each input
                          name="value"
                          placeholder=" "
                          value={val.value || ""}
                          onChange={(e) => handleTableInputChange(e, index)}
                        />
                      ),
                      unit: (
                        <Input
                          type="text"
                          className="form-control"
                          id={`unit-${index}`} // Unique ID for each input
                          name="Unit"
                          placeholder=" "
                          value={val.Unit || ""}
                          onChange={(e) => handleTableInputChange(e, index)}
                        />
                      ),
                    }))}
                    tableHeight={"scrollView"}
                  />
                </div>
              </div>
  
              <div>
                <p style={{ fontWeight: "bold" }}>
                  MicroScopy Done By :
                  <span style={{ fontWeight: "400" }}>
                    {" "}
                    {getMicroData[0]?.MicroScopicDoneBy}{" "}
                  </span>
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Plating Done By :
                  <span style={{ fontWeight: "400" }}>
                    {" "}
                    {getMicroData[0]?.PlatingDoneBy}{" "}
                  </span>
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Incubation Done By :
                  <span style={{ fontWeight: "400" }}>
                    {" "}
                    {getMicroData[0]?.IncubationDoneBy}{" "}
                  </span>
                </p>
              </div>
            </div>
  
            <div className="col-lg-6 col-md-12">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <label
                  htmlFor="dropdown"
                  style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  No of Plate:
                </label>
                <select
                  id="dropdown"
                  className="form-control"
                  name="NoofPlate"
                  value={getMicroData[0]?.NoofPlate || ""}
                  onChange={handleNoofPlateChange}
                  style={{ maxWidth: "80px" }}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
  
                <Input
                  type="text"
                  placeholder=" "
                  className="form-control"
                  id="PlatingComment"
                  name="PlatingComment"
                  value={getMicroData[0]?.PlatingComment || ""}
                  onChange={handleMicroUpdateChange}
                  lable={t("Enter Plating Comments")}
                  respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
                />
              </div>
  
              <div className="mb-3">
                <CustomLabTable>
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Plate Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platingData?.map((ele, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Input
                            type="text"
                            placeholder=" "
                            className="form-control"
                            id={`plateNumber-${index}`} // Unique ID for each input
                            name="plateNumber"
                            value={ele?.plateNumber || ""}
                            onChange={(e) => handleMicroUpdateChange(e, index, true)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CustomLabTable>
              </div>
  
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <label
                  htmlFor="timedropdown"
                  style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  Incubation Period:
                </label>
                <select
                  id="timedropdown"
                  name="IncubationPeriod"
                  value={getMicroData[0]?.IncubationPeriod || ""}
                  onChange={handleMicroUpdateChange}
                  className="form-control"
                  style={{ maxWidth: "80px" }}
                >
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="14d">14 Days</option>
                </select>
              </div>
  
              <Input
                type="text"
                placeholder=" "
                className="form-control"
                id="IncubationBatch"
                name="IncubationBatch"
                value={getMicroData[0]?.IncubationBatch || ""}
                onChange={handleMicroUpdateChange}
                lable={t("Batch/Rack No")}
                respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
              />
  
              <Input
                type="text"
                placeholder=" "
                className="form-control"
                id="IncubationComment"
                name="IncubationComment"
                value={getMicroData[0]?.IncubationComment || ""}
                onChange={handleMicroUpdateChange}
                lable={t("Incubation Comment")}
                respclass="col-xl-6 col-md-4 col-sm-4 col-12 mt-2"
              />
            </div>
  
            <div>
              <p style={{ fontWeight: "bold" }}>
                MicroScopicDate:
                <span style={{ fontWeight: "400" }}>
                  {getMicroData[0]?.MicroScopicDate}
                </span>
              </p>
  
              <p style={{ fontWeight: "bold" }}>
                PlatingDate :
                <span style={{ fontWeight: "400" }}>
                  {getMicroData[0]?.PlatingDate}
                </span>
              </p>
  
              <p style={{ fontWeight: "bold" }}>
                IncubationDate :
                <span style={{ fontWeight: "400" }}>
                  {getMicroData[0]?.IncubationDate}
                </span>
              </p>
            </div>
          </div>
  
          <button
            onClick={handleUpdateAllMicroLab}
            type="button"
            className="btn btn-primary col-sm-2 btn-block mt-2 mb-2"
          >
            Update
          </button>
        </div>
      </>
    );
  };
  const handleSearchWiseDetails = (type, data) => {
    switch (type) {
      case "":
        return <MicroScopyComponent data={data} show={true} />;
        break;
      case "Microscopic":
        return <PlatingComponent data={data} show={true} />;
        break;
      case "Plating":
        return (
          <IncubationComponent
            data={data}
            show={true}
            setMicroLabData={setMicroLabData}
            microLabData={microLabData}
          />
        );
        break;
      case "Incubation":
        return <UpdateComponent data={data} show={false} />;
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="container-fluid">
          <div className="row g-3">
            <div className="col-12 col-lg-12">
              <div className="row mt-3">
                <div className="col-2">
                  <ReactSelect
                    placeholderName={t("Entry Type")}
                    id={"type"}
                    searchable={true}
                    dynamicOptions={type}
                    handleChange={handleSelect}
                    value={`${values?.type?.value}`}
                    name={"type"}
                  />
                </div>
                <div className="col-2">
                  <Input
                    type="text"
                    className="form-control"
                    id="UHID"
                    name="UHID"
                    lable={t("UHID No")}
                    placeholder=" "
                    value={values?.UHID ? values?.UHID : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-2">
                  <DatePicker
                    className="custom-calendar"
                    id="fromDate"
                    name="fromDate"
                    lable={t(
                      "FromDate"
                    )}
                    value={values?.fromDate ? values?.fromDate : new Date()}
                    handleChange={handleChange}
                    placeholder={VITE_DATE_FORMAT}
                  />
                </div>
                <div className="col-2">
                  <DatePicker
                    className="custom-calendar"
                    id="toDate"
                    name="toDate"
                    value={values?.toDate ? values?.toDate : new Date()}
                    handleChange={handleChange}
                    lable={t(
                      "ToDate"
                    )}
                    placeholder={VITE_DATE_FORMAT}
                  />
                </div>
                <div className="col-2">
                  <Input
                    type="text"
                    className="form-control"
                    id="BarcodeNo"
                    name="BarcodeNo"
                    lable={t(
                      "BarcodeNo"
                    )}
                    placeholder=" "
                    value={values?.BarcodeNo ? values?.BarcodeNo : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-info btn-lg"
                    type="button"
                    onClick={() => handleSearchSampleCollection("")}
                  >
                    {t("Search")}
                  </button>
                </div>
              </div>

              <div className="row d-flex justify-content-center mb-2">
                <div
                  className="col-sm-2 d-flex
                   align-items-center"
                  onClick={() => handleSearchSampleCollection("")}
                  style={{ gap: "10px" }}
                >
                  <div className="statusRescheduled2 color-indicator-11-bg"></div>
                  <label className="text-dark m-0">{t("Pending")}</label>
                </div>
                <div
                  onClick={() => handleSearchSampleCollection("Microscopic")}
                  className="col-sm-2 d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <div className="statusRescheduled2 color-indicator-15-bg"></div>
                  <label className="text-dark m-0">{t("Microscopic")}</label>
                </div>
                <div
                  onClick={() => handleSearchSampleCollection("Plating")}
                  className="col-sm-2 d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <div className="statusRescheduled2 color-indicator-19-bg"></div>
                  <label className="text-dark m-0">{t("Plating")}</label>
                </div>
                <ColorCodingSearch
                    label={t("Incubation")}
                    color={"color-indicator-2-bg"}
                    onClick={() => handleSearchSampleCollection("Incubation")}
                  />
                {/* <div
                  onClick={() => handleSearchSampleCollection("Incubation")}
                  className="col-sm-2 d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <div className="statusRescheduled2 pink"></div>
                  <label className="text-dark m-0">{t("Incubation")}</label>
                </div> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              {tbodyPatientDetail.length > 0 && (
                <div className="mb-4">
                  <Tables
                    thead={theadPatientDetail}
                    tbody={tbodyPatientDetail?.map((val, index) => ({
                      sno: index + 1,
                      UHID: val.PatientID || "",
                      barcodeNo: val.BarcodeNo || "",
                      PatientName: val.PName || "",
                      TestName: val.Name || "", 
                    }))}
                    getRowClick={handleMicroLabEntrySavedData}
                    tableHeight={"scrollView"}
                    getRowClass={getRowClass}
                  />
                </div>
              )}
            </div>
            {Object.keys(patientData)?.length > 0 && (
              <div className="col-12 col-lg-6">
                <CustomLabTable>
                  <tbody>
                    <tr className="line-height-table">
                      <td className="requiredlabel">Patient Name:</td>
                      <td colSpan={3}>{patientData?.PName}</td>
                    </tr>
                    <tr className="line-height-table">
                      <td className="requiredlabel">Age:</td>
                      <td>{patientData?.Age}</td>
                      <td className="requiredlabel">Gender:</td>
                      <td>{patientData?.Gender}</td>
                    </tr>

                    <tr className="line-height-table">
                      <td className="requiredlabel">Visit No:</td>
                      <td>{patientData?.LedgerTransactionNo}</td>
                      <td className="requiredlabel">Barcode No:</td>
                      <td>{patientData?.BarcodeNo}</td>
                    </tr>

                    <tr className="line-height-table">
                      <td className="requiredlabel">Test Name:</td>
                      <td colSpan={3}>{patientData?.Name}</td>
                    </tr>

                    <tr className="line-height-table">
                      <td className="requiredlabel">Sample Type:</td>
                      <td>{patientData?.SampleTypeName}</td>
                      <td className="requiredlabel">Party Name:</td>
                      <td>{patientData?.PanelName}</td>
                    </tr>

                    <tr className="line-height-table">
                      <td className="requiredlabel">Sample Col. Date:</td>
                      <td>{patientData?.SampleCollectionDate}</td>
                      <td className="requiredlabel">Sample Rec. Date:</td>
                      <td>{patientData?.SampleReceiveDate}</td>
                    </tr>
                  </tbody>
                </CustomLabTable>

                <div className="mt-3">
                  {handleSearchWiseDetails(
                    patientData?.CultureStatus,
                    patientData
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MicroLabEntry;
