import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import TimePicker from "../../../components/formComponent/TimePicker";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import moment from "moment";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Modal from "../../../components/modalComponent/Modal";
import {
  EDPCreateOT,
  EDPGetDoctorBookedSlots,
  EDPGetExitingOT,
  EDPGetOTs,
  EDPSaveDoctorSlotAllocations,
  OTGetOTSlots,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/ustil2";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { GetBindDoctorDept } from "../../../networkServices/opdserviceAPI";
import { reactSelectOptionList } from "../../../utils/utils";
import store from "../../../store/store";
import { setLoading } from "../../../store/reducers/loadingSlice/loadingSlice";
import DatePicker from "../../../components/formComponent/DatePicker";
import CommonSlotSelector from "./CommonSlotSelector";

const OTmaster = () => {
  const [t] = useTranslation();

  const userData = useLocalStorage("userData", "get");

  const initialValues = {
    OTName: "",
    OTStarttime: new Date(),
    OTEndtime: new Date(),
    SelectDate: new Date(),
    slotDuration: "",
    ScheduleBy: { label: "Days", value: "1" },
    SelectDay: { label: "Mon", value: "Mon" },
  };
  const [dataGoing, setDataGoing] = useState([]);
  const [dropDownState, setDropDownState] = useState({ BindDoctorDept: [] });

  const [values, setValues] = useState({ ...initialValues });
  // console.log("values", values);
  const [tableData, setTableData] = useState([]);

  const THEAD = [
    { name: t("S.No"), width: "1%" },
    { name: t("OT Name"), width: "10%" },
    { name: t("Start Time"), width: "10%" },
    { name: t("End Time"), width: "10%" },
    { name: t("Slot Duration"), width: "5%" },
    { name: t("Created By"), width: "5%" },
    { name: t("Created On"), width: "5%" },
  ];

  const [modalData, setModalData] = useState({
    show: false,
    component: null,
    size: null,
    header: null,
    footer: <></>,
  });

  const getDoctorBoookedSlot = async (DoctorID) => {
    const response = await EDPGetDoctorBookedSlots(DoctorID);
    if (response?.success) {
      setValues((val) => ({ ...val, DoctorSlots: response?.data }));
    } else {
      notify(response?.message, "error");
      setValues((val) => ({ ...val, DoctorSlots: [] }));
    }
  };
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSetData = (modifiedData, index) => {
    const data = [...values?.OTs];
    data[index] = modifiedData;
    setValues((val) => ({
      ...val,
      bodyData: data,
    }));
    setModalData({
      show: false,
      component: null,
      header: null,
      size: null,
    });
  };

  const EDPGetOTsAPI = async (scheduleDay, doctorID) => {
    const payloadToBe = {
      scheduleDate:
        values?.ScheduleBy?.label === "Date" ? values?.SelectDate : "",
      scheduleDay: values?.ScheduleBy?.label === "Days" ? scheduleDay : "",
      doctorID: doctorID,
      applyExpiredFilter: 0,
      checkedDoctorBookedSlots: 1,
      checkedPatientBookedSlots: 0,
      isForDoctorSlotAllocation: 1,
      filterDoctorSpecifiedSlot: 0,
    };
    const response = await OTGetOTSlots(payloadToBe);
    if (response?.success) {
      return response?.data;
    } else {
      notify(response?.message, "error");
    }
  };

  const handleAPI = (data) => {
    data?.map((ot) => {
      const otSlots = JSON.parse(JSON.stringify(ot?.slots)).filter((s) => s.status === "Selected");
      if (otSlots?.length > 0) {
        const firstSlot = otSlots?.[0];
        const lastSlot = otSlots?.[otSlots?.length - 1];
        const newSlot = {
          ID: `${ot.otid}-${lastSlot?.endDisplayTime}`,
          OTID: Number(ot.otid),
          startTime: firstSlot?.startDisplayTime,
          endTime: lastSlot?.endDisplayTime,
          Name: ot.otName,
          isDayWiseSelection: values?.ScheduleBy?.label === "Days" ? 1 : 0,
          scheduleOnText: values?.ScheduleBy?.label === "Days" ? values?.SelectDay?.value : values?.ScheduleBy?.label === "Date" ? moment(values?.SelectDate).format("DD-MMM-YYYY") : "",
        };
        setValues((val) => ({ ...val, DoctorSlots: [...val?.DoctorSlots, newSlot] }));
      }
    });
    setModalData({
      show: false,
      component: null,
      size: null,
    })
  }
  const handleSlotModal = async () => {
    if (!values?.DoctorName?.value) {
      notify("Please Select Doctor", "error");
      return;
    }
    if (values?.ScheduleBy?.label === "Date") {
      if (!values?.SelectDate) {
        notify("Please select Date", "error");
        return;
      }
    } else if (values?.ScheduleBy?.label === "Days") {
      if (!values?.SelectDay) {
        notify("Please Select Day", "error");
        return;
      }
    }
    const data = await EDPGetOTsAPI(
      values?.SelectDay?.value,
      values?.DoctorName?.value
    );

    setModalData({
      show: true,
      buttonName: t("Save"),
      footer: null,
      modalData: [],
      component: (
        <div>
          <CommonSlotSelector
            reactSelectType={values?.ScheduleBy?.label === "Days" ? 1 : 0}
            data={{ ...values, OTs: data }}
            onSetValues={setValues}
            setModalData={setModalData}
            dayOptions={[
              { label: "Mon", value: "Mon" },
              { label: "Tue", value: "Tue" },
              { label: "Wed", value: "Wed" },
              { label: "Thu", value: "Thu" },
              { label: "Fri", value: "Fri" },
              { label: "Sat", value: "Sat" },
              { label: "Sun", value: "Sun" },
            ]}
            slotDisplayMap={{
              Available: "#A8E6CF",
              Booked: "rgb(129 169 181)",
              Expired: "#D1C4E9",
              Approved: "#F8BBD0",
              Selected: "#F78DA7",
            }}
            slotClassMap={{
              Expired: "statusAppointment",
              Approved: "statusUnregistered",
            }}
            fetchSlotsAPI={EDPGetOTsAPI}
          />
        </div>
      ),
      handleAPI: handleAPI,
      size: "100vw",
      header: "Doctor Slot",
    });
  };

  const EDPGetExitingOTAPI = async () => {
    const response = await EDPGetExitingOT();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSave = async () => {
    if (!values?.OTName && !values?.SlotMins) {
      notify("Please Select Required Fields", "error");
      return;
    }
    const payloadToBe = {
      otName: values?.OTName,
      otStartTime: moment(values?.OTStarttime).format("hh:mm A"),
      otEndTime: moment(values?.OTEndtime).format("hh:mm A"),
      slotMins: values?.SlotInMins,
    };

    const response = await EDPCreateOT(payloadToBe);
    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialValues);
      EDPGetExitingOTAPI();
    } else {
      notify(response?.message, "error");
    }
  };
  const handleSaveDoctorSlotAllocation = async () => {
    debugger;
    const payloadToBe = {
      doctorID: values?.DoctorName?.value,
      slotList: values?.DoctorSlots?.map((ele) => ({
        startTime: ele?.startTime,
        endTime: ele?.endTime,
        scheduleOnText: ele?.scheduleOnText,
        isDayWiseSelection: ele?.isDayWiseSelection,
        otID: ele?.OTID,
      })),
    };

    const response = await EDPSaveDoctorSlotAllocations(payloadToBe);
    if (response?.success) {
      notify(response?.message, "success");
      EDPGetExitingOTAPI();
      setValues((val) => ({
        ...val,
        DoctorSlots: [],
        DoctorName: null,
        ScheduleBy: { label: "Days", value: "1" },
        SelectDay: { label: "Mon", value: "Mon" },
      }));
    } else {
      notify(response?.message, "error");
    }
  };

  const renderApiCalls = async () => {
    store.dispatch(setLoading(true));
    try {
      const [BindDoctorDept] = await Promise.all([
        await GetBindDoctorDept("ALL"),
      ]);

      const reponseData = {
        BindDoctorDept: reactSelectOptionList(
          BindDoctorDept?.data,
          "Name",
          "DoctorID"
        ),
      };

      setDropDownState(reponseData);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    } finally {
      store.dispatch(setLoading(false));
    }
  };

  const handleRemoveSlot = (indexToRemove) => {
    const updatedSlots = values.DoctorSlots.filter(
      (_, index) => index !== indexToRemove
    );
    setValues((prev) => ({
      ...prev,
      DoctorSlots: updatedSlots,
    }));
  };

  useEffect(() => {
    EDPGetExitingOTAPI();
    renderApiCalls();
  }, []);

  useEffect(() => {
    if (values?.DoctorName?.value) {
      getDoctorBoookedSlot(values?.DoctorName?.value);
    }
  }, [values?.DoctorName?.value]);

  return (
    <div className="card">
      <Heading title={t("OT Master")} isBreadcrumb={true} />
      <div className="row p-2">
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("OT Name")}
          placeholder=" "
          //   id="ItemName"
          name="OTName"
          onChange={(e) => handleInputChange(e, 0, "OTName")}
          value={values?.OTName}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <TimePicker
          placeholderName="Time"
          lable={t("OT Start Time")}
          id="OTStarttime"
          name="OTStarttime"
          value={values?.OTStarttime}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          handleChange={handleDateTimeChange}
        />
        <TimePicker
          placeholderName="Time"
          lable={t("OT End Time")}
          id="OTEndtime"
          name="OTEndtime"
          value={values?.OTEndtime}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          handleChange={handleDateTimeChange}
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("OT/Slot In Mins")}
          placeholder=" "
          //   id="ItemName"
          name="SlotInMins"
          onChange={(e) => handleInputChange(e, 0, "SlotInMins")}
          value={values?.SlotInMins ? values?.SlotInMin : ""}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleSave}
        >
          {t("Save")}
        </button>
      </div>

      <Heading title={t("Exiting OT")} isBreadcrumb={false} />
      <Tables
        thead={THEAD}
        tbody={tableData?.map((ele, i) => {
          return {
            SNo: i + 1,
            OTName: ele.Name,
            StartTime: ele.StartTime,
            EndTime: ele.EndTime,
            SlotDuration: ele.SlotMins + " Mins",
            CreatedBy: ele.CreatedBy,
            CreatedOn: ele.CreatedOn,
          };
        })}
        style={{ maxHeight: "50vh" }}
      />

      <Heading title={"Doctor OT Scheduling"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Doctor Name")}
          name="DoctorName"
          value={values?.DoctorName?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={dropDownState?.BindDoctorDept}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          requiredClassName={"required-fields"}
          placeholderName={t("Schedule By")}
          name="ScheduleBy"
          value={values?.ScheduleBy?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Days", value: "1" },
            { label: "Date", value: "2" },
          ]}
          searchable={true}
          removeIsClearable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        {values?.ScheduleBy?.value === "1" ? (
          <ReactSelect
            requiredClassName={"required-fields"}
            placeholderName={t("Select Day")}
            name="SelectDay"
            value={values?.SelectDay?.value}
            handleChange={(name, e) => handleReactSelect(name, e)}
            dynamicOptions={[
              { label: "Mon", value: "Mon" },
              { label: "Tue", value: "Tue" },
              { label: "Wed", value: "Wed" },
              { label: "Thu", value: "Thu" },
              { label: "Fri", value: "Fri" },
              { label: "Sat", value: "Sat" },
              { label: "Sun", value: "Sun" },
            ]}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
          />
        ) : (
          <DatePicker
            placeholderName="Time"
            className="custom-calendar"
            lable={t("Select Date")}
            id="SelectDate"
            name="SelectDate"
            value={values?.SelectDate}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            handleChange={handleDateTimeChange}
          />
        )}
        <LabeledInput
          className="col-xl-2 col-md-4 col-sm-6 col-12 mb-2 mt-1"
          label={t("Available OT Slots")}
          type="time"
          name="otSlots"
          value={values?.otSlots > 0 ? values?.otSlots : 0}
        />
        <button
          className="btn btn-sm btn-success mr-1 ml-2 px-3"
          onClick={() => handleSlotModal()}
        >
          {t("Available OT Slots")}
        </button>
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={() => handleSaveDoctorSlotAllocation()}
        >
          {t("Save")}
        </button>
        {values?.DoctorSlots?.length > 0 && (
          <div className="col-12 mt-3">
            <label className="displayShow">{t("Selected Schedule")}</label>
            <div
              className="doctorBind"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                padding: "8px 6px",
              }}
            >
              {values?.DoctorSlots?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>
                    {item.Name} : {item.startTime} - {item.endTime} {t("On")}{" "}
                    {item.scheduleOnText}
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "gray",
                    }}
                    onClick={() => handleRemoveSlot(index)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {
        <Modal
          visible={modalData?.show}
          setVisible={() =>
            setModalData({
              show: false,
              component: null,
              size: null,
            })
          }
          modalWidth={modalData?.size}
          Header={modalData?.header}
          buttonName={modalData?.buttonName}
          modalData={modalData?.modalData}
          footer={modalData?.footer}
          handleAPI={modalData?.handleAPI}
        >
          {modalData?.component}
        </Modal>
      }
    </div>
  );
};

export default OTmaster;
