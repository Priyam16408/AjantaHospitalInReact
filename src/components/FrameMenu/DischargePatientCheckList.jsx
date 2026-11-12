import React, { useEffect, useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import CombinedSelectAndInput from "../formComponent/CombinedSelectAndInput";
import {
  NursingWardBindPatientDetail,
  NursingWardDischargeCheckListPrintAPI,
  NursingWardSaveCheckList,
  NursingWardUpdateCheckList,
} from "../../networkServices/nursingWardAPI";
import moment from "moment";
import {
  notify,
  NursingWardBindPatientDetailModifies,
} from "../../utils/utils";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";
import { PrintSVG } from "../SvgIcons";

const YESANDNO = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: 0,
  },
];

const DischargePatientCheckList = ({ data }) => {
  const [t] = useTranslation();
  const { transactionID, patientID } = data;

  const [payload, setPayload] = useState({
    isAware: 0,
    isConsumables: 0,
    isDrugsReturn: 0,
    isTTO: 0,
    isEnsureDS: 0,
    isSigned: 0,
    isRefferal: 0,
    isVenflon: 0,
    isWound: 0,
    isDischrageLog: 0,
    isEnsureBilling: 0,
    isCheckout: 0,
    awareRemarks: "",
    consumablesRemarks: "",
    drugsReturnRemarks: "",
    ttoRemarks: "",
    ensureDSRemarks: "",
    signedRemarks: "",
    refferalRemarks: "",
    venflonRemarks: "",
    woundRemarks: "",
    dischargeLogRemarks: "",
    ensureBillingRemarks: "",
    checkoutRemarks: "",
    createdDate: moment(new Date()).format("DD-MMM-YYYY"),
    id: "",
  });

  const handleNursingWardBindPatientDetail = async (transactionID) => {
    try {
      const response = await NursingWardBindPatientDetail(transactionID);

      if (response?.data?.length > 0) {
        const modifiedValue = NursingWardBindPatientDetailModifies(
          response?.data[0]
        );

        setPayload(modifiedValue);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNursingWardUpdateCheckList = async () => {
    try {
      const responseAPI = await NursingWardUpdateCheckList({
        data: [payload],
        tid: String(transactionID),
        pid: String(patientID),
      });
      if (responseAPI?.success) {
        notify(responseAPI?.message, "success");
      } else {
        notify(responseAPI?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handleNursingWardSaveCheckList = async () => {
    try {
      const responseAPI = await NursingWardSaveCheckList({
        data: [payload],
        tid: String(transactionID),
        pid: String(patientID),
      });
      if (responseAPI?.success) {
        notify(responseAPI?.message, "success");
      } else {
        notify(responseAPI?.message, "error");
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const handlePrint = async() =>{

    let payload = {
      "tid": transactionID
    }
    let apiResp = await NursingWardDischargeCheckListPrintAPI(payload)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }
  }

  useEffect(() => {
    handleNursingWardBindPatientDetail(transactionID);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayload({
      ...payload,
      [name]: value,
    });
  };

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading
            title={t("Discharge PatientCheck List")}
            isBreadcrumb={false}
          />
          <div className="row p-2">
            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "PatientRelatives"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isAware}
                selectName="isAware"
                inputValue={payload?.awareRemarks}
                inputName="awareRemarks"
                handleChange={handleChange}
              />
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "ConsumabledIndented"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isConsumables}
                selectName="isConsumables"
                inputValue={payload?.consumablesRemarks}
                inputName="consumablesRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t("PharmacyPrior")}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isDrugsReturn}
                selectName="isDrugsReturn"
                inputValue={payload?.drugsReturnRemarks}
                inputName="drugsReturnRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t("T.T.O")}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isTTO}
                selectName="isTTO"
                inputValue={payload?.ttoRemarks}
                inputName="ttoRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "EnsureDischargeSummary"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isEnsureDS}
                selectName="isEnsureDS"
                inputValue={payload?.ensureDSRemarks}
                inputName="ensureDSRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t("SignedPfeform")}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isSigned}
                selectName="isSigned"
                inputValue={payload?.signedRemarks}
                inputName="signedRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "Refferalforfollowup"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isRefferal}
                selectName="isRefferal"
                inputValue={payload?.refferalRemarks}
                inputName="refferalRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "VenflonorCannularemoved"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isVenflon}
                selectName="isVenflon"
                inputValue={payload?.venflonRemarks}
                inputName="venflonRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "WoundSitecheckedifApplicable"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isWound}
                selectName="isWound"
                inputValue={payload?.woundRemarks}
                inputName="woundRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t("Dischargelog")}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isDischrageLog}
                selectName="isDischrageLog"
                inputValue={payload?.dischargeLogRemarks}
                inputName="dischargeLogRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "Ensureforbilling"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isEnsureBilling}
                selectName="isEnsureBilling"
                inputValue={payload?.ensureBillingRemarks}
                inputName="ensureBillingRemarks"
                handleChange={handleChange}
              />
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 col-12">
              <CombinedSelectAndInput
                label={t(
                  "checkoutofpatient"
                )}
                dynamicOptions={YESANDNO}
                selectedValue={payload?.isCheckout}
                selectName="isCheckout"
                inputValue={payload?.checkoutRemarks}
                inputName="checkoutRemarks"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-dyamic-component">
        {payload?.id ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={handleNursingWardUpdateCheckList}
          >
            {t("Update")}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={handleNursingWardSaveCheckList}
          >
            {t("Save")}
          </button>
        )}

        <span className="mx-2" onClick={handlePrint}>{PrintSVG()}</span>
      </div>
    </>
  );
};

export default DischargePatientCheckList;
