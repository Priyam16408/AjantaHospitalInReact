import React, { useEffect, useState } from "react";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import {
  MRDBindPanelIPD,
  MRDBindPatientType,
} from "../../../networkServices/MRDApi";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";

const CommonSearchComponent = ({
  HeadingName,
  payload,
  setPayload,
  DEFAULTALLOPTION,
  handleSearchAPI,
  children,
  colorCodeComponent,
}) => {
  const [t] = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;

  const [dropDownState, setDropDownState] = useState({
    BindPatientType: [],
    BindDoctorDept: [],
    BindPanelIPD: [],
  });

  const handleMRDBindPatientType = async () => {
    try {
      const response = await MRDBindPatientType();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindPanelIPD = async () => {
    try {
      const response = await MRDBindPanelIPD();
      return response;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const renderApiCall = async () => {
    try {
      const [BindPatientType, BindPanelIPD, BindDoctorDept] = await Promise.all(
        [
          handleMRDBindPatientType(),
          handleMRDBindPanelIPD(),
          GetBindDoctorDept("ALL"),
        ]
      );

      const dropDownData = {
        BindPatientType: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindPatientType?.data,
            "PType",
            "PType"
          ),
        ],
        BindPanelIPD: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindPanelIPD?.data,
            "company_Name",
            "panelID"
          ),
        ],
        BindDoctorDept: [
          ...DEFAULTALLOPTION,
          ...handleReactSelectDropDownOptions(
            BindDoctorDept?.data,
            "Name",
            "DoctorID"
          ),
        ],
      };

      setDropDownState(dropDownData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, setKey) => {
    setPayload({ ...payload, [name]: e?.[setKey] });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const obj = { ...payload };
    if (type === "checkbox") obj[name] = checked ? 1 : 0;
    else obj[name] = value;

    setPayload(obj);
  };

  useEffect(() => {
    renderApiCall();
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading title={t(HeadingName)} isBreadcrumb={false} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("PatientType")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"patientType"}
            name={"patientType"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e, "value")}
            dynamicOptions={dropDownState?.BindPatientType}
            value={payload?.patientType}
          />

          <Input
            type="text"
            className="form-control"
            id="pid"
            lable={t("UHID")}
            placeholder=" "
            required={true}
            value={payload?.pid}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="pid"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="patientName"
            lable={t("PatientName")}
            placeholder=" "
            required={true}
            value={payload?.patientName}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="patientName"
            onChange={handleChange}
          />

          <Input
            type="text"
            className="form-control"
            id="transactionNo"
            lable={t("IPDNo")}
            placeholder=" "
            required={true}
            value={payload?.transactionNo}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            name="transactionNo"
            onChange={handleChange}
          />

          <ReactSelect
            placeholderName={t("Doctor")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"doctorId"}
            removeIsClearable={true}
            name={"doctorId"}
            handleChange={(name, e) => handleReactChange(name, e, "value")}
            dynamicOptions={dropDownState?.BindDoctorDept}
            value={payload?.doctorId}
          />

          <ReactSelect
            placeholderName={t("Panel")}
            searchable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id={"company"}
            name={"company"}
            removeIsClearable={true}
            handleChange={(name, e) => handleReactChange(name, e, "value")}
            dynamicOptions={dropDownState?.BindPanelIPD}
            value={payload?.company}
          />
          <div className="col-xl-2 col-md-3 col-sm-4 col-12 d-flex align-items-end">
            <div className="w-50">
              <input
                type="checkbox"
                id="isIgnore"
                value={payload?.isIgnore}
                className="mx-1"
                name="isIgnore"
                onChange={handleChange}
              />
              <label htmlFor="isIgnore">{t("Ignore")}</label>
            </div>
            <DatePicker
              className="custom-calendar"
              placeholder={VITE_DATE_FORMAT}
              lable={t("FromDate")}
              respclass={""}
              name="ucFromDate"
              id="ucFromDate"
              value={payload?.ucFromDate}
              showTime
              hourFormat="12"
              handleChange={handleChange}
            />
          </div>

          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("ToDate")}
            respclass={"col-xl-2 col-md-3 col-sm-4 col-12"}
            name="ucToDate"
            id="ucToDate"
            value={payload?.ucToDate}
            showTime
            hourFormat="12"
            handleChange={handleChange}
          />

          {children}

          <div className="col-xl-2 col-md-3 col-sm-4 col-12">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSearchAPI}
            >
              {t("Search")}
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-end p-1">
          {colorCodeComponent && colorCodeComponent}
        </div>
      </div>
    </div>
  );
};

export default CommonSearchComponent;
