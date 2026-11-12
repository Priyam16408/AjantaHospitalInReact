import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { bindCurrentPatient, HandlePatientData } from "../../networkServices/DisplayManagement";

const PatientDataDisplay = () => {
  const location = useLocation();
  const [displayroomData, setDisplayRoomData] = useState([]);
  
  const [displayPatientdata, setDisplayPatientdata] = useState([]);
  const doctorId = location.state.payload.doctorId;

  const handledisplayRoom = async () => {
    let payload = { doctorId: doctorId };
    let apiResp = await HandlePatientData(payload);
    console.log("API Response:", apiResp);

    if (apiResp?.success) {
      setDisplayRoomData(apiResp.data);
    } else {
      console.log(apiResp?.message);
    }
  };


  const handledisplayCallPatient = async () => {
    let payload = { doctorId: doctorId };
    let apiResp = await bindCurrentPatient(payload);
    console.log("API Response:", apiResp);

    if (apiResp?.success) {
        setDisplayPatientdata(apiResp.data);
    } else {
      console.log(apiResp?.message);
    }
  };

  useEffect(() => {
    handledisplayRoom();
    const interval = setInterval(handledisplayRoom, 5000);  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handledisplayCallPatient();
    const interval = setInterval(handledisplayCallPatient, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#0b468a" }}>
              <th className="thdata">Doctor Name</th>
              <th className="thdata">Room No</th>
              <th className="thdata">Patient Name</th>
              <th className="thdata">Token No</th>
            </tr>
          </thead>
          <tbody>
            {/* Pinning rows with IsCurrent === "1" at the top */}
            {displayPatientdata
              .map((item) => (
                <tr
                  key={item.id}
                  style={{ ...styles.tr, backgroundColor: "lightgreen" }}
                >
                  <td className="tableData">{item.DoctorName}</td>
                  <td className="tableData">{item.RoomNo}</td>
                  <td className="tableData">{item.PName}</td>
                  <td className="tableData">{item.AppNo}</td>
                </tr>
              ))}

            {/* Scrolling rows with IsCurrent === "0" */}
            <tr>
              <td colSpan="3">
                <div className="scrolling-content">
                  {displayroomData
                    .filter((item) => item.IsCurrent === "0")
                    .map((item) => (
                      <div key={item.id} style={styles.scrollingRow}>
                        <table style={{ width: "100%" }}>
                          <tbody>
                            <tr style={styles.tr}>
                              <td className="tableData">{item.DoctorName}</td>
                              <td className="tableData">{item.RoomNo}</td>
                              <td className="tableData">{item.PName}</td>
                              <td className="tableData">{item.AppNo}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.circle, backgroundColor: "lightgreen" }}
          ></div>
          <span style={styles.legendText}>Current Call</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.circle, backgroundColor: "yellow" }}></div>
          <span style={styles.legendText}>Absent</span>
        </div>
      </div>

      {/* CSS for scrolling animation */}
      <style>
        {`
          @keyframes scrollUp {
            from { transform: translateY(100%); }
            to { transform: translateY(-100%); }
          }

          .scrolling-content {
            height: 300px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: scrollUp 10s linear infinite;
          }
        
          .tableData{ 
          font-weight:bold;
          font-size:30px !important;
          
          }

            .thdata{ 
    color: white;
    font-size: 30px !important;
    fontWeight: bold;
    borderBottom: 2px solid white;
    textAlign: left;
    padding: 10px;
  },
        `}
      </style>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    height: "100vh",
    paddingBottom: "20px",
    position: "relative",
  },
  tableWrapper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#f5f5f5",
  },

  td: {
    fontSize: "40px !important",
    fontWeight: "bold",
    padding: "10px",
  },
  tr: {
    transition: "all 0.5s ease-in-out",
  },
  scrollingRow: {
    animation: "scrollUp 10s linear infinite",
  },
  legend: {
    position: "absolute",
    display: "flex",
    bottom: "20px",
    left: "20px",
    gap: "20px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
  },
  circle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  legendText: {
    fontSize: "35px",
    fontWeight: "bolder",
  },
};

export default PatientDataDisplay;
