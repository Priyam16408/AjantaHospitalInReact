import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/formComponent/Input";
import TextAreaInput from "../../../../components/formComponent/TextAreaInput";
import DatePicker from "../../../../components/formComponent/DatePicker";
import TimePicker from "../../../../components/formComponent/TimePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Tables from "../../../../components/UI/customTable";
import {
  GetPostAnesthesiaOrder,
  OTGetPostAnesthesiaMonitoring,
  OTPostAnesthesiaOrderSave,
} from "../../../../networkServices/OT/otAPI";
import { notify } from "../../../../utils/ustil2";
import moment from "moment";

export default function PostAnesthesiaOrders({ data }) {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const initialState = {
    Remark:
      "1. Oxygen to keep SPO2 Greater than 92%(Mask or Nasal Cannula)\n2. Monitor Patient for PULSE,NIBP,SPO2,TEMP,URINE OUTPUT,DRAINS,PAIN,SENSORY LEVEL,SEDIDATION SCORE for every 5 mins then every 15 mins for 1 HR",
    DischargeCriteria:
      "1. Aldrete score 8 or above.2. M. Bromage Score 4 or above.",
    ShiftDateOut: "2025-04-30T18:30:00.000Z",
    ShiftTimeOut: "2025-05-28T07:50:12.256Z",
    DATE: "2025-04-30T18:30:00.000Z",
    SedationType: {
      label: "Anxious and agitated or restless, or both",
      value: " ",
    },
    MBromageScoreType: {
      label: "Complete block (unable to move feet or knees)",
      value: " ",
    },
    Activity: {
      label: "Move 0 limbs",
      value: " ",
    },
    Respirations: {
      label: "Apneic or mechanical vent",
      value: " ",
    },
    Circulation: {
      label: "BP+/- 50% of pre-op level",
      value: " ",
    },
    Conscious: {
      label: "Not responcang",
      value: " ",
    },
    O2Saturation: {
      label: "SpO2 < 92% with supplemental O2",
      value: " ",
    },
    isEdit: 0,
    isOrderEdit: 0,
    SpO2PainScore: "",
    SpO2PainScore2: "",
    SedationScore: "",
    MBromageScore: "",
    AldreteScore: "",
    HeartRateBPMin: "",
    HeartRateBPMax: ""

  };
  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);

  const thead = [
    { name: t("S.No.") },
    { name: t("Date/Time") },
    { name: t("Heart Rate") },
    { name: t("B.P") },
    { name: t("SPO2") },
    { name: t("PAIN SCORE") },
    { name: t("Bromage Score") },
    { name: t("Sedation Score") },
    { name: t("Aldrete Score") },
    { name: t("Anesthesiologist") },
    { name: t("Shift TimeOut") },
    { name: t("Comments") },
    { name: t("Edit") },
  ];

  const SEDATION_SCORE_DROPDOWN = [
    {
      label: "Select",
      value: " ",
    },
    {
      label: "Anxious and agitated or restless, or both",
      value: "1",
    },
    {
      label: "Cooperative, oriented and tranquil",
      value: "2",
    },
    {
      label: "Patient responds to commands only",
      value: "3",
    },
    {
      label: "Brisk response to light glabellar tap/voice",
      value: "4",
    },
    {
      label: "Sluggish response to light glabellar tap",
      value: "5",
    },
    {
      label: "Patient exhibits no response",
      value: "6",
    },
  ];

  const CIRCULATION_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "BP+/- 50% of pre-op level",
      value: "0",
    },
    {
      label: "a, +/- 20 to 49% of preop",
      value: "1",
    },
    {
      label: "BP+/- 20% of pre-op level",
      value: "2",
    },
  ];

  const RESPIRATIONS_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "Apneic or mechanical vent",
      value: "0",
    },
    {
      label: "Dyspnea cc tachapnces",
      value: "1",
    },
    {
      label: "Able to cough, deep breath",
      value: "2",
    },
  ];

  const ACTIVITY_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "Move 0 limbs",
      value: "0",
    },
    {
      label: "Move 2 limbs",
      value: "1",
    },
    {
      label: "Move 4 limbs",
      value: "2",
    },
  ];
  const CONSCIOUS_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "Not responcang",
      value: "0",
    },
    {
      label: "Arousable tovoice",
      value: "1",
    },
    {
      label: "Fullyawake",
      value: "2",
    },
  ];

  const OXYGEN_SATURATION_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "SpO2 < 92% with supplemental O2",
      value: "0",
    },
    {
      label: "SpO2 ≥ 92% with oxygen",
      value: "1",
    },
    {
      label: "SpO2 92% on room air",
      value: "2",
    },
  ];

  const BROMAGE_SCORE_DROPDOWN = [
       {
      label: "Select",
      value: " ",
    },
    {
      label: "Complete block (unable to move feet or knees)",
      value: "1",
    },
    {
      label: "Almost Complete block (able to move feet or knees)",
      value: "2",
    },
    {
      label: "Partial block (Just able to move knees)",
      value: "3",
    },
    {
      label:
        "Detectable weakness of hip flexion while supine (full flexion of knees)",
      value: "4",
    },
    {
      label: "No detectable weakness of hip flexion while supine",
      value: "5",
    },
    {
      label: "Able to perform partial knee bend",
      value: "6",
    },
  ];

  const handleChange = (e) => {
    let { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };
  const handleSelect = (name, value) => [
    setValues((val) => ({ ...val, [name]: value })),
  ];

  function parseDateTime(dateStr, timeStr) {
    const trimmedTime = timeStr.trim();
    const combinedStr = `${dateStr} ${trimmedTime}`;
    return new Date(combinedStr);
  }

  const handleSave = async (saveType) => {
    const requiredFields = {
      NPOFor: "NPOFor",
      Analgesics: "Analgesics",
      Antiemetics: "Antiemetics",
      IVFluids: "IVFluids",
      ThromboprophalAxis: "Thromboprophalaxis",
      Antibiotics: "Antibiotics",
      Other: "Other",
      HeartRateBPMin: "HeartRateBPMin",
      HeartRateBPMax: "HeartRateBPMax",
      SpO2PainScore: "SpO2PainScore",
      SpO2PainScore2: "SpO2PainScore2",
    };

    for (const key in requiredFields) {
      if (values?.[key] === "") {
        notify(`Please fill ${requiredFields[key]}`, "error");
        return;
      }
    }

    const payload = {
      otBookingID: data?.OTBookingID,
      transactionID: data?.TransactionID,
      patientID: data?.PatientID,
      savetype: saveType === "SaveTop" ? 1 : 2,
      otOrders: {
        id: values?.OrderID,
        npoFor: values?.NPOFor,
        analgesics: values?.Analgesics,
        antiemetics: values?.Antiemetics,
        ivfluids: values?.IVFluids,
        thromboprophalaxis: values?.ThromboprophalAxis,
        antibiotics: values?.Antibiotics,
        other: values?.Other,
        isactive: 0,
        createdby: "",
        otBookingID: data?.OTBookingID,
        patientID: data?.PatientID,
        transactionID: data?.TransactionID,
      },
      otMonitoring: {
        id: values?.AnesthesiaMonitoringID,
        monitordate: moment(values?.DATE).format("DD-MMM-YYYY"),
        monitortime: moment(values?.Time)?.format("hh:mm A"),
        heartrate: values?.HeartRateBPMin ? values?.HeartRateBPMin : "",
        bp: values?.HeartRateBPMax ? values?.HeartRateBPMax : "",
        spo2: values?.SpO2PainScore,
        painscore: values?.SpO2PainScore2,
        sedation_score: values?.SedationScore
          ? values?.SedationScore
          : values?.SedationType?.value?.trim()?values?.SedationType?.value:"0",
        sedationscoreText: values?.SedationType?.label,
        sedationscoreValue: values?.SedationType?.value?.trim()?values?.SedationType?.value:"0",
        bromage_score: values?.MBromageScore
          ? values?.MBromageScore
          : values?.MBromageScoreType?.value?.trim()?values?.MBromageScoreType?.value:"0",
        bromagescoreText: values?.MBromageScoreType?.label,
        bromagescoreValue: values?.MBromageScoreType?.value?.trim()?values?.MBromageScoreType?.value:"0",
        aldretescore: values?.AldreteScore
          ? values?.AldreteScore
          : values?.Activity?.value?.trim()?values?.Activity?.value:"0",
        activityText: values?.Activity?.label,
        activityValue: values?.Activity?.value?.trim()?values?.Activity?.value:"0",
        respirationsText: values?.Respirations?.label,
        respirationsValue: values?.Respirations?.value?.trim()?values?.Respirations?.value?.trim():"0",
        circulationText: values?.Circulation?.label,
        circulationValue: values?.Circulation?.value?.trim()?values?.Circulation?.value:"0",
        consciousText: values?.Conscious?.label,
        consciousValue: values?.Conscious?.value?.trim()?values?.Conscious?.value:"0",
        o2saturationText: values?.O2Saturation?.label,
        o2saturationValue: values?.O2Saturation?.value?.trim()?values?.O2Saturation?.value:"0",
        coments: values?.Comments ? values?.Comments : "",
        _Anesthesiologist: values?.Anesthesiologist
          ? values?.Anesthesiologist
          : "",
        anesthesiologistid: "",
        shiftoutdate: moment(values?.ShiftDateOut).format("DD-MMM-YYYY"),
        shiftouttime: moment(values?.ShiftTimeOut).format("hh:mm A"),
        isactive: 1,
        createdby: "",
        otBookingID: data?.OTBookingID,
        transactionID: data?.TransactionID,
        patientID: data?.PatientID,
      },
    };

    const response = await OTPostAnesthesiaOrderSave(payload);
    if (response?.success) {
      notify(response?.message, "success");
      getAnesthesiaOrder();
      GetPostAnesthesiaMonitoring();
      setValues(initialState)
    } else {
      notify(response?.message, "error");
    }
  };

  const GetPostAnesthesiaMonitoring = async () => {
    const transactionID = data?.TransactionID;

    const response = await OTGetPostAnesthesiaMonitoring(transactionID);
    if (response?.success) {
      setTableData(response?.data);
    } else {
    }
  };

  const handleEdit = (index) => {
    const data = tableData[index];

    setValues({
      AnesthesiaMonitoringID: data?.ID,
      DATE: parseDateTime(data.MonitorDate, "00:00 AM"),
      Time: parseDateTime(data.MonitorDate, data.MonitorTime),

      HeartRateBPMin: data.HeartRate,
      HeartRateBPMax: data.BP,
      SpO2PainScore: data.SPO2,
      SpO2PainScore2: data.PainScore,

      SedationScore: data.SedationScore,
      SedationType: {
        label: data.SedationScore_text,
        value: String(data.SedationScore_value),
      },

      MBromageScore: data.BromageScore,
      MBromageScoreType: {
        label: data.BromageScore_text,
        value: String(data.BromageScore_Value),
      },

      AldreteScore: data.AldreteScore,
      Activity: {
        label: data.Activity_text,
        value: String(data.Activity_value),
      },
      Respirations: {
        label: data.Respirations_text,
        value: String(data.Respirations_value),
      },
      Circulation: {
        label: data.Circulation_text,
        value: String(data.Circulation_value),
      },
      Conscious: {
        label: data.Conscious_text,
        value: String(data.Conscious_value),
      },
      O2Saturation: {
        label: data.O2Saturation_text,
        value: String(data.O2Saturation_value),
      },
      Comments: data.Coments ? data.Coments : "",
      Anesthesiologist: data.Anesthesiologist,

      ShiftDateOut: parseDateTime(data.ShiftOutDate, "00:00 AM"), // default midnight
      ShiftTimeOut: parseDateTime(data.ShiftOutDate, data.ShiftOutTime),

      Remark: values.Remark, // keep existing
      DischargeCriteria: values.DischargeCriteria, // keep existing
      NPOFor: values.NPOFor,
      Analgesics: values.Analgesics,
      Antiemetics: values.Antiemetics,
      IVFluids: values.IVFluids,
      ThromboprophalAxis: values.ThromboprophalAxis,
      Antibiotics: values.Antibiotics,
      Other: values.Other,
      isEdit: 1,
      isOrderEdit: values?.isOrderEdit,
    });
  };

  const getAnesthesiaOrder = async () => {
    const transactionID = data?.TransactionID;
    const response = await GetPostAnesthesiaOrder(transactionID);

    if (response?.success) {
      setValues({
        ...values,
        OrderID: response?.data[0]?.ID,
        NPOFor: response?.data[0]?.NPOFor,
        Analgesics: response?.data[0]?.Analgesics,
        Antiemetics: response?.data[0]?.Antiemetics,
        IVFluids: response?.data[0]?.IVFluids,
        ThromboprophalAxis: response?.data[0]?.Thromboprophalaxis,
        Antibiotics: response?.data[0]?.Antibiotics,
        Other: response?.data[0]?.Other,
        isOrderEdit: 1,
        isEdit: values?.isEdit,
      });
    }
  };

  useEffect(() => {
    GetPostAnesthesiaMonitoring();
    getAnesthesiaOrder();
  }, []);
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={data?.breadcrumb}
          data={data}
          isSlideScreen={true}
          isBreadcrumb={true}
        />
        <div className="row p-2">
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("NPO For")}
            placeholder=" "
            id="NPOFor"
            name="NPOFor"
            onChange={handleChange}
            value={values?.NPOFor ? values?.NPOFor : ""}
            required={true}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          />
          <TextAreaInput
            lable={t("Analgesics")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="Analgesics"
            rows={1}
            name="Analgesics"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.Analgesics ? values?.Analgesics : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <TextAreaInput
            lable={t("Antiemetics")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="Antiemetics"
            rows={1}
            name="Antiemetics"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.Antiemetics ? values?.Antiemetics : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <TextAreaInput
            lable={t("IV Fluids")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="IVFluids"
            rows={1}
            name="IVFluids"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.IVFluids ? values?.IVFluids : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <TextAreaInput
            lable={t("Thromboprophal Axis")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="ThromboprophalAxis"
            rows={1}
            name="ThromboprophalAxis"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.ThromboprophalAxis ? values?.ThromboprophalAxis : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <TextAreaInput
            lable={t("Antibiotics")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="Antibiotics"
            rows={1}
            name="Antibiotics"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.Antibiotics ? values?.Antibiotics : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <TextAreaInput
            lable={t("Other")}
            placeholder=""
            className="w-100 h-24 required-fields "
            id="Other"
            rows={1}
            name="Other"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={values?.Other ? values?.Other : ""}
            maxLength={200}
            onChange={handleChange}
          />
          <div className="col-xl-6 col-md-10 col-sm-10 col-12">
             <strong className="text-primary mr-2"> {t("Remark")}: </strong> 
            <span className="text-danger">
              {values?.Remark}
            </span>
          </div>
          {/* <TextAreaInput
            disabled={true}
            type="text"
            className={`form-textarea textAreaHeightAnesthesia `}
            id="Remark"
            name="Remark"
            value={values?.Remark ? values?.Remark : ""}
            onChange={handleChange}
            lable={t("Remark")}
            placeholder=" "
            respclass="col-xl-6 col-md-4 col-sm-6 col-12"
            rows={3}
          /> */}
          <button
            className="btn btn-sm btn-primary mr-1 px-4 ml-2"
            onClick={() => handleSave("SaveTop")}
          >
            {values?.isOrderEdit === 1 ? t("Update") : t("Save")}
          </button>
        </div>

        <Heading
          title={t("Post Anesthesia/Procedure Monitoring")}
          data={data}
          isSlideScreen={false}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
            <DatePicker
              className={`custom-calendar `}
              respclass="vital-sign-date"
              id="Date"
              name="DATE"
              inputClassName={"required-fields"}
              value={values?.DATE ? new Date(values?.DATE) : new Date()}
              handleChange={handleChange}
              lable={t("Date")}
              placeholder={VITE_DATE_FORMAT}
            />
            <TimePicker
              placeholderName={t("Time")}
              lable={t("Time")}
              id="Time"
              respclass="vital-sign-time ml-1"
              className="required-fields"
              name="Time"
              value={values?.Time ? values?.Time : new Date()}
              // value={new Date(`1970-01-01T00:00:00`)}
              handleChange={handleChange}
            />
          </div>
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex"> */}
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("Heart Rate/B.P Min")}
            placeholder=" "
            id="HeartRateBPMin"
            name="HeartRateBPMin"
            onChange={handleChange}
            value={values?.HeartRateBPMin ? values?.HeartRateBPMin : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("Heart Rate/B.P Max")}
            placeholder=" "
            id="HeartRateBPMax"
            name="HeartRateBPMax"
            onChange={handleChange}
            value={values?.HeartRateBPMax ? values?.HeartRateBPMax : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          {/* </div> */}
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex"> */}
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("SpO2 /Pain Score")}
            placeholder=" "
            id="SpO2PainScore"
            name="SpO2PainScore"
            onChange={handleChange}
            value={values?.SpO2PainScore ? values?.SpO2PainScore : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("SpO2/Pain Score2")}
            placeholder=" "
            id="SpO2PainScore2"
            name="SpO2PainScore2"
            onChange={handleChange}
            value={values?.SpO2PainScore2 ? values?.SpO2PainScore2 : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          {/* </div> */}
          {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex"> */}
          <Input
            type="text"
            className="form-control required-fields "
            lable={t("Sedation Score")}
            placeholder=" "
            id="SedationScore"
            name="SedationScore"
            onChange={handleChange}
            value={
              values?.SedationType?.value ? values?.SedationType?.value : ""
            }
            required={true}
            disabled={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Sedation Type")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={SEDATION_SCORE_DROPDOWN}
            handleChange={handleSelect}
            value={values?.SedationType?.value}
            name={"SedationType"}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("M. Bromage Score")}
            placeholder=" "
            id="MBromageScore"
            name="MBromageScore"
            onChange={handleChange}
            value={
              values?.MBromageScoreType?.value
                ? values?.MBromageScoreType?.value
                : ""
            }
            disabled={true}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("M.Bromage Score Type")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={BROMAGE_SCORE_DROPDOWN}
            handleChange={handleSelect}
            value={values?.MBromageScoreType?.value}
            name={"MBromageScoreType"}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Aldrete Score")}
            placeholder=" "
            id="AldreteScore"
            name="AldreteScore"
            onChange={handleChange}
            value={values?.Activity?.value ? values?.Activity?.value : ""}
            required={true}
            disabled={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Activity")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={ACTIVITY_DROPDOWN}
            handleChange={handleSelect}
            value={values?.Activity?.value}
            name={"Activity"}
          />
          <ReactSelect
            placeholderName={t("Respirations")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={RESPIRATIONS_DROPDOWN}
            handleChange={handleSelect}
            value={values?.Respirations?.value}
            name={"Respirations"}
          />
          <ReactSelect
            placeholderName={t("Circulation")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={CIRCULATION_DROPDOWN}
            handleChange={handleSelect}
            value={values?.Circulation?.value}
            name={"Circulation"}
          />
          <ReactSelect
            placeholderName={t("Conscious")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={CONSCIOUS_DROPDOWN}
            handleChange={handleSelect}
            value={values?.Conscious?.value}
            name={"Conscious"}
          />
          <ReactSelect
            placeholderName={t("O2 Saturation")}
            // id={"Type"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={OXYGEN_SATURATION_DROPDOWN}
            handleChange={handleSelect}
            value={values?.O2Saturation?.value}
            name={"O2Saturation"}
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Comments")}
            placeholder=" "
            id="Comments"
            name="Comments"
            onChange={handleChange}
            value={values?.Comments ? values?.Comments : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control"
            lable={t("Anesthesiologist")}
            placeholder=" "
            id="Anesthesiologist"
            name="Anesthesiologist"
            onChange={handleChange}
            value={values?.Anesthesiologist ? values?.Anesthesiologist : ""}
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />

          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
            <DatePicker
              className={`custom-calendar `}
              respclass="vital-sign-date"
              id="ShiftDateOut"
              name="ShiftDateOut"
              inputClassName={"required-fields"}
              value={
                values?.ShiftDateOut
                  ? new Date(values?.ShiftDateOut)
                  : new Date()
              }
              handleChange={handleChange}
              lable={t("Shift Date Out")}
              placeholder={VITE_DATE_FORMAT}
            />
            <TimePicker
              placeholderName={t("Time")}
              lable={t("ShiftTimeOut")}
              id="ShiftTimeOut"
              respclass="vital-sign-time ml-1"
              name="ShiftTimeOut"
              value={
                values?.ShiftTimeOut
                  ? new Date(values?.ShiftTimeOut)
                  : new Date()
              }
              handleChange={handleChange}
            />
          </div>
            <div className="col-xl-4 col-md-4 col-sm-6 col-12">
             <strong className="text-primary mr-2"> {t("Discharge Criteria")}: </strong> 
            <span className="text-danger">
              {values?.DischargeCriteria }
            </span>
          </div>
          {/* <TextAreaInput
            disabled={true}
            type="text"
            className={`form-textarea h-24`}
            id="DischargeCriteria"
            name="DischargeCriteria"
            value={values?.DischargeCriteria ? values?.DischargeCriteria : ""}
            onChange={handleChange}
            lable={t("Discharge Criteria")}
            placeholder=" "
            respclass="col-xl-4 col-md-4 col-sm-6 col-12"
            rows={1}
          /> */}
          <div className="d-flex justify-content-end mb-1 ml-2">
            <button
              className="btn btn-sm btn-primary mr-1 px-4"
              onClick={() => handleSave("SaveBottom")}
            >
              {values?.isEdit === 1 ? t("Update") : t("Save")}
            </button>
            <button
              className="btn btn-sm btn-primary mr-1 px-4"
              onClick={() => {
                setValues((val) => {
                  return {
                    ...val,
                    isEdit: 0,
                    isOrderEdit: values?.isOrderEdit,
                    Comments: "",
                    SpO2PainScore: "",
                    SpO2PainScore2: "",
                    SedationScore: "",
                    MBromageScore: "",
                    AldreteScore: "",
                    Anesthesiologist: "",
                    HeartRateBPMax: "",
                    HeartRateBPMin: "",
                    SedationType: initialState?.SedationType,
                    MBromageScoreType: initialState?.MBromageScoreType,
                    Activity: initialState?.Activity,
                    Circulation: initialState?.Circulation,
                    Conscious: initialState?.Conscious,
                    O2Saturation: initialState?.O2Saturation,
                  };
                });
              }}
            >
              {"Reset"}
            </button>
          </div>
        </div>
      </div>
      <Tables
        thead={thead}
        tbody={tableData?.map((ele, index) => {
          return {
            "S.No.": index + 1,
            MonitorDate: `${ele?.MonitorDate} ${ele?.MonitorTime}`,
            HeartRate: ele?.HeartRate || 0,
            bp: ele?.BP || 0,
            sp02: ele?.SPO2 || 0,
            painScore: ele?.PainScore || 0,
            bromonageScore: ele?.BromageScore || 0,
            SedationScore: ele?.SedationScore || 0,
            AldreteScore: ele?.AldreteScore || 0,
            Anesthesiologist: ele?.Anesthesiologist || 0,
            ShiftTimeOut: `${ele?.ShiftOutDate} ${ele?.ShiftOutTime}`,
            comments: ele?.Coments,
            edit: (
              <i className="fa fa-edit" onClick={() => handleEdit(index)}></i>
            ),
          };
        })}
        style={{ maxHeight: "5vw" }}
      />
    </>
  );
}
