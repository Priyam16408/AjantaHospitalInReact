import React from "react";
import TimePicker from "../formComponent/TimePicker";

const ReportTimePicker = ({
  placeholderName,
  respclass,
  lable,
  name,
  id,
  values,
  setValues,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <TimePicker
      placeholderName={placeholderName}
      respclass={respclass}
      lable={lable}
      id={id}
      name={name}
      value={values[name]}
      handleChange={handleChange}
    />
  );
};

export default ReportTimePicker;
