import React, { useEffect, useState } from "react";
import ReactSelect from "../../formComponent/ReactSelect";
import Heading from "../../UI/Heading";
import { bindPanelByPatientID } from "../../../networkServices/opdserviceAPI";
import { handleReactSelectDropDownOptions, notify } from "../../../utils/utils";
import LabeledInput from "../../formComponent/LabeledInput";
import { UpdatePanelEMGAPI } from "../../../networkServices/Emergency";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";

const TariffChange = ({ data ,setVisible}) => {


  
  const [panelList, setPanelList] = useState([])
  const [value, setValue] = useState({})
  const {t}= useTranslation()
  const getPatientPanelList = async () => {
    let apiResp = await bindPanelByPatientID(data?.PatientID);
    if (apiResp?.data) {
      setPanelList(handleReactSelectDropDownOptions(apiResp?.data, "PanelName", "PanelID"))
    }
  }
  let userData = useLocalStorage("userData","get")

  useEffect(() => {
    getPatientPanelList()
  }, [])
                                 
  const updatePanel = async() => {
    let payload = {
      "panelID": String(value?.value),
      "currentPanelID": String(data?.PatientID),
      "transactionID": String(data?.TID),
      "userID": String(userData?.employeeID)
    }
    const apiResp = await UpdatePanelEMGAPI(payload)
    if(apiResp?.data){
      notify(apiResp?.message,"success")
      setValue({})
      setVisible()
    }else{
      notify(apiResp?.message,"error")
    }

  }

  return (
    <div className="card">
      <Heading title={t("Tariff Change")} />
      <div className="row p-2">
        <div className="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12">
          <LabeledInput
            label={t("CurrentPanel")}
            value={data?.Panel}
          />
        </div>
        <ReactSelect
          placeholderName={t("Panel")}
          id={"panel"}
          searchable={true}
          respclass="col-xl-2 col-md-4 col-sm-4 col-sm-4 col-12"
          name="panel"
        dynamicOptions={panelList}
        value={value?.value}
        handleChange={(name,value)=>{setValue(value)}}
        />

        <div className="col-sm-2">
          <button className="btn btn-sm btn-success" onClick={updatePanel}>
            {t("UpdatePanel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TariffChange;
