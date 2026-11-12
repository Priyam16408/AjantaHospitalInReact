import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import noImange from "../../../assets/image/avatar.gif";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { CPOEBindVitals } from "../../../networkServices/OT/otAPI";
import { notify } from "../../../utils/ustil2";

const CentreDetails = ({ data }) => {
  console.log("data ", data);
  const [t] = useTranslation();

  const [values, setValue] = useState("");

  const pateintVitalData = async () => {
    const TransactionID = data?.TransactionID;

    const response = await CPOEBindVitals(TransactionID);
    if (response?.success) {
      setValue(response?.data);
    } else {
      // notify(response?.message, "error");
    }
  };

  useEffect(() => {
    pateintVitalData();
  }, []);

  return (
    <div>
      <div className="card patient_registration border">
        {/* <Heading title={t("Patients Details")} /> */}
        <div className="px-2 pt-1">
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
                  src={noImange}
                  className="emp-img"
                  alt="Responsive image"
                />
              </div>
            </div>
            <div className="col-sm-11">
              <div className="row ">
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("UHID")} value={data?.PatientID} />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("Patient Name")} value={data?.PName} />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("Age/Gender")} value={data?.AgeSex} />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput
                    label={t("Surg. Date Time")}
                    value={data?.SurgeryDate + " " + data?.SurgeryTiming}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput
                    label={t("Surgery Name")}
                    value={data?.SurgeryName}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("OT Name")} value={data?.OTName} />
                </div>
              </div>
              <div className="row ">
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 ">
                  <LabeledInput
                    label={t("OT Booking No.")}
                    value={data?.OTNumber}
                  />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("IPD No")} value={data?.IPDNo} />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("Temp.")} value={values?.Temp} />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("Pulse")} value={values?.Pulse} />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("B/P")} value={values?.bp} />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput
                    label={t("Blood Sugar")}
                    value={values?.BloodSugar}
                  />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("Resp.")} value={values?.Resp} />
                </div>
                <div className="col-xl-1 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("SPO2")} value={values?.SPO2} />
                </div>
                <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                  <LabeledInput label={t("By Dr.")} value={data?.DoctorName} />
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
    </div>
  );
};

export default CentreDetails;
