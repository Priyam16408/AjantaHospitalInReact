import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import TimePicker from "../formComponent/TimePicker";
import DatePicker from "../formComponent/DatePicker";
import moment from "moment";
import { handleReactSelectDropDownOptions, notify } from "../../utils/utils";
import {
  BillingCategory,
  BindRoomBed,
  BindRoomDetails,
  DoctorAndRoomShift,
  RoomType,
} from "../../networkServices/BillingsApi";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import RoomShiftTable from "../UI/customTable/billings/RoomShiftTable";

const RoomShift = ({ activeClass, data }) => {
  const { t } = useTranslation();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const ip = useLocalStorage("ip", "get");
  const [RoomDetail, setRoomDetail] = useState([]);
  const [errors, setErrors] = useState({});
  const [DropDownState, setDropDownState] = useState({
    getRoomType: [],
    getBindRoomBed: [],
    getBillingCategory: [],
  });

  const [payload, setPayload] = useState({
    Doctor: "",
    IPDCaseTypeID: "",
    RoomBed: "",
    BillingCategory: "",
    shiftDate: new Date(),
    shiftTime: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleReactSelect = async (name, value, secondName) => {
    const obj = { ...payload };
    obj[name] = value?.value || "";
    if (secondName) obj[secondName] = value?.value || "";
    setPayload(obj);
    if (name === "IPDCaseTypeID") {
      const response = await getBindRoom({ caseType: value.value });
      setDropDownState((prevState) => ({
        ...prevState,
        getBindRoomBed: response,
      }));
    }
  };

  const getBindRoomType = async () => {
    try {
      const data = await RoomType();
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getBindRoom = async (params) => {
    const newPayload = {
      caseType: String(params.caseType),
      isDisIntimated: 0,
      type: "1",
      bookingDate: "",
    };

    try {
      const dataRes = await BindRoomBed(newPayload);
      return dataRes?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getBindBillingCategory = async () => {
    try {
      const data = await BillingCategory();
      return data?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const geBindRoomDetails = async () => {
    const TransactionID = data?.transactionID;
    try {
      const response = await BindRoomDetails(TransactionID);
      setRoomDetail(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const commonFetchAllDropDown = async () => {
    try {
      const response = await Promise.all([
        getBindRoomType(),
        getBindBillingCategory(),
      ]);

      const responseDropdown = {
        getRoomType: handleReactSelectDropDownOptions(
          response[0],
          "Name",
          "IPDCaseTypeID"
        ),
        getBillingCategory: handleReactSelectDropDownOptions(
          response[1],
          "Name",
          "IPDCaseTypeID"
        ),
      };

      return responseDropdown;
    } catch (error) {
      console.log(error, "Something Went Wrong");
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const responseDropdown = await commonFetchAllDropDown();
      setDropDownState(responseDropdown);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    FetchAllDropDown();
    geBindRoomDetails();
  }, []);

  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (!payload?.IPDCaseTypeID) {
      errors.IPDCaseTypeID = "Room Type Is Required";
      errors.id[errors.id?.length] = "IPDCaseTypeIDFocus";
    }
    if (!payload?.RoomBed) {
      errors.RoomBed = "Room/Bed Is Required";
      errors.id[errors.id?.length] = "RoomBedFocus";
    }
    if (payload?.RoomBed == data?.roomId) {
      errors.RoomBed = "Room/Bed should not be Same";
      errors.id[errors.id?.length] = "RoomBedFocus";
    }

    return errors;
  };
 
  const RoomShiftSave = async () => {
    const customerrors = ErrorHandling();
    if (Object.keys(customerrors)?.length > 1) {
      if (Object.values(customerrors)[0]) {
        notify(Object.values(customerrors)[1], "error");
        setErrors(customerrors);
      }
      return;
    }
    try {
      const requestBody = {
        type: activeClass ? String(activeClass) : "",
        tid: data?.transactionID ? Number(data?.transactionID) : 0,
        startDate: payload?.shiftDate
          ? moment(payload?.shiftDate).format("DD-MMM-YYYY")
          : "",
        time: payload?.shiftTime
          ? moment(payload?.shiftTime).format("DD-MMM-YYYY")
          : "",
        doctorID: 0,
        ipAddress: ip || "",
        roomID: payload?.IPDCaseTypeID ? Number(payload?.IPDCaseTypeID) : 0,
        availRooms: payload?.RoomBed ? Number(payload?.RoomBed) : 0,
        panelID: data?.panelID ? Number(data?.panelID) : 0,
        patientID: data?.patientID ? String(data?.patientID) : "",
        billCategory: payload?.BillingCategory
          ? String(payload?.BillingCategory)
          : "",
        scheduleChargeID: data?.scheduleChargeID
          ? Number(data?.scheduleChargeID)
          : 0,
      };

      const response = await DoctorAndRoomShift(requestBody);

      if (response?.success) {
        notify(response?.message, "success");
        geBindRoomDetails();
        setPayload({
          Doctor: "",
          IPDCaseTypeID: "",
          RoomBed: "",
          BillingCategory: "",
          shiftDate: new Date(),
          shiftTime: new Date(),
        });
      } else {
        notify(response?.message, "error");
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };
  const thead = [
    t("S.No."),
    t("IPD No."),
    t("UHID"),
    t("Patient Name"),
    t("Room Type"),
    t("Room"),
    t("Entry Date"),
    t("Leave Date"),
    t("Shifted By"),
    t("Status"),
  ];
  return (
    <>
      <div className="row m-2">
        <ReactSelect
          placeholderName={t("Room_Type")}
          id={"IPDCaseTypeID"}
          name="IPDCaseTypeID"
          value={payload?.IPDCaseTypeID}
          handleChange={(name, e) =>
            handleReactSelect(name, e, "BillingCategory")
          }
          dynamicOptions={DropDownState?.getRoomType?.map((item) => ({
            label: item?.Name,
            value: item?.IPDCaseTypeID,
          }))}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          requiredClassName={`required-fields ${errors?.IPDCaseTypeID ? "required-fields-active" : ""}`}
        />

        <ReactSelect
          placeholderName={t("Room BedNo")}
          id={"RoomBed"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name="RoomBed"
          dynamicOptions={DropDownState?.getBindRoomBed?.map((item) => ({
            label: item?.Name,
            value: item?.RoomId,
          }))}
          value={payload?.RoomBed}
          handleChange={handleReactSelect}
          requiredClassName={`required-fields ${errors?.RoomBed ? "required-fields-active" : ""}`}
        />

        <ReactSelect
          placeholderName={t("Billing Category")}
          id={"BillingCategory"}
          searchable={true}
          respclass="col-xl-2 col-md-2 col-sm-6 col-12"
          name="BillingCategory"
          dynamicOptions={DropDownState?.getBillingCategory?.map((item) => ({
            label: item?.Name,
            value: item?.IPDCaseTypeID,
          }))}
          value={payload?.BillingCategory}
          handleChange={handleReactSelect}
        />

        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="shiftDate"
          name="shiftDate"
          value={payload?.shiftDate}
          handleChange={handleChange}
          label={t("Shift Date")}
          placeholder={VITE_DATE_FORMAT}
          // inputClassName="required-fields"
        />

        <TimePicker
          placeholderName={t("Shift Time")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id="shiftTime"
          name="shiftTime"
          value={payload?.shiftTime}
          handleChange={handleChange}
          // className="required-fields"
        />

        <div className="col-sm-2">
          <button className="btn btn-sn btn-success" onClick={RoomShiftSave}>
            {t("Shift")}
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <RoomShiftTable THEAD={thead} tbody={RoomDetail} />
        </div>
      </div>
    </>
  );
};

export default RoomShift;
