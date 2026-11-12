import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import { useTranslation } from "react-i18next";
import MultiSelectComp from "../../../components/formComponent/MultiSelectComp";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import ReportsMultiSelect from "../../../components/ReportCommonComponents/ReportsMultiSelect";
import {
  BindCentre,
  GetFloorByCentre,
  GetRoomByFloor,
  MapRoleToRoom,
  SaveBank,
} from "../../../networkServices/EDP/pragyaedp";
import Input from "../../../components/formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const MapRoom = ({setVisible}) => {
  const [t] = useTranslation();
  const localData = useLocalStorage("userData", "get");
  const [openedDropdownName, setOpenedDropdownName] = useState(null);

  const ip = useLocalStorage("ip", "get");
  const initialValues = { SelectedCentre: "", floorCentre: [] };

  const [FloorSelctions, setFloorSelctions] = useState([]);
  console.log("FloorSelctions", FloorSelctions);
  const [values, setValues] = useState({ ...initialValues });
  const [floorValues, setFloorValues] = useState({});
  const [secondFloorData, setSecondFloorData] = useState([]);
  const [floorList, setFloorList] = useState({});
  console.log("floorList", floorList);
  const roleId = JSON.parse(localStorage.getItem("userData"));

  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };

  const [centreValues, setCentreValues] = useState({
    BranchCentre: [],
  });

  console.log("CentreValues", centreValues);

  const [BindCentredata, setBindCentre] = useState([]);

  const handleBindCentre = async () => {
    console.log("the role id is", roleId.defaultRole);
    try {
      const apiResp = await BindCentre(roleId.defaultRole);
      if (apiResp.success) {
        console.log("Centre data:", apiResp?.data);
        setBindCentre(apiResp?.data);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error loading centre data:", error);
      notify("An error occurred while loading centre data", "error");
    }
  };

  const handleFloorOption = async () => {
    try {
      if (!values?.SelectedCentre?.value) return;

      const apiResp = await GetFloorByCentre(values?.SelectedCentre?.value);
      if (apiResp.success) {
        console.log("Floor data:", apiResp?.data);
        setFloorSelctions(apiResp?.data);

        const initialFloorValues = {};
        apiResp?.data.forEach((floor) => {
          initialFloorValues[floor.ID] = "";

          handleFloorSelection(floor.ID, floor.NAME);
        });
        setFloorValues(initialFloorValues);
      } else {
        notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error("Error loading floor data:", error);
      notify("An error occurred while loading floor data", "error");
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    
    setFloorValues((prev) => ({
      ...prev,
      [name.split("_")[1]]: selectedOptions, // extract floor ID from the name like "floor_1"
    }));
  };

  let floorID = centreValues?.BranchCentre?.map((item) => {
    return item.code;
  }).join(",");

  const handleFloorSelection = async (floorId, floorName) => {
    const payload = {
      roleID: localData?.defaultRole,
      floorId: floorId.toString(),
      floor: floorName,
    };

    try {
      const apiResp = await GetRoomByFloor(payload);
      if (apiResp.success) {
        console.log("API response for 2Nd Floor:", floorId, apiResp.data);

        // Store the 2Nd Floor specific data
        setFloorList((val) => ({ ...val, [floorId]: apiResp.data }));
        // setSecondFloorData(apiResp.data);

        // notify(apiResp?.message, "success");
      } else {
        // notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error(`Error loading data for floor ${floorName}:`, error);
      notify("An error occurred while loading floor data", "error");
    }
  };

  const getFloorOptions = (floorId, floorName) => {
    return floorList[floorId]?.map((item) => ({
      code: item.IPDCaseTypeID.toString(),
      name: item.Name,
    }));
  };

  const userData = localStorage.getItem("userData");

  const handleSave = async (ipdCaseTypeID, roleID, ipAddress) => {
    const selectedCodes = Object.entries(floorValues).flatMap(
      ([floorId, selectedItems]) =>
        selectedItems?.map((item) => `${item.code},${floorId}`)
    );

    const payload = {
      ipdCaseTypeID: selectedCodes,
      roleID: localData?.defaultRole,
      ipAddress: ip,
    };

    console.log("Pyaload Going", payload);

    try {
      const apiResp = await MapRoleToRoom(payload);
      if (apiResp.success) {
        setVisible();
        notify(apiResp?.message, "success");
      } else {
        // notify(apiResp?.message, "error");
      }
    } catch (error) {
      console.error(`Error loading data for floor :`, error);
      notify("An error occurred while loading floor data", "error");
    }
  };
  useEffect(() => {
    handleBindCentre();
  }, []);

  useEffect(() => {
    handleFloorOption();
  }, [values?.SelectedCentre?.value]);

  return (
    <div className="card">
      <Heading title={"Room Details"} isBreadcrumb={false} />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Selected Centre")}
          name="SelectedCentre"
          value={values?.SelectedCentre?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { value: "0", label: "ALL" },
            ...handleReactSelectDropDownOptions(
              BindCentredata,
              "CentreName",
              "CentreID"
            ),
          ]}
          removeIsClearable={true}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-12"
        />
        {FloorSelctions.map((floor) => (
          <MultiSelectComp
            key={floor.ID}
            name={`floor_${floor.ID}`}
            id="BranchCentre"
            value={floorValues[floor.ID] || []}
            handleChange={(name, option) =>
              handleMultiSelectChange(name, option, floor.ID)
            }
            dynamicOptions={getFloorOptions(floor.ID, floor.NAME)}
            respclass="col-xl-2 col-md-4 col-sm-4 col-12"
            lable={floor.NAME}
            placeholderName={floor.NAME}
            overlayVisible={openedDropdownName === `floor_${floor.ID}`}
            onToggle={(e) => {
              if (e) {
                setOpenedDropdownName(`floor_${floor.ID}`); // open this one
              } else {
                setOpenedDropdownName(null); // close
              }
            }}
          />
        ))}

        <button
          className="btn btn-sm btn-success py-1 px-2 ml-auto mt-1"
          style={{ width: "70px" }}
          onClick={handleSave}
        >
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default MapRoom;
