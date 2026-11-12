import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import ReportsMultiSelect from "../../components/ReportCommonComponents/ReportsMultiSelect";
import Input from "../../components/formComponent/Input";
import { BindRoom, BindRoomdata, displayRoom } from "../../networkServices/DisplayManagement";
import { notify } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
function DiagnosticWiseTokenDisplay() {
  const [t] = useTranslation();

  const [bindRoom, setBindRoom] = useState([]);

  const [displaysRoom, setDisplaysRoom] = useState([]);

   
     const navigate = useNavigate()

  const [values, setValues] = useState({ 
    room:"",
   });

   const handlePayloadMultiSelect = (data) => { 
    if (!Array.isArray(data)) { 
        return []; 
    }

    return data.map((item) => (item?.name)); 
};
console.log("the data is in handlePayloadmultiselect",handlePayloadMultiSelect())
  console.log("values data",values.room.name); 
  const handleBindRoom = async () => {
    try {
      const response = await BindRoom();
      if (response.success) {
        setBindRoom(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setBindRoom([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setBindRoom([]);
    }
  };

  // BindRoomdata


  const handledisplayRoomdata = async () => {
    let payload = {
      "roomname":handlePayloadMultiSelect(values.room)
    }

    
    navigate("/tokendisplay-screen", { state: { payload: payload.roomname } }) 
    
  };  
  useEffect(() => {
    handleBindRoom();  
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
            placeholderName={t("Room")}
            respclass="col-xl-2 col-md-4 col-sm-6 col-12"
            values={values}
            setValues={setValues}
            dynamicOptions={bindRoom}
            labelKey="roomname"
            valueKey="id"
            requiredClassName={true}
          />
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
                onClick={handledisplayRoomdata}
            >
              {t("Display")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DiagnosticWiseTokenDisplay;
