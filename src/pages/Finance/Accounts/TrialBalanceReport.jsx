import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import {
  BindAuditBackendData,
  BindVoucherBillingScreenControls,
  FinanceSaveVoucher,
} from "../../../networkServices/finance";
 
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";

function TrialBalanceReport() {
  let userData = useLocalStorage("userData", "get");
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [values, setValues] = useState({
    bindCentre: "",
    bankName: "",
    toDate: new Date(),
    fromDate: new Date(),
    currency: "",
  });

  const status = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Verified" },
    { value: "2", label: "Authorised" },
  ];
  const [dropDownState, setDropDownState] = useState({
    BindCentre: [],
    bankName: [],
  });
 
  const [branchCenter, setBranchCenter] = useState([]);
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleChange = (e) => {
    const { value, name } = e?.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const bindListData = async () => {
    let payload = {
      FilterType: 1,
      VoucherNo: "",
      CurrencyCode: null,
      VoucherType: null,
      DateFilterType: 1,
      FromDate: "10-Mar-2025",
      ToDate: "10-Mar-2025",
      CreatedBy: null,
      VerifyBy: null,
      AuthBy: null,
      DeparmentCode: null,
      SpecificAmount: "0",
      AmountCategory: 3,
      AuditStatus: "0",
      BranchCentreID: "1",
    };
    let apiResp = await BindAuditBackendData(payload);
    if (apiResp?.success) {
      console.log("the api response is FinanceSaveVoucher", apiResp);
      apiResp?.data?.map((val) => {
        if (val?.TypeID == "5") {
         setBranchCenter([val]);
        }   
      });
    } else {
      // setList([])
    }
  };

  console.log("the response from data is", branchCenter);

  useEffect(() => {
    bindListData();
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading isBreadcrumb={true} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Branch Centre")}
              id={"bindCentre"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
              dynamicOptions={[
                // { value: "0", label: "ALL" },
                ...handleReactSelectDropDownOptions(
                  branchCenter,
                  "TextField",
                  "ValueField"
                ),
              ]}
              // handleChange={handleSelect}
              value={`${values?.bindCentre?.value}`}
              name={"bindCentre"}
            />

         
            <ReactSelect
              placeholderName={t("Voucher Type")}
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

            <ReactSelect
              placeholderName={t("Filter Type")}
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
              id="fromDate"
              name="fromDate"
              value={
                values.fromDate
                  ? moment(values?.fromDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={handleChange}
              lable={t("From Date")}
              placeholder={VITE_DATE_FORMAT}
              inputClassName={"required-fields"}
            />
            <DatePicker
              className="custom-calendar form-group"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id="toDate"
              name="toDate"
              value={
                values.toDate
                  ? moment(values?.toDate, "YYYY-MM-DD").toDate()
                  : null
              }
              maxDate={new Date()}
              handleChange={handleChange}
              lable={t("To Date")}
              placeholder={VITE_DATE_FORMAT}
              inputClassName={"required-fields"}
            />

            <ReactSelect
              placeholderName={t("Created By")}
              id="createdBy"
              name="createdBy"
              value={values?.bindCentre}
              handleChange={(name, e) => handleReactSelect(name, e)}
              // removeIsClearable={true}
              // dynamicOptions={[]}
              dynamicOptions={dropDownState?.BindCentre}
              searchable={true}
              requiredClassName="required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <LabeledInput
                label={t("Currency")}
                value={values?.currency?.value}
              />
            </div>

            <ReactSelect
              placeholderName={t("Verify By")}
              id="verifyBy"
              name="verifyBy"
              value={values?.bindCentre}
              handleChange={(name, e) => handleReactSelect(name, e)}
              // removeIsClearable={true}
              // dynamicOptions={[]}
              dynamicOptions={dropDownState?.BindCentre}
              searchable={true}
              requiredClassName="required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              placeholderName={t("Auth By")}
              id="authBy"
              name="authBy"
              value={values?.bindCentre}
              handleChange={(name, e) => handleReactSelect(name, e)}
              // removeIsClearable={true}
              // dynamicOptions={[]}
              dynamicOptions={dropDownState?.BindCentre}
              searchable={true}
              requiredClassName="required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              placeholderName={t("Department")}
              id="department"
              name="department"
              value={values?.bindCentre}
              handleChange={(name, e) => handleReactSelect(name, e)}
              // removeIsClearable={true}
              // dynamicOptions={[]}
              dynamicOptions={dropDownState?.BindCentre}
              searchable={true}
              requiredClassName="required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <ReactSelect
              placeholderName={t("Adult Status")}
              id="status"
              name="status"
              value={values?.status}
              handleChange={(name, e) => handleReactSelect(name, e)}
              dynamicOptions={status}
              searchable={true}
              requiredClassName="required-fields"
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12 d-flex">
              <div className="col-sm-1">
                <button
                  className="btn btn-sm btn-success"
                  // onClick={() => handleSearchViewReqDetails("")}
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

export default TrialBalanceReport;
