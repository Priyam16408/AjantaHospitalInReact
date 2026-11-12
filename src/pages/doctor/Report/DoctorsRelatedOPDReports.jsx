import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import {
  DOCTOR_APP_STATUS,
  DOCTOR_REPORT_AMOUNT_TYPE,
  DOCTOR_REPORT_APP_TYPE,
  DOCTOR_REPORT_OPTION,
  DOCTOR_REPORT_PATIENT_TYPE,
  DOCTOR_REPORT_TYPE,
  DOCTOR_REPORT_TYPE_FORMATE,
  DOCTOR_VISIT_TYPE_OPTION,
} from "../../../utils/constant";
import { useSelector } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import {
  GetBindAllDoctorConfirmation,
  GetBindDepartment,
  GetBindReferDoctor,
} from "../../../store/reducers/common/CommonExportFunction";
import { useDispatch } from "react-redux";
import {
  handleReactSelectDropDownOptions,
  IsDisabledDoctorReportField,
  notify,
} from "../../../utils/utils";
import { GetBindDoctorGroup } from "../../../networkServices/examinationApi";
import moment from "moment";
import { GeneratePDFURL, OpenPDFURL } from "../../../networkServices/PDFURL";
import {
  BindProMaster,
  DoctorRealtedOpdReportsReport,
} from "../../../networkServices/DoctorApi";

export default function DoctorsRelatedOPDReports() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const initialValues = {
    VisitType: { value: "All" },
    Doctor: { value: "0" },
    AppStatus: { value: "All" },
    Type: { value: "0" },
    AppType: { value: "0" },
    ReportTypeFormat: { value: "1" },
    AmountType: { value: "1" },
    PatientType: { value: "3" },
    // Type: { value: "0" },
    Department: { value: "0" },
    DoctorGroup: { value: "0" },
    ReferalDoctor: { value: "0" },
    ReferalPro: { value: "0" },
    IPDNo: "0",
    IsPackage: false,
    fromDate: moment().format("DD-MMM-YYYY"),
    toDate: moment().format("DD-MMM-YYYY"),
    Centre: [],
  };

  const [values, setValues] = useState(initialValues);
  const [list, setList] = useState({ DoctorGroup: [], BindPRO: [] });
  const localData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();
  const {
    GetEmployeeWiseCenter,
    GetBindAllDoctorConfirmationData,
    GetDepartmentList,
    GetBindReferDoctorList,
  } = useSelector((state) => state?.CommonSlice);

  const getReportDetailList = async () => {
    try {
      Promise.all([GetBindDoctorGroup(), BindProMaster()]).then(
        ([DoctorGroup, BindPRO]) => {
          setList((val) => ({
            ...val,
            DoctorGroup: DoctorGroup?.data,
            // BindPRO: BindPRO?.data
          }));
        }
      );
    } catch (error) {}
  };
  useEffect(() => {
    getReportDetailList();
  }, []);

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
        CentreID: localData?.centreID,
      })
    );
    dispatch(GetBindDepartment());
    dispatch(GetBindReferDoctor());
  }, [dispatch]);

  const handleReactSelect = async (name, value) => {
    if (name === "ReportType") {
      setValues(() => ({ ...initialValues, [name]: value }));
    } else {
      setValues((val) => ({ ...val, [name]: value }));
    }
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleChange = (e) => {
    setValues((val) => ({ ...val, [e.target.name]: e.target.value }));
  };
  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues({ ...values, [name]: selectedOptions });
  };

  const reportApi = async () => {

    try {
      const payload = {
        ReportType: values?.ReportType?.value,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        // Center: 1,
        Center: values?.Centre?.map((ele, _) => String(ele?.code)),
        Doctor: values?.Doctor?.value,
        DoctorGroup: values?.DoctorGroup?.value,
        PatientType: values?.PatientType?.value,
        AppStatus: values?.AppStatus?.value,
        ReferDoctor: values?.ReferalDoctor?.value,
        ProName: values?.ReferalPro?.value,
        PID: 0,
        IPDNo: values?.IPDNo,
        RdoAppType: values?.AppType?.value,
        RdoVisitType: values?.VisitType?.value,
        RdoAmtType: values?.AmountType?.value,
        RdoPatientType: values?.PatientType?.value,
        RdoReportType: values?.ReportTypeFormat?.value,
        IsPackage: values?.IsPackage,
        DoctorDepartment: values?.Department?.value,
      };
      const response = await DoctorRealtedOpdReportsReport(payload);
      if (response.success) {
        const url = response.data?.pdfUrl;
        console.log(url, "url");
        GeneratePDFURL(url);
      } else {
        notify("No Record Found", "error");
      }
    }
     catch (error) {
      notify("Something went wrong", "error");
      console.log(error, "eroor");
    }
  };

