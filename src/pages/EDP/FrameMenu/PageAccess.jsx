import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import LabeledInput from "../../../components/formComponent/LabeledInput";
import Tables from "../../../components/UI/customTable";
import index from "../CentreManagement/Index";
import { notify } from "../../../utils/utils";
import {
  EDPGetUserAccess,
  EDPSavePageAccess,
  GetRoleWisePages,
} from "../../../networkServices/EDP/edpApi";
import { useTranslation } from "react-i18next";

const PageAccess = (data) => {
  const [t] = useTranslation();
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [checkedColumns, setCheckedColumns] = useState({});
  const [tableData, setTableData] = useState([]);
  const renderedRoles = new Set();
  const renderMenu = new Set();

  const handleColumnCheck = (center) => {
    setCheckedColumns((prev) => ({
      ...prev,
      [center]: !prev[center],
    }));

    // Update all rows in tableData for the selected column
    setTableData((prevData) =>
      prevData.map((row) => {
        const key = Object.keys(row).find((k) => k.startsWith(center + "_"));
        if (key) {
          return { ...row, [key]: !prevData[0][key] }; // Toggle all rows based on first row's state
        }
        return row;
      })
    );
  };

  const handleRowCheck = (index, center, e) => {
    // ;
    let data = JSON.parse(JSON.stringify(tableData));
    data[index][center] = e?.target?.checked;
    setTableData(data);
  };
  const isMobile = window.innerWidth <= 800;

  const THEAD = [
    { name: t("S.No"), width: "5%" },
    { name: t("Module"), width: "20%" },
    { name: t("Menu"), width: "20%" },
    { name: t("Display Name"), width: "20%" },
    ...selectedCenters.map((center) => ({
      name: isMobile ? (
        center
      ) : (
        <>
          <input
            type="checkbox"
            checked={checkedColumns[center] || false}
            onChange={() => handleColumnCheck(center)}
          />
          <span style={{ marginLeft: "8px" }}>{center}</span>
        </>
      ),
      width: "8%",
    })),
  ];

  console.log("tableData", tableData);

  const getRoleWiseAccessAPI = async () => {
    try {
      const empID = data?.data?.EmployeeID;
      const res = await GetRoleWisePages(empID);
      if (res?.success) {
        setTableData(res?.data);

        const centers = [
          ...new Set(
            res?.data.flatMap(
              (ele) =>
                Object.keys(ele)
                  .filter((key) => key.includes("_"))
                  .map((key) => key.split("_")[0]) // Extract center name
            )
          ),
        ];

        setSelectedCenters(centers);
        notify(data?.message, "success");
      } else {
        notify(data?.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const empID = data?.data?.EmployeeID;
    let payload = [];

    tableData.forEach((row) => {
      selectedCenters.forEach((center) => {
        const centerKey = Object.keys(row).find((key) =>
          key.startsWith(center + "_")
        );
        if (centerKey) {
          payload.push({
            RoleID: row.RoleID.toString(),
            MenuID: row.MenuID.toString(),
            UrlID: row.UrlID.toString(),
            EmployeeID: empID,
            RoleName: row.RoleName || "",
            CentreID: parseInt(centerKey.split("_")[1]), // Extracting ID
            Status: Boolean(row[centerKey]), // Convert 1/0 to true/false
          });
        }
      });
    });

    console.log("Payload:", payload);
    // Send payload to API

    const dataReceived = await EDPSavePageAccess(payload);

    if (dataReceived?.success) {
      notify(dataReceived?.message, "success");
      // setTableData([])
    } else {
      notify(data?.message, "error");
    }
  };

  // const fetchUserAccess = async () => {
  //   const empID = data?.data?.EmployeeID;
  //   const response = await EDPGetUserAccess(empID);
  //   if (response?.success) {
  //     setTableData(response?.data);
  //   } else {
  //     notify(response?.message, "error");
  //   }
  // };

  useEffect(() => {
    getRoleWiseAccessAPI();
    // fetchUserAccess();
  }, []);

  return (
    <div className="mt-2 card">
      <Heading title={"Employee Details"} />
      <div className="row p-3">
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Employee Name"}
            value={data?.data?.NAME}
            className=""
          />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Father's Name"}
            value={data?.data?.Pname}
            className=""
          />
        </div>
        <div className="col-xl-2 col-md-3 col-sm-4 col-12">
          <LabeledInput
            label={"Mother's Name"}
            value={data?.data?.Department}
            className=""
          />
        </div>
      </div>
      <Heading title={"Page Access"} />
      <Tables
        thead={THEAD}
        style={{ height: "50vh" }}
        tbody={tableData?.map((ele, index) => {
          const isFirstOccurrence = !renderedRoles.has(ele.RoleName);
          const isMenuFirstOccurrence = !renderMenu.has(ele.MenuName);

          if (isFirstOccurrence) {
            renderedRoles.add(ele.RoleName);
          }

          if (isMenuFirstOccurrence) {
            renderMenu.add(ele.MenuName);
          }

          return {
            SNo: index + 1,
            Module: isFirstOccurrence ? ele?.RoleName : "",
            Menu: isMenuFirstOccurrence ? ele?.MenuName : "",
            DisplayName: ele?.DispName,

            ...Object.keys(ele)
              .filter((key) => key.includes("_"))
              .reduce((acc, center) => {
                // let key = Object?.keys(ele).find(
                //   (k) => k.split("_")[0] === center
                // );
                // console.log("asdasdasdas", center);
                acc[center] = (
                  <input
                    type="checkbox"
                    checked={ele[center]}
                    onChange={(e) => handleRowCheck(index, center, e)}
                  />
                );

                return acc;
              }, {}),
          };
        })}
      />
      {tableData?.length > 0 && (
        <div className="col-sm-2 p-2">
          <button className="btn btn-sm btn-success" onClick={handleSave}>
            {t("Save")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PageAccess;
