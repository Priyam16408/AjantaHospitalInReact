// import React, { useEffect, useState } from "react";
// import Heading from "../../../components/UI/Heading";
// import { useTranslation } from "react-i18next";
// import ReactSelect from "../../../components/formComponent/ReactSelect";
// import Input from "../../../components/formComponent/Input";
// import {
//   EditTamplate,
//   GetDeliveryDays,
//   LoadHeadDepartment,
//   manageDeliveryBindCentre,
// } from "../../../networkServices/EDP/edpApi";
// import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
// import Tables from "../../../components/UI/customTable";
// import { SaveInvDeliveryDays } from "../../../networkServices/EDP/karanedp";

// function ManageDeliveryDays() {
//   const isMobile = window.innerWidth <= 800;
//   const [bindCenter, setBindCenter] = useState([]);
//   const [department, setDepartment] = useState([]);

//   const [manageDeliverydata, setManageDeliverydata] = useState([]);

//   const [isHeaderChecked, setIsHeaderChecked] = useState(false);

//   const [t] = useTranslation();
//   const [values, setValues] = useState({
//     department: "",
//     centre: "",
//     testCode: "",
//     testName: "",
//   });

//   const handleChangeCheckboxHeader = (e) => {
//     const isChecked = e.target.checked;
//     setIsHeaderChecked(isChecked);
//     const updatedData = manageDeliverydata.map((val) => ({
//       ...val,
//       isChecked: isChecked,
//     }));
//     setTbodyPatientDetail(updatedData);
//   };

