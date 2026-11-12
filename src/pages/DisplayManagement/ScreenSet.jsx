import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DisplayWardData } from "../../networkServices/DisplayManagement";
import { notify } from "../../utils/utils";
import "./tokenStyle.css";

const ScreenSet = () => {
  const location = useLocation();
  const [displaydata, setDisplaysdata] = useState([]);
  const { WardID } = location.state || {};

  useEffect(() => {
    const fetchWardData = async () => {
      try {
        const response = await DisplayWardData(WardID);
        if (response.success) {
          setDisplaysdata(response.data);
          notify("Fetch successful", "success");
        } else {
          console.error("API returned success as false or invalid response:", response);
          notify("API returned success as false or invalid response", "error");
          setDisplaysdata([]);
        }
      } catch (error) {
        console.error("Error fetching ward data:", error);
        notify("Error fetching ward data", "error");
        setDisplaysdata([]);
      }
    };

    fetchWardData();
  }, []);

  return (
    <div className="containerwrap"> 
      <table className="table">
        <thead>
          <tr>
            <th>Room No</th>
            <th>UHID</th>
            <th>IPD No</th>
            <th>Patient Name</th>
            <th>Age/Gender</th>
            <th>Doctor</th>
            <th>Room No.</th>
          </tr>
        </thead>
        <tbody>
          {displaydata.map((items, index) => (
            <tr key={index}>
              <td>{items.AdmitDate}</td>
              <td>{items.PatientID}</td>
              <td>{items.IPDNO}</td>
              <td>{items.PName}</td>
              <td>{items.AgeSex}</td>
              <td>{items.DName}</td>
              <td>{items.RoomName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScreenSet;
