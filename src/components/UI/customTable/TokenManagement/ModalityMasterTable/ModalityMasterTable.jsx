import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../..";
const ModalityMasterTable = (props) => {
  const { tbody, handleEditData } = props;
  const [t] = useTranslation();

  const THEAD = [
    t("CentreName"),
    t("SNO"),
    t("SubCategoryName"),
    t("ModalityName"),
    t("Floor"),
    t("RoomNo"),
    t("ActiveStatus"),
    t("Edit"),
  ];

  return (
    <>
      <Tables
        thead={THEAD}
        tbody={tbody.map((ele, index) => ({
          SNO: index + 1,
          CentreName: ele?.CentreName,
          SubCategoryName: ele?.SubcategoryName,
          ModalityName: ele?.ModalityName,
          Floor: ele?.FLOOR,
          RoomNo: ele?.RoomNo,
          ActiveStatus: ele?.ActiveStatus,
          Edit: (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEditData(ele)}
              >
                {t("Edit")}
              </button>
            </>
          ),
        }))}
        tableHeight={"tableHeight"}
      />
    </>
  );
};

export default ModalityMasterTable;
