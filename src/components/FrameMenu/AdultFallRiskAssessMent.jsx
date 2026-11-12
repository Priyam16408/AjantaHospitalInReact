import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import ReactSelect from "../formComponent/ReactSelect";
import MultiSelectComp from "../formComponent/MultiSelectComp";
import Tables from "../UI/customTable";
import {
  DDLAge,
  DDLBloodPressure,
  DDlElimination,
  DDLImpairment,
  DDLLengthofStay,
  DDLMentalStatus,
} from "../../utils/constant";
import {
  NursingWardAdultFallRiskPrintAPI,
  NursingWardSaveAssessMentRecord,
  NursingWardSearchAssessmentData,
  NursingWardUpdateAssessMentRecord,
} from "../../networkServices/nursingWardAPI";
import {
  notify,
  NursingWardSaveAssessMentRecordPayload,
  NursingWardSearchAssessmentDataSettler,
} from "../../utils/utils";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";
import moment from "moment";

const TRANSLATION_OBJECT = "NursingWard.AdultFallRiskAssessMent";

const THEAD = [
  "S.No",
  "Date",
  "Time",
  "Age",
  "Mental Status",
  "Length Of Stay",
  "Elimination",
  "Impairment",
  "Blood Pressure",
  "Entry by",
  "Edit",
];

const intialValue = {
  date: new Date(),
  time: new Date(),
  ageValue: "",
  ageText: "",
  mentalStatusValue: "",
  mentalStatusText: "",
  lengthofStayValue: "",
  lengthodStayText: "",
  eliminationValue: "",
  eliminationText: "",
  impairmentValue: "",
  impairmentText: "",
  bloodPressueValue: "",
  bloodPressueText: "",
  g_Diagnosis_Value: "",
  g_Diagnosis_Text: "",
  g_History_Value: "",
  g_History_Text: "",
  g_LossWithoutHold_Value: "",
  g_LossWithoutHold_Text: "",
  g_LossStraight_Value: "",
  g_LossStraight_Text: "",
  g_Decreased_Value: "",
  g_Decreased_Text: "",
  g_Lurching_Value: "",
  g_Lurching_Text: "",
  g_UsesCane_Value: "",
  g_UsesCane_Text: "",
  g_Holds_Value: "",
  g_Holds_Text: "",
  g_WideBase_Value: "",
  g_WideBase_Text: "",
  m_Alcohol_Value: "",
  m_Alcohol_Text: "",
  m_Post_Value: "",
  m_Post_Text: "",
  m_Cardiovascular_Value: "",
  m_Cardiovascular_Text: "",
  m_Diuretics_Value: "",
  m_Diuretics_Text: "",
  m_Cathartics_Value: "",
  m_Cathartics_Text: "",
  m_Sedatives_Value: "",
  m_Sedatives_Text: "",
  m_Histamine_Value: "",
  m_Histamine_Text: "",
  m_Narcotics_Value: "",
  m_Narcotics_Text: "",
  m_Chemotherapy_Value: "",
  m_Chemotherapy_Text: "",
  totalRisk_Value: "",
  totalRisk_Text: "",
  createdBy: "",
  createdDate: "",
  id: "",
};

