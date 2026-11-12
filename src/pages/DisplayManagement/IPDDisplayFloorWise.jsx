import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading"; 
import { DisplayFloorName, DisplayWardData } from "../../networkServices/DisplayManagement";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { handleReactSelectDropDownOptions } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
function IPDDisplayFloorWise() {
  const [t] = useTranslation();
  const navigate = useNavigate()

  const [FloorName, setFloorName] = useState([]); 
  
  const [values, setValues] = useState({
    floorName: "",
  });

  const handleSelect = (name, value) => {
    setValues((val) => ({ ...val, [name]: value }));
  };

  const handleFloorName = async () => {
    try {
      const response = await DisplayFloorName();
      console.log("the response in ",response);
      if (response.success) {
        setFloorName(response.data);
      } else {
        console.error(
          "API returned success as false or invalid response:",
          response
        );
        setFloorName([]);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
      setFloorName([]);
    }
  };

  
    const handleDisplayWardData = async () => {  
        let WardID = String(values?.floorName.NAME);
        navigate("/screen-set", { state: { WardID: WardID } }) 
      }; 

  useEffect(() => {
    handleFloorName(); 
  }, []);

  console.log("the values is",values);
  return (
    <>
      <div className="m-2 spatient_registration_card card">
        <Heading
          title={t("")}
          isBreadcrumb={true}
        />

         <div className="row row-cols-lg-5 row-cols-md-2 row-cols-1 p-2">
 
          <ReactSelect
            placeholderName={t("Floor Name")}
            id={"floorName"}
            searchable={true}
            removeIsClearable={true}
            respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
            dynamicOptions={[
              ...handleReactSelectDropDownOptions(FloorName, "NAME"),
            ]}
            handleChange={handleSelect}
            value={`${values?.floorName?.NAME}`}
            name={"floorName"}
          />
          <div className="col-sm-2 col-xl-1">
            <button
              className="btn btn-sm btn-success"
              type="button"
                onClick={handleDisplayWardData}
            >
              {t("Display")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default IPDDisplayFloorWise;
