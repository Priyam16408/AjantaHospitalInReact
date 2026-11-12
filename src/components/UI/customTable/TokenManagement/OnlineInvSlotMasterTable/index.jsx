import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../../UI/customTable/index";

const index = (props) => {
  const {tbody} = props
  const [t] = useTranslation();
  const THEAD = [
    // t("tokenManagement.OnlineInvSlotMaster.Srno"),
    // t("tokenManagement.OnlineInvSlotMaster.SubCategory"),
    // t("tokenManagement.OnlineInvSlotMaster.TotalTestCount"),
    // t("tokenManagement.OnlineInvSlotMaster.Select"),
    t("Centre"),
    t("Days"),
    t("Start Time"),
    t("End Time"),
    t("Duration For Patient"),
    t("Shift"),
    t("Action")
  ];
  // const [bodyData, setBodyData] = useState([
  //   {
  //     Srno: 1,
  //     Shortcuts: "AEXM2425-000001",
  //     TotalTestCount: 1,
  //     input: 1,
  //   },
  // ]);
  // const handleChange = (e, index, name) => {
  //   const { value } = e.target;
  //   const data = [...bodyData];
  //   data[index][name] = value;
  //   setBodyData(data);
  // };
  return (
    <>
      <div className="mt-2">
        <Tables
          thead={THEAD}
          tbody={tbody.map((item, index) => ({
            // ...item,
            "Centre":item?.CentreName,
            "Days":item?.DAY,
            "Start Time":item?.StartTime,
            "End Time":item?.EndTime,
        "Duration For Patient":item?.DurationforPatient,
           "Shift":item?.ShiftName,
            Action:<>
             <i className="fa fa-trash text-danger text-center" aria-hidden="true"></i>
            </>
          }))}
          tableHeight={"tableHeight"}
        />
        
      </div>
    </>
  );
};

export default index;
