import React, { useState } from "react";
import Heading from "../../../components/UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../../components/formComponent/ReactSelect";
import {
  MRDBindMRDRack,
  MRDBindRackDetail,
  MRDBindRoom,
  MRDSaveNewRack,
} from "../../../networkServices/MRDApi";
import { useEffect } from "react";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import Input from "../../../components/formComponent/Input";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";

const ACTION = [
  { label: "Add", value: "Save" },
  { label: "Edit", value: "Update" },
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

const MRDRackMaster = () => {
  const [t] = useTranslation();
  const ip = useLocalStorage("ip", "get");
  const [dropDownData, setDropDownState] = useState({
    BindRoom: [],
    BindRack: [],
  });

  const [payload, setPayload] = useState({
    roomID: "",
    rackName: "",
    noOfShelf: "",
    isActive: "1",
    saveType: "Save",
    noOfMaximumfile: "",
    rackID: "",
  });

  const handleMRDBindRoom = async () => {
    try {
      const response = await MRDBindRoom();
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const renderAPI = async () => {
    try {
      const [BindRoom] = await Promise.all([handleMRDBindRoom()]);

      setDropDownState({
        ...dropDownData,
        BindRoom: handleReactSelectDropDownOptions(BindRoom, "NAME", "RMID"),
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindMRDRack = async (roomID) => {
    try {
      const response = await MRDBindMRDRack(roomID);
      setDropDownState({
        ...dropDownData,
        BindRack: handleReactSelectDropDownOptions(
          response?.data,
          "Name",
          "AlmID"
        ),
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindRackDetail = async (RackID) => {
    try {
      const response = await MRDBindRackDetail(RackID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e) => {
    const obj = { ...payload };

    if (name === "rackID") {
    }

    obj[name] = e?.value;
    setPayload(obj);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };


  const handleMRDSaveNewRack = async () => {
    
    try {
      const response = await MRDSaveNewRack({
        ...payload,
        ipAddress: String(ip),
      });
      notify(response?.message, response?.success ? "success" : "error");

      if (response?.success)
        setPayload({
          roomID: "",
          rackName: "",
          noOfShelf: "",
          isActive: "1",
          saveType: "Save",
          noOfMaximumfile: "",
          rackID: "",
        });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  useEffect(() => {
    renderAPI();
  }, []);

  return (
    <>
      <div className="mt-2 spatient_registration_card">
        <div className="patient_registration card">
          <Heading title={t("Rack Master")} isBreadcrumb={false} />
          <div className="row p-2">
            <ReactSelect
              placeholderName={t("Action")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"saveType"}
              name={"saveType"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={ACTION}
              value={payload?.saveType}
            />

            <ReactSelect
              placeholderName={t("MRD Room")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"roomID"}
              name={"roomID"}
              removeIsClearable={true}
              handleChange={(name, e) =>
                handleReactChange(name, e, handleMRDBindMRDRack(e?.value))
              }
              dynamicOptions={dropDownData?.BindRoom}
              value={payload?.roomID}
            />

            <ReactSelect
              placeholderName={t("MRD Rack")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"rackID"}
              name={"rackID"}
              removeIsClearable={true}
              handleChange={(name, e) =>
                handleReactChange(name, e, handleMRDBindRackDetail(e?.value))
              }
              dynamicOptions={dropDownData?.BindRack}
              value={payload?.rackID}
              isDisabled={payload?.saveType === "Save" ? true : false}
            />

            <Input
              type="text"
              className="form-control required-fields"
              id="rackName"
              lable={t("Rack Name")}
              placeholder=" "
              required={true}
              value={payload?.rackName}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="rackName"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control required-fields"
              id="noOfShelf"
              lable={t("No Of Shelf")}
              placeholder=" "
              required={true}
              value={payload?.noOfShelf}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="noOfShelf"
              onChange={handleChange}
            />

            <Input
              type="text"
              className="form-control required-fields"
              id="noOfMaximumfile"
              lable={t("Maximum No of Files Per Shelf")}
              placeholder=" "
              required={true}
              value={payload?.noOfMaximumfile}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              name="noOfMaximumfile"
              onChange={handleChange}
            />

            <ReactSelect
              placeholderName={t("IsActive")}
              searchable={true}
              respclass="col-xl-2 col-md-4 col-sm-6 col-12"
              id={"isActive"}
              name={"isActive"}
              removeIsClearable={true}
              handleChange={(name, e) => handleReactChange(name, e)}
              dynamicOptions={IS_ACTIVE_OPTION}
              value={payload?.isActive}
            />

            <div className="col-xl-2 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleMRDSaveNewRack}
              >
                {payload?.rackID ? t("Update" ) : t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MRDRackMaster;
