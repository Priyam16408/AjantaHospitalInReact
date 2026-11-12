import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  getBindCityList,
  getBindCountryList,
  getBindDistrictList,
  getBindStateList,
  ReportsRegistrationDetail,
} from "../../../networkServices/ReportsAPI";
import {
  handleReactSelectDropDownOptions,
  isArrayFunction,
  notify,
} from "../../../utils/utils";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import store from "../../../store/store";
import ReportDatePicker from "../../../components/ReportCommonComponents/ReportDatePicker";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import ReportPrintType from "../../../components/ReportCommonComponents/ReportPrintType";
import { RedirectURL, RedirectURLReport } from "../../../networkServices/PDFURL";

export default function RegistrationReport() {
  const [t] = useTranslation();

  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);

  const [apiData, setApiData] = useState({
    getCountry: [],
    getState: [],
    getDistrict: [],
    getCity: [],
  });

  const initialValues = {
    centre: [],
    fromDate: new Date(),
    toDate: new Date(),
    country: "",
    state: "",
    district: "",
    city: "",
    printType: "0",
  };

  const [values, setValues] = useState({ ...initialValues });

  const handleReactSelectChange = async (name, e) => {
    setValues({ ...values, [name]: e?.value });
    switch (name) {
      case "country":
        try {
          const dataState = await getBindStateList(e.value);
          setApiData((prev) => ({
            ...prev,
            getState: handleReactSelectDropDownOptions(
              dataState?.data,
              "StateName",
              "StateID"
            ),
          }));
        } catch (error) {
          console.log(error);
        }
        break;
      case "state":
        try {
          const dataDistrict = await getBindDistrictList({
            countryId: values?.country,
            StateId: e.value,
          });
          setApiData((prev) => ({
            ...prev,
            getDistrict: isArrayFunction(dataDistrict.data),
          }));
        } catch (error) {
          console.log(error);
        }
        break;
      case "district":
        // setSelectedStateId(e.value);
        try {
          const dataCity = await getBindCityList({
            DistrictId: e.value,
            StateId: values?.state,
          });
          // console.log(dataDistrict);
          setApiData((prev) => ({
            ...prev,
            getCity: isArrayFunction(dataCity.data),
          }));
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        break;
    }
  };

  const handleReport = async () => {
    if (!values?.centre.length) {
      notify(" Please Select Centre.", "error");
    } else if (values?.fromDate == "") {
      notify("Please Select From Date.", "error");
    } else if (values?.toDate == "") {
      notify("Please Select To Date.", "error");
    } else if (values?.country == "") {
      notify("Please Select Country.", "error");
    } else {
      store.dispatch(setLoading(true));
      try {
        const response = await ReportsRegistrationDetail({
          FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
          ToDate: moment(values?.toDate).format("YYYY-MM-DD"),
          CentreID: values?.centre?.map((ele, _) => ele?.code).join(","),
          CountryId: values?.country ? values?.country : 0,
          StateId: values?.state ? values?.state : 0,
          DistrictId: values?.district ? values?.district : 0,
          CityId: values?.city ? values?.city : 0,
          Village: "",
        });
        if (response?.success) {
          RedirectURL(response?.data?.pdfUrl);
        } else {
          notify(response?.data?.message, "error");
        }
      } catch (error) {
        console.log(error, "No Record Found.");
      } finally {
        store.dispatch(setLoading(false));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBindCountryList();
        setApiData((prev) => ({
          ...prev,
          getCountry: handleReactSelectDropDownOptions(
            data?.data,
            "Name",
            "CountryID"
          ),
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setValues({
      ...values,
      ["centre"]: GetEmployeeWiseCenter.map((item) => ({
        name: item.CentreName,
        code: item.CentreID,
      })),
    });
  }, [GetEmployeeWiseCenter?.length]);

  return (
    <>
      <div className="card patient_registration border">
        <Heading
          title={t("card patient_registration border")}
          isBreadcrumb={true}
        />
        <form className="row  p-2">
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={GetEmployeeWiseCenter}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName="required-fields"
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          />
          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            id="toDate"
            name="toDate"
            lable={t("toDate")}
            values={values}
            setValues={setValues}
          />

          <ReactSelect
            placeholderName={t("Country")}
            id={"country"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData?.getCountry}
            name="country"
            value={values.country}
            handleChange={handleReactSelectChange}
            requiredClassName="required-fields"
          />
          <ReactSelect
            placeholderName={t("State")}
            id={"state"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData?.getState?.map((item) => ({
              label: item?.StateName,
              value: item?.StateID,
            }))}
            name="state"
            value={values.state}
            handleChange={handleReactSelectChange}
          />
          <ReactSelect
            placeholderName={t("District")}
            id={"district"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData?.getDistrict?.map((item) => ({
              label: item?.District,
              value: item?.DistrictID,
            }))}
            name="district"
            value={values.district}
            handleChange={handleReactSelectChange}
          />
          <ReactSelect
            placeholderName={t("City")}
            id={"city"}
            searchable={true}
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            dynamicOptions={apiData?.getCity?.map((item) => ({
              label: item?.City,
              value: item?.ID,
            }))}
            name="city"
            value={values.city}
            handleChange={handleReactSelectChange}
          />
          <ReportPrintType
            placeholderName={t("Print Type")}
            id="printType"
            searchable
            respclass="col-xl-2 col-md-2 colt-sm-6 col-12"
            values={values}
            name={"printType"}
            setValues={setValues}
          />
          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="button"
              onClick={handleReport}
            >
             {t("Report")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
