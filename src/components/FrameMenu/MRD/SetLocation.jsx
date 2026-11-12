import React, { useEffect, useState } from "react";
import Heading from "../../UI/Heading";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../formComponent/ReactSelect";
import TextAreaInput from "../../formComponent/TextAreaInput";
import {
  MRDBindAlmirah,
  MRDBindRoomCMB,
  MRDBindShelf,
  MRDSetLocation,
  MRDSetLocationSave,
} from "../../../networkServices/MRDApi";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";

const SetLocation = ({ data }) => {
  const [t] = useTranslation();

  const [payloadData, setPayloadData] = useState({
    RoomID: "",
    AlmID: "",
    ShelfID: "",
    Remarks: "",
  });

  const [dropDownState, setDropDownState] = useState({
    MRDBindRoomCMB: [],
    MRDBindAlmirah: [],
    MRDBindShelf: [],
  });
 

  const handleMRDBindRoomCMB = async () => {
    try {
      const response = await MRDBindRoomCMB();
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindAlmirah = async (RmID) => {
    try {
      const response = await MRDBindAlmirah(RmID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleMRDBindShelf = async (AlmID) => {
    try {
      const response = await MRDBindShelf(AlmID);
      return response?.data;
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

 
  const handleMRDSetLocation = async (TID) => {
    try {
      const response = await MRDSetLocation(TID);
      if (response?.data?.length > 0) {
        const { RmID, AlmID, Narration,ShelfNo,FileID } = response?.data[0];
        fetchDropDown(RmID, AlmID);

        setPayloadData({
          RoomID: String(RmID),
          AlmID: String(AlmID),
          FileID: String(FileID),
          ShelfID: String(ShelfNo+"$0"),
          Remarks: Narration,
          ...response?.data[0],
        });

        return;
      }

      fetchDropDown(payloadData?.RoomID, payloadData?.AlmID);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDropDown = async (RmID, AlmID) => {

    try {
      const [MRDBindRoomCMB, MRDBindAlmirah, MRDBindShelf] = await Promise.all([
        dropDownState?.MRDBindRoomCMB?.length === 0 && handleMRDBindRoomCMB(),
        RmID && handleMRDBindAlmirah(RmID),
        AlmID && handleMRDBindShelf(AlmID),
      ]);

      setDropDownState({
        MRDBindRoomCMB: [
          ...(MRDBindRoomCMB
            ? handleReactSelectDropDownOptions(MRDBindRoomCMB, "NAME", "RmID")
            : dropDownState?.MRDBindRoomCMB),
        ],
        MRDBindAlmirah: [
          ...(MRDBindAlmirah
            ? handleReactSelectDropDownOptions(MRDBindAlmirah, "Name", "AlmID")
            : []),
        ],

        MRDBindShelf: [
          ...(MRDBindShelf
            ? handleReactSelectDropDownOptions(MRDBindShelf, "ShelfNo", "ID")
            : []),
        ],
      });
    } catch (error) {
      console.log(error, "SomeThing Went Wrong");
    }
  };

  const handleReactChange = (name, e, obj) => {
    obj[name] = e?.value;
    setPayloadData(obj);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayloadData({ ...payloadData, [name]: value });
  };

  useEffect(() => {
    handleMRDSetLocation(data?.transactionID);
  }, [data]);



  const setSaveLocation = async () => {
    let payload={
      // "roomId": "",
      "tid": String(data.transactionID),
      "pid": String(data.patientID),
      "room":  String(payloadData.RoomID),
      "almirah":String(payloadData.AlmID) ,
      "shelf": String(payloadData.ShelfID),
      "fileNo": String(payloadData?.FileID),
      "type": String(data.type),
      "remarks":String(payloadData.Remarks),
      "counter": "",
      "fileId": String(payloadData?.FileID),
      "dataList": {
        "dateOfAdmit": String(data.admitDate),
        "dateOfDischarge": String(data.dischargeDate)
      }
    }
   debugger
    let apiResp = await MRDSetLocationSave(payload)
    notify(apiResp?.message, apiResp?.success ? "success" : "error")
    if (apiResp?.success) {
        setValues({ Room: apiResp?.data?.Room })
    }

}




  return (
    <div>
      <Heading title={t("HardCopy Location")} isBreadcrumb={false} />

      <div className="row mt-1">
        <ReactSelect
          respclass={"col-md-4 col-12"}
          placeholderName={"Room"}
          name="RoomID"
          requiredClassName={"required-fields"}
          dynamicOptions={dropDownState?.MRDBindRoomCMB}
          value={payloadData?.RoomID}
          handleChange={(name, e) =>
            handleReactChange(
              name,
              e,
              {
                ...payloadData,
                AlmID: "",
                ShelfID: "",
              },
              fetchDropDown(e?.value)
            )
          }
        />

        <ReactSelect
          respclass={"col-md-4 col-12"}
          placeholderName={"Rack"}
          dynamicOptions={dropDownState?.MRDBindAlmirah}
          requiredClassName={"required-fields"}
          name={"AlmID"}
          value={payloadData?.AlmID}
          handleChange={(name, e) =>
            handleReactChange(
              name,
              e,
              {
                ...payloadData,
                ShelfID: "",
              },
              fetchDropDown(null, e?.value)
            )
          }
        />
        <ReactSelect
          respclass={"col-md-4 col-12"}
          placeholderName={"Shelf"}
          requiredClassName={"required-fields"}
          name="ShelfID"
          dynamicOptions={dropDownState?.MRDBindShelf}
          value={payloadData?.ShelfID}
          handleChange={(name, e) =>
            handleReactChange(name, e, { ...payloadData })
          }
        />
             
        <TextAreaInput
          respclass={"col-12"}
          lable={"Shelf Remarks"}
          value={payloadData?.Remarks}
          name={"Remarks"}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-end align-items-center">
        <button className="btn btn-sm btn-primary" onClick={setSaveLocation}>Save</button>
      </div>
    </div>
  );
};

export default SetLocation;
