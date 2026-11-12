import React from "react";
import Tables from "..";
import Heading from "../../Heading";
import ColorCodingSearch from "../../../commonComponents/ColorCodingSearch";
import { useTranslation } from "react-i18next";
const DoctorShiftTable = ({ THEAD, tbody }) => {
  console.log(tbody);
  const [t]=useTranslation();
  const getRowClass = (val) => {
    console.log(val);
    let slotConfirmationDetail = tbody?.find(
      (item) => item?.Status === val?.Status
    );
    console.log(slotConfirmationDetail);
    if (slotConfirmationDetail?.Status === "IN") {
      return " IsConform";
    } else if (slotConfirmationDetail?.Status == "OUT") {
      return "Statusdone";
    }
  };
  return (
    <>
      <Heading
        title={t("Item Details")}
        secondTitle={
          <>
            <ColorCodingSearch color={"#ddffc3"} label={t("In")} />
            <ColorCodingSearch color={"#e7c2e1"} label={t("Out")} />
          </>
        }
      />
      <Tables
        thead={THEAD}
        tbody={tbody?.map((item, index) => ({
          SNo: index + 1,
          "Admitted Under": item?.AdmittedUnder,
          "Current Consultant": item?.CurrentConsultant,
          "Entry Date": item?.EntryDate,
          "Leave Date": item?.LeaveDate,
          "Shifted By": item?.Name,
          Status: item?.Status,
        }))}
        tableHeight={"tableHeight"}
        // style={{ maxHeight: "120px" }}
        getRowClass={getRowClass}
      />
    </>
  );
};

export default DoctorShiftTable;
