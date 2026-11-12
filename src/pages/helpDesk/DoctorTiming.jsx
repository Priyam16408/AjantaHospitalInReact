import React, { useCallback, useEffect, useState } from "react";
import Heading from "@app/components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "@app/components/formComponent/ReactSelect";
import DatePicker from "../../components/formComponent/DatePicker";
import DoctorDetails from "../../components/HelpDesk/DoctorDetails";
import {
  GetBindDoctorDept,
  GetDoctorAppointmentTimeSlotConsecutive,
} from "../../networkServices/opdserviceAPI";
import { DOCTOR_TIMING_COLOR } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { GetBindDepartment } from "../../store/reducers/common/CommonExportFunction";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import moment from "moment";
import { updateAppointmentSchedule } from "../../networkServices/OPDConfirmation";

const DoctorTiming = () => {
  const { VITE_DATE_FORMAT } = import.meta.env;
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const { GetDepartmentList } = useSelector((state) => state.CommonSlice);
  const [draggedItemApp_ID, setDraggedItemApp_ID] = useState(null);
  const [shiftData, setShiftData] = useState({});
  const [DropDownState, setDropDownState] = useState({
    getDoctorDeptWise: [],
  });
  const [payloadData, setPayloadData] = useState({
    DepartmentID: "ALL",
    DoctorID: "",
    Date: new Date(),
  });

  const dragStart = (item) => {
    setDraggedItemApp_ID(item?.App_ID);
  };

  const handleModifiedDoctorSlotData = (apiResponse, key, secondKey) => {
    const objData = apiResponse.reduce((acc, current) => {
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

  const handleDoctorDeptWise = async (Department) => {
    try {
      const data = await GetBindDoctorDept(Department);
      return data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const FetchAllDropDown = async () => {
    try {
      const response = await Promise.all([
        handleDoctorDeptWise(payloadData?.DepartmentID),
      ]);

      const responseDropdown = {
        getDoctorDeptWise: handleReactSelectDropDownOptions(
          response[0],
          "Name",
          "DoctorID"
        ),
      };

      setDropDownState(responseDropdown);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayloadData({
      ...payloadData,
      [name]: value,
    });
  };

  // react select handleChange
  const handleReactSelectChange = async (name, e) => {
    switch (name) {
      case "DepartmentID":
        const data = await handleDoctorDeptWise(e.label);

        setDropDownState({
          ...DropDownState,
          getDoctorDeptWise: handleReactSelectDropDownOptions(
            data,
            "Name",
            "DoctorID"
          ),
        });
        break;
      default:
        setPayloadData({
          ...payloadData,
          [name]: e.value,
        });
        break;
    }
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
      const modifiedData = handleModifiedDoctorSlotData(
        apiResponse?.data,
        "ShiftName",
        "SlotGroupTime"
      );
      setShiftData(modifiedData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSearch = async () => {
    const payload = {};
    payload.doctorID = String(payloadData?.DoctorID);
    payload.date = moment(payloadData?.Date).format("YYYY-MM-DD");
    await handleGetDoctorAppointmentTimeSlotConsecutive(
      payload?.doctorID,
      payload?.date
    );
  };

  const handleUpdateAppointmentSchedule = async (APIPARAMS) => {
    const res = await updateAppointmentSchedule({
      slotTiming: `${APIPARAMS?.SlotDateDisplay} # ${APIPARAMS?.FromTimeDisplay} - ${APIPARAMS?.ToTimeDisplay}`,
      appID: String(draggedItemApp_ID),
      isSlotWiseToken: "0",
      doctorID: APIPARAMS?.DoctorID,
    });

    if (res?.success) {
      handleSearch();
    }
  };

  useEffect(() => {
    if (GetDepartmentList.length === 0) {
      dispatch(GetBindDepartment());
    }
    FetchAllDropDown();
  }, []);

  const handleSplit = (data, express) => {
    const returnData = data.split(express);

    if (returnData.length > 1) {
      return (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <svg
                width="20"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4ZM5 5H19V9H5V5ZM19 19H5V11H19V19ZM7 13H9V15H7V13ZM11 13H17V15H11V13ZM7 17H9V19H7V17ZM11 17H17V19H11V17Z"
                  fill="currentColor"
                />
                <circle cx="4" cy="4" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>{returnData[1]}</div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <svg
                width="20"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M4 20C4 15.5817 7.58172 12 12 12C16.4183 12 20 15.5817 20 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div>{returnData[2]}</div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <svg
                width="24"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3h-4V1h6v6h-2V4.41l-3.89 3.89A7.86 7.86 0 0 1 19 12a8 8 0 1 1-8-8c1.77 0 3.4.57 4.71 1.52L19 3zm-9 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              {returnData[3]} | {returnData[4]}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <svg
                width="24"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13h-1v6h6v-1h-5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>{returnData[5]}</div>
          </div>
        </div>
      );
    } else {
      return <div className="show-detail">{returnData[0]}</div>;
    }
  };

  const handleTouchStart = (e, data) => {
    e.preventDefault();
    dragStart(data);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e, data) => {
    e.preventDefault();
    handleUpdateAppointmentSchedule(data);
  };

  const renderData = useCallback(
    (shiftData) => {
      const shiftName = Object.keys(shiftData);
      return shiftName?.map((shift, index) => {
        const doctorSlotData = shiftData[shift];
        const slotGroupTime = Object.keys(doctorSlotData);
        return (
          <div>
            <div key={index} className="shift-header">
              {shift}
            </div>
            <div className="row">
              {slotGroupTime?.map((groupTime, innerIndex) => {
                return (
                  <>
                    <div key={innerIndex} className="col-12">
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
                                    draggable={true}
                                    onDragStart={() => {
                                      dragStart(data);
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                    }}
                                    onDrop={() => {
                                      handleUpdateAppointmentSchedule(data);
                                    }}
                                    onTouchStart={(e) =>
                                      handleTouchStart(e, data)
                                    }
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={(e) => handleTouchEnd(e, data)}
                                    style={{
                                      backgroundColor:
                                        DOCTOR_TIMING_COLOR[
                                          data?.DoctorStatusID
                                        ],
                                      color: "black",
                                      margin: "5px",
                                      padding: "2px",
                                      borderRadius: "5px",
                                      width: "153px",
                                      minHeight: "60px",
                                    }}
                                  >
                                    <div key={mostInnerIndex}>
                                      <div
                                        style={{
                                          fontSize: "8px !important",
                                          marginBottom: "-5px",
                                        }}
                                      >
                                        {data?.DoctorStatus}
                                      </div>
                                      <div>
                                        <div className="d-flex align-items-center justify-content-between">
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="6"
                                              stroke="black"
                                              strokeWidth="1.5"
                                            />
                                            <line
                                              x1="12"
                                              y1="8"
                                              x2="12"
                                              y2="12"
                                              stroke="black"
                                              strokeWidth="1.5"
                                            />
                                            <line
                                              x1="12"
                                              y1="12"
                                              x2="15"
                                              y2="13.5"
                                              stroke="black"
                                              strokeWidth="1.5"
                                            />
                                          </svg>
                                          <div>{data?.FromTimeDisplay}</div>
                                        </div>
                                        {handleSplit(data?.PatientDetails, "|")}
                                      </div>
                                    </div>
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
          </div>
        );
      });
    },
    [shiftData, draggedItemApp_ID]
  );

  return (
    <>
      <div className="mt-1 spatient_registration_card">
        <div className="patient_registration card">
          <Heading isBreadcrumb={true} />
          <div className="row p-1">
            <div className="col-xl-2 col-md-4 col-sm-4 col-12">
              <ReactSelect
                placeholderName={t("Department")}
                id={"Title"}
                searchable={true}
                respclass=""
                value={payloadData?.DepartmentID}
                dynamicOptions={[
                  { label: "All", value: "ALL" },
                  ...handleReactSelectDropDownOptions(
                    GetDepartmentList,
                    "Name",
                    "ID"
                  ),
                ]}
                name="DepartmentID"
                handleChange={handleReactSelectChange}
              />
              <ReactSelect
                placeholderName={t("Doctor")}
                id={"Title"}
                searchable={true}
                dynamicOptions={DropDownState?.getDoctorDeptWise}
                respclass=""
                value={payloadData?.DoctorID}
                name="DoctorID"
                requiredClassName="required-fields"
                handleChange={handleReactSelectChange}
              />
              <DatePicker
                className="custom-calendar required-fields"
                respclass=""
                id="date"
                name="Date"
                lable={t("Date")}
                value={payloadData?.Date}
                placeholder={VITE_DATE_FORMAT}
                showTime={true}
                hourFormat="12"
                handleChange={handleChange}
              />

              <div>
                <button
                  className="btn btn-sm btn-primary w-100"
                  type="button"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
            <div className="col-xl-10 col-md-8 col-sm-8 col-12">
              {Object?.keys(shiftData)?.length > 0 && (
                <DoctorDetails payloadData={payloadData} />
              )}
              <div className="overflow-doctorTimming">
                {renderData(shiftData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorTiming;
