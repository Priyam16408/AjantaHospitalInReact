import React, { useState } from 'react'
import Heading from '../../components/UI/Heading'
import ReportsMultiSelect from '../../components/ReportCommonComponents/ReportsMultiSelect'
import { useSelector } from 'react-redux';
import { handleReactSelectDropDownOptions, notify } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import ReportDatePicker from '../../components/ReportCommonComponents/ReportDatePicker';
import ReportTimePicker from '../../components/ReportCommonComponents/ReportTimePicker';
import Input from '../../components/formComponent/Input';
import ReactSelect from '../../components/formComponent/ReactSelect';
import { print_Type } from '../../utils/constant';
import ReportPrintType from '../../components/ReportCommonComponents/ReportPrintType';
import { EmgRegReportApi } from '../../networkServices/Emergency';
import moment from 'moment';
import { RedirectURL } from '../../networkServices/PDFURL';

export default function EmergencyRegisterReport() {
  const [values, setValues] = useState({ fromDate: new Date(), toDate: new Date(), GroupWise: "B", printType: "0", Fromtime: new Date(), toTime: new Date() });
  const { GetEmployeeWiseCenter } = useSelector((state) => state.CommonSlice);
  const [t] = useTranslation()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleReactSelectChange = (name, e) => {
    const obj = { ...values };
    obj[name] = e?.value;
    setValues(obj);
  }


  const EMGReGReport = async () => {
    if (!values?.centre?.length) {
      notify("Centre Field Is Required", "error")
      return false
    }
    let payload = {
      "centers": "",
      "emergencyNo": String(values?.EmergencyNo ? values?.EmergencyNo : ""),
      "billNo": String(values?.billNo ? values?.billNo : ""),
      "uhid": String(values?.UHID ? values?.UHID : ""),
      "reportType": String(values?.Type ? values?.Type : ""),
      "rdbGroupwise": String(values?.GroupWise ? values?.GroupWise : ""),
      "fromDate": moment(values?.fromDate).format("YYYY-MM-DD"),
      "toDate": moment(values?.toDate).format("YYYY-MM-DD"),
      "ToTime": moment(values?.toTime).format("hh:mm A"),
      "FromTime": moment(values?.Fromtime).format("hh:mm A"),
      "ExcelType": values?.printType?.value ? values?.printType?.value : values?.printType

    }
    values?.centre?.map((val, index) => {
      payload.centers = payload.centers + `${val?.code}${values?.centre?.length !== index+1 ? "," : ""}`
    })
    let apiResp = await EmgRegReportApi(payload)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(response?.message, "error");
    }
  }

  return (
    <>
      <div className="card patient_registration border mt-2">
        <Heading title={t("Emergency Bill Register Report")} />

        <div className="row p-2" >
          <ReportsMultiSelect
            name="centre"
            placeholderName="Centre"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={handleReactSelectDropDownOptions(
              GetEmployeeWiseCenter,
              "CentreName",
              "CentreID"
            )}
            labelKey="CentreName"
            valueKey="CentreID"
            requiredClassName={true}
          />

          <ReactSelect
            placeholderName={t("Group Wise")}
            id="GroupWise"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: "Bill Wise", value: "B" },
              { label: "Category Wise", value: "C" },
              { label: "Sub Category", value: "S" },
              { label: "Item Wise", value: "I" }
            ]}
            value={values.GroupWise}
            name="GroupWise"
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelectChange(name, e)}
          />
          <ReactSelect
            placeholderName={t("Group Wise")}
            id="Type"
            searchable
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            dynamicOptions={[
              { label: "All", value: "-1" },
              { label: "Admitted", value: "0" },
              { label: "Discharged From Emergency", value: "1" },
              { label: "Released For IPD", value: "2" },
              { label: "Shift To IPD", value: "3" },
              { label: "Bill Not Generated", value: "4" },
              { label: "Released Not Done", value: "5" }
            ]}
            value={values.Type}
            name="Type"
            removeIsClearable={true}
            handleChange={(name, e) => handleReactSelectChange(name, e)}
          />

          <ReportDatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            lable={t("fromDate")}
            values={values}
            setValues={setValues}
          // max={values?.fromDate}
          />
          <ReportTimePicker
            placeholderName="From Time"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            lable={t("FromTime")}
            id="Fromtime"
            name="Fromtime"
            values={values}
            setValues={setValues}
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
          // min={values?.toDate}
          />
          <ReportTimePicker
            placeholderName="To Time"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            lable="To Time"
            name="toTime"
            id="toTime"
            values={values}
            setValues={setValues}
          />
          <Input
            type="text"
            className="form-control "
            id="billNo"
            name="billNo"
            lable="Bill No."
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.billNo}
          />

          <Input
            type="text"
            className="form-control "
            id="UHID"
            name="UHID"
            lable="UHID"
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.UHID}
          />

          <Input
            type="text"
            className="form-control "
            id="EmergencyNo"
            name="EmergencyNo"
            lable="Emergency No."
            placeholder=" "
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            onChange={handleChange}
            value={values.EmergencyNo}
          />

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
            <button className="btn btn-sm btn-primary ml-2" type="button" onClick={EMGReGReport}>
              {t("Report")}
            </button>
          </div>
        </div>
      </div>

    </>
  )
}
