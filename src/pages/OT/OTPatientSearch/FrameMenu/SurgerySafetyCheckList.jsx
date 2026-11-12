import React, { useEffect, useState } from "react";
import Heading from "../../../../components/UI/Heading";
import Accordion from "../../../../components/UI/Accordion";
import { useTranslation } from "react-i18next";
import HandsOffReport from "../FlowSheet/HandsOffReport";
import TimePicker from "../../../../components/formComponent/TimePicker";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Input from "../../../../components/formComponent/Input";
import {
  BindAnesthetist,
  BindCirculatingNurse,
  BindDoctorDeptAPI,
  OTEditSurgerySafety,
  OTGetSurgerySafety,
  OTRemove,
  OTSaveSurgerySafety,
  PrintSurgerySafety,
  UpdateSurgerySafety,
} from "../../../../networkServices/OT/otAPI";
import {
  handleReactSelectDropDownOptions,
  timeFormateDate,
} from "../../../../utils/utils";
import Tables from "../../../../components/UI/customTable";
import { notify } from "../../../../utils/ustil2";
import { RedirectURL } from "../../../../networkServices/PDFURL";
import moment from "moment";

const SurgerySafetyCheckList = (data) => {
  const incomingData = data?.data;
  console.log("incomingData", incomingData);
  const [t] = useTranslation();
  const THEAD = [
    { name: "S.no", width: "1%" },
    { name: "Patient Name" },
    { name: "Entry Date" },
    { name: "Entry By" },
    { name: "Edit" },
    { name: "Print" },
    { name: "Remove" },
  ];
  const [dropDownSate, setDropDownState] = useState({
    Anesthesia: [],
  });
  const [payload, setPayload] = useState({});
  console.log("payload", payload);

  const [tableData, setTableData] = useState([
    {
      sno: 1,
      status: "Report Given/ Received by: (print name/title)",
      name: "Dhgyfer",
      date: "02-Oct-2024",
      time: "12:00 AM",
    },
    {
      sno: 2,
      status: "Report Given/ Received by: (print name/title)",
      name: "",
      date: "",
      time: "",
    },
    {
      sno: 3,
      status: "OR Report Given/ Received by: (print name/title)",
      name: "",
      date: "",
      time: "",
    },
  ]);

  const OTPateintSearch = {
    "A. IN PREOP AREA BEFORE SHIFTING PATIENT TO OPERATING ROOM O.R,REVIEW WITH PATIENT & CHECK CASE FILE":
      [
        {
          label: t("Patient Identification(Name,Age,IPID,ID Band)"),
          name: "pateintIndentification_Value",
          Text: "pateintIndentification_Value",
          value: "Patient",
        },
        {
          label: t("Surgical Procedure to be performed"),
          name: "Surgical_procedure_Value",
          Text: "Surgical_procedure_Value",
          value: "Surgical",
        },

        {
          label: t("Site/Side of surgical procedure with marking"),
          name: "g_Site_Value",
          Text: "g_Site_Value",
          value: "Site_Side",
        },

        {
          label: t("Consent Forms(Surgery,Anesthesia) Complete & Signed"),
          name: "g_Consent_Value",
          Text: "g_Consent_Value",
          value: "Consent",
        },
        {
          label: t("Known allergies"),
          name: "g_KnownAllergies_Value",
          Text: "g_KnownAllergies_Value",
          value: "Known",
        },
        {
          label: t("Airway assessed for difficulty"),
          name: "g_Airway_Value",
          Text: "g_Airway_Value",
          value: "Airway",
        },
      ],
  };

  const OTcheckData = {
    "B. IN PREOP AREA/IN O.R.BEFORE INDUCTION": [
      {
        label: t("1. Is Patient Identification Reconfirmed ?"),
        name: "pateintIndentification",
        Text: "pateintIndentification",
        value: "5",
      },
      {
        label: t("2. Any Anesthesia Equipment Issues or concerns"),
        name: "anesthesiaEquipementIssueorConcerns",
        Text: "anesthesiaEquipementIssueorConcerns",
        value: "5",
      },
      {
        label: t("3. Anesthesia safety check has been completed"),
        name: "anesthesiaSafetyCheck_Value",
        Text: "anesthesiaSafetyCheck_Value",
        value: "5",
      },
      {
        label: t("4. Risk of blood loss > 500ml/7ml/kg in children"),
        name: "RiskOfBloodLoss_Value",
        Text: "RiskOfBloodLoss_Value",
        value: "5",
      },
      {
        label: t("5. Two IVs/Central access and fluids planned"),
        name: "TwoIVs_Value",
        Text: "TwoIVs_Value",
        value: "5",
      },
      {
        label: t("6. Blood Products arrenged"),
        name: "BloodProductsArrenged_Value",
        Text: "BloodProductsArrenged_Value",
        value: "5",
      },
      {
        label: t(
          "7. In case of difficult airway(see A6 above),whether Equipment/Assistance available"
        ),
        name: "CaseOfDifficultAirway_Value",
        Text: "CaseOfDifficultAirway_Value",
        value: "5",
      },
    ],
  };
  const BeforeSkinIncision = {
    "C. BEFORE SKIN INCISION (SAFETY PAUSE)": [
      {
        label: t("1. Is Patient Identification Reconfirmed ?"),
        name: "pateintIndentification",
        Text: "pateintIndentification",
        value: "5",
      },
      {
        label: t("2. Any Anesthesia Equipment Issues or concerns"),
        name: "anesthesiaEquipementIssueorConcerns",
        Text: "anesthesiaEquipementIssueorConcerns",
        value: "5",
      },
      {
        label: t("3. Anesthesia safety check has been completed"),
        name: "anesthesiaSafetyCheck_Value",
        Text: "anesthesiaSafetyCheck_Value",
        value: "5",
      },
      {
        label: t("4. Risk of blood loss > 500ml/7ml/kg in children"),
        name: "RiskOfBloodLoss_Value",
        Text: "RiskOfBloodLoss_Value",
        value: "5",
      },
      {
        label: t("5. Two IVs/Central access and fluids planned"),
        name: "TwoIVs_Value",
        Text: "TwoIVs_Value",
        value: "5",
      },
      {
        label: t("6. Blood Products arrenged"),
        name: "BloodProductsArrenged_Value",
        Text: "BloodProductsArrenged_Value",
        value: "5",
      },
      {
        label: t(
          "7. In case of difficult airway(see A6 above),whether Equipment/Assistance available"
        ),
        name: "CaseOfDifficultAirway_Value",
        Text: "CaseOfDifficultAirway_Value",
        value: "5",
      },
    ],
  };

  const handleChange = (e, secondName, secondValue) => {
    const { name, checked, value } = e.target;
    setPayload({
      ...payload,
      [name]: checked ? value : "",
      [secondName]: checked ? secondValue : "",
    });
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setPayload((val) => ({ ...val, [label]: value }));
  };

  const handleReactSelect = (name, value) => {
    setPayload((val) => {
      return {
        ...val,
        [name]: value,
      };
    });
  };

  const bindAnesthesiaData = async () => {
    const response = await BindAnesthetist();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Anesthesia: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "DoctorID"
        ),
      }));
    }
  };
  const BindCirculatingNurseData = async () => {
    const response = await BindCirculatingNurse();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Nurse: handleReactSelectDropDownOptions(
          response?.data,
          "NAME",
          "DoctorID"
        ),
      }));
    }
  };
  const bindSurgerySafetyData = async () => {
    const response = await OTGetSurgerySafety(
      data?.data?.TransactionID,
      data?.data?.PatientID
    );
    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };
  const bindSurgeonData = async () => {
    const response = await BindDoctorDeptAPI();
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Surgeon: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "DoctorID"
        ),
      }));
    } else {
      notify(response?.message, "error");
      setTableData([]);
    }
  };

  const handlePrint = async (ele) => {
    const response = await PrintSurgerySafety(ele?.sscid);
    

    if (response?.success) {
      RedirectURL(response?.data);
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  const handleEdit = async (ele, index) => {
    const response = await OTEditSurgerySafety(ele?.sscid);
    if (response?.success) {
      const data = response?.data || {};

      let preoP_AREA_BEFORE_Values = {};
      OTPateintSearch[
        "A. IN PREOP AREA BEFORE SHIFTING PATIENT TO OPERATING ROOM O.R,REVIEW WITH PATIENT & CHECK CASE FILE"
      ].map((element) => {
        data?.PREOP_AREA_BEFORE?.split(",")?.map((item) => {
          if (item === element.value) {
            preoP_AREA_BEFORE_Values[element.name] = item;
          }
        });
      });
      setPayload({
        Anesthesia: dropDownSate.Anesthesia?.find(
          (opt) => opt.value === data?.ANESTHETIST
        ),
        AnestheticInCharge: dropDownSate.Anesthesia?.find(
          (opt) => opt.value === data?.Anesthetist_In_Charge
        ),
        Surgeon: dropDownSate.Surgeon?.find(
          (opt) => Number(opt.value) === Number(data?.DoctorID)
        ),
        tO_CIRCULATING_NURSE: dropDownSate.Nurse?.find(
          (opt) => opt.value === data?.TO_CIRCULATING_NURSE
        ),
        sO_CIRCULATING_NURSE: dropDownSate.Nurse?.find(
          (opt) => opt.value === data?.SO_CIRCULATING_NURSE
        ),

        // Time fields
        timePatient: timeFormateDate(data?.TIME_PATIENT_WHEELED) || "",
        timeOfAdmin: timeFormateDate(data?.ADMINISTRATION_TIME) || "",
        time_wheeledOut: timeFormateDate(data?.TIME_WHEELED_OUT) || "",
        incisionTime: timeFormateDate(data?.INCISION_TIME) || "",

        // Checkboxes (booleans/yes-no)
        pateintIndentification: data?.IS_PatientIDEN,
        anesthesiaEquipementIssueorConcerns: data?.ANY_ANESTHESIA || "",
        anesthesiaSafetyCheck_Value: data?.ANESTHESIA_SAFETY || "",
        RiskOfBloodLoss_Value: data?.RISK_BLOOD || "",
        TwoIVs_Value: data?.TWO_IV || "",
        BloodProductsArrenged_Value: data?.BLOOD_PRODUCTS || "",
        CaseOfDifficultAirway_Value: data?.IN_CASE_OF || "",
        doesKnow: data?.DOSE_EVERYONE || "",
        patientName: data?.WHAT_IS_PATIENT || "",
        sitePrep: data?.IS_THE_CORRECT || "",
        nonRoutine: data?.DISCUSS_IF || "",
        implants: data?.IMPLANTS_OR || "",
        IsEssential: data?.IS_ESSENTIAL || "",
        AntibioticGiven: data?.ANTIBIOTIC || "",
        anythingUnique: data?.IS_ANYTHING_UNIQUE === 1 ? "no" : "",
        sterility: data?.HAS_STERILITY || "",
        instrumentAreCorrect: data?.IS_INSTRUMENT === 1 ? "yes" : "",
        instrumentAreCorrectCheck: data?.INSTRUMENT_VAL || "",
        ProcedurePerformedChecked: data?.IS_ACTUALPROCE ? "yes" : "",
        ProcedurePerformed: data?.ACTUALPROCE_VAL || "",
        SpeciemnLabeling: data?.IS_SPECIMEN === 1 ? "yes" : "",
        complications: data?.COMPLICATION || "",
        ComplicationsVal: data?.COMPLICATION_VAl || "",
        anySpecialPrecaution: data?.IS_ANYSPECIAL === 1 ? "no" : "",
        anySpecialPrecautionData: data?.ANYSPECIAL_val || "",

        // Inputs
        plannedProcedure: data?.PROCEDURE_NAME || "",
        ExpectedDurationofSurgery: data?.EXPECTED_DURATION || "",
        DrugName: data?.ANTIBIOTIC_DRUG || "",
        anythingUniqueIfyes: data?.ANYTHING_VALUE || "",
        BloodLoss: data?.BLOOD_LOSS || "",
        isEdit: 1,
        sscid: ele?.sscid || "",
        ...preoP_AREA_BEFORE_Values,
      });
    } else {
      notify(response?.message, "error");
    }
  };

  const handleDelete = async (ele) => {
    const response = await OTRemove(ele?.sscid);
    if (response?.success) {
      notify(response?.message, "success");
      bindSurgerySafetyData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    let preoP_AREA_BEFORE = "";
    OTPateintSearch[
      "A. IN PREOP AREA BEFORE SHIFTING PATIENT TO OPERATING ROOM O.R,REVIEW WITH PATIENT & CHECK CASE FILE"
    ].map((element) => {
      if (payload[element.Text]) {
        preoP_AREA_BEFORE += `${element.value},`;
      }
    });
    if (preoP_AREA_BEFORE.charAt(preoP_AREA_BEFORE.length - 1) === ",") {
      preoP_AREA_BEFORE = preoP_AREA_BEFORE.slice(0, -1);
    }

    const structuredPayload = {
      patientID: incomingData?.PatientID || "",
      transactionID: incomingData?.TransactionID || "",
      appointment_ID: 0,
      otbookinG_ID: incomingData?.OTBookingID || "",

      preoP_AREA_BEFORE: preoP_AREA_BEFORE || "",
      iS_PatientIDEN: payload?.pateintIndentification || "",
      anY_ANESTHESIA: payload?.anesthesiaEquipementIssueorConcerns || "",
      anesthesiA_SAFETY: payload?.anesthesiaSafetyCheck_Value || "",
      risK_BLOOD: payload?.RiskOfBloodLoss_Value || "",
      twO_IV: payload?.TwoIVs_Value || "",
      blooD_PRODUCTS: payload?.BloodProductsArrenged_Value || "",
      iN_CASE_OF: payload?.CaseOfDifficultAirway_Value || "",
      timE_PATIENT_WHEELED: moment(payload?.timePatient).format("hh:mm A"),

      anesthetist: payload?.Anesthesia?.value || 0,
      dosE_EVERYONE: payload?.doesKnow || "",
      whaT_IS_PATIENT: payload?.patientName || "",
      procedurE_NAME: payload?.plannedProcedure || "",
      iS_THE_CORRECT: payload?.sitePrep || "",
      expecteD_DURATION: payload?.ExpectedDurationofSurgery || "",
      discusS_IF: payload?.nonRoutine || "",
      implantS_OR: payload?.implants || "",
      iS_ESSENTIAL: payload?.IsEssential || "",
      antibiotic: payload?.AntibioticGiven || "",
      antibiotiC_DRUG: payload?.DrugName || "",
      administratioN_TIME: moment(payload?.timeOfAdmin).format("hh:mm A"),

      iS_ANYTHING_UNIQUE: payload?.anythingUnique ? 1 : 0,
      anythinG_VALUE: payload?.anythingUniqueIfyes || "",

      haS_STERILITY: payload?.sterility || "",
      incisioN_TIME: moment(payload?.incisionTime).format("hh:mm A"),
      tO_CIRCULATING_NURSE: payload?.tO_CIRCULATING_NURSE?.value || 0,

      iS_INSTRUMENT: payload?.instrumentAreCorrect ? 1 : 0,
      instrumenT_VAL: payload?.instrumentAreCorrectCheck || "",
      iS_ACTUALPROCE: payload?.ProcedurePerformed ? 1 : 0,
      actualprocE_VAL: payload?.ProcedurePerformed || "",
      iS_SPECIMEN: payload?.SpeciemnLabeling ? 1 : 0,

      blooD_LOSS: Number(payload?.BloodLoss || 0),
      complication: payload?.complications || "",
      complicatioN_VAl: payload?.ComplicationsVal || "",
      iS_ANYSPECIAL: payload?.anySpecialPrecaution ? 1 : 0,
      anyspeciaL_val: payload?.anySpecialPrecautionData || "",

      timE_WHEELED_OUT: moment(payload?.time_wheeledOut).format("hh:mm A"),
      sO_CIRCULATING_NURSE: payload?.sO_CIRCULATING_NURSE?.value || 0,

      doctorID: payload?.Surgeon?.value || "",
      anesthetist_In_Charge: payload?.AnestheticInCharge?.value || 0,

      is_active: 0,
      update_date: new Date(),
      entry_by: "",
      entry_Date: new Date().toISOString(),
      update_by: "",
      remove_by: "",
      remove_date: new Date(),
      center_id: 0,
    };

    const response = await OTSaveSurgerySafety(structuredPayload);
    if (response?.success) {
      notify(response?.message, "success");
      bindSurgerySafetyData();
      setPayload({});
    } else {
      notify(response?.message || "Save failed", "error");
    }
  };

  const handleUpdate = async () => {
    let preoP_AREA_BEFORE = "";
    OTPateintSearch[
      "A. IN PREOP AREA BEFORE SHIFTING PATIENT TO OPERATING ROOM O.R,REVIEW WITH PATIENT & CHECK CASE FILE"
    ].map((element) => {
      if (payload[element.Text]) {
        preoP_AREA_BEFORE += `${element.value},`;
      }
    });
    if (preoP_AREA_BEFORE.charAt(preoP_AREA_BEFORE.length - 1) === ",") {
      preoP_AREA_BEFORE = preoP_AREA_BEFORE.slice(0, -1);
    }
    const structuredPayload = {
      patientID: incomingData?.PatientID || "",
      transactionID: incomingData?.TransactionID || "",
      appointment_ID: 0,
      otbookinG_ID: incomingData?.OTBookingID || "",

      preoP_AREA_BEFORE: preoP_AREA_BEFORE || "",
      iS_PatientIDEN: payload?.pateintIndentification || "",
      anY_ANESTHESIA: payload?.anesthesiaEquipementIssueorConcerns || "",
      anesthesiA_SAFETY: payload?.anesthesiaSafetyCheck_Value || "",
      risK_BLOOD: payload?.RiskOfBloodLoss_Value || "",
      twO_IV: payload?.TwoIVs_Value || "",
      blooD_PRODUCTS: payload?.BloodProductsArrenged_Value || "",
      iN_CASE_OF: payload?.CaseOfDifficultAirway_Value || "",
      timE_PATIENT_WHEELED: moment(payload?.timePatient).format("hh:mm A"),

      anesthetist: payload?.Anesthesia?.value || 0,
      dosE_EVERYONE: payload?.doesKnow || "",
      whaT_IS_PATIENT: payload?.patientName || "",
      procedurE_NAME: payload?.plannedProcedure || "",
      iS_THE_CORRECT: payload?.sitePrep || "",
      expecteD_DURATION: payload?.ExpectedDurationofSurgery || "",
      discusS_IF: payload?.nonRoutine || "",
      implantS_OR: payload?.implants || "",
      iS_ESSENTIAL: payload?.IsEssential || "",
      antibiotic: payload?.AntibioticGiven || "",
      antibiotiC_DRUG: payload?.DrugName || "",
      administratioN_TIME: moment(payload?.timeOfAdmin).format("hh:mm A"),

      iS_ANYTHING_UNIQUE: payload?.anythingUnique ? 1 : 0,
      anythinG_VALUE: payload?.anythingUniqueIfyes || "",

      haS_STERILITY: payload?.sterility || "",
      incisioN_TIME: moment(payload?.incisionTime).format("hh:mm A"),
      tO_CIRCULATING_NURSE: payload?.tO_CIRCULATING_NURSE?.value || 0,

      iS_INSTRUMENT: payload?.instrumentAreCorrect ? 1 : 0,
      instrumenT_VAL: payload?.instrumentAreCorrectCheck || "",
      iS_ACTUALPROCE: payload?.ProcedurePerformed ? 1 : 0,
      actualprocE_VAL: payload?.ProcedurePerformed || "",
      iS_SPECIMEN: payload?.SpeciemnLabeling ? 1 : 0,

      blooD_LOSS: Number(payload?.BloodLoss || 0),
      complication: payload?.complications || "",
      complicatioN_VAl: payload?.ComplicationsVal || "",
      iS_ANYSPECIAL: payload?.anySpecialPrecaution ? 1 : 0,
      anyspeciaL_val: payload?.anySpecialPrecautionData || "",

      timE_WHEELED_OUT: moment(payload?.time_wheeledOut).format("hh:mm A"),
      sO_CIRCULATING_NURSE: payload?.sO_CIRCULATING_NURSE?.value || 0,

      doctorID: payload?.Surgeon?.value || "",
      anesthetist_In_Charge: payload?.AnestheticInCharge?.value || 0,

      is_active: 0,
      update_date: new Date(),
      entry_by: "",
      entry_Date: new Date().toISOString(),
      update_by: "",
      remove_by: "",
      remove_date: new Date(),
      center_id: 0,
    };

    const response = await UpdateSurgerySafety(
      payload?.sscid,
      structuredPayload
    );

    if (response?.success) {
      notify(response?.message, "success");
      bindSurgerySafetyData();
      setPayload({});
    } else {
      notify(response?.message || "Update failed", "error");
    }
  };

  const handleTimeChange = (e) => {
    const { value, name } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  useEffect(() => {
    bindAnesthesiaData();
    BindCirculatingNurseData();
    bindSurgerySafetyData();
    bindSurgeonData();
  }, []);

  return (
    <div className="card">
      <Heading title={""} isBreadcrumb={true}></Heading>
      <Heading title={t("Sign In")} isBreadcrumb={false}></Heading>

      <div
        style={{
          fontWeight: "600",
          fontSize: "11px !important",
          // borderBottom: "1px solid #d0d6db",
        }}
        className="mx-2"
      >
        {t("A. IN PREOP AREABEFORE SHIFTING PATIENT TO OPERATING ROOM(O.R)")}
      </div>

      <div
        style={{
          fontWeight: "600",
          fontSize: "11px !important",
          // borderBottom: "1px solid #d0d6db",
        }}
        className="mx-2"
      >
        {t(
          "B. IN PREOP AREA/IN OPERATING ROOM BEFORE INDUCTION OF ANAESTHESIA"
        )}
      </div>

      <div className="row px-2 mt-4">
        {Object?.keys(OTPateintSearch)?.map((objectKeys, index) => {
          const DataResponse = OTPateintSearch[objectKeys];
          return (
            <div className="col-md-6 col-12" key={index}>
              <div
                style={{
                  fontWeight: "900",
                  borderBottom: "1px solid #d0d6db",
                }}
                className="mx-2"
              >
                {t(objectKeys)}
              </div>

              <div className="row mt-2 px-2">
                {DataResponse?.map((items, arrIndex) => {
                  return (
                    <div className="col-6" key={arrIndex}>
                      <div className="row">
                        <div className="col-1">
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            name={items?.name}
                            checked={
                              payload?.[items?.Text] === String(items?.value)
                            }
                            value={items?.value}
                            id={items?.name}
                            onChange={(e) =>
                              handleChange(e, items?.Text, items?.value)
                            }
                          />
                        </div>
                        <div className="col-11">
                          <span className="ml-2" htmlFor={items?.name}>
                            {items?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row mt-4 px-2">
                <div className="col-12">
                  <div
                    style={{ borderBottom: "1px dashed #000", width: "250px" }}
                  ></div>
                  <div className="fw-bold mt-1">
                    {t("Anesthetist / Surgeon (in case of LA) Sign")}
                  </div>
                  <div
                    className="fst-italic mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {t(
                      "OT Technician to transfer the patient to O.R only after part A is completed and signed by Anaesthetist."
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {Object?.keys(OTcheckData)?.map((objectKeys, index) => {
          const DataResponse = OTcheckData[objectKeys];
          return (
            <div className="col-md-6 col-12" key={index}>
              <div
                style={{
                  fontWeight: "900",
                  borderBottom: "1px solid #d0d6db",
                }}
                className="mx-2"
              >
                {t(objectKeys)}
              </div>

              <div className="row mt-2 px-2">
                {DataResponse?.map((item, index) => (
                  <div className="col-6 mb-3" key={index}>
                    <span className="fw-bold">{item?.label}</span>
                    <div className="d-flex align-items-center">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input table-checkbox"
                          type="checkbox"
                          style={{ marginLeft: "-12px" }}
                          name={item?.name}
                          id={`${item?.name}-yes`}
                          value="yes"
                          checked={String(payload?.[item?.name]) === "yes"}
                          onChange={(e) => handleChange(e, item?.name, "yes")}
                        />
                        <span
                          className="form-check-label ml-2"
                          htmlFor={`${item?.name}-yes`}
                        >
                          {t("yes")}
                        </span>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input table-checkbox"
                          type="checkbox"
                          style={{ marginLeft: "-12px" }}
                          name={item?.name}
                          id={`${item?.name}-no`}
                          value="no"
                          checked={String(payload?.[item?.name]) === "no"}
                          onChange={(e) => handleChange(e, item?.name, "no")}
                        />
                        <span
                          className="form-check-label ml-2"
                          htmlFor={`${item?.name}-no`}
                        >
                          {t("no")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <ReactSelect
                  placeholderName={t("Anesthesia")}
                  requiredClassName={""}
                  name="Anesthesia"
                  value={payload?.Anesthesia?.value}
                  handleChange={(name, e) => handleReactSelect(name, e)}
                  dynamicOptions={dropDownSate?.Anesthesia}
                  searchable={true}
                  respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                />
                <TimePicker
                  lable={t("Time Patient Wheeled in O.R.")}
                  respclass="vital-sign-time col-xl-2 col-md-4 col-sm-6 col-12"
                  id="timePatient"
                  name="timePatient"
                  value={payload?.timePatient}
                  handleChange={handleTimeChange}
                  className={""}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="col-12 row">
        <div className="col-xl-6 col-12">
          {/* 1st */}
          <>
            <Heading
              title={t("TIME OUT(Operating Room)")}
              isBreadcrumb={false}
            ></Heading>
            <div className="row px-2 mt-4">
              {Object?.keys(BeforeSkinIncision)?.map((objectKeys, index) => {
                return (
                  <div className="col-md-12 col-12" key={index}>
                    <div
                      style={{
                        fontWeight: "900",
                        borderBottom: "1px solid #d0d6db",
                      }}
                      className="mx-2"
                    >
                      {t("C. BEFORE SKIN INCISION (SAFETY PAUSE)")}
                    </div>

                    <div className="flex-wrap col-xl-12 mt-2 px-2 d-flex">
                      <div className="col-12 mb-3">
                        <span
                          className="fw-bold"
                          style={{ fontWeight: "bold" }}
                        >
                          {t("1. Does Everyone Know Each Other ?")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"doesKnow"}-yes`}
                              value="yes"
                              checked={String(payload?.["doesKnow"]) === "yes"}
                              onChange={(e) =>
                                handleChange(e, "doesKnow", "yes")
                              }
                            />
                            <span
                              style={{ marginBottom: "0px !important" }}
                              className="form-check-label ml-2"
                              htmlFor={`${"doesKnow"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"doesKnow"}
                              id={`${"doesKnow"}-no`}
                              value="no"
                              checked={String(payload?.["doesKnow"]) === "no"}
                              onChange={(e) =>
                                handleChange(e, "doesKnow", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"doesKnow"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        className="col-12"
                      >
                        (SURGEON REVIEWS WITH THW TEAM)
                      </p>
                      <div className="col-6 mb-2">
                        <span className="fw-bold">
                          {t("2. What is the patient's name ?")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"patientName"}-yes`}
                              value="yes"
                              checked={
                                String(payload?.["patientName"]) === "yes"
                              }
                              onChange={(e) =>
                                handleChange(e, "patientName", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"patientName"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"patientName"}
                              id={`${"patientName"}-no`}
                              value="no"
                              checked={
                                String(payload?.["patientName"]) === "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "patientName", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"patientName"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Input
                        type="text"
                        className={"form-control "}
                        lable={t("3. Name of Procedure Planned")}
                        placeholder=" "
                        name="plannedProcedure"
                        onChange={(e) =>
                          handleInputChange(e, 0, "plannedProcedure")
                        }
                        value={payload?.plannedProcedure}
                        required={true}
                        respclass="col-xl-6 col-md-4 col-sm-6 col-12 mt-2"
                      />

                      <div className="col-6 mb-2">
                        <span className="fw-bold">
                          {t("4. Is the correct site prepared and draped ?")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"sitePrep"}-yes`}
                              value="yes"
                              checked={String(payload?.["sitePrep"]) === "yes"}
                              onChange={(e) =>
                                handleChange(e, "sitePrep", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"sitePrep"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"sitePrep"}
                              id={`${"sitePrep"}-no`}
                              value="no"
                              checked={String(payload?.["sitePrep"]) === "no"}
                              onChange={(e) =>
                                handleChange(e, "sitePrep", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"sitePrep"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Input
                        type="text"
                        className={"form-control "}
                        lable={t("5. Expected Duration of Surgery")}
                        placeholder=" "
                        name="ExpectedDurationofSurgery"
                        onChange={(e) =>
                          handleInputChange(e, 0, "ExpectedDurationofSurgery")
                        }
                        value={payload?.ExpectedDurationofSurgery}
                        required={true}
                        respclass="col-xl-6 col-md-4 col-sm-6 col-12 mt-2"
                      />

                      <div className="col-6 mb-2">
                        <span className="fw-bold">
                          {t(
                            "6. Discuss if there is anything unique or non routine about this surgery ?"
                          )}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"nonRoutine"}-yes`}
                              value="yes"
                              checked={
                                String(payload?.["nonRoutine"]) === "routine"
                              }
                              onChange={(e) =>
                                handleChange(e, "nonRoutine", "routine")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"nonRoutine"}-yes`}
                            >
                              {t("Routine")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"nonRoutine"}
                              id={`${"nonRoutine"}-no`}
                              value="no"
                              checked={
                                String(payload?.["nonRoutine"]) === "nonRoutine"
                              }
                              onChange={(e) =>
                                handleChange(e, "nonRoutine", "nonRoutine")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"nonRoutine"}-no`}
                            >
                              {t("Non routinge/Any issues")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 mb-2">
                        <span className="fw-bold">
                          {t("7. Implants or Special Equiment required")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"implants"}-yes`}
                              value="yes"
                              checked={String(payload?.["implants"]) === "yes"}
                              onChange={(e) =>
                                handleChange(e, "implants", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"implants"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"implants"}-na`}
                              value="yes"
                              checked={String(payload?.["implants"]) === "na"}
                              onChange={(e) =>
                                handleChange(e, "implants", "na")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"implants"}-na`}
                            >
                              {t("N/A")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mb-2">
                        <span className="fw-bold">
                          {t("8. Is Essential Imaging Displayed ?")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"IsEssential"}-yes`}
                              value="yes"
                              checked={
                                String(payload?.["IsEssential"]) === "yes"
                              }
                              onChange={(e) =>
                                handleChange(e, "IsEssential", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"IsEssential"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"IsEssential"}
                              id={`${"IsEssential"}-no`}
                              value="no"
                              checked={
                                String(payload?.["IsEssential"]) === "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "IsEssential", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"IsEssential"}-no`}
                            >
                              {t("Not Applicable")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        className="col-12"
                      >
                        {t("(ANAESTHETIST REVIEWS WITH THE TEAM)")}
                      </p>
                      <div className="col-6 mb-3">
                        <span className="fw-bold">
                          {t(
                            "9. Antibiotic Prophylaxis Given Within Last 15-60 Minutes(90-120 for Vanco, Metro, etc)?"
                          )}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"AntibioticGiven"}-yes`}
                              value="yes"
                              checked={
                                String(payload?.["AntibioticGiven"]) === "yes"
                              }
                              onChange={(e) =>
                                handleChange(e, "AntibioticGiven", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"AntibioticGiven"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"AntibioticGiven"}
                              id={`${"AntibioticGiven"}-no`}
                              value="no"
                              checked={
                                String(payload?.["AntibioticGiven"]) === "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "AntibioticGiven", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"AntibioticGiven"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"AntibioticGiven"}
                              id={`${"AntibioticGiven"}-na`}
                              value="na"
                              checked={
                                String(payload?.["AntibioticGiven"]) === "na"
                              }
                              onChange={(e) =>
                                handleChange(e, "AntibioticGiven", "na")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"AntibioticGiven"}-na`}
                            >
                              {t("Not Applicable")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Input
                        type="text"
                        className={"form-control "}
                        lable={t("Drug Name")}
                        placeholder=" "
                        name="DrugName"
                        onChange={(e) => handleInputChange(e, 0, "DrugName")}
                        value={payload?.DrugName}
                        required={true}
                        respclass="col-xl-4 col-md-4 col-sm-4 col-12 mt-3"
                      />
                      <TimePicker
                        lable={t("Time of Administration")}
                        respclass="col-xl-2 col-md-2 col-sm-2 col-12 mt-3"
                        id="timeOfAdmin"
                        name="timeOfAdmin"
                        value={payload?.timeOfAdmin}
                        handleChange={handleTimeChange}
                        className={""}
                      />

                      <div className="col-12 mb-2">
                        <span className="fw-bold">
                          {t(
                            "10. Is There Anything Unique Or Non-Routine About Anesthesia Administration ?"
                          )}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"anythingUnique"}-no`}
                              value="no"
                              checked={
                                String(payload?.["anythingUnique"]) === "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "anythingUnique", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"anythingUnique"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                          <div className="form-check">
                            <Input
                              type="text"
                              className={"form-control"}
                              lable={t("If yes")}
                              placeholder=" "
                              disabled={
                                String(payload?.["anythingUnique"]) === "no"
                              }
                              name="anythingUniqueIfyes"
                              onChange={(e) =>
                                handleInputChange(e, 0, "anythingUniqueIfyes")
                              }
                              value={payload?.anythingUniqueIfyes}
                              required={true}
                              respclass="col-xl-12 col-md-4 col-sm-6 col-12 mt-2"
                            />
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        className="col-12"
                      >
                        {t(" (NURSING TEAM REVIEWS)")}
                      </p>

                      <div className="col-6 mb-3">
                        <span className="fw-bold">
                          {t("11. Has sterility been confirmed ?")}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"sterility"}-yes`}
                              value="yes"
                              checked={String(payload?.["sterility"]) === "yes"}
                              onChange={(e) =>
                                handleChange(e, "sterility", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"sterility"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"sterility"}
                              id={`${"sterility"}-no`}
                              value="no"
                              checked={String(payload?.["sterility"]) === "no"}
                              onChange={(e) =>
                                handleChange(e, "sterility", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"sterility"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ReactSelect
                        placeholderName={t("Circulation Nurse")}
                        requiredClassName={""}
                        name="tO_CIRCULATING_NURSE"
                        value={payload?.tO_CIRCULATING_NURSE?.value}
                        handleChange={(name, e) => handleReactSelect(name, e)}
                        dynamicOptions={dropDownSate?.Nurse}
                        searchable={true}
                        respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-3"
                      />

                      <TimePicker
                        lable={t("Incision Time")}
                        respclass="vital-sign-time col-xl-2 col-md-4 col-sm-6 col-12 mt-3"
                        id="incisionTime"
                        name="incisionTime"
                        value={payload?.incisionTime}
                        handleChange={handleTimeChange}
                        className={""}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </div>
        <div className="col-xl-6 col-12">
          {/* 1st */}
          <>
            <Heading
              title={t("SIGN OUT(Operating Room)")}
              isBreadcrumb={false}
            ></Heading>
            <div className="row px-2 mt-4">
              {Object?.keys(BeforeSkinIncision)?.map((objectKeys, index) => {
                return (
                  <div className="col-md-12 col-xl-12 col-12" key={index}>
                    <div
                      style={{
                        fontWeight: "900",
                        borderBottom: "1px solid #d0d6db",
                      }}
                      className="mx-2"
                    >
                      {t("D. BEFORE PATIENT LEAVES OPERATING ROOM")}
                    </div>

                    <div className=" col-xl-12 mt-2 px-2 row">
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        className="col-12"
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                          className="col-12"
                        >
                          {t("(SURGEON REVIEWS WITH THW TEAM)")}
                        </p>
                      </p>
                      <div className="col-6 mb-3">
                        <span className="fw-bold">
                          <input
                            type="checkbox"
                            className="table-checkbox"
                            value="checked"
                            id={`${"instrumentAreCorrect"}`}
                            checked={
                              String(payload?.["instrumentAreCorrect"]) ===
                              "yes"
                            }
                            onChange={(e) =>
                              handleChange(e, "instrumentAreCorrect", "yes")
                            }
                          />
                          {t(
                            ` 1. Instrument, sponge, swab and needle counts are correct`
                          )}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              disabled={
                                String(payload?.["instrumentAreCorrect"]) ===
                                "yes"
                                  ? false
                                  : true
                              }
                              id={`${"instrumentAreCorrectCheck"}-yes`}
                              value="yes"
                              checked={
                                String(
                                  payload?.["instrumentAreCorrectCheck"]
                                ) === "yes"
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "instrumentAreCorrectCheck",
                                  "yes"
                                )
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"instrumentAreCorrectCheck"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              disabled={
                                String(payload?.["instrumentAreCorrect"]) ===
                                "yes"
                                  ? false
                                  : true
                              }
                              style={{ marginLeft: "-12px" }}
                              name={"instrumentAreCorrectCheck"}
                              id={`${"instrumentAreCorrectCheck"}-no`}
                              value="no"
                              checked={
                                String(
                                  payload?.["instrumentAreCorrectCheck"]
                                ) === "no"
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "instrumentAreCorrectCheck",
                                  "no"
                                )
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"instrumentAreCorrectCheck"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"instrumentAreCorrectCheck"}
                              disabled={
                                String(payload?.["instrumentAreCorrect"]) ===
                                "yes"
                                  ? false
                                  : true
                              }
                              id={`${"instrumentAreCorrectNa"}-na`}
                              value="no"
                              checked={
                                String(
                                  payload?.["instrumentAreCorrectCheck"]
                                ) === "not"
                              }
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  "instrumentAreCorrectCheck",
                                  "not"
                                )
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"instrumentAreCorrectCheck"}-na`}
                            >
                              {t("N/A")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 mb-3">
                        <span className="fw-bold">
                          <input
                            type="checkbox"
                            className="table-checkbox mr-2"
                            checked={
                              String(payload?.["ProcedurePerformedChecked"]) ===
                              "yes"
                            }
                            onChange={(e) =>
                              handleChange(
                                e,
                                "ProcedurePerformedChecked",
                                "yes"
                              )
                            }
                          />
                          {t("2. Name of the actual procedure performed")}
                        </span>
                        <div className="d-flex align-items-center">
                          <Input
                            type="text"
                            className={"form-control"}
                            lable={t("")}
                            placeholder=""
                            disabled={
                              String(payload?.["ProcedurePerformedChecked"]) ===
                              "yes"
                                ? false
                                : true
                            }
                            name="ProcedurePerformed"
                            onChange={(e) =>
                              handleInputChange(e, 0, "ProcedurePerformed")
                            }
                            value={payload?.ProcedurePerformed}
                            required={true}
                            respclass="col-xl-12 col-md-6 col-sm-6 col-12"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <span className="fw-bold">
                          <input
                            type="checkbox"
                            className="table-checkbox mr-2"
                            checked={
                              String(payload?.["SpeciemnLabeling"]) === "yes"
                            }
                            onChange={(e) =>
                              handleChange(e, "SpeciemnLabeling", "yes")
                            }
                          />
                          <span htmlFor="SpeciemnLabeling">
                            {t(
                              "3. Specimen labeling Read back specimen ladeling including patient's name & UHID/IPD"
                            )}
                          </span>
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                        className="col-12"
                      >
                        {t("(SURGICAL TEAM DISCUSSES)")}
                      </p>

                      <div className="col-6 mb-3">
                        <span className="fw-bold">
                          {t("4. ESTIMATED BLOOD LOSS IN ML")}
                        </span>
                        <div className="d-flex align-items-center">
                          <Input
                            type="number"
                            className={"form-control "}
                            // lable={t("BloodLoss")}
                            placeholder=" "
                            name="BloodLoss"
                            onChange={(e) =>
                              handleInputChange(e, 0, "BloodLoss")
                            }
                            value={payload?.BloodLoss}
                            required={true}
                            respclass="col-xl-8 col-md-6 col-sm-8 col-12"
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <span className="fw-bold">{t("5. Complications")}</span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"complications"}-yes`}
                              value="yes"
                              checked={
                                String(payload?.["complications"]) === "yes"
                              }
                              onChange={(e) =>
                                handleChange(e, "complications", "yes")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"complications"}-yes`}
                            >
                              {t("yes")}
                            </span>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={"complications"}
                              id={`${"complications"}-no`}
                              value="no"
                              checked={
                                String(payload?.["complications"]) === "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "complications", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"complications"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                          <Input
                            type="text"
                            className={"form-control "}
                            lable={t("Complications")}
                            placeholder=" "
                            name="ComplicationsVal"
                            onChange={(e) =>
                              handleInputChange(e, 0, "ComplicationsVal")
                            }
                            value={payload?.ComplicationsVal}
                            required={true}
                            respclass="col-xl-8 col-md-8 col-sm-2 col-12 mt-1"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <span className="fw-bold">
                          {t(
                            "6. Any Special precaution to be taken inPost-Operative Patient management"
                          )}
                        </span>
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input table-checkbox"
                              type="checkbox"
                              style={{ marginLeft: "-12px" }}
                              name={""}
                              id={`${"anySpecialPrecaution"}-no`}
                              value="no"
                              checked={
                                String(payload?.["anySpecialPrecaution"]) ===
                                "no"
                              }
                              onChange={(e) =>
                                handleChange(e, "anySpecialPrecaution", "no")
                              }
                            />
                            <span
                              className="form-check-label ml-2"
                              htmlFor={`${"anySpecialPrecaution"}-no`}
                            >
                              {t("no")}
                            </span>
                          </div>
                          <div className="form-check">
                            <Input
                              type="text"
                              className={"form-control"}
                              lable={t("If yes")}
                              placeholder=" "
                              disabled={
                                String(payload?.["anySpecialPrecaution"]) ===
                                "no"
                              }
                              name="anySpecialPrecautionData"
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  0,
                                  "anySpecialPrecautionData"
                                )
                              }
                              value={payload?.anySpecialPrecautionData}
                              required={true}
                              respclass="col-xl-12 col-md-4 col-sm-6 col-12 mt-2"
                            />
                          </div>
                        </div>
                      </div>
                      <ReactSelect
                        placeholderName={t("Circulation Nurse")}
                        requiredClassName={""}
                        name="sO_CIRCULATING_NURSE"
                        value={payload?.sO_CIRCULATING_NURSE?.value}
                        handleChange={(name, e) => handleReactSelect(name, e)}
                        dynamicOptions={dropDownSate?.Nurse}
                        searchable={true}
                        respclass="col-xl-4 col-md-4 col-sm-6 col-12 mt-4"
                      />

                      <TimePicker
                        lable={t("Time patient Wheeled Out")}
                        respclass="vital-sign-time col-xl-2 col-md-4 col-sm-6 col-12 mt-4"
                        id="time_wheeledOut"
                        name="time_wheeledOut"
                        value={payload?.time_wheeledOut}
                        handleChange={handleTimeChange}
                        className={""}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      </div>
      <div className="w-100 d-flex justify-content-end mr-4"></div>
      <div className="row w-100 d-flex justify-content-end">
        <ReactSelect
          placeholderName={t("Surgeon")}
          requiredClassName={""}
          name="Surgeon"
          value={payload?.Surgeon?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.Surgeon}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Anesthetic In Charge")}
          requiredClassName={""}
          name="AnestheticInCharge"
          value={payload?.AnestheticInCharge?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownSate?.Anesthesia}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className="btn btn-success btn-primary btn-sm"
          style={{ marginRight: "20px !important" }}
          onClick={() => (payload?.isEdit ? handleUpdate() : handleSave())}
        >
          {payload?.isEdit ? t("Update") : t(" Save")}
        </button>
        <button
          className="btn btn-success btn-primary btn-sm ml-2"
          style={{ marginRight: "20px !important" }}
          onClick={() => {
            setPayload({});
          }}
        >
          {t("Cancel")}
        </button>
      </div>

      {tableData?.length > 0 && (
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            PatientName: ele?.patientname,
            EntryDate: ele?.Entry_date,
            EntryBy: ele?.Entry_by,
            edit: (
              <div
                onClick={() => handleEdit(ele, index)}
                className="fa fa-edit"
              ></div>
            ),
            check: (
              <span
                className="fa fa-print"
                onClick={() => handlePrint(ele)}
              ></span>
            ),
            remove: (
              <span
                className="fa fa-trash"
                onClick={() => handleDelete(ele)}
              ></span>
            ),
          }))}
          style={{ maxHeight: "65vh" }}
        />
      )}
    </div>
  );
};

export default SurgerySafetyCheckList;
