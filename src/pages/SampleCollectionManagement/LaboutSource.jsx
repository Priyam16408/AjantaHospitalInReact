import React, { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import Tables from "../../components/UI/customTable";
import { CancelSVG } from "../../components/SvgIcons"; 
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportPrintType from "../../components/ReportCommonComponents/ReportPrintType";
import { SampleOutSourceReportSearch } from "../../networkServices/SampleCollectionAPI";
import { notify } from "../../utils/utils";
import { RedirectURL } from "../../networkServices/PDFURL";
import { GetLabOutsource } from "../../networkServices/approvedunapprovedLog";
import { useSelector } from "react-redux";

function LaboutSource() {
  const [t] = useTranslation();
 const {GetEmployeeWiseCenter}=useSelector((state)=> state?.CommonSlice)
 console.log(GetEmployeeWiseCenter);
 
  const Labtype = [
    { value: "0", label: "All" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMERGENCY" },
  ];
  // const GetEmployeeWiseCenter = [
  //   { code: "0", name: "E-LAB PRO" },
  //   { code: "1", name: "HOSPEDIA" },
  //   { code: "2", name: "INNOPATH" },
  //   { code: "3", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  // ];

  const [values, setValues] = useState({
    centre: [],
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(), 
    labtype: "",
    printType: "",
  }); 
  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const [BindlabOutSouce,setBindlabOutsource] = useState([]);
  const isMobile = window.innerWidth <= 800;
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const theadPatientDetail = [
    { width: "5%", name: t("SNo") },
    { width: "15%", name: t("From Center") },
    { width: "15%", name: t("To Center") },
    { width: "10%", name: t("Barcode No.") },
    { width: "15%", name: t("Patient Name") },
    { width: "15%", name: t("UHID") },
    { width: "10%", name: t("Test Name") },
    { width: "10%", name: t("Dispatch Date") },
    { width: "10%", name: t("Dispatch No.") },
    { width: "10%", name: t("Courier Boy Name") },
    {
      width: "5%",
      name: isMobile ? (
        t("NursingWard.NurseAssignment.check")
      ) : (
        <input type="checkbox" />
      ), 
    },
  ];
  
  
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items) => items?.code).join(",");
  };
  

  const handleSearchSampleCollection = async () => {  
    const payload =  
      {
        "outSourceLab": "1",
        "centre":handlePayloadMultiSelect(values?.centre),
        "type": values?.labtype?.value,
        "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
        "toDate":moment(values?.toDate).format("DD-MMM-YYYY"),
        "reportFormat": 0
      };

    
  
    try {
      const apiResp = await GetLabOutsource(payload); 
      if (apiResp?.success) {
        RedirectURL(apiResp?.data?.value?.pdfUrl);
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


  
    const BindlabOutSource = async () => {
      try {
        const response = await BindlabOutSource();
        if (response.success) {
          console.log("the department data is", response);
          setBindlabOutsource(response.data);
        } else {
          console.error(
            "API returned success as false or invalid response:",
            response
          );
          setBindlabOutsource([]);

        }
      } catch (error) {
        console.error("Error fetching department data:", error);
        setBindlabOutsource([]);
      }
    };

 
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
            placeholderName={t("Centre")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />
          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("FromDate")}
            value={values?.fromDate || new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={values?.fromDate}
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

          <ReactSelect
            placeholderName={t("Lab Type")}
            id={"labtype"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Labtype}
            handleChange={handleSelect}
            value={`${values?.labtype}`}
            name={"labtype"}

          />

          <ReportPrintType
            placeholderName={t("Print Type")}
            id="printType"
            searchable
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            values={values}
            name={"printType"}
            setValues={setValues}
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

        <Heading
          title=""
          isBreadcrumb={false}
          secondTitle={
            <>
              <ColorCodingSearch label={t("Pending")} color="#CC99FF" />
              <ColorCodingSearch label={t("Received")} color="bisque" />
              <ColorCodingSearch label={t("Reject")} color="#FF0000" />
            </>
          }
        />
        {tbodyPatientDetail.length > 0 && (
          <div className="card">
            <Tables
              thead={theadPatientDetail}
              tbody={tbodyPatientDetail?.map((val, index) => ({
                sno: index + 1,
                Test_ID: val.Test_ID,
                BookingCenter: val.BookingCenter || "",
                Type: val.PatientType || "",
                BarCodeNo: val.BarcodeNo || "",
                PatientName: val.PatientName || "",
                UHID: val.PatientID || "",
                AgeGender: val.Age || "",
                // DepartmentName: val.Department || "",
                ReqDateWithdrawDateDeviation: `${val.Samplerequestdate || ""} ${val.Acutalwithdrawdate || ""} ${val.DevationTime || ""}`,
                TestName: val.TestName || "",
                Reject: (
                  <span
                    onClick={() => {
                      handleClickReject(val);
                    }}
                  >
                    <CancelSVG />
                  </span>
                ),
                isChecked: (
                  <input
                    type="checkbox"
                    // checked={val.isChecked}
                    // onChange={(e) => handleChangeCheckbox(e, index)}
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
                onClick={handleRecieve}
              >
                {t("Receive")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LaboutSource;
