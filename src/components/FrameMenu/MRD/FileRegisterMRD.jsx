import React, { useEffect, useState } from "react";
import FileRegisterFirstCom from "./FileRegisterFirstCom";
import FileRegisterSecondCom from "./FileRegisterSecondCom";
import SetLocation from "./SetLocation";

const FileRegisterMRD = ({ data }) => {

  const [patientDetail, setPatientDetail] = useState(data)
  useEffect(() => {
    // console.log("asdasdasd", patientDetail)
  }, [patientDetail])
  return (
    <>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-8 col-12">
          <FileRegisterFirstCom data={patientDetail} setPatientDetail={setPatientDetail} />
        </div>
        <div className="col-xl-6 col-lg-6 col-md-4 col-12">
          <FileRegisterSecondCom data={patientDetail} setPatientDetail={setPatientDetail} />
          <SetLocation data={patientDetail} setPatientDetail={setPatientDetail} />
        </div>
      </div>
    </>
  );
};

export default FileRegisterMRD;
