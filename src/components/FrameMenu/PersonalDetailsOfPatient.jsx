import React from "react";
import Heading from "../UI/Heading";
import LabeledInput from "../formComponent/LabeledInput";
import noImange from "../../assets/image/avatar.gif"

import { useTranslation } from "react-i18next";

const PersonalDetailsOfPatient = ({ data }) => {
    // const [t] = useTranslation();
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
    patientPhoto
  } = data;
  // console.log(data);
  const [t]=useTranslation()
  return (
    <div className="card patient_registration border">
      <Heading title={t("Patients Demographic Details")} />
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
                src={patientPhoto?patientPhoto:noImange}
                className="emp-img"
                alt="Responsive image"
              />
            </div>
          </div>
          <div className="col-sm-11">
            <div className="row pb-1">
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("IPD No")} value={ipdno} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("UHID")} value={patientID} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Patient Name")} value={pName} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Age/Gender")} value={ageSex} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Mobile No.")} value={mobile} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Panel")} value={company_Name} />
              </div>
            </div>
            <div className="row py-1">
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Room No.")} value={roomName} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Current Doctor")} value={dName} />
              </div>

              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Admit Date")} value={admitDate} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Discharge Date")} value={dischargeDate} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <LabeledInput label={t("Status")} value={dischargeDate} />
              </div>
              {/* <div className="col-xl-2 col-md-4 col-sm-6 col-12">
                <div className="d-flex justify-content-left">
                  <button className="btn btn-sm btn-success ml-3">
                    Vitals
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsOfPatient;
