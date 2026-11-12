import { useState, useEffect } from "react";
import { EDPUpdateCentre } from "../../../networkServices/EDP/edpApi";

const SelectableBadge = ({ label, onSelect, centres , data , setCurrentCenter}) => {
  // debugger;
  // console.log("firstfirstfirstfirst 01" , centres)
  const centre = centres?.find((c) => c.CentreName === label);
  const isInitiallySelected = centre?.CentreSet === "TRUE";

  const [selected, setSelected] = useState(isInitiallySelected);

  useEffect(() => {
    setSelected(isInitiallySelected); // Update state when prop changes
  }, [isInitiallySelected]);

  const handleChange = async () => {
    const newState = !selected;
    setSelected(newState);
    onSelect(label, newState);
    const selectedCenters = centres?.find((centre) => centre?.CentreName === label)?.CentreID
    // debugger
    const payloadToBe = {
      employeeID: data?.data?.EmployeeID,
      centreID: selectedCenters,
      isChecked: newState,
    };

    // setCurrentCenter((prevCentre) => [...prevCentre , selectedCenters])

    const response = await EDPUpdateCentre(payloadToBe);
    // onSelect(label, newState);
  };

  return (
    <div className="selectable-badge-container">
      <input type="checkbox" checked={selected} onChange={handleChange} />
      <div
        className={`selectable-badge ${selected ? "batch-selected px-4 background-theme-color" : "not-selected"}`}
      >
        <span className="SelectedBadgeSpan">{label}</span>
      </div>
    </div>
  );
};

export default SelectableBadge;
