import React, { useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import {
  MRDPatientSearchDetails_Reports,
} from "../../../utils/constant";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";

const PatientHistoryDetails = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const { handleChange, values, setValues, handleSubmit, resetForm } =
    useFormik({
      initialValues: MRDPatientSearchDetails_Reports,
      enableReinitialize: true,
      onSubmit: (values) => {
        resetForm();
      },
    });

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
  const handleMRDReport = () => {};
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
            dynamicOptions={[
              { value: "SELECT", label: "---Select Report---" },
              { value: "ANTLPR", label: "☛ Antenatal Patient Report" },
              {
                value: "ADVUTPR",
                label: "☛ Patient Advance Utilization Report",
              },
              { value: "SOUPR", label: "☛ Source Wise Patient Report" },
              { value: "PVH", label: "☛ Patient Visit History" },
              { value: "PVHRPT", label: "☛ Patient Visit History Report" },
              { value: "REGRPT", label: "☛ Patient Registration Report" },
            ]}
            name="reportType"
            handleChange={handleReactSelectChange}
            value={values.reportType}
            // value={values.}
          />
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"patientType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "0" },
              { label: "OPD", value: "1" },
              { label: "IPD", value: "2" },
              { label: "EMG", value: "3" },
            ]}
            name="patientType"
            handleChange={handleReactSelectChange}
            value={values.patientType}
            // value={values.}
          />
          <Input
            type="text"
            className="form-control"
            id="AppointmentNo"
            lable={t("UHID")}
            placeholder=" "
            // required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="UHID"
            value={values.UHID}
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="PatientName"
            lable={t("Patient Name")}
            placeholder=" "
            // required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="PatientName"
            value={values.PatientName}
            onChange={handleChange}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("FrontOffice.OPD.Report.CollectionReport.fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("FrontOffice.OPD.Report.CollectionReport.toDate")}
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

          <div className="box-inner text-center">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleMRDReport}
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default PatientHistoryDetails;
