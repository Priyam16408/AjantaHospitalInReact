import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../formComponent/DatePicker";
import LabeledInput from "../../formComponent/LabeledInput";
import { GetDoctorAppointmentTimeSlotConsecutive } from "../../../networkServices/opdserviceAPI";
import moment from "moment";
import { Tooltip } from "primereact/tooltip";

const SlotModal = (props) => {
  const { data, handleSetData, handleConfirmBox, typePage, confirmBoxvisible } =
    props;

  const { VITE_DATE_FORMAT } = import.meta.env;

  const [t] = useTranslation();

  const [doctorSlot, setDoctorSlot] = useState({});
  const [Active, setActive] = useState(null);

  const handleModifiedDoctorSlotData = (apiResponse, key, secondKey) => {
    const objData = apiResponse.reduce((acc, current, index) => {
      if (acc[current[key]]) {
        if (acc[current[key]][current[secondKey]]) {
          acc[current[key]][current[secondKey]] = [
            ...acc[current[key]][current[secondKey]],
            current,
          ];
        } else {
          acc[current[key]][current[secondKey]] = [current];
        }
      } else {
        acc[current[key]] = {
          ...acc[current[key]],
          [current[secondKey]]: [current],
        };
      }

      return acc;
    }, {});

    return objData;
  };

  const handleGetDoctorAppointmentTimeSlotConsecutive = async (
    doctorID,
    AppointedDate
  ) => {
    try {
      const apiResponse = await GetDoctorAppointmentTimeSlotConsecutive(
        doctorID,
        AppointedDate
      );
      if (apiResponse?.success) {
        const modifiedData = handleModifiedDoctorSlotData(
          apiResponse?.data,
          "ShiftName",
          "SlotGroupTime"
        );
        setDoctorSlot(modifiedData);
      } else {
        notify(apiResponse?.message, "error");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleColorCoding = (status) => {
    console.log(status);
    const color = {
      5: "#8a847c",
      1: "#58b674",
      2: "#da7f17",
      3: "#5e99c9",
      4: "#d96f6f",
      6: "#11c8df",
    };

    return color[status];
  };

  const handleAppointDate = (e) => {
    const { name, value } = e.target;
    setAppointmentDate(value)

    handleGetDoctorAppointmentTimeSlotConsecutive(
      data?.Type_ID,
      moment(value).format("yyyy-MM-DD")
    );
  };

  const handleBookAppointment = (innerData) => {
    data.AppointedDateTime = `${innerData?.SlotDateDisplay}#${innerData?.FromTimeDisplay}-${innerData?.ToTimeDisplay}`;
    handleSetData(data);
  };

  const handleSelect = (e, index) => {
    setActive(index);
  };

  const renderDoctorSlotViewer = useCallback(
    (newdoctorSlot) => {
      const shiftName = Object.keys(newdoctorSlot);
      return shiftName?.map((shift, index) => {
        const doctorSlotData = newdoctorSlot[shift];
        const slotGroupTime = Object.keys(doctorSlotData);

        return (
          <>
            {/* {slotGroupTime.map((item, index) => (
        <Tooltip
          key={index}
          target={`#doctorName-${index}`}
          position="top"
        />
      ))} */}
            <div key={index} className="shift-header">
              {shift}
            </div>
            <div className="row">
              {slotGroupTime?.map((groupTime, innerIndex) => {
                return (
                  <>
                    <div key={innerIndex} className="col-md-6">
                      <div className="d-flex flex-nowrap">
                        <div>
                          <div className="groupTime m-1">{groupTime}</div>
                        </div>
                        <div>
                          <div className="d-flex flex-wrap">
                            {doctorSlotData[groupTime]?.map(
                              (data, mostInnerIndex) => {
                                return (
                                  <div
                                    id={`doctorName-${index}`}
                                    data-pr-tooltip={data?.PatientDetails}
                                    style={{ fontSize: "11px" }}
                                  >
                                    <button
                                      key={mostInnerIndex}
                                      className="timeDisplay colorSetter border-0"
                                      style={{
                                        backgroundColor:
                                          Active ===
                                          `${groupTime}-${mostInnerIndex}`
                                            ? "#d377c4"
                                            : handleColorCoding(
                                                data?.SlotStatusID
                                              ),
                                      }}
                                      onDoubleClick={() =>
                                        handleClickedDoublebaar(data)
                                      }
                                      onClick={(e) =>
                                        handleSelect(
                                          e,
                                          `${groupTime}-${mostInnerIndex}`
                                        )
                                      }
                                      disabled={
                                        data?.SlotStatus === "Expired" ||
                                        data?.SlotStatus ===
                                          "Booked Hospital" ||
                                        data?.SlotStatus === "Confirmed" ||
                                        data?.SlotStatus === "DNA"
                                      }
                                    >
                                      {data?.FromTimeDisplay}
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <hr></hr>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        );
      });
    },
    [doctorSlot, Active]
  );

  useEffect(() => {
    handleGetDoctorAppointmentTimeSlotConsecutive(
      data?.Type_ID,
      data?.AppointedDate
    );
  }, []);

  const handleClickedDoublebaar = (data) => {
    // console.log("DOUBLECLICKDATA",data);
    if (typePage === "confirmation") {
      handleConfirmBox(data);
    } else {
      handleBookAppointment(data);
    }
  };

  const [appointmentDate,setAppointmentDate] = useState(new Date(data?.AppointedDate))
  return (
    <>
    {console.log("data?.AppointedDate",data?.AppointedDate)}
      <div className="row">
        <DatePicker
          className="custom-calendar"
          respclass="col-xl-2 col-md-3 col-sm-6 col-12"
          id="AppointmentDate"
          name="AppointmentDate"
          value={appointmentDate}
          handleChange={handleAppointDate}
          lable={t("AppointmentDate")}
          placeholder={VITE_DATE_FORMAT}
        />
        <div className="col-xl-2.5 col-md-3 col-sm-6 col-12">
          <LabeledInput
            label={"Doctor"}
            value={data?.Item ?? "Aaden ( EMERGENCY OPD )"}
          />
        </div>

        <>
          <div className="d-flex flex-wrap ">
            <div className="d-flex align-items-center mx-2">
              <div className="statusConfirmed"></div>
              <label className="text-dark mx-1 my-0">Available</label>
            </div>
            <div className="d-flex align-items-center mx-2">
              <div className="statusRescheduled"></div>
              <label className="text-dark mx-1 my-0">Booked</label>
            </div>
            <div className="d-flex align-items-center mx-2">
              <div className="statusPending"></div>
              <label className="text-dark mx-1 my-0">Mobile</label>
            </div>
            <div className="d-flex align-items-center mx-2">
              <div className="statusAppointment"></div>
              <label className="text-dark mx-1 my-0">Expired</label>
            </div>

            <div className="d-flex align-items-center mx-2">
              <div className="statusUnregistered"></div>
              <label className="text-dark mx-1 my-0">Confirmed</label>
            </div>
            <div className="d-flex align-items-center mx-2">
              <div
                className="statusUnregistered"
                style={{ background: "#d96f6f" }}
              ></div>
              <label className="text-dark mx-1 my-0">Not Available</label>
            </div>
            <div className="d-flex align-items-center mx-2">
              <div className="statusCanceled"></div>
              <label className="text-dark mx-1 my-0">Selected</label>
            </div>
          </div>
        </>
      </div>

      <div className="p-2" style={{ overflow: "auto" }}>
        {renderDoctorSlotViewer(doctorSlot)}
      </div>
    </>
  );
};

export default SlotModal;
