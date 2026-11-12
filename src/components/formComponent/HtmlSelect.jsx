import React from "react";

function HtmlSelect({
  option,
  name,
  onChange,
  value,
  isDisable,
  className,
  placeHolder,
}) {
  return (
    <select
      name={name}
      onChange={onChange}
      value={value}
      disabled={isDisable}
      className={className}
    >
      <option hidden>{placeHolder}</option>
      {option?.map((data, index) => (
        <option key={index} value={data?.value}>
          {data?.label}
        </option>
      ))}
    </select>
  );
}

export default HtmlSelect;
