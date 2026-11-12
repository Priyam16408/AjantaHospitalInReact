import React, { useEffect, useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import { MRDBindRoom, MRDSaveNewRoom } from "../../../networkServices/MRDApi";
import Tables from "../../../components/UI/customTable";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import Input from "../../../components/formComponent/Input";
import { notify } from "../../../utils/utils";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useTransition } from "react";



const MRDRoomCreate = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [tableData, setTableData] = useState([]);

  const [payload, setPayload] = useState({
    roomName: "",
    savetype: "Save",
    isActive: "1",
    roomID: "",
  });

  const THEAD = [
    t("S.No."),
    t("RoomName"),
    t("Status"),
    t("CreatedBy"),
    ("Created Date Time"),
    t("Edit"),
  ];
  
  const IS_ACTIVE_OPTION = [
    {
      label: "Yes",
      value: "1",
    },
  
    {
      label: "No",
      value: "0",
    },
  ];

  const handleMRDBindRoom = async () => {
    try {
      const response = await MRDBindRoom();
      setTableData(response?.data);
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleEdit = (row) => {
    setPayload({
      roomName: row?.NAME,
      isActive: row?.IsActive,
      roomID: row?.RMID,
      savetype: "Update",
    });
  };

  const handleTableData = (tableData) => {
    return tableData?.map((row, index) => {
      const { NAME, Active, Createdby, CreatedDate } = row;
      return {
        SNo: <div className="p-1">{index + 1}</div>,
        RoomName: NAME,
        Status: Active,
        Createdby: Createdby,
        CreatedDate: CreatedDate,
        Edit: <i className="fa fa-edit" onClick={() => handleEdit(row)}></i>,
      };
    });
  };

  const handleMRDSaveNewRoom = async () => {
    try {
      const response = await MRDSaveNewRoom({
        ...payload,
        ipAddress: String(ip),
      });
      notify(response?.message, response?.success ? "success" : "error");
      if (response?.success) {
        handleMRDBindRoom();
        setPayload({
          roomName: "",
          savetype: "Save",
          isActive: "1",
          roomID: "",
        });
      }
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleReactChange = (name, e) => {
    setPayload({
      ...payload,
      [name]: e?.value,
    });
  };

  useEffect(() => {
    handleMRDBindRoom();
  }, []);
  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Create Room")} isBreadcrumb={false} />
          <div className="row p-2">
            <Input
              type="text"
              className="form-control required-fields"
              id="roomName"
              lable={t("Room")}
              placeholder=" "
              required={true}
              value={payload?.roomName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="roomName"
              onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t("IsActive")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"isActive"}
              name={"isActive"}
              removeIsClearable={true}
              handleChange={handleReactChange}
              dynamicOptions={IS_ACTIVE_OPTION}
              value={payload?.isActive}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleMRDSaveNewRoom}
              >
                {payload?.roomID ? t("Update"): t("Save")}
              </button>
            </div>
          </div>
          <div className="row p-2">
            <div className="col-12">
              <Tables thead={THEAD} tbody={handleTableData(tableData?.length ? tableData : [])} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MRDRoomCreate;
