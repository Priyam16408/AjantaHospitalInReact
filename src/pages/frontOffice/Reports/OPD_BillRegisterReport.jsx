import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { notify } from "../../../utils/utils";
import { useSelector } from "react-redux";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import { OPDBillRegisterReports } from "../../../networkServices/ReportsAPI";
import { OPD_BILLREGISTER_GROUPBY } from "../../../utils/constant";
import {
  RedirectURL,
  RedirectURLReport,
} from "../../../networkServices/PDFURL";
export default function OPD_BillRegisterReport() {
  const { GetEmployeeWiseCenter, getBindPanelListData } = useSelector(
    (state) => state.CommonSlice
  );
  const [t] = useTranslation();

  const initialValues = {
    centre: [],
    panel: [],
    type: "-1",
    UHID: "",
    fromDate: new Date(),
    toDate: new Date(),
    billNo: "",
    printType: "0",
    groupBy: "B",
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelectChange = (name, e) => {
    setValues({ ...values, [name]: e?.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    setValues({
      ...values,
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
    });
  }, [GetEmployeeWiseCenter?.length]);

  const handleBillRegisterReport = async () => {
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.fromDate == "") {
      notify("Please Select From Date.", "error");
    } else if (values?.toDate == "") {
      notify("Please Select To Date.", "error");
    } else if (values?.groupBy == "") {
      notify("Please Select Group By.", "error");
    } else if (values?.type == "") {
      notify("Please Select Type.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await OPDBillRegisterReports({
          FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
          ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
          CentreId: values?.centre?.map((ele, _) => ele?.code).join(","),
          PanelId: values?.panel?.map((ele, _) => ele?.code).join(","),
          UHID: String(values?.UHID),
          BillNo: String(values?.billNo),
          groupwise: values?.groupBy,
          Type: values?.type,
        });
        if (response?.success) {
          
          RedirectURL(response?.data?.pdfUrl);
        } else {
          notify(response?.data?.message, "error");
        }
      } catch(error) {
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
        <form className="row p-2 ">
          <ReportsMultiSelect
            name="centre"
            placeholderName={t("Centre")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName="required-fields"
          />
          <ReportsMultiSelect
            name="panel"
            placeholderName={t("Panel")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindPanelListData}
            labelKey="Company_Name"
            valueKey="PanelID"
          />

          <ReactSelect
            placeholderName={t("Group By")}
            id={"GroupBy"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={OPD_BILLREGISTER_GROUPBY}
            name="groupBy"
            value={values.groupBy}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />

          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "-1" },
              { label: "Only Outstanding", value: "3" },
            ]}
            name="type"
            value={values.type}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="AppointmentNo"
            lable={t("UHID")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="UHID"
            value={values.UHID}
            onChange={handleChange}
          />
          <Input
            type="text"
            className="form-control"
            id="BillNo"
            lable={t("Bill No.")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            name="billNo"
            value={values.billNo}
            onChange={handleChange}
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

          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleBillRegisterReport}
            >
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
