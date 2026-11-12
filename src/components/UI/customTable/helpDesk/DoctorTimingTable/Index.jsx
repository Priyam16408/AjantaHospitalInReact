import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../../UI/customTable/index";

const Index = () => {
  const [t] = useTranslation();

  const THEAD = [
    t("helpDesk.doctortiming.Srno"),
    t("helpDesk.doctortiming.Centre"),
    t("helpDesk.doctortiming.DoctorName"),
    t("helpDesk.doctortiming.Mobile"),
    t("helpDesk.doctortiming.Department"),
    t("helpDesk.doctortiming.Specialization"),
    t("helpDesk.doctortiming.RoomNo"),
    t("helpDesk.doctortiming.Floor"),
    t("helpDesk.doctortiming.Day"),
    t("helpDesk.doctortiming.Shift"),
    t("helpDesk.doctortiming.StartTime"),
    t("helpDesk.doctortiming.EndTime"),
    t("helpDesk.doctortiming.TotalSlots"),
    t("helpDesk.doctortiming.BookedSlots"),
    t("helpDesk.doctortiming.AvailSlots"),
  ];
  const [bodyData, setBodyData] = useState([
    {
      "#": 1,

      Shortcuts: "AEXM2425-000001",
      "View Instruction": 1,
      "Is Critical": 1,
      "Triaging Code": 1,
      UHID: 1,
      "Patient Name": 1,
      Contact: 1,
      Sex: 1,
      Check: (
        <>
          <i
            className="fa fa-check"
            aria-hidden="true"
            onClick={() => show("top")}
          ></i>
        </>
      ),
    },
  ]);
  const handleChange = (e, index) => {
    console.log(bodyData);
    const { name, value } = e.target;
    const data = [...bodyData];
    data[index][name] = (
      <input
        value={value}
        onChange={(e) => handleChange(e, index)}
        name="input"
      />
    );
    setBodyData(data);
  };
  return (
    <>
      <Tables thead={THEAD} tbody={bodyData} />
    </>
  );
};

export default Index;
