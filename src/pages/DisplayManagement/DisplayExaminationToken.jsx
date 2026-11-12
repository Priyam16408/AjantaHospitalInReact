  
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BindRoomdata } from "../../networkServices/DisplayManagement";
import { notify } from "../../utils/utils";
import "./tokenStyle.css";

const DisplayExaminationToken = () => {
  const location = useLocation();
  const [displaydata, setDisplaysdata] = useState([]); 
console.log(location.state,"the state data is "); 

    const handledisplayRoomdata = async () => {
      let payload = {
        "roomname":location.state.payload
      }
      let apiResp = await BindRoomdata(payload);
      console.log("API Response:", apiResp);
  
      if (apiResp?.success) {
        setDisplaysdata(apiResp.data);
        notify("fetch SuccessFully","success")

      } else {
        console.log(apiResp?.message);
        notify("some error occur","error")
        
      }
    }; 
  

    useEffect(()=>{
        handledisplayRoomdata();
    },[]);

  return (
    <div className="containerwrap"> 
      <table className="table">
        <thead>
          <tr>
            <th>COUNTER NO</th>
            <th>PATIENT NAME</th>
            <th>TOKEN NO</th> 
          </tr>
        </thead>
        <tbody>
          {displaydata.map((items, index) => (
            <tr key={index}>
              <td>{items.CounterNo}</td>
              <td>{items.PatientName}</td>
              <td>{items.TokenNo}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayExaminationToken;
