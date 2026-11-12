import React, { useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import Tables from "../UI/customTable";
import DatePicker from "../formComponent/DatePicker";
import TimePicker from "../formComponent/TimePicker";
import CustomSelect from "../formComponent/CustomSelect";
import Input from "../formComponent/Input";
import {
  BindDiabiaticChart,
  BindDiabiaticParticular,
  DiabeticChartSave,
  DiabeticChartUpdate,
  NursingWardDiabeticChartPrintAPI,
} from "../../networkServices/nursingWardAPI";
import {
  handleDiabeticChartSavePayload,
  handleDiabeticChartUpdatePayload,
  notify,
  parseTimeString,
  reactSelectOptionList,
} from "../../utils/utils";
import { GetBindDoctorDept } from "../../networkServices/opdserviceAPI";
import { PrintSVG } from "../SvgIcons";
import { OpenPDFURL, RedirectURL } from "../../networkServices/PDFURL";



const DiabeticChart = ({ data }) => {
  const { transactionID, patientID } = data; 
  const [t] = useTranslation();
 
  const DIABETIC_CHART_THEAD = [
    { name: t("SNo") }, 
    { name: t("Date") },
    { name: t("Time") },
    { name: t("Particulars") },
    { name: t("ValueMmolL CBG") }, 
    { name: t("Correction") },
    { name: t("DoctorName") },
    { name: t("UserName") }, 
    { name: t("EntryDate") },
    { name: t("Action") }
    // "S.No.",
    // "Date",
    // "Time",
    // "Particulars",
    // "Value (mmol/L) / CBG",
    // "Correction",
    // "Doctor Name",
    // "	User Name",
    // "Entry Date",
    // "Action",
  ];

  const initialValues = {
    particularItem: "",
    cbg: "",
    patientID: patientID,
    transactionID: transactionID,
    date: new Date(),
    time: new Date(),
    correction: "",
    doctorId: "",
  };
 
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [diabeticChartTbody, setDiabeticChartTbody] = useState([]);
  const [dropDownState, setDropDownState] = useState({
    Particulars: [],
    Doctor: [],
  });
  const [Editindex, setIndex] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...diabeticChartTbody];
    data[index][name] = value;
    setDiabeticChartTbody(data);
  };

  const handleCustomSelect = (index, name, e) => {
    const data = [...diabeticChartTbody];
    data[index][name] = e.value;
    setDiabeticChartTbody(data);
  };

  const handleSaveAPI = async (data) => {
    console.log(data)

    if(!data?.cbg && !data?.correction){
      notify("CBG or Correction can't be empty","error");
      return;
    }
    try {
      const payload = handleDiabeticChartSavePayload(data);
      const response = await DiabeticChartSave(payload);
      if (response?.success) {
        notify(response?.message);
        handleBindDiabiaticChart(transactionID);
      } else {
        notify(response?.message);
      }
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };


  const handleUpdate = async (data) => {
    try {
      const payload = handleDiabeticChartUpdatePayload(data);
      const response = await DiabeticChartUpdate(payload);
      if (response?.success) {
        setIndex(null);
        notify(response?.message);
        handleBindDiabiaticChart(transactionID);
      } else {
        notify(response?.message);
      }
    } catch (error) {
      console.log("something Went Wrong");
    }
  };

  const handleBindDiabiaticChart = async (transactionID) => {
    try {
      const data = await BindDiabiaticChart(transactionID);
      setDiabeticChartTbody([{ ...initialValues }, ...data?.data]);
    } catch (error) {
      console.log("Something Went Wrong");
    }
  };

  const DIABETIC_CHART_INPUT_FIELD = (addState, index) => {
    return {
      "S.No.": "*",
      Date: (
        <div style={{ minWidth: "100px" }}>
          <DatePicker
            className="custom-calendar"
            respclass={"table-calender-height"}
            value={addState?.date}
            // respclass="col-xl-2 col-md-3 col-sm-4 col-12"
            removeFormGroupClass={true}
            id="Date"
            name="date"
            placeholder={VITE_DATE_FORMAT}
            showTime
            hourFormat="12"
            handleChange={(e) => handleChange(e, index)}
          />
        </div>
      ),
      Time: (
        <TimePicker
          placeholderName="Time"
          className="table-calender-height"
          value={addState?.time}
          id="Fromtime"
          name="time"
          handleChange={(e) => handleChange(e, index)}
        />
      ),
      Particulars: (
        <CustomSelect
          option={dropDownState?.Particulars}
          placeHolder={t("Select Particulars")}
          value={addState?.particularItem}
          name="particularItem"
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      ),
      cbg: (
        <Input
          type="number"
          className="table-input"
          name={"cbg"}
          removeFormGroupClass={true}
          onChange={(e) => handleChange(e, index)}
          value={addState?.["cbg"]}
        />
      ),
      Correction: (
        <Input
          type="text"
          className="table-input"
          name={"correction"}
          removeFormGroupClass={true}
          value={addState?.correction}
          onChange={(e) => handleChange(e, index)}
        />
      ),
      "Doctor Name": (
        <CustomSelect
          option={dropDownState?.Doctor}
          placeHolder={t("Select Doctor")}
          value={addState?.["doctorId"]}
          name="doctorId"
          onChange={(name, e) => handleCustomSelect(index, name, e)}
        />
      ),
      "	User Name": "-",
      "Entry Date": "-",
      Action:
        Editindex === index ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleUpdate(addState)}
          >
            {t("Update")}
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              handleSaveAPI(addState);
            }}
          >
            {t("Save")}
          </button>
        ),
    };
  };

  const handleEdit = (items, index) => {
    const data = [...diabeticChartTbody];
    const handleItems = {
      ID: items?.ID,
      particularItem: items?.Particulars,
      cbg: items?.CBG,
      patientID: patientID,
      transactionID: transactionID,
      date: new Date(items?.DATE),
      time: parseTimeString(items?.TIME),
      correction: items?.Correction,
      doctorId: items?.DoctorID,
    };
    data[index] = handleItems;
    setDiabeticChartTbody(data);
    setIndex(index);
  };

  const settleValue = (items, index) => {
    const returnValue = {
      SNO: null,
      date: null,
      time: null,
      cgb: null,
      Particulars: null,
      correction: null,
      doctorName: null,
      username: null,
      EntryDate: null,
      Action: null,
    };

    returnValue.SNO = index;

    returnValue.date = items?.DATE;

    returnValue.time = items?.TIME;

    returnValue.cgb = items?.CBG;

    returnValue.Particulars = items?.Particulars;

    returnValue.correction = items?.Correction;

    returnValue.doctorName = items?.DrName;

    returnValue.username = items?.EntryBy;

    returnValue.EntryDate = items?.EntryDate;

    returnValue.Action = (
      <i
        className="fa fa-edit p-1 text-primary"
        aria-hidden="true"
        onClick={() => handleEdit(items, index)}
      ></i>
    );

    return returnValue;
  };

  const handleTbody = (data) => {
    const returnValue = data?.map((items, index) => {
      if (index === 0 || Editindex === index) {
        return DIABETIC_CHART_INPUT_FIELD(items, index);
      } else {
        const {
          SNO,
          date,
          time,
          cgb,
          Particulars,
          correction,
          doctorName,
          username,
          EntryDate,
          Action,
        } = settleValue(items, index);
        return {
          SNO,
          date,
          time,
          Particulars,
          cgb,
          correction,
          doctorName,
          username,
          EntryDate,
          Action,
        };
      }
    });

    return returnValue;
  };

  const fetchAPI = async () => {
    try {
      const response = await Promise.all([
        await BindDiabiaticParticular(),
        await GetBindDoctorDept("All"),
      ]);

      console.log(response[1]);

      const ParticularsAPIResponse = response[0];
      const DoctorAPIResponse = response[1];

      const Particulars = reactSelectOptionList(
        ParticularsAPIResponse?.data,
        "ItemText",
        "ItemText"
      );

      const Doctor = reactSelectOptionList(
        DoctorAPIResponse?.data,
        "Name",
        "DoctorID"
      );

      setDropDownState({
        ...dropDownState,
        Particulars: Particulars,
        Doctor: Doctor,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePrint = async () => {
    // OpenPDFURL("NursingWardDiabeticChartPrint",transactionID,patientID,"")
    // data?.ipdno
    let payload = {
      "tid": transactionID,
      "pid": patientID,
      "emgNo": ""
    }
    let apiResp = await NursingWardDiabeticChartPrintAPI(payload)
    if (apiResp?.success) {
      RedirectURL(apiResp?.data?.pdfUrl);
    } else {
      notify(apiResp?.message, "error")
    }

  }

  useEffect(() => {
    fetchAPI();
    handleBindDiabiaticChart(transactionID);
  }, []);

  return (
    <div className="mt-2 spatient_registration_card">
      <div className="patient_registration card">
        <Heading
          title={t("Diabetic Chart")}
          isBreadcrumb={false}
        />

        <div className="table-content p-2">
          <Tables
            thead={DIABETIC_CHART_THEAD}
            tbody={handleTbody(diabeticChartTbody)}
          />
        </div>

        <div className="d-flex justify-content-end align-items-center">
          <div onClick={handlePrint}>{PrintSVG()}</div>
        </div>
      </div>
    </div>
  );
};

export default DiabeticChart;
