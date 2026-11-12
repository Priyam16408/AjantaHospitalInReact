import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import Input from "../../components/formComponent/Input";
import {  DisplayBindUser, HandlePatientData } from "../../networkServices/DisplayManagement";
import { notify } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
function DoctorWiseTokenDisplay() {
  const [t] = useTranslation(); 
    const navigate = useNavigate() 
  const [binduser, setBindUser] = useState([]);  
  const [displaysRoom, setDisplaysRoom] = useState([]); 
  const [values, setValues] = useState({ 
    room:""
   }); 

  //  const handlePayloadMultiSelect = (data) => {
  //   if (!Array.isArray(data) || data.length === 0) {
  //     return '""';
  //   }
  
  //   return `"${data.map((item) => `'${String(item?.code)}'`).join(",")}"`;
  // };
  

  const handlePayloadMultiSelect = (data) => { 
    if (!Array.isArray(data)) { 
        return []; 
    }

    return data.map((item) => Number(item?.code));
};

  

  
  console.log(values,"values");
 
  const handleBindUser = async () => {
    try {
      const response = await DisplayBindUser();
      if (response.success) {
        setBindUser(response.data);
        console.log("the binduser doctor is",response);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindUser([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindUser([]);
    }
  };
 



    const handledisplayRoom = async () => {
      let payload = 
      {
        "doctorId": handlePayloadMultiSelect(values?.room)
      }  
      navigate("/patientdata-display", { state: { payload: payload } }) 
      
    }; 

  useEffect(() => {
    handleBindUser(); 
  }, []);

  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("/Sample Management/Sample Collection")}
          isBreadcrumb={true}
        />

        <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
    
          <ReportsMultiSelect
            name="room"
            placeholderName="Select Doctors"
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={binduser}
            labelKey="Name"
            valueKey="DoctorID"
            requiredClassName={true}
          />
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
                onClick={handledisplayRoom}
            >
              {t("Display")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorWiseTokenDisplay;
