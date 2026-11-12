import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect"; 
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";  
import { handleReactSelectDropDownOptions } from "../../../utils/utils";

function VoucherAudit() { 
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const [values, setValues] = useState({
    bindCentre: "",
    bankName: "",
    toDate: new Date(),
    fromDate: new Date(),
    currency: "",
  });

  
  const [branchCenter, setBranchCenter] = useState([]);
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleChange = (e) => {
    const { value, name } = e?.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  

  useEffect(() => { 
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

export default VoucherAudit;
