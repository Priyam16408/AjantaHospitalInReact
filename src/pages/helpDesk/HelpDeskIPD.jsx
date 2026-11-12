import React, { useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import HelpDeskIPDTable from "../../components/UI/customTable/helpDesk/HelpDeskIPDTable/index";
import { useFormik } from "formik";
import { IPDHelpDeskPayload, IPDTYPE } from "../../utils/constant";
import moment from "moment";
import { IPDDetail } from "../../networkServices/IPDHelpDeskApi";
import { useSelector } from "react-redux";
import { notify } from "../../utils/utils";

const HelpDeskIPD = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const [bodyData, setBodyData] = useState({ SearchIPDHelpDeskList: [] });

  const SearchIPDHelpDesk = async () => {
    const newValues = {
      ...values,
      type: values?.type?.value,
      city: values?.city,
      patientID: values?.patientID,
      pName: values?.pName,
      contactNo: values?.contactNo,
      centre: values?.centre?.value?.toString() || "",
      fdSearch: moment(values?.fdSearch).format("DD-MMM-YYYY"),
      tdSearch: moment(values?.tdSearch).format("DD-MMM-YYYY"),
    };

    try {
      if (!newValues?.centre) {
        notify("Please select Centre", "error");
      } else {
        const dataRes = await IPDDetail(newValues);
        if (dataRes?.data.length > 0) {
          setBodyData((prevState) => ({
            ...prevState,
            SearchIPDHelpDeskList: dataRes.data,
          }));
        } else {
          notify("Record Not Found", "error");
          setBodyData((prevState) => ({
            ...prevState,
            SearchIPDHelpDeskList: [],
          }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
    initialValues: IPDHelpDeskPayload,
    onSubmit: async (values, { resetForm }) => {
      SearchIPDHelpDesk();
    },
  });
  const handleReactSelect = (name, value) => {
    setFieldValue(name, value);
  };

  const IPDHELPDESKTHEAD = [
    t("S.No."),
    t("UHID"),
    t("IPD No."),
    t("Patient Name"),
    t("Contact No"),
    t("Panel"),
    t("Date Of Admit"),
    t("Date Of Discharge"),
    t("Doctor Name"),
    t("Room No."),
    t("Bed No."),
    t("Floor"),
    t("Status"),
    t("Address"),
  ];
  return (
    <>
      <form className="patient_registration card">
        <Heading isBreadcrumb={true} />
        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 g-4 p-2 p-2">
          <ReactSelect
            placeholderName={t("Type")}
            id={"type"}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            searchable={true}
            dynamicOptions={IPDTYPE}
            name="type"
            value={values?.type?.value}
            handleChange={handleReactSelect}
          />
          <Input
            type="text"
            className="form-control"
            id="patientID"
            name="patientID"
            value={values?.patientID}
            onChange={handleChange}
            lable={t("UHID")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <ReactSelect
            placeholderName={t("Centre")}
            dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
              return { label: ele.CentreName, value: ele.CentreID };
            })}
            searchable={true}
            name="centre"
            value={`${values?.centre?.value}`}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            handleChange={handleReactSelect}
            requiredClassName="required-fields"
          />
          <Input
            type="text"
            className="form-control"
            id="pName"
            name="pName"
            value={values?.pName}
            onChange={handleChange}
            lable={t("Name")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="contactNo"
            name="contactNo"
            value={values?.contactNo}
            onChange={handleChange}
            lable={t("ContactNo")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <Input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={values?.city}
            onChange={handleChange}
            lable={t("City")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
            <div className="form-group">
              <DatePicker
                className="custom-calendar"
                id="fdSearch"
                name="fdSearch"
                lable={t("FromDate")}
                placeholder={VITE_DATE_FORMAT}
                handleChange={handleChange}
                // value={values?.Appfromdate}
                value={
                  values.fdSearch
                    ? moment(values?.fdSearch, "DD-MMM-YYYY").toDate()
                    : values?.fdSearch
                }
              />
            </div>
          </div>
          <div className="col-xl-2 col-md-4 col-sm-4 col-12 mt-1">
            <div className="form-group">
              <DatePicker
                className="custom-calendar"
                id="tdSearch"
                name="tdSearch"
                lable={t("ToDate")}
                placeholder={VITE_DATE_FORMAT}
                handleChange={handleChange}
                // value={values?.Apptodate}
                value={
                  values.tdSearch
                    ? moment(values?.tdSearch, "DD-MMM-YYYY").toDate()
                    : values?.tdSearch
                }
              />
            </div>
          </div>

          <div className="col-xl-1 col-md-2 col-sm-6 col-12">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleSubmit}
            >
              {t("Search")}
            </button>
          </div>
          <div className="col-xl-1 col-md-2 col-sm-6 col-12">
            <button className="btn btn-sm btn-primary ml-2" type="button">
              {t("Report")}
            </button>
          </div>
        </div>
      </form>
      <div className="patient_registration card">
        <HelpDeskIPDTable
          thead={IPDHELPDESKTHEAD}
          tbody={bodyData?.SearchIPDHelpDeskList}
        />
      </div>
    </>
  );
};

export default HelpDeskIPD;
