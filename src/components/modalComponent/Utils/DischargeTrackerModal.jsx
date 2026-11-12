import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DischargeExport
} from "../../../networkServices/BillingsApi";
import { notify } from "../../../utils/utils";
import moment from "moment";
import DatePicker from "../../formComponent/DatePicker";
import { exportToExcel } from "../../../utils/exportLibrary";

const DischargeTrackerModal = () => {

  const [t] = useTranslation();

  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
  });


  const { VITE_DATE_FORMAT } = import.meta.env;
  const searchHandleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };



  const handleExport = async () => {

    const payload1 = {
      FromDate: moment(payload?.FromDate).format("DD-MM-YYYY"),
      ToDate: moment(payload?.ToDate).format("DD-MM-YYYY"),
    };

    try {
      let apiResp = await DischargeExport(payload1);
      if (apiResp?.success) {
        // notify(apiResp?.data);
        exportToExcel(apiResp?.data,"dischargeTracker");
      } else { 
        notify(apiResp?.message, "error");
        notify([]);
      }
    } catch (error) {
      notify("Error occurred while processing request", "error");
    }
  };

  return (
    <>
      <div className="row">
        <DatePicker
          className="custom-calendar"
          id="FromDate"
          name="FromDate"
          lable={"From Date"}
          placeholder={VITE_DATE_FORMAT}
          respclass={"col-xl-6 col-md-6 col-sm-6 col-12"}
          value={payload?.FromDate}
          handleChange={searchHandleChange}
        />
        <DatePicker
          className="custom-calendar"
          id="ToDate"
          name="ToDate"
          lable={"To Date"}
          placeholder={VITE_DATE_FORMAT}
          respclass={"col-xl-6 col-md-6 col-sm-6 col-12"}
          value={payload?.ToDate}
          handleChange={searchHandleChange}
        />
      </div>

      <div className="d-flex align-items-center justify-content-end">
        <button
          className="btn btn-sm btn-success"
          style={{ color: "white", border: "none" }}   
          onClick={handleExport}
        >
          Export to Excel
        </button> 
      </div>
    </>
  );
};
export default DischargeTrackerModal;