//   const ManageDeliveryThead = [
//     { width: "5%", name: t("SNo") },
//     { width: "5%", name: t("Test Name") },
//     { width: "5%", name: t("Test Code") },
//     { width: "5%", name: t("Booking cutoff") },
//     { width: "5%", name: t("SRA cutoff") },
//     {
//       width: "5%",
//       name: t("Technician Proccessing Sun   Mon   Tue   Wed   Thu   Fri   Sa"),
//     },
//     { width: "5%", name: t("DayType") },
//     { width: "5%", name: t("Processing days") },
//     { width: "5%", name: t("Delivery") },
//     {
//       width: "5%",
//       name: t("Technician Proccessing Sun   Mon   Tue   Wed   Thu   Fri   Sa"),
//     },
//     { width: "5%", name: t("Reporting cutoff") },
//     {
//       width: "5%",
//       name: isMobile ? (
//         t("checbox")
//       ) : (
//         <input
//           type="checkbox"
//           checked={isHeaderChecked}
//           onChange={handleChangeCheckboxHeader}
//         />
//       ),
//     },
//   ];
//   const handleChange = (e) => {
//     setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//   const handleSelect = (name, value) => {
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEdit = async (templateId) => {
//     try {
//       const response = await EditTamplate(templateId);
//       if (response.success) {
//         console.log("the response from editApi is", response);
//         console.log(response.data[0].templateHead);
//         console.log(response.data[0].templateDescription);
//         setSelectedTemplateId(response.data[0].Investigation_ID);
//         setValues({ availableTemplates: response.data[0].Temp_Head });
//         setEditorValue(response.data[0].Template_Desc);
//         setTemplateId(response?.data[0].Template_ID);
//       } else {
//         notify(response.message, "error");
//       }
//     } catch (error) {
//       notify("Error fetching template data", "error");
//     }
//   };

//   const handlemanageDeliveryBindCentre = async () => {
//     try {
//       const response = await manageDeliveryBindCentre();
//       if (response.success) {
//         setBindCenter(response?.data);
//         console.log("the response from the observation", response);
//       } else {
//         setBindCenter([]);
//       }
//     } catch (error) {
//       setBindCenter([]);
//     }
//   };

//   const handleBindDepartment = async () => {
//     try {
//       const response = await LoadHeadDepartment();
//       if (response.success) {
//         setDepartment(response?.data);
//         console.log("the department data is", response);
//       } else {
//         setDepartment([]);
//       }
//     } catch (error) {
//       setDepartment([]);
//     }
//   };

//   const handleGetDeliveryDays = async () => {
//     let payload = {
//       centreId: values?.centre?.value,
//       subCategoryId: values?.department?.value,
//       testName: values?.testName,
//       testCode: values?.testCode,
//     };
//     try {
//       const apiResp = await GetDeliveryDays(payload);
//       if (apiResp.success) {
//         notify(`${apiResp?.data?.length} ${apiResp?.message}`, "success");
//         setManageDeliverydata(apiResp?.data);
//       } else {
//         notify(apiResp?.message, "error");
//         setManageDeliverydata([]);
//       }
//     } catch (error) {
//       notify("An error occurred while saving data", "error");
//       setManageDeliverydata([]);
//     }
//   };

//   const handleSave = async () => {
//     let payload = [
//       {
//         centreID: 1,
//         subcategoryID: 1,
//         investigation_ID: "2",
//         sun: 1,
//         mon: 1,
//         tue: 1,
//         wed: 1,
//         thu: 1,
//         fri: 1,
//         sat: 1,
//         sun_Proc: 1,
//         mon_Proc: 1,
//         tue_Proc: 1,
//         wed_Proc: 1,
//         thu_Proc: 1,
//         fri_Proc: 1,
//         sat_Proc: 1,
//         bookingcutoff: "2025-03-31",
//         sracutoff: "2025-03-31",
//         testprocessingday: 1,
//         reportingcutoff: "2025-03-31",
//         dayType: "",
//         ipAddress: "10.0.1.136",
//       },
//     ];
//     try {
//       const apiResp = await SaveInvDeliveryDays(payload);
//       if (apiResp.success) {
//         notify(apiResp?.message, "success");
//       } else {
//         notify(apiResp?.message, "error");
//         setManageDeliverydata([]);
//       }
//     } catch (error) {
//       notify("An error occurred while saving data", "error");
//       setManageDeliverydata([]);
//     }
//   };

//   useEffect(() => {
//     handlemanageDeliveryBindCentre();
//     handleBindDepartment();
//   }, []);

//   return (
//     <>
//       <div className="m-2 spatient_registration_card card">
//         <Heading title={t("/")} isBreadcrumb={true} />
//         <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
//           <ReactSelect
//             placeholderName={t("Centre")}
//             id={"centre"}
//             searchable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             name="centre"
//             dynamicOptions={[
//               ...handleReactSelectDropDownOptions(
//                 bindCenter,
//                 "CentreName",
//                 "CentreID"
//               ),
//             ]}
//             handleChange={handleSelect}
//             value={`${values?.centre?.value}`}
//           />

//           <ReactSelect
//             placeholderName={t("Department")}
//             id={"department"}
//             searchable={true}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//             name="department"
//             dynamicOptions={[
//               ...handleReactSelectDropDownOptions(
//                 department,
//                 "Name",
//                 "ObservationType_ID"
//               ),
//             ]}
//             handleChange={handleSelect}
//             value={`${values?.department?.value}`}
//           />

//           <Input
//             type="text"
//             className="form-control"
//             id="testName"
//             placeholder=" "
//             name="testName"
//             value={values?.testName || ""}
//             onChange={handleChange}
//             lable={t("Test Name")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />

//           <Input
//             type="text"
//             className="form-control"
//             id="testCode"
//             placeholder=" "
//             name="testCode"
//             value={values?.testCode || ""}
//             onChange={handleChange}
//             lable={t("Test Code")}
//             respclass="col-xl-2 col-md-4 col-sm-4 col-12"
//           />

//           <div className="col-sm-12">
//             <button
//               className="btn btn-sm btn-success"
//               type="button"
//               onClick={handleGetDeliveryDays}
//             >
//               {t("Search")}
//             </button>

//             <button
//               className="btn btn-sm btn-success ml-2"
//               type="button"
//               onClick={handleSave}
//             >
//               {t("Save")}
//             </button>
//           </div>
//         </div>
//         {manageDeliverydata.length > 0 && (
//           <div className="col-lg-12">
//             <Tables
//               thead={ManageDeliveryThead}
//               tbody={manageDeliverydata?.map((val, index) => ({
//                 sno: index + 1,
//                 testName: val?.InvName,
//                 testCode: val?.testcode,
//                 Bookingcutoff: <Input value={val?.bookingcutoff} />,
//                 sracutoff: <Input value={val?.sracutoff} />,
//                 dayvalue: `${val?.Sun_Proc}, ${val?.Mon_Proc}, ${val?.Tue_Proc}, ${val?.Wed_Proc}, ${val?.Thu_Proc}, ${val?.Fri_Proc}, ${val?.Sat_Proc}`,

//                 daytype: val?.nothing || "",
//                 Processingdays: <Input value={val?.testprocessingday} />,
//                 dayvaluetwo: `${val?.Sun_Proc}, ${val?.Mon_Proc}, ${val?.Tue_Proc}, ${val?.Wed_Proc}, ${val?.Thu_Proc}, ${val?.Fri_Proc}, ${val?.Sat_Proc}`,
//                 dayvaldthree: "",

//                 Reportingcutoff: <Input value={val?.bookingcutoff} />,
//                 checkbox: <input type="checkbox" />,
//               }))}
//               tableHeight={"scrollView"}
//               style={{ height: "80vh", padding: "2px" }}
//             />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default ManageDeliveryDays;

import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import {
  EditTamplate,
  GetDeliveryDays,
  LoadHeadDepartment,
  manageDeliveryBindCentre,
} from "../../../networkServices/EDP/edpApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Tables from "../../../components/UI/customTable";
import { SaveInvDeliveryDays } from "../../../networkServices/EDP/karanedp";

function ManageDeliveryDays({data}) {
  const isMobile = window.innerWidth <= 800;
  const [bindCenter, setBindCenter] = useState([]);
  const [department, setDepartment] = useState([]);
  const [manageDeliverydata, setManageDeliverydata] = useState([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);
  const [t] = useTranslation();
  const [values, setValues] = useState({
    department: "",
    centre: "",
    testCode: "",
    testName: "",
  });

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);
    const updatedData = manageDeliverydata.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setManageDeliverydata(updatedData);
  };

  const handleCheckboxChange = (index) => {
    const updatedData = [...manageDeliverydata];
    updatedData[index].isChecked = !updatedData[index]?.isChecked;
    setManageDeliverydata(updatedData);
  };

  const handleInputChange = (index, name, value) => {
    const updatedData = [...manageDeliverydata];
    updatedData[index][name] = value;
    setManageDeliverydata(updatedData);
  };

  const ManageDeliveryThead = [
    { width: "5%", name: t("SNo") },
    { width: "10%", name: t("Test Name") },
    { width: "10%", name: t("Test Code") },
    { width: "10%", name: t("Booking cutoff") },
    { width: "10%", name: t("SRA cutoff") },
    {
      width: "10%",
      name: t("Processing Days (Sun-Sat)"),
    },
    { width: "10%", name: t("DayType") },
    { width: "10%", name: t("Processing Days Count") },
    { width: "10%", name: t("Reporting cutoff") },
    {
      width: "5%",
      name: isMobile ? (
        t("Checkbox")
      ) : (
        <input
          type="checkbox"
          checked={isHeaderChecked}
          onChange={handleChangeCheckboxHeader}
        />
      ),
    },
  ];

  const handleGetDeliveryDays = async () => {
    let payload = {
      centreId: values?.centre?.value,
      subCategoryId: values?.department?.value,
      testName: values?.testName,
      testCode: values?.testCode,
    };
    try {
      const apiResp = await GetDeliveryDays(payload);
      if (apiResp.success) {
        const modifiedData = apiResp.data.map((item) => ({
          ...item,
          isChecked: false,
        }));
        notify(`${apiResp?.data?.length} ${apiResp?.message}`, "success");
        setManageDeliverydata(modifiedData);
      } else {
        notify(apiResp?.message, "error");
        setManageDeliverydata([]);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
      setManageDeliverydata([]);
    }
  };

  const handleSave = async () => {
    const selectedData = manageDeliverydata.filter((row) => row.isChecked);

    if (selectedData.length === 0) {
      notify("Please select at least one row to save.", "error");
      return;
    }

    const payload = selectedData.map((item) => ({
      centreID: values?.centre?.value,
      subcategoryID: values?.department?.value,
      investigation_ID: item?.Investigation_ID,
      sun: item?.Sun,
      mon: item?.Mon,
      tue: item?.Tue,
      wed: item?.Wed,
      thu: item?.Thu,
      fri: item?.Fri,
      sat: item?.Sat,
      sun_Proc: item?.Sun_Proc,
      mon_Proc: item?.Mon_Proc,
      tue_Proc: item?.Tue_Proc,
      wed_Proc: item?.Wed_Proc,
      thu_Proc: item?.Thu_Proc,
      fri_Proc: item?.Fri_Proc,
      sat_Proc: item?.Sat_Proc,
      bookingcutoff: item?.bookingcutoff,
      sracutoff: item?.sracutoff,
      testprocessingday: item?.testprocessingday,
      reportingcutoff: item?.reportingcutoff,
      dayType: item?.dayType,
      ipAddress: "10.0.1.136",
    }));

    try {
      const apiResp = await SaveInvDeliveryDays(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handlemanageDeliveryBindCentre();
      await handleBindDepartment();
    };
    fetchData();
  }, []);

  const handlemanageDeliveryBindCentre = async () => {
    try {
      const response = await manageDeliveryBindCentre();
      if (response.success) {
        setBindCenter(response?.data);
      } else {
        setBindCenter([]);
      }
    } catch (error) {
      setBindCenter([]);
    }
  };

  const handleBindDepartment = async () => {
    try {
      const response = await LoadHeadDepartment();
      if (response.success) {
        setDepartment(response?.data);
      } else {
        setDepartment([]);
      }
    } catch (error) {
      setDepartment([]);
    }
  };

  return (
    <div className="m-2 spatient_registration_card card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
        <ReactSelect
          placeholderName={t("Centre")}
          id={"centre"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="centre"
          dynamicOptions={handleReactSelectDropDownOptions(
            bindCenter,
            "CentreName",
            "CentreID"
          )}
          handleChange={handleSelect}
          value={values?.centre}
        />
        <ReactSelect
          placeholderName={t("Department")}
          id={"department"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          name="department"
          dynamicOptions={handleReactSelectDropDownOptions(
            department,
            "Name",
            "ObservationType_ID"
          )}
          handleChange={handleSelect}
          value={values?.department}
        />
        {/* <Input
          type="text"
          id="testName"
          placeholder=" "
          name="testName"
          value={values?.testName || ""}
          onChange={handleChange}
          lable={t("Test Name")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        <Input
          type="text"
          id="testCode"
          placeholder=" "
          name="testCode"
          value={values?.testCode || ""}
          onChange={handleChange}
          lable={t("Test Code")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
         */}
        <Input
          type="text"
          className="form-control"
          id="testName"
          placeholder=" "
          name="testName"
          value={values?.testName || ""}
          onChange={handleChange}
          lable={t("Test Name")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <Input
          type="text"
          className="form-control"
          id="testCode"
          placeholder=" "
          name="testCode"
          value={values?.testCode || ""}
          onChange={handleChange}
          lable={t("Test Code")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />

        <div className="col-sm-12">
          <button
            className="btn btn-sm btn-success"
            type="button"
            onClick={handleGetDeliveryDays}
          >
            {t("Search")}
          </button>
          <button
            className="btn btn-sm btn-success ml-2"
            type="button"
            onClick={handleSave}
          >
            {t("Save")}
          </button>
        </div>
      </div>

      {manageDeliverydata.length > 0 && (
        <div className="col-lg-12">
          <Tables
            thead={ManageDeliveryThead}
            tbody={manageDeliverydata.map((val, index) => ({
              sno: index + 1,
              testName: val?.InvName,
              testCode: val?.testcode,
              Bookingcutoff: (
                <Input
                  value={val?.bookingcutoff}
                  onChange={(e) =>
                    handleInputChange(index, "bookingcutoff", e.target.value)
                  }
                />
              ),
              sracutoff: (
                <Input
                  value={val?.sracutoff}
                  onChange={(e) =>
                    handleInputChange(index, "sracutoff", e.target.value)
                  }
                />
              ),
              dayvalue: `${val?.Sun_Proc}, ${val?.Mon_Proc}, ${val?.Tue_Proc}, ${val?.Wed_Proc}, ${val?.Thu_Proc}, ${val?.Fri_Proc}, ${val?.Sat_Proc}`,
              daytype: (
                <Input
                  value={val?.dayType || ""}
                  onChange={(e) =>
                    handleInputChange(index, "dayType", e.target.value)
                  }
                />
              ),
              Processingdays: (
                <Input
                  value={val?.testprocessingday}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "testprocessingday",
                      e.target.value
                    )
                  }
                />
              ),
              Reportingcutoff: (
                <Input
                  value={val?.reportingcutoff || ""}
                  onChange={(e) =>
                    handleInputChange(index, "reportingcutoff", e.target.value)
                  }
                />
              ),
              checkbox: (
                <input
                  type="checkbox"
                  checked={val?.isChecked || false}
                  onChange={() => handleCheckboxChange(index)}
                />
              ),
            }))}
            tableHeight={"scrollView"}
            style={{ height: "80vh", padding: "2px" }}
          />
        </div>
      )}
    </div>
  );
}

export default ManageDeliveryDays;
