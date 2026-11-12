  
import React, { useState, useEffect } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../components/commonComponents/ColorCodingSearch";
import Tables from "../../components/UI/customTable";
import { notify } from "../../utils/utils";
 
import {LogisticReceiveSearch} from "../../networkServices/SampleCollectionAPI";
import { CancelSVG } from "../../components/SvgIcons";  
function SampleLogisticReceive(){
  const [t] = useTranslation();
  const TransferredData = [
    { value: "0", label: "Select" },
    { value: "1", label: "E-LAB PRO" },
  ];

  const [values, setValues] = useState({
    BarcodeNo: "",
    DispatchCode: "",
    TransferredFrom: null,
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
  });

  //Declaring ALL State
  const [tbodyPatientDetail, setTbodyPatientDetail] = useState([]);
  const isMobile = window.innerWidth <= 800; 
  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }; 

  console.log("the values data is",values);
 

  // Handle tbody checkbox
 

  const handleSearchSampleCollection = async () => { 
    const payload = {
        centreID: "",
        barcodeNo:values.BarcodeNo,
        dipatchCode: values.DispatchCode,
        filterType: "", 
        fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
    };
    try {
      const apiResp = await LogisticReceiveSearch(payload);
      console.log("the payload data is",payload);
      if (apiResp.success) {
        let data = apiResp?.data?.map((val) => { 
          return val;
        });
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
        <input
          type="checkbox" 
        />
      ),
    },
  ]; 
 
  return (
    <>
   
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
          <ReactSelect
            placeholderName={t("Transferred From")}
            id="TransferredFrom"
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={TransferredData}
            handleChange={(selected) =>
              handleSelect("TransferredFrom", selected)
            }
            value={values?.status}
            name="TransferredFrom"
          />
          <Input
            type="text"
            className="form-control"
            id="BarcodeNo"
            placeholder=" "
            name="BarcodeNo"
            value={values?.BarcodeNo || ""}
            onChange={handleChange}
            lable={t("Barcode No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="DispatchCode"
            name="DispatchCode"
            value={values?.DispatchCode || ""}
            onChange={handleChange}
            lable={t("Dispatch Code")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          /> 
          <DatePicker
            id="fromDate"
            name="fromDate"
            lable={t("From Date")}
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
              {t("Search Logistic Samples")}
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

export default SampleLogisticReceive;

