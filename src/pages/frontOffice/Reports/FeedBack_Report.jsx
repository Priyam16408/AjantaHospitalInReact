import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import DatePicker from "../../../components/formComponent/DatePicker";
import Heading from "../../../components/UI/Heading";
import {
  OPD_SETTLEMENT_DETAILS,
  PAYMENT_OBJECT,
} from "../../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  CentreWiseCacheByCenterID,
  CentreWisePanelControlCache,
} from "../../../store/reducers/common/CommonExportFunction";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import moment from "moment";
import { OpenPDFURL } from "../../../networkServices/PDFURL";
import { notify } from "../../../utils/ustil2";
import { FeedBackFeedBackReport } from "../../../networkServices/edpApi";
import { exportToExcel } from "../../../utils/exportLibrary";
export default function FeedBack_Report() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const localdata = useLocalStorage("userData", "get");
  const {
    CentreWiseCache,
    CentreWisePanelControlCacheList,
    GetEmployeeWiseCenter,
  } = useSelector((state) => state.CommonSlice);


  const [values, setValues] = useState({
    type: { label: "IPD", value: "IPD" },
    details:  { label: "Department", value: "Dept" },
    fromDate: new Date(),
    toDate: new Date(),
  })
  console.log("values", values)
  const handleReactSelect = (name,value) => {
  
    setValues((val) => ({ ...val, [name]: value }))
   
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((preV) => ({
      ...preV,
      [name]: value
    }))
  }

  useEffect(() => {
    if (CentreWiseCache?.length === 0) {
      dispatch(
        CentreWiseCacheByCenterID({
          centreID: localdata?.defaultCentre,
        })
      );
    }
    if (CentreWisePanelControlCacheList?.length === 0) {
      dispatch(
        CentreWisePanelControlCache({
          centreID: localdata?.defaultCentre,
        })
      );
    }
  }, [dispatch]);

  const handleGetReport = async() => {
    if (!values?.type?.value) {
      notify("Please Select Type", "warn")
      return
    }
    if (!values?.details?.value) {
      notify("Please Select Details", "warn")
      return
    }
    const payload={
      
    "fromDate":moment(values?.fromDate).format("YYYY-MM-DD"),
    "toDate":moment(values?.toDate).format("YYYY-MM-DD"),
    "type":String(values?.type?.value),
    "searchType":String(values?.details?.value),

    }
try {
  const response =await FeedBackFeedBackReport(payload)
  if(response?.success){
  exportToExcel(response?.data, "Exel");
  }
  else{
    notify(response?.message,"warn")
  }
} catch (error) {
  console.log("error",error)
}   
  }
  return (
    <>
      <form className="card patient_registration border">
        <Heading
          title={t("Feed Back Report")}
          isBreadcrumb={true}

        />
        <div className="row p-2">
          <div className="col-12">
            <div className="row">
              <ReactSelect
                placeholderName={t("Type")}
                dynamicOptions={[
                  { label: "IPD", value: "IPD" },
                  { label: "OPD", value: "OPD" }
                ]}

                searchable={true}
                name="type"
                value={values?.type?.value}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />
              <ReactSelect
                placeholderName={t("Search Type")}
                dynamicOptions={[
                  { label: "Details", value: "D" },
                  { label: "Department Question", value: "DQ" },
                  { label: "Department", value: "Dept" }
                ]}

                searchable={true}
                name="details"
                value={values?.details?.value}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                handleChange={handleReactSelect}
                requiredClassName="required-fields"
              />

              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                id="fromDate"
                name="fromDate"
                // value={moment(values?.fromDate).format("DD-MM-YYYY")}
                value={
                  values.fromDate
                    ? moment(values?.fromDate, "DD-MMM-YYYY").toDate()
                    : values?.fromDate
                }
                handleChange={handleChange}
                lable={t("FromDate")}
                placeholder={VITE_DATE_FORMAT}
              />
              <DatePicker
                className="custom-calendar"
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                id="toDate"
                name="toDate"
                // value={moment(values?.toDate).format("DD-MMm-YYYY")}
                value={
                  values.toDate
                    ? moment(values?.toDate, "DD-MMM-YYYY").toDate()
                    : values?.toDate
                }
                handleChange={handleChange}
                lable={t("ToDate")}
                placeholder={VITE_DATE_FORMAT}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleGetReport}
                type="button"
              >
                {t("Search")}
              </button>
            </div>

          </div>
        </div>
      </form>


    </>
  );
}
