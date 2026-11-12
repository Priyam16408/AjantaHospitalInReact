import React, { useEffect, useRef, useState, useTransition } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import DatePicker from "../../../components/formComponent/DatePicker";
import moment from "moment";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { notify } from "../../../utils/utils";
// import Tables from "../../../components/UI/customTable";
// import Input from "../../../components/formComponent/Input";
// import { BindVoucherBillingScreenControls } from "../../../networkServices/finance";
// import { filterByTypes } from "../../../utils/utils";
// import VoucherBookingTable from "./VoucherBookingTable";
// import ReactSelect from "../../../components/formComponent/ReactSelect";


function VoucherBooking() {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const { empName } = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const [sessionDate, setSessionDateState] = useState(
    useLocalStorage("newSession", "get") || moment().format("DD-MMM-YYYY")
  );

  // Function to update session date in localStorage and state
  const updateSessionDate = (date) => {
    const formattedDate = moment(date).format("DD-MMM-YYYY");
    useLocalStorage("newSession", "set", formattedDate);
    notify("Session Updated Successfully", "success")
    setSessionDateState(formattedDate); // Update state to trigger re-render
    
    setValues((val) => ({
      ...val,
      CurrentSessionDate: formattedDate, // Set current session to new date
      SetNewSessionDate: new Date() // Reset new session date to today
    }));
  };

  // State for form values
  const [values, setValues] = useState({
    Status: 1,
    CurrentSessionDate: sessionDate,
    SetNewSessionDate: new Date(),
  });

  console.log(values);
  // Sync CurrentSessionDate with sessionDate
  // useEffect(() => {
  //   setValues((prev) => ({
  //     ...prev,
  //     CurrentSessionDate: sessionDate,
  //     SetNewSessionDate: new Date()
  //   }));
  // }, [sessionDate]);

  const handleDateChange = (e) => {
    const { value, name } = e?.target
    setValues((val) => ({ ...val, [name]: value }))

  }

  console.log(values);
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSessionDate(values.SetNewSessionDate);
  };

  return (<>
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading isBreadcrumb={true} />
        <form className="row p-2">
          <div className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2">
            <LabeledInput label={t("User Name")} value={empName} />
          </div>
          <div className={"col-xl-2 col-md-4 col-sm-6 col-12 mb-2"}>
            <LabeledInput label={t("Status")} value={values.Status === 1 ?"Active":"InActive" } />
          </div>
          <LabeledInput label={t("Current Session Date")} value={values.CurrentSessionDate} className={"col-xl-2 col-md-4 col-sm-6 col-12 mb-2"} />


          <DatePicker
            className="custom-calendar"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            id="SetNewSessionDate"
            name="SetNewSessionDate"
            value={moment(values?.SetNewSessionDate).toDate()}
            maxDate={new Date()}
            handleChange={handleDateChange}
            lable={t("Set New Session Date")}
            placeholder={VITE_DATE_FORMAT}
          />

          <div className="box-inner ">
            <button
              className="btn btn-sm btn-primary ml-2"
              type="submit"
              onClick={handleSubmit}
            >
              {t("Save")}
            </button>
          </div>
        </form>

      </div>
    </div >

  </>
  );



}

export default VoucherBooking;
