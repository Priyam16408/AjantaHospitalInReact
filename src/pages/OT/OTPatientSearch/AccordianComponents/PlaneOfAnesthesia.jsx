import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const PlaneOfAnesthesia = ({ data }) => {
  const [t] = useTranslation()
  return (


    <div className="row p-2">
      <div className="col-12 mb-2">
        <div className="col-12 mb-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="anesthesia-planned"
              name="anesthesia-planned"
            />
            <label
              className="form-check-label ml-2"
              htmlFor="anesthesia-planned"
            >
              {t(
                "ANESTHESIA PLAN,ALTERNATIVES,RISKS,BENEFITS DISCUSSED WITH THE PATIENT,ALL QUESTION ANSWERED"
              )}
            </label>
          </div>
        </div>
        <div className="d-flex flex-wrap col-12">
          {[
            "GA",
            "ETT",
            "LMA",
            "MASK",
            "PRONE POSITION",
            "MAC",
            "WITH SEDATION",
            "WITHOUT SEDATION",
            "SPECIAL VASCULAR ACCESS",
            "REG.A",
            "SA",
            "EPIDURAL",
            "NERVE BLOCK",
            "IVRA",
          ].map((label, idx) => (
            <div key={idx} className="form-check mr-3">
              <input
                className="form-check-input "
                type="checkbox"
                id={`anesthesia-${idx}`}
                name={`anesthesia_${idx}`}
              />
              <label
                className="form-check-label ml-2"
                htmlFor={`anesthesia-${idx}`}
              >
                {t(label)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 mb-1 d-flex align-items-center ml-2">
        <label className="fw-bold mr-3" style={{ marginTop: "11px" }}>
          {t("POST OP VENTILATION PLAN")} :
        </label>
        <div className="form-check mr-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="ventilation-yes"
            name="postOpVentilationPlan"
          />
          <label className="form-check-label ml-2" htmlFor="ventilation-yes">
            {t("YES")}
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="ventilation-no"
            name="postOpVentilationPlan"
          />
          <label className="form-check-label ml-2" htmlFor="ventilation-no">
            {t("NO")}
          </label>
        </div>
      </div>

      <div className="col-12 mb-2 ml-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="consent-obtained"
            name="consentObtained"
          />
          <label className="form-check-label ml-2" htmlFor="consent-obtained">
            {t("PATIENT AGREED AND INFORMED CONSENT OBTAINED")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlaneOfAnesthesia;
