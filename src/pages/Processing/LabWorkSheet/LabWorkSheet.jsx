import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";

import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import Tables from "../../../components/UI/customTable";
import { BindDepartmentLab } from "../../../networkServices/departmentreceive";
import { useSelector } from "react-redux";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BindDepartmentSeet,
  handleLabWorkSheet,
  SearchLabSeet,
  WorkSheetGetPanel,
} from "../../../networkServices/LabWorkSheet";
import { RedirectURL } from "../../../networkServices/PDFURL";

function LabWorkSheet() {
  const [t] = useTranslation();
  const [panel, setPanel] = useState([]);
  const type = [
    { value: "ALL", label: "ALL" },
    { value: "OPD", label: "OPD" },
    { value: "IPD", label: "IPD" },
  ];

  const PatientTypeTest = [
    { value: "2", label: "All" },
    { value: "1", label: "Urgent" },
    { value: "0", label: "Normal" },
  ];

  const Status = [
    { value: "All", label: "All" },
    { value: "Not Approved", label: "Not Approved" },
    { value: "Result Not Done", label: "Result Not Done" },
  ];

  const PrintStatus = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Printed" },
    { value: "2", label: "All" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    PatientName: "",
    LABNo: "",
    UHID: "",
    IPDNo: "",
    patintName: "",
    panel: { value: "0", label: "ALL" },
    PatientTypeTest: { value: "2", label: "ALL" },
    type: { value: "OPD", label: "OPD" },
    SampleCollected: { value: "N", label: "Sample Not Colleted" },
    department: { value: "0", label: "ALL" },
    Doctor: { value: "0", label: "ALL" },
    Panel: { value: "", label: "ALL" },
    Status: { value: "All", label: "All" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),

    PrintStatus: { value: "0", label: "Pending" },
  });
  const { VITE_DATE_FORMAT } = import.meta.env;

  const CheckDepartment = async () => {
    try {
      const response = await BindDepartmentSeet();
      if (response.success) {
        console.log("the department data is", response);
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

  const BindPanel = async () => {
    try {
      const response = await WorkSheetGetPanel();
      if (response.success) {
        console.log("the department data is", response);
        // setDepartmentData(response.data);
        setPanel(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setPanel([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setPanel([]);
    }
  };

  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState(false);

  const [handleModelData, setHandleModelData] = useState({});

  const [departmentData, setDepartmentData] = useState([]);
  const isMobile = window.innerWidth <= 800;
  console.log(handleModelData);
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeCheckboxHeader = (e) => {
    const isChecked = e.target.checked;
    setIsHeaderChecked(isChecked);

    const updatedData = tbodyPatientDetail.map((val) => ({
      ...val,
      isChecked: isChecked,
    }));
    setTbodyPatientDetail(updatedData);
  };

  // Handle tbody checkbox
  const handleChangeCheckbox = (e, index) => {
    const updatedData = [...tbodyPatientDetail];
    updatedData[index].isChecked = e.target.checked;
    setTbodyPatientDetail(updatedData);
    const allChecked = updatedData.every((item) => item.isChecked);
    setIsHeaderChecked(allChecked);
  };

  const { GetDepartmentList } = useSelector((state) => state.CommonSlice);

  const handleSearchSampleCollection = async () => {
    const payload = {
      labType: values?.type?.value,
      labNo: values?.LABNo,
      statusIndex: 0,
      statusText: "",
      status: values.Status.value || "All",
      barCodeNo: values?.BarcodeNo,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      department: values?.department?.value?.toString() ?? "0",
      mrNo: values?.UHID,
      panelID: values.panel.PanelID,
      pName: String(values?.patintName),
      urgent:values.PatientTypeTest.value || "2",
      cptCode: "",
      crNo: values?.IPDNo,
      printStatus: values?.PrintStatus.value,
    };
    console.log("payload", payload);
    try {
      const apiResp = await SearchLabSeet(payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => {
          val.isChecked = false;
          return val;
        });
        notify(`${data.length} records found`, "success");
        setTbodyPatientDetail(data);
      } else {
        notify("No records found", "error");
        setTbodyPatientDetail([]);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
  };

  const handleWorkSheet = async () => {
    const anyChecked = tbodyPatientDetail.some((item) => item.isChecked);
    if (!anyChecked) {
      notify(
        "Kindly select at least one sample or maybe the selected sample is already received",
        "error"
      );
      return;
    }

    // Proceed if a checkbox is selected
    let RecPayload = [];
    tbodyPatientDetail?.map((val) => {
      if (val?.isChecked) {
        let data = {
          labNo: String(val.LTD),
          testID: String(val?.Test_ID ? val?.Test_ID : ""),
          reportType: String(val?.ReportType ? val?.ReportType : ""),
        };
        //   RecPayload.push(data);
        RecPayload.push(data);
      }
    });

    try {
      const ReciveResp = await handleLabWorkSheet(RecPayload);
      if (ReciveResp.success) {
        handleSearchSampleCollection();
        RedirectURL(ReciveResp.data.value.pdfUrl);
      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      notify("some error occurs", "error");
    }
  };

  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("Type") },
    { width: "15%", name: t("MR No") },
    { width: "15%", name: t("Barcode No") },
    { width: "15%", name: t("IPD No") },
    { width: "10%", name: t("Lab No") },
    { width: "15%", name: t("Name") },
    { width: "10%", name: t("Age") },
    { width: "10%", name: t("Invesigation") },
    { width: "15%", name: t("Date") },
    { width: "10%", name: t("Doctor") },
    { width: "10%", name: t("Panel") },
    {
      width: "5%",
      name: isMobile ? (
        t("NursingWard.NurseAssignment.check")
      ) : (
        <input
          type="checkbox"
          checked={isHeaderChecked}
          onChange={handleChangeCheckboxHeader}
        />
      ),
    },
  ];

  useEffect(() => {
    CheckDepartment();
    BindPanel();
  }, []);

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={type}
            handleChange={handleSelect}
            value={`${values?.type?.value}`}
            name={"type"}
          />

          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            lable={t("UHID")}
            placeholder=" "
            value={values?.UHID ? values?.UHID : ""}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // onKeyDown={Tabfunctionality}
          />

          <Input
            type="text"
            className="form-control"
            id="LABNo"
            name="LABNo"
            lable={t("Lab No")}
            placeholder=" "
            value={values?.LABNo ? values?.LABNo : ""}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // onKeyDown={Tabfunctionality}
          />

          <Input
            type="text"
            className="form-control"
            id="BarcodeNo"
            name="BarcodeNo"
            lable={t("BarcodeNo")}
            placeholder=" "
            value={values?.BarcodeNo ? values?.BarcodeNo : ""}
            onChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // onKeyDown={Tabfunctionality}
          />

          <Input
            type="text"
            className="form-control"
            id="patintName"
            placeholder=" "
            name="patintName"
            value={values?.patintName || ""}
            onChange={handleChange}
            lable={t("Patient Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Patient Type Test")}
            id={"PatientTypeTest"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={PatientTypeTest}
            handleChange={handleSelect}
            value={`${values?.PatientTypeTest?.value}`}
            name={"PatientTypeTest"}
          />

          {/* <Input
            type="text"
            className="form-control"
            id="CPTCode "
            name="IPDNo"
            value={values?.IPDNo ? values?.IPDNo : ""}
            onChange={handleChange}
            lable={t("CPT Code")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // onKeyDown={Tabfunctionality}
          /> */}
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

          <ReactSelect
            placeholderName={t("Status")}
            id={"Status"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Status}
            handleChange={handleSelect}
            value={`${values?.Status?.value}`}
            name={"Status"}
          />

          {/* <ReactSelect
            placeholderName={t("Panel")}
            id={"SampleCollected"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            // dynamicOptions={type}
            handleChange={handleSelect}
            // value={`${values?.type?.value}`}
            name={"SampleCollected"}
          />
           */}

          <ReactSelect
            placeholderName={t("Panel")}
            id={"panel"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              { value: "0", label: "ALL" },
              ...handleReactSelectDropDownOptions(
                panel,
                "Company_Name",
                "PanelID"
              ),
            ]}
            handleChange={handleSelect}
            value={`${values?.panel?.value}`}
            name={"panel"}
          />

          <DatePicker
            className="custom-calendar"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            value={values?.fromDate ? values?.fromDate : new Date()}
            handleChange={handleChange}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />
          <DatePicker
            className="custom-calendar"
            id="toDate"
            name="toDate"
            value={values?.toDate ? values?.toDate : new Date()}
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
          />

          <ReactSelect
            placeholderName={t("Print Status")}
            id={"PrintStatus"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={PrintStatus}
            handleChange={handleSelect}
            value={`${values?.PrintStatus?.value}`}
            name={"PrintStatus"}
          />

          <div className=" col-sm-2 col-xl-6">
            <button
              className="col-sm-2 col-xl-2 mx-2 btn btn-sm btn-info"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Search")}
            </button>

            <button
              className="col-sm-2 col-xl-2 btn btn-sm btn-info"
              type="button"
              onClick={handleWorkSheet}
            >
              {t("WorkSheet")}
            </button>
          </div>
        </div>

        <Heading
          title=""
          isBreadcrumb={false}
          secondTitle={
            <>
              <ColorCodingSearch label={t("Mac")} color="#9ACD32" />
              <ColorCodingSearch label={t("Due Amount")} color="#A9A9A9" />
              <ColorCodingSearch label={t("Approved")} color="#90EE90" />
              <ColorCodingSearch label={t("Not Approved")} color="#FF7F50" />
              <ColorCodingSearch label={t("Not Done")} color="#FFFFFF" />
              <ColorCodingSearch label={t("Urgent")} color="#E1EEFF" />
              <ColorCodingSearch label={t("Outsource")} color="#E1EEFF" />
              <ColorCodingSearch label={t("Delay")} color="#FFF" />
            </>
          }
        />
        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
                Type: val.Type,
                MRNo: val.PID || "",
                BarCodeNo: val.BarcodeNo || "",
                IPDNo: val.LedgerTransactionNo || "",
                LabNo: val.LTD || "",
                Name: val.pname || "",
                Age: val.age || "",
                Investigation: val.ObservationName || "",
                Date: val.InDate || "",
                Doctor: val.DName || "",
                Panel: val.Panel || "",
                isChecked: (
                  <input
                    type="checkbox"
                    checked={val.isChecked}
                    onChange={(e) => handleChangeCheckbox(e, index)}
                  />
                ),
              }))}
              tableHeight={"scrollView"}
              style={{ height: "60vh", padding: "2px" }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default LabWorkSheet;
