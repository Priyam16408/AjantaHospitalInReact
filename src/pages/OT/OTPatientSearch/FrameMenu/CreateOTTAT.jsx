import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../../../components/UI/Heading";
import Input from "../../../../components/formComponent/Input";
import ReactSelect from "../../../../components/formComponent/ReactSelect";
import Tables from "../../../../components/UI/customTable";
import {
  BindType,
  CPOEBindVitals,
  OTBindSavedStaff,
  OTBindStaff,
  OTBindTATType,
  OTGetAllSurgery,
  OTGetBookedMultipleSurgeryList,
  OTGetExitingOTsAPI,
  OTSaveNewSurgeryBooking,
  OTSaveStaff,
  OTSaveType,
  SaveTAT,
} from "../../../../networkServices/OT/otAPI";
import TimePicker from "../../../../components/formComponent/TimePicker";
import { Tooltip } from "primereact/tooltip";
import Modal from "../../../../components/modalComponent/Modal";
import {
  handleReactSelectDropDownOptions,
  notify,
} from "../../../../utils/utils";
import { useLocalStorage } from "../../../../utils/hooks/useLocalStorage";
import moment from "moment";

export default function CreateOTTAT({ data, setVisible }) {
  console.log("Data", data);
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const isMobile = window.innerWidth <= 769;
  const initialValues = { InTime: new Date(), OutTime: new Date() };

  const thead1 = [
    { name: t("S.No."), width: "1%" },
    {
      name: isMobile ? (
        t("Select")
      ) : (
        <input
          className="table-checkbox"
          type="checkbox"
          onChange={(e) => handleSelectAll(e)}
        />
      ),
      width: "1%",
    },
    { name: t("Type") },
    { name: t("Time") },
  ];
  const thead2 = [
    { name: t("S/No."), width: "1%" },
    { name: t("Staff Type") },
    { name: t("Staff Person Name") },
    { name: t("IN Time"), width: "1%" },
    { name: t("OUT Time"), width: "1%" },
    { name: t("Action"), width: "1%" },
  ];
  const thead3 = [
    { name: t("S.No."), width: "1%" },
    { name: t("Surgery Name") },
    { name: t("Entry Date time") },
    { name: t("Entry By") },
  ];
  const [values, setValues] = useState(initialValues);
  const [modalData, setModalData] = useState({ visible: false, modalData: "" });
  const [timeList, setTimeList] = useState([]);
  const [surgeryData, setSurgeryData] = useState([]);
  const [tatData, setTatData] = useState([]);
  console.log("tatData", tatData);
  const [dropDownState, setDropDownState] = useState({
    StaffType: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleSelect = (label, value) => {
    if (label === "StaffType") {
      setValues((val) => ({ ...val, Staff: { value: "" }, [label]: value }));
    } else {
      setValues((val) => ({ ...val, [label]: value }));
    }
  };

  const bindData = async () => {
    let [existingOTs] = await Promise.all([OTGetExitingOTsAPI()]);
  };

  const handleChangeCheckboxHeader = (e) => { };

  useEffect(() => {
    bindData();
  }, []);

  const handleCustomInput = (index, name, value) => {
    const list = [...tatData];
    // list[index][name] = moment(value).format("hh:mm A");
    list[index][name] = value;
    setTatData(list);
  };

  const handleSaveSurgery = async () => {
    const payload = {
      surgeryID: values?.NewSurgery?.value,
      surgeryName: values?.NewSurgery?.Name,
      otBookingID: data?.OTBookingID,
    };

    const response = await OTSaveNewSurgeryBooking(payload);
    if (response?.success) {
      notify(response?.message, "success");
      surgeryTableData();
    } else {
      notify(response?.message, "error");
    }
  };

  const handleChangeModal = (e) => {
    setModalData((val) => ({
      ...val,
      ["modalData"]: { [e.target.name]: e.target.value },
    }));
  };

  // save api for 1st button
  const handleSaveTypeAPI = async (data) => {

    if (!(data?.TypeName?.length > 0)) {
      notify("Please Enter Type Name", "error");
      return 0;
    }
    const payload = {
      type: 1,
      typeID: "",
      typeName: data?.TypeName,
    };

    const response = await OTSaveType(payload);
    if (response?.success) {
      notify(response?.message, "success");
      setModalData((val) => ({ ...val, visible: false }));
      bindStaffType();
    } else {
      notify(response?.message, "error");
      setDropDownState((val) => {
        return {
          ...val,
          Staff: [],
        };
      });
    }
  };

  // update api for 1st button
  const handleUpdateAPI = async (data) => {
    const payload = {
      type: 2,
      typeID: values?.StaffType?.ID?.split("#")[0],
      typeName: values?.StaffType?.StaffTypeName,
    };
    const response = await OTSaveType(payload);
    if (response?.success) {
      notify(response?.message, "success");
      bindStaffType();
      setValues((val) => ({ ...val, StaffType: "" }));
      setModalData((val) => ({ ...val, visible: false }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSaveStaffAPI = async (data3) => {
    if (!(data3?.TypeName?.length > 0)) {
      notify("Please Enter Staff Name", "error");
      return 0;
    }
    debugger
    const payload = {
      type: 1,
      typeID: values?.StaffType?.value.split("#")[0],
      staffName: String(data3?.TypeName),
      staffID: "",
    };

    const response = await OTSaveStaff(payload);

    if (response?.success) {
      notify(response?.message, "success");
      bindStaff();
      setModalData((val) => ({ ...val, visible: false }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleUpdateStaffAPI = async (data3) => {
    // if (!(data3?.TypeName?.length > 0)) {
    //     notify("Please Enter Staff Name", "error");
    //     return 0;
    //   }
    debugger
    const payload = {
      type: 2,
      typeID: values?.StaffType?.value.split("#")[0],
      staffName: String(values?.Staff?.Name),
      staffID: values?.Staff?.value,
    };

    const response = await OTSaveStaff(payload);

    if (response?.success) {
      notify(response?.message, "success");
      bindStaff();
      setValues((val) => ({ ...val, Staff: "" }));
      setModalData((val) => ({ ...val, visible: false }));
    } else {
      notify(response?.message, "error");
    }
  };

  const handleOpenStaffType = (header, placeholder, apiCall) => {
    setModalData({
      visible: true,
      width: "30vw",
      label: t(header),
      buttonName:
        values?.StaffType?.StaffTypeName?.length > 0 ? "De-Active" : "Save",
      CallAPI: apiCall,
      Component: (
        <Input
          type="text"
          className="form-control required-fields"
          id="TypeName"
          name="TypeName"
          onChange={handleChangeModal}
          lable={t(placeholder)}
          placeholder=" "
          value={values?.StaffType?.StaffTypeName}
          disabled={values?.StaffType?.StaffTypeName?.length > 0}
        />
      ),
    });
  };
  const handleOpenStaff = (header, placeholder, save) => {
    setModalData({
      visible: true,
      width: "30vw",
      label: t(header),
      buttonName: values?.Staff?.Name?.length > 0 ? "De-Active" : "Save",
      CallAPI: save,
      Component: (
        <Input
          type="text"
          className="form-control required-fields"
          id="TypeName"
          name="TypeName"
          onChange={handleChangeModal}
          lable={t(placeholder)}
          value={values?.Staff?.Name}
          placeholder=" "
          disabled={values?.Staff?.Name?.length > 0}
        />
      ),
    });
  };

  const bindStaffType = async () => {
    const response = await BindType();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        StaffType: handleReactSelectDropDownOptions(
          response?.data,
          "StaffTypeName",
          "ID"
        ),
      }));
    }
  };

  const bindStaff = async () => {
    const payload = {
      typeId: values?.StaffType?.value.split("#")[0],
      isMainDoctor: values?.StaffType?.value.split("#")[1],
    };
    const response = await OTBindStaff(payload);
    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Staff: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "DoctorID"
        ),
      }));
    }
  };

  const bindSavedStaff = async () => {
    const OTBookingID = data?.OTBookingID;
    const response = await OTBindSavedStaff(OTBookingID);
    if (response?.success) {
      setTimeList(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const bindAllSurgery = async () => {
    const response = await OTGetAllSurgery();

    if (response?.success) {
      setDropDownState((val) => ({
        ...val,
        Surgery: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "Surgery_ID"
        ),
      }));
    }
  };

  const surgeryTableData = async () => {
    const bookingID = data?.OTBookingID;

    const response = await OTGetBookedMultipleSurgeryList(bookingID);
    if (response?.success) {
      setSurgeryData(response?.data);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleSaveCentre = async () => { };

  const handleDelete = (index) => {
    const finalData = [...timeList];
    finalData.splice(index, 1);
    setTimeList(finalData);
  };

  const OTBindTATTypeData = async () => {
    const OTBookingID = data?.OTBookingID;
    const response = await OTBindTATType(OTBookingID);

    if (response?.success) {
      const updatedTatData = response.data.map((item) => {
        let updatedStartTime = item.StartTime;
        if (item.StartTime) {
          const today = moment().format("YYYY-MM-DD");
          updatedStartTime = moment(
            `${today} ${item.StartTime}`,
            "YYYY-MM-DD hh:mm A"
          ).toDate();
        }
        item.IsSelected = item?.IsSelected === "true" ? true : false;
        return { ...item, StartTime: updatedStartTime };
      });

      setTatData(updatedTatData);
    } else {
      notify(response?.message, "error");
    }
  };

  const handleRowSelect = (index, IsSelected) => {
    const finalData = [...tatData];
    finalData[index]["IsSelected"] = IsSelected;
    setTatData(finalData);
  };

  const handleSelectAll = (e) => {
    const finalData = [...tatData];
    finalData.map((val) => (val.IsSelected = e.target.checked));
    setTatData(finalData);
  };

  const handleAddStaffData = async () => {
    console.log(values);

    const inTime = new Date(values?.InTime);
    const outTime = new Date(values?.OutTime);

    if (inTime >= outTime) {
      notify("In Time should be less than Out Time", "error");
      return;
    }

    const formattedStartTime = moment(inTime).format("hh:mm A");
    const formattedEndTime = moment(outTime).format("hh:mm A");

    const isDuplicate = timeList.some(
      (item) =>
        item.StaffTypeName === values?.StaffType?.label &&
        item.StaffName === values?.Staff?.label
    );

    if (isDuplicate) {
      notify("Same Staff already exists", "error");
      return;
    }

    const finalData = [...timeList];
    finalData.push({
      tatTypeID: values?.TATType?.value.split("#")[0],
      StaffTypeID: values?.StaffType?.value.split("#")[0],
      StaffTypeName: values?.StaffType?.label,
      StaffID: values?.Staff?.value,
      StaffName: values?.Staff?.label,
      StartTime: formattedStartTime,
      EndTme: formattedEndTime,
    });
    setValues((val) => ({ ...val, InTime: new Date(), OutTime: new Date(), StaffType: { value: "" }, Staff: { value: "" } }));
    setTimeList(finalData);
  };

  const buildTatPayload = (timeList, tatData, otBookingID) => {
    debugger;
    const staffTimeEntries = timeList.map((item) => ({
      tatTypeID: 3,
      staffTypeID: item.StaffTypeID,
      staffID: item.StaffID,
      staffName: item.StaffName,
      inTime: item.StartTime,
      // inTime: moment(item.StartTime).format("hh:mm A"),
      // outTime: moment(item.EndTme).format("hh:mm A"),
      outTime: item.EndTme,
    }));

    const selectedTatEntries = tatData
      .filter((item) => item.IsSelected === true || item.IsSelected === "true")
      .map((item) => ({
        tatTypeID: item.ID,
        staffTypeID: 0,
        staffID: "",
        staffName: "",
        inTime: moment(item.StartTime).format("hh:mm A"),
        outTime: moment(item.StartTime).format("hh:mm A") || "",
      }));
    const tatDetails = [...staffTimeEntries, ...selectedTatEntries];
    return {
      tatDetails,
      ipAdress: ip,
      otBookingID: otBookingID,
    };
  };

  const handleSaveData = async () => {
    const payload = buildTatPayload(timeList, tatData, data?.OTBookingID);
    console.log("PAYLOAD", payload);
    const response = await SaveTAT(payload);
    if (response?.success) {
      notify(response?.message, "success");
    } else {
      notify(response?.message, "error");
    }
  };

  useEffect(() => {
    if (values?.StaffType?.value) {
      bindStaff();
    }
  }, [values?.StaffType?.value]);

  useEffect(() => {
    bindStaffType();
    bindSavedStaff();
    bindAllSurgery();
    surgeryTableData();
    OTBindTATTypeData();
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration ">
          <Heading title={t("Centre Master Details")} isBreadcrumb={true} />
          <div className="row ">
            <div className=" col-xl-6 col-md-6 col-12">
              <div className="p-2 card">
                <Tables
                  thead={thead1}
                  tbody={tatData?.map((val, index) => ({
                    SNo: index + 1,
                    Select: (
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        onChange={(e) => {
                          handleRowSelect(index, e.target.checked);
                        }}
                        checked={val?.IsSelected}
                      />
                    ),
                    TATTypeName: val?.TATTypeName,
                    Time: (
                      <TimePicker
                        removeFormControl={true}
                        className={"table-time"}
                        value={val?.StartTime}
                        handleChange={(e) => {
                          handleCustomInput(index, "StartTime", e.target.value);
                        }}
                      />
                    ),
                  }))}
                  style={{ height: "8.9vw" }}
                />
              </div>
            </div>

            <div className="col-xl-6 col-md-6 col-12">
              <div className="card">
                <div className="row p-2">
                  <div className="col-xl-4 col-md-6 col-sm-6 col-12 d-flex">
                    <ReactSelect
                      placeholderName={t("Staff Type")}
                      // id={"StaffType"}
                      searchable={true}
                      removeIsClearable={true}
                      respclass="w-100"
                      dynamicOptions={dropDownState?.StaffType}
                      handleChange={handleSelect}
                      value={values?.StaffType?.value}
                      name={"StaffType"}
                    />

                    <button
                      className="btn btn-sm btn-primary ml-1"
                      id="StaffType"
                      onClick={() => {
                        handleOpenStaffType(
                          values?.StaffType === undefined
                            ? "Create New Type"
                            : "De-Active Selected Type",
                          "Type Name",
                          values?.StaffType?.label
                            ? handleUpdateAPI
                            : handleSaveTypeAPI
                        );
                      }}
                    >
                      <Tooltip
                        target={`#StaffType`}
                        position="top"
                        content={t("Create & De-Active(Selected) Staff Type")}
                        event="hover"
                        className="ToolTipCustom"
                      />
                      <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                    </button>
                  </div>


                  <div className="col-xl-4 col-md-6 col-sm-6 col-12 d-flex">
                    <ReactSelect
                      placeholderName={t("Staff")}
                      // id={"FollowIPDNo"}
                      searchable={true}
                      removeIsClearable={true}
                      respclass="w-100"
                      dynamicOptions={dropDownState?.Staff}
                      handleChange={handleSelect}
                      value={values?.Staff?.value}
                      name={"Staff"}
                    />
                    {console.log("valuesvalues", values)}
                    <button
                      className="btn btn-sm btn-primary ml-1"
                      id="Staff"
                      onClick={() => {
                        handleOpenStaff(
                          !values?.Staff
                            ? "Create New Staff"
                            : "De-Active Selected Staff",
                          "Staff Name",
                          !values?.Staff
                            ? handleSaveStaffAPI
                            : handleUpdateStaffAPI
                        );
                      }}
                    >
                      <Tooltip
                        target={`#Staff`}
                        position="top"
                        content={t("Create & De-Active(Selected) Staff")}
                        event="hover"
                        className="ToolTipCustom"
                      />
                      <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                    </button>
                  </div>
                  <TimePicker
                    removeFormControl={true}
                    className={"required-fields"}
                    lable={t("Time In")}
                    respclass="col-xl-4 col-md-6 col-sm-6 col-12 mb-1"
                    value={values?.InTime ? values?.InTime : ""}
                    name="InTime"
                    handleChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  <TimePicker
                    removeFormControl={true}
                    className={"required-fields"}
                    respclass="col-xl-4 col-md-6 col-sm-6 col-12"
                    lable={t("Time Out")}
                    value={values?.OutTime ? values?.OutTime : ""}
                    name="OutTime"
                    handleChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  <button
                    className="btn btn-sm btn-primary px-3 mt-1  mx-2"
                    onClick={handleAddStaffData}
                  >
                    {t("Add")}
                  </button>
                </div>
                {timeList?.length > 0 && <>
                  <Tables
                    thead={thead2}
                    tbody={timeList?.map((val, index) => ({
                      Sno: index + 1,
                      StaffTypeName: val?.StaffTypeName,
                      StaffName: val?.StaffName,
                      Intime: val?.StartTime,
                      Outtime: val?.EndTme,
                      Action: (
                        <i
                          className="fa fa-trash text-danger"
                          onClick={() => handleDelete(index)}
                        >
                          {" "}
                        </i>
                      ),
                    }))}
                  />
                  <div className="text-right mt-1 mb-1">
                    <button
                      className="btn btn-sm btn-primary mr-1 px-4"
                      onClick={handleSaveData}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="spatient_registration_card">
        <div className="patient_registration">
          <Heading title={t("Multiple Surgery Add")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("New Surgery")}
              // id={"StaffType"}
              searchable={true}
              removeIsClearable={true}
              respclass="col-xl-2 col-md-3 col-sm-4 col-12"
              dynamicOptions={dropDownState?.Surgery}
              handleChange={handleSelect}
              value={values?.NewSurgery?.value}
              name={"NewSurgery"}
            />
            <button
              className="btn btn-sm btn-primary px-3"
              onClick={handleSaveSurgery}
            >
              {t("Add")}
            </button>
          </div>
          <Tables
            thead={thead3}
            tbody={surgeryData?.map((val, index) => ({
              Sno: index + 1,

              SurgerName: val?.SurgerName,
              EnryDatetime: val?.EnryDatetime,
              EntryBy: val?.EntryBy,
            }))}
            style={{ maxHeight: "11vw" }}
          />
        </div>
      </div>

      <Modal
        visible={modalData?.visible}
        setVisible={() => {
          setModalData((val) => ({ ...val, visible: false }));
        }}
        modalData={modalData?.modalData}
        modalWidth={modalData?.width}
        Header={modalData?.label}
        buttonType="button"
        buttonName={modalData?.buttonName}
        footer={modalData?.footer}
        handleAPI={modalData?.CallAPI}
      >
        {modalData?.Component}
      </Modal>
    </>
  );
}
