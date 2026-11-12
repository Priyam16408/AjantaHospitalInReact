import React, { useEffect, useState } from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GetBindAllDoctorConfirmation } from "../../store/reducers/common/CommonExportFunction";
import TimePicker from "../formComponent/TimePicker";
import DatePicker from "../formComponent/DatePicker";
import moment from "moment";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import {
  BindDocDetails,
  DoctorAndRoomShift,
} from "../../networkServices/BillingsApi";
import { notify } from "../../utils/utils";
import DoctorShiftTable from "../UI/customTable/billings/DoctorShiftTable";

const DoctorShift = ({ activeClass, data }) => {
  const { t } = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const dispatch = useDispatch();
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [DoctorDetail, setDoctorDetail] = useState([]);

  const [payload, setPayload] = useState({
    Doctor: "",
    shiftDate: new Date(),
    shiftTime: new Date(),
  });

  const handleReactSelect = (name, value) => {
    console.log(value);
    setPayload((val) => ({ ...val, [name]: value?.value || "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const { GetBindAllDoctorConfirmationData } = useSelector(
    (state) => state.CommonSlice
  );

  useEffect(() => {
    dispatch(
      GetBindAllDoctorConfirmation({
        Department: "All",
      })
    );
  }, [dispatch]);

  const geBindDocDetails = async () => {
    const TransactionID = data?.transactionID;
    try {
      const response = await BindDocDetails(TransactionID);
      setDoctorDetail(response?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    geBindDocDetails();
  }, []);
  console.log(data);
  console.log(payload);
  const ErrorHandling = () => {
    let errors = {};
    errors.id = [];
    if (payload?.Doctor==="") {
      errors.Doctor = "Doctor is required";
      errors.id[errors.id?.length] = "DoctorFocus";
    }
    if (payload?.Doctor == data?.doctorID) {
      errors.Doctor = "Doctor should not be Same";
      errors.id[errors.id.length] = "DoctorFocus";
    }

    return errors;
  };
  console.log(data?.doctorID)
  console.log(payload?.Doctor)
  const DoctorShiftSave = async () => {
    const customerrors = ErrorHandling();
    console.log("customerrorscustomerrors", customerrors);
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
        doctorID: payload?.Doctor ? Number(payload?.Doctor) : 0,
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
        geBindDocDetails();
        setPayload({
          Doctor: "",
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
    t("Admitted Under"),
    t("Current Doctor"),
    t("Entry Date"),
    t("Leave Date"),
    t("User"),
    t("Status"),
  ];
  return (
    <>
      <div className="row m-2">
        <ReactSelect
          placeholderName={t("Select Doctor")}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
          id={"Doctor"}
          name={"Doctor"}
          value={payload?.Doctor}
          removeIsClearable={true}
          handleChange={handleReactSelect}
          dynamicOptions={GetBindAllDoctorConfirmationData.map((item) => ({
            label: item?.Name,
            value: item?.DoctorID,
          }))}
        />
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          id="shiftDate"
          name="shiftDate"
          value={payload?.shiftDate}
          handleChange={handleChange}
          label={t("Shift Date")}
          placeholder={VITE_DATE_FORMAT}
        />
        <TimePicker
          placeholderName={t("Shift Time")}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          id="shiftTime"
          name="shiftTime"
          value={payload?.shiftTime}
          handleChange={handleChange}
        />
        <div className="co-sm-2">
          <button className="btn btn-sn btn-success" onClick={DoctorShiftSave}>
            {t("Shift")}
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <DoctorShiftTable THEAD={thead} tbody={DoctorDetail} />
        </div>
      </div>
    </>
  );
};

export default DoctorShift;
