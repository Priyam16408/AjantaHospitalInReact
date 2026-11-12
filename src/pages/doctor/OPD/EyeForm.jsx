import { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { DoctorSaveEyeForm, GetAllEyeFramePrintReport, GetOldAppointentData } from "../../../networkServices/DoctorApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReactSelect from "../../../components/formComponent/ReactSelect";


export default function DetailedEyeExamForm({ patientDetail }) {

  const [t] = useTranslation();
  const formIntialValue = {
    VisualAcuityReye: "",
    VisualAcuityLeye: "",
    VisualUnaidedReye: "",
    VisualUnaidedLeye: "",
    VisualPinholeReye: "",
    VisualPinholeLeye: "",
    VisualColourVisionReye: "",
    VisualColourVisionLeye: "",
    VisualLidsAndAdenexaReye: "",
    VisualLidsAndAdenexaLeye: "",
    VisualOcularMovementsReye: "",
    VisualOcularMovementsLeye: "",
    VisualAnteriorSegmentReye: "",
    VisualAnteriorSegmentLeye: "",
    PosteriorDiscReye: "",
    PosteriorDiscLeye: "",
    PosteriorVesselsReye: "",
    PosteriorVesselsLeye: "",
    PosteriorMaculaReye: "",
    PosteriorMaculaLeye: "",
    IntraocularNCTReye: "",
    IntraocularNCTLeye: "",
    IntraocularATReye: "",
    IntraocularATLeye: "",
    IntraocularSchoitzReye: "",
    IntraocularSchoitzLeye: "",
    IntraocularKeratometryReye: "",
    IntraocularKeratometryLeye: "",
    ScanAxialLengthReye1: "",
    ScanAxialLengthLeye1: "",
    ScanConstantReye1: "",
    ScanConstantLeye1: "",
    ScanIOLPowerReye1: "",
    ScanIOLPowerLeye1: "",
    // ScanAxialLengthReye2: "",
    // ScanAxialLengthLeye2: "",
    ScanConstantReye2: "",
    ScanConstantLeye2: "",
    ScanIOLPowerReye2: "",
    ScanIOLPowerLeye2: "",
    ScanConstantReye3: "",
    ScanConstantLeye3: "",
    ScanIOLPowerReye3: "",
    ScanIOLPowerLeye3: "",
    ExaminationAnteriorReye: "",
    ExaminationAnteriorLeye: "",
    RefractionDistanceSphReye: "",
    RefractionDistanceSphLeye: "",
    RefractionDistanceCylReye: "",
    RefractionDistanceCylLeye: "",
    RefractionDistanceAxisReye: "",
    RefractionDistanceAxisLeye: "",
    RefractionDistanceVisionReye: "",
    RefractionDistanceVisionLeye: "",
    RefractionNearVisionReye: "",
    RefractionNearVisionLeye: "",
    RefractionNearReye: "",
    RefractionNearLeye: "",
  };
  const [formData, setFormData] = useState(formIntialValue);
  const [oldPrescription, SetOldPrescription] = useState([])
  const [values, SetValues] = useState({});



  const handleSubmit = async (e) => {
    e.preventDefault();

    const { PatientID, TransactionID } = patientDetail?.currentPatient;

    let payload = {
      patientID: PatientID,
      transactionID: TransactionID,
      valueDetails: Object.keys(formData).map((item) => {
        return {
          keyName: item,
          value: formData[item],
        };
      }),
    };

    console.log("Form Data to Submit:------", payload);

    try {
      const response = await DoctorSaveEyeForm(payload);
      // console.log(response,"🎁🎁Form submitted successfully");
      notify(response.message, "success");
      // setFormData(formIntialValue);
    } catch (error) {
      console.error("Error submitting form:", error);
      notify(response.message, "error");
    }
  };

  const fetchEyeForm = async (PateientId, transactionID) => {
    try {

      const res = await GetAllEyeFramePrintReport(PateientId, transactionID)

      if (res?.success && Array.isArray(res?.data)) {
        const updatedFormData = res.data.reduce((acc, curr) => {
          const key = curr.keyName?.trim(); // Corrected key casing
          const value = curr.value;

          if (key && formIntialValue.hasOwnProperty(key)) {
            acc[key] = value;
          }
          return acc;
        }, { ...formIntialValue });

        setFormData(updatedFormData);
      } else {
        notify(res.message, "error")
        setFormData(formIntialValue)
      }

    } catch (error) {
      console.error("Error fetching eye form:", error);
    }
  };


  const fetchPrescriptionAdvice = async () => {
    try {
      const res = await GetOldAppointentData({
        patientID: patientDetail?.PatientID,
        transactionID: patientDetail?.TransactionID,
        appID: patientDetail?.App_ID,
        Type: "opd",
      });
      SetOldPrescription(res.data)

      // setApiData((prev) => ({ ...prev, getOldAppointentDataAPI: res.data }));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchPrescriptionAdvice()
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleReactSelect = (name, value) => {
    SetValues((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    const valueField = values?.oldPrescription?.valueField;
    if (!valueField) return;
    const parts = valueField?.split("#");
    const payload = {
      patientId: parts[3],       // AM25-01210001
      transactionID: parts[1]    // 1844
    };
    fetchEyeForm(payload.patientId, payload.transactionID)

  }, [values.oldPrescription])


  const handleFormatlabel = (name, label, rest) => {
    console.log(rest);
    const ColorCode = rest.isCurrent === 1;
    return (
      <div
        style={{
          color: ColorCode ? 'red' : '',
          // color: "#fff",
          margin: "-8px -12px", // Adjust this to match the parent's padding
          padding: "8px 12px", // Add your own padding if needed inside the label
          boxSizing: "border-box",
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <>
      <ReactSelect
        placeholderName={t("Select Old Prescription")}
        id="oldPrescription"
        inputId="oldPrescription"
        removeIsClearable={true}
        dynamicOptions={[
          ...handleReactSelectDropDownOptions(
            oldPrescription,
            "textField",
            "valueField",
          )
        ]}
        name="oldPrescription"
        value={values?.oldPrescription}
        handleChange={handleReactSelect}
        searchable={true}
        respclass="col-xl-4 col-md-6 col-sm-6 col-sm-4 col-12"
        DropdownIndicator={true}
        handleFormatlabel={handleFormatlabel}
      />
      <div className="container-fluid bg-light py-4">
        <form className="bg-white shadow-sm rounded " onSubmit={handleSubmit}>
          {/* Visual Acuity Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-2">
                  <Heading title={`${t("Visual Acuity")} :`} />
                </div>
                <div className="col-5">
                  <Heading title={`${t("Right Eye ")}:`} />
                </div>
                <div className="col-5">
                  <Heading title={`${t("Left Eye ")}:`} />
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">{`${t("Aided")}`}:</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name={"VisualAcuityReye"}
                    value={formData?.VisualAcuityReye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    className="form-control form-control-lg"
                    name={"VisualAcuityLeye"}
                    value={formData.VisualAcuityLeye}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Unaided :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name={"VisualUnaidedReye"}
                    value={formData.VisualUnaidedReye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name={"VisualUnaidedLeye"}
                    value={formData.VisualUnaidedLeye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Pinhole :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="VisualPinholeReye"
                    value={formData.VisualPinholeReye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="VisualPinholeLeye"
                    value={formData.VisualPinholeLeye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Colour Vision :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="VisualColourVisionReye"
                    value={formData.VisualColourVisionReye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="VisualColourVisionLeye"
                    value={formData.VisualColourVisionLeye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Lids and Adenexa :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="VisualLidsAndAdenexaReye"
                    value={formData.VisualLidsAndAdenexaReye}
                    className="form-control form-control-lg"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    className="form-control form-control-lg"
                    name="VisualLidsAndAdenexaLeye"
                    value={formData.VisualLidsAndAdenexaLeye}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Ocular Movements :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    className="form-control form-control-lg"
                    name="VisualOcularMovementsReye"
                    value={formData.VisualOcularMovementsReye}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    className="form-control form-control-lg"
                    name="VisualOcularMovementsLeye"
                    value={formData.VisualOcularMovementsLeye}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Anterior Segment */}
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Anterior Segment :</label>
                </div>
                <div className="col-5">
                  <textarea
                    name="VisualAnteriorSegmentReye"
                    value={formData.VisualAnteriorSegmentReye}
                    className="form-control-lg"
                    rows="2"
                    style={{ width: "100%", height: "100px" }}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <textarea
                    name="VisualAnteriorSegmentLeye"
                    value={formData.VisualAnteriorSegmentLeye}
                    className="form-control-lg"
                    rows="10"
                    style={{ width: "100%", height: "100px" }}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Posterior Pole Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-2">
                  <Heading title={t("Posterior Pole :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Right Eye :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Left Eye :")} />
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Disc :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorDiscReye"
                    value={formData.PosteriorDiscReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorDiscLeye"
                    value={formData.PosteriorDiscLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Vessels :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorVesselsReye"
                    value={formData.PosteriorVesselsReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorVesselsLeye"
                    value={formData.PosteriorVesselsLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Macula :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorMaculaReye"
                    value={formData.PosteriorMaculaReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="PosteriorMaculaLeye"
                    value={formData.PosteriorMaculaLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Intraocular Pressure Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-2">
                  <Heading title={t("Intraocular Pressure :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Right Eye :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Left Eye :")} />
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">NCT :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularNCTReye"
                    value={formData.IntraocularNCTReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularNCTLeye"
                    value={formData.IntraocularNCTLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">AT :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularATReye"
                    value={formData.IntraocularATReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularATLeye"
                    value={formData.IntraocularATLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Schiotz :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularSchoitzReye"
                    value={formData.IntraocularSchoitzReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularSchoitzLeye"
                    value={formData.IntraocularSchoitzLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Keratometry :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularKeratometryReye"
                    value={formData.IntraocularKeratometryReye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="IntraocularKeratometryLeye"
                    value={formData.IntraocularKeratometryLeye}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* A-SCAN Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-2">
                  <Heading title={t("A-SCAN :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Right Eye :")} />
                </div>
                <div className="col-5">
                  <Heading title={t("Left Eye :")} />
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Axial Length :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanAxialLengthReye1"
                    value={formData.ScanAxialLengthReye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanAxialLengthLeye1"
                    value={formData.ScanAxialLengthLeye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">A Constant :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantReye1"
                    value={formData.ScanConstantReye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantLeye1"
                    value={formData.ScanConstantLeye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">IOL Power :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerReye1"
                    value={formData.ScanIOLPowerReye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerLeye1"
                    value={formData.ScanIOLPowerLeye1}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* <div className="row mb-2">
              <div className="col-2">
                <label className="form-label">Axial Length :</label>
              </div>
              <div className="col-5">
                <Input
                  type="text"
                  name="ScanAxialLengthReye2"
                  value={formData.ScanAxialLengthReye2}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="col-5">
                <Input
                  type="text"
                  name="ScanAxialLengthLeye2"
                  value={formData.ScanAxialLengthLeye2}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                />
              </div>
            </div> */}

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">A Constant :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantReye2"
                    value={formData.ScanConstantReye2}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantLeye2"
                    value={formData.ScanConstantLeye2}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">IOL Power :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerReye2"
                    value={formData.ScanIOLPowerReye2}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerLeye2"
                    value={formData.ScanIOLPowerLeye2}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">A Constant :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantReye3"
                    value={formData.ScanConstantReye3}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanConstantLeye3"
                    value={formData.ScanConstantLeye3}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">IOL Power :</label>
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerReye3"
                    value={formData.ScanIOLPowerReye3}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-5">
                  <Input
                    type="text"
                    name="ScanIOLPowerLeye3"
                    value={formData.ScanIOLPowerLeye3}
                    className="form-control form-control-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EXAMINATION MYDRESIS : */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row ">
                <div className="col-2">
                  <Heading title={t("Examination Mydresis :")} />{" "}
                </div>
                <div className="col-5">
                  <Heading title={t("Right Eye :")} />{" "}
                </div>
                <div className="col-5">
                  <Heading title={t("Left Eye :")} />{" "}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-2">
                  <label className="form-label">Anterior Segment :</label>
                </div>
                <div className="col-5">
                  <textarea
                    className="form-control-lg"
                    name="ExaminationAnteriorReye"
                    value={formData.ExaminationAnteriorReye}
                    onChange={handleChange}
                    rows="2"
                    style={{ width: "100%", height: "100px" }}
                  />
                </div>
                <div className="col-5">
                  <textarea
                    name="ExaminationAnteriorLeye"
                    value={formData.ExaminationAnteriorLeye}
                    className="form-control-lg"
                    onChange={handleChange}
                    rows="2"
                    style={{ width: "100%", height: "100px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Refraction Section */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-2">
                  <Heading title={t("Refraction Section :")} />{" "}
                </div>
                <div className="col-5">
                  <Heading title={t("Right Eye :")} />{" "}
                </div>
                <div className="col-5">
                  <Heading title={t("Left Eye :")} />{" "}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-2">
                  <label className="form-label">Distance :</label>
                </div>
                <div className="col-5">
                  <div className="row g-2">
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Sph."
                        className="form-control form-control-sm"
                        name="RefractionDistanceSphReye"
                        value={formData.RefractionDistanceSphReye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Cyl."
                        className="form-control form-control-sm"
                        name="RefractionDistanceCylReye"
                        value={formData.RefractionDistanceCylReye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Axis"
                        className="form-control form-control-sm"
                        name="RefractionDistanceAxisReye"
                        value={formData.RefractionDistanceAxisReye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Vision"
                        className="form-control form-control-sm"
                        name="RefractionDistanceVisionReye"
                        value={formData.RefractionDistanceVisionReye}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="row g-2">
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Sph."
                        className="form-control form-control-sm"
                        name="RefractionDistanceSphLeye"
                        value={formData.RefractionDistanceSphLeye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Cyl."
                        className="form-control form-control-sm"
                        name="RefractionDistanceCylLeye"
                        value={formData.RefractionDistanceCylLeye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Axis"
                        className="form-control form-control-sm"
                        name="RefractionDistanceAxisLeye"
                        value={formData.RefractionDistanceAxisLeye}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        type="text"
                        placeholder="Vision"
                        className="form-control form-control-sm"
                        name="RefractionDistanceVisionLeye"
                        value={formData.RefractionDistanceVisionLeye}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-2">
                  <label className="form-label">Near :</label>
                </div>
                <div className="col-5">
                  <div className="row g-2">
                    <div className="col-9">
                      <Input
                        type="text"
                        // placeholder="Sph."
                        className="form-control form-control-sm"
                        name="RefractionNearReye"
                        value={formData.RefractionNearReye}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-3">
                      <Input
                        type="text"
                        // placeholder="Vision"
                        className="form-control form-control-sm"
                        name="RefractionNearVisionReye"
                        value={formData.RefractionNearVisionReye}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="row g-2">
                    <div className="col-9">
                      <Input
                        type="text"
                        // placeholder="Sph."
                        className="form-control form-control-sm"
                        name="RefractionNearLeye"
                        value={formData.RefractionNearLeye}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-3">
                      <Input
                        type="text"
                        // placeholder="Vision"
                        className="form-control form-control-sm"
                        name="RefractionNearVisionLeye"
                        value={formData.RefractionNearVisionLeye}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center py-3 gap-2">
            {/* <button type="button" className="btn btn-secondary">
            Cancel
          </button> */}
            {values?.oldPrescription?.isCurrent === 1 &&
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {t("Save")}
              </button>
            }
          </div>
        </form>

      </div>
    </>
  );
}
