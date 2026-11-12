import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../formComponent/ReactSelect";
import TextAreaInput from "../formComponent/TextAreaInput";
import Input from "../formComponent/Input";
import DatePicker from "../formComponent/DatePicker";
import {
  NursingWardBabyChartPrintAPI,
  NursingWardGetBabyCharDetails,
  NursingWardSaveBabyChart,
} from "../../networkServices/nursingWardAPI";
import {
  handleSetDataBabyChart,
  notify,
  NursingWardSaveBabyChartPayload,
} from "../../utils/utils";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";

const BLOODGROUP = [
  {
    label: "A+",
    value: "A+",
  },
  {
    label: "A-",
    value: "A-",
  },
  {
    label: "B+",
    value: "B+",
  },
  {
    label: "B-",
    value: "B-",
  },

  {
    label: "O+",
    value: "O+",
  },

  {
    label: "O-",
    value: "O-",
  },

  {
    label: "AB+",
    value: "AB+",
  },

  {
    label: "AB-",
    value: "AB-",
  },
];

const YESNODROPDOWN = [
  {
    label: "YES",
    value: "YES",
  },

  {
    label: "NO",
    value: "NO",
  },
];

const BabyChart = ({ data }) => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const { transactionID } = data;
  const intialState = {
    spine: "",
    membranesRuptured: "",
    transactionID: String(transactionID),
    bloodGroup: "",
    obstetricHistory: "",
    familyHistory: "",
    medicalHistory: "",
    lmp: "",
    eddByDate: new Date(),
    eddByScan: "",
    antenatalCare: "YES",
    bookingDate: new Date(),
    smokesPerDay: "",
    alcohol: "NO",
    durationOfLabourFirstStage: "",
    durationOfLabourSecondStage: "",
    durationOfLabourThirdStage: "",
    antenatalProblemsAndDrugs: "",
    amnio: "YES",
    result: "",
    antenalSteroids: "YES",
    placenta: "YES",
    deliveryMode: "",
    indication: "",
    length: "",
    ofc: "",
    gestationDate: new Date(),
    gestationScan: "",
    dubowitz: "",
    apgarScoreFirst: "",
    apgarScoreSecond: "",
    apgarScoreThird: "",
    colourFirst: "",
    colourSecond: "",
    colourThird: "",
    heartRateFirst: "",
    heartRateSecond: "",
    heartRateThird: "",
    respirationFirst: "",
    respirationSecond: "",
    respirationThird: "",
    toneFirst: "",
    toneSecond: "",
    toneThird: "",
    responseFirst: "",
    responseSecond: "",
    responseThird: "",
    totalFirst: "",
    totalSecond: "",
    totalThird: "",
    resuscitation: "",
    vitaminKGiven: "YES",
    date: new Date(),
    drExamining: "",
    headSuturesFontanelles: "",
    hips: "",
    eyes: "",
    genitalia: "",
    ears: "",
    testes: "",
    palate: "",
    neck: "",
    lowerLimbs: "",
    upperLimbs: "",
    skin: "",
    rsChest: "",
    tone: "",
    cvs: "",
    movement: "",
    abdomen: "",
    moro: "",
    femoralPulses: "",
    grasp: "",
    anus: "",
    suck: "",
    comments: "",
  };

  const [payload, setPayload] = useState({
    ...intialState,
  });

  const handleNursingWardGetBabyCharDetails = async (transactionID) => {
    try {
      const responseApi = await NursingWardGetBabyCharDetails(transactionID);

      if (responseApi?.data?.length > 0) {
        const modifiedData = handleSetDataBabyChart(responseApi?.data[0]);
        setPayload(modifiedData);
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardSaveBabyChart = async () => {
    try {
      const sendResponsePayload = NursingWardSaveBabyChartPayload(payload);
      const response = await NursingWardSaveBabyChart([sendResponsePayload]);
      if (response?.success) {
        notify(response?.message, "success");
        handleNursingWardGetBabyCharDetails(transactionID);
      } else {
        notify(response?.message, "message");
      }
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = (name, e) => {
    setPayload({
      ...payload,
      [name]: e.value,
    });
  };

  const handlePrint = async () => {
    let apiResp = await NursingWardBabyChartPrintAPI(data?.transactionID);
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  };

  console.log(payload);

  useEffect(() => {
    handleNursingWardGetBabyCharDetails(transactionID);
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Maternal details")}
            isBreadcrumb={false}
          />

          <div className="row p-2">
            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              placeholderName={t(
                "BloodGroup"
              )}
              name="bloodGroup"
              value={payload?.bloodGroup}
              requiredClassName={"required-fields"}
              id="bloodGroup"
              dynamicOptions={BLOODGROUP}
              handleChange={handleReactSelect}
            />

            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <TextAreaInput
                lable={t(
                  "ObstetricHistory"
                )}
                placeholder=""
                className="w-100 required-fields"
                id="obstetricHistory"
                name="obstetricHistory"
                value={payload?.obstetricHistory}
                maxLength={200}
                onChange={handleChange}
              />
            </div>

            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <TextAreaInput
                lable={t("Family history")}
                placeholder=""
                className="w-100"
                id={"familyHistory"}
                name="familyHistory"
                value={payload?.familyHistory}
                maxLength={200}
                onChange={handleChange}
              />
            </div>

            <div className="col-xl-2 col-md-3 col-sm-4 col-12">
              <TextAreaInput
                lable={t(
                  "Medical history"
                )}
                placeholder=""
                className="w-100"
                name="medicalHistory"
                id="medicalHistory"
                value={payload?.medicalHistory}
                maxLength={200}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="patient_registration card">
          <Heading
            title={t("This pregnancy Details")}
            isBreadcrumb={false}
          />

          <div className="row p-2">
            <Input
              type="text"
              className="form-control"
              lable={t("LMP")}
              placeholder=""
              name="lmp"
              id="lmp"
              value={payload?.lmp}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("EDDByDate")}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              name="eddByDate"
              id="eddByDate"
              value={payload?.eddByDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="eddByScan"
              name="eddByScan"
              value={payload?.eddByScan}
              lable={t("EDDByScan")}
              placeholder=""
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              id="antenatalCare"
              name="antenatalCare"
              value={payload?.antenatalCare}
              placeholderName={t(
                "AntenatalCare"
              )}
              removeIsClearable={true}
              dynamicOptions={YESNODROPDOWN}
              handleChange={handleReactSelect}
            />

            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              id={"bookingDate"}
              name={"bookingDate"}
              value={payload?.bookingDate}
              lable={t(
                "Bookingdate"
              )}
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              // id="smokesPerDay"
              name="smokesPerDay"
              lable={t(
                "Smokes(PerDay)"
              )}
              // placeholder="Smokes(PerDay)"
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              value={payload?.smokesPerDay}
              onChange={handleChange}
            />

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-3 col-12"}
              id="alcohol"
              name="alcohol"
              value={payload?.alcohol}
              placeholderName={t(
                "Alcohol"
              )}
              removeIsClearable={true}
              dynamicOptions={YESNODROPDOWN}
              handleChange={handleReactSelect}
            />

            <div className="col-xl-6 col-md-6 col-sm-6 col-12">
              <div
                className="pt-3 pb-2 pr-2 pl-2 form-group"
                style={{
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  position: "relative",
                }}
              >
                <label className="label" style={{ position: "absolute" }}>
                  {t(
                    "DurationOfLabour"
                  )}
                </label>
                <div className="row">
                  <Input
                    type="text"
                    className="form-control"
                    id="durationOfLabourFirstStage"
                    name="durationOfLabourFirstStage"
                    value={payload?.durationOfLabourFirstStage}
                    lable={t(
                      "1stStage"
                    )}
                    placeholder={t(
                      ""
                    )}
                    respclass="col-4"
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="durationOfLabourSecondStage"
                    name="durationOfLabourSecondStage"
                    value={payload?.durationOfLabourSecondStage}
                    lable={t(
                      "2ndStage"
                    )}
                    placeholder={t(
                      ""
                    )}
                    respclass="col-4"
                    onChange={handleChange}
                  />
                  <Input
                    type="text"
                    className="form-control"
                    id="durationOfLabourThirdStage"
                    name="durationOfLabourThirdStage"
                    value={payload?.durationOfLabourThirdStage}
                    lable={t(
                      "3rdStage"
                    )}
                    placeholder={t(
                      ""
                    )}
                    respclass="col-4"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-3 col-sm-3 col-12">
              <TextAreaInput
                lable={t(
                  "Antenatal Problems & Drugs"
                )}
                placeholder=""
                className="w-100"
                id="antenatalProblemsAndDrugs"
                name="antenatalProblemsAndDrugs"
                value={payload?.antenatalProblemsAndDrugs}
                rows={2}
                maxLength={200}
                onChange={handleChange}
              />
            </div>

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              placeholderName={t(
                "Amnio"
              )}
              id="amnio"
              name="amnio"
              value={payload?.amnio}
              dynamicOptions={YESNODROPDOWN}
              removeIsClearable={true}
              handleChange={handleReactSelect}
            />

            <Input
              type="text"
              className="form-control"
              id="result"
              name="result"
              value={payload?.result}
              lable={t("Result")}
              placeholder={t(
                ""
              )}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              placeholderName={t(
                "Antenal Steroids"
              )}
              name={"antenalSteroids"}
              id="antenalSteroids"
              value={payload?.antenalSteroids}
              dynamicOptions={YESNODROPDOWN}
              removeIsClearable={true}
              handleChange={handleReactSelect}
            />

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              placeholderName={t(
                "MembranesRuptured"
              )}
              name="membranesRuptured"
              id="membranesRuptured"
              value={payload?.membranesRuptured}
              removeIsClearable={true}
              dynamicOptions={YESNODROPDOWN}
              handleChange={handleReactSelect}
            />

            <ReactSelect
              respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
              placeholderName={t(
                "Placenta"
              )}
              name="placenta"
              id="placenta"
              value={payload?.placenta}
              dynamicOptions={YESNODROPDOWN}
              removeIsClearable={true}
              handleChange={handleReactSelect}
            />

            <Input
              type="text"
              className="form-control"
              id="deliveryMode"
              name="deliveryMode"
              value={payload?.deliveryMode}
              lable={t(
                "DeliveryMode"
              )}
              placeholder={t(
                ""
              )}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control"
              id="indication"
              name="indication"
              value={payload?.indication}
              lable={t("Indication")}
              placeholder={t(
                ""
              )}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading
              title={t("Infant Details")}
              isBreadcrumb={false}
            />

            <div className="row p-2">
              <Input
                type="text"
                className="form-control"
                id="length"
                name="length"
                lable={t("Length")}
                placeholder={t("Length")}
                value={payload?.length}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="ofc"
                name="ofc"
                lable={t("OFC")}
                placeholder={t("OFC")}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                value={payload?.ofc}
                onChange={handleChange}
              />

              <DatePicker
                className="custom-calendar"
                id="gestationDate"
                name="gestationDate"
                value={payload?.gestationDate}
                placeholder={VITE_DATE_FORMAT}
                lable={t("GestationDate")}
                respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
                showTime
                hourFormat="12"
                handleChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="gestationScan"
                name="gestationScan"
                value={payload?.gestationScan}
                lable={t("GestationScan")}
                placeholder={t(
                  "GestationScan"
                )}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="dubowitz"
                name="dubowitz"
                lable={t("Dubowitz")}
                placeholder={t("Dubowitz")}
                value={payload?.dubowitz}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("ApgarScore(min)")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="apgarScoreFirst"
                      name="apgarScoreFirst"
                      value={payload?.apgarScoreFirst}
                      lable={t(
                        "ApgarScore(min)1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="apgarScoreSecond"
                      name="apgarScoreSecond"
                      value={payload?.apgarScoreSecond}
                      lable={t(
                        "ApgarScore(min)2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="apgarScoreThird"
                      name="apgarScoreThird"
                      value={payload?.apgarScoreThird}
                      lable={t(
                        "ApgarScore(min)3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Colour")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="colourFirst"
                      name="colourFirst"
                      value={payload?.colourFirst}
                      lable={t(
                        "Colour1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="colourSecond"
                      name="colourSecond"
                      value={payload?.colourSecond}
                      lable={t(
                        "Colour2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="colourThird"
                      name="colourThird"
                      value={payload?.colourThird}
                      lable={t(
                        "Colour3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Heartrate")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="heartRateFirst"
                      name="heartRateFirst"
                      value={payload?.heartRateFirst}
                      lable={t(
                        "Heartrate1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="heartRateSecond"
                      name="heartRateSecond"
                      value={payload?.heartRateSecond}
                      lable={t(
                        "Heartrate2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="heartRateThird"
                      name="heartRateThird"
                      value={payload?.heartRateThird}
                      lable={t(
                        "Heartrate3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Respiration")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="respirationFirst"
                      name="respirationFirst"
                      value={payload?.respirationFirst}
                      lable={t(
                        "Respiration1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="respirationSecond"
                      name="respirationSecond"
                      value={payload?.respirationSecond}
                      lable={t(
                        "Respiration2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="respirationThird"
                      name="respirationThird"
                      value={payload?.respirationThird}
                      lable={t(
                        "Respiration3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Tone")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="toneFirst"
                      name="toneFirst"
                      value={payload?.toneFirst}
                      lable={t(
                        "Tone1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="toneSecond"
                      name="toneSecond"
                      value={payload?.toneSecond}
                      lable={t(
                        "Tone2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="toneThird"
                      name="toneThird"
                      value={payload?.toneThird}
                      lable={t(
                        "Tone3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Response")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="responseFirst"
                      name="responseFirst"
                      value={payload?.responseFirst}
                      lable={t(
                        "Response1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="responseSecond"
                      name="responseSecond"
                      value={payload?.responseSecond}
                      lable={t(
                        "Response2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="responseThird"
                      name="responseThird"
                      value={payload?.responseThird}
                      lable={t(
                        "Response3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-md-6 col-sm-6 col-12 ">
                <div
                  className="pt-3 pb-2 pr-2 pl-2 form-group"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <label className="label" style={{ position: "absolute" }}>
                    {t("Total")}
                  </label>
                  <div className="row">
                    <Input
                      type="text"
                      className="form-control"
                      id="totalFirst"
                      name="totalFirst"
                      value={payload?.totalFirst}
                      lable={t(
                        "Total1stStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="totalSecond"
                      name="totalSecond"
                      value={payload?.totalSecond}
                      lable={t(
                        "Total2ndStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />

                    <Input
                      type="text"
                      className="form-control"
                      id="totalThird"
                      name="totalThird"
                      value={payload?.totalThird}
                      lable={t(
                        "Total3rdStage"
                      )}
                      placeholder=""
                      respclass="col-4"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Input
                type="text"
                className="form-control"
                id="resuscitation"
                name="resuscitation"
                value={payload?.resuscitation}
                lable={t("Resuscitation")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <ReactSelect
                placeholderName={t(
                  "VitaminKgiven"
                )}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                id={"vitaminKGiven"}
                name="vitaminKGiven"
                value={payload?.vitaminKGiven}
                removeIsClearable={true}
                dynamicOptions={YESNODROPDOWN}
                handleChange={handleReactSelect}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 spatient_registration_card">
          <div className="patient_registration card">
            <Heading
              title={t("Examination")}
              isBreadcrumb={false}
            />

            <div className="row p-2">
              <DatePicker
                id="date"
                className={"w-100"}
                name="date"
                placeholder={VITE_DATE_FORMAT}
                value={payload?.date}
                lable={t("Date")}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                handleChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="drExamining"
                name="drExamining"
                value={payload?.drExamining}
                lable={t("Drexamining")}
                placeholder=" "
                onChange={handleChange}
                // value={payload?.directTest}
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              // onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="headSuturesFontanelles"
                name="headSuturesFontanelles"
                value={payload?.headSuturesFontanelles}
                lable={t(
                  "Head/sutures/fontanelles"
                )}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="hips"
                name="hips"
                value={payload?.hips}
                lable={t("Hips")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="eyes"
                name="eyes"
                value={payload?.eyes}
                lable={t("Eyes")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="genitalia"
                name="genitalia"
                value={payload?.genitalia}
                lable={t("Genitalia")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="ears"
                name="ears"
                value={payload?.ears}
                lable={t("Ears")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="testes"
                name="testes"
                value={payload?.testes}
                lable={t("Testes")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="palate"
                name="palate"
                value={payload?.palate}
                lable={t("Palate")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="spine"
                name="spine"
                value={payload?.spine}
                lable={t("Spine")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="neck"
                name="neck"
                value={payload?.neck}
                lable={t("Neck")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="lowerLimbs"
                name="lowerLimbs"
                value={payload?.lowerLimbs}
                lable={t("Lowerlimbs")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="upperLimbs"
                name="upperLimbs"
                value={payload?.upperLimbs}
                lable={t("Upperlimbs")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />
              <Input
                type="text"
                className="form-control"
                id="skin"
                name="skin"
                value={payload?.skin}
                lable={t("Skin")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="rsChest"
                name="rsChest"
                value={payload?.rsChest}
                lable={t("RS/chest")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="tone"
                name="tone"
                value={payload?.tone}
                lable={t("Tone")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="cvs"
                name="cvs"
                value={payload?.cvs}
                lable={t("CVS")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="movement"
                name="movement"
                value={payload?.movement}
                lable={t("Movement")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="abdomen"
                name="abdomen"
                value={payload?.abdomen}
                lable={t("Abdomen")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="moro"
                name="moro"
                value={payload?.moro}
                lable={t("Moro")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="femoralPulses"
                name="femoralPulses"
                value={payload?.femoralPulses}
                lable={t("Femoralpulses")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="grasp"
                name="grasp"
                value={payload?.grasp}
                lable={t("Grasp")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="anus"
                name="anus"
                value={payload?.anus}
                lable={t("Anus")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="suck"
                name="suck"
                value={payload?.suck}
                lable={t("Suck")}
                placeholder=" "
                respclass="col-xl-2 col-md-3 col-sm-4 col-12"
                onChange={handleChange}
              />

              <Input
                type="text"
                className="form-control"
                id="comments"
                name="comments"
                value={payload?.comments}
                lable={t("Comments")}
                placeholder=" "
                respclass="col-xl-8 col-md-9 col-sm-8 col-12"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-dyamic-component">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleNursingWardSaveBabyChart}
        >
          {t("Save")}
        </button>

        <button className="btn btn-sm btn-primary mx-2" onClick={handlePrint}>
          {t("Print")}
        </button>
      </div>
    </>
  );
};

export default BabyChart;
