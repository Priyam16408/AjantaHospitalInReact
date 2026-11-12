import React from "react";
import Heading from "../../UI/Heading";
import LabeledInput from "../../formComponent/LabeledInput";
import noImage from "../../../assets/image/avatar.gif"
import { useTranslation } from "react-i18next";

const EMGPersonalDetailsOfPatient = ({ data }) => {
  const {
    patientID,
    pName,
    roomName,
    dName,
    ageSex,
    admitDate,
    company_Name,
    ipdno,
    mobile,
    dischargeDate,
    type
  } = data;
  // console.log(data);


  const {t}=useTranslation()
  return (
    <div className="card patient_registration border">
      <Heading title={<label>{t("Patients Bill Details")}</label>} />
      <div className="p-2">
        <div className="row">
          <div className="col-sm-1">
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={noImage}
                className="emp-img"
                alt="Responsive image"
              />
            </div>
          </div>
          <div className="col-sm-11">
            <div className="row pb-1">

              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("PatientName")} value={data?.Name} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("AGE/GENDER")} value={data?.AgeSex} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Admit On")} value={data?.InDateTime} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("CurrentDoctor")} value={data?.Doctor} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("UHID")} value={data?.PatientID} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Panel")} value={data?.Panel} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Room No.")} value={data?.Room} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Discharge On")} value={""} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("DOB")} value={data?.DOB} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Dialysis No")} value={data?.EmergencyNo} />
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMGPersonalDetailsOfPatient;
