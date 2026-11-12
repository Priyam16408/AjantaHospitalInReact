import React, { useState, useEffect } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import moment from "moment";
import Tables from "../../../components/UI/customTable";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Modal from "../../../components/modalComponent/Modal";
import Input from "../../../components/formComponent/Input";
import DatePicker from "../../../components/formComponent/DatePicker";
import ColorCodingSearch from "../../../components/commonComponents/ColorCodingSearch";
import {
  BindDoctorDept,
  CancelBookingOt,
  GetAllSurgery,
  GetPatientBookingDetails,
  OTBookingSave,
  OtConfirmBooking,
  ValidateExpiredBooking,
} from "../../../networkServices/EDP/karanedp";

import { Oldpatientsearch } from "../../../networkServices/opdserviceAPI";
import SearchItemEassyUI from "../../../components/commonComponents/SearchItemEassyUI";
import { BIND_TABLE_OLDPATIENTSEARCH } from "../../../utils/constant";
import { OTGetOTSlots } from "../../../networkServices/EDP/govindedp";
import CommonSlotSelector from "../Master/CommonSlotSelector";
import OtBookingRejectModal from "./OtBookingRejectModal";
import OtBookingApprovalModal from "./OtBookingApprovalModal";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import OtBookingReSheduleReasonModal from "./OtBookingReSheduleReasonModal";
function OTBooking() {
  const [t] = useTranslation();
  const [otBodyData, setOtBodyData] = useState([]);

  const selectGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Both", label: "Both" },
  ];

  const selectInput = [
    { value: "0", label: "UHID NO" },
    { value: "1", label: "OT Number" },
  ];

  const initinalState = {
    PatientName: "",
    age: "",
    gender: "",
    contactNo: "",
    address: "",
    doctor: "",
    surgery: [],
    DoctorSlots: [],
    uhid: "",
    selectedInput: "",
    slotDate: new Date(),
    selectInput: { value: "0", label: "UHID NO" },
    fromDate: moment(new Date()).toDate(),
    toDate: moment(new Date()).toDate(),
    UHIDPatientNameMobileno: "",
    patientType: { label: "Registered", value: "2" },
  };
  const [values, setValues] = useState(initinalState);

  const [SearchPatient, setSearchPatient] = useState({
    label: t("UHID/Patient Name/Mobile No."),
    id: "UHIDPatientNameIPDNo",
    value: "",
    patientDetail: {},
  });

  //Declaring ALL State
  const [handleModelData, setHandleModelData] = useState({});
  const [modalData, setModalData] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const ip = localStorage.getItem("ip");
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleSelect = (name, value) => {
    if (name === "patientType") {
      setValues({ ...initinalState, [name]: value });
      setSearchPatient((val) => ({ ...val, value: "" }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeRescheduleModel = (data) => {
    setHandleModelData((val) => ({ ...val, modalData: data }));
  };

  const handleChangeApproveModel = (data) => {
    setHandleModelData((val) => ({ ...val, modalData: data }));
  };

  const EDPGetOTsAPI = async (scheduleDay, doctorID) => {
    const payloadToBe = {
      scheduleDate: scheduleDay,
      scheduleDay: null,
      doctorID: doctorID,
      applyExpiredFilter: 1,
      checkedDoctorBookedSlots: 0,
      checkedPatientBookedSlots: 1,
      isForDoctorSlotAllocation: 0,
      filterDoctorSpecifiedSlot: 0,
    };
    const response = await OTGetOTSlots(payloadToBe);

    if (response?.success) {
      return response?.data;
    } else {
      notify(response?.message, "error");
    }
  };

  const handleChangeRejectModel = (data) => {
    // setModalData(data);
    setHandleModelData((val) => ({ ...val, modalData: data }));
  };

  const [bindDoctor, setBindDoctor] = useState([]);
  const handleBindDoctorDept = async () => {
    let apiResp = await BindDoctorDept("All");
    if (apiResp?.success) {
      setBindDoctor(apiResp?.data);
    } else {
      console.log(apiResp?.message);
      notify(apiResp?.message, "error");
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // GetAllSurgery
  const [surgeryData, setSurgeryData] = useState([]);

  const handleRemoveSlot = (indexToRemove) => {
    const updatedSlots = values?.DoctorSlots?.filter(
      (_, index) => index !== indexToRemove
    );
    setValues((prev) => ({
      ...prev,
      DoctorSlots: updatedSlots,
    }));
  };

  const handleGetAllSurgery = async () => {
    let apiResp = await GetAllSurgery();
    if (apiResp?.success) {
      const data = apiResp?.data.map((item) => ({
        name: item?.Name,
        code: item?.Surgery_ID,
      }));
      setSurgeryData(data);
    } else {
      setSurgeryData([]);
      // notify(apiResp?.message, "error");
    }
  };

  // const handleValidateExpiredBooking = async (id) => {
  //   let apiResp = await ValidateExpiredBooking(id);
  //   if (apiResp?.success) {
  //     notify(apiResp?.message,"success")
  //   } else {
  //     console.log(apiResp?.message);
  //     notify(apiResp?.message, "error");
  //   }
  // };

  // OtConfirmBooking

  const handleValidateExpiredBooking = async (data) => {
    try {
      const payload = {
        bookingID: data?.bookingID,
        remark: data?.newReason,
        patientID: data?.PatientID,
        transactionID: "string",
        equipmentDetail: [
          {
            equipmentName: data?.Equipment?.label,
            quantity: data?.qunatity,
            equipmentID: data?.Equipment?.value,
          },
        ],
      };
      let apiResp = await OtConfirmBooking(payload);
      if (apiResp?.success) {
        // notify(apiResp?.message, "error");
        notify(apiResp?.message, "success");
        setHandleModelData({ isOpen: false });
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateBookingOt = async (val) => {
    setSearchPatient((val) => ({ ...val, value: "" }));
    setUpdateState(val);
    const newSlot = {
      ID: `${val?.OTID}-${val?.SlotToTime}`,
      OTID: Number(val?.OTID),
      startTime: val?.SlotFromTime,
      endTime: val?.SlotToTime,
      Name: val?.OTName,
      scheduleOnText: val?.SurgeryDate,
    };
    setValues((item) => ({
      ...item,
      isUpdate: true,
      bookingid: item.bookingID,
      PatientName: val?.PatientName || "",
      DoctorSlots: [newSlot],
      uhid: val?.PatientID,
      age: val?.Age,
      gender: { value: val?.Gender },
      contactNo: val?.ContactNo,
      address: val?.Address,
      doctor: { value: val?.DoctorID },
      surgery: val?.SurgeryID?.split(",")?.map((item, index) => ({
        code: item?.slice(1, -1),
        name: val?.SurgeryName?.split(",")[index],
      })),
      selectedInput: "",
      slotDate: moment(new Date()).toDate(),
      selectInput: { value: "0", label: "UHID NO" },
      fromDate: moment(new Date()).toDate(),
      toDate: moment(new Date()).toDate(),
      UHIDPatientNameMobileno: "",
    }));
  };

  const handleSave = async (data) => {
    // debugger
    console.log(values, "the values");
    console.log("the booking id is", values?.bookingid);
    // Validation
    if (!values?.PatientName) {
      notify("Patient Name is empty", "error");
      return;
    } else if (!values?.age) {
      notify("Age is empty", "error");
      return;
    } else if (!values?.gender?.value) {
      notify("Please Select Gender", "error");
      return;
    } else if (!values?.doctor?.value) {
      notify("Please Select Doctor", "error");
      return;
    } else if (values?.surgery.length === 0) {
      notify("Please Select Surgery", "error");
      return;
    } else if (values?.DoctorSlots.length === 0) {
      notify("Please Select Doctor Slot", "error");
      return;
    }

    if (values?.isChangeSlot && values?.isUpdate && !data?.reshudleReason) {
      handleResheduleReason();
      return;
    }

    // Extracting time range from selected slots
    const startTimes = values?.DoctorSlots?.map((slot) => slot.startTime);
    const endTimes = values?.DoctorSlots?.map((slot) => slot.endTime);

    const earliestStart = moment.min(
      startTimes.map((t) => moment(t, "hh:mm a"))
    );
    const latestEnd = moment.max(endTimes.map((t) => moment(t, "hh:mm a")));

    const slotFromTime = earliestStart.format("hh:mm A");
    const slotToTime = latestEnd.format("hh:mm A");

    const payload = {
      // bookingID: updateState?.length > 0 ? updateState?.bookingID : 0,
      // bookingID:!updateState ? 0 : updateState?.bookingID,
      bookingID: values?.isUpdate ? updateState?.bookingID : 0,

      rescheduleReason: values?.isUpdate ? data?.reshudleReason : "",
      // rescheduleReason: data?.reshudleReason == "" ? "": data?.reshudleReason ,
      booking: {
        otNumber: "",
        patientName: values?.PatientName,
        age: String(values?.age),
        gender: values?.gender?.value,
        address: values?.address,
        contactNo: values?.contactNo,
        doctorID: String(values?.doctor?.value),
        surgeryID: 0,
        otid: values?.DoctorSlots[0]?.OTID,
        surgeryDate: moment(values?.slotDate).format("DD-MMM-YYYY"),
        slotFromTime: slotFromTime,
        slotToTime: slotToTime,
        outPatientID: "",
        // patientID: !updateState ? "" : updateState?.PatientID,
        patientID: values?.uhid,
        transactionID: "",
        centreID: "",
        ipAddress: ip,
        entryBy: "",
        transNo: "",
        rescheduledRefID: !updateState ? "" : updateState?.bookingID,
      },
      surgeryList: values?.surgery.map((surg) => ({
        surgeryID: surg?.code,
        surgeryName: surg?.name,
      })),
    };

    // Call API
    try {
      const apiResp = await OTBookingSave(payload);
      if (apiResp.success) {
        notify(apiResp?.message + apiResp?.data?.otNumber, "success");

        setIsOpen();
        setValues(initinalState);
        setSearchPatient((val) => ({ ...val, value: "" }));
        setUpdateState([]);
        // setValues((val) => ({ ...val, DoctorSlots: [newSlot],isChangeSlot:true }));
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleResheduleReason = (item) => {
    setHandleModelData({
      label: t("Reshedule Reason"),
      buttonName: t("Save"),
      width: "30vw",
      isOpen: true,
      Component: (
        <OtBookingReSheduleReasonModal
          inputData={item}
          handleChangeModel={handleChangeRescheduleModel}
        />
      ),
      handleInsertAPI: handleSave,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  // handleUpdateBookingOt

  const handleCancelBookingOt = async (data) => {
    const payload = {
      bookingID: data?.bookingID,
      reason: data?.newReason,
    };
    try {
      const apiResp = await CancelBookingOt(payload);
      if (apiResp.success) {
        notify(apiResp?.message, "success");
        setHandleModelData({ isOpen: false });
        handleSearch();
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      notify("An error occurred while saving data", "error");
    }
  };

  const handleClickReject = (item) => {
    setHandleModelData({
      label: t("Cancel Reason"),
      buttonName: t("Reject"),
      width: "30vw",
      isOpen: true,
      Component: (
        <OtBookingRejectModal
          inputData={item}
          handleChangeModel={handleChangeRejectModel}
        />
      ),
      handleInsertAPI: handleCancelBookingOt,
      extrabutton: <></>,
      // footer: <></>,
    });
  };

  const handleClickApprove = async (item) => {
    try {
      const response = await ValidateExpiredBooking(item?.bookingID);
      if (response?.success) {
        setHandleModelData({
          label: t("Booking Confirmation Details"),
          buttonName: t("Save"),
          width: "30vw",
          isOpen: true,
          Component: (
            <OtBookingApprovalModal
              inputData={item}
              handleChangeModel={handleChangeApproveModel}
            />
          ),
          handleInsertAPI: handleValidateExpiredBooking,
          extrabutton: <></>,
          // footer: <></>,
        });
      } else {
        notify(response?.message, "error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAPI = (data) => {
    data?.map((ot) => {
      const otSlots = JSON.parse(JSON.stringify(ot?.slots)).filter(
        (s) => s.status === "Selected"
      );
      if (otSlots?.length > 0) {
        const firstSlot = otSlots?.[0];
        const lastSlot = otSlots?.[otSlots?.length - 1];
        const newSlot = {
          ID: `${ot.otid}-${lastSlot?.endDisplayTime}`,
          OTID: Number(ot.otid),
          startTime: firstSlot?.startDisplayTime,
          endTime: lastSlot?.endDisplayTime,
          Name: ot.otName,
          scheduleOnText: moment(values?.slotDate).format("DD-MMM-YYYY"),
        };

        setValues((val) => ({
          ...val,
          DoctorSlots: [newSlot],
          isChangeSlot: true,
        }));
      }
    });
    setHandleModelData({
      isOpen: false,
      component: null,
      size: null,
    });
  };

  const handleSlotModal = async (index) => {
    if (!values?.doctor?.value) {
      notify("Please Select Doctor", "error");
      return;
    } else if (!moment(values?.slotDate).format("DD-MMM-YYYY")) {
      notify("Please Select Date", "error");
      return;
    }
    const data = await EDPGetOTsAPI(
      moment(values?.slotDate).format("DD-MMM-YYYY"),
      values?.doctor?.value
    );

    setHandleModelData({
      isOpen: true,
      Component: (
        <div>
          <CommonSlotSelector
            isSingleOt={true}
            reactSelectType={values?.ScheduleBy?.label === "Days" ? 1 : 0}
            data={{ ...values, OTs: data }}
            onSetValues={setValues}
            setModalData={setHandleModelData}
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
              Booked: "#84C7DC",
              Expired: "#B8B3B0",
              Approved: "#F8BBD0",
              Selected: "#F78DA7",
            }}
            slotClassMap={{
              // Expired: "slot-booked",
              Approved: "statusUnregistered",
            }}
            fetchSlotsAPI={EDPGetOTsAPI}
          />
        </div>
      ),
      handleInsertAPI: handleAPI,
      modalData: [],
      footer: null,
      size: "100vw",
      header: "Doctor Slot",
    });
  };

  const handleSearch = async () => {
    const payload = {
      bookingID: String(values?.selectedInput),
      patientID: "",
      fromdate: moment(values?.fromDate).format("DD-MMM-YYYY"),
      todate: moment(values?.toDate).format("DD-MMM-YYYY"),
    };

    try {
      const apiResp = await GetPatientBookingDetails(payload);
      if (apiResp.success) {
        setOtBodyData(apiResp?.data);
      } else {
        setOtBodyData([]);
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      setOtBodyData([]);
    }
  };

  const OTHead = [
    { width: "5%", name: t("#") },
    { width: "10%", name: t("Pat.Name") },
    { width: "5%", name: t("Age") },
    { width: "5%", name: t("Sex") },
    { width: "10%", name: t("Panel") },
    { width: "10%", name: t("IPDNo") },
    { width: "5%", name: t("BedNo") },
    { width: "10%", name: t("OT Number") },
    { width: "10%", name: t("OT Name") },
    { width: "10%", name: t("Surgery Date") },
    { width: "7%", name: t("Start Time") },
    { width: "7%", name: t("End Time") },
    { width: "10%", name: t("Doctor") },
    { width: "10%", name: t("Surgery") },
    { width: "10%", name: t("action") },
  ];

  const patientType = [
    { label: "General", value: "1" },
    { label: "Registered", value: "2" },
  ];

  const setIsOpen = () => {
    setHandleModelData((val) => ({ ...val, isOpen: false }));
  };

  const getRowClass = (val, index) => {
    let status = otBodyData[index];
    if (status?.IsCancel === 1) {
      return "color-indicator-2-bg";
    }
    if (status?.IsConfirm === 1) {
      return "color-indicator-1-bg";
    }
    if (status?.RescheduledRefID !== null) {
      return "color-indicator-4-bg ";
    }
  };
  const handleCloseSearchPatient = async (value) => {
    const { PatientName, Gender, Age, ContactNo, parmanentAddress, MRNo } =
      value;
    setValues((val) => ({
      ...val,
      PatientName: PatientName,
      gender: { value: Gender },
      age: Age,
      contactNo: ContactNo,
      address: parmanentAddress,
      uhid: MRNo,
    }));
    setSearchPatient((val) => ({ ...val, value: PatientName }));
  };

  const getbindIPDPatientDetails = async (value) => {
    try {
      const data = await Oldpatientsearch(value);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleBindDoctorDept();
    handleGetAllSurgery();
  }, []);

  const handlePatientSearchPage = () => {
    setSearchPatient((val) => ({ ...val, value: "" }));
    setValues(initinalState);
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setValues((val) => ({ ...val, [name]: selectedOptions }));
  };

  return (
    <>
      {handleModelData?.isOpen && (
        <Modal
          visible={handleModelData?.isOpen}
          setVisible={setIsOpen}
          modalWidth={handleModelData?.width}
          Header={t(handleModelData?.label)}
          buttonType={"button"}
          buttons={handleModelData?.extrabutton}
          buttonName={handleModelData?.buttonName}
          modalData={handleModelData?.modalData}
          setModalData={setModalData}
          footer={handleModelData?.footer}
          handleAPI={handleModelData?.handleInsertAPI}
        >
          {handleModelData?.Component}
        </Modal>
      )}
      <div className="m-1 spatient_registration_card card">
        <Heading title={t("")} isBreadcrumb={true} />
        <div className="row p-2">
          {SearchPatient?.value ? (
            <>
              <div className="col-xl-2 col-md-4 col-sm-4 col-12">
                <div className="row">
                  <div className="col-1">
                    <i
                      className="fa fa-search "
                      aria-hidden="true"
                      onClick={handlePatientSearchPage}
                      style={{
                        border: "1px solid #447dd5",
                        padding: "5px 3px",
                        borderRadius: "3px",
                        backgroundColor: "#447dd5",
                        color: "white",
                      }}
                    ></i>
                  </div>
                  <div className="col-11">
                    <LabeledInput
                      label={t("Patient Name")}
                      value={values?.PatientName}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-4 col-sm-4 col-12  mb-2">
                <LabeledInput label={t("UHID")} value={values?.uhid} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-4 col-12  mb-2">
                <LabeledInput label={t("Age")} value={values?.age} />
              </div>
              <div className="col-xl-2 col-md-4 col-sm-4 col-12  mb-2">
                <LabeledInput
                  label={t("Gender")}
                  value={values?.gender?.value}
                />
              </div>

              <div className="col-xl-2 col-md-4 col-sm-4 col-12  mb-2 ">
                <LabeledInput
                  label={t("Contact No")}
                  value={values?.contactNo}
                />
              </div>

              <div className="col-xl-2 col-md-4 col-sm-4 col-12  mb-2 ">
                <LabeledInput label={t("Address")} value={values?.address} />
              </div>
            </>
          ) : (
            <>
              <ReactSelect
                placeholderName={t("Patient Type")}
                id={"patientType"}
                searchable={true}
                removeIsClearable={true}
                respclass={"col-xl-2 col-md-2 col-sm-4 col-12"}
                dynamicOptions={patientType}
                handleChange={handleSelect}
                value={`${values?.patientType?.value}`}
                name={"patientType"}
              />

              {values?.patientType?.value == 2 && !values?.isUpdate ? (
                <>
                  <div className="col-xl-5 col-md-5 col-sm-8 col-12 ">
                    <SearchItemEassyUI
                      onClick={handleCloseSearchPatient}
                      BindListAPI={getbindIPDPatientDetails}
                      BindDetails={SearchPatient}
                      Head={BIND_TABLE_OLDPATIENTSEARCH}
                      isSelectFirst={true}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder=""
                    className="form-control"
                    id="uhid"
                    name="uhid"
                    value={values?.uhid || ""}
                    onChange={handleChange}
                    lable={t("UHID")}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />

                  <Input
                    type="text"
                    placeholder=""
                    className="form-control required-fields"
                    id="PatientName"
                    name="PatientName"
                    value={values?.PatientName || ""}
                    onChange={handleChange}
                    lable={t("Patient Name")}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />

                  <Input
                    type="text"
                    placeholder=""
                    className="form-control required-fields"
                    id="age"
                    name="age"
                    value={values?.age || ""}
                    onChange={handleChange}
                    lable={t("Age")}
                    respclass="col-xl-2 col-md-2 col-sm-4 col-12"
                  />

                  <ReactSelect
                    placeholderName={t("Gender")}
                    id={"gender"}
                    searchable={true}
                    removeIsClearable={true}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    dynamicOptions={selectGender}
                    handleChange={handleSelect}
                    value={`${values?.gender?.value}`}
                    name={"gender"}
                  />

                  <Input
                    type="text"
                    placeholder=""
                    className="form-control"
                    id="contactNo"
                    name="contactNo"
                    value={values?.contactNo || ""}
                    onChange={handleChange}
                    lable={t("Contact No")}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />

                  <Input
                    type="text"
                    placeholder=""
                    className="form-control"
                    id="address"
                    name="address"
                    value={values?.address || ""}
                    onChange={handleChange}
                    lable={t("Address")}
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                  />
                </>
              )}
            </>
          )}
          {(values?.patientType?.value === "2" && values?.uhid) ||
          values?.patientType?.value === "1" ||
          values?.isUpdate ? (
            <>
              <DatePicker
                id="slotDate"
                name="slotDate"
                placeholder={VITE_DATE_FORMAT}
                lable={t("Slot Date ")}
                className="custom-calendar"
                // value={values?.fromDate || new Date()}
                value={values?.slotDate}
                handleChange={handleChange}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                maxDate={new Date()}
              />

              <ReactSelect
                placeholderName={t("Doctor")}
                id={"doctor"}
                searchable={true}
                removeIsClearable={true}
                respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                requiredClassName="required-fields"
                dynamicOptions={[
                  { value: "0", label: "ALL" },
                  ...handleReactSelectDropDownOptions(
                    bindDoctor,
                    "Name",
                    "DoctorID"
                  ),
                ]}
                handleChange={handleSelect}
                value={`${values?.doctor?.value}`}
                name={"doctor"}
              />

              <MultiSelectComp
                respclass="col-xl-2 col-md-4 col-sm-4 col-12 "
                requiredClassName="required-fields"
                name="surgery"
                id="surgery"
                placeholderName={t("Surgery")}
                dynamicOptions={surgeryData}
                handleChange={handleMultiSelectChange}
                value={values?.surgery}
              />

              <div className="col-sm-2 col-xl-1  col-md-2 d-flex">
                <button
                  className="btn btn-sm btn-success mr-1 px-3"
                  onClick={() => handleSlotModal()}
                >
                  {t("Available OT Slots")}
                </button>

                <button
                  onClick={handleSave}
                  className="btn btn-sm btn-success px-3"
                  type="button"
                >
                  {t("Save")}
                </button>
              </div>

              {values?.DoctorSlots?.length > 0 && (
                <div className="col-12 mt-1">
                  <label className="displayShow">
                    {t("Selected Schedule")}
                  </label>
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
                          {item?.Name} : {item?.startTime} - {item?.endTime}{" "}
                          {t("On")} {item?.scheduleOnText}
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
            </>
          ) : (
            <></>
          )}
        </div>
        <Heading title="" isBreadcrumb={false} />

        <div className="row p-2">
          <ReactSelect
            placeholderName={t("Select Search Type")}
            id="selectInput"
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            dynamicOptions={selectInput}
            handleChange={handleSelect}
            value={`${values?.selectInput?.value}`}
            name="selectInput"
          />

          <Input
            type="text"
            id="selectedInput"
            className="form-control"
            placeholder=" "
            value={values.selectedInput}
            lable={t(values.selectInput.label)}
            onChange={handleChange}
            name="selectedInput"
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          />

          <DatePicker
            id="fromDate"
            name="fromDate"
            className="custom-calendar"
            placeholder={VITE_DATE_FORMAT}
            lable={t("Surgery From Date")}
            // value={values?.fromDate || new Date()}
            value={values?.fromDate ? new Date(values?.fromDate) : new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
          />

          <DatePicker
            id="toDate"
            placeholder={VITE_DATE_FORMAT}
            name="toDate"
            className="custom-calendar"
            lable={t("Surgery To Date")}
            value={values?.toDate ? new Date(values?.toDate) : new Date()}
            handleChange={handleChange}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            maxDate={new Date()}
            // minDate={values?.fromDate}
          />

          <div className="col-sm-2 col-xl-1">
            <button
              onClick={handleSearch}
              className="btn btn-sm btn-success px-3"
              type="button"
            >
              {t("Search")}
            </button>
          </div>
        </div>

        {otBodyData.length > 0 && (
          <>
            <Heading
              title="Patient OT Details"
              isBreadcrumb={false}
              secondTitle={
                <>
                  <ColorCodingSearch label={t("Confirmed")} color="#CFFAE8" />
                  <ColorCodingSearch label={t("Cancel")} color="#F4CECE" />
                  <ColorCodingSearch label={t("Reschedule")} color="#FEF9E5" />
                </>
              }
            />
            <div className="card">
              <Tables
                thead={OTHead}
                tbody={[...otBodyData]?.map((val, index) => ({
                  sno: index + 1,
                  PatName: val?.PatientName || "",
                  Age: val?.Age || "",
                  Sex: val?.Gender || "",
                  Panel: val?.PanelName || "",
                  IPDNo: val?.IPDNo || "",
                  BedNo: val?.BedNo || "",
                  OTNumber: val?.OTNumber || "",
                  OTName: val?.OTName || "",
                  SurgeryDate: val?.SurgeryDate || "",
                  StartTime: val?.SlotFromTime || "",
                  EndTime: val?.SlotToTime || "",
                  Doctor: val?.DoctorName || "",
                  Surgery: val?.SurgeryName || "",
                  action: (
                    <>
                      {val?.IsConfirm == 0 && val?.IsCancel == 0 ? (
                        <div className="">
                          <i
                            onClick={() => handleUpdateBookingOt(val)}
                            className="fa fa-edit ml-2"
                          />
                          <i
                            onClick={() => handleClickReject(val)}
                            className="fa fa-trash text-danger ml-2"
                          />
                          <i
                            onClick={() => handleClickApprove(val)}
                            className="fa fa-check ml-2"
                          />
                        </div>
                      ) : (
                        ""
                      )}{" "}
                    </>
                  ),
                }))}
                tableHeight={"scrollView"}
                style={{ maxHeight: "50vh" }}
                getRowClass={getRowClass}
              />
            </div>
          </>
        )}
      </div>

      {/* {
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
          footer={
            <>
              <button
                className="btn btn-success"
                onClick={() =>
                  setModalData((prev) => ({ ...prev, show: false }))
                }
              >
                {t("Select")}
              </button>
              <button
                className="btn btn-success ml-2"
                onClick={() =>
                  setModalData((prev) => ({ ...prev, show: false }))
                }
              >
                {t("Close")}
              </button>
            </>
          }
        >
          {modalData?.component}
        </Modal>
      } */}
    </>
  );
}

export default OTBooking;
