import React, { useState } from "react";
import PersonalDetails from "@app/components/front-office/PersonalDetails";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { ageValidation, filterByTypes } from "../../utils/utils";
import Input from "../../components/formComponent/Input";

const RegistrationReplica = () => {
  const [t] = useTranslation();
  const [values, setValues] = useState({
    Title: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  return (
    <div className="card">
      <div className="row pt-2 pl-2 pr-2">
        <div className="col-md-12 col-sm-12 ">
          <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1">
            <Input
              type="text"
              className="form-control required-fields"
              id="Title"
              name="Title"
              value={values?.Title ? values?.Title : ""}
              onChange={handleChange}
              lable={t("Title")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              isUpperCase={true}
              //tabIndex="3"
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="First"
              name="PFirstName"
              value={values?.PFirstName ? values?.PFirstName : ""}
              onChange={handleChange}
              lable={t("FrontOffice.OPD.patientRegistration.First_Name")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              isUpperCase={true}
              //tabIndex="3"
            />

            <Input
              type="text"
              className="form-control"
              id="Last_Name"
              name="PLastName"
              value={values?.PLastName ? values?.PLastName : ""}
              onChange={handleChange}
              lable={t("FrontOffice.OPD.patientRegistration.Last_Name")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              isUpperCase={true}
            />

            <Input
              type="text"
              className="form-control required-fields"
              id="Age"
              name="Age"
              value={values?.Age ? values?.Age : ""}
              onChange={(e) => {
                ageValidation(
                  /^\d{0,2}(\.\d{0,2})?$/,
                  e,
                  handleChange,
                  values?.AgeType?.value
                    ? values?.AgeType?.value
                    : values?.AgeType
                );
              }}
              lable={t("FrontOffice.OPD.patientRegistration.Age")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              //tabIndex="5"
            />
            <Input
              type="text"
              className="form-control"
              id="Gender"
              name="Gender"
              value={values?.Gender ? values?.Gender : ""}
              onChange={handleChange}
              lable={t("Gender")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              isUpperCase={true}
            />
            <Input
              type="text"
              className="form-control required-fields"
              id="Mobile"
              name="Mobile"
              value={values?.Mobile ? values?.Mobile : ""}
              onChange={handleChange}
              showTooltipCount={true}
              lable={t("FrontOffice.OPD.patientRegistration.Mobile_No")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              //tabIndex="1"
            />
            <Input
              type="text"
              className="form-control "
              id="Address"
              name="Address"
              value={values?.Address ? values?.Address : ""}
              onChange={handleChange}
              lable={t("Address")}
              placeholder=" "
              respclass="col-xl-2 col-md-3 col-sm-6 col-12"
              //tabIndex="-1"
              // onKeyDown={Tabfunctionality}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationReplica;
