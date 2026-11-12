import React from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Tables from "@app/components/UI/customTable";
import Input from "../../../components/formComponent/Input";
import ReactSelectHead from "../../../components/formComponent/ReactSelectHead";
// import ReactSelect from "../../../components/formComponent/ReactSelect";

import DatePicker from "../../../components/formComponent/DatePicker";
const DoctorWiseAppDetail = () => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  return (
    <>
      <div className="m-2 spatient_registration_card">
        <form className="patient_registration card">
          {/* <OPDSearchSetellment /> */}
          <Heading
            title={t("TokenManagement.ExamCounterMaster.HeadingName")}
            isBreadcrumb={true}
          />
          <div className="row p-2">
            {/* <ReactSelectHead
              placeholderName={t("TokenManagement.ModilityMaster.SubCategory")}
              id={"Sub category"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            /> */}
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
              id="DOB"
              name="DOB"
              lable={t("FromDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <DatePicker
              className="custom-calendar"
              respclass="col-xl-2.5 col-md-3 col-sm-4 col-12"
              id="DOB"
              name="DOB"
              lable={t("ToDate")}
              placeholder={VITE_DATE_FORMAT}
            />
            <ReactSelect
              placeholderName={t("ReportType")}
              id={"Sub category"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("DoctorName")}
              id={"Sub category"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <ReactSelect
              placeholderName={t("DoctorGroup")}
              id={"Sub category"}
              searchable={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            />
            <div className="col-xl-12 col-md-12 col-sm-6 col-12">
              <div className="d-flex mb-3">
                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Center:
                  </label>
                </div>
                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Center: 1
                  </label>
                </div>
                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Center: 2
                  </label>
                </div>
                <div className="form-check mx-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Clinics
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Main Hospital
                  </label>
                </div>
              </div>
            </div>
            {/* <Input
              type="text"
              className="form-control"
              id="UHID"
              name="UHID"
              //   lable={t("helpDesk.HelpDeskIPD.UHID")}
              lable={"Enter Counter Name"}
              placeholder=" "
              required={true}
              respclass="col-xl-2.5 col-md-2 colt-sm-6 col-12"
            /> */}
            <button className="btn btn-sm btn-primary ml-2 " type="button">
              Report
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DoctorWiseAppDetail;