const AdultFallRiskAssessMent = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const { transactionID, patientID } = data;

  const GOBIMedicationsAlcohol = {
    "Gait & Mobi": [
      {
        label: t( "DiagnosisRelated"),
        name: "g_Diagnosis_Value",
        Text: "g_Diagnosis_Text",
        value: "5",
      },
      {
        label: t( "Historymonths"),
        name: "g_History_Value",
        Text: "g_History_Text",
        value: "5",
      },

      {
        label: t( "LossOfBalance"),
        name: "g_LossWithoutHold_Value",
        Text: "g_LossWithoutHold_Text",
        value: "1",
      },

      {
        label: t( "straightOrTurning"),
        name: "g_LossStraight_Value",
        Text: "g_LossStraight_Text",
        value: "1",
      },
      {
        label: t(
           "Decreasedmuscularcoordination"
        ),
        name: "g_Decreased_Value",
        Text: "g_Decreased_Text",
        value: "1",
      },
      {
        label: t( "Lurching"),
        name: "g_Lurching_Value",
        Text: "g_Lurching_Text",
        value: "1",
      },
      {
        label: t( "Usescanewalkercrutches"),
        name: "g_UsesCane_Value",
        Text: "g_UsesCane_Text",
        value: "1",
      },
      {
        label: t( "Holdsontofurniture"),
        name: "g_Holds_Value",
        Text: "g_Holds_Text",
        value: "1",
      },
      {
        label: t( "Widebaseofsupport"),
        name: "g_WideBase_Value",
        Text: "g_WideBase_Text",
        value: "1",
      },
    ],

    "Medications 24 hours": [
      {
        label: t( "Alcohol"),
        name: "m_Alcohol_Value",
        Text: "m_Alcohol_Text",
        value: "1",
      },
      {
        label: t(
           "Postgeneralanesthesia"
        ),
        name: "m_Post_Value",
        Text: "m_Post_Text",
        value: "1",
      },

      {
        label: t(
           "Cardiovascularagents"
        ),
        name: "m_Cardiovascular_Value",
        Text: "m_Cardiovascular_Text",
        value: "1",
      },
      {
        label: t( "Diuretics"),
        name: "m_Diuretics_Value",
        Text: "m_Diuretics_Text",
        value: "1",
      },
      {
        label: t(
           "Catharticslaxativesenemas"
        ),
        name: "m_Cathartics_Value",
        Text: "m_Cathartics_Text",
        value: "1",
      },
      {
        label: t(
          
            "Sedatives / psychotropic / tranquilizers /barbiturates"
        ),
        name: "m_Sedatives_Value",
        Text: "m_Sedatives_Text",
        value: "1",
      },
      {
        label: t(
           "Histamineinhibitors"
        ),
        name: "m_Histamine_Value",
        Text: "m_Histamine_Text",
        value: "1",
      },
      {
        label: t( "Chemotherapy"),
        name: "m_Chemotherapy_Value",
        Text: "m_Chemotherapy_Text",
        value: "1",
      },
      {
        label: t( "Narcotics"),
        name: "m_Narcotics_Value",
        Text: "m_Narcotics_Text",
        value: "1",
      },
    ],
  };

  const [payload, setPayload] = useState({
    ...intialValue,
  });

  const [printPayload, setPrintPayload] = useState({
    fromData: new Date(),
    toDate: new Date(),
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e, secondName, secondValue) => {
    const { name, checked, value } = e.target;
    setPayload({
      ...payload,
      [name]: checked ? value : "",
      [secondName]: checked ? secondValue : "",
    });
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handlePrintDateChange = (e) => {
    const { name, value } = e.target;
    setPrintPayload({
      ...printPayload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e, secondName) => {
    setPayload({
      ...payload,
      [name]: e?.value,
      [secondName]: e.label,
    });
  };

  const handleNursingWardSaveAssessMentRecord = async () => {
    try {
      const responsePayload = NursingWardSaveAssessMentRecordPayload({
        data: [payload],
        tid: String(transactionID),
        pid: String(patientID),
      });
      const response = await NursingWardSaveAssessMentRecord(responsePayload);

      if (response?.success) {
        notify(response?.message, "success");
        setPayload({ ...intialValue });
        handleNursingWardSearchAssessmentData(transactionID);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleEdit = (data) => {
    const responseData = NursingWardSearchAssessmentDataSettler(data);
    setPayload(responseData);
  };

  const handleNursingWardSearchAssessmentData = async (transactionID) => {
    try {
      const APIresponse = await NursingWardSearchAssessmentData(transactionID);
      if (APIresponse?.data?.length > 0) {
        setTableData(APIresponse?.data);
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleNursingWardUpdateAssessMentRecord = async () => {
    try {
      const responsePayload = NursingWardSaveAssessMentRecordPayload({
        data: [payload],
        tid: String(transactionID),
        pid: String(patientID),
      });
      const response = await NursingWardUpdateAssessMentRecord(responsePayload);
      if (response?.success) {
        notify(response?.message, "success");
        setPayload({ ...intialValue });
        handleNursingWardSearchAssessmentData(transactionID);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handlePrint = async() => {
    // OpenPDFURL(
    //   "NursingWardAdultFallRiskPrint",
    //   data?.transactionID,
    //   moment(printPayload?.fromData).format("DD-MMM-YYYY"),
    //   moment(printPayload?.toDate).format("DD-MMM-YYYY")
    // );

    let payload = {
      "tid": data?.transactionID,
      "fromDate": moment(printPayload?.fromData).format("DD-MMM-YYYY"),
      "toDate": moment(printPayload?.toDate).format("DD-MMM-YYYY")
    }

    let apiResp = await NursingWardAdultFallRiskPrintAPI(payload)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }


  };

  const handleTableData = (tableData) => {
    return tableData?.map((items, index) => {
      const {
        Date,
        Time,
        Age_Text,
        MentalStatus_Text,
        Lengthofstay_Text,
        Elimination_Text,
        Impairment_Text,
        BloodPressure_Text,
        entryby,
      } = items;
      return {
        SNO: index + 1,
        Date: Date,
        Time: Time,
        Age_Text: Age_Text,
        MentalStatus_Text: MentalStatus_Text,
        Lengthofstay_Text: Lengthofstay_Text,
        Elimination_Text: Elimination_Text,
        Impairment_Text: Impairment_Text,
        BloodPressure_Text: BloodPressure_Text,
        entryby: entryby,
        Edit: (
          <i className="fa fa-edit p-1" onClick={() => handleEdit(items)} />
        ),
      };
    });
  };

  useEffect(() => {
    handleNursingWardSearchAssessmentData(transactionID);
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
      
             title={t("Adult Fall Risk Assessment Scoring Tool")}
          isBreadcrumb={false}
        />
        <div className="row p-2">
          <DatePicker
            className="custom-calendar"
            id="date"
            name="date"
            placeholder={VITE_DATE_FORMAT}
            value={payload?.date}
            lable={t("Date")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            handleChange={handleDateTimeChange}
            showTime
            hourFormat="12"
          />
          <TimePicker
            placeholderName="Time"
            lable={t("Time")}
            id="time"
            name="time"
            value={payload?.time}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={handleDateTimeChange}
          />

          <ReactSelect
            placeholderName={t("Age")}
            className="form-control"
            id={"ageValue"}
            name={"ageValue"}
            searchable={true}
            value={payload?.ageValue}
            dynamicOptions={DDLAge}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={(name, e) => handleReactSelect(name, e, "ageText")}
          />
          <ReactSelect
            placeholderName={t("MentalStatus")}
            className="form-control"
            id={"mentalStatusValue"}
            name={"mentalStatusValue"}
            searchable={true}
            dynamicOptions={DDLMentalStatus}
            value={payload?.mentalStatusValue}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={(name, e) =>
              handleReactSelect(name, e, "mentalStatusText")
            }
          />
          <ReactSelect
            placeholderName={t("LengthofStay")}
            className="form-control"
            id={"lengthofStayValue"}
            name={"lengthofStayValue"}
            searchable={true}
            dynamicOptions={DDLLengthofStay}
            value={payload?.lengthofStayValue}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={(name, e) =>
              handleReactSelect(name, e, "lengthodStayText")
            }
          />
          <ReactSelect
            placeholderName={t("Elimination")}
            className="form-control"
            id={"eliminationValue"}
            name={"eliminationValue"}
            searchable={true}
            dynamicOptions={DDlElimination}
            value={payload?.eliminationValue}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={(name, e) =>
              handleReactSelect(name, e, "eliminationText")
            }
          />
          <ReactSelect
            placeholderName={t("Impairment")}
            className="form-control"
            id={"impairmentValue"}
            name={"impairmentValue"}
            searchable={true}
            dynamicOptions={DDLImpairment}
            value={payload?.impairmentValue}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            handleChange={(name, e) =>
              handleReactSelect(name, e, "impairmentText")
            }
          />
          <ReactSelect
            placeholderName={t("Bloodpressure")}
            className="form-control"
            id={"bloodPressueValue"}
            name={"bloodPressueValue"}
            searchable={true}
            dynamicOptions={DDLBloodPressure}
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            value={payload?.bloodPressueValue}
            handleChange={(name, e) =>
              handleReactSelect(name, e, "bloodPressueText")
            }
          />
        </div>
        <div className="row px-2">
          {Object?.keys(GOBIMedicationsAlcohol)?.map((objectKeys, index) => {
            const DataResponse = GOBIMedicationsAlcohol[objectKeys];
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
                      <div className="col-4" key={arrIndex}>
                        <div className="row">
                          <div className="col-1">
                            <input
                              type="checkbox"
                              name={items?.name}
                              checked={
                                String(payload?.[items?.name]) ===
                                String(items?.value)
                              }
                              value={items?.value}
                              id={items?.name}
                              onChange={(e) =>
                                handleChange(e, items?.Text, items?.label)
                              }
                            />
                          </div>
                          <div className="col-11">
                            <label className="ml-2" htmlFor={items?.name}>
                              {items?.label}
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="col-12 ">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  id="totalRisk_Value"
                  name="totalRisk_Value"
                  value="1"
                  checked={String(payload?.totalRisk_Value) === "1"}
                  onChange={(e) => {
                    handleChange(
                      e,
                      "totalRisk_Text",
                      t(
                        "HeadingName"
                      )
                    );
                  }}
                />
                <label className="m-0" htmlFor="totalRisk_Value">
                  {t(
                    "HeadingName"
                  )}
                </label>
              </div>

              <div className="p-2">
                {payload?.id ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleNursingWardUpdateAssessMentRecord}
                  >
                    {t("Update")}
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleNursingWardSaveAssessMentRecord}
                  >
                    {t("Save")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="patient_registration card mt-2">
        <Heading
          title={t("Adult Fall Risk Assessment Scoring Tool")}
          isBreadcrumb={false}
        />

        <div className="p-2">
          <div className="d-flex justify-content-end">
            <DatePicker
              className="custom-calendar"
              id="fromData"
              name="fromData"
              placeholder={VITE_DATE_FORMAT}
              value={printPayload?.fromData}
              lable={t("From Date")}
              respclass={"mx-2"}
              // respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              handleChange={handlePrintDateChange}
              maxDate={printPayload?.toDate}
              showTime
              hourFormat="12"
            />

            <DatePicker
              className="custom-calendar"
              id="toDate"
              name="toDate"
              placeholder={VITE_DATE_FORMAT}
              value={printPayload?.toDate}
              lable={t("To Date")}
              maxDate={new Date()}
              // respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              handleChange={handlePrintDateChange}
              showTime
              hourFormat="12"
            />

            <button
              className="btn btn-sm btn-primary mx-2"
              onClick={handlePrint}
            >
              {t("Print")}
            </button>
          </div>
        </div>

        {tableData?.length > 0 && (
          <div className="px-2 row">
            <div className="col-12">
              <Tables thead={THEAD} tbody={handleTableData(tableData)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdultFallRiskAssessMent;
