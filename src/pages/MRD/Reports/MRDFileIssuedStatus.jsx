import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import moment from "moment";
import { PrintFileIssuesStatus } from "../../../networkServices/ReportsAPI";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../store/store";
import { notify } from "../../../utils/utils";

const MRDFileIssuedStatus = () => {
  const [t] = useTranslation();

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    UHID: "",
    PatientName: "",
    patientType: "ALL",
    printType:"1"
  };
  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values?.patientType == "") {
      notify("Please Enter Patient Type", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await PrintFileIssuesStatus({
          mrno: String(values?.UHID),
          patientName: String(values?.PatientName),
          typeValue: "",
          typeText: "",
          patientType: values?.patientType,
          fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
          toDate: moment(values?.toDate).format("DD-MMM-YYYY"),
        });
        if (response?.success === false) {
          notify(response?.message, "error");
        } 
        else {
          console.log("response",response)
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
          <ReactSelect
            placeholderName={t("Patient Type")}
            id={"patientType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "ALL" },
              { label: "OPD", value: "OPD" },
              { label: "IPD", value: "IPD" },
              { label: "EMG", value: "EMG" },
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
            lable={t("Issued Date from")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("Issued Date To")}
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
            <button className="btn btn-sm btn-primary ml-2" type="submit">
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default MRDFileIssuedStatus;
