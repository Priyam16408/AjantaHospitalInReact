import React from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import Input from "@app/components/formComponent/Input";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import UpdateTable from "../../../components/UI/customTable/updateTable";

function UploadViewDocument() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("FrontOffice.OPD.UploadDocument.label.Patient_Search")}
          isBreadcrumb={true}
        />
        <div className="row  g-4 p-2">
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <DatePicker
                className="custom-calendar"
                id="DOB"
                name="DOB"
                lable={t(
                  "FrontOffice.OPD.UploadDocument.label.Appointment_Date_From"
                )}
                placeholder={VITE_DATE_FORMAT}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <DatePicker
                className="custom-calendar"
                id="DOB"
                name="DOB"
                lable={t(
                  "FrontOffice.OPD.UploadDocument.label.Appointment_Date_To"
                )}
                placeholder={VITE_DATE_FORMAT}
              />
            </div>
          </div>
          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <ReactSelect
                placeholderName={t(
                  "FrontOffice.OPD.UploadDocument.label.Doctor_Name"
                )}
                id="Marital_Status"
                searchable={true}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                id="PatientName"
                name="patientname"
                lable={t("FrontOffice.OPD.UploadDocument.label.UHID")}
                placeholder=" "
                required={true}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <div className="form-group">
              <Input
                type="text"
                className="form-control"
                id="PatientName"
                name="patientname"
                lable={t("FrontOffice.OPD.UploadDocument.label.Patient_Name")}
                placeholder=" "
                required={true}
              />
            </div>
          </div>

          <div className="col-xl-2 col-md-3 col-sm-4 col-12 text-center">
            <div className="form-group">
              <button className="btn btn-primary btn-sm   " type="button">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card patient_registration border">
        <Heading
          title={t("FrontOffice.OPD.UploadDocument.label.Search_Data")}
        />

        <UpdateTable />
      </div>
    </>
  );
}

export default UploadViewDocument;
