import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import {
  BindDoctorGroupmanagement,
  DoctorRegSave,
  getBindCenterAPI,
  GetDocTypeList,
  OPDScheduleDetailsSearch,
} from "../../../networkServices/EDP/karanedp";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import TimePicker from "../../../components/formComponent/TimePicker";
import DatePicker from "../../../components/formComponent/DatePicker";
import BrowseButton from "../../../components/formComponent/BrowseButton";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import Tables from "../../../components/UI/customTable";
import { BindDoctorDetail } from "../../../networkServices/EDP/edpApi";
const { VITE_DATE_FORMAT } = import.meta.env;
function DoctorReg({ data }) { 
  
  // BindDoctorDetail

  const [doctorDetail,setDoctorDetail] = useState([]);
  const [t] = useTranslation();
  const typeSelect = [
    { value: "Single", label: "Single" },
    { value: "Unit", label: "Unit" },
  ];
  const titleList = [
    { label: "Mr.", value: "Mr." },
    { label: "Miss.", value: "Miss." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Nana.", value: "Nana." },
    { label: "Prof.", value: "Prof." },
    { label: "LT. Col. ", value: "LT. Col. " },
    { label: "LT.", value: "LT." },
    { label: "Col.", value: "Col." },
    { label: "Hon.", value: "Hon." },
    { label: "Rev.", value: "Rev." },
    { label: "Past.", value: "Past." },
  ]
  const DoctorSelect = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const positionType = [
    { value: "1", label: "Senior" },
    { value: "0", label: "Junior" },
  ];

  const Applicable = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const emerAvailable = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const slotWisetoken = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  const loginRequired = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];


  const ShiftArr = [
    { value: "1", label: "Morning Shift" },
    { value: "2", label: "Afternoon Shift" },
    { value: "3", label: "Evening Shift" },
    { value: "4", label: "Night Shift" },
    { value: "5", label: "Day Shift" },
  ];
  const PatientDuration = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
    { value: "50", label: "50" },
    { value: "60", label: "60" }
  ]
  const getDays = [
    { value: "monday", label: "mon" },
    { value: "tuesday", label: "tue" },
    { value: "wednesday", label: "wed" },
    { value: "thursday", label: "thu" },
    { value: "friday", label: "fri" },
    { value: "saturday", label: "sat" },
    { value: "sunday", label: "sun" },
  ];

const handleBindDoctorDetail = async () => {
  try {
    const response = await BindDoctorDetail(data?.DID);
    if (response.success) {
      const doc = response?.data?.docDetails[0];
      console.log(doc);
      
      setDoctorDetail(doc);
      debugger
      // Map doctor details to values
      setValues((prevValues) => ({
        ...prevValues,
        drname: doc?.Name || "",
        doctorType: { value: doc?.DocGroupId ,label: doc?.DocGroupId },
        phone: doc?.Phone1 || "",
        mobile: doc?.Mobile || "",
        address: doc?.Street_Name || "",
        degree: doc?.Degree || "",
        specialization: { value: doc?.Specialization , label: doc?.Specialization  },
        department: { value: doc?.DocDepartmentID , label: doc?.DocDepartmentID  },
        doctorSelect: { value: doc?.IsDocShare ? "1" : "0", label: doc?.IsDocShare ? "Yes" : "No" },
        emerAviable: { value: doc?.EmerAvail ? "1" : "0", label: doc?.EmerAvail ? "Yes" : "No" },
        applicable: { value: doc?.Applicable ? "1" : "0", label: doc?.Applicable ? "Yes" : "No" },
        isSlotWiseToken:{value:doc?.isSlotWiseToken? "1" : "0", label: doc?.isSlotWiseToken ? "Yes" : "No"}
        // Other mappings as needed...
      }));
    } else {
      setDoctorDetail([]);
    }
  } catch (error) {
    console.error(error);
    setDoctorDetail([]);
  }
};


  const IP = localStorage.getItem("ip");
