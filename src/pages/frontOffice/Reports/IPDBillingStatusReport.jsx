import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindAllDoctorConfirmation,
  getBindPanelList,
} from "../../../store/reducers/common/CommonExportFunction";
import { print_Type } from "../../../utils/constant";
import {
  BillFreezedButNotDischarged,
  BillGenerated,
  DischargedButBillNotGenerated,
  DischargeIntimation,
  IPDBillRegisterSummary,
  PatientAdmittedList,
  PatientDischarged,
} from "../../../networkServices/BillingsApi";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import { RedirectURL } from "../../../networkServices/PDFURL";
import { handleMultiSelectOptions, notify } from "../../../utils/utils";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { getBindDetailUser } from "../../../networkServices/ReportsAPI";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

export default function IPDBillingStatusReport() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const {
    GetEmployeeWiseCenter,
    getBindPanelListData,
    GetBindAllDoctorConfirmationData,
  } = useSelector((state) => state.CommonSlice);

  const initialValues = {
    fromDate: new Date(),
    toDate: new Date(),
    patientType: "",
    reportSubType: "",
    panel: [],
    doctor: [],
    subCategory: [],
    category: [],
    item: [],
    department: [],
    RoomType: [],
    reportType: "1",
    centre: [],
    printType: "1",
    dateFilterType: "",
  };

  const [values, setValues] = useState({ ...initialValues });

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };

  const getPatientAdmittedList = async () => {
    const ReportType = Number(values?.reportType);
    const EntityID = 1;
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await PatientAdmittedList(
        ReportType,
        EntityID,
        CentreID
      );
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDischargeIntimation = async () => {
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await DischargeIntimation(CentreID);
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getBillFreezedButNotDischarged = async () => {
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await BillFreezedButNotDischarged(CentreID);
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getPatientDischarged = async () => {
    const fromDate = moment(values?.fromDate).format("DD-MMM-YYYY");
    const ToDate = moment(values?.toDate).format("DD-MMM-YYYY");
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await PatientDischarged(fromDate, ToDate, CentreID);
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDischargedButBillNotGenerated = async () => {
    const fromDate = moment(values?.fromDate).format("DD-MMM-YYYY");
    const ToDate = moment(values?.toDate).format("DD-MMM-YYYY");
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await DischargedButBillNotGenerated(
        fromDate,
        ToDate,
        CentreID
      );
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getBillGenerated = async () => {
    const fromDate = moment(values?.fromDate).format("DD-MMM-YYYY");
    const ToDate = moment(values?.toDate).format("DD-MMM-YYYY");
    const ReportCheck = Number(values?.reportType);
    const CentreID = handlePayloadMultiSelect(values?.centre);
    try {
      const response = await BillGenerated(
        fromDate,
        ToDate,
        ReportCheck,
        CentreID
      );
      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getIPDBillRegisterSummary = async () => {
    // console.log(values?.panel);
    const requestbody = {
      fromDate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      ToDate: moment(values?.toDate).format("DD-MMM-YYYY"),
      Panel: handlePayloadMultiSelect(values?.panel) || 0,
      doctor: handlePayloadMultiSelect(values?.doctor) || 0,
      CentreID: handlePayloadMultiSelect(values?.centre),
      ReportType: Number(values?.reportType),
    };

    try {
      const response = await IPDBillRegisterSummary(requestbody);

      if (response?.data?.pdfUrl) {
        RedirectURL(response?.data?.pdfUrl);
        notify(response?.message, "success");
      } else {
        notify(response?.message, error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (values?.centre == "") {
        notify("Centre is Required", "error");
      } else {
        if (values?.reportType === "1") {
          getPatientAdmittedList();
        } else if (values?.reportType === "2") {
          getDischargeIntimation();
        } else if (values?.reportType === "3") {
          getBillFreezedButNotDischarged();
        } else if (values?.reportType === "4") {
          getPatientDischarged();
        } else if (values?.reportType === "5") {
          getDischargedButBillNotGenerated();
        } else if (values?.reportType === "6") {
          getBillGenerated();
        } else if (values?.reportType === "7") {
          getIPDBillRegisterSummary();
        }
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  const handleReactSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value?.value || "" }));
  };

  useEffect(() => {
    dispatch(
      getBindPanelList({
        PanelGroup: "ALL",
      })
    );
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, []);

  useEffect(() => {
    if (GetEmployeeWiseCenter.length > 0) fetchData();
  }, [GetEmployeeWiseCenter?.length]);

  const fetchData = async () => {
    console.log(GetEmployeeWiseCenter);
    try {
      setValues({
        ...values,
        ["centre"]: handleMultiSelectOptions(
          GetEmployeeWiseCenter,
          "CentreName",
          "CentreID"
        ),
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row  p-2" onSubmit={handleSubmit}>
          {/* <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          /> */}
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />

          {/* <ReactSelect
            placeholderName={t("Date Filter Type")}
            id={"dateFilterType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: " Bill Date", value: "1" },
              { label: "Entry Date", value: "2" },
            ]}
            name="dateFilterType"
            handleChange={handleReactSelectChange}
            value={values.dateFilterType}
          /> */}

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
            max={values?.toDate}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
            max={new Date()}
            min={values?.fromDate}
          />

          <ReactSelect
            placeholderName={t("Report Type")}
            id={"reportType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Patient Admitted List", value: "1" },
              { label: "Discharge Intimation", value: "2" },
              { label: "Bill Freezed But Not Discharged", value: "3" },
              { label: "Patient Discharged", value: "4" },
              { label: "Discharged But Bill Not Generated", value: "5" },
              { label: "Bill Generated", value: "6" },
              { label: "IPD Bill Register Summary", value: "7" },
            ]}
            name="reportType"
            handleChange={handleReactSelect}
            value={values?.reportType}
          />
          {values?.reportType === "7" && (
            <>
              <ReportsMultiSelect
                name="doctor"
                placeholderName="Doctors"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                values={values}
                setValues={setValues}
                dynamicOptions={GetBindAllDoctorConfirmationData}
                labelKey="Name"
                valueKey="DoctorID"
              />
              <ReportsMultiSelect
                name="panel"
                placeholderName="Panel"
                respclass="col-xl-2 col-md-4 col-sm-6 col-12"
                values={values}
                setValues={setValues}
                dynamicOptions={getBindPanelListData}
                labelKey="Company_Name"
                valueKey="PanelID"
              />
            </>
          )}
          {/* <ReactSelect
            placeholderName={t("Report Type")}
            id="reportType"
            searchable
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            value={values.reportType}
            name="reportType"
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelectChange(name, e)}
          /> */}
          {/* <ReactSelect
            placeholderName={t("Sub Type")}
            id={"reportSubType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={[
              { label: "Doctor Wise", value: "1" },
              { label: "Category Wise", value: "2" },
              { label: "Sub Category Wise", value: "3" },
              { label: "Item Wise", value: "4" },
              { label: "Group Wise", value: "5" },
              { label: "Department Wise", value: "6" },
              { label: "Room Wise", value: "7" },
              { label: "Panel Wise", value: "8" },
            ]}
            name="reportSubType"
            handleChange={handleReactSelectChange}
            value={values.reportSubType}
          />

         
          <ReportsMultiSelect
            name="category"
            placeholderName="Category"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindCategoryData}
            labelKey="name"
            valueKey="categoryID"
          />
          {console.log(multiselectState?.getRoomTypeMulti)}
          <ReportsMultiSelect
            name="subCategory"
            placeholderName="Sub Category"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetBindSubCatgeoryData || []}
            labelKey="name"
            valueKey="subCategoryID"
          />

          <ReportsMultiSelect
            name="item"
            placeholderName="Item"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getLoadOPDDiagnosisItemsData}
            labelKey="typeName"
            valueKey="item_ID"
          />
          <ReportsMultiSelect
            name="department"
            placeholderName="Department"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetDepartmentList}
            labelKey="Name"
            valueKey="ID"
          />

          <ReportsMultiSelect
            name="RoomType"
            placeholderName="Room Type"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={multiselectState?.getRoomTypeMulti}
            labelKey="Name"
            valueKey="IPDCaseTypeID"
          />

          */}
          {/* <ReactSelect
            placeholderName={t("Print Type")}
            id={"printType"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={print_Type?.map((item, index) => {
              return {
                value: item.ID,
                label: item.name,
              };
            })}
            name="printType"
            handleChange={handleReactSelect}
            value={values?.printType}
          /> */}
          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="submit"
              onClick={handleSubmit}
            >
              {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
