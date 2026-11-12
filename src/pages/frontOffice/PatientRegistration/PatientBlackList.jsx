import React from "react";
import Input from "../../../components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import Heading from "../../../components/UI/Heading";
import Tables from "../../../components/UI/customTable";

const PatientBlackList = () => {
  const [t] = useTranslation();
  const THEAD = [
    t("FrontOffice.Re_Print.label.Slot"),
    t("FrontOffice.Re_Print.label.Type"),
    t("FrontOffice.Re_Print.label.Code"),
    t("FrontOffice.Re_Print.label.Item_Name"),
    t("FrontOffice.Re_Print.label.Doctor"),
    t("FrontOffice.Re_Print.label.Remarks"),
    t("FrontOffice.Re_Print.label.Rate"),
    t("FrontOffice.Re_Print.label.Qty"),
    t("FrontOffice.Re_Print.label.Dis(%)"),
    t("FrontOffice.Re_Print.label.Dis_Amt"),
    t("FrontOffice.Re_Print.label.Amount"),
    t("FrontOffice.Re_Print.label.u"),
  ];
  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("FrontOffice.PatientRegistration.label.Patient_Black_List")}
          isBreadcrumb={true}
        />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 m-2">
          <Input
            type="text"
            className="form-control"
            id="UHID"
            name="UHID"
            lable={t("FrontOffice.PatientRegistration.label.UHID")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="PatientName"
            name="patientname"
            lable={t("FrontOffice.PatientRegistration.label.PatientName")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="IPDNo"
            name="IPD_No"
            lable={t("FrontOffice.PatientRegistration.label.IPDNo")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />

          <Input
            type="text"
            className="form-control"
            id="ReceiptNo"
            name="receiptno"
            lable={t("FrontOffice.PatientRegistration.label.ReceiptNo")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="BillNo"
            name="billno"
            lable={t("FrontOffice.PatientRegistration.label.BillNo")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="ContactNo"
            name="Contact_No"
            lable={t("FrontOffice.PatientRegistration.label.ContactNo")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <div className="col-xl-2.5 col-md-3 col-sm-4 col-12">
            <button className="btn btn-sm btn-info ">
              {t("FrontOffice.PatientRegistration.label.Search")}
            </button>
          </div>
        </div>
      </div>

      {/* <Tables thead={THEAD}  /> */}
      <div className="card patient_registration border">
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 m-2">
          <Input
            type="date"
            className="form-control"
            id="StartDate"
            name="StartDate"
            lable={t("FrontOffice.PatientRegistration.label.StartDate")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="reason"
            name="Reason"
            lable={t("FrontOffice.PatientRegistration.label.Reason")}
            placeholder=" "
            required={true}
            respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
          />
        </div>
      </div>
    </>
  );
};

export default PatientBlackList;
