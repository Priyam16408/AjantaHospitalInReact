import React, { useEffect, useState } from "react";
import Input from "../../../components/formComponent/Input";
import { t } from "i18next";
import DatePicker from "../../../components/formComponent/DatePicker";
import TimePicker from "../../../components/formComponent/TimePicker";
import DischargeSummaryTable from "../../../components/UI/customTable/doctorTable/ViewDischargeSummary/DischargeSummaryTable";
import moment from "moment";
import { ViewDischargeSummaryBind } from "../../../networkServices/DoctorApi";
const ViewDischargeSummary = (props) => {
  const {patientDetail} = props
  console.log(patientDetail);
  
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [apiData, setApiData] = useState({
    getViewDischargeSummaryBind:[],
  })

  const ViewDischargeSummaryBindDetail = async ()=>{
    try {
      // const res = await ViewDischargeSummaryBind(patientDetail?.currentPatient?.TransactionID)
      const res = await ViewDischargeSummaryBind("AM24-05090001")
      console.log(res);
      setApiData((prev)=> ({...prev, getViewDischargeSummaryBind:res.data}))
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    
    ViewDischargeSummaryBindDetail()
  }, []);

  return (
    <>
      <div className="row g-4 m-2 align-items-center">
        <DatePicker
          className="custom-calendar"
          id="DOB"
          name="fromDate"
          lable={"Discharge Date"}
          placeholder={VITE_DATE_FORMAT}
          respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
        />

        {/* <TimePicker
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          placeholderName="Discharge Time"
        /> */}

        <Input
            type="text"
            className={`form-control `}
            id="TemplateName"
            lable={t("Discharge Time")}
            placeholder=" "
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12 mt-2 "
            name="appointmentNo"
            // onChange={(e) => setTemplateName(e.target.value)}
            // value={templateName}
            disabled={true}
            value={moment().format('hh:mm A')}
          />

      </div>
        <DischargeSummaryTable tbody={apiData.getViewDischargeSummaryBind} />
    </>
  );
};

export default ViewDischargeSummary;
