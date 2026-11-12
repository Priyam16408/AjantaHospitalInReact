
import React, { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import Tables from "../../components/UI/customTable";
import { CancelSVG } from "../../components/SvgIcons";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect"; 
import Input from "../../components/formComponent/Input";
import { SampleRejectionReport } from "../../networkServices/SampleCollectionAPI";
import { notify } from "../../utils/utils";
import { RedirectURL } from "../../networkServices/PDFURL";

function SampleRejection() {
  const [t] = useTranslation();
  const GetEmployeeWiseCenter = [ 
    { code: "0", name: "E-LAB PRO" },
    { code: "1", name: "HOSPEDIA" },
    { code: "2", name: "INNOPATH" },
    { code: "3", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  ]; 
  const User = [
    { value: "0", label: "Mr. ABHAYA KUMAR DAS" },
  ];
  
 

  const [values, setValues] = useState({
    centre: "",
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    BarcodeNo: "",
    user: "",
  });

  console.log("the values getting form the state", values);

  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const isMobile = window.innerWidth <= 800;
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  }; 

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
 

 const handleSearchSampleCollection = async () => {
    const payload = { 
        fromDate:moment(values?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
        labNo: values?.BarcodeNo
    };

    try { 
      const apiResp = await SampleRejectionReport(payload);
      if (apiResp?.success) {
        RedirectURL(apiResp?.data.value.pdfUrl); 

      } else {
        notify("No records found", "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      notify("An error occurred while fetching data", "error");
      setTbodyPatientDetail([]);
    }
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
 

  const HandleCheckBox = ()=>{
     console.log("this is handle checkbox");
  }

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
            labelKey="name"
            valueKey="code"
            requiredClassName={true}
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

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="BarcodeNo"
            name="BarcodeNo"
            value={values?.BarcodeNo || ""}
            onChange={handleChange}
            lable={t("BarcodeNo")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("User")}
            id="user"
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={User}
            handleChange={(selected) => handleSelect("select", selected)}
            value={values?.status}
            name="user"
          />

          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={handleSearchSampleCollection}
            >
              {t("Search")}
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
                    onClick={HandleCheckBox}
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

export default SampleRejection;
