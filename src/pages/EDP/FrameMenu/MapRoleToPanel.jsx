import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import TableData from "../../Finance/Approval/Audit/TableData";
import Tables from "../../../components/UI/customTable";
import { useTranslation } from "react-i18next";
import {
  EDPSaveRoleWiseCentrePanelGroup,
  GetCentreWithPanelGroupMappings,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/utils";

const MapRoleToPanel = (data) => {
  const [t] = useTranslation();
  const [tableData, setTableData] = useState([]);
  const groupIdMap = {
    CASH: "1",
    CORPORATES: "2",
    PANEL: "3",
    PSU: "4",
    TPA: "5",
  };



  const THEAD = [
    { name: "S.No." },
    { name: "Centre Name" },
    {
      name: (
        <span className="ml-1">
          <input type={"checkbox"} className="mr-2" />
          {t("CASH")}
        </span>
      ),
    },
    {
      name: (
        <span className="ml-1">
          <input type={"checkbox"} className="mr-2" />
          <span>{t("CORPORATES")}</span>
        </span>
      ),
    },
    {
      name: (
        <span className="ml-1">
          <input type={"checkbox"} className="mr-2" />
          {t("PANEL")}
        </span>
      ),
    },
    {
      name: (
        <span className="ml-1">
          <input type={"checkbox"} className="mr-2" />
          {t("PSU")}
        </span>
      ),
    },
    {
      name: (
        <span className="ml-1">
          <input type={"checkbox"} className="mr-2" />
          {t("TPA")}
        </span>
      ),
    },
  ];

  const GetCentreWithPanelGroupMappingsAPI = async () => {
    const roleID = data?.data?.values?.roleID;
    const response = await GetCentreWithPanelGroupMappings(1);
    if(response?.success){

      setTableData(response?.data);
    }else{
      setTableData([]);

    }
  };

  const handleCheckboxChange = (index, group) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      const row = newData[index];

      // Get current groups from PanelGroup (or use PanelGroupID if safer)
      let currentGroups = row.PanelGroup?.split(",").filter(Boolean) || [];

      const groupExists = currentGroups.includes(group);

      // Toggle logic
      let updatedGroups;
      if (groupExists) {
        updatedGroups = currentGroups.filter((g) => g !== group);
      } else {
        updatedGroups = [...currentGroups, group];
      }

      // Create valid PanelGroupIDs from updated group names
      const updatedGroupIDs = updatedGroups
        .map((g) => groupIdMap[g])
        .filter(Boolean); // remove undefined

      // Update the row
      newData[index] = {
        ...row,
        PanelGroup: updatedGroups.join(","),
        PanelGroupID: updatedGroupIDs.join(","),
      };

      return newData;
    });
  };

  useEffect(() => {
    GetCentreWithPanelGroupMappingsAPI();
  }, []);

  const handleSave = async () => {
    const roleID = 1; 

    const payload = {
      RoleID: roleID,
      MappedRolesWisePanelGroup: tableData?.map((ele) => ({
        centreID: ele.CentreID || 0,
        roleID: roleID,
        PanelGroupIDs: ele.PanelGroupID || "",
      })),
    };

    try {
      const response = await EDPSaveRoleWiseCentrePanelGroup(payload);
      if (response?.success) {
        notify(response?.message || "Saved successfully", "success");
      } else {
        notify(response?.message || "Save failed", "error");
      }
    } catch (error) {
      notify("Something went wrong while saving", "error");
      console.error("Save error:", error);
    }
  };

  return (
    <div className="card">
      {tableData?.length > 0 && (
        
      <>
      <Heading title={t("Role-Wise Billing Type Mapping List")} />
    
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => {
            const selectedGroups = ele.PanelGroup?.split(",") || [];

            return {
              "S.No.": index + 1,
              "Centre Name": ele?.CentreName,
              CASH: (
                <input
                  type="checkbox"
                  checked={selectedGroups.includes("CASH")}
                  onChange={() => handleCheckboxChange(index, "CASH")}
                />
              ),
              CORPORATES: (
                <input
                  type="checkbox"
                  checked={selectedGroups.includes("CORPORATES")}
                  onChange={() => handleCheckboxChange(index, "CORPORATES")}
                />
              ),
              PANEL: (
                <input
                  type="checkbox"
                  checked={selectedGroups.includes("PANEL")}
                  onChange={() => handleCheckboxChange(index, "PANEL")}
                />
              ),
              PSU: (
                <input
                  type="checkbox"
                  checked={selectedGroups.includes("PSU")}
                  onChange={() => handleCheckboxChange(index, "PSU")}
                />
              ),
              TPA: (
                <input
                  type="checkbox"
                  checked={selectedGroups.includes("TPA")}
                  onChange={() => handleCheckboxChange(index, "TPA")}
                />
              ),
            };
          })}
        />

        <div className="m-1" style={{textAlign:"end"}}>
        <button
          className="btn btn-sm btn-success ml-2 px-3"
          onClick={handleSave}
        >
          {t("Save")}
        </button>
        </div>
        </>)}
      </div>
   
  );
};

export default MapRoleToPanel;