console.log(String(doctorDetail),"name working");
  const [values, setValues] = useState({
    title: "",
    drname: doctorDetail[0]?.Name,
    selectType: { value: "Single", label: "Single" },
    department: { value: "0", label: "ALL" },
    doctorType: "",
    phone: "",
    mobile: "",
    address: "",
    degree: "",
    doctorSelect: { value: "1", label: "Yes" },
    emerAviable: { value: "1", label: "Yes" },
    slotWiseToken:"",
    applicable: "", 
    doctimeDisplay: "",
    position: "",
    getDays: "",
    starttime: new Date(),
    endtime: new Date(),
    shift: "",
    loginRequired: "",
    specialization:"",
    centreVal: "",
    duration: "",
    startTime: moment(new Date()).toDate(),
    endTime: moment(new Date()).toDate(),
    fromTime: new Date(),
    toTime: new Date()
  });
  console.log(values)
  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [handleModelData, setHandleModelData] = useState({});
  
   const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (val) => {
    const isAlreadySelected = selectedRows.some(
      (item) => item?.NADate === val?.NADate
    );

    if (isAlreadySelected) {
      setSelectedRows(selectedRows.filter((item) => item?.NADate !== val?.NADate));
    } else {
      setSelectedRows([...selectedRows, val]);
    }
  };


  console.log(handleModelData);

  const handleSelect = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // const handleChange = (e) => {
  //   setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((val) => ({ ...val, [name]: value }))
  }
  console.log(tbodyPatientDetail);

  const handleSave = async () => {
    if(!values?.drname){
      notify("Please Enter Name", "warn")
      return;
    }
    if (!values?.doctorType?.value) {
      notify("Please Select Doctor Type", "warn")
      return;
    }
    if (!values?.specialization?.label) {
      notify("Please Select Specialization", "warn")
      return;
    }
    if (!values?.department?.value) {
      notify("Please Select Department", "warn")
      return;
    }
    if(!values?.shift?.value){
      notify("Please Select Shift", "warn")
      return;
    }
    const payload =
    {
      "title": values?.title?.label,
      "name": values?.drname,
      "designation": values?.department?.label,
      "phone1": values?.phone,
      "mobile": values?.mobile,
      "street_Name": values?.address,
      "degree": values?.degree,
      "specialization": values?.specialization?.label,
      "userName": "string",
      "password": "string",
      "doctorTime": "string",
      "doctorTiming": values?.doctimeDisplay,
      "docGroupId": values?.doctorType?.value,
      "docDepartmentID": values?.department?.value,
      "isDocShare": values?.doctorSelect?.value || 0,
      "isDiscountable": Number(values?.applicable?.value) || 0,
      "isEmergencyAvailable": Number(values?.emerAviable?.value) || 0,
      "isSlotWiseToken": Number(values?.slotWiseToken?.value) || 0,
      "ipAddress": IP,
      "type": 0,
      "roomNo": "string",
      "docFloor": "string",
      "isLogin": true,
      "opdSceduleTimeList": timingValues.map((item) =>
      ({
        endTime: item.endtime || "10:00AM",
        startTime: item.starttime || "10:00PM",
        avgTime: 20,
        durationforOldPatient: Number(item.duration) || 2,
        startBT: 2,
        endBT: 2,
        isRepeat: 2,
        date: moment(new Date()).format("DD-MMM-YYYY"),
        day: "sunday",
        visitName: item.shift || "General",
        centreID: 0,
      })
      ),
      "naTimingList": selectedRows.map((values) => ({
        naDate: moment(values?.NADate).format("DD-MMM-YYYY"),
        dayValue: values?.DayValue,
        startTime: moment(values?.starttime || new Date()).format("DD-MMM-YYYY"),
        endTime: moment(values?.endtime || new Date()).format("DD-MMM-YYYY"),
        naCentreID: Number(values?.CentreID || 0),
        isNASelect: true,
      }))
    }

    try {
      const apiResp = await DoctorRegSave(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
      } else {
       notify(apiResp?.message, "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const [groupData, setGroupData] = useState([]);
  const handleGroupmanagement = async () => {
    try {
      const response = await BindDoctorGroupmanagement();
      if (response.success) {
        setGroupData(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setGroupData([]);
    }
  };

  //  BindDoctorGroupmanagement

  const [bindList, setBindList] = useState([]); 
  const handleGetDocTypeList = async () => {
    try {
      const response = await GetDocTypeList(3);
      if (response.success) {
        setDepartmentData(response?.data);
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


  const  handleUpdate=async () => {
const payload =
{
  "title": "string",
  "name": values?.drname,
  "designation": values?.department?.label,
  "phone1": values?.phone,
  "mobile": values?.mobile,
  "street_Name": values?.address,
  "degree": values?.degree,
  "specialization":values?.specialization?.label,
  "userName": "string",
  "password": "string",
  "doctorTime": "string",
  "doctorTiming": values?.doctimeDisplay,
  "docGroupId": values?.doctorType?.value,
  "docDepartmentID": values?.department?.value,
  "isDocShare": values?.doctorSelect?.value || 0,
  "isDiscountable": Number(values?.applicable?.value) || 0,
  "isEmergencyAvailable": Number(values?.emerAviable?.value) || 0,
  "isSlotWiseToken": Number(values?.slotWiseToken?.value) || 0,
  "ipAddress": IP,
  "type": 0,
  "roomNo": "string",
  "docFloor": "string",
  "isLogin": true, 
  "opdSceduleTimeList": timingValues.map((item) =>
  ({
    endTime: item.endtime || "10:00AM",
    startTime: item.starttime || "10:00PM",
    avgTime: 20,  
    durationforOldPatient: 2,  
    startBT: 2,  
    endBT: 2,   
    isRepeat: 2,  
    date: moment(new Date()).format("DD-MMM-YYYY"),
    day: "sunday",
    visitName: item.shift || "General",
    centreID: 0, 
  } )
),   
 "naTimingList": selectedRows.map((values) => ({
    naDate: moment(values?.NADate).format("DD-MMM-YYYY"),
    dayValue: values?.DayValue,
    startTime: moment(values?.starttime || new Date()).format("DD-MMM-YYYY"),
    endTime: moment(values?.endtime || new Date()).format("DD-MMM-YYYY"),
    naCentreID: Number(values?.CentreID || 0),
    isNASelect: true,
  }))
}

    try {
      const apiResp = await DoctorRegSave(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
      } else {
       notify(apiResp?.message, "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const handleGetDepartment = async () => {
    try {
      const response = await GetDocTypeList(5);
      if (response.success) {
        setBindList(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindList([]); 
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindList([]);      
    }
  };

  const [centreVal, setCentreVal] = useState([]);
  const handlegetBindCenterAPI = async () => {
    try {
      const response = await getBindCenterAPI();
      if (response.success) {
        setCentreVal(response?.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setCentreVal([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setCentreVal([]);
    }
  };

  // getBindCenterAPI

  const selectdaysDate = [
    { value: "Days", label: "Days" },
    { value: "Date", label: "Date" },
  ];

  const theadSearchdata = [
    { width: "5%", name: t("Select") },
    { width: "5%", name: t("Centre") },
    { width: "5%", name: t("Date") },
    { width: "5%", name: t("Day") },
    { width: "5%", name: t("From Time") },
    { width: "5%", name: t("To Time") },
  ];

  const theadSaveData = [
    { width: "5%", name: t("SNo") },
    { width: "5%", name: t("centre") },
    { width: "5%", name: t("Shift") },
    { width: "5%", name: t("Duration For Patient") },
    { width: "5%", name: t("	End Time") },
    { width: "5%", name: t("Start Time") },
    { width: "5%", name: t("Days") },
  ];

  const handlePayloadMultiSelect = (data) => {
    if (!Array.isArray(data)) {
      return "";
    }
    return data.map((item) => String(item?.code)).join(",");
  };

  const [timingValues, setTimingValues] = useState([]);
  
  const handleAddTimings = () => {
    console.log(values);
    setTimingValues((prev) => [
      // ...prev,
      {
        centre: values?.centre?.CentreName,
        getDays: handlePayloadMultiSelect(values?.getDays),
        starttime: moment(values?.starttime).format("hh:mm A"),
        endtime: moment(values?.endtime).format("hh:mm A"),
        shift: values?.shift?.value,
        duration: values?.duration?.value,
      },
    ]);
    console.log("the handelvalue inside is", timingValues);
  };
  console.log("the handleValue outside state is", timingValues);

  // GetDoctorDetail

  const [searchTableData, setSearchTableData] = useState([]);

  const handleChangeTime = (index, field, value) => {
    setSearchTableData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };
  const handleSearch = async () => {
    const payload = {
      notAvailableDateFrom: moment(values?.startTime).format("DD-MMM-YYYY"),
      notAvailableDateTo: moment(values?.endTime).format("DD-MMM-YYYY"),
      naCentreText: values?.centreVal?.label,
      naCentreValue: values?.centreVal?.value,
    };
    try {
      const response = await OPDScheduleDetailsSearch(payload);
      if (response.success) {
        setSearchTableData(response?.data);
      } else {
        setSearchTableData([]);
      }
    } catch (error) {
      setSearchTableData([]);
    }
  };

  useEffect(() => {
    handleGroupmanagement();
    handleGetDocTypeList();
    handleGetDepartment();
    handlegetBindCenterAPI();
    handleBindDoctorDetail();
  }, []);

  return (
    <>
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
            placeholderName={t("Type")}
            id={"selectType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={typeSelect}
            handleChange={handleSelect}
            value={`${values?.selectType?.value}`}
            name={"selectType"}
          />

          <div className="col-xl-2 col-md-4 col-sm-4 col-12 d-flex">
              <ReactSelect
                placeholderName={t("title")}
                id={"title"}
                searchable={true}
                className=""
                removeIsClearable={true}
                dynamicOptions={titleList}
                respclass=" col-xl-5 col-md-4 col-5"
                handleChange={handleSelect}
                value={`${values?.title?.value}`}
                name={"title"}
              />

              <Input
                type="text"
                className="form-control required-fields"
                id="drname"
                placeholder=""
                name="drname"
                value={values?.drname || ""}
                onChange={handleChange}
                lable={t("Name")}
                respclass="col-xl-7 col-md-9 col-12"
              />

          </div>

          <ReactSelect
            placeholderName={t("Doctor Type")}
            id={"doctorType"}
            searchable={true}
            removeIsClearable={true}
            requiredClassName="required-fields"
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(groupData, "DocType", "ID"),
            ]}
            // dynamicOptions={typeSelect}
            handleChange={handleSelect}
            value={`${values?.doctorType?.value}`}
            name={"doctorType"}
          />

          <Input
            type="text"
            className="form-control"
            id="phone"
            placeholder=" "
            name="phone"
            value={values?.phone || ""}
            onChange={handleChange}
            lable={t("Phone")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="mobile"
            name="mobile"
            value={values?.mobile || ""}
            onChange={handleChange}
            lable={t("Mobile")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="address"
            name="address"
            value={values?.address || ""}
            onChange={handleChange}
            lable={t("Address")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Specialization")}
            id={"specialization"}
            searchable={true}
            removeIsClearable={true}
            requiredClassName="required-fields"
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(bindList, "Name", "Name"),
            ]}
            handleChange={handleSelect}
            value={`${values?.specialization?.value}`}
            name={"specialization"}
          />

          <ReactSelect
            placeholderName={t("Department")}
            id={"department"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            requiredClassName="required-fields"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(departmentData, "Name", "ID"),
            ]}
            handleChange={handleSelect}
            value={`${values?.department?.value}`}
            name={"department"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="degree"
            name="degree"
            value={values?.degree || ""}
            onChange={handleChange}
            lable={t("Degree")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Doctor Select")}
            id={"doctorSelect"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={DoctorSelect}
            handleChange={handleSelect}
            value={`${values?.doctorSelect?.value}`}
            name={"doctorSelect"}
          />

          <ReactSelect
            placeholderName={t("Emer. Available")}
            id={"emerAviable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={emerAvailable}
            handleChange={handleSelect}
            value={`${values?.emerAviable?.value}`}
            name={"emerAviable"}
          />
          <ReactSelect
            placeholderName={t("Disc. Applicable")}
            id={"applicable"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Applicable}
            handleChange={handleSelect}
            value={`${values?.applicable?.value}`}
            name={"applicable"}
          />

          {values?.selectType?.value == "Unit" ? (
            <div className="d-flex col-xl-6">
              <ReactSelect
                placeholderName={t("Doctors")}
                id={"doctors"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-4 col-md-4 col-sm-4 col-sm-4 col-12"
                // dynamicOptions={emerAvailable}
                handleChange={handleSelect}
                value={`${values?.doctors?.value}`}
                name={"doctors"}
              />
              <ReactSelect
                placeholderName={t("Position")}
                id={"position"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-4 col-md-4 col-sm-4 col-sm-4 col-12"
                dynamicOptions={positionType}
                handleChange={handleSelect}
                value={`${values?.position?.value}`}
                name={"position"}
              />
            </div>
          ) : (
            ""
          )}

          <ReactSelect
            placeholderName={t("Slot Wise Token")}
            id={"slotWiseToken"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={slotWisetoken}
            handleChange={handleSelect}
            value={`${values?.slotWiseToken?.value}`}
            name={"slotWiseToken"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="doctimeDisplay"
            name="doctimeDisplay"
            value={values?.doctimeDisplay || ""}
            onChange={handleChange}
            lable={t("Doc TimeDisplay")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
        </div>

        <Heading title={t("OPD Schedule Details")} />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Select Days Date")}
            id={"Datedays"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={selectdaysDate}
            handleChange={handleSelect}
            value={`${values?.Datedays?.value}`}
            name={"Datedays"}
          />

          {/* <ReportsMultiSelect
            name="getDays"
            placeholderName="getDays"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getDays}
            labelKey="label"
            valueKey="value"
            requiredClassName={true}
          /> */}

{/* const selectdaysDate = [
    { value: "Days", label: "Days" },
    { value: "Date", label: "Date" },
  ]; */}
          {values?.Datedays?.value=="Days"?  
         <ReportsMultiSelect
         name="getDays"
         placeholderName="getDays"
         respclass="col-xl-2 col-md-4 col-sm-6 col-12"
         values={values}
         setValues={setValues}
         dynamicOptions={getDays}
         labelKey="label"
         valueKey="value"
         requiredClassName={true}
       />:
          <DatePicker
            id="startTime"
            className="custom-calendar"
            name="startTime"
            lable={t("Start Time")}
            value={values?.startTime || new Date()}
            handleChange={handleChange}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />
}

          <ReactSelect
            placeholderName={t("Centre")}
            id={"centre"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                centreVal,
                "CentreName",
                "CentreID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.centre?.value}`}
            name={"centre"}
          />

          {/* <TimePicker
            placeholderName="Start Time"
            id="starttime"
            name="starttime"
            value={values?.starttime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleChange}
          /> */}

          <TimePicker
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="Start Time"
            lable={t("Start Time")}
            id="starttime"
            name="starttime"
            value={values?.starttime ? values?.starttime : new Date()}
            handleChange={handleChange}
          />

          {/* <TimePicker
            placeholderName="End Time"
            id="endtime"
            name="endtime"
            value={values?.endtime}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleChange}
          /> */}


          <TimePicker
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            placeholderName="End Time"
            lable={t("End Time")}
            id="endtime"
            name="endtime"
            value={values?.endtime ? values?.endtime : new Date()}
            handleChange={handleChange}
          />

          <ReactSelect
            placeholderName={t("Shift")}
            id={"shift"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            requiredClassName="required-fields"
            dynamicOptions={ShiftArr}
            handleChange={handleSelect}
            value={`${values?.shift?.value}`}
            name={"shift"}
          />

          <ReactSelect
            placeholderName={t("Patient Duration")}
            id={"duration"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={PatientDuration}
            handleChange={handleSelect}
            value={`${values?.duration?.value}`}
            name={"duration"}
          />

          <div className="col-sm-2 col-xl-2">
            <button
              className="btn btn-sm btn-success "
              type="button"
              onClick={handleAddTimings}
            >
              {t("Add Timings")}
            </button>
          </div>
        </div>
        {timingValues.length > 0 && (
          <div className="card">
            <Tables
              thead={theadSaveData}
              tbody={timingValues?.map((val, index) => ({
                sno: index + 1,
                centre: val?.centre,
                shift: val?.shift,
                duration: val?.duration,
                endTime: val?.endtime,
                startTime: val?.starttime,
                days: val?.getDays,
              }))}
              tableHeight={"scrollView"}
              // style={{ height: "20vh" }}
              style={{ paddingBottom: "20px" }}
            />
          </div>
        )}

        <Heading title={t("Not-Available Schedule Details")} />

        <div className="row pt-2 px-2">
          {/* <ReactSelect
            placeholderName={t("Select Days Date")}
            id={"Datedays"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={selectdaysDate}
            handleChange={handleSelect}
            value={values?.Datedays?.value}
            name={"Datedays"}
          /> */}

          <ReactSelect
            placeholderName={t("Centre")}
            id={"centreVal"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                centreVal,
                "CentreName",
                "CentreID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.centreVal?.value}`}
            name={"centreVal"}
          />

          <DatePicker
            id="startTime"
            className="custom-calendar"
            name="startTime"
            lable={t("Start Time")}
            value={values?.startTime || new Date()}
            handleChange={handleChange}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />

          <DatePicker
            id="endTime"
            className="custom-calendar"
            name="endTime"
            lable={t("End Time")}
            value={values?.endTime || new Date()}
            handleChange={handleChange}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />

          <div className="col-sm-2 col-xl-2">
            <button
              className="btn btn-sm btn-success "
              type="button"
              // onClick={handleSearchSampleCollection}
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {searchTableData.length > 0 && (
          <div className="card">
            <Tables
              thead={theadSearchdata}
              tbody={searchTableData?.map((val, index) => ({
                Select: (
                  <div>
                 <input
                    type="checkbox"
                    checked={selectedRows.some(
                      (item) => item?.NADate === val?.NADate
                    )}
                    onChange={() => handleCheckboxChange(val)}
                  />
                  </div>
                ),
                Centre: val?.CentreName,
                Date: val?.DateValue,
                Day: val?.DayValue,
                // fromtime: val?.endtime || "",
                fromtime: (
                  <TimePicker
                    placeholderName="From Time"
                    id={`fromTime-${index}`}
                    name="fromTime"
                    value={val?.fromTime}
                    // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    handleChange={(e) =>
                      handleChangeTime(index, "fromTime", e.target?.value)
                    }
                  />
                ),
                totime: (
                  <TimePicker
                    placeholderName="To Time"
                    id={`toTime-${index}`}
                    name="toTime"
                    value={val?.toTime}
                    // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                    handleChange={(e) =>
                      handleChangeTime(index, "toTime", e.target?.value)
                    }
                  />
                ),
              }))}
              tableHeight={"scrollView"}
              // style={{ height: "20vh" }}
              style={{ paddingBottom: "20px" }}
            />
          </div>
        )}
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 px-2">
          <div className="col-xl-2 col-md-3 col-sm-4 col-6">
            <BrowseButton
              label={t("Digital Signature")}
              // handleImageChange={handleImageChange}
              className={`btn-primary  w-100 px-xl-3 mb-2 px-3`}
              // value={values?.headerLogo}
              name="digitalSignature"
            />
          </div>
          <ReactSelect
            placeholderName={t("Floor")}
            id={"floor"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            // dynamicOptions={[
            //   { value: "0", label: "ALL" },
            //   ...handleReactSelectDropDownOptions(departmentData, "Name", "ID"),
            // ]}
            handleChange={handleSelect}
            value={values?.floor?.value}
            name={"floor"}
          />

          <div className="col-sm-2 col-xl-2">
            <button
              className="btn btn-sm btn-success "
              type="button"
              // onClick={handleSearchSampleCollection}
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorReg;
