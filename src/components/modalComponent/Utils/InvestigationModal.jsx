import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "../../formComponent/DatePicker";
import LabeledInput from "../../formComponent/LabeledInput";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import {
  BindModality,
  GetInvestigationTimeSlot,
  HoldTimeSlot,
} from "../../../networkServices/opdserviceAPI";
import { handleReactSelectDropDownOptions } from "../../../utils/utils";
import moment from "moment";

const InvestigationModal = ({
  data,
  handleSetData,
  typePage,
  handleConfirmBox,
}) => {
  console.log("Data", data);
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();

  const [dropDownState, setDropDownState] = useState({
    modalityDropDown: [],
    InvestigationSlot: [],
    defaultModalityValue: "",
  });
  const [Active, setActive] = useState(null);

  const handleAppointDate = async (e) => {
    const { name, value } = e.target;
    const dateFormat = moment(value).format("YYYY-MM-DD");
    const responseDataInvestigationSlot = await handleGetInvestigationTimeSlot(
      dateFormat,
      1,
      data?.SubCategoryID,
      dropDownState?.defaultModalityValue
    );

    const modifiedData = handleModifiedDoctorSlotData(
      responseDataInvestigationSlot,
      "ShiftName",
      "SlotGroupTime"
    );

    setDropDownState({
      ...dropDownState,
      InvestigationSlot: modifiedData,
    });
  };

  const handleBindModalityData = async (SubCategoryID) => {
    try {
      const data = await BindModality(SubCategoryID, 1);
      return Array.isArray(data?.data) ? data?.data : [data?.data];
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleGetInvestigationTimeSlot = async (
    Date,
    CentreID,
    SubCategoryID,
    ModalityID
  ) => {
    try {
      const data = await GetInvestigationTimeSlot(
        Date,
        CentreID,
        SubCategoryID,
        ModalityID
      );
      return data?.data;
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleSelect = (e, index) => {
    setActive(index);
  };

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

  const fetchDropDown = async (data) => {
    try {
      const response = await Promise.all([
        handleBindModalityData(data?.SubCategoryID),
      ]);

      const responseDataInvestigationSlot =
        await handleGetInvestigationTimeSlot(
          data?.AppointedDate,
          1,
          data?.SubCategoryID,
          response[0][0]["ID"]
        );

      const modifiedData = handleModifiedDoctorSlotData(
        responseDataInvestigationSlot,
        "ShiftName",
        "SlotGroupTime"
      );

      setDropDownState({
        modalityDropDown: handleReactSelectDropDownOptions(
          response[0],
          "Name",
          "ID"
        ),
        InvestigationSlot: modifiedData,
        defaultModalityValue: response[0][0]["ID"],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleColorCoding = (status) => {
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

  const handleBookAppointment = (innerData) => {
    // console.log(innerData);
    const {
      ModalityID,
      SlotDateDisplay,
      FromTimeDisplay,
      ToTimeDisplay,
      FromTime,
      ToTime,
    } = innerData;
    data.AppointedDateTime = `${SlotDateDisplay}#${FromTimeDisplay}-${ToTimeDisplay}`;
    data.ModalityID = String(ModalityID);
    handleSetData(data);
    handleHoldTimeSlot(
      String(ModalityID),
      data?.SubCategoryID,
      data?.val,
      data?.AppointedDate,
      `${FromTime}-${ToTime}`,
      "EMP001",
      "1"
    );
  };

  const handleHoldTimeSlot = async (
    modalityID,
    subCategoryID,
    itemID,
    bookingDate,
    timeSlot,
    holdUSerID,
    centreID
  ) => {
    try {
      const data = await HoldTimeSlot({
        modalityID,
        subCategoryID,
        itemID,
        bookingDate,
        timeSlot,
        holdUSerID,
        centreID,
      });
    } catch (error) {}
  };

  const renderDoctorSlotViewer = useCallback(
    (newdoctorSlot) => {
      const shiftName = Object.keys(newdoctorSlot);
      return shiftName?.map((shift, index) => {
        const doctorSlotData = newdoctorSlot[shift];
        const slotGroupTime = Object.keys(doctorSlotData);
        return (
          <>
            <div key={index} className="shift-header">
              {shift}
            </div>
            <div className="row">
              {slotGroupTime?.map((groupTime, innerIndex) => {
                return (
                  <>
                    <div key={innerIndex} className="col-md-4">
                      <div className="d-flex flex-nowrap">
                        <div>
                          <div className="groupTime m-1">{groupTime}</div>
                        </div>
                        <div>
                          <div className="d-flex flex-wrap">
                            {doctorSlotData[groupTime]?.map(
                              (data, mostInnerIndex) => {
                                return (
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
                                    onDoubleClick={
                                      () => handleClickedDoublebaar(data)
                                      // handleBookAppointment(data)
                                    }
                                    onClick={(e) =>
                                      handleSelect(
                                        e,
                                        `${groupTime}-${mostInnerIndex}`
                                      )
                                    }
                                    disabled={
                                      data?.SlotStatus === "Expired" ||
                                      data?.SlotStatus === "Booked Hospital" ||
                                      data?.SlotStatus === "Hold" ||
                                      data?.SlotStatus === "Confirmed"
                                    }
                                  >
                                    {data?.FromTimeDisplay}
                                  </button>
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
    [dropDownState?.InvestigationSlot, Active]
  );

  const handleClickedDoublebaar = (data) => {
    console.log("DOUBLECLICKDATA", data);
    if (typePage === "OPDRadiologyConfirmation") {
      handleConfirmBox(data);
    } else {
      handleBookAppointment(data);
    }
  };

  useEffect(() => {
    fetchDropDown(data);
  }, []);

  return (
    <div className="row">
      <DatePicker
        className="custom-calendar"
        respclass="col-xl-2 col-md-3 col-sm-6 col-12"
        id="AppointmentDate"
        name="AppointmentDate"
        value={new Date(data?.AppointedDate)}
        handleChange={handleAppointDate}
        lable={t("FrontOffice.OPD.patientRegistration.AppointmentDate")}
        placeholder={VITE_DATE_FORMAT}
      />
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <LabeledInput
          label={"Investigation Name"}
          value={data?.ItemDisplayName}
        />
      </div>

      <ReactSelect
        //   placeholderName={t("FrontOffice.OPD.patientRegistration.Religion")}
        searchable={true}
        respclass="col-xl-2 col-md-3 col-sm-4 col-12"
        id="ModalityID"
        name="ModalityID"
        value={dropDownState?.defaultModalityValue}
        //   handleChange={handleReactSelect}
        dynamicOptions={dropDownState?.modalityDropDown}
      />

      <div className="text-end">
        <div className="d-flex flex-wrap ">
          <div className="d-flex align-items-center mx-2">
            <div className="statusConfirmed"></div>
            <label className="text-dark mx-1 my-0">Available</label>
          </div>
          <div className="d-flex align-items-center mx-2">
            <div className="statusRescheduled"></div>
            <label className="text-dark mx-1 my-0">Booked </label>
          </div>
          <div className="d-flex align-items-center mx-2">
            <div
              className="statusPending"
              style={{ backgroundColor: "#d96f6f" }}
            ></div>
            <label className="text-dark mx-1 my-0">Hold</label>
          </div>
          <div className="d-flex align-items-center mx-2">
            <div className="statusAppointment"></div>
            <label className="text-dark mx-1 my-0">Expired</label>
          </div>
          <div className="d-flex align-items-center mx-2">
            <div className="statusCanceled"></div>
            <label className="text-dark mx-1 my-0">Selected</label>
          </div>
        </div>
      </div>

      <div className="p-2" style={{ overflow: "auto" }}>
        {renderDoctorSlotViewer(dropDownState?.InvestigationSlot)}
      </div>
    </div>
  );
};

export default InvestigationModal;
