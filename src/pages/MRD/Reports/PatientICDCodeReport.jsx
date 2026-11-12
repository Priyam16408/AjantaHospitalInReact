import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import { FromAgesTOAges } from "../../../utils/constant";
import { MRDPatientICDCodeReport } from "../../../networkServices/MRDApi";
import { useDispatch } from "react-redux";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";

const PatientICDCodeReport = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const initialValues = {
    centre:[],
    printType: "",
    fromDate: new Date(),
    toDate: new Date(),
    UHID: "",
    ICDCodeNo: "",
  };
  const [values, setValues] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  useEffect(() => {
    setValues({
      ...values,
    //  ["centre"]: GetEmployeeWiseCenter.map((item) => String(item.CentreID)),
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
     
    });
   

  }, [GetEmployeeWiseCenter?.length]);

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items) => String(items?.code));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    store.dispatch(setLoading(true));
    try {

      const data =
      {
   
        "chkCentre": handlePayloadMultiSelect(values?.centre),
        "icdCodeNo": values?.ICDCodeNo,
        "mrNo": values?.UHID,
        "fromDate": values?.fromDate,
        "toDate": values?.toDate,
        "reporttype": values?.printType
      }   
      const response = await MRDPatientICDCodeReport(data);
      if (response?.success) {
        RedirectURL(response?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "No Record Found.");
    }
    finally{
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
        <form className="row p-2 justify-content-centers">
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
           {/* <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName="required-fields"
          /> */}

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
            id="ICDCodeNo"
            lable={t("ICD Code No")}
            placeholder=" "
            // required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="ICDCodeNo"
            value={values.ICDCodeNo}
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
              onClick={handleSubmit}
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default PatientICDCodeReport;
