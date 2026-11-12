import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportTimePicker from "../../../components/ReportCommonComponents/ReportTimePicker";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  BedOccupancyReportType,
  BedOccupancyType,
} from "../../../utils/constant";
import moment from "moment";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { MRDBedOccupancyReport } from "../../../networkServices/MRDApi";
import { notify } from "../../../utils/utils";
import store from "../../../store/store";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";

const BedOccupancyReport = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    AtTime: "",
    printType: "1",
    reportType: "",
    bedOccupancyType: ""
  };

  const [values, setValues] = useState({ ...initialValues });
  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    store.dispatch(setLoading(true));
    try {
      if(!values.reportType){
        notify("Please Select ReportType", "error");
              return
      }

      const data =
      {
        fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
        toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
        type: values?.printType,
        time: moment(values?.AtTime).format("hh:mm A"),
        rbtReportType: values?.reportType,
        "rbtReportTypeText": values.bedOccupancyType?values.bedOccupancyType: "All",
      }
      const response = await MRDBedOccupancyReport(data);
      if (response?.pdfUrl) {
        RedirectURL(response?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "No Record Found.");
    }
    finally {
      store.dispatch(setLoading(false));
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

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={BedOccupancyReportType}
            name="reportType"
            value={values.reportType}
            handleChange={handleReactSelectChange}
            
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
          {
            (!values.reportType || values.reportType !== "2")
            // (values.reportType == "1" || values.reportType == "3")
             &&
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="toDate"
              name="toDate"
              lable={t("To Date")}
              values={values}
              setValues={setValues}
            />
          }


          <ReportTimePicker
            placeholderName="At Time"
            respclass="col-xl-1 col-md-4 col-sm-12 col-xs-12"
            lable={t("At Time")}
            name="AtTime"
            id="Fromtime"
            values={values}
            setValues={setValues}
          />

          {
            (values.reportType == "3") &&
            <ReactSelect
              placeholderName={t("BedOccupancyType")}
              id={"bedOccupancyType"}
              searchable={true}
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              dynamicOptions={BedOccupancyType}
              name="bedOccupancyType"
              value={values.bedOccupancyType}
              handleChange={handleReactSelectChange}
            />
          }
          
          {
            (values.reportType == "2" || values.reportType == "3") &&

            <ReportPrintType
              placeholderName={t("Print Type")}
              id="printType"
              searchable
              respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
              values={values}
              name={"printType"}
              setValues={setValues}
            />
          }

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
export default BedOccupancyReport;
