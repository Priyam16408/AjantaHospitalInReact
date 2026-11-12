import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { notify } from "../../../utils/utils";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { PatientHistoryDetails } from "../../../networkServices/ReportsAPI";
import moment from "moment";
import { RedirectURL } from "../../../networkServices/PDFURL";

function PatientViseHistory() {
  const [t] = useTranslation();

  const initialValues = {
    UHID: "",
    printType: "0",
    fromDate: "",
    toDate: new Date(),
    fromDate: new Date(),
  };
  const [values, setValues] = useState({ ...initialValues });
  console.log("AVLU", values);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values?.UHID == "") {
      notify("Please Enter UHID No.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await PatientHistoryDetails({
          FromDate: values?.fromDate
            ? moment(values?.fromDate).format("YYYY-MM-DD")
            : "",
          ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
          UHID: String(values?.UHID),
        });
        if (response?.success) {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          notify(response?.data?.message, "error");
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
      <div className="spatient_registration_card">
        <form className="patient_registration card" onSubmit={handleSubmit}>
          <Heading isBreadcrumb={true} />
          <div className="row  p-2">
            <Input
              type="text"
              className="form-control required-fields"
              id="UHID"
              name="UHID"
              onChange={handleChange}
              value={values.UHID}
              lable={t("UHID")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            />
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="fromDate"
              name="fromDate"
              lable={t("fromDate")}
              values={values}
              setValues={setValues}
            />
            <ReportDatePicker
              className="custom-calendar"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              id="toDate"
              name="toDate"
              lable={t("toDate")}
              values={values}
              setValues={setValues}
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
            {/* <div
              className="col-sm-2 d-flex align-items-center"
              style={{ gap: "10px" }}
            >
              <Avatar label="" className="p-avatar-circle bg-info" />
              <label className="m-0">
                {t("FrontOffice.OPD.Report.PatientViseHistory.IPD")}
              </label>
              <Avatar label="" className="p-avatar-circle bg-success" />
              <label className="m-0">
                {t("FrontOffice.OPD.Report.PatientViseHistory.EMG")}
              </label>
              <Avatar label="" className="p-avatar-circle bg-warning" />
              <label className="m-0">
                {t("FrontOffice.OPD.Report.PatientViseHistory.OPD")}
              </label>
            </div> */}
            <div
              className=" d-flex align-items-center ml-3"
              style={{ gap: "10px" }}
            >
              {/* <button className="btn btn-sm btn-primary" type="submit">
                {t("FrontOffice.OPD.Report.PatientViseHistory.Save")}
              </button> */}
              <button className="btn btn-sm btn-primary" type="submit">
                {t("Report")}
              </button>
            </div>
            {/* <div className="col-xl-1 col-md-3 col-sm-4 col-12">
              <button className="btn btn-sm btn-primary" type="button">
                {t("FrontOffice.OPD.Report.PatientViseHistory.Save")}
              </button>
            </div>
            <div className="col-xl-1 col-md-3 col-sm-4 col-12">
              <button className="btn btn-sm btn-primary" type="button">
                {t("FrontOffice.OPD.Report.PatientViseHistory.Report")}
              </button>
            </div> */}
          </div>
        </form>
      </div>
    </>
  );
}

export default PatientViseHistory;
