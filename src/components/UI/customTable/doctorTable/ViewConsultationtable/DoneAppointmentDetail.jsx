import React from "react";
import Heading from "../../../Heading";
import Tables from "../..";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

const DoneAppointmentDetail = ({
  thead,
  tbody,
  handleCallButtonClick,
  handlePatientSelect,
  start,
}) => {
  const [t] = useTranslation();
  return (
    <>
      {/* {tbody.map((item, index) => (
        <Tooltip
          key={index}
          target={`#Doctor-${index}}`}
          position="top"
        //   content={item.Dname}
        />
      ))} */}
      {/* <Heading title={t("Item Details")} /> */}
      <Tables
        thead={thead}
        tbody={(Array.isArray(tbody) ? tbody : []).map((item, index) => ({
          "Sr.No": index + 1,
          MRNo: item?.MRNo,
          Pname: item?.Pname,
          Age: (
            <span>
              {" "}
              {item?.Age}/{item?.Sex}
            </span>
          ),
          Doctor: (
            <>
              <span
                id={`Doctor-${index}`}
                data-pr-tooltip={item?.DName}
                style={{ fontSize: "11px" }}
              >
                {`${item?.DName}...`}
                {/* {`${item?.DoctorName?.substring(0, 8)}...`} */}
              </span>
            </>
          ),
          AppointmentDate: item?.AppointmentDate,
          IsCall: (
            <>
              {/* <i className="pi pi-check" onClick={() => handlePatientSelect(item,index)}
              disabled={item?.IsCall === 1 ? false : true}></i> */}
              <button
                className="btn btn-sm text-white"
                onClick={() => handlePatientSelect(item, index, "done")}
              >
                In
              </button>
            </>
          ),
        }))}
        tableHeight={"tableHeight scrollView"}
        style={{ height: "auto" }}
      />
    </>
  );
};

export default DoneAppointmentDetail;
