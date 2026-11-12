import React from "react";
import Heading from "../../../components/UI/Heading";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import { useTranslation } from "react-i18next";

const CenterDetails = ({ data }) => {
  const {
    CentreName,
    CentreCode,
    Address
  } = data;
  // console.log(data);


  const {t}=useTranslation()
  return (
    <div className="card patient_registration border">
      <Heading title={<label>{t("Center Details")}</label>} />
      <div className="p-2">
        <div className="row">
     
          <div className="col-sm-11">
            <div className="row pb-1">

              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Center Name")} value={CentreName} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Center Code")} value={CentreCode} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
                <LabeledInput label={t("Address")} value={Address} />
              </div>
            
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDetails;
