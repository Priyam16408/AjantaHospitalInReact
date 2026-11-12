import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportTimePicker from "../../../components/ReportCommonComponents/ReportTimePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { RedirectURL } from "../../../networkServices/PDFURL";
import moment from "moment";
import { MRDPrintMRDAllReports } from "../../../networkServices/ReportsAPI";
import { notify } from "../../../utils/utils";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../store/store";
import { MRD_ALL_REPORTS } from "../../../utils/constant";

const MRDAllReports = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
console.log("GetEmployeeWiseCenter",GetEmployeeWiseCenter)
  const initialValues = {
    centre: [],
    type: "",
    fromDate: new Date(),
    fromTime: new Date(),
    toDate: new Date(),
    toTime: new Date(),
    IPDNo: "",
    UHID: "",
    printType: "1",
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
  useEffect(() => {
    setValues({
      ...values,
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
    });
    console.log("values",values)
  }, [GetEmployeeWiseCenter?.length]);

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items) => String(items?.code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.type == "") {
      notify(" Please Select Type.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await MRDPrintMRDAllReports({
          chkCentre: handlePayloadMultiSelect(values?.centre),
          dateFrom: moment(values?.fromDate).format("DD-MMM-YYYY"),
          dateTo: moment(values?.toDate).format("DD-MMM-YYYY"),
          fromTime: moment(values?.fromTime).format("hh:mm A"),
          toTime: moment(values?.toTime).format("hh:mm A"),
          type: values?.type,
          uhid: String(values?.UHID),
          ipDno: String(values?.IPDNo),
        });
        // console.log("responseresponse",response)
      
        if (response?.success === false || response?.data?.success === false ) {
          notify(response?.message, "error");
          notify(response?.data?.message, "error");
        } else if(response?.pdfUrl) {
            //  console.log("pdfUrlpdfUrlpdfUrlpdfUrlpdfUrlpdfUrlpdfUrl")
            
        RedirectURL(response?.pdfUrl);

        }
       
      } catch (error) {
        console.log(error, "No Record Found.");
      } finally {
        store.dispatch(setLoading(false));
      }
    }
  };



  
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form
          className="row p-2 justify-content-centers"
          onSubmit={handleSubmit}
        >
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName="required-fields"
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("From Date")}
            values={values}
            setValues={setValues}
          />       
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("To Date")}
            values={values}
            setValues={setValues}
          />
          <ReportTimePicker
            placeholderName="From Time"
            respclass="col-xl-1 col-md-4 col-sm-12 col-xs-12"
            lable={t("From Time")}
            id="fromTime"
            name="fromTime"
            values={values}
            setValues={setValues}
          />
          <ReportTimePicker
            placeholderName="To Time"
            lable={t("To Time")}
            id="toTime"
            respclass="col-xl-1 col-md-4 col-sm-6 col-12"
            name="toTime"
            values={values}
            setValues={setValues}
          />         
          <Input
            type="text"
            className="form-control"
            id="AppointmentNo"
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="UHID"
            value={values.UHID}
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="IPDNo"
            lable={t("IPDNo")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="IPDNo"
            value={values.IPDNo}
            onChange={handleChange}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={MRD_ALL_REPORTS}
            name="type"
            value={values.type}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
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

          <div className="box-inner text-center">
            <button className="btn btn-sm btn-primary ml-2" type="submit">
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default MRDAllReports;
