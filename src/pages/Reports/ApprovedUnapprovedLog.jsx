import React, { useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import { notify } from "../../utils/utils"; 
import TimePicker from "../../components/formComponent/TimePicker";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import { RedirectURL } from "../../networkServices/PDFURL";
import { approvedapi } from "../../networkServices/approvedunapprovedLog";
import { useSelector } from "react-redux";
function ApprovedUnapprovedLog() {
  const [t] = useTranslation();
    const {
    GetEmployeeWiseCenter,
  } = useSelector((state) => state?.CommonSlice);
  const reportType = [
    { value: "0", label: "ALL" },
    { value: "1", label: "OPD" },
    { value: "2", label: "IPD" },
    { value: "3", label: "EMERGENCY" },
  ];
  const Userdata = [
    { value: "0", label: "All" },
    { value: "1", label: "Mr. ABHAY KUMAR" },
    { value: "2", label: "Mr Administrator" },
    { value: "3", label: "Mr Administrator" },
    { value: "4", label: "Mr Administrator" },
    { value: "5", label: "Mr Administrator" },
  ];

  // const GetEmployeeWiseCenter = [
  //   { code: "1", name: "E-LAB PRO" },
  //   { code: "2", name: "HOSPEDIA" },
  //   { code: "3", name: "INNOPATH" },
  //   { code: "4", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  // ];

  const initialValues = {
    LabNo: "",
    user: "",
    fromDate: new Date(),
    Time: "",
    toDate: new Date(),
    reportType:{ value: "0", label: "ALL" },
    centre:"",
  };

  const [values, setValues] = useState({ ...initialValues });

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


  const handleSearchSampleCollection = async () => {  
    if (!values?.centre || handlePayloadMultiSelect(values?.centre).length === 0) {
      notify("Please select at least one centre", "error");
    }

    else{
  
    const payload = {
        "centres": handlePayloadMultiSelect(values?.centre),
        "fromDate": moment(values?.fromDate).format("DD-MMM-YYYY"),
        "toDate": moment(values?.toDate).format("DD-MMM-YYYY"),
        "user": values?.Userdata?.label,
        "reportType": values?.reportType?.value
    };

    try {
        const apiResp = await approvedapi(payload);
 
        if (!apiResp || apiResp?.success === false || !apiResp?.data?.value || apiResp?.data?.value?.length === 0) {
            notify("No records found", "error");
        } else {
            // Redirect if data exists
            RedirectURL(apiResp?.data?.value?.pdfUrl);
        }
    } catch (error) {
        notify("An error occurred while fetching data", "error");
    }    
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
          <ReactSelect
            placeholderName={t("Lab Type")}
            id={"reportType"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={reportType}
            handleChange={handleSelect}
            value={`${values?.reportType}`}
            name={"reportType"}
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="barcodeno"
            name="barcodeno"
            value={values?.LabNo || ""}
            onChange={handleChange}
            lable={t("Barcode No")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("User")}
            id={"user"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={Userdata}
            handleChange={handleSelect}
            value={`${values?.user}`}
            name={"user"}
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
          <TimePicker
            placeholderName={t("Time")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="Time"
            name="Time"
            value={values?.Time ? values?.Time : new Date()}
            handleChange={handleChange}
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
          <TimePicker
            placeholderName={t("Time")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="Time"
            name="Time"
            value={values?.Time ? values?.Time : new Date()}
            handleChange={handleChange}
          />

          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
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

export default ApprovedUnapprovedLog;
