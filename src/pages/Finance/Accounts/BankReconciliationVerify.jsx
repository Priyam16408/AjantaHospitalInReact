import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { BindVoucherBillingScreenControls } from "../../../networkServices/finance";
import { filterByTypes, handleReactSelectDropDownOptions } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { current } from "@reduxjs/toolkit";
//import VoucherBookingTable from "./VoucherBookingTable";


function BankReconciliationVerify() {

  let userData = useLocalStorage("userData", "get");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation()
  const [values, setValues] = useState({
    bindCentre: "",
    bankName: "",
    toDate: new Date(),
    fromDate: new Date(),
    currency: ""

  })
  // const [list, setList] = useState([])
  //const [bodyData, setBodyData] = useState([{ Sno: "1", AccountName: "" }])
  const status = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Verified" },
    { value: "2", label: "Authorised" },
  ]
  const [dropDownState, setDropDownState] = useState({
    BindCentre: [],
    bankName: [],
  });
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }))
  }

  const handleChange = (e) => {
    const { value, name } = e?.target
    setValues((val) => ({ ...val, [name]: value }))
  }

  const bindListData = async () => {
    let apiResp = await BindVoucherBillingScreenControls(1)
    if (apiResp?.success) {
      const bankName = filterByTypes(apiResp?.data, [8], ["TypeID"], "TextField", "ValueField")
      setDropDownState((val) => ({
        ...val,
        bankName: handleReactSelectDropDownOptions(
          bankName,
          "label",
          "value"
        ),
      }))
      const Currency = filterByTypes(apiResp?.data, [4], ["TypeID"], "TextField", "ValueField", "TypeCode")
      if (Currency?.length > 0) {
        setValues((val) => ({ ...val, currency: Currency[0] }))
      }
      // if (Bank?.length > 0) {
      //   setValues((val) => ({ ...val, Bank: { value: Bank[0]['value'] } }))
      // }

      // setList(apiResp?.data)
    } else {
      // setList([])
    }
  }

  const centreEmp = async () => {
    const employeeId = userData?.employeeID
    // const response = await FinanceEmployeeWiseCentreList(employeeId)
    // setDropDownState((val) => ({
    //   ...val,
    //   BindCentre: handleReactSelectDropDownOptions(
    //     response?.data,
    //     "CentreName",
    //     "CentreID"
    //   ),
    // }))
  }
  useEffect(() => {
    centreEmp()
    bindListData()
  }, [])

  return (<>
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading isBreadcrumb={true} />
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Centre")}
            id="bindCentre"
            name="bindCentre"
            value={values?.bindCentre}
            handleChange={(name, e) => handleReactSelect(name, e)}
            // removeIsClearable={true}
            // dynamicOptions={[]}
            dynamicOptions={dropDownState?.BindCentre}
            searchable={true}
            requiredClassName="required-fields"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="toDate"
            name="toDate"
            value={values.toDate ? moment(values?.toDate, "YYYY-MM-DD").toDate() : null}
            maxDate={new Date()}
            handleChange={handleChange}
            lable={t("To Date")}
            placeholder={VITE_DATE_FORMAT}
            inputClassName={"required-fields"}
          />
          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="fromDate"
            name="fromDate"
            value={values.fromDate ? moment(values?.fromDate, "YYYY-MM-DD").toDate() : null}
            maxDate={new Date()}
            handleChange={handleChange}
            lable={t("From Date")}
            placeholder={VITE_DATE_FORMAT}
            inputClassName={"required-fields"}
          />
          <ReactSelect
            placeholderName={t("Status")}
            id="status"
            name="status"
            value={values?.status}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={status}
            searchable={true}
            requiredClassName="required-fields"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <ReactSelect
            placeholderName={t("Bank Name")}
            id="bankName"
            name="bankName"
            value={values?.bankName}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={dropDownState?.bankName}
            searchable={true}
            requiredClassName="required-fields"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
            <div className="w-50 ml-2">
              <LabeledInput label={t("Currency")} value={values?.currency?.value} />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSearchViewReqDetails("")}
              >
                {t("Search")}
              </button>
            </div>
          </div>

        </div>


      </div>
    </div>
    <div className="mt-2 spatient_registration_card">
      {/* <div className="patient_registration card">

        {list?.length > 0 && <VoucherBookingTable tbody={bodyData} setOldBodyData={setBodyData} list={list} type={values?.VoucherType} />}

      </div> */}
    </div>
  </>
  );



}

export default BankReconciliationVerify;
