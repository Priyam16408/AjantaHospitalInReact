import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Tables from "../../../../UI/customTable/index"
const index = () => {
  const [t] = useTranslation();

  const THEAD = [
    t("helpDesk.CostEstimationRePrint.TableData.SNO"),
    t("helpDesk.CostEstimationRePrint.TableData.UHID"),
    t("helpDesk.CostEstimationRePrint.TableData.PatientName"),
    t("helpDesk.CostEstimationRePrint.TableData.EstimatedAmount"),
    t("helpDesk.CostEstimationRePrint.TableData.ContactNo"),
    t("helpDesk.CostEstimationRePrint.TableData.Address"),
    
  ];
  const [bodyData, setBodyData] = useState([
    {
      "#": 1,

      Shortcuts: "AEXM2425-000001",
      "View Instruction": 1,
      "Is Critical": 1,
      "Triaging Code": 1,
      UHID: 1,
    },
  ]);
  const handleChange = (e, index) => {
    console.log(bodyData);
    const { name, value } = e.target;
    const data = [...bodyData];
    data[index][name] = (
      <input
        value={value}
        onChange={(e) => handleChange(e, index)}
        name="input"
      />
    );
    setBodyData(data);
  };
  return (
    <>
      <Tables thead={THEAD} tbody={bodyData} />
    </>
  )
}

export default index