import React, { useEffect, useState, useRef } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../../../components/UI/customTable";
import {
  GetBindBabyGrowthChart,
  GetBindBabyGrowthNew,
  GetGrowthChartPrintPdfApi,
  GetGrowthProfileApi,
  GetWhoGrowthStandardApi,
  handleSaveBabyGrowthChart,
  handleUpdateBabyGrowthNew,
  InsertBabyGrowthNewSave,
} from "../../../networkServices/DoctorApi";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";
import Modal from "../../../components/modalComponent/Modal";
import BabyGrouthConfirmationModel from "./BabyGrouthConfirmationModel";
import ChildGrowthCharts from "./BabyGrowthChart/ChildGrowthCharts";
import { ChevronDown, Plus, Printer, Save } from "lucide-react";
import BabyGrowthForm from "./BabyGrowthForm";
import { exportToExcel } from "../../../utils/exportLibrary";
import { RedirectURL } from "../../../networkServices/PDFURL";

const BabyGrowthChart = ({ patientDetail }) => {
  const [t] = useTranslation();
  debugger;
  const {
    PatientID,
    TransactionID,
    Gender,
    Sex,
    Age,
    AgeInYears,
    AppointmentDate,
    DOB,
  } = patientDetail;

  const { employeeID } = useLocalStorage("userData", "get");
  const [isDOBModalOpen, setIsDOBModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [growthChart, setGrowChart] = useState([]);
  const [growthProfile, setGrowthProfile] = useState(null);
  const [whoStandards, setWhoStandards] = useState([]);
  // Patient_Growth_Profile's DOB (this module's own record) always takes
  // precedence over patient_master's DOB wherever DOB is shown/used here.
  const effectiveDOB = growthProfile?.DOB || growthProfile?.dob || DOB || "";
  const [values, setValues] = useState({
    date: new Date(),
    time: new Date(),
    height: "",
    weight: "",
    BMI: "",
    OFC: "",
    age: "",
    weightUnit: { value: "Kg", label: "Kg" },
    updateRecord: false,
    item: "",
    ShowTableView: 0,
    ShowTimeLine: 0,
  });

  // console.log("patientDetailpatientDetail", values);
  const babyTableHedings = [
    { width: "1%", name: t("S.No.") },
    { width: "5%", name: t("Date") },
    { width: "5%", name: t("Weight (Kg)") },
    { width: "5%", name: t("Weight (gm)") },
    { width: "5%", name: t("Age (Month)") },
    { width: "5%", name: t("Height (cm)") },
    { width: "5%", name: t("Status") },
    { width: "5%", name: t("Entry By") },
    { width: "1%", name: t("Edit") },
  ];
  function convertToDate(dateString) {
    const [day, month, year] = dateString.split("-");
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const date = new Date(year, months[month], day);
    return date;
  }
  // function convertTimeToDate(timeString) {
  //   if (!timeString) return new Date("1970-01-01T00:00:00");
  //   const [time, modifier] = timeString.split(" ");
  //   let [hours, minutes] = time.split(":").map(Number);

  //   if (modifier === "PM" && hours < 12) hours += 12;
  //   if (modifier === "AM" && hours === 12) hours = 0;

  //   const timeInDate = new Date();
  //   timeInDate.setHours(hours, minutes, 0, 0);
  //   return timeInDate;
  // }

  const handleCheckboxChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const getBabyChart = async () => {
    try {
      const response = await GetBindBabyGrowthChart(PatientID);
      // const response = await GetBindBabyGrowthNew(PatientID);
      if (response?.success) {
        setGrowChart(response.data);
      }
    } catch (error) {
      notify(response?.message, "error");
      setGrowChart([]);
    }
  };
  // Baby Growth Chart's own patient detail (DOB override, gestation, mid-parental
  // height) lives in Patient_Growth_Profile — separate from patient_master.
  const getGrowthProfile = async () => {
    try {
      const response = await GetGrowthProfileApi(PatientID);
      const profile = response?.data ?? response?.Data;
      if (profile) {
        setGrowthProfile(profile);
      }
    } catch (error) {
      setGrowthProfile(null);
    }
  };
  // Real WHO P3/P15/P50/P85/P97 reference curve (same source the print PDF
  // uses) so the on-screen chart plots real bands instead of placeholder data.
  const getWhoGrowthStandard = async () => {
    try {
      console.log("GetWhoGrowthStandard: requesting with Gender =", JSON.stringify(Gender));
      const response = await GetWhoGrowthStandardApi(Gender);
      const standards = response?.data ?? response?.Data;
      if (!Array.isArray(standards) || standards.length === 0) {
        // makeApiRequest swallows HTTP errors and returns error.response instead
        // of throwing, so a failed call lands here (not in catch) with the raw
        // axios error response — logging it makes the real cause visible
        // (404 = API not rebuilt yet, 200+empty array = table has no rows for
        // this gender, 401/403 = auth issue) instead of silently blank charts.
        console.warn(
          "GetWhoGrowthStandard: no data received. status=",
          response?.status,
          "success=",
          response?.success ?? response?.Success,
          "message=",
          response?.message ?? response?.Message,
          "raw response=",
          response
        );
      } else {
        console.log("GetWhoGrowthStandard: received", standards.length, "rows");
      }
      setWhoStandards(Array.isArray(standards) ? standards : []);
    } catch (error) {
      console.error("GetWhoGrowthStandard failed", error);
      setWhoStandards([]);
    }
  };
  const handleSaveUpdate = async () => {
    if (values?.height < 30 || values?.height > 220) {
      notify("The field Height (cm) must be between 30 and 220.","error");
      return;
    }
    if (values?.OFC < 20 || values?.OFC > 80) {
      notify("The field OFC must be between 20 and 80.","error");
      return;
    }
    if (values?.weight < 0.5 || values?.weight > 150) {
      notify("The field weight must be between 0.5 and 150.","error");
      return;
    }
    const requestBody = {
      // patientId: PatientID ?? "",
      // transactionID: Number(TransactionID) ?? 0,
      // ageInYears: String(AgeInYears) || "",
      // height: Number(values?.height) || 0,
      // weight: Number(values?.weight) || 0,
      // bmi: Number(values?.BMI) ?? 0,
      ofc: Number(values?.OFC) ?? 0,
      // id: values?.id ? values?.id : 0,

      patientId: PatientID ?? "",
      transactionId: Number(TransactionID) ?? 0,
      visitDate: values?.date,
      dateOfBirth: effectiveDOB,
      // gender: Gender === "M" ? "Male" : Gender === "F" ? "Female" : "Other",
      gender: Gender === "Male" ? "M" : Gender === "Female" ? "F" : Gender,
      weight: Number(values?.weight) || 0,
      height: Number(values?.height) || 0,
      id: values?.id ? values?.id : "",
      midParentalHeight: 0,
      gestationPeriod: 0,
    };
    // if (isUpdate) {
    //   requestBody.id = values?.id;
    // }
    try {
      const response = await handleSaveBabyGrowthChart(requestBody);
      if (response?.data?.success || response?.success) {
        notify(response?.data?.message || response?.message, "success");
        setIsUpdate(false);
        setIsFormModalOpen(false);
        getBabyChart();
        // setValues({
        //   date: new Date(),
        //   time: new Date(),
        //   height: "",
        //   weight: "",
        //   BMI: "",
        //   OFC: "",
        //   id:0
        // });
      } else {
        notify(response?.data?.message, "warn");
      }
    } catch (error) {
      notify(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Something Wents Wrong",
      );
    }
  };

  useEffect(() => {
    getBabyChart();
    getGrowthProfile();
    getWhoGrowthStandard();
    setIsDOBModalOpen(true);
  }, []);
  const printRef = useRef(null);
  // const handlePrint = () => {
  //   window.print();
  // };

  const handlePrint = async () => {
    try {
      const response = await GetGrowthChartPrintPdfApi({
        PatientID: PatientID,
      });
      if (response?.success) {
        RedirectURL(response?.data);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      notify(error?.response?.data?.message || "Print error", "error");
    }
  };
  const ExceldataFormatter = (tableData) => {
    const HardCopy = JSON.parse(JSON.stringify(tableData));
    const modifiedResponseData = HardCopy?.map((ele, index) => ({
      "S.No.": index + 1,
      "Visit Date": ele?.VisitDate || "",
      "Age (Months)": ele?.AgeInMonths ?? "",
      "Weight (Kg)": ele?.Weight ?? "",
      "Height (cm)": ele?.Height ?? "",
      "OFC (cm)": ele?.OFC ?? "",
      "BMI (kg/m²)": ele?.BMI ?? "",
      "Growth Status": ele?.GrowthStatus || "",
    }));

    return modifiedResponseData;
  };
  const handlePrintExcel = (data) => {
    if (!data || data.length === 0) {
      notify("No growth records available to export", "warn");
      return;
    }
    const metaRows = [
      `Patient Name: ${patientDetail?.Pname || "-"}    UHID: ${PatientID || "-"}`,
      `Gender: ${Gender || "-"}    DOB: ${effectiveDOB ? new Date(effectiveDOB).toLocaleDateString("en-GB") : "-"
      }    Age: ${Age || AgeInYears || "-"}`,
      `Report Generated On: ${new Date().toLocaleString("en-GB")}`,
    ];
    exportToExcel(
      ExceldataFormatter(data),
      "Infant Growth Chart Report",
      "",
      false,
      "Baby_Growth_Chart_Report",
      metaRows,
    );
  };
  const parseDateTime = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === "string") {
      const [datePart, timePart, meridian] = value.split(" ");
      const [day, month, year] = datePart.split("-");

      let hours = 0,
        minutes = 0;
      if (timePart) {
        [hours, minutes] = timePart.split(":").map(Number);
        if (meridian === "PM" && hours < 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;
      }

      return new Date(year, month - 1, day, hours, minutes);
    }

    return new Date(value);
  };

  const handleEditFromChart = (item) => {
    debugger;
    const dateObj = parseDateTime(item?.updatedAt);

    setIsUpdate(true);
    setIsFormModalOpen(true);

    setValues({
      date: parseDateTime(item?.updatedAt),
      time: dateObj,
      weight: item?.weight || "",
      height: item?.height || "",
      BMI: item?.bmi || "",
      OFC: item?.ofc || "",
      age: item?.ageLabel || "",
      id: item?.Id || "",
      item: item,
      ShowTableView: 0,
      ShowTimeLine: 0,
    });
  };

  return (
    <>
      <div className="card patient_registration border p-2">
        <>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white mr-2"
                style={{ width: "40px", height: "40px" }}
              >
                PN
              </div>
              <div>
                <h6 className="mb-0">
                  {patientDetail?.Pname} <ChevronDown size={14} />
                </h6>
                <small className="text-muted">{patientDetail?.Age}</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span
                className="badge rounded-pill p-2 px-3 mr-2"
                style={{ backgroundColor: "#f3e5f5", color: "#7b1fa2" }}
              >
                WHO-IAP Chart
              </span>
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={handlePrint}
              >
                <Printer size={16} /> Print Graph <ChevronDown size={14} />
              </button>
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={() => handlePrintExcel(growthChart)}
              >
                <Printer size={16} /> Print Excel <ChevronDown size={14} />
              </button>
              {/* <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-2 ml-2"
                onClick={handleSaveUpdate}
              >
                <Save size={16} /> {isUpdate ? "Update" : "Save"}
              </button> */}
            </div>
          </div>

          <div className="d-flex justify-content-between mb-2 bg-white rounded shadow-sm">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsFormModalOpen(true);
                setValues({
                  ...values,
                  date: new Date(),
                  time: new Date(),
                  weight: "",
                  height: "",
                  BMI: "",
                  OFC: "",
                  age: "",
                  id: "",
                  // item: item,
                  // ShowTableView: 0,
                  // ShowTimeLine: 0,
                });
                setIsUpdate(false);
              }}
            >
              <Plus size={18} /> Add Measurements
            </button>
            <div className="d-flex gap-4 align-items-center px-3">
              <small
                className="text-muted card p-1"
                style={{ cursor: "pointer" }}
                onClick={() => setIsDOBModalOpen(true)}
              >
                + Add mid parental height
              </small>
              <small
                className="text-muted ml-3 card p-1"
                style={{ cursor: "pointer" }}
                onClick={() => setIsDOBModalOpen(true)}
              >
                + Add gestation period
              </small>
              <div className="form-check form-switch d-flex align-items-center gap-2 ml-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="ShowTableView"
                  value={values?.ShowTableView}
                  onChange={handleCheckboxChange}
                />
                <label className="small text-muted mb-0 mx-2">
                  Show Table View
                </label>
              </div>
              {/* <div className="form-check form-switch d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="ShowTimeLine"
                  value={values?.ShowTimeLine}
                  onChange={handleCheckboxChange}
                />
                <label className="small text-muted mb-0 mx-2">
                  Show Timeline in years
                </label>
              </div> */}
            </div>
          </div>
        </>

        <Heading title={t("Result")} isBreadcrumb={false} />
        {values?.ShowTableView === 0 ? (
          <div className="col-12">
            <ChildGrowthCharts
              refprint={printRef}
              apiResponse={growthChart}
              patientDetail={patientDetail}
              whoStandards={whoStandards}
              onEdit={handleEditFromChart}
            />
          </div>
        ) : (
          <>
            <div className="col-16">
              <Tables
                thead={babyTableHedings}
                tbody={growthChart?.map((item, index) => ({
                  sNo: index + 1,
                  date: item?.VisitDate || "",
                  // time: item?.Time || "",
                  weightKg: item?.Weight || "",
                  weightGram: Math.floor(item?.Weight * 1000) || "",
                  age: item?.AgeInMonths || "",
                  length: item?.Height || "",
                  status: item?.GrowthStatus || "",
                  entryBy: item?.CreatedByName || "",
                  edit: (
                    <span
                      onClick={() => {
                        const dateObj = parseDateTime(item?.VisitDate);
                        setIsUpdate(true);
                        setIsFormModalOpen(true);
                        setValues({
                          date: dateObj,
                          time: dateObj,
                          weight: item?.Weight || "",
                          height: item?.Height || "",
                          BMI: item?.BMI || "",
                          OFC: item?.OFC || "",
                          age: item?.AgeInYears || "",
                          item: item,
                          id: item?.Id,
                        });
                      }}
                    >
                      <i className="fa fa-edit" />
                    </span>
                  ),
                }))}
              />
            </div>
          </>
        )}
      </div>

      {isDOBModalOpen && (
        <Modal
          visible={isDOBModalOpen}
          setVisible={() => setIsDOBModalOpen(false)}
          modalWidth="30vw"
          Header={t("Update Details")}
          footer={<></>}
        >
          <BabyGrouthConfirmationModel
            setIsDOBModalOpen={setIsDOBModalOpen}
            patientDetail={patientDetail}
            growthProfile={growthProfile}
            onSaved={getGrowthProfile}
          />
        </Modal>
      )}
      {isFormModalOpen && (
        <Modal
          visible={isFormModalOpen}
          setVisible={() => setIsFormModalOpen(false)}
          modalWidth="70vw"
          Header={t("Baby Growth Form")}
          footer={<></>}
        >
          <BabyGrowthForm
            patientDetail={patientDetail}
            effectiveDOB={effectiveDOB}
            setIsFormModalOpen={setIsFormModalOpen}
            values={values}
            setValues={setValues}
            handleSaveUpdate={handleSaveUpdate}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
          />
        </Modal>
      )}
    </>
  );
};

export default BabyGrowthChart;
