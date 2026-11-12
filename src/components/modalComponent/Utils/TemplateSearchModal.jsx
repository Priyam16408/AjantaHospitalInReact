import React, { useEffect, useState } from "react";
import Input from "../../formComponent/Input";
import { useTranslation } from "react-i18next";
import Heading from "../../UI/Heading";
import LabeledInput from "../../formComponent/LabeledInput";
import PrescribedMedicineTable from "../../UI/customTable/doctorTable/ViewConsultationtable/PrescribedMedicineTable";
import { PRESCRIBED_MEDICINE } from "../../../utils/constant";
import SavePrescribedMedicineTable from "../../UI/customTable/doctorTable/ViewConsultationtable/SavePrescribedMedicineTable";

const TemplateSearchModal = (props) => {
  const {
    prescription,
    saveTemplate,
    saveTemplateHandleChange,
    tags,
    setTags,
    tags1,
    setTags1,
    tempDetails,
    DoctorID,
  } = props;
  // const { prescription, saveTemplate, saveTemplateHandleChange, tempDetails } =
  //   props;

  const [t] = useTranslation();
  // const [tags, setTags] = useState({
  //   "Prescribed Medicine": [PRESCRIBED_MEDICINE],
  // });
  console.log(
    "prescriptionprescriptionprescription",
    prescription,
    saveTemplate
  );

  return (
    <>
      <div className="row">
        <div className="col-xl-12 col-md-12 col-sm-12 col-12  mb-2">
          <LabeledInput
            label={"Accordion Name"}
            value={prescription?.AccordianName || prescription?.DisplayName}
          />
        </div>

        <Input
          type="text"
          className="form-control"
          id="template Name"
          name={"templateName"}
          onChange={saveTemplateHandleChange}
          value={
            saveTemplate.templateName
            // ||saveTemplate.valueField.substring(0, 20) ||
            // ||prescription?.templateData?.TemplateName
          }
          lable={t("Template Name")}
          placeholder=" "
          respclass="col-xl-12 col-md-12 col-sm-12 col-12 "
          // disabled={prescription?.isEdit === true ? true : false}
        />
        <div className="col-12">
          {prescription?.AccordianName === "Prescribed Medicine" ? (
            <SavePrescribedMedicineTable
              DoctorID={DoctorID}
              tags={tags1}
              setTags={setTags1}
              type={"FromModal"}
            />
          ) : (
            <textarea
              className="w-100"
              rows={5}
              placeholder="template"
              name="valueField"
              value={
                saveTemplate.valueField
                // ||prescription?.templateData?.ValueField
              }
              onChange={saveTemplateHandleChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TemplateSearchModal;
