import React, { useState } from "react";
import Heading from "../UI/Heading";
import { useTranslation } from "react-i18next";
import RoomShift from "./RoomShift";
import DoctorShift from "./DoctorShift";

const DoctorRoomShift = ({ data }) => {
  const [t] = useTranslation();
  const [activeClass, setActiveClass] = useState("DS");
  const handleClickShiftChange = (classes) => {
    setActiveClass(classes);
    if (classes === "RS") {
      //   bindPanelApprovalDetails()
    }
  };
  
  const HandleShiftPage = () => {
    return (
      <>
        <span
          className={`pointer-cursor ${activeClass === "DS" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("DS");
          }}
        >
          {" "}
          {t("Doctor-Shift")}{" "}
        </span>
        <span
          className={`pointer-cursor ml-2 ${activeClass === "RS" ? "Active-Shift" : ""}`}
          onClick={() => {
            handleClickShiftChange("RS");
          }}
        >
          {" "}
          {t("Room-Shift")}{" "}
        </span>
      </>
    );
  };
  return (
    <>
      <div className="card">
        <Heading title={<HandleShiftPage />}> </Heading>
        {activeClass === "DS" ? (
          <DoctorShift activeClass={activeClass} data={data} />
        ) : (
          <RoomShift data={data} activeClass={activeClass} />
        )}
      </div>
    </>
  );
};

export default DoctorRoomShift;
