import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../UI/Heading";
import ReactSelect from "../formComponent/ReactSelect";
import Input from "../formComponent/Input";
import { AGE_TYPE } from "../../utils/constant";
import LabeledInput from "../formComponent/LabeledInput";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import MultiSelectComp from "../formComponent/MultiSelectComp";
import TextAreaInput from "../formComponent/TextAreaInput";
import {
  NursingWardBindInjury,
  NursingWardBindNeedleName,
  NursingWardNeedleInjuryPrintAPI,
  NursingWardNeedleInjurySave,
} from "../../networkServices/nursingWardAPI";
import {
  handleNursingWardNeedleInjurySavePayload,
  notify,
  parseTimeString,
  reactSelectOptionList,
} from "../../utils/utils";
import moment from "moment";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";

const SEX_DROPDOWN = [
  {
    label: "Male",
    value: "M",
  },
  {
    label: "FeMale",
    value: "F",
  },
  {
    label: "Other",
    value: "O",
  },
];

const NATURE_OF_INJURY = [
  {
    name: "Superficial",
    code: "1",
  },
  {
    name: "Moderate",
    code: "2",
  },
  {
    name: "Deep",
    code: "3",
  },
  {
    name: "Bleeding",
    code: "4",
  },
];

const TYPE_OF_CONTAMINATION = [
  {
    label: "Blood",
    value: "1",
  },

  {
    label: "Non Blood Stained Fluid",
    value: "2",
  },

  {
    label: "Blood Stained Fluid",
    value: "3",
  },

  {
    label: "UnKnown",
    value: "4",
  },
];

const FIRST_AID_AND_GLOVES_WORN = [
  {
    label: "Yes",
    value: "1",
  },

  {
    label: "No",
    value: "0",
  },
];

const INFORMATION_REGARDING_SOURCE_OF_PATIENT = [
  {
    label: "Known",
    value: "1",
  },
  {
    label: "UnKnown",
    value: "0",
  },
];

