import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import { useSelector } from "react-redux";
import { REFUND_REPORT_TYPE } from "../../../utils/constant";
import { OpenPDFURL, RedirectURL, RedirectURLReport } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/utils";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { RefundReport } from "../../../networkServices/ReportsAPI";

export default function RefundDetail() {
  const [t] = useTranslation();

  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const initialValues = {
    centre: [],
    reportType: "1",
    printType: "1",
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

  const handleRefundReport = async () => {
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.fromDate == "") {
      notify("Please Select From Date.", "error");
    } else if (values?.toDate == "") {
      notify("Please Select To Date.", "error");
    } else if (values?.reportType == "") {
      notify("Please Select Report Type.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await RefundReport({
          FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
          ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
          CentreId: values?.centre?.map((ele, _) => ele?.code).join(","),
          ReportType: values?.reportType,
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
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row  p-2 ">
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

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={REFUND_REPORT_TYPE}
            name="reportType"
            value={values.reportType}
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

          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary"
              type="button"
              onClick={handleRefundReport}
            >
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
