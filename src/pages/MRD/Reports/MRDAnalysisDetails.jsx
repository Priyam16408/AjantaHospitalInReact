import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { MRD_ANALYSIS_REPORTS } from "../../../utils/constant";
import { useSelector } from "react-redux";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { PrintMRDAnalysisDetail } from "../../../networkServices/ReportsAPI";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/utils";
import moment from "moment";

const MRDAnalysisDetails = () => {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const initialValues = {
    centre: [],
    printType: "1",
    type: "14",
    fromDate: new Date(),
    toDate: new Date(),
  };
  const [values, setValues] = useState({ ...initialValues });

  useEffect(() => {
    setValues({
      ...values,
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
    });
  }, [GetEmployeeWiseCenter?.length]);

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };
  const handlePayloadMultiSelect = (data) => {
    return data?.map((items) => String(items?.code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.type == "" || values.type === null) {
      notify(" Please Select Type.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await PrintMRDAnalysisDetail({
          chkCentre: handlePayloadMultiSelect(values?.centre),
          dateFrom: moment(values?.fromDate).format("DD-MMM-YYYY"),
          dateTo: moment(values?.toDate).format("DD-MMM-YYYY"),
          type: values?.type,
        });
        if (response?.success === false) {
          notify(response?.message, "error");
        } else {
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
          <ReactSelect
            placeholderName={t("Report Type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={MRD_ANALYSIS_REPORTS}
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
export default MRDAnalysisDetails;
