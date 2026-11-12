import React from "react";
import DatePicker from "../formComponent/DatePicker";
import moment from "moment";

const ReportDatePicker = ({
  className,
  respclass,
  name,
  id,
  values,
  setValues,
  lable,
  max,
  min,
}) => {
  const { VITE_DATE_FORMAT } = import.meta.env;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: moment(value).toDate() });
  };


  const parseDate = (date) => (date ? new Date(date) : null);

  return (
    <DatePicker
      className={className}
      respclass={respclass}
      name={name}
      id={id}
      lable={lable}
      placeholder={VITE_DATE_FORMAT}
      showTime
      hourFormat="12"
      value={values[name]}
      maxDate={parseDate(max)}
      minDate={parseDate(min)}
      handleChange={handleChange}
    />
  );
};

export default ReportDatePicker;
