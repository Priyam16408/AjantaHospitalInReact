import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BindRoomdata } from "../../networkServices/DisplayManagement";
import { notify } from "../../utils/utils";
import "./tokenStyle.css";
import { useTranslation } from "react-i18next";

const DiagnosticwiseTokenDisplayScreen = () => {
  const location = useLocation();
  const [displaydata, setDisplaysdata] = useState([]);
  const [t] = useTranslation()

  const handledisplayRoomdata = async () => {
    let payload = {
      "roomname": location.state.payload
    }
    let apiResp = await BindRoomdata(payload);

    if (apiResp?.success) {
      setDisplaysdata(apiResp.data);
      notify("fetch SuccessFully", "success")

    } else {
      console.log(apiResp?.message);
      notify("some error occur", "error")

    }
  };


  useEffect(() => {
    handledisplayRoomdata();
  }, []);

  return (
    <div className="containerwrap">
      <table className="table">
        <thead>
          <tr>
            <th>{t("Room No.")}</th>
            <th> {t("Patient Name")}</th>
            <th> {t("Token No.")}</th>
          </tr>
        </thead>
        <tbody>
          {displaydata.map((items, index) => (
            <tr key={index}>
              <td>{items.RoomNo}</td>
              <td>{items.PatientName}</td>
              <td>{items.TokenNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiagnosticwiseTokenDisplayScreen;
