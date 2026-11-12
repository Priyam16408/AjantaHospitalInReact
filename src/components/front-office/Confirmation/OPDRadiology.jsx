import React from "react";
import DatePicker from "../../formComponent/DatePicker";
import ReactSelect from "../../formComponent/ReactSelect";
import Input from "@app/components/formComponent/Input";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSelector } from "react-redux";
import { parseSubCategoryString } from "../../../utils/utils";

const OPDRadiology = (props) => {
  const {
    values,
    searchHandleChange,
    handleClickDataGetAPI,
    handleReactSelectChange,
  } = props;
  // console.log(values);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const { GetBindSubCatgeoryData } = useSelector((state) => state.CommonSlice);
  // console.log("GetBindSubCatgeoryData",GetBindSubCatgeoryData);
  const typeStatus = [
    { value: "All", label: "All" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "ReScheduled", label: "ReScheduled" },
    { value: "Pending", label: "Pending" },
    { value: "Canceled", label: "Canceled" },
    { value: "App. Time Expired", label: "App. Time Expired" },
  ];
 
  return (
    <>
      <DatePicker
        className="custom-calendar"
        id="fromDate"
        name="fromDate"
        lable={"From Date"}
        placeholder={VITE_DATE_FORMAT}
        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
        value={
          values.fromDate
            ? moment(values.fromDate, "YYYY-MM-DD").toDate()
            : null
        }
        handleChange={searchHandleChange}
      />
      <DatePicker
        className="custom-calendar"
        id="toDate"
        name="toDate"
        lable={"To Date"}
        placeholder={VITE_DATE_FORMAT}
        respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
        value={
          values.toDate ? moment(values.toDate, "YYYY-MM-DD").toDate() : null
        }
        handleChange={searchHandleChange}
      />

      <ReactSelect
        placeholderName={t("Status")}
        id={"status"}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
        dynamicOptions={typeStatus?.map((item) => {
          return {
            label: item?.label,
            value: item?.value,
          };
        })}
        name={"status"}
        value={values?.status}
      />
      <Input
        type="text"
        className="form-control"
        id="UHID"
        name="UHID"
        lable={"UHID"}
        value={values.uhid}
        onChange={searchHandleChange}
        placeholder=" "
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
      />

      <Input
        type="text"
        className="form-control"
        id="PatientName"
        name="pName"
        value={values.pName}
        onChange={searchHandleChange}
        lable={t("PatientName")}
        placeholder=" "
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
      />
      <Input
        type="text"
        className="form-control"
        id="Mobile"
        name="mobile"
        value={values.mobile}
        onChange={searchHandleChange}
        lable={"Mobile"}
        placeholder=" "
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
      />

      <ReactSelect
        placeholderName={"SubCategory"}
        id={"Status"}
        searchable={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
        value={values.subCategoryID}
        name={"subCategoryID"}
        // dynamicOptions={options}
        dynamicOptions={[
          { label: "All", value: "All" },
          ...GetBindSubCatgeoryData?.map((item) => {
            return {
              value: item?.subCategoryID,
              label: item?.name,
            };
          }),
        ]}
        handleChange={handleReactSelectChange}
      />
      <Input
        type="text"
        className="form-control"
        id="LabNo"
        name="labNo"
        value={values.labNo}
        onChange={searchHandleChange}
        lable={"Lab No"}
        placeholder=" "
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
      />
      <Input
        type="text"
        className="form-control"
        id="TokenNo"
        name="tokenNo"
        value={values.tokenNo}
        onChange={searchHandleChange}
        lable={"TokenNo"}
        placeholder=" "
        required={true}
        respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
      />

      <div className="col-md-1 col-sm-1 col-12 d-flex ">
        {/* <div className="col-md-1 col-sm-1 col-12 d-flex  justify-content-around"> */}
        <button
          className="btn btn-sm btn-info "
          onClick={handleClickDataGetAPI}
        >
          {t("Search")}
        </button>
        {/* <button className="btn btn-sm btn-info ml-2">
              {t("FrontOffice.OPD.Confirmation.label.Report")}
            </button> */}
      </div>
    </>
  );
};

export default OPDRadiology;