//   const handleOpenReport = () => {
//     if (!values?.ReportType?.value) {
//       notify("Report Type field is required", "error");
//       return false;
//     } else if (!(values?.Centre?.length > 0)) {
//       notify("Centre field is required", "error");
//       return false;
//     }

//     let reportParams = `ReportType=${values?.ReportType?.value}&FromDate=${moment(values?.fromDate).format("DD-MMM-YYYY")}&ToDate=${moment(values?.toDate).format("DD-MMM-YYYY")}&Center=${values?.Centre?.map((ele, _) => ele?.code).join(",")}&Doctor=${values?.Doctor?.value}&DoctorGroup=${values?.DoctorGroup?.value}&PatientType=${values?.VisitType?.value}&AppStatus=${values?.AppStatus?.value}&ReferDoctor=${values?.ReferalDoctor?.value}&ProName=${values?.ReferalPro?.value}&PID=0&IPDNo=${values?.IPDNo}&RdoAppType=${values?.AppType?.value}&RdoVisitType=${values?.VisitType?.value}&RdoAmtType=${values?.AmountType?.value}&RdoPatientType=${values?.PatientType?.value}&RdoReportType=${values?.ReportTypeFormat?.value}&IsPackage=${values?.IsPackage}&DoctorDepartment=${values?.Department?.value}`;

