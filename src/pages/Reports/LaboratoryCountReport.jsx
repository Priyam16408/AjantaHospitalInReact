import React, { useEffect, useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import { SampleCollectionReportSearch } from "../../networkServices/SampleCollectionAPI";
import TimePicker from "../../components/formComponent/TimePicker";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import { RedirectURL } from "../../networkServices/PDFURL";
import {
  BindDepartmentCountDetail,
  LabCountReports,
} from "../../networkServices/approvedunapprovedLog";
import {
  ageValidation,
  handleReactSelectDropDownOptions,
  notify,
} from "../../utils/utils";
import { FromAgesTOAges } from "../../utils/constant";
function LaboratoryCountReport() {
  const [t] = useTranslation();

  const reportType = [
    { value: "ALL", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMERGENCY" },
  ];

  const countType = [
    { value: "0", label: "Investigation" },
    { value: "1", label: "Observation" },
    ,
  ];
  const Gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "FeMale" },
    { value: "3", label: "Both" },
  ];

  const GetEmployeeWiseCenter = [
    { code: "1", name: "E-LAB PRO" },
    { code: "2", name: "HOSPEDIA" },
    { code: "3", name: "INNOPATH" },
    { code: "4", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  ];

  const FileFormat = [
    { value: "0", label: "PDF" },
    { value: "1", label: "EXCEL" },
  ];

  const initialValues = {
    LabNo: "",
    user: "",
    fromDate: new Date(),
    Time: "",
    department: "",
    patintName: "",
    Age: "",
    toDate: new Date(),
    Gender: "",
    ageToUnit: { value: "YRS" },
    ageFromUnit: { value: "YRS" },
    ageTo: "",
    ageFrom: "",
    reportType: { value: "0", label: "ALL" },
    centre: [],
    fileFormat:{ value: "0", label: "PDF" }
  };

  const [values, setValues] = useState({ ...initialValues });
  const [departmentData, setDepartmentData] = useState([]);

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handlePayloadMultiSelect = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => Number(item?.code));
  };

  // const handleSearchSampleCollection = async () => {

  //   const payload = {
  //     centre: handlePayloadMultiSelect(values?.centre),
  //     fromAge: "",
  //     toAge: "",
  //     ageFromUnit: "",
  //     ageToUnit: "",
  //     departmentId: values?.department?.value,
  //     investigationName: values.patintName,
  //     gender: values.Gender.value || "3",
  //     itemType: values?.reportType?.value,
  //     fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
  //     toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
  //     reportType: values?.fileFormat?.value,
  //   };

  //   try {
  //     const apiResp = await LabCountReports(payload);
  //     if (apiResp?.success === false) {
  //       notify("No records found", "error");
  //     } else {
  //       console.log("the value o am getting from the values", values);
  //       RedirectURL(apiResp?.data.value.pdfUrl);
  //     }
  //   } catch (error) {
  //     notify("An error occurred while fetching data", "error");
  //   }
  // };


  const downloadExcel = (data) => {
    try {
      // Convert base64 or buffer data to Blob
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Lab_Report_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
  
      // Append to DOM and trigger click
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      notify("Excel file downloaded successfully", "success");
    } catch (error) {
      notify("Error downloading Excel file", "error");
    }
  };
  

  const handleSearchSampleCollection = async () => {
    if (!values?.centre || handlePayloadMultiSelect(values?.centre).length === 0) {
      notify("Please select at least one centre", "error");
    }

    else{
    const payload = {
      centre: handlePayloadMultiSelect(values?.centre),
      fromAge: "",
      toAge: "",
      ageFromUnit: "",
      ageToUnit: "",
      departmentId: values?.department?.value,
      investigationName: values.patintName,
      gender: values.Gender.value || "3",
      itemType: values?.reportType?.value,
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      reportType: values?.fileFormat?.value,
    };
  
    try {
      const apiResp = await LabCountReports(payload);
  
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        console.log("Data received from API:", apiResp);
  
        if (values?.fileFormat?.value === "1") {
          // If report type is Excel, download the file
          downloadExcel(apiResp?.data);
        } else {
          // Otherwise, open the PDF report
          RedirectURL(apiResp?.data.value.pdfUrl);
        }
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
    }
  }
  };
  

  const CheckDepartment = async () => {
    try {
      const response = await BindDepartmentCountDetail();

      console.log("the department data is", response);
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

  

  useEffect(() => {
    CheckDepartment();
  }, []);
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="name"
            valueKey="code"
            requiredClassName={true}
          />

          <ReactSelect
            placeholderName={t("CountType")}
            id={"countType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={countType}
            handleChange={handleSelect}
            value={`${values?.countType}`}
            name={"countType"}
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

          <ReactSelect
            placeholderName={t("Report Format")}
            id={"fileFormat"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={FileFormat}
            handleChange={handleSelect}
            value={`${values?.fileFormat}`}
            name={"fileFormat"}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={reportType}
            handleChange={handleSelect}
            value={`${values?.reportType}`}
            name={"reportType"}
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <div className="row">
              <Input
                type="text"
                className="form-control"
                id="ageFrom"
                name="ageFrom"
                value={values?.ageFrom}
                onChange={handleChange}
                lable={t("From Age")}
                placeholder=" "
                respclass="col-md-6 col-7"
                showTooltipCount={true}
              />
              <ReactSelect
                placeholderName={t("Age From")}
                searchable={true}
                respclass="col-md-6 col-5"
                id={"ageFromUnit"}
                name={"ageFromUnit"}
                removeIsClearable={true}
                handleChange={(name, e) => handleSelect(name, e, "value")}
                // handleChange={handleDischargeSummaryBindHeaderList}
                dynamicOptions={FromAgesTOAges}
                value={values?.ageFromUnit?.value}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-4 col-sm-6 col-12">
            <div className="row">
              <Input
                type="text"
                className="form-control"
                id="ageTo"
                name="ageTo"
                value={values?.ageTo}
                onChange={handleChange}
                lable={t("To Age")}
                placeholder=" "
                respclass="col-md-6 col-7"
                showTooltipCount={true}
              />
              <ReactSelect
                placeholderName={t("Age To")}
                searchable={true}
                respclass="col-md-6 col-5"
                id={"ageToUnit"}
                name={"ageToUnit"}
                removeIsClearable={true}
                handleChange={(name, e) => handleSelect(name, e, "value")}
                dynamicOptions={FromAgesTOAges}
                // value={depatmentID}
                value={values?.ageToUnit?.value}
              />
            </div>
          </div>

          <Input
            type="text"
            className="form-control"
            id="patintName"
            placeholder=" "
            name="patintName"
            value={values?.patintName || ""}
            onChange={handleChange}
            lable={t("Name")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Gender")}
            id={"Gender"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Gender}
            handleChange={handleSelect}
            value={`${values?.Gender}`}
            name={"Gender"}
          />

          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("FromDate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.toDate}
          />

          <DatePicker
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            value={values?.toDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
            minDate={values?.fromDate}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LaboratoryCountReport;
