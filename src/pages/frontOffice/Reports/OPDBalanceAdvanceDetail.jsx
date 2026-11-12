import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import { useSelector } from "react-redux";
import { BindPaymentModePanelWise } from "../../../networkServices/PaymentGatewayApi";
import { print_Type } from "../../../utils/constant";
import {
  RedirectURL,
  RedirectURLReport,
} from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/utils";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../store/store";
import { OPDAdvanceOutStandingReport } from "../../../networkServices/ReportsAPI";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";

export default function OPDBalanceAdvanceDetail() {
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const [apiData, setApiData] = useState({
    paymentModeData: [],
    getBindTypeOfTnxData: [],
  });

  useEffect(() => {
    setValues({
      ...values,
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
    });
  }, [GetEmployeeWiseCenter?.length]);

  const initialValues = {
    centre: [],
    paymentType: "ALL",
    UHID: "",
    type: "ALL",
    printType: "0",
    fromDate: new Date(),
    toDate: new Date(),
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Data = await BindPaymentModePanelWise({ PanelID: 1 });
        setApiData({
          paymentModeData: Data.data,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleOPDAdvanceOutStandingReport = async () => {
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.fromDate == "") {
      notify("Please Select From Date.", "error");
    } else if (values?.toDate == "") {
      notify("Please Select To Date.", "error");
    } else if (values?.paymentType == "") {
      notify("Please Select Payment Type.", "error");
    } else if (values?.type == "") {
      notify("Please Select Type.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await OPDAdvanceOutStandingReport({
          FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
          ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
          CentreID: values?.centre?.map((ele, _) => ele?.code).join(","),
          PaymentModeType: values?.paymentType,
          AdvanceOutStan: values?.type,
          MrNo: String(values?.UHID),
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
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
          />
          <ReactSelect
            placeholderName={t("Payment Type")}
            id={"paymentType"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "ALL" },
              ...apiData?.paymentModeData?.map((item) => {
                return {
                  label: item.PaymentMode,
                  value: item.PaymentModeID,
                };
              }),
            ]}
            name="paymentType"
            value={values.paymentType}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="AppointmentNo"
            lable={t("UHID")}
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="UHID"
            value={values.UHID}
            onChange={handleChange}
          />
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "ALL" },
              { label: "Advance", value: "1" },
              { label: "Balance", value: "2" },
            ]}
            name="type"
            value={values.type}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <ReportPrintType
            placeholderName={t("Print Type")}
            id="printType"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            name={"printType"}
            setValues={setValues}
          />

          <div className="box-inner text-center">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleOPDAdvanceOutStandingReport}
            >
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
