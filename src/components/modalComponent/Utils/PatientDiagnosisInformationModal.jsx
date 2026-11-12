import React, { useState } from "react";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";

const PatientDiagnosisInformationModal = ({ handleSubmit,handleCancle }) => {
  const initialValues = {
    diagnosisCode: "",
    sectionId: "",
    section: "",
    subSectionCode: "",
    subSection: "",
    diagnosisDesc: "",
    diagnosis: "",
  };

  const [payload, setPayload] = useState({ ...initialValues });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const [t] = useTranslation();

  return (
    <div className="row">
      <Input
        type="text"
        className="form-control required-fields"
        id="sectionId"
        name="sectionId"
        lable={t("DischargeSummary.DischargeReport.SectionCode")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.sectionId}
        onChange={handleChange}
        // value={searchData?.pname}
        // onChange={searchHandleChange}
      />

      <Input
        type="text"
        className="form-control required-fields"
        id="section"
        name="section"
        lable={t("DischargeSummary.DischargeReport.SectionDesc")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.section}
        onChange={handleChange}
        // value={searchData?.pname}
        // onChange={searchHandleChange}
      />

      <Input
        type="text"
        className="form-control required-fields"
        id="subSectionCode"
        name="subSectionCode"
        lable={t("DischargeSummary.DischargeReport.SubSectionCode")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.subSectionCode}
        onChange={handleChange}
        // value={searchData?.pname}
        // onChange={searchHandleChange}
      />

      <Input
        type="text"
        className="form-control required-fields"
        id="subSection"
        name="subSection"
        lable={t("DischargeSummary.DischargeReport.SubSectionDesc")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.subSection}
        onChange={handleChange}
        // value={searchData?.pname}
        // onChange={searchHandleChange}
      />

      <Input
        type="text"
        className="form-control required-fields"
        id="diagnosisCode"
        name="diagnosisCode"
        lable={t("DischargeSummary.DischargeReport.ICDCode")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.diagnosisCode}
        onChange={handleChange}
        // onChange={searchHandleChange}
      />

      <Input
        type="text"
        className="form-control required-fields"
        id="diagnosisDesc"
        name="diagnosisDesc"
        lable={t("DischargeSummary.DischargeReport.ICDDesc")}
        placeholder=" "
        required={true}
        respclass="col-xl-4 col-md-4 col-sm-6 col-12"
        value={payload?.diagnosisDesc}
        onChange={handleChange}
        // value={searchData?.pname}
        // onChange={searchHandleChange}
      />

      {/* <div className="col-12 text-right">
        <input
          type="checkbox"
          id="isAddToPatient"
          name="isAddToPatient"
          checked={Boolean(payload?.isAddToPatient)}
          onChange={handleChange}
        />
        <label className="mx-2 m-0" htmlFor="isAddToPatient">
          {t("DischargeSummary.DischargeReport.ADDToPatient")}
        </label>
      </div> */}

      <div className="col-12 d-flex justify-content-end">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleSubmit(payload)}
        >
          Save
        </button>
        <button
          className="btn btn-sm btn-primary mx-2"
          style={{ backgroundColor: "red", border: 0 }}
          onClick={() => handleCancle()}

        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PatientDiagnosisInformationModal;
