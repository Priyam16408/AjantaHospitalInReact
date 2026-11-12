import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { SaveRateSchedule, ServicesRateSetup, UpdateRateSchedule } from '../../../networkServices/EDP/edpApi';
import DatePicker from '../../../components/formComponent/DatePicker';
import moment from 'moment';
import ReactSelect from '../../../components/formComponent/ReactSelect';
import Input from '../../../components/formComponent/Input';
import Heading from '../../../components/UI/Heading';
import Tables from '../../../components/UI/customTable';
import { notify } from '../../../utils/utils';
const RateScheduleCharges = () => {
  const [t] = useTranslation()
  const [payloadData, setPayloadData] = useState({
    panel: { label: "ALL", value: "" },
    fromDate: new Date,
    toDate: new Date,
    cbChecked: 0,
  })
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [reportControlList, setReportControlList] = useState([])

  const getBindPannelControls = async () => {
    let apiResp = await ServicesRateSetup(payloadData.panel.label)
    if (apiResp?.success) {
      let data = apiResp?.data?.map((val) => ({
        ...val,
        isChecked: val?.IsDefault === 1 ? true : false
      }))
      console.log("data", data)
      setReportControlList(data)
    } else {
      setReportControlList([])

    }
  }

  useEffect(() => {
    if (reportControlList?.length) {
      const defaultSelected = reportControlList
        .filter((val) => val.IsDefault === 1)
        .map((val) => ({
          ScheduleChargeID: val.ScheduleChargeID,
          PanelID: val.PanelID,
          rateName: val.NAME,
          checkDefault: val.IsDefault !== 0,
          fromDate: moment(val.DateFrom).format("DD-MMM-YYYY"),
          toDate: moment(val.DateTo).format("DD-MMM-YYYY"),
        }));

      setSelectedSchedules(defaultSelected);
    }
  }, [reportControlList]);


  useEffect(() => {
    getBindPannelControls()
  }, [payloadData.panel])


  const handleChange = (e) => {
    setPayloadData((val) => ({ ...val, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if(payloadData.panel.label === "ALL" || payloadData.panel.value === '' ){
      notify("please Select Panel","error")
      return;
    }

    if (!payloadData?.rateName) {
      notify("Please Enter Schedule Name", "error");
      return;
    }
    const hasPreviousDefaults = selectedSchedules.some(item => item.checkDefault);
    if (hasPreviousDefaults && payloadData?.cbChecked) {
      notify("Please update previous default Schedule charges for the panel", "error");
      return;
    }

    let data = {
      panelID: payloadData?.panel?.value || 0,
      rateName: payloadData?.rateName || "",
      cbChecked: payloadData?.cbChecked,
      fromDate: moment(payloadData?.fromDate).format("DD-MMM-YYYY"),
      toDate: moment(payloadData?.toDate).format("DD-MMM-YYYY"),
      schedules: selectedSchedules?.length > 0 ? selectedSchedules.map((item) => ({
        panelID: item.PanelID, // Correct panel ID mapping
        checkDefault: item.checkDefault,
      })) : [{ panelID: 0, checkDefault: false }],
    }
    const apiresp = await SaveRateSchedule(data);
    if (apiresp.success) {
      notify(apiresp.message, "success");
      getBindPannelControls()
    } else {
      notify(apiresp.message, "error");
    }

  }


  const handleRowSelect = (e, index, val) => {
    let data = [...reportControlList]

    const hasSamePanelId = data?.some((item, idx) => item?.PanelID === val?.PanelID && item.isChecked && idx !== index);

    if (hasSamePanelId) {
      notify("No two Schedule Charges can be set as default for the same Panel.", "error");
      return 0; // Do not update the selection
    }
    data[index]["isChecked"] = e.target?.checked
    setReportControlList(data)

  };


  const thead = [
    { width: "5%", name: t("Panel Name") },
    { width: "5%", name: t("Name") },
    { width: "5%", name: t("Valid From") },
    { width: "5%", name: t("Valid To") },
    { width: "5%", name: t("Current Default") },
    { width: "5%", name: t("Set Default") },
  ]

  const handleUpdate = async () => {
    let apiresp;
    const filteredData = reportControlList
      .filter(item => item.isChecked === true || item.IsDefault === 1) // Filter based on conditions
      .map(item => ({
        scheduleID: item.ScheduleChargeID,
        checkDefault: item.isChecked 
      }));
    apiresp = await UpdateRateSchedule(filteredData);

    if (apiresp.success) {
      notify(apiresp.message, "success");
      getBindPannelControls()
    } else {
      notify(apiresp.message, "error");
    }

  }

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Panel")}
            id="Panel"
            name="panel"
            value={payloadData?.panel?.value}
            removeIsClearable={true}
            handleChange={(name, value) => setPayloadData((val) => ({ ...val, [name]: value }))}
            dynamicOptions={[
              { label: "Select", value: "" },
              { label: "Cash", value: "1" },
              { label: "CGHS", value: "90" },
            ]}
            searchable={true}
            respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          />
          <Input
            type="text"
            className="form-control required-fields"
            id="rateName"
            name="rateName"
            lable={t("Schedule Name")}
            value={payloadData.rateName}
            onChange={handleChange}
            placeholder=""
            required={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          />
          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("From Date")}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            name="fromDate"
            id="fromDate"
            maxDate={new Date()}
            value={payloadData?.fromDate ? moment(payloadData.fromDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "fromDate")}
          />

          <div className="col-xl-2 col-md-3 col-sm-6 col-4  d-flex align-items-center">
            <span className='mr-2'>{t("Set It Current")}</span>

            <input
              type="checkbox"
              checked={payloadData.cbChecked}
              onChange={() =>
                setPayloadData({ ...payloadData, cbChecked: !payloadData.cbChecked })
              }

            />
          </div>
          <DatePicker
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("To Date")}
            respclass={"col-xl-2 col-md-4 col-sm-6 col-12"}
            name="toDate"
            id="toDate"
            maxDate={new Date()}
            value={payloadData?.toDate ? moment(payloadData.toDate).toDate() : new Date}
            showTime
            hourFormat="12"
            handleChange={(date) => handleChange(date, "toDate")}
          />
          <div className="col-xl-1 col-md-2 col-sm-2 col-4  mb-2">
            <button className="btn btn-sm btn-primary  w-100   " onClick={handleSave} type="button" >
              {t("Save")}
            </button>
          </div>

        </div>

        <div>
          <Heading title={"Schele of Charges"}
          />
          <Tables thead={thead} tbody={reportControlList?.map((val, index) => {
            return {
              "Pannel Name": val?.Pname,
              "Name": val?.NAME,
              "Valid From": val?.DateFrom,
              "Valid To": val?.DateTo,
              "Current Default": val?.IsDefault === 1 ? "Yes" : "No",
              "Set Default": (
                <input
                  type='checkbox'
                  style={{ marginRight: "20px" }}
                  // checked={selectedSchedules.some((item) => item.ScheduleChargeID === val.ScheduleChargeID)}
                  checked={val?.isChecked}
                  onChange={(e) => handleRowSelect(e, index, val)}
                />
              )
            }

          })}
          />
          <div className="col-xl-1 col-md-2 col-sm-2 col-4 m-auto  py-2">
            <button className="btn btn-sm btn-primary  w-100  " onClick={handleUpdate} type="button" >
              {t("Update")}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RateScheduleCharges;