import React, { useState } from "react";
import Heading from "../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import moment from "moment";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import { notify } from "../../utils/utils";
import { SampleCollectionReportSearch } from "../../networkServices/SampleCollectionAPI";
import TimePicker from "../../components/formComponent/TimePicker";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import { RedirectURL } from "../../networkServices/PDFURL";
function SampleStatusReport() {
  const [t] = useTranslation(); 
  const reportType = [
    { value: "ALL", label: "All" },
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

  const GetEmployeeWiseCenter = [
    { code: "0", name: "E-LAB PRO" },
    { code: "1", name: "HOSPEDIA" },
    { code: "2", name: "INNOPATH" },
    { code: "3", name: "ITDOSE INFOSYSTEMS PVT. LTD." },
  ];

  const initialValues = {
    LabNo: "",
    user: "",
    fromDate: new Date(),
    Time: "",
    toDate: new Date(),
    reportType: "1",
    centre: [],
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
    return data?.map((items, _) => String(items?.code));
  };

  const handleSearchSampleCollection = async () => {
    console.log("the values data is", values);
    const payload = {
      labNo: values.LabNo,
      selectedUser: "0",
      reportType: "1",
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      fromTime: "",
      toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      toTime: "", //moment(values?.Time).format("hh:mm A"),
      selectedCentres: handlePayloadMultiSelect(values?.centre),
    };

    try {
      const apiResp = await SampleCollectionReportSearch(payload);
      if (apiResp?.success === false) {
        notify("No records found", "error");
      } else {
        console.log("the value o am getting from the values", values);
        RedirectURL(apiResp?.pdfUrl);
      }
    } catch (error) {
      notify("An error occurred while fetching data", "error");
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
            lable={t("Barcode No.")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <Input
            type="text"
            placeholder=""
            className="form-control"
            id="UHID"
            name="UHID"
            value={values?.LabNo || ""}
            onChange={handleChange}
            lable={t("UHID")}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

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
      </div>
    </>
  );
}

export default SampleStatusReport;