//     OpenPDFURL("DoctorRealtedOpdReportsRefundReport", reportParams);
//   };

  return (
    <div className="card patient_registration border">
      <Heading title={"Search Criteria"} isBreadcrumb={true} />
      <div className="p-2">
        <div className="row">
          <ReactSelect
            placeholderName={t("ReportType")}
            id="ReportType"
            inputId="ReportType"
            name="ReportType"
            value={values?.ReportType?.value}
            handleChange={handleReactSelect}
            dynamicOptions={DOCTOR_REPORT_OPTION}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            requiredClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            // value={values.fromDate ? moment(values?.fromDate, "YYYY-MM-DD").toDate() : null}
            value={
              values.fromDate
                ? moment(values?.fromDate, "DD-MMM-YYYY").toDate()
                : values?.fromDate
            }
            handleChange={handleChange}
            lable={t("FromDate")}
            placeholder={VITE_DATE_FORMAT}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            // value={values?.toDate ? moment(values?.toDate, "YYYY-MM-DD").toDate() : null}
            value={
              values?.toDate
                ? moment(values?.toDate, "DD-MMM-YYYY").toDate()
                : values?.toDate
            }
            handleChange={handleChange}
            lable={t("ToDate")}
            placeholder={VITE_DATE_FORMAT}
          />

          <MultiSelectComp
            placeholderName={t("Centre")}
            id={"Centre"}
            name="Centre"
            value={values?.Centre}
            requiredClassName={"required-fields"}
            handleChange={handleMultiSelectChange}
            dynamicOptions={GetEmployeeWiseCenter?.map((item) => ({
              name: item?.CentreName,
              code: item?.CentreID,
            }))}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <ReactSelect
            placeholderName={t("Doctor")}
            id="Doctor"
            inputId="Doctor"
            name="Doctor"
            value={values?.Doctor?.value}
            handleChange={handleReactSelect}
            dynamicOptions={[
              { label: "All", value: "0" },
              ...handleReactSelectDropDownOptions(
                GetBindAllDoctorConfirmationData,
                "Name",
                "DoctorID"
              ),
            ]}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "Doctor"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("DoctorGroup")}
            id="DoctorGroup"
            inputId="DoctorGroup"
            name="DoctorGroup"
            value={values?.DoctorGroup?.value}
            handleChange={handleReactSelect}
            dynamicOptions={handleReactSelectDropDownOptions(
              list?.DoctorGroup,
              "DocType",
              "ID"
            )}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "DoctorGroup"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("VisitType")}
            id="VisitType"
            inputId="VisitType"
            name="VisitType"
            value={values?.VisitType?.value}
            dynamicOptions={DOCTOR_VISIT_TYPE_OPTION}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "VisitType"
            )}
            handleChange={handleReactSelect}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("AppStatus")}
            id="AppStatus"
            inputId="AppStatus"
            name="AppStatus"
            value={values?.AppStatus?.value}
            handleChange={handleReactSelect}
            dynamicOptions={DOCTOR_APP_STATUS}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "AppStatus"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Department")}
            id="Department"
            inputId="Department"
            name="Department"
            value={values?.Department?.value}
            handleChange={handleReactSelect}
            dynamicOptions={handleReactSelectDropDownOptions(
              GetDepartmentList,
              "Name",
              "ID"
            )}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "Department"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("AppType")}
            id="AppType"
            inputId="AppType"
            name="AppType"
            value={values?.AppType?.value}
            handleChange={handleReactSelect}
            dynamicOptions={DOCTOR_REPORT_APP_TYPE}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "AppType"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {values?.AppType?.value === "1" && (
            <ReactSelect
              placeholderName={t("Type")}
              id="Type"
              inputId="Type"
              name="Type"
              value={values?.Type?.value}
              handleChange={handleReactSelect}
              dynamicOptions={DOCTOR_REPORT_TYPE}
              searchable={true}
              isDisabled={IsDisabledDoctorReportField(
                values?.ReportType?.value,
                "Type"
              )}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}
          <ReactSelect
            placeholderName={t("ReferalDoctor")}
            id="ReferalDoctor"
            inputId="ReferalDoctor"
            name="ReferalDoctor"
            value={values?.ReferalDoctor?.value}
            handleChange={handleReactSelect}
            dynamicOptions={handleReactSelectDropDownOptions(
              GetBindReferDoctorList,
              "NAME",
              "DoctorID"
            )}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "ReferalDoctor"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("ReferalPro")}
            id="ReferalPro"
            inputId="ReferalPro"
            name="ReferalPro"
            value={values?.ReferalPro?.value}
            handleChange={handleReactSelect}
            dynamicOptions={handleReactSelectDropDownOptions(
              list?.BindPRO,
              "ProName",
              "Pro_ID"
            )}
            searchable={true}
            isDisabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "ReferalPro"
            )}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          {!IsDisabledDoctorReportField(
            values?.ReportType?.value,
            "AmountType"
          ) && (
            <ReactSelect
              placeholderName={t("AmountType")}
              id="AmountType"
              inputId="AmountType"
              name="AmountType"
              value={values?.AmountType?.value}
              handleChange={handleReactSelect}
              dynamicOptions={DOCTOR_REPORT_AMOUNT_TYPE}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}

          <Input
            type="text"
            className="form-control"
            lable={t("UHID")}
            placeholder=" "
            id="UHID"
            name="UHID"
            onChange={handleChange}
            value={values?.UHID}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            disabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "UHID"
            )}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("IPDNo")}
            placeholder=" "
            id="IPDNo"
            name="IPDNo"
            onChange={handleChange}
            value={values?.IPDNo}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            disabled={IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "IPDNo"
            )}
          />

          {!IsDisabledDoctorReportField(
            values?.ReportType?.value,
            "ReportTypeFormat"
          ) && (
            <ReactSelect
              placeholderName={t("ReportTypeFormat")}
              id="ReportTypeFormat"
              inputId="ReportTypeFormat"
              name="ReportTypeFormat"
              value={values?.ReportTypeFormat?.value}
              handleChange={handleReactSelect}
              dynamicOptions={DOCTOR_REPORT_TYPE_FORMATE}
              searchable={true}
              // isDisabled={IsDisabledDoctorReportField(values?.ReportType?.value, "Type")}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}

          {!IsDisabledDoctorReportField(
            values?.ReportType?.value,
            "PatientType"
          ) && (
            <ReactSelect
              placeholderName={t("PatientType")}
              id="PatientType"
              inputId="PatientType"
              name="PatientType"
              value={values?.PatientType?.value}
              handleChange={handleReactSelect}
              dynamicOptions={DOCTOR_REPORT_PATIENT_TYPE}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            />
          )}

          <div className="col-sm-2 d-flex justify-content-between">
            {!IsDisabledDoctorReportField(
              values?.ReportType?.value,
              "IncludePackage"
            ) ? (
              <>
                {" "}
                <input
                  className="ml-1"
                  type="checkbox"
                  name="IsPackage"
                  onChange={(e) => {
                    setValues((val) => ({
                      ...val,
                      [e.target.name]: e.target.checked,
                    }));
                  }}
                />{" "}
                <label className="mt-2">{t("Include Package")}</label>
              </>
            ) : (
              <></>
            )}

            <button
              className="btn btn-sm btn-success"
              type="button"
              onClick={reportApi}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
