import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../../../UI/customTable/index";
const SearchingCriteriaTable = ({ thead, tbody, getBindPreEstimateCost }) => {
  const [t] = useTranslation();
  const getRowClick = async (rowData) => {
    await getBindPreEstimateCost(rowData);
  };
  return (
    <>
      {tbody?.length > 0 && (
        <Tables
          thead={thead}
          tbody={tbody?.map((ele, index) => ({
            SrNo: index + 1,
            RoomType: ele?.RoomType,
            Doctor_Name: ele?.DoctorName,
            PanelName: ele?.PanelName,
            BillNo: ele?.BillNo,
            BillDate: ele?.BillDate,
            BillAmount: ele?.BillAmount,
          }))}
          getRowClick={getRowClick}
        />
      )}
    </>
  );
};

export default SearchingCriteriaTable;
