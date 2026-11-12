import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { OtDoctor } from "../../../../components/SvgIcons";
import { OTGetBookingTAT } from "../../../../networkServices/OT/otAPI";
import { notify } from "../../../../utils/ustil2";
import moment from "moment";

const OTtatAnalysis = ({ data }) => {
  console.log("data", data);
  const [t] = useTranslation();
  const [PatientStatus, setPatientStatus] = useState([]);

  console.log("PatientStatus", PatientStatus);

  const getPatientStatus = async () => {
    const bookingID = data?.OTBookingID;

    const response = await OTGetBookingTAT(bookingID);
    if (response?.success) {
      setPatientStatus(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    getPatientStatus();
  }, []);

  return (
    <div className="row text-center ml-5">
      {PatientStatus.map((item, index) => (
        <>
          <div
            className="d-flex justify-content-around"
            key={index}
            style={{
              background:
                item?.nextPending == 1 ? "" : "rgba(255, 255, 255, 0.5)",
              opacity:
                item?.nextPending == 1
                  ? //  ||
                    // (item?.ID == 9 &&
                    //   item?.nextPending == "0" )
                    1
                  : 0.7,
              pointerEvents:
                item?.nextPending == 1
                  ? // ||
                    // (item?.ID == 9 &&
                    //   item?.nextPending == "0" )
                    "auto"
                  : "none",
              // marginBottom: "8px",
              padding: "18px",
            }}
          >
            <div
              className={`card position-relative  ${item?.completeStatus == 1 && "blink-box"}`}
              style={{
                border: "2px solid #568203",
                textAlign: "center",
                width: "150px",
                borderRadius: "5px",
                height: "150px",
                marginRight: "10px",
                width: "130px",
              }}
              // onClick={() => handleCheckRights(item?.UserAuth, item)}
            >
              <div
                className="stepcard"
                style={{
                  background:
                    item?.completeStatus == 1
                      ? "linear-gradient(0deg, rgb(12, 170, 83) 10%, rgb(27, 137, 74))"
                      : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                }}
              >
                <label className="steps">{index + 1}</label>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{
                  paddingTop: "6px",
                  paddingBottom: "2px",
                  // background: "linear-gradient(#be8315, #7e560b) ",
                  background:
                    item?.completeStatus == 1
                      ? "linear-gradient(0deg, rgb(12, 170, 83) 10%, rgb(27, 137, 74))"
                      : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                  margin: "5px",
                  borderRadius: "0px 0px 100px 100px ",
                }}
              >
                <>
                  {item?.completeStatus == 1 ? (
                    <>
                      <OtDoctor />
                    </>
                  ) : (
                    <OtDoctor />
                  )}
                </>
              </div>
              <label
                className={`statusIcon`}
                style={{
                  background:
                    item?.completeStatus == 1
                      ? "linear-gradient(0deg, rgb(12, 170, 83) 10%, rgb(27, 137, 74))"
                      : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                }}
              >
                {t(item?.Abbreviation)}
              </label>
              <div
                className="card-body text-center"
                style={{
                  background:
                    item?.completeStatus == 1
                      ? "linear-gradient(0deg, rgb(12, 170, 83) 10%, rgb(27, 137, 74))"
                      : "linear-gradient(0deg, rgb(185, 141, 10) 10%, rgb(255, 191, 0))",
                  color: "white",
                  padding: "0px",
                  margin: "0px",
                }}
              >
                {item?.completeStatus == 1 ? (
                  <p className="card-text text-center m-0">{`Start Time :\n ${ moment(item?.StartTime, "HH:mm:ss").format("hh:mm A")}`}</p>
                ) : (
                  <p className="card-text text-center m-0">{`Not Started Yet`}</p>
                )}
              </div>
            </div>
            {index === PatientStatus.length - 1 ? (
              ""
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <label className="Clearancearrow"></label>
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default OTtatAnalysis;
