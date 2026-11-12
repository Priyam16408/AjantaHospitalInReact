import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Heading from "../../../components/UI/Heading";
import Input from "../../../components/formComponent/Input";
import Tables from "../../../components/UI/customTable";
import {
  EDPThresholdLimitSave,
  EDPThresholdLimitSearch,
} from "../../../networkServices/EDP/govindedp";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ThresholdMaster = ({data}) => {
  const [t] = useTranslation();

  const ip = useLocalStorage("ip", "get");

  const initialState = {
    panel: { label: "", value: "" },
    RoomType: { label: "", value: "" },
    ThresholdAmount: "",
    IsActive: { label: "", value: "" },
    oldPanelID: "",
    oldRoomID: "",
  };

  const roomTypedynamicOptions = [
    { label: "DAYCARE", value: "28" },
    { label: "Deluxe Cabin", value: "4" },
    { label: "Emergency", value: "31" },
    { label: "Executive Suite", value: "5" },
    { label: "General Ward", value: "6" },
    { label: "HDU", value: "30" },
    { label: "ICU", value: "9" },
    { label: "Private Cabin", value: "17" },
    { label: "Sharing Cabin", value: "18" },
  ];

  const panelDynamicOptions = [
    { label: "CASH", value: "1" },
    { label: "CGHS", value: "90" },
  ];

  const THEAD = [
    { name: "S.No." },
    { name: "Panel Name" },
    { name: "Room Name" },
    { name: "Threshold Amount" },
    { name: "Status" },
    { name: "Edit" },
  ];

  const initialPanelData = [
    {
      panelName: "CASH",
      roomName: "Emergency",
      thresholdAmount: 1,
      status: "",
    },
    {
      panelName: "CASH",
      roomName: "DAYCARE",
      thresholdAmount: 90000,
      status: "",
    },
  ];
  const [tableData, setTableData] = useState(initialPanelData);
  const [values, setValues] = useState({ ...initialState });
  console.log("Values", values);
  const handleReactSelect = (label, value) => {
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleInputChange = (e, index, label) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [label]: value }));
  };
  const handleEdit = (ele) => {
    console.log("Ele", ele);
    setValues({
      ...initialState,
      ID: ele?.ID,
      panelID: ele?.PanelID,
      panel: panelDynamicOptions.find(
        (item) => item.value === String(ele?.PanelID)
      ),
      RoomType:
        roomTypedynamicOptions.find(
          (item) => item.value === String(ele?.Room_Type)
        ) || ele?.Room_Type,
      ThresholdAmount: ele?.Amount,
      IsActive:
        ele.STATUS === "Active"
          ? { label: "Active", value: "1" }
          : { label: "Inactive", value: "0" },
      isEdit: 1,
      oldPanelID: String(ele?.PanelID),
      oldRoomID: String(ele?.Room_Type),
    });
  };

  const handleSave = async () => {
    const payload = {
      type: "Save",
      panelID: 1,
      roomType: values?.RoomType?.value,
      oldPanelID: 0,
      oldRoomID: 0,
      threshholdamount: values?.ThresholdAmount,
      active: values?.IsActive?.value,
      ipaddress: ip,
    };

    const response = await EDPThresholdLimitSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      setValues(initialState);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdate = async () => {
    const newPanelID = values?.panel?.value;
    const newRoomType = values?.RoomType?.value;

    const payload = {
      type: "Update",
      panelID: newPanelID,
      roomType: newRoomType,
      oldPanelID: values.oldPanelID,
      oldRoomID: values.oldRoomID,
      threshholdamount: values?.ThresholdAmount,
      active: values?.IsActive?.value,
      ipaddress: ip,
    };

    const response = await EDPThresholdLimitSave(payload);

    if (response?.success) {
      notify(response?.message, "success");
      searchThreshold();
      setValues(initialState);
    } else {
      notify(response?.message, "error");
    }
  };

  const searchThreshold = async () => {
    const response = await EDPThresholdLimitSearch();

    if (response?.success) {
      setTableData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    searchThreshold();
  }, []);
  return (
    <div className="card">
      <Heading
        title={data?.breadcrumb}
            // isMainHeading={{ data: data, FrameMenuID: data?.FrameMenuID }}
        data={data}
        isSlideScreen={true}
        isBreadcrumb={true}
      />
      <div className="row p-2">
        <ReactSelect
          placeholderName={t("Panel")}
          name="panel"
          value={values?.panel?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={panelDynamicOptions}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("Room Type")}
          name="RoomType"
          value={values?.RoomType?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={roomTypedynamicOptions}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <Input
          type="text"
          className={"form-control required-fields"}
          lable={t("Threshold Amount")}
          placeholder=" "
          name="ThresholdAmount"
          onChange={(e) => handleInputChange(e, 0, "ThresholdAmount")}
          value={values?.ThresholdAmount}
          required={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <ReactSelect
          placeholderName={t("IsActive")}
          name="IsActive"
          value={values?.IsActive?.value}
          handleChange={(name, e) => handleReactSelect(name, e)}
          dynamicOptions={[
            { label: "Active", value: "1" },
            { label: "InActve", value: "0" },
          ]}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-6 col-12"
        />
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={values?.isEdit === 1 ? handleUpdate : handleSave}
        >
          {values?.isEdit === 1 ? t("Update") : t("Save")}
        </button>
        <button
          className=" btn btn-sm btn-success ml-2 px-3"
          onClick={() => {
            setValues(initialState);
            setTableData([]);
          }}
        >
          {t("Reset")}
        </button>
      </div>
      <div>
        <Heading title={"Results"} isBreadcrumb={false} />
        <Tables
          thead={THEAD}
          tbody={tableData?.map((ele, index) => ({
            Sno: index + 1,
            panelName: ele?.PanelName,
            roomName: ele?.RoomName,
            thresholdAmount: ele?.Amount,
            status: ele?.STATUS,
            Edit: (
              <div className="fa fa-edit" onClick={() => handleEdit(ele)}></div>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default ThresholdMaster;
