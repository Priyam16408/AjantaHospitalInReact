import React, { useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { GetBindReferDoctor } from "../../../store/reducers/common/CommonExportFunction";
import { useState } from "react";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import { useSelector } from "react-redux";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../utils/utils";
import { ReferDoctorApiCall } from "../../../networkServices/ReportsAPI";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { exportToExcel } from "../../../utils/exportLibrary";
export default function ReferdoctorReport() {
  const [t] = useTranslation();
  let userData = useLocalStorage("userData", "get")
  const initialValues = {
    centre: [{
      "name": userData?.centreName,
      "code": Number(userData?.defaultCentre)
    }],
    fromDate: new Date(),
    toDate: new Date(),
    Doctor: [],
  };

  const [values, setValues] = useState({ ...initialValues });
  const { GetEmployeeWiseCenter, GetBindReferDoctorList } = useSelector((state) => state.CommonSlice);
  const dispatch = useDispatch()


  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code))?.join(",");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values?.centre?.length) {
      notify("Please Select Centre", "error");
      return 0
    }

    try {
      const response = await ReferDoctorApiCall({
        centre: handlePayloadMultiSelect(values?.centre),
        refDoctor: handlePayloadMultiSelect(values?.Doctor),
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      });
      if (response?.data) {
        exportToExcel(response?.data?.response, "Pharmacy Refer Doctor ");
        notify(response?.message, "success");
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    dispatch(GetBindReferDoctor());
  }, []);



  return (
    <div className="card patient_registration border mt-2">
      <Heading title={t("card patient_registration border")} isBreadcrumb={true} />
      <form className="row p-2" onSubmit={handleSubmit}>

        <ReportsMultiSelect
          name="centre"
          placeholderName={t("Centre")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={GetEmployeeWiseCenter}
          labelKey="CentreName"
          valueKey="CentreID"
          requiredClassName={true}
        />

        <ReportsMultiSelect
          name="Doctor"
          placeholderName={t("Doctor")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          lable={t("From Date")}
          dynamicOptions={GetBindReferDoctorList}
          labelKey="NAME"
          valueKey="DoctorID"
        // requiredClassName={true}
        />
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id="fromDate"
          name="fromDate"
          lable={t("From Date")}
          values={values}
          setValues={setValues}
          max={values?.toDate}
        />
        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-4 col-12"
          id="toDate"
          name="toDate"
          lable={t("To Date")}
          values={values}
          setValues={setValues}
          max={values?.toDate}
        />


        <div className="box-inner ">
          <button className="btn btn-sm btn-primary ml-2" type="submit">
            {t("Report")}
          </button>
        </div>
      </form>
    </div>
  );
}
