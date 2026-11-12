import React from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import i18n from "@app/utils/i18n";
import Input from "@app/components/formComponent/Input";

const ReferedDoctorModal = () => {
  const [t] = useTranslation();
  return (
    <>
      <div className="row p-2">
        <div className="col-md-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t(
                "modalComponent.Utils.ReferedDoctorModal.label.Title"
              )}
              id="Title"
              searchable={true}
            />
          </div>
        </div>
        <Input
          type="text"
          className="form-control"
          id="Name"
          name="Name"
          lable={t("modalComponent.Utils.ReferedDoctorModal.label.Name")}
          placeholder=" "
          respclass="col-md-4 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="Address"
          name="Address"
          lable={t("modalComponent.Utils.ReferedDoctorModal.label.Address")}
          placeholder=" "
          respclass="col-md-4 col-12"
        />
        <Input
          type="text"
          className="form-control"
          id="ContactNo"
          name="ContactNo"
          lable={t("modalComponent.Utils.ReferedDoctorModal.label.ContactNo")}
          placeholder=" "
          respclass="col-md-4 col-12"
        />
        <div className="col-md-4 col-12">
          <div className="form-group">
            <ReactSelect
              placeholderName={i18n.t(
                "modalComponent.Utils.ReferedDoctorModal.label.Pro_Name"
              )}
              id="Pro_Name"
              searchable={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferedDoctorModal;