const NeedleStickInjuryReportingForm = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const { roomName, patientID, transactionID, address, age, ageSex } = data;

  const handleSpilt = (Age, symbol) => {
    return Age.split(symbol);
  };

  const intialState = {
    sex: handleSpilt(ageSex, " / ")[1].charAt(0),
    injuryID: "",
    injury: [],//required
    btnVal: "Save",
    pid: patientID,
    tid: transactionID,
    nameId: "",//required
    name: "",//required
    date: new Date(),//required
    time: new Date(),//required
    age: handleSpilt(age, " ")?.[0],
    Type: handleSpilt(age, " ")?.[1],
    ward: roomName, //pass hogi props
    address: address,
    designation: "",
    incidentDate: new Date(),//required
    incidentTime: new Date(),//required
    reportingDate: new Date(),//required
    reportingTime: new Date(),//required
    procedure: "",
    activities: "",
    contamination: "4",
    firstAid: "0",//required
    glovesWorn: "0",//required
    hepDate: new Date(),
    tetanusDate: new Date(),
    sourceofPatient: "0",
    antiHCV: "Not Known",
    hbsAg: "Not Known",
  };

  const [dropDownState, setDropDownState] = useState({
    EmployeeName: [],
  });

  const [payload, setPayload] = useState({
    ...intialState,
  });

  console.log(payload);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      handleNursingWardBindInjury(value);
      return;
    }
    setPayload({ ...payload, [name]: value });
  };

  const handleReactSelect = (name, e, secondName) => {
    if (secondName) {
      setPayload({ ...payload, [name]: e?.value, [secondName]: e?.label });
    } else {
      setPayload({ ...payload, [name]: e?.value });
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setPayload({ ...payload, [name]: selectedOptions });
  };

  const handleNursingWardBindNeedleName = async () => {
    try {
      const response = await Promise.all([await NursingWardBindNeedleName()]);

      const EmployeeData = reactSelectOptionList(
        response[0]?.data,
        "name",
        "employeeID"
      );

      setDropDownState({
        EmployeeName: EmployeeData,
      });
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardNeedleInjurySave = async () => {

    // debugger;
    try {
      const responsePayload =  handleNursingWardNeedleInjurySavePayload(payload);
      const response = await NursingWardNeedleInjurySave(responsePayload);
      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardBindInjury(intialState?.date);
      } else {
        notify("All Fields are Required", "error");
      }
    } catch (error) {
      notify("All Fields are Required", "error")
      console.log("Something Went Wrong");
    }
  };

  const handleInjuryDataBindFroMAPI = (data, dropdownData) => {
    const responseData = data.split("$");
    const returnData = dropdownData.filter((ele) =>
      responseData.includes(ele?.name)
    );
    return returnData;
  };

  const handleNursingWardBindInjury = async (date) => {
    try {
      const response = await NursingWardBindInjury({
        tid: payload?.tid,
        date: moment(date).format("DD-MMM-YYYY"),
      });

      if (response.data.length > 0) {
        const data = response?.data[0];
        const TypeAndAge = handleSpilt(data?.Age, " ");
        const setResponse = {
          sex: data?.Sex,
          injuryID: data?.ID,
          injury: handleInjuryDataBindFroMAPI(
            data?.NatureOfInjury,
            NATURE_OF_INJURY
          ), //function
          btnVal: "Update",
          pid: payload?.pid,
          tid: payload?.tid,
          nameId: data?.EmployeeID,
          name: data?.EmployeeName,
          date: new Date(data?.NeedleStickDate),
          time: parseTimeString(data?.NeedleStickTime),
          age: TypeAndAge[0], //function
          Type: TypeAndAge[1], //function
          ward: data?.Ward, //pass hogi props
          address: data?.Address,
          designation: data?.Designation,
          incidentDate: new Date(data?.DateofIncident),
          incidentTime: parseTimeString(data?.TimeofIncident),
          reportingDate: new Date(data?.DateofReporting),
          reportingTime: parseTimeString(data?.TimeofReporting),
          procedure: data?.Procedures,
          activities: data?.Activities,
          contamination: data?.Contamination,
          firstAid: data?.FirstAid,
          glovesWorn: data?.GlovesWorn,
          hepDate: new Date(data?.HEPB),
          tetanusDate: new Date(data?.Tetanus),
          sourceofPatient: data?.SourceOfPatient,
          antiHCV: data?.AntiHCV,
          hbsAg: data?.HbsAg,
        };
        setPayload(setResponse);
      } else {
        setPayload({ ...intialState, date: date });
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handlePrint = async() => {
    // OpenPDFURL(
    //   "NursingWardNeedleInjuryPrint",
    //   data?.transactionID,
    //   moment(payload?.date).format("DD-MMM-YYYY")
    // );
    let newPayload = {
      "date": moment(payload?.date).format("DD-MMM-YYYY"),
      "tid": data?.transactionID
    }
    let apiResp = await NursingWardNeedleInjuryPrintAPI(newPayload)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  };

  useEffect(() => {
    handleNursingWardBindNeedleName();
    handleNursingWardBindInjury(payload?.date);
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Needle Stick Injury Reporting Form")}
          isBreadcrumb={false}
        />
        <div className="p-2">
          <div className="row">
            <DatePicker
              className="custom-calendar"
              id="date"
              name="date"
              placeholder={VITE_DATE_FORMAT}
              lable={t("Date")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              showTime
              hourFormat="12"
              value={payload?.date}
              handleChange={handleChange}
            />
            <TimePicker
              placeholderName="Time"
              lable={t("Time")}
              id="time"
              name="time"
              respclass="col-xl-1 col-md-2 col-sm-2 col-12"
              value={payload?.time}
              handleChange={handleChange}
            />
          </div>

          <div className="row">
            <ReactSelect
              placeholderName={t(
                "Name"
              )}
              className="form-control"
              id={"nameId"}
              name="nameId"
              dynamicOptions={dropDownState?.EmployeeName}
              searchable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12 "
              requiredClassName={"required-fields"}
              value={payload?.nameId}
              handleChange={(name, e) => handleReactSelect(name, e, "name")}
            />
            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <div className="row">
                <Input
                  type="text"
                  className="form-control"
                  id="age"
                  name="age"
                  lable={t("Age")}
                  placeholder=""
                  respclass="col-6"
                  onChange={handleChange}
                  value={payload?.age}
                />

                <ReactSelect
                  placeholderName={t(
                    "Type"
                  )}
                  id="Type"
                  name="Type"
                  value={payload?.Type}
                  handleChange={handleReactSelect}
                  dynamicOptions={AGE_TYPE}
                  searchable={true}
                  respclass="col-6"
                  //tabIndex="-1"
                />
              </div>
            </div>

            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <LabeledInput label={t("Department/Ward"  )} value={payload?.ward} />
            </div>

            <ReactSelect
              placeholderName={t(
                "SEX"
              )}
              className="form-control"
              id={"sex"}
              searchable={true}
              name="sex"
              respclass="col-xl-1 col-md-2 col-sm-2 col-12"
              dynamicOptions={SEX_DROPDOWN}
              value={payload?.sex}
              handleChange={handleReactSelect}
            />

            <Input
              type="text"
              className="form-control"
              id="address"
              name="address"
              lable={t("Address")}
              placeholder=" "
              respclass="col-xl-3 col-md-4 col-sm-6 col-12"
              onChange={handleChange}
              value={payload?.address}
            />

            <Input
              type="text"
              className="form-control"
              id="designation"
              name="designation"
              lable={t(
                "Designation"
              )}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              value={payload?.designation}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-12">
          <div className="patient_registration card mt-2">
            <Heading
              title={t(
                "IncidentDetail"
              )}
              isBreadcrumb={false}
            />
            <div className="row p-2">
              <div className="col-md-6 col-12">
                <div className="row">
                  <div className="col-8">
                    <DatePicker
                      className="custom-calendar"
                      id="incidentDate"
                      name="incidentDate"
                      placeholder={VITE_DATE_FORMAT}
                      // placeholder={VITE_DATE_FORMAT}
                      lable={t("Date of Incident")}
                      showTime
                      hourFormat="12"
                      value={payload?.incidentDate}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-4">
                    <TimePicker
                      placeholderName="Time"
                      lable={t("Time of Incident")}
                      id="incidentTime"
                      name="incidentTime"
                      value={payload?.incidentTime}
                      handleChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <TextAreaInput
                      className="w-100"
                      placeholder=""
                      id={"procedure"}
                      lable={t("Procedure at the time of Incident")}
                      rows={3}
                      value={payload?.procedure}
                      name={"procedure"}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-12">
                <div className="row">
                  <div className="col-8">
                    <DatePicker
                      className="custom-calendar"
                      id="reportingDate"
                      name="reportingDate"
                      placeholder={VITE_DATE_FORMAT}
                      lable={t("Date of Reporting")}
                      showTime
                      hourFormat="12"
                      value={payload?.reportingDate}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-4">
                    <TimePicker
                      placeholderName="Time"
                      lable={t("Time of Reporting")}
                      id="reportingTime"
                      name="reportingTime"
                      value={payload?.reportingTime}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <TextAreaInput
                      className="w-100"
                      placeholder={""}
                      lable={t("Activities after Incident")}
                      id={"activities"}
                      rows={3}
                      value={payload?.activities}
                      name={"activities"}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <div className="patient_registration card mt-2">
            <Heading
              title={t(
                "RiskAssessmentTreatment"
              )}
              isBreadcrumb={false}
            />
            <div className="row p-2">
              <MultiSelectComp
                respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                name="injury"
                id="injury"
                placeholderName="Nature of Injury"
                dynamicOptions={NATURE_OF_INJURY}
                handleChange={handleMultiSelectChange}
                value={payload?.injury}
                requiredClassName={true}
                // value={payload?.injuryID}
                // dynamicOptions={GetEmployeeWiseCenter.map((item) => ({
                //   name: item.CentreName,
                //   code: item.CentreID,
                // }))}
                // handleChange={handleMultiSelectChange}
                // value={multiselectState.centreMulti.map((code) => ({
                //   code,
                //   name: GetEmployeeWiseCenter.find(
                //     (item) => item.CentreID === code
                //   )?.CentreName,
                // }))}
              />

              <ReactSelect
                placeholderName={t(
                  "TypeofContamination"
                )}
                className="form-control"
                id={"contamination"}
                name="contamination"
                searchable={true}
                dynamicOptions={TYPE_OF_CONTAMINATION}
                respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                value={payload?.contamination}
                handleChange={handleReactSelect}
              />

              <ReactSelect
                placeholderName={t(
                  "FirstAid"
                )}
                className="form-control"
                dynamicOptions={FIRST_AID_AND_GLOVES_WORN}
                id={"firstAid"}
                name="firstAid"
                searchable={true}
                respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                value={payload?.firstAid}
                handleChange={handleReactSelect}
              />

              <ReactSelect
                placeholderName={t(
                  "GlovesWorn"
                )}
                className="form-control"
                id={"glovesWorn"}
                name="glovesWorn"
                searchable={true}
                dynamicOptions={FIRST_AID_AND_GLOVES_WORN}
                respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                value={payload?.glovesWorn}
                handleChange={handleReactSelect}
              />
              <DatePicker
                className="custom-calendar"
                id="hepDate"
                name="hepDate"
                placeholder={VITE_DATE_FORMAT}
                respclass={"col-xl-4 col-md-4 col-sm-6 col-12"}
                lable={t(
                  "DateofLastHEPBCourse/Booster/AntiHBS"
                )}
                showTime
                hourFormat="12"
                value={payload?.hepDate}
                handleChange={handleChange}
              />

              <DatePicker
                className="custom-calendar"
                id="tetanusDate"
                name="tetanusDate"
                placeholder={VITE_DATE_FORMAT}
                respclass={"col-xl-4 col-md-4 col-sm-6 col-12"}
                lable={t(
                  "DateofLastLastTetanus"
                )}
                showTime
                hourFormat="12"
                value={payload?.tetanusDate}
                handleChange={handleChange}
              />

              <ReactSelect
                placeholderName={t(
                  "InformationRegardingSourceofPatient"
                )}
                className="form-control"
                dynamicOptions={INFORMATION_REGARDING_SOURCE_OF_PATIENT}
                id={"sourceofPatient"}
                name={"sourceofPatient"}
                searchable={true}
                respclass="col-xl-4 col-md-4 col-sm-6 col-12"
                value={payload?.sourceofPatient}
                handleChange={handleReactSelect}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="patient_registration card mt-1 p-1">
        <div className="text-right">
          <button
            className="btn btn-sm btn-primary mx-2"
            onClick={handleNursingWardNeedleInjurySave}
          >
            {t(payload?.btnVal)}
          </button>
          <button className="btn btn-sm btn-primary mx-2" onClick={handlePrint}>
           {t("Print")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedleStickInjuryReportingForm;
