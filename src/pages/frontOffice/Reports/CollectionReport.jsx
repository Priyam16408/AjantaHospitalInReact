import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";

import {
  DailyCollectionDailyCollection,
  getBindDetailUser,
  getBindTypeOfTnx,
} from "../../../networkServices/ReportsAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  GetBindAllDoctorConfirmation,
  getBindSpeciality,
} from "../../../store/reducers/common/CommonExportFunction";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import { RedirectEXLURL, RedirectURL } from "../../../networkServices/PDFURL";
import moment from "moment";
import { handleMultiSelectOptions, notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const CollectionReport = () => {
  const [t] = useTranslation();
  const localUserData = useLocalStorage("userData", "get");
  const dispatch = useDispatch();

  const {
    GetEmployeeWiseCenter,
    GetBindAllDoctorConfirmationData,
    getBindSpecialityData,
  } = useSelector((state) => state.CommonSlice);

  const [apiData, setApiData] = useState({
    getBindDetailsUSerData: [],
    getBindTypeOfTnxData: [],
  });

  const initialValues = {
    centre: [],
    type: [],
    user: [],
    fromDate: new Date(),
    toDate: new Date(),
    batchNo: "",
    reportType: "0",
    doctor: [],
    speciality: [],
    printType: "0",
  };

  const [values, setValues] = useState({ ...initialValues });

  const fetchData = async () => {
    try {
      const [userData, tnxData] = await Promise.all([
        getBindDetailUser(),
        getBindTypeOfTnx(),
      ]);

      setApiData({
        getBindDetailsUSerData: userData.data,
        getBindTypeOfTnxData: tnxData.data,
      });

      console.log(localUserData);
      setValues({
        ...values,
        type: handleMultiSelectOptions(
          tnxData?.data,
          "DisplayName",
          "TypeOfTnx"
        ),
        ["centre"]: handleMultiSelectOptions(
          GetEmployeeWiseCenter,
          "CentreName",
          "CentreID"
        ),
        user: handleMultiSelectOptions(
          userData.data?.filter(
            (item, _) =>
              String(item?.EmployeeID) === String(localUserData?.employeeID)
          ),
          "Name",
          "EmployeeID"
        ),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (GetEmployeeWiseCenter.length > 0) fetchData();
  }, [GetEmployeeWiseCenter?.length]);

  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;

    if (name === "reportType") {
      if (String(e?.value) === "7") {
        dispatch(GetBindAllDoctorConfirmation({ Department: "All" }));
        obj["speciality"] = [];
      }

      if (String(e?.value) === "8") {
        obj["doctor"] = [];
        dispatch(getBindSpeciality());
      }
    }

    setValues(obj);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handlePayloadMultiSelect = (data) => {
    return data?.map((items, _) => String(items?.code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await DailyCollectionDailyCollection(
        {
          centre: handlePayloadMultiSelect(values?.centre),
          doctor: handlePayloadMultiSelect(values?.doctor),
          startDate:
            moment(values?.fromDate).format("YYYY-MM-DD") + " 00:00:00",
          toDate: moment(values?.toDate).format("YYYY-MM-DD") + " 23:59:59",
          typeOfTnx: handlePayloadMultiSelect(values?.type),
          user: handlePayloadMultiSelect(values?.user),
          batchNumber: String(values?.batchNo),
          reportType: Number(values?.reportType),
          speciality: handlePayloadMultiSelect(values?.speciality),
        },
        values?.printType
      );

      if (response?.pdfUrl) {
        RedirectURL(response?.pdfUrl);
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  return (
    <div className="card patient_registration border mt-2">
      <Heading title={t("card patient_registration border")} isBreadcrumb />
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
          name="type"
          placeholderName={t("Type")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={apiData.getBindTypeOfTnxData}
          labelKey="DisplayName"
          valueKey="TypeOfTnx"
        />

        <ReportsMultiSelect
          name="user"
          placeholderName={t("User")}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          setValues={setValues}
          dynamicOptions={apiData.getBindDetailsUSerData}
          labelKey="Name"
          valueKey="EmployeeID"
        />

        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="fromDate"
          name="fromDate"
          lable={t("fromDate")}
          values={values}
          setValues={setValues}
          max={values?.toDate}
        />

        <ReportDatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          id="toDate"
          name="toDate"
          lable={t("toDate")}
          values={values}
          setValues={setValues}
          max={new Date()}
          min={values?.fromDate}
        />

        <Input
          type="text"
          className="form-control required-fieldss"
          id="batchNo"
          name="batchNo"
          lable={t("Batch No.")}
          placeholder=" "
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          onChange={handleChange}
          value={values.batchNo}
        />

        <ReactSelect
          placeholderName={t("Report Type")}
          id="reportType"
          searchable
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          dynamicOptions={[
            { label: "Summarised", value: "0" },
            { label: "Detailed", value: "1" },
            { label: "Summarised Date Wise", value: "2" },
            { label: "Summarised Department Wise", value: "3" },
            { label: "IPD Collection", value: "4" },
            { label: "Collection PaymentMode wise", value: "5" },
            { label: "Collection(TOTAL)", value: "6" },
            { label: "Doctor Wise", value: "7" },
            { label: "Speciality Wise", value: "8" },
            { label: "Summarised Total", value: "9" },
          ]}
          value={values.reportType}
          name="reportType"
          removeIsClearable={true}
          handleChange={(name, e) => handleReactSelectChange(name, e)}
        />
        {String(values.reportType) === "7" && (
          <ReportsMultiSelect
            name="doctor"
            placeholderName={t("Doctors")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetBindAllDoctorConfirmationData}
            labelKey="Name"
            valueKey="DoctorID"
          />
        )}
        {String(values.reportType) === "8" && (
          <ReportsMultiSelect
            name="speciality"
            placeholderName={t("speciality")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={getBindSpecialityData}
            labelKey="Name"
            valueKey="ID"
          />
        )}

        <ReportPrintType
          placeholderName={t("Print Type")}
          id="printType"
          searchable
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          values={values}
          name={"printType"}
          setValues={setValues}
        />

        <div className="box-inner ">
          <button className="btn btn-sm btn-primary ml-2" type="submit">
            {t("Report")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionReport;
