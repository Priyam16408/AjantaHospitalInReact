import React, { useEffect, useState } from "react";
import { DOCTOR_TIMING_COLOR } from "../../utils/constant";
import { DoctorAppointmentStatusByDoctorID } from "../../networkServices/doctorTimingapi";
import moment from "moment";
import { Tooltip } from "primereact/tooltip";
import { maxLengthChecker } from "../../utils/utils";

import { Checkbox } from "primereact/checkbox";




const DoctorDetails = ({ payloadData, isDocChecked ,prescription ,tags,
  setTags,
  items,}) => {

  const [checked, setChecked] = useState(false);
  const [doctorData, setDoctorData] = useState([]);




  const handleDoctorAppointmentStatusByDoctorID = async (payload) => {
    try {
      const data = await DoctorAppointmentStatusByDoctorID(payload);
      return data?.data;
    } catch (error) {
      console.log(error);
    }
  };

   const removeTag = (category, indexToRemove, id) => {
    let ID = Number(id) ? id : undefined
    const singleData = JSON.parse(JSON.stringify([...items[category]]));
    if (ID) {
      const index = singleData.findIndex(
        (itd) => Number(itd?.ID) === Number(ID)
      );
      // debugger
      if (index) {
        singleData[index]["isChecked"] = false;
        setItems({ ...items, [category]: singleData });
      }
    }

    setTags((prevTags) => ({
      ...prevTags,
      [category]: prevTags[category]?.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // console.log("payloadData", payloadData);

  useEffect(() => {
    if (payloadData?.DoctorID && payloadData?.Date) {
      handleDoctorInfo(payloadData);
    }
  }, [payloadData?.DoctorID, payloadData?.Date]);

  const handleDoctorInfo = async (payloadData) => {
    const payload = {};

    payload.doctorID = String(payloadData?.DoctorID);
    payload.date = moment(payloadData?.Date).format("YYYY-MM-DD");

    const result = await handleDoctorAppointmentStatusByDoctorID(payload);

    const CARD_ARRAY = [
      {
        backGroundColor: DOCTOR_TIMING_COLOR[10],
        label: "Total Slots",
        data: result?.TotalSlots,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[10]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              TS
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[8],
        label: "Slots Not Available",
        data: result?.Doctor_Slot_Not_Available,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[8]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              NA
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[0],
        label: "Expired Slots",
        data: result?.Expired_WO_App,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[0]}
              stroke-width="2"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke={"#3e3e3e"}
              stroke-width="2"
            />
            <line
              x1="6"
              y1="18"
              x2="18"
              y2="6"
              stroke={"#3e3e3e"}
              stroke-width="2"
            />
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[1],
        label: "Slots Available",
        data: result?.Available_Slots,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[1]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              AS
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[9],
        label: "Patient Booked",
        data: result?.Booked,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[9]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              B
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[7],
        label: "Patient Not Confirmed",
        data: result?.UnConfirmed,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[7]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              UC
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[11],
        label: "Re-Scheduled",
        data: result?.Rescheduled,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[11]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              RS
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[6],
        label: "Confirmed",
        data: result?.Confirmed,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[6]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              C
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[5],
        label: "Vitals Recorded",
        data: result?.Triage_Waiting,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[5]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              T
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[4],
        label: "Patient Waiting Out-Side",
        data: result?.Waiting,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[4]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              W
            </text>
          </svg>
        ),
      },
      {
        backGroundColor: DOCTOR_TIMING_COLOR[3],
        label: "Seen By Doctor",
        data: result?.Seen,
        image: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={DOCTOR_TIMING_COLOR[3]}
              stroke-width="2"
            />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="12"
              fill={"#3e3e3e"}
            >
              S
            </text>
          </svg>
        ),
      },
    ];
    setDoctorData(CARD_ARRAY);
  };

  return (
    <div className="d-flex align-items-center flex-wrap mt-1 " >

      {/* <div className=" mt-1"> */}
      {isDocChecked && doctorData.map((items, i) => {
        const uniqueId = `tooltip-${i}`;
        return (
          <div
            className=" d-flex justify-content-between  align-items-center data-viewer text-center  "
            style={{
              backgroundColor: items?.backGroundColor,
              fontWeight: 600,
              marginBottom: "5px",
              color: "#3e3e3e",
              // border:"2px solid red"
            }}
            data-pr-tooltip={items?.label}
            data-pr-position="top"
            id={uniqueId}

            key={i}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                margin: "0px 4px",
              }}
            >
              {items?.image}
            </div>
            <div className="mx-1">
              <div style={{ marginTop: "-2px", marginRight: "6px" }}>
                {maxLengthChecker(items.label, 9)}
              </div>
              <div style={{ marginTop: "-5px" }}>{items?.data}</div>
            </div>
            <Tooltip target={`#${uniqueId}`} />
          </div>
        );
      })}

      
          {prescription?.filter(
            (val) =>

              val.ID == 31
          )?.map((item, index) => (
            <>
              {tags[item?.AccordianName]?.length > 0 &&
                <div className="">
                  <div className="p-2 ml-2 d-flex align-items-center  ">
                    <div className="mr-2 font-weight-bold">{item?.DisplayName}: </div>
                    {tags[item?.AccordianName]?.map((tag, index) => (
                      < >
                        <span
                          key={index}
                          className="tag mr-2"
                          style={{
                            backgroundColor: tag?.ID ? "#FEFAE0" : "#F5EDED",
                            display: "inline-table",
                            color: "red"
                          }}
                        >
                          {tag?.ValueField || tag?.TypeName}
                          <span
                            className="tag-close-icon"
                            onClick={() =>
                              removeTag(item?.AccordianName, index, tag?.ID)
                            }
                          >
                            <i
                              className="fa fa-times-circle"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </span>
                      </>
                    ))}
                  </div>
                </div>
              }

            </>
          ))}

        




    </div>
  );
};

export default DoctorDetails;
