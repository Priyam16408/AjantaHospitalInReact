import React from "react";
import Heading from "../../../Heading";
import Tables from "../..";
import { useTranslation } from "react-i18next";
import { maxLengthChecker } from "../../../../../utils/utils";
import { Tooltip } from "primereact/tooltip";

const PendingAppointmentPatientList = ({
  thead,
  tbody,
  handleCallButtonClick,
  handlePatientSelect,
  start,
}) => {
  const [t] = useTranslation();
  const getRowClass = (val, index) => {
    let data = tbody?.[index];
    if (data?.TemperatureRoom === 1) {
      return "color-indicator-3-bg";
    } else if (data?.IsView === 1) {
      return "color-indicator-16-bg";
    } else if (data?.Hold === 1) {
      return "color-indicator-5-bg";
    }
  };
  return (
    <>
      <Tables
        getRowClass={getRowClass}
        thead={thead}
        tbody={tbody?.map((item, index) => ({
          "Sr.No.": <span>{index + 1}</span>,
          MRNo: <span>{item?.MRNo}</span>,
          Pname: <span>{item?.Pname}</span>,
          Age: (
            <span>
              {item?.Age}/{item?.Sex}
            </span>
          ),
          Doctor: (
            <>
              <>
                <span id={`doctor-tooltip-${index}`}>
                  {maxLengthChecker(item?.DName, 30)}
                </span>
                {item?.DName?.length > 10 && (
                  <Tooltip
                    target={`#doctor-tooltip-${index}`}
                    content={item?.DName}
                  />
                )}
              </>
            </>
          ),
          // AppointmentDate: item?.AppointmentDate +" "+item?.TIME,
          AppointmentDate: item?.BillDate1,
          // AppointmentNo: item?.AppNo,
          // PanelName: item?.PanelName,
          IsCall: (
            <button
              className="btn btn-sm text-white "
              onClick={() => handleCallButtonClick(item, index, "Pending")}
              style={{
                backgroundColor: item?.IsCall === 1 ? "gray" : "",
                borderColor: "#f8f988",
              }}
            >
              {item?.IsCall === 1 ? "UnCall" : "Call"}
            </button>
          ),
          // P_In: (
          //   <button
          //     className="btn btn-sm text-white w-100"
          //     onClick={() => {
          //       handlePatientSelect(item, index, "Pending");
          //
          
          //     }}
          //     disabled={item?.IsCall === 1 ? false : true}
          //   >
          //     In
          //   </button>
          // ),
        }))}
        tableHeight={"tableHeight scrollView"}
        style={{ height: "auto" }}
      />
    </>
  );
};

export default PendingAppointmentPatientList;
