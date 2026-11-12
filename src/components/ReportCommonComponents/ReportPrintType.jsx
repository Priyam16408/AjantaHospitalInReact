import React from "react";
import ReactSelect from "../formComponent/ReactSelect";
import { print_Type } from "../../utils/constant";

const ReportPrintType = ({
  placeholderName,
  id,
  respclass,
  name,
  values,
  setValues,
}) => {
  const handleReactChange = (name, e) => {
    setValues({ ...values, [name]: e.value });
  };


  return (
    <ReactSelect
      placeholderName={placeholderName}
      id={id}
      respclass={respclass}
      dynamicOptions={print_Type.map((item, index) => {
        return {
          value: item.ID,
          label: item.name,
        };
      })}
      name={name}
      value={values[name]}
      handleChange={handleReactChange}
    />
  );
};

export default ReportPrintType;
